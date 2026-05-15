import { tokenManager } from "./apiutils";

export async function login(body: any) {
  const res = await fetch(
    "https://diploma-back-a49a574c3cdb.herokuapp.com/api/v1/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    throw new Error("Неверный логин или пароль");
  }

  const data = await res.json();
  tokenManager.setTokens(data.accessToken, data.refreshToken);

  return data;
}

export function logout() {
  tokenManager.setTokens("", "");
  localStorage.removeItem("api_token");
  localStorage.removeItem("refresh_token");
}
