import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken, tokenManager } from "../../api/apiutils";
import {
  ENEMY_TEST_SCENES,
  ENEMY_TEST_TYPE,
  buildEnemyTestResult,
  getEnemyOptionLabel,
  saveEnemyTestResult,
} from "../../data/enemyTest";

export const EnemyQuestion = () => {
  const navigate = useNavigate();

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);

  const currentScene = ENEMY_TEST_SCENES[currentSceneIndex];
  const currentSceneNumber = currentSceneIndex + 1;
  const selectedAnswer = selectedAnswers[currentScene.id];
  const isLastScene = currentSceneNumber === ENEMY_TEST_SCENES.length;
  const isFirstScene = currentSceneIndex === 0;
  const progressValue = useMemo(
    () => (currentSceneNumber / ENEMY_TEST_SCENES.length) * 100,
    [currentSceneNumber],
  );

  const previousScene =
    currentSceneIndex > 0 ? ENEMY_TEST_SCENES[currentSceneIndex - 1] : null;
  const previousChoiceLabel = previousScene
    ? getEnemyOptionLabel(previousScene.id, selectedAnswers[previousScene.id] ?? "")
    : null;

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentScene.id]: answerId,
    }));
  };

  const submitResult = async () => {
    const result = buildEnemyTestResult(selectedAnswers);
    saveEnemyTestResult(result);

    if (tokenManager.getToken()) {
      try {
        await fetchWithToken(
          "/api/v1/tests",
          { method: "POST" },
          { type: ENEMY_TEST_TYPE, result },
        );
      } catch (error) {
        console.error("Failed to persist enemy result, using local copy.", error);
      }
    }

    navigate("/tests/enemy-result");
  };

  const handleNextClick = async () => {
    if (!selectedAnswer) {
      return;
    }

    if (isLastScene) {
      setSubmitting(true);
      try {
        await submitResult();
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setCurrentSceneIndex((prev) => prev + 1);
  };

  const handleBackClick = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  if (submitting) {
    return (
      <main className="mx-auto mt-[72px] flex min-h-[60vh] w-full max-w-[1240px] flex-col items-center justify-center gap-4 px-[18px] pb-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f2c200] border-t-transparent" />
        <p className="text-[18px] text-[#555555]">
          Tracing the threat pattern in your choices...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-[72px] w-full max-w-[1240px] px-[18px] pb-12 max-[900px]:mt-12">
      <section className="mb-9 grid gap-[14px]" aria-label="Question progress">
        <p className="m-0 text-[20px] font-normal leading-[1.2] tracking-[0.02em] text-[#7a7a7a] max-[640px]:text-[16px]">
          SCENE {currentSceneNumber} OF {ENEMY_TEST_SCENES.length}
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
          <div className="max-w-[760px]">
            <p className="m-0 mb-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[#8b6c00] max-[640px]:text-[13px]">
              {currentScene.chapter}
            </p>

            <h1 className="m-0 mb-[22px] text-[37px] font-bold leading-[1.25] max-[640px]:text-[28px]">
              {currentScene.title}
            </h1>

            <p className="m-0 text-[18px] leading-[1.5] text-[#555555]">
              {currentScene.prompt}
            </p>

            {previousChoiceLabel ? (
              <p className="mt-[16px] mb-0 max-w-[700px] rounded-[16px] bg-[#fbf7ef] px-[18px] py-[14px] text-[15px] leading-[1.55] text-[#6c655c]">
                Earlier in the story, this felt most dangerous:
                {" "}
                {previousChoiceLabel}
              </p>
            ) : null}
          </div>

          <div className="w-[190px] shrink-0 rounded-full bg-[#f7f2ea] px-6 py-10 text-center text-[18px] leading-[1.55] text-[#606060] max-[640px]:w-[140px] max-[640px]:text-[16px]">
            Threat
            <br />
            Pattern
          </div>
        </div>

        <div
          className="mt-7 grid grid-cols-2 gap-x-[28px] gap-y-[22px] max-[900px]:grid-cols-1"
          role="group"
          aria-label="Scenario choices"
        >
          {currentScene.options.map((answer) => {
            const isSelected = answer.id === selectedAnswer;

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => handleAnswerSelect(answer.id)}
                aria-pressed={isSelected}
                className={`
                  min-h-[96px] rounded-[18px] border-2 px-7 py-[18px]
                  text-left text-[17px] leading-[1.5]
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

        <div className="mt-[42px] flex items-center justify-between gap-4 max-[640px]:flex-col">
          {!isFirstScene ? (
            <button
              type="button"
              onClick={handleBackClick}
              className="
                min-h-[56px] w-[200px] rounded-[16px] border-2 border-[#e4e4e4] bg-white
                text-[18px] font-bold tracking-[0.03em] text-[#555555]
                transition-all duration-200 cursor-pointer hover:border-[#f2c200] hover:text-[#8b6c00]
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
              min-h-[56px] w-[200px] rounded-[16px] border-none bg-[#f2c200]
              text-[18px] font-bold tracking-[0.03em] text-white transition-opacity duration-200
              cursor-pointer disabled:cursor-not-allowed disabled:opacity-55 max-[640px]:w-full
            "
          >
            {isLastScene ? "SEE RESULT" : "NEXT"}
          </button>
        </div>
      </section>
    </main>
  );
};
