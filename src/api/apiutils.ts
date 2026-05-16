type TokenResponse = {
  access_token: string; // ← snake_case как у сервера
  refresh_token: string; // ← уточни точное имя у бэка
};

type RefreshResolve = (token: string) => void;

const tokenManager = (() => {
  let token: string | null = localStorage.getItem("api_token");
  let refreshToken: string | null = localStorage.getItem("refresh_token");
  let isRefreshing = false;
  let refreshQueue: RefreshResolve[] = [];

  const refreshTokenFunction = async (
    currentToken: string,
    currentRefreshToken: string,
  ): Promise<TokenResponse> => {
    const response = await fetch("/api/v1/token/refresh", {
      // ← правильный URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: currentToken, // ← формат как ждёт сервер
        refresh_token: currentRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    return response.json();
  };

  return {
    getToken: (): string | null => token,
    getRefreshToken: (): string | null => refreshToken,

    setTokens: (newToken: string, newRefreshToken: string): void => {
      token = newToken;
      refreshToken = newRefreshToken;
      localStorage.setItem("api_token", newToken);
      localStorage.setItem("refresh_token", newRefreshToken);
    },

    clearTokens: (): void => {
      token = null;
      refreshToken = null;
      localStorage.removeItem("api_token");
      localStorage.removeItem("refresh_token");
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
        // ← читаем snake_case поля
        tokenManager.setTokens(newTokens.access_token, newTokens.refresh_token);
        refreshQueue.forEach((resolve) => resolve(newTokens.access_token));
        return newTokens.access_token;
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
  body?: any,
): Promise<Response> {
  // ← guard: нет токена — не делаем запрос
  if (!tokenManager.getToken()) {
    window.location.href = "/auth";
    throw new Error("No token available");
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${tokenManager.getToken()}`,
    "Content-Type": "application/json",
  };

  const executeRequest = async (): Promise<Response> => {
    const response = await fetch(url, {
      ...options,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorText}`,
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
      } catch {
        // ← раскомментировано: чистим токены и редиректим
        tokenManager.clearTokens();
        window.location.href = "/auth";
        throw new Error("Session expired, please log in again");
      }
    }
    throw error;
  }
}

export { tokenManager };
