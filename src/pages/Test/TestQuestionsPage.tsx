import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchWithToken } from "../../api/apiutils";
import {
  localizeTestDetail,
  localizeTestType,
} from "../../content/testContentTranslations";
import { registerTestCompletion } from "../../utils/altynAdamProgress";
import { clearPendingStandardTestCharge } from "../../utils/standardTestPendingCharges";

interface TestOption {
  id: string;
  label: string;
}

interface TestQuestion {
  id: number;
  order: number;
  title: string;
  prompt?: string | null;
  options?: TestOption[] | null;
}

interface TestDetail {
  id: number | string;
  type: string;
  title: string;
  description: string;
  questions?: TestQuestion[];
}

interface StandardTestSession {
  session_id: number;
  test_id: number;
  status: "in_progress" | "completed";
  coins_remaining: number | null;
}

export const TestQestionsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionFlowUnavailable, setSessionFlowUnavailable] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  );
  const testId = id ?? "";

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);
        const [testResult, sessionResult] = await Promise.allSettled([
          fetchWithToken(`/api/v1/tests/${id}`).then((response) =>
            response.json() as Promise<TestDetail>,
          ),
          fetchWithToken(`/api/v1/tests/${id}/session`).then((response) =>
            response.json() as Promise<{
              session: StandardTestSession | null;
            }>,
          ),
        ]);

        if (testResult.status === "rejected") {
          throw testResult.reason;
        }

        setTest(testResult.value);

        if (sessionResult.status === "rejected") {
          setSessionFlowUnavailable(true);
          console.warn(
            "Standard test session endpoint unavailable; allowing legacy flow.",
            sessionResult.reason,
          );
          return;
        }

        if (testId) {
          clearPendingStandardTestCharge(testId);
        }

        const sessionJson = sessionResult.value;

        if (!sessionJson.session || sessionJson.session.status !== "in_progress") {
          navigate(`/tests/${id}/intro`, { replace: true });
          return;
        }
      } catch (error) {
        console.error("Test loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void loadTest();
    }
  }, [id, navigate, testId]);

  const localizedTest = useMemo(
    () => (test ? localizeTestDetail(test, i18n.language) : null),
    [test, i18n.language],
  );

  const questions = localizedTest?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const currentOptions = currentQuestion?.options || [];
  const selectedAnswer = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : null;
  const isLastQuestion = currentQuestionNumber === questions.length;
  const isFirstQuestion = currentQuestionIndex === 0;

  const progressValue = useMemo(() => {
    if (!questions.length) return 0;
    return (currentQuestionNumber / questions.length) * 100;
  }, [currentQuestionNumber, questions.length]);

  const typeBadgeLabel = useMemo(() => {
    if (!localizedTest) return "";

    if (localizedTest.type === "enemy") {
      if (i18n.language.startsWith("ru")) return "Тест на врага";
      if (i18n.language.startsWith("kk")) return "Жау тесті";
      return "Enemy test";
    }

    return t("testQuestions.typeTest", {
      type: localizeTestType(localizedTest.type, i18n.language),
    });
  }, [localizedTest, i18n.language, t]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  const handleNextClick = async () => {
    if (!selectedAnswer) return;

    if (isLastQuestion) {
      try {
        setSubmitting(true);
        const formattedAnswers: Record<string, string> = {};

        Object.entries(selectedAnswers).forEach(([questionId, optionId]) => {
          formattedAnswers[String(questionId)] = optionId;
        });

        await fetchWithToken(
          `/api/v1/tests/${id}/submit`,
          { method: "POST" },
          { answers: formattedAnswers },
        );

        if (testId) {
          clearPendingStandardTestCharge(testId);
        }

        if (sessionFlowUnavailable) {
          window.postMessage({ type: "coins:updated" }, window.location.origin);
        }

        const completionState = registerTestCompletion(
          (test?.type as
            | "personality"
            | "animal"
            | "weapon"
            | "enemy"
            | undefined) ?? "personality",
        );

        navigate(`/tests/${id}/result`, {
          state: completionState.shouldShowReminder
            ? {
                altynAdamReminderCount: completionState.completedTestCount,
              }
            : undefined,
        });
      } catch (error) {
        console.error("Test submit error:", error);
      } finally {
        setSubmitting(false);
      }

      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleBackClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto mt-[74px] max-w-[1240px] px-[18px]">
        <p className="text-[20px] font-medium">{t("testQuestions.loading")}</p>
      </main>
    );
  }

  if (!localizedTest || !currentQuestion) {
    return (
      <main className="mx-auto mt-[74px] max-w-[1240px] px-[18px]">
        <p className="text-[20px] font-medium">{t("testQuestions.notFound")}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-[72px] w-full max-w-[1240px] px-[18px] pb-12 max-[900px]:mt-12">
      <section className="mb-9 grid gap-[14px]">
        <p className="m-0 text-[20px] font-normal leading-[1.2] tracking-[0.02em] text-[#7a7a7a] max-[640px]:text-[16px]">
          {t("testQuestions.questionOf", {
            current: currentQuestionNumber,
            total: questions.length,
          })}
        </p>

        <div className="h-[14px] w-full overflow-hidden rounded-full bg-[#efefef]">
          <div
            className="h-full rounded-full bg-[#f2c200] transition-all duration-300"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </section>

      <section className="rounded-[28px] border-2 border-[#ece7dd] bg-white px-[38px] pb-7 pt-10 shadow-[0_8px_24px_rgba(24,24,24,0.04)] max-[900px]:px-[22px] max-[900px]:pb-6 max-[900px]:pt-7">
        <div className="mb-[18px] flex items-start justify-between gap-8 max-[900px]:flex-col max-[900px]:items-start">
          <div className="max-w-[720px]">
            <p className="m-0 mb-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[#8b6c00] max-[640px]:text-[13px]">
              {typeBadgeLabel}
            </p>

            <h1 className="m-0 mb-[34px] text-[37px] font-bold leading-[1.25] max-[640px]:text-[28px]">
              {currentQuestion.title}
            </h1>

            <p className="m-0 text-[18px] leading-[1.4] text-[#555555]">
              {currentQuestion.prompt || t("testQuestions.defaultPrompt")}
            </p>

            <p className="mb-0 mt-[14px] text-[15px] leading-[1.5] text-[#6f6a60] max-[640px]:text-[14px]">
              {localizedTest.description}
            </p>
          </div>

          <div className="flex aspect-square w-[190px] shrink-0 items-center justify-center rounded-full bg-[#f7f2ea] text-center text-[18px] leading-[1.55] text-[#606060] max-[640px]:w-[140px] max-[640px]:text-[16px]">
            <span>
              {t("testQuestions.question")}
              <br />
              {currentQuestionNumber}
            </span>
          </div>
        </div>

        <div
          className="mt-7 grid grid-cols-2 gap-x-[28px] gap-y-[22px] max-[900px]:grid-cols-1"
          role="group"
          aria-label={t("testQuestions.answerOptions")}
        >
          {currentOptions.map((answer) => {
            const isSelected = answer.id === selectedAnswer;

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => handleAnswerSelect(answer.id)}
                aria-pressed={isSelected}
                className={`
                  min-h-[78px] rounded-[18px] border-2 px-7 py-[18px]
                  text-left text-[17px] leading-[1.45]
                  transition-all duration-200
                  ${
                    isSelected
                      ? "border-[#f2c200] bg-[#fff7de] shadow-[0_4px_16px_rgba(242,194,0,0.12)]"
                      : "border-[#e4e4e4] bg-white hover:border-[#f2c200]"
                  }
                `}
              >
                {answer.label}
              </button>
            );
          })}
        </div>

        <div className="mt-[42px] flex items-center justify-between gap-4 max-[640px]:flex-col">
          {!isFirstQuestion ? (
            <button
              type="button"
              onClick={handleBackClick}
              className="min-h-[56px] w-[200px] rounded-[16px] border-2 border-[#e4e4e4] bg-white text-[18px] font-bold tracking-[0.03em] text-[#555] transition-all duration-200 hover:border-[#f2c200] hover:text-[#8b6c00] max-[640px]:w-full"
            >
              {t("testQuestions.back")}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNextClick}
            disabled={!selectedAnswer || submitting}
            className="min-h-[56px] w-[200px] rounded-[16px] border-none bg-[#f2c200] text-[18px] font-bold tracking-[0.03em] text-white transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-55 max-[640px]:w-full"
          >
            {submitting
              ? t("testQuestions.submitting")
              : isLastQuestion
                ? t("testQuestions.seeResult")
                : t("testQuestions.next")}
          </button>
        </div>
      </section>
    </main>
  );
};
