import { NavLink, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

const DEFAULT_MENU_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Tests", path: "/tests" },
  { label: "Games", path: "/games" },
];

export function Header() {
  //   const { isAuthenticated, coinBalance } = useAuth();

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
          {/* {isAuthenticated ? (
            <button
              type="button"
              className="flex h-[44px] min-w-[130px] items-center justify-center gap-[10px]
              rounded-[12px] border-[3px] border-[#f2c200]
              bg-[#fff8d9] px-[18px] py-[10px]
              text-[16px] font-bold text-[#9a6e00]"
            >
              <span className="h-[14px] w-[14px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff7b0_0%,#f2c200_70%)]" />
              {coinBalance} coins
            </button>
          ) : (
            <NavLink
              to="/auth"
              className="flex h-[44px] w-[130px] items-center justify-center
              rounded-[12px] border-[3px] border-[#f2c200]
              text-[16px] font-semibold text-[#f2c200]
              transition-opacity hover:opacity-80"
            >
              Sign in
            </NavLink>
          )} */}
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

          <img
            className="ml-[56px] h-[36px] w-[36px] shrink-0 object-contain"
            src="/icons/profile-icon.svg"
            alt="Profile"
          />
        </div>
      </header>

      <Outlet />
    </>
  );
}
