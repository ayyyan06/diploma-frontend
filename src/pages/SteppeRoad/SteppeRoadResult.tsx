import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";
import {
  STEPPE_ROAD_TEST_TYPE,
  type SteppeRoadResultData,
  loadSteppeRoadResult,
} from "../../data/steppeRoadTest";

interface SteppeRoadApiItem {
  id: number;
  type: string;
  result: SteppeRoadResultData;
}

interface SteppeRoadApiResponse {
  results: SteppeRoadApiItem[];
}

export const SteppeRoadResult = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState<SteppeRoadResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "local">("api");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetchWithToken(
          `/api/v1/tests?type=${STEPPE_ROAD_TEST_TYPE}`,
          { method: "GET" },
        );
        const data: SteppeRoadApiResponse = await response.json();
        const roadResults =
          data.results?.filter(
            (item) => item.type === STEPPE_ROAD_TEST_TYPE && item.result,
          ) ?? [];

        if (roadResults.length > 0) {
          const latestResult = roadResults.sort((a, b) => b.id - a.id)[0];
          setResult(latestResult.result);
          setSource("api");
          return;
        }

        const localResult = loadSteppeRoadResult();
        if (localResult) {
          setResult(localResult);
          setSource("local");
          return;
        }

        setError("No Steppe Road result found.");
      } catch (fetchError) {
        const localResult = loadSteppeRoadResult();

        if (localResult) {
          setResult(localResult);
          setSource("local");
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
          Steppe Road Reading Not Found
        </h1>

        <section className="max-w-[720px] rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
          <p className="text-[17px] leading-[1.6] text-[#555555]">
            {error ||
              "Start The Steppe Road first so your scenario result can be calculated."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/tests/road-intro")}
            className="
              mt-5 inline-flex rounded-[14px] bg-[#f2c200]
              px-5 py-[14px] text-[16px] font-bold text-white
              transition-opacity duration-200 hover:opacity-90
              cursor-pointer border-none
            "
          >
            Start The Steppe Road
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
          <div
            className="mb-6 flex h-[108px] w-[108px] items-center justify-center rounded-full border-2 text-center text-[16px] font-bold leading-[1.35]"
            style={{
              background: result.softAccent,
              borderColor: result.accentBorder,
              color: result.accent,
            }}
          >
            ROAD
            <br />
            ROLE
          </div>

          <h2 className="mb-4 text-[24px] font-bold leading-[1.25] text-[#181818]">
            On this road
          </h2>

          <p className="mb-6 text-[16px] leading-[1.65] text-[#555555]">
            {result.roadEpilogue}
          </p>

          <div
            className="rounded-[18px] px-[18px] py-[16px]"
            style={{ background: result.softAccent }}
          >
            <h3 className="mb-2 text-[17px] font-bold leading-[1.3] text-[#181818]">
              What others get from you
            </h3>

            <p className="m-0 text-[15px] leading-[1.55] text-[#5f5b55]">
              {result.supportStyle}
            </p>
          </div>

          <h3 className="mb-4 mt-7 text-[20px] font-bold leading-[1.3] text-[#181818]">
            Strengths
          </h3>

          <ul className="mb-0 grid gap-3 pl-5 text-[16px] leading-[1.6] text-[#555555]">
            {result.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
              Road Reading
            </h2>

            <p className="text-[17px] leading-[1.7] text-[#555555]">
              {result.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-4 text-[22px] font-bold leading-[1.25] text-[#181818]">
                Your first move
              </h2>
              <p className="text-[16px] leading-[1.65] text-[#555555]">
                {result.firstMove}
              </p>
            </div>

            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-4 text-[22px] font-bold leading-[1.25] text-[#181818]">
                Under pressure
              </h2>
              <p className="text-[16px] leading-[1.65] text-[#555555]">
                {result.pressurePattern}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
              Why This Role
            </h2>

            <p className="text-[17px] leading-[1.7] text-[#555555]">
              {result.whyThisRole}
            </p>

            <p className="mt-4 text-[16px] font-semibold leading-[1.5] text-[#6a5730]">
              Development focus: {result.developmentFocus}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white px-8 pb-7 pt-6 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-6 text-[24px] font-bold leading-[1.25] text-[#181818]">
                Response Axes
              </h2>

              <div className="grid gap-[18px]">
                {result.axes.map((axis) => (
                  <div key={axis.key} className="grid gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[18px] font-bold leading-[1.35] text-[#222222]">
                        {axis.label}
                      </span>
                      <span className="text-[16px] font-bold text-[#8b6c00]">
                        {axis.score}
                      </span>
                    </div>

                    <div
                      className="h-3 w-full overflow-hidden rounded-full bg-[#efe9dc]"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${axis.score}%`,
                          background: `linear-gradient(90deg, ${result.accent} 0%, #f2c200 100%)`,
                        }}
                      />
                    </div>

                    <p className="text-[15px] leading-[1.5] text-[#5e5b55]">
                      Leans toward {axis.leaningLabel}. {axis.narrative}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white px-8 pb-7 pt-6 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-6 text-[24px] font-bold leading-[1.25] text-[#181818]">
                Role Mix
              </h2>

              <div className="grid gap-[18px]">
                {result.roleScores.map((roleScore) => (
                  <div key={roleScore.key} className="grid gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[18px] font-bold leading-[1.35] text-[#222222]">
                        {roleScore.label}
                      </span>
                      <span className="text-[16px] font-bold text-[#8b6c00]">
                        {roleScore.score}
                      </span>
                    </div>

                    <div
                      className="h-3 w-full overflow-hidden rounded-full"
                      style={{ background: roleScore.softAccent }}
                      aria-hidden="true"
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${roleScore.score}%`,
                          background: roleScore.accent,
                        }}
                      />
                    </div>

                    <p className="text-[15px] leading-[1.5] text-[#5e5b55]">
                      {roleScore.narrative}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
              Growth Areas
            </h2>

            <ul className="grid gap-3 pl-5 text-[16px] leading-[1.6] text-[#555555]">
              {result.growthAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/tests/road-questions")}
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
