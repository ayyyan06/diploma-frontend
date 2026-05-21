import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../api/apiutils";

const DEFAULT_MENU_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Tests", path: "/tests" },
  { label: "Games", path: "/games" },
  { label: "Community", path: "/community" },
];

export function Header() {
  const [coins, setCoins] = useState<number | null>(null);
  const [incomingCount, setIncomingCount] = useState(0);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const res = await fetchWithToken("/api/v1/coins");
        const data = await res.json();
        setCoins(data.coins);
      } catch {}
    };

    const loadIncoming = async () => {
      try {
        const res = await fetchWithToken(
          "/api/v1/community/friend-requests/incoming",
        );
        const data = await res.json();
        setIncomingCount(data.count ?? 0);
      } catch {}
    };

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "coins:updated") {
        loadCoins();
      }
      if (event.data?.type === "friendRequests:updated") {
        loadIncoming();
      }
    };

    loadCoins();
    loadIncoming();

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <>
      <header className="mt-8 box-border flex items-center justify-between gap-6 px-[60px] font-sans max-[1100px]:flex-wrap max-[1100px]:justify-center max-[680px]:px-5">
        {/* LOGO */}
        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-4 p-0">
          <img
            className="h-[56px] w-[56px] rounded-full object-cover"
            src="/images/logo.jpg"
            alt="Ruh Compass logo"
          />

          <div className="flex flex-col leading-none">
            <span className="text-[28px] font-black tracking-wide text-[#2b2b2b]">
              Ruh Compass
            </span>

            <span className="mt-1 text-[12px] font-medium uppercase tracking-[4px] text-[#9a6e00]">
              Discover Yourself
            </span>
          </div>
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
              {item.label === "Community" ? (
                <span className="relative">
                  Community
                  {incomingCount > 0 && (
                    <span className="absolute -right-4 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                      {incomingCount}
                    </span>
                  )}
                </span>
              ) : (
                item.label
              )}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-[18px] max-[680px]:w-full max-[680px]:flex-wrap max-[680px]:justify-center">
          {/* COIN BALANCE */}
          {coins !== null && (
            <div
              className="flex h-[44px] min-w-[130px] items-center justify-center gap-[8px]
              rounded-[12px] border-[3px] border-[#f2c200]
              bg-[#fff8d9] px-[18px] py-[10px]
              text-[16px] font-bold text-[#9a6e00]
              select-none"
            >
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
