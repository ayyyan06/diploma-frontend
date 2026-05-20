import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken, tokenManager } from "../../api/apiutils";
import {
  ENEMY_TEST_TYPE,
  type EnemyResultData,
  loadEnemyTestResult,
} from "../../data/enemyTest";

interface EnemyApiItem {
  id: number;
  type: string;
  result: EnemyResultData;
}

interface EnemyApiResponse {
  results: EnemyApiItem[];
}

export const EnemyResult = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState<EnemyResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "local">("api");

  useEffect(() => {
    const fetchResult = async () => {
      const localResult = loadEnemyTestResult();

      if (localResult) {
        setResult(localResult);
        setSource("local");
      }

      if (!tokenManager.getToken()) {
        if (!localResult) {
          setError("No enemy result found.");
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetchWithToken(
          `/api/v1/tests?type=${ENEMY_TEST_TYPE}`,
          { method: "GET" },
        );
        const data: EnemyApiResponse = await response.json();
        const enemyResults =
          data.results?.filter(
            (item) => item.type === ENEMY_TEST_TYPE && item.result,
          ) ?? [];

        if (enemyResults.length > 0) {
          const latestResult = enemyResults.sort((a, b) => b.id - a.id)[0];
          setResult(latestResult.result);
          setSource("api");
          return;
        }

        if (localResult) {
          return;
        }

        setError("No enemy result found.");
      } catch (fetchError) {
        if (localResult) {
          return;
        } else {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load result.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto mt-[72px] w-full max-w-[1240px] px-[18px] pb-12">
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f2c200] border-t-transparent" />
          <p className="text-[18px] text-[#555555]">Loading your result...</p>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="mx-auto mt-[72px] w-full max-w-[1240px] px-[18px] pb-12">
        <p className="mb-2 text-[15px] font-bold uppercase tracking-[0.08em] text-[#8b6c00]">
          YOUR RESULT:
        </p>

        <h1 className="mb-6 text-[44px] font-bold leading-[1.15] text-[#181818] max-[640px]:text-[32px]">
          Enemy Reading Not Found
        </h1>

        <section className="max-w-[720px] rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
          <p className="text-[17px] leading-[1.6] text-[#555555]">
            {error ||
              "Start the enemy test first so the dominant threat pattern can be calculated."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/tests/enemy-intro")}
            className="
              mt-5 inline-flex rounded-[14px] bg-[#f2c200]
              px-5 py-[14px] text-[16px] font-bold text-white
              transition-opacity duration-200 hover:opacity-90
              cursor-pointer border-none
            "
          >
            Start the Enemy Test
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-[72px] w-full max-w-[1240px] px-[18px] pb-14">
      <p className="mb-2 text-[15px] font-bold uppercase tracking-[0.08em] text-[#8b6c00]">
        YOUR RESULT:
      </p>

      <h1 className="mb-3 text-[48px] font-bold leading-[1.12] text-[#181818] max-[640px]:text-[34px]">
        {result.title}
      </h1>

      <p className="mb-2 text-[18px] font-bold leading-[1.4] max-[900px]:text-[16px]">
        {result.subtitle}
      </p>

      <p className="mb-4 inline-flex rounded-full border border-[#e6d7bc] bg-[#fbf7ef] px-4 py-2 text-[14px] font-semibold text-[#7c6842]">
        Need under threat: {result.threatenedNeed}
      </p>

      <p className="mb-4 max-w-[760px] text-[17px] leading-[1.55] text-[#6d665c]">
        {result.tagline}
      </p>

      {source === "local" ? (
        <p className="mb-7 inline-flex rounded-full border border-[#e6d7bc] bg-[#fbf7ef] px-4 py-2 text-[14px] font-semibold text-[#7c6842]">
          Showing your latest locally saved result.
        </p>
      ) : null}

      <section className="grid grid-cols-[360px_1fr] gap-7 max-[1100px]:grid-cols-1">
        <div className="h-fit rounded-[28px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
          <div className="mb-6 overflow-hidden rounded-[28px] bg-[#f6f3eb]">
            <img
              src={result.imageSrc}
              alt={result.imageAlt}
              className="block aspect-square w-full object-cover"
            />
          </div>

          <div
            className="mb-6 flex h-[108px] w-[108px] items-center justify-center rounded-full border-2 text-center text-[16px] font-bold leading-[1.35]"
            style={{
              background: result.softAccent,
              borderColor: result.accentBorder,
              color: result.accent,
            }}
          >
            DOMINANT
            <br />
            ENEMY
          </div>

          <h2 className="mb-4 text-[24px] font-bold leading-[1.25] text-[#181818]">
            Need Under Threat
          </h2>

          <p className="mb-3 text-[17px] font-semibold leading-[1.45] text-[#181818]">
            {result.threatenedNeed}
          </p>

          <p className="mb-6 text-[16px] leading-[1.65] text-[#555555]">
            {result.needDescription}
          </p>

          <div
            className="rounded-[18px] px-[18px] py-[16px]"
            style={{ background: result.softAccent }}
          >
            <h3 className="mb-2 text-[17px] font-bold leading-[1.3] text-[#181818]">
              Grawe model
            </h3>

            <p className="m-0 text-[15px] leading-[1.55] text-[#5f5b55]">
              {result.psychologicalBasis}
            </p>
          </div>

          <h3 className="mb-4 mt-7 text-[20px] font-bold leading-[1.3] text-[#181818]">
            Trigger patterns
          </h3>

          <ul className="mb-0 grid gap-3 pl-5 text-[16px] leading-[1.6] text-[#555555]">
            {result.triggerPatterns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
              Enemy Reading
            </h2>

            <p className="text-[17px] leading-[1.7] text-[#555555]">
              {result.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-4 text-[22px] font-bold leading-[1.25] text-[#181818]">
                How it wins
              </h2>
              <p className="text-[16px] leading-[1.65] text-[#555555]">
                {result.howItWins}
              </p>
            </div>

            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-4 text-[22px] font-bold leading-[1.25] text-[#181818]">
                Why this enemy
              </h2>
              <p className="text-[16px] leading-[1.65] text-[#555555]">
                {result.whyThisEnemy}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white px-8 pb-7 pt-6 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-6 text-[24px] font-bold leading-[1.25] text-[#181818]">
              Enemy Spectrum
            </h2>

            <div className="grid gap-[18px]">
              {result.enemyScores.map((enemyScore) => (
                <div key={enemyScore.key} className="grid gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[18px] font-bold leading-[1.35] text-[#222222]">
                      {enemyScore.label}
                    </span>
                    <span className="text-[16px] font-bold text-[#8b6c00]">
                      {enemyScore.score}
                    </span>
                  </div>

                  <div
                    className="h-3 w-full overflow-hidden rounded-full"
                    style={{ background: enemyScore.softAccent }}
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${enemyScore.score}%`,
                        background: enemyScore.accent,
                      }}
                    />
                  </div>

                  <p className="text-[15px] leading-[1.5] text-[#5e5b55]">
                    {enemyScore.narrative}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-4 text-[22px] font-bold leading-[1.25] text-[#181818]">
                Pattern across the story
              </h2>
              <p className="text-[16px] leading-[1.65] text-[#555555]">
                {result.hiddenTraitSummary}
              </p>
            </div>

            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-4 text-[22px] font-bold leading-[1.25] text-[#181818]">
                Early sign
              </h2>
              <p className="text-[16px] leading-[1.65] text-[#555555]">
                {result.warningSign}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
              How to resist it
            </h2>

            <p className="text-[16px] leading-[1.65] text-[#555555]">
              {result.resistance}
            </p>
          </div>

          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
              What it can make you misread
            </h2>

            <ul className="grid gap-3 pl-5 text-[16px] leading-[1.6] text-[#555555]">
              {result.distortionPatterns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/tests/enemy-questions")}
              className="
                inline-flex rounded-[14px] bg-[#f2c200]
                px-7 py-[15px] text-[16px] font-bold text-white
                transition-opacity duration-200 hover:opacity-90
                cursor-pointer border-none
              "
            >
              RETAKE TEST
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
