import { useTranslation } from "react-i18next";

const LANGUAGES = ["en", "ru", "kk"] as const;

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  return (
    <div
      className={`flex items-center gap-1 rounded-[12px] border-2 border-[#ece7dd] bg-white p-1 ${className}`.trim()}
      aria-label={t("common.language.label")}
    >
      {LANGUAGES.map((language) => {
        const active = i18n.language === language;

        return (
          <button
            key={language}
            type="button"
            onClick={() => void i18n.changeLanguage(language)}
            className={`rounded-[9px] px-3 py-1.5 text-[12px] font-bold tracking-[0.08em] transition-all ${
              active
                ? "bg-[#f2c200] text-[#111]"
                : "text-[#7a7a7a] hover:bg-[#f8f6f0]"
            }`}
          >
            {t(`common.language.${language}`)}
          </button>
        );
      })}
    </div>
  );
}
