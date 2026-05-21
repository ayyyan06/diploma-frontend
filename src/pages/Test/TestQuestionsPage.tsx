import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";

export const TestQestionsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);

        const res = await fetchWithToken(`/api/v1/tests/${id}`);
        const resJson = await res.json();

        setTest(resJson);
      } catch (error) {
        console.error("Ошибка загрузки теста:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTest();
    }
  }, [id]);

  const questions = test?.questions || [];
  const scaleOptions = test?.scale_options || [];

  const currentQuestion = questions[currentQuestionIndex];

  const currentQuestionNumber = currentQuestionIndex + 1;

  const selectedAnswer = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : null;

  const isLastQuestion = currentQuestionNumber === questions.length;

  const isFirstQuestion = currentQuestionIndex === 0;

  const progressValue = useMemo(() => {
    if (!questions.length) return 0;

    return (currentQuestionNumber / questions.length) * 100;
  }, [currentQuestionNumber, questions.length]);

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

        await fetchWithToken(
          `/api/v1/tests/${id}/submit`,
          {
            method: "POST",
          },
          {
            answers: selectedAnswers,
          },
        );

        navigate(`/tests/${id}/result`);
      } catch (error) {
        console.error("Ошибка отправки теста:", error);
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
      <main className="mt-[74px] mx-auto max-w-[1240px] px-[18px]">
        <p className="text-[20px] font-medium">Loading...</p>
      </main>
    );
  }

  if (!test || !currentQuestion) {
    return (
      <main className="mt-[74px] mx-auto max-w-[1240px] px-[18px]">
        <p className="text-[20px] font-medium">Test not found</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1240px] mx-auto mt-[72px] px-[18px] pb-12 max-[900px]:mt-12">
      {/* Progress */}
      <section className="grid gap-[14px] mb-9">
        <p className="m-0 text-[20px] font-normal leading-[1.2] tracking-[0.02em] text-[#7a7a7a] max-[640px]:text-[16px]">
          QUESTION {currentQuestionNumber} OF {questions.length}
        </p>

        <div className="w-full h-[14px] rounded-full bg-[#efefef] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#f2c200] transition-all duration-300"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </section>

      {/* Card */}
      <section className="border-2 border-[#ece7dd] rounded-[28px] bg-white px-[38px] pt-10 pb-7 shadow-[0_8px_24px_rgba(24,24,24,0.04)] max-[900px]:px-[22px] max-[900px]:pt-7 max-[900px]:pb-6">
        {/* Top */}
        <div className="flex justify-between items-start gap-8 mb-[18px] max-[900px]:flex-col max-[900px]:items-start">
          <div className="max-w-[720px]">
            <p className="m-0 mb-3 text-[15px] font-bold tracking-[0.08em] uppercase text-[#8b6c00] max-[640px]:text-[13px]">
              {test.type} test
            </p>

            <h1 className="m-0 mb-[34px] text-[37px] font-bold leading-[1.25] max-[640px]:text-[28px]">
              {currentQuestion.title}
            </h1>

            <p className="m-0 text-[18px] leading-[1.4] text-[#555555]">
              {currentQuestion.prompt ||
                "Think about your usual pattern across time, not your ideal self."}
            </p>

            <p className="mt-[14px] mb-0 text-[15px] leading-[1.5] text-[#6f6a60] max-[640px]:text-[14px]">
              {test.description}
            </p>
          </div>

          {/* Badge */}
          <div className="w-[190px] aspect-square rounded-full bg-[#f7f2ea] flex items-center justify-center shrink-0 text-[#606060] text-center text-[18px] leading-[1.55] max-[640px]:w-[140px] max-[640px]:text-[16px]">
            <span>
              Question
              <br />
              {currentQuestionNumber}
            </span>
          </div>
        </div>

        {/* Options */}
        <div
          className="grid grid-cols-2 gap-y-[22px] gap-x-[28px] mt-7 max-[900px]:grid-cols-1"
          role="group"
          aria-label="Answer options"
        >
          {scaleOptions.map((answer: any) => {
            const isSelected = answer.id === selectedAnswer;

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => handleAnswerSelect(answer.id)}
                aria-pressed={isSelected}
                className={`
                  min-h-[78px] px-7 py-[18px] border-2 rounded-[18px]
                  text-left text-[17px] leading-[1.45]
                  transition-all duration-200 cursor-pointer
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

        {/* Footer */}
        <div className="flex justify-between items-center mt-[42px] max-[640px]:flex-col gap-4">
          {!isFirstQuestion ? (
            <button
              type="button"
              onClick={handleBackClick}
              className="
                w-[200px] min-h-[56px] rounded-[16px]
                border-2 border-[#e4e4e4] bg-white
                text-[#555] text-[18px] font-bold tracking-[0.03em]
                transition-all duration-200 cursor-pointer
                hover:border-[#f2c200] hover:text-[#8b6c00]
                max-[640px]:w-full
              "
            >
              BACK
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNextClick}
            disabled={!selectedAnswer || submitting}
            className="
              w-[200px] min-h-[56px] rounded-[16px]
              border-none bg-[#f2c200]
              text-white text-[18px] font-bold tracking-[0.03em]
              transition-opacity duration-200 cursor-pointer
              disabled:opacity-55 disabled:cursor-not-allowed
              max-[640px]:w-full
            "
          >
            {submitting
              ? "SUBMITTING..."
              : isLastQuestion
                ? "SEE RESULT"
                : "NEXT"}
          </button>
        </div>
      </section>
    </main>
  );
};
