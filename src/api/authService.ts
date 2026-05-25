import { API_URL, tokenManager } from "./apiutils";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  nickname: string;
  email: string;
  password: string;
};

export async function login(body: LoginPayload) {
  const res = await fetch(`${API_URL}/api/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Incorrect email or password");
  }

  const data = await res.json();
  tokenManager.setToken(data.access_token);
  return data;
}

export async function register(body: RegisterPayload) {
  const res = await fetch(`${API_URL}/api/v1/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Registration failed");
  }

  return res.json();
}

export function logout() {
  tokenManager.clearToken();
}
