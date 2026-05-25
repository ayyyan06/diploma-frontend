import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/authService";

export const Auth = () => {
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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f6f0] pt-20 pb-12">
      <div className="w-full max-w-[480px] px-6">
        <div
          className="
            border-2 border-[#ece7dd] rounded-[28px] bg-white
            shadow-[0_8px_24px_rgba(24,24,24,0.06)]
            px-10 py-12
          "
        >
          <div className="text-center mb-10">
            <h1 className="text-[32px] font-bold text-[#111111] mb-2">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-[#7a7a7a] text-[17px]">
              {mode === "login"
                ? "Sign in to continue"
                : "Fill in your details to register"}
            </p>
          </div>

          <div className="flex rounded-[16px] border border-[#e4e4e4] p-1 mb-10">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 rounded-[14px] text-[16px] font-medium transition-all ${
                mode === "login"
                  ? "bg-[#f2c200] text-[#111] shadow-sm"
                  : "text-[#555] hover:bg-[#f8f6f0]"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-3 rounded-[14px] text-[16px] font-medium transition-all ${
                mode === "register"
                  ? "bg-[#f2c200] text-[#111] shadow-sm"
                  : "text-[#555] hover:bg-[#f8f6f0]"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-[14px] font-medium text-[#555] mb-2">
                    Username
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
                    Nickname
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
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-[#e4e4e4] focus:border-[#f2c200] rounded-[16px] px-5 py-4 text-[17px] outline-none transition-all"
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
                ? "Loading..."
                : mode === "login"
                  ? "Sign in"
                  : "Register"}
            </button>
          </form>

          <p className="text-center text-[14px] text-[#7a7a7a] mt-8">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#f2b705] font-medium hover:underline"
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};
