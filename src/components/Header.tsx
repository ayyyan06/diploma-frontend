import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../api/apiutils";

const DEFAULT_MENU_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Tests", path: "/tests" },
  { label: "Games", path: "/games" },
];

export function Header() {
  const [coins, setCoins] = useState<number | null>(null);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const res = await fetchWithToken("/api/v1/coins");
        const data = await res.json();
        setCoins(data.coins);
      } catch {}
    };

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "coins:updated") {
        loadCoins();
      }
    };

    loadCoins();

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <>
      <header className="mt-8 box-border flex items-center justify-between gap-6 px-[60px] font-sans max-[1100px]:flex-wrap max-[1100px]:justify-center max-[680px]:px-5">
        {/* LOGO */}
        <NavLink to="/" className="p-0">
          <img
            className="block w-full max-w-[236px]"
            src="/icons/logo.svg"
            alt="Ruh Compass logo"
          />
        </NavLink>

        {/* MENU */}
        <nav
          className="flex flex-1 items-center justify-center gap-[54px]
          max-[1100px]:order-3 max-[1100px]:basis-full
          max-[680px]:flex-wrap max-[680px]:gap-5"
        >
          {DEFAULT_MENU_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `relative text-[20px] font-medium transition-colors
                hover:text-[#8b6c00]
                ${
                  isActive
                    ? "after:absolute after:left-0 after:bottom-[-10px] after:h-[3px] after:w-full after:rounded-full after:bg-[#f2c200] after:content-['']"
                    : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-[18px] max-[680px]:w-full max-[680px]:flex-wrap max-[680px]:justify-center">
          {/* COIN BALANCE — показываем только если авторизован */}
          {coins !== null && (
            <div
              className="flex h-[44px] min-w-[130px] items-center justify-center gap-[8px]
              rounded-[12px] border-[3px] border-[#f2c200]
              bg-[#fff8d9] px-[18px] py-[10px]
              text-[16px] font-bold text-[#9a6e00]
              select-none"
            >
              {/* монета */}
              <span
                className="flex h-[20px] w-[20px] shrink-0 items-center justify-center
                rounded-full bg-[#f2c200] shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]
                text-[11px] font-black text-white"
              >
                ✦
              </span>
              <span>{coins.toLocaleString()}</span>
            </div>
          )}

          <NavLink
            to="/auth"
            className="flex h-[44px] w-[130px] items-center justify-center
              rounded-[12px] border-[3px] border-[#f2c200]
              text-[16px] font-semibold text-[#f2c200]
              transition-opacity hover:opacity-80"
          >
            Sign in
          </NavLink>

          <NavLink
            to="/tests"
            className="flex h-[44px] w-[130px] items-center justify-center
            rounded-[12px] bg-[#f2c200]
            text-[16px] font-semibold text-white
            transition-opacity hover:opacity-90"
          >
            Start Test
          </NavLink>

          <NavLink to="/profile">
            <img
              className="ml-[56px] h-[36px] w-[36px] shrink-0 object-contain"
              src="/icons/profile-icon.svg"
              alt="Profile"
            />
          </NavLink>
        </div>
      </header>

      <Outlet />
    </>
  );
}
