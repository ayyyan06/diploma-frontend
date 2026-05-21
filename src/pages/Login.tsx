import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { login } from "../api/authService";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");

  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        await login({ email: email, password });
        navigate("/");
      } else {
        // 👉 тут твой register endpoint
        await fetch("http://localhost:8000/api/v1/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loginName,
            nickname: nickName,
            password,
            email,
          }),
        });

        // после регистрации можно сразу логинить или переключать
        setMode("login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center pt-20">
      <h1 className="mb-4 text-xl font-bold">
        {mode === "login" ? "Авторизация" : "Регистрация"}
      </h1>

      {/* SWITCH */}
      <div className="mb-4 flex gap-4">
        <button
          className={mode === "login" ? "font-bold" : ""}
          onClick={() => setMode("login")}
        >
          Вход
        </button>
        <button
          className={mode === "register" ? "font-bold" : ""}
          onClick={() => setMode("register")}
        >
          Регистрация
        </button>
      </div>

      {/* FORM */}
      <form
        className="flex w-[300px] flex-col space-y-4 gap-4"
        onSubmit={submit}
      >
        {mode === "register" && (
          <TextField
            label="Логин"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
        )}

        {mode === "register" && (
          <TextField
            label="Никнеймы"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
        )}

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="contained">
          {mode === "login" ? "Войти" : "Зарегистрироваться"}
        </Button>
      </form>
    </div>
  );
};
