import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchWithToken } from "../api/apiutils";
import { AltynAdamDialog } from "../components/AltynAdamDialog";
import {
  localizeAdaptiveQuestion,
  localizeAdaptiveResult,
} from "../content/adaptiveFigureContentTranslations";
import { getAdaptiveFigureUiCopy } from "../content/adaptiveFigureUiCopy";
import {
  markAltynAdamReminderDismissed,
} from "../utils/altynAdamReminder";
import { registerTestCompletion } from "../utils/altynAdamProgress";

const TEST_COST = 100;
const SESSION_STORAGE_KEY = "adaptive_figure_session_id";
const MIN_THINKING_MS = 650;
const LIVE_POSES = ["pointing", "explaining", "thinking"] as const;
const MASCOT_IMAGES = {
  greeting: "/images/altyn-adam-greeting.png.png",
  thinking: "/images/altyn-adam-thinking.png",
  pointing: "/images/altyn-adam-pointing.png",
  explaining: "/images/altyn-adam-explaining.png.png",
  success: "/images/altyn-adam-success.png.png",
} as const;

type MascotPose = keyof typeof MASCOT_IMAGES;
type AdaptiveAnswerId = "yes" | "fifty-fifty" | "no";

interface AdaptiveQuestion {
  id: string;
  text: string;
  trait: string;
  filterType: "hard" | "soft";
}

interface AdaptiveFigure {
  id: string;
  name: string;
  gender: string;
  category: string;
  description: string;
  traits: Record<string, boolean | string>;
}

interface AdaptiveResult {
  figure: AdaptiveFigure;
  matchingPercentage: number;
  matchedTraits: string[];
  answeredCount: number;
  remainingCandidates: number;
}

interface AdaptiveSessionPayload {
  session_id: number;
  status: "in_progress" | "completed" | "abandoned";
  test_title: string;
  test_description: string;
  question_count: number;
  max_questions: number;
  remaining_candidates: number;
  coins_remaining: number | null;
  question: AdaptiveQuestion | null;
  result: AdaptiveResult | null;
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const AdaptiveFigureTestPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const copy = useMemo(
    () => getAdaptiveFigureUiCopy(i18n.language),
    [i18n.language],
  );

