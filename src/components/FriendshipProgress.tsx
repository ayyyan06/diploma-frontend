import { getFriendshipProgressMeta } from "../utils/altynAdamProgress";
import type {
  AltynAdamLanguage,
  AltynAdamProgressSnapshot,
} from "../types/altynAdam";
import { resolveLocalizedText } from "../data/altynAdamCulturalDialogues";

const COPY = {
  en: {
    title: "Friendship with Altyn Adam",
    subtitle:
      "Every correct cultural answer brings you 5 friendship points and deepens the relationship.",
    level: "Level",
    points: "Points",
    correctAnswers: "Correct answers",
    totalAnswers: "Total questions",
    streak: "Current streak",
    maxLevel: "Maximum level reached",
  },
  ru: {
    title: "Дружба с Алтын Адамом",
    subtitle:
      "Каждый правильный ответ в культурном диалоге приносит 5 очков дружбы и углубляет связь.",
    level: "Уровень",
    points: "Очки",
    correctAnswers: "Правильные ответы",
    totalAnswers: "Всего вопросов",
    streak: "Текущая серия",
    maxLevel: "Максимальный уровень достигнут",
  },
  kk: {
    title: "Алтын Адаммен достық",
    subtitle:
      "Мәдени диалогтағы әр дұрыс жауап 5 достық ұпайын әкеліп, байланысты күшейтеді.",
    level: "Деңгей",
    points: "Ұпай",
    correctAnswers: "Дұрыс жауаптар",
    totalAnswers: "Барлық сұрақ",
    streak: "Қазіргі серия",
    maxLevel: "Ең жоғары деңгей ашылды",
  },
} as const;

export function FriendshipProgress({
  progress,
  language,
}: {
  progress: AltynAdamProgressSnapshot;
  language: AltynAdamLanguage;
}) {
  const copy = COPY[language];
  const friendshipMeta = getFriendshipProgressMeta(progress.friendshipPoints);

  return (
    <section className="rounded-[28px] border-2 border-[#ece7dd] bg-white p-6 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-[24px] font-bold text-[#111111]">
          {copy.title}
        </h2>
        <p className="m-0 max-w-[720px] text-[15px] leading-[1.65] text-[#6b675f]">
          {copy.subtitle}
        </p>
      </div>

      <div className="mt-6 rounded-[22px] border border-[#ead49a] bg-[#fff9e8] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9a6e00]">
              {copy.level}
            </p>
            <p className="m-0 mt-2 text-[28px] font-bold text-[#171717]">
              {resolveLocalizedText(friendshipMeta.currentLevel.title, language)}
            </p>
          </div>

          <div className="rounded-[16px] bg-white px-5 py-4 text-right shadow-[0_4px_16px_rgba(24,24,24,0.04)]">
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9a6e00]">
              {copy.points}
            </p>
            <p className="m-0 mt-2 text-[24px] font-bold text-[#171717]">
              {friendshipMeta.progressValue} / {friendshipMeta.progressTarget}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-[14px] overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#f2c200_0%,#e09a00_100%)] transition-all duration-300"
              style={{ width: `${friendshipMeta.progressPercent}%` }}
            />
          </div>

          <p className="m-0 mt-3 text-[13px] text-[#8a7752]">
            {friendshipMeta.nextLevel
              ? `${copy.level}: ${resolveLocalizedText(friendshipMeta.currentLevel.title, language)}`
              : copy.maxLevel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: copy.correctAnswers,
            value: progress.correctAnswers,
            accent: "bg-[#eef8ff] text-[#2563eb]",
          },
          {
            label: copy.totalAnswers,
            value: progress.totalAnswers,
            accent: "bg-[#fff4ec] text-[#d97706]",
          },
          {
            label: copy.streak,
            value: progress.correctStreak,
            accent: "bg-[#f7f4ff] text-[#7c3aed]",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[20px] border border-[#ece7dd] bg-[#fcfaf6] p-4"
          >
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${item.accent}`}
            >
              {item.label}
            </span>
            <p className="m-0 mt-4 text-[30px] font-black text-[#111111]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
