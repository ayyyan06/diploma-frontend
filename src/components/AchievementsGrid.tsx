import {
  ACHIEVEMENT_FALLBACK_IMAGE,
  ALTTYN_ADAM_ACHIEVEMENTS,
} from "../data/achievements";
import {
  normalizeAltynAdamLanguage,
  resolveLocalizedText,
} from "../data/altynAdamCulturalDialogues";
import type { AltynAdamLanguage } from "../types/altynAdam";

const COPY = {
  en: {
    title: "Achievements",
    subtitle:
      "Unlocked and locked milestones in your cultural journey with Altyn Adam.",
    secretTitle: "???",
    secretDescription: "This achievement is still hidden.",
    unlocked: "Unlocked",
    locked: "Locked",
  },
  ru: {
    title: "Достижения",
    subtitle:
      "Открытые и скрытые вехи вашего культурного пути вместе с Алтын Адамом.",
    secretTitle: "???",
    secretDescription: "Это достижение пока скрыто.",
    unlocked: "Открыто",
    locked: "Закрыто",
  },
  kk: {
    title: "Жетістіктер",
    subtitle:
      "Алтын Адаммен бірге мәдени сапарыңыздағы ашық және жабық белестер.",
    secretTitle: "???",
    secretDescription: "Бұл жетістік әзірге жасырын.",
    unlocked: "Ашық",
    locked: "Жабық",
  },
} as const;

export function AchievementsGrid({
  unlockedAchievementIds,
  language,
}: {
  unlockedAchievementIds: readonly string[];
  language: AltynAdamLanguage;
}) {
  const copy = COPY[language];
  const unlockedSet = new Set(unlockedAchievementIds);
  const resolvedLanguage = normalizeAltynAdamLanguage(language);

  return (
    <section className="rounded-[28px] border-2 border-[#ece7dd] bg-white p-6 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-[24px] font-bold text-[#111111]">
          {copy.title}
        </h2>
        <p className="m-0 max-w-[760px] text-[15px] leading-[1.65] text-[#6b675f]">
          {copy.subtitle}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 [grid-auto-rows:0.8fr]">
        {ALTTYN_ADAM_ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedSet.has(achievement.id);
          const title =
            achievement.isSecret && !isUnlocked
              ? copy.secretTitle
              : resolveLocalizedText(achievement.title, resolvedLanguage);
          const description =
            achievement.isSecret && !isUnlocked
              ? copy.secretDescription
              : resolveLocalizedText(achievement.description, resolvedLanguage);

          return (
            <article
              key={achievement.id}
              className={`rounded-[22px] border p-4 transition-all ${
                isUnlocked
                  ? "border-[#ead49a] bg-[#fffdf6] shadow-[0_6px_18px_rgba(24,24,24,0.04)]"
                  : "border-[#ece7dd] bg-[#faf8f3] opacity-60"
              }`}
            >
              <div className="flex justify-end">
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
                    isUnlocked
                      ? "bg-[#fff1b8] text-[#9a6e00]"
                      : "bg-white text-[#9a9488]"
                  }`}
                >
                  {isUnlocked ? copy.unlocked : copy.locked}
                </span>
              </div>

              <div className="mt-2 flex gap-4">
                <img
                  src={achievement.image}
                  alt={title}
                  className={`h-[72px] w-[72px] shrink-0 rounded-[18px] border border-[#ece7dd] bg-white object-cover ${
                    isUnlocked ? "" : "grayscale"
                  }`}
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).src =
                      ACHIEVEMENT_FALLBACK_IMAGE;
                  }}
                />

                <div className="min-w-0 flex-1">
                  <h3 className="m-0 text-[15px] font-bold leading-[1.3] text-[#171717]">
                    {title}
                  </h3>

                  <p className="m-0 mt-2 text-[11px] leading-[1.6] text-[#645f56]">
                    {description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