  const [session, setSession] = useState<AdaptiveSessionPayload | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mascotPose, setMascotPose] = useState<MascotPose>("greeting");
  const [questionPoseIndex, setQuestionPoseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AdaptiveAnswerId | null>(
    null,
  );
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [reminderCount, setReminderCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const coinsPromise = fetchWithToken("/api/v1/coins").then((response) =>
          response.json(),
        );

        const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
        let nextSession: AdaptiveSessionPayload | null = null;

        if (storedSessionId) {
          try {
            const response = await fetchWithToken(
              `/api/v1/adaptive-figure/sessions/${storedSessionId}`,
            );
            nextSession = (await response.json()) as AdaptiveSessionPayload;

            if (nextSession.status === "abandoned") {
              nextSession = null;
              localStorage.removeItem(SESSION_STORAGE_KEY);
            }
          } catch {
            localStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }

        const coinsJson = await coinsPromise;

        if (!isMounted) return;

        setSession(nextSession);
        setCoins(nextSession?.coins_remaining ?? coinsJson.coins ?? null);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : copy.errors.load);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadPage();

    return () => {
      isMounted = false;
    };
  }, [copy.errors.load]);

  useEffect(() => {
    if (submitting || starting) {
      setMascotPose("thinking");
      return;
    }

    if (!session || session.status === "abandoned") {
      setMascotPose("greeting");
      return;
    }

    if (session.status === "completed") {
      setMascotPose("success");
      return;
    }

    if (!session.question) {
      setMascotPose("greeting");
      return;
    }

    // Keep the mascot cycling on a timer during question reading so the host
    // feels alive instead of changing pose only at fixed milestones.
    setMascotPose(LIVE_POSES[questionPoseIndex % LIVE_POSES.length]);

    const timeoutId = window.setTimeout(
      () => {
        setQuestionPoseIndex(
          (previousIndex) => (previousIndex + 1) % LIVE_POSES.length,
        );
      },
      2000 + Math.floor(Math.random() * 2001),
    );

    return () => window.clearTimeout(timeoutId);
  }, [questionPoseIndex, session, starting, submitting]);

  const canAfford = coins === null || coins >= TEST_COST;
  const currentQuestionNumber =
    session?.status === "in_progress" ? session.question_count + 1 : 0;
  const questionProgress =
    session?.status === "in_progress" && session.max_questions > 0
      ? (currentQuestionNumber / session.max_questions) * 100
      : 0;
  const question = session?.question;
  const result = session?.result;
  const localizedQuestion = useMemo(
    () => localizeAdaptiveQuestion(question, i18n.language),
    [i18n.language, question],
  );
  const localizedResult = useMemo(
    () => localizeAdaptiveResult(result, i18n.language),
    [i18n.language, result],
  );

  const syncSession = (nextSession: AdaptiveSessionPayload) => {
    setSession(nextSession);
    localStorage.setItem(SESSION_STORAGE_KEY, String(nextSession.session_id));

    if (typeof nextSession.coins_remaining === "number") {
      setCoins(nextSession.coins_remaining);
    }
  };

  const closeReminderDialog = () => {
    if (reminderCount !== null) {
      markAltynAdamReminderDismissed(reminderCount);
    }

    setIsReminderDialogOpen(false);
  };

  const handleReminderProfileClick = () => {
    if (reminderCount !== null) {
      markAltynAdamReminderDismissed(reminderCount);
    }

    setIsReminderDialogOpen(false);
    navigate("/profile");
  };

  const handleStart = async () => {
    try {
      setStarting(true);
      setError(null);
      setSelectedAnswer(null);
      setQuestionPoseIndex(0);
      setIsReminderDialogOpen(false);
      setReminderCount(null);

      const response = await fetchWithToken("/api/v1/adaptive-figure/sessions", {
        method: "POST",
      });
      const nextSession = (await response.json()) as AdaptiveSessionPayload;
      syncSession(nextSession);
      window.postMessage({ type: "coins:updated" }, window.location.origin);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : copy.errors.start);
    } finally {
      setStarting(false);
    }
  };

  const handleAnswer = async (answer: AdaptiveAnswerId) => {
    if (!session || session.status !== "in_progress" || !question) {
      return;
    }

    try {
      setSubmitting(true);
      setSelectedAnswer(answer);
      setError(null);

      const requestStartedAt = Date.now();
      const response = await fetchWithToken(
        `/api/v1/adaptive-figure/sessions/${session.session_id}/answers`,
        { method: "POST" },
        {
          question_id: question.id,
          answer,
        },
      );
      const nextSession = (await response.json()) as AdaptiveSessionPayload;
      const elapsed = Date.now() - requestStartedAt;
      let nextReminderCount: number | null = null;

      if (nextSession.status === "completed") {
        const completionState = registerTestCompletion("adaptive-figure");

        if (completionState.shouldShowReminder) {
          nextReminderCount = completionState.completedTestCount;
        }
      }

      if (elapsed < MIN_THINKING_MS) {
        await wait(MIN_THINKING_MS - elapsed);
      }

      syncSession(nextSession);

      if (nextReminderCount !== null) {
        setReminderCount(nextReminderCount);
        setIsReminderDialogOpen(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : copy.errors.answer);
    } finally {
      setSubmitting(false);
      setSelectedAnswer(null);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto mt-[72px] max-w-[1320px] px-6 pb-16">
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f2c200] border-t-transparent" />
          <p className="text-[18px] text-[#555]">{t("common.loading")}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto mt-[72px] max-w-[1320px] px-6 pb-16 max-[900px]:mt-10 max-[640px]:px-4">
      {error && (
        <div className="mb-6 rounded-[18px] border border-[#f3c2c2] bg-[#fff5f5] px-5 py-4 text-[15px] leading-[1.5] text-[#b94a48]">
          {error}
        </div>
      )}

      {(!session || session.status === "abandoned") && (
        <section className="grid gap-8 rounded-[32px] border-2 border-[#ece7dd] bg-white px-8 py-8 shadow-[0_10px_30px_rgba(24,24,24,0.04)] lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="mb-3 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#8b6c00]">
                {copy.intro.eyebrow}
              </p>

              <h1 className="m-0 text-[38px] font-bold leading-[1.18] text-[#161616] max-[640px]:text-[30px]">
                {copy.card.title}
              </h1>

              <p className="mt-5 max-w-[720px] text-[17px] leading-[1.75] text-[#5d5a55]">
                {copy.card.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#e5dcc9] bg-[#fcf8ef] px-4 py-2 text-[13px] font-semibold text-[#7a6a45]">
                  {copy.intro.badge}
                </span>
                <span className="rounded-full border border-[#e5e5e5] bg-[#f7f7f7] px-4 py-2 text-[13px] font-semibold text-[#666]">
                  {copy.intro.hint}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:max-w-[520px]">
              <div
                className={`flex items-center gap-[14px] rounded-[18px] border-2 px-[18px] py-[15px] ${
                  canAfford
                    ? "border-[#f2c200] bg-[#fffbec]"
                    : "border-[#e74c3c] bg-[#fef5f5]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full text-[16px] font-black text-white ${
                    canAfford ? "bg-[#f2c200]" : "bg-[#e74c3c]"
                  }`}
                >
                  ✦
                </span>

                <div className="min-w-0">
                  <p className="m-0 text-[13px] font-medium text-[#888]">
                    {t("testIntro.testCost")}
                  </p>
                  <p
                    className={`m-0 text-[18px] font-bold ${
                      canAfford ? "text-[#9a6e00]" : "text-[#c0392b]"
                    }`}
                  >
                    {TEST_COST} {t("common.coins")}
                  </p>
                </div>

                <div className="h-[34px] w-px bg-[#e0d9c8]" />

                <div className="min-w-0">
                  <p className="m-0 text-[13px] font-medium text-[#888]">
                    {t("testIntro.yourBalance")}
                  </p>
                  <p
                    className={`m-0 text-[18px] font-bold ${
                      canAfford ? "text-[#9a6e00]" : "text-[#c0392b]"
                    }`}
                  >
                    {coins !== null
                      ? `${coins.toLocaleString()} ${t("common.coins")}`
                      : "—"}
                  </p>
                </div>
              </div>

              {!canAfford && (
                <div className="rounded-[16px] border border-[#f4cccc] bg-[#fff6f6] px-4 py-4">
                  <p className="m-0 text-[14px] font-bold text-[#c0392b]">
                    {t("testIntro.notEnoughCoins")}
                  </p>
                  <p className="mb-0 mt-2 text-[14px] leading-[1.6] text-[#7c6f6f]">
                    {t("testIntro.notEnoughDescription", { cost: TEST_COST })}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/games")}
                    className="mt-4 rounded-[12px] border-none bg-[#e74c3c] px-4 py-2 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    {t("testIntro.goToGames")}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  void handleStart();
                }}
                disabled={!canAfford || starting}
                className={`min-h-[58px] rounded-[16px] px-6 text-[16px] font-bold tracking-[0.03em] text-white transition-all ${
                  canAfford
                    ? "bg-[#f2b705] hover:opacity-90"
                    : "cursor-not-allowed bg-[#ccc] opacity-60"
                }`}
              >
                {starting
                  ? copy.question.thinking
                  : canAfford
                    ? t("testIntro.startTest")
                    : t("testIntro.needCoins", { cost: TEST_COST })}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 rounded-[28px] bg-[linear-gradient(180deg,#fbf6ea_0%,#f2ead8_100%)] px-6 py-8 text-center">
            <div className="rounded-full bg-white/60 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a6a45]">
              Altyn Adam
            </div>
            <img
              src={MASCOT_IMAGES[mascotPose]}
              alt={copy.question.hostAlt}
              className="max-h-[420px] w-full max-w-[340px] object-contain"
            />
            <p className="m-0 max-w-[340px] text-[15px] leading-[1.7] text-[#6a6255]">
              {copy.question.hostHint}
            </p>
          </div>
        </section>
      )}

      {session?.status === "in_progress" && question && localizedQuestion && (
        <>
          <section className="mb-8 grid gap-3">
            <p className="m-0 text-[18px] font-semibold tracking-[0.04em] text-[#8a7c64]">
              {copy.question.questionOf(currentQuestionNumber)}
            </p>

            <div className="h-[14px] overflow-hidden rounded-full bg-[#efefef]">
              <div
                className="h-full rounded-full bg-[#f2c200] transition-all duration-300"
                style={{ width: `${questionProgress}%` }}
              />
            </div>
          </section>

          <section className="grid gap-8 rounded-[32px] border-2 border-[#ece7dd] bg-white px-8 py-8 shadow-[0_10px_30px_rgba(24,24,24,0.04)] lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <div className="mb-5 flex flex-wrap gap-3">
                  <span className="rounded-full border border-[#ead49a] bg-[#fff7de] px-4 py-2 text-[13px] font-semibold text-[#8b6c00]">
                    {copy.question.factsBadge}
                  </span>
                  <span className="rounded-full border border-[#e5e5e5] bg-[#f8f8f8] px-4 py-2 text-[13px] font-semibold text-[#666]">
                    {copy.question.adaptiveBadge}
                  </span>
                </div>

                <h1 className="m-0 text-[36px] font-bold leading-[1.22] text-[#171717] max-[640px]:text-[29px]">
                  {localizedQuestion.text}
                </h1>

                <p className="mb-0 mt-5 max-w-[720px] text-[16px] leading-[1.7] text-[#605d57]">
                  {copy.question.hostHint}
                </p>
              </div>

              <div
                className="grid gap-4 md:grid-cols-3"
                role="group"
                aria-label={copy.question.answersAriaLabel}
              >
                {([
                  { id: "yes", label: copy.question.yes },
                  { id: "fifty-fifty", label: copy.question.fiftyFifty },
                  { id: "no", label: copy.question.no },
                ] as const).map((answerOption) => {
                  const isSelected = selectedAnswer === answerOption.id;

                  return (
                    <button
                      key={answerOption.id}
                      type="button"
                      onClick={() => {
                        void handleAnswer(answerOption.id);
                      }}
                      disabled={submitting}
                      className={`min-h-[86px] rounded-[20px] border-2 px-5 py-4 text-[22px] font-bold transition-all ${
                        isSelected
                          ? "border-[#f2c200] bg-[#fff7de] text-[#8b6c00]"
                          : "border-[#e4e4e4] bg-white text-[#444] hover:border-[#f2c200]"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      {submitting && isSelected
                        ? copy.question.thinking
                        : answerOption.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#fbf6ea_0%,#f4ede0_100%)] px-6 py-8 text-center">
              <img
                src={MASCOT_IMAGES[mascotPose]}
                alt={copy.question.hostAlt}
                className="max-h-[420px] w-full max-w-[340px] object-contain"
              />
              <p className="mt-5 max-w-[320px] text-[15px] leading-[1.7] text-[#6a6255]">
                {submitting
                  ? copy.question.thinking
                  : copy.question.hostHint}
              </p>
            </div>
          </section>
        </>
      )}

      {session?.status === "completed" && localizedResult && (
        <section className="grid gap-8 rounded-[32px] border-2 border-[#ece7dd] bg-white px-8 py-8 shadow-[0_10px_30px_rgba(24,24,24,0.04)] lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
          <div className="flex flex-col items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#fff8df_0%,#f5e9c6_100%)] px-6 py-8 text-center">
            <img
              src={MASCOT_IMAGES.success}
              alt={copy.result.successAlt}
              className="max-h-[420px] w-full max-w-[340px] object-contain"
            />
          </div>

          <div className="flex flex-col gap-6">
            <p className="m-0 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#8b6c00]">
              {copy.result.title}
            </p>

            <h1 className="m-0 text-[42px] font-bold leading-[1.14] text-[#171717] max-[640px]:text-[32px]">
              {localizedResult.figure.name}
            </h1>

            <p className="m-0 text-[15px] leading-[1.7] text-[#6b675f]">
              {copy.result.note}
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-[#e6cf88] bg-[#fff6d8] px-4 py-2 text-[14px] font-bold text-[#8b6c00]">
                {copy.result.matchingPercentage}: {localizedResult.matchingPercentage}%
              </span>
              <span className="rounded-full border border-[#e4e4e4] bg-[#f8f8f8] px-4 py-2 text-[14px] font-semibold capitalize text-[#656565]">
                {localizedResult.figure.category}
              </span>
              <span className="rounded-full border border-[#e4e4e4] bg-[#f8f8f8] px-4 py-2 text-[14px] font-semibold capitalize text-[#656565]">
                {localizedResult.figure.gender}
              </span>
            </div>

            <p className="m-0 text-[17px] leading-[1.8] text-[#5d5a55]">
              {localizedResult.figure.description}
            </p>

            <div className="rounded-[24px] border border-[#ece7dd] bg-[#fcfaf6] px-5 py-5">
              <h2 className="m-0 text-[22px] font-bold text-[#171717]">
                {copy.result.matchedTraits}
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                {(localizedResult.matchedTraits.length > 0
                  ? localizedResult.matchedTraits
                  : [copy.result.fallbackTrait]
                ).map((trait) => (
                  <span
                    key={trait}
                    className="rounded-full border border-[#ead49a] bg-[#fff7de] px-4 py-2 text-[14px] font-semibold text-[#8b6c00]"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  void handleStart();
                }}
                disabled={starting}
                className="min-h-[56px] rounded-[16px] border-none bg-[#f2b705] px-6 text-[16px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {starting ? copy.question.thinking : copy.result.restart}
              </button>

              <button
                type="button"
                onClick={() => navigate("/tests")}
                className="min-h-[56px] rounded-[16px] border-2 border-[#f2c200] bg-white px-6 text-[16px] font-bold text-[#8b6c00] transition-all hover:bg-[#fff9e8]"
              >
                {t("testResult.close")}
              </button>

              {!canAfford && (
                <button
                  type="button"
                  onClick={() => navigate("/games")}
                  className="min-h-[56px] rounded-[16px] border-2 border-[#e4e4e4] bg-white px-6 text-[16px] font-bold text-[#555] transition-all hover:border-[#f2c200] hover:text-[#8b6c00]"
                >
                  {t("testIntro.goToGames")}
                </button>
              )}
            </div>
          </div>
        </section>
      )}
      </main>

      <AltynAdamDialog
        open={isReminderDialogOpen}
        imageSrc="/images/altyn-adam-explaining-half.png"
        imageAlt="Алтын Адам советует заглянуть в профиль"
        message="Я подготовил для тебя персональные рекомендации книг и фильмов. Загляни в профиль — там могут быть произведения, которые тебе понравятся."
        onClose={closeReminderDialog}
        actions={[
          {
            id: "adaptive-reminder-profile",
            label: "Перейти в профиль",
            onClick: handleReminderProfileClick,
          },
          {
            id: "adaptive-reminder-continue",
            label: "Продолжить",
            onClick: closeReminderDialog,
            variant: "secondary",
          },
        ]}
      />
    </>
  );
};
