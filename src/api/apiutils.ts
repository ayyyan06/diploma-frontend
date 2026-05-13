// src/api/apiutils.ts

import { useNavigate } from "react-router-dom";

type TokenResponse = {
  token: string;
  refreshToken: string;
};

type RefreshResolve = (token: string) => void;
let navigateFunction: ((path: string) => void) | null = null;
const tokenManager = (() => {
  let token: string | null = localStorage.getItem("api_token");
  let refreshToken: string | null = localStorage.getItem("refresh_token");
  let isRefreshing = false;
  let refreshQueue: RefreshResolve[] = [];

  const initializeTokens = (): void => {
    if (!token || !refreshToken) {
      console.log("okokok");
      console.warn("Tokens not found, need to log in again.");
      return;
    }
  };

  const refreshTokenFunction = async (
    currentToken: string,
    currentRefreshToken: string
  ): Promise<TokenResponse> => {
    const url = "/api/users/token/refresh";
    const body = { token: currentToken, refreshToken: currentRefreshToken };
    console.log("Attempting to refresh token with:", body);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      window.location.href = "/login";

      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorText}`
      );
    }

    return response.json();
  };

  return {
    initializeTokens,
    getToken: (): string | null => token,
    getRefreshToken: (): string | null => refreshToken,
    setTokens: (newToken: string, newRefreshToken: string): void => {
      token = newToken;
      refreshToken = newRefreshToken;
      localStorage.setItem("api_token", newToken);
      localStorage.setItem("refresh_token", newRefreshToken);
    },
    refreshTokens: async (): Promise<string> => {
      if (isRefreshing) {
        return new Promise((resolve) => refreshQueue.push(resolve));
      }
      isRefreshing = true;

      try {
        if (!token || !refreshToken) {
          throw new Error("Missing tokens");
        }
        const newTokens = await refreshTokenFunction(token, refreshToken);
        tokenManager.setTokens(newTokens.token, newTokens.refreshToken);
        refreshQueue.forEach((resolve) => resolve(newTokens.token));
        return newTokens.token;
      } finally {
        isRefreshing = false;
        refreshQueue = [];
      }
    },
  };
})();

export async function fetchWithToken(
  url: string,
  options: RequestInit = {},
  body?: any
): Promise<Response> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${tokenManager.getToken()}`,
    "Content-Type": "application/json",
  };

  const executeRequest = async (): Promise<Response> => {
    const finalOptions: RequestInit = {
      ...options,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorText}`
      );
    }
    return response;
  };

  try {
    return await executeRequest();
  } catch (error) {
    if (error instanceof Error && error.message.includes("Status: 401")) {
      console.warn("Token expired, trying to refresh...");
      try {
        const newToken = await tokenManager.refreshTokens();
        headers["Authorization"] = `Bearer ${newToken}`;
        return await executeRequest();
      } catch (refreshError) {
        window.location.href = "/login";
        if (refreshError instanceof Error) {
          throw new Error(`Failed to refresh token: ${refreshError.message}`);
        }
        throw refreshError;
      }
    }
    throw error;
  }
}

// tokenManager.initializeTokens();
export { tokenManager };
