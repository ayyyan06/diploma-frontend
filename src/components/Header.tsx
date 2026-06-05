import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchWithToken } from "../api/apiutils";
import { AltynAdamDialog } from "./AltynAdamDialog";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { registerDailyVisit } from "../utils/altynAdamProgress";
import { applyPendingStandardTestCharges } from "../utils/standardTestPendingCharges";

interface HeaderLocationState {
  showAltynAdamWelcome?: boolean;
}

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [coins, setCoins] = useState<number | null>(null);
  const [incomingCount, setIncomingCount] = useState(0);
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);

  const menuItems = [
    { label: t("header.nav.home"), path: "/" },
    { label: t("header.nav.tests"), path: "/tests" },
    { label: t("header.nav.games"), path: "/games" },
    { label: t("header.nav.community"), path: "/community" },
    { label: t("header.nav.chat"), path: "/chat" },
  ];

  useEffect(() => {
    registerDailyVisit();

    const loadCoins = async () => {
      try {
        const response = await fetchWithToken("/api/v1/coins");
        const data = await response.json();
        setCoins(applyPendingStandardTestCharges(data.coins ?? null));
      } catch {
        // Keep header stable even if coin balance is unavailable.
      }
    };

    const loadIncoming = async () => {
      try {
        const response = await fetchWithToken(
          "/api/v1/community/friend-requests/incoming",
        );
        const data = await response.json();
        setIncomingCount(data.count ?? 0);
      } catch {
        // Keep header stable even if friend requests fail to load.
      }
    };

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "coins:updated") {
        if (typeof event.data.coins === "number") {
          setCoins(event.data.coins);
        } else {
          void loadCoins();
        }
      }

      if (event.data?.type === "friendRequests:updated") {
        void loadIncoming();
      }
    };

    void loadCoins();
    void loadIncoming();

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    const locationState = location.state as HeaderLocationState | null;

    if (locationState?.showAltynAdamWelcome) {
      setIsWelcomeDialogOpen(true);
    }
  }, [location.state]);

  const closeWelcomeDialog = () => {
    setIsWelcomeDialogOpen(false);

    if ((location.state as HeaderLocationState | null)?.showAltynAdamWelcome) {
      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  };

  return (
    <>
      <header className="mt-8 box-border flex items-center justify-between gap-6 px-[60px] font-sans max-[1100px]:flex-wrap max-[1100px]:justify-center max-[680px]:px-5">
        <NavLink to="/" className="flex items-center gap-4 p-0">
          <img
            className="h-[56px] w-[56px] rounded-full object-cover"
            src="/images/logo.jpg"
            alt={t("header.logoAlt")}
          />

          <div className="flex flex-col leading-none">
            <span className="text-[28px] font-black tracking-wide text-[#2b2b2b]">
              {t("common.appName")}
            </span>

            <span className="mt-1 text-[12px] font-medium uppercase tracking-[4px] text-[#9a6e00]">
              {t("common.tagline")}
            </span>
          </div>
        </NavLink>

        <nav
          className="flex flex-1 items-center justify-center gap-[54px]
          max-[1100px]:order-3 max-[1100px]:basis-full
          max-[680px]:flex-wrap max-[680px]:gap-5"
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `relative text-[20px] font-medium transition-colors
                hover:text-[#8b6c00]
                ${
                  isActive
                    ? "after:absolute after:bottom-[-10px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#f2c200] after:content-['']"
                    : ""
                }`
              }
            >
              {item.path === "/community" ? (
                <span className="relative">
                  {t("header.communityRequests")}
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

        <div className="flex items-center gap-[18px] max-[680px]:w-full max-[680px]:flex-wrap max-[680px]:justify-center">
          <LanguageSwitcher />

          {coins !== null && (
            <div
              className="flex h-[44px] min-w-[130px] items-center justify-center gap-[8px]
              rounded-[12px] border-[3px] border-[#f2c200]
              bg-[#fff8d9] px-[18px] py-[10px]
              text-[16px] font-bold text-[#9a6e00]
              select-none"
            >
              <span
                aria-hidden="true"
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
            to="/tests"
            className="flex h-[44px] w-[130px] items-center justify-center
            rounded-[12px] bg-[#f2c200]
            text-[16px] font-semibold text-white
            transition-opacity hover:opacity-90"
          >
            {t("header.startTest")}
          </NavLink>

          <NavLink to="/profile">
            <img
              className="ml-[56px] h-[36px] w-[36px] shrink-0 object-contain"
              src="/icons/profile-icon.svg"
              alt={t("header.profileAlt")}
            />
          </NavLink>
        </div>
      </header>

      <Outlet />

      <AltynAdamDialog
        open={isWelcomeDialogOpen}
        imageSrc="/images/altyn-adam-welcome-half.png"
        imageAlt="Алтын Адам приветствует пользователя"
        message="С возвращением! Продолжим путешествие по казахской культуре?"
        onClose={closeWelcomeDialog}
        actions={[
          {
            id: "login-welcome-continue",
            label: "Продолжить",
            onClick: closeWelcomeDialog,
          },
        ]}
      />
    </>
  );
}
