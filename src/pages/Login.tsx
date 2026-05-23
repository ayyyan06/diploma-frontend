import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authService";

const API_URL = import.meta.env.VITE_API_URL;

export const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await login({ email, password });
        navigate("/");
      } else {
        const res = await fetch(`${API_URL}/api/v1/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: loginName,
            nickname: nickName,
            password,
            email,
          }),
        });

        if (res.ok) {
          setMode("login");
          // Можно добавить уведомление об успехе
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f6f0] pt-20 pb-12">
      <div className="w-full max-w-[480px] px-6">
        {/* Card */}
        <div
          className="
            border-2 border-[#ece7dd] rounded-[28px] bg-white
            shadow-[0_8px_24px_rgba(24,24,24,0.06)]
            px-10 py-12
          "
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[32px] font-bold text-[#111111] mb-2">
              {mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}
            </h1>
            <p className="text-[#7a7a7a] text-[17px]">
              {mode === "login"
                ? "Войдите в свой аккаунт"
                : "Заполните данные для регистрации"}
            </p>
          </div>

          {/* Mode Switch */}
          <div className="flex rounded-[16px] border border-[#e4e4e4] p-1 mb-10">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 rounded-[14px] text-[16px] font-medium transition-all ${
                mode === "login"
                  ? "bg-[#f2c200] text-[#111] shadow-sm"
                  : "text-[#555] hover:bg-[#f8f6f0]"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-3 rounded-[14px] text-[16px] font-medium transition-all ${
                mode === "register"
                  ? "bg-[#f2c200] text-[#111] shadow-sm"
                  : "text-[#555] hover:bg-[#f8f6f0]"
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-[14px] font-medium text-[#555] mb-2">
                    Логин
                  </label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    required
                    className="w-full border-2 border-[#e4e4e4] focus:border-[#f2c200] rounded-[16px] px-5 py-4 text-[17px] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#555] mb-2">
                    Никнейм
                  </label>
                  <input
                    type="text"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    required
                    className="w-full border-2 border-[#e4e4e4] focus:border-[#f2c200] rounded-[16px] px-5 py-4 text-[17px] outline-none transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[14px] font-medium text-[#555] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-[#e4e4e4] focus:border-[#f2c200] rounded-[16px] px-5 py-4 text-[17px] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#555] mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-[#e4e4e4] focus:border-[#f2c200] rounded-[16px] px-5 py-4 text-[17px] outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full h-[58px] mt-4 rounded-[16px] text-[17px] font-bold
                transition-all duration-200
                ${
                  loading
                    ? "bg-[#e4e4e4] text-[#888] cursor-not-allowed"
                    : "bg-[#f2c200] hover:opacity-90 text-[#111]"
                }
              `}
            >
              {loading
                ? "Загрузка..."
                : mode === "login"
                  ? "Войти"
                  : "Зарегистрироваться"}
            </button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-[14px] text-[#7a7a7a] mt-8">
            {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#f2b705] font-medium hover:underline"
            >
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};
