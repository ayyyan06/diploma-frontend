import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login, register } from "../api/authService";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login({ email, password });
        navigate("/");
      } else {
        await register({
          username: loginName,
          nickname: nickName,
          password,
          email,
        });
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.somethingWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0] pb-12 pt-20">
      <div className="w-full max-w-[480px] px-6">
        <div className="rounded-[28px] border-2 border-[#ece7dd] bg-white px-10 py-12 shadow-[0_8px_24px_rgba(24,24,24,0.06)]">
          <div className="mb-8 flex justify-end">
            <LanguageSwitcher />
          </div>

          <div className="mb-10 text-center">
            <h1 className="mb-2 text-[32px] font-bold text-[#111111]">
              {mode === "login"
                ? t("auth.welcomeBack")
                : t("auth.createAccount")}
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              {mode === "login"
                ? t("auth.signInToContinue")
                : t("auth.fillDetails")}
            </p>
          </div>

          <div className="mb-10 flex rounded-[16px] border border-[#e4e4e4] p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-[14px] py-3 text-[16px] font-medium transition-all ${
                mode === "login"
                  ? "bg-[#f2c200] text-[#111] shadow-sm"
                  : "text-[#555] hover:bg-[#f8f6f0]"
              }`}
            >
              {t("auth.signIn")}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-[14px] py-3 text-[16px] font-medium transition-all ${
                mode === "register"
                  ? "bg-[#f2c200] text-[#111] shadow-sm"
                  : "text-[#555] hover:bg-[#f8f6f0]"
              }`}
            >
              {t("auth.register")}
            </button>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {mode === "register" && (
              <>
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#555]">
                    {t("auth.username")}
                  </label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    required
                    className="w-full rounded-[16px] border-2 border-[#e4e4e4] px-5 py-4 text-[17px] outline-none transition-all focus:border-[#f2c200]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#555]">
                    {t("auth.nickname")}
                  </label>
                  <input
                    type="text"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    required
                    className="w-full rounded-[16px] border-2 border-[#e4e4e4] px-5 py-4 text-[17px] outline-none transition-all focus:border-[#f2c200]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#555]">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[16px] border-2 border-[#e4e4e4] px-5 py-4 text-[17px] outline-none transition-all focus:border-[#f2c200]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#555]">
                {t("auth.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-[16px] border-2 border-[#e4e4e4] px-5 py-4 text-[17px] outline-none transition-all focus:border-[#f2c200]"
              />
            </div>

            {error ? (
              <div className="rounded-[16px] border border-[#f3b1b1] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#b42318]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 h-[58px] w-full rounded-[16px] text-[17px] font-bold transition-all duration-200 ${
                loading
                  ? "cursor-not-allowed bg-[#e4e4e4] text-[#888]"
                  : "bg-[#f2c200] text-[#111] hover:opacity-90"
              }`}
            >
              {loading
                ? t("auth.loading")
                : mode === "login"
                  ? t("auth.signIn")
                  : t("auth.register")}
            </button>
          </form>

          <p className="mt-8 text-center text-[14px] text-[#7a7a7a]">
            {mode === "login"
              ? `${t("auth.noAccount")} `
              : `${t("auth.haveAccount")} `}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-medium text-[#f2b705] hover:underline"
            >
              {mode === "login" ? t("auth.register") : t("auth.signIn")}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};
