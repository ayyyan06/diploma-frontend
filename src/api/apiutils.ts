const API_URL = import.meta.env.VITE_API_URL;

const tokenManager = (() => {
  let token: string | null = localStorage.getItem("api_token");

  return {
    getToken: (): string | null => token,

    setToken: (newToken: string): void => {
      token = newToken;
      localStorage.setItem("api_token", newToken);
    },

    clearToken: (): void => {
      token = null;
      localStorage.removeItem("api_token");
    },
  };
})();

export async function fetchWithToken(
  url: string,
  options: RequestInit = {},
  body?: unknown,
): Promise<Response> {
  const token = tokenManager.getToken();

  if (!token) {
    window.location.href = "/auth";
    throw new Error("No token available");
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    tokenManager.clearToken();
    window.location.href = "/auth";
    throw new Error("Session expired, please log in again");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! Status: ${response.status}, Details: ${errorText}`,
    );
  }

  return response;
}

export { API_URL, tokenManager };
