import { tokenManager } from "./apiutils";
const API_URL = import.meta.env.VITE_API_URL;

export async function login(body: any) {
  const res = await fetch(`${API_URL}/api/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Неверный логин или пароль");
  }

  // authService.ts
  const data = await res.json();
  tokenManager.setTokens(data.access_token, data.refreshToken); // ← исправить поле
  return data;
}

export function logout() {
  tokenManager.setTokens("", "");
  localStorage.removeItem("api_token");
  localStorage.removeItem("refresh_token");
}
