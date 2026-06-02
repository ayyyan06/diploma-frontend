import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchWithToken } from "../api/apiutils";
import { localizeTestSummary } from "../content/testContentTranslations";
import { getAdaptiveFigureUiCopy } from "../content/adaptiveFigureUiCopy";

const TEST_COST = 100;

interface TestSummary {
  id: number;
  type: string;
  title: string;
  description: string;
  image_src: string;
  image_alt: string;
}

export const Tests = () => {
  const { t, i18n } = useTranslation();
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [coins, setCoins] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [testsRes, coinsRes] = await Promise.all([
          fetchWithToken("/api/v1/tests"),
          fetchWithToken("/api/v1/coins"),
        ]);

        const testsData = await testsRes.json();
        const coinsData = await coinsRes.json();

        setTests((testsData.tests as TestSummary[]) || []);
        setCoins(coinsData.coins ?? null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : t("tests.errorPrefix"));
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [t]);

  const localizedTests = useMemo(
    () => {
      return tests
        .map((test) => localizeTestSummary(test, i18n.language))
        .filter(
          (test) =>
            test.type !== "road" &&
            !/steppe road/i.test(test.title),
        );
    },
    [tests, i18n.language],
  );
  const adaptiveFigureCopy = useMemo(
    () => getAdaptiveFigureUiCopy(i18n.language),
    [i18n.language],
  );
  const canAfford = coins === null || coins >= TEST_COST;

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        {t("tests.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        {t("tests.errorPrefix")} {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <h1 className="mb-4 text-center text-3xl font-normal">
        {t("tests.title")}
      </h1>

      {coins !== null && (
        <p className="mb-12 text-center text-[15px] text-[#888]">
          {t("tests.balanceLabel")}{" "}
          <span className="font-bold text-[#9a6e00]">
            ✦ {coins.toLocaleString()} {t("common.coins")}
          </span>
          {coins < TEST_COST && (
            <span className="ml-2 text-[#c0392b]">
              {t("tests.notEnoughHint")}
            </span>
          )}
        </p>
      )}

      <section className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
        {localizedTests.map((test) => {
          const isEnemyTest = test.type === "enemy";

          return (
            <NavLink
              key={test.id}
              to={`/tests/${test.id}/intro`}
              className="group flex w-full max-w-[260px] justify-self-center flex-col items-center text-center"
            >
              <div className="relative w-full">
                {isEnemyTest ? (
                  <div className="aspect-square w-full overflow-hidden rounded-[56px] bg-[#f6f3eb]">
                    <img
                      src={test.image_src}
                      alt={test.image_alt}
                      className={`h-full w-full scale-[1.08] object-cover object-[46%_44%] transition-transform group-hover:-translate-y-1 ${
                        !canAfford ? "opacity-50 grayscale" : ""
                      }`}
                    />
                  </div>
                ) : (
                  <img
                    src={test.image_src}
                    alt={test.image_alt}
                    className={`h-full w-full object-contain transition-transform group-hover:-translate-y-1 ${
                      !canAfford ? "opacity-50 grayscale" : ""
                    }`}
                  />
                )}

                <div
                  className={`
                    absolute bottom-2 right-2
                    flex items-center gap-[5px]
                    rounded-[10px] px-[10px] py-[5px]
                    text-[13px] font-bold
                    shadow-md backdrop-blur-sm
                    ${
                      canAfford
                        ? "border border-[#f2c200] bg-[#fff8d9] text-[#9a6e00]"
                        : "border border-[#e74c3c] bg-[#fdecea] text-[#c0392b]"
                    }
                  `}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-[15px] w-[15px] items-center justify-center rounded-full text-[9px] font-black text-white ${
                      canAfford ? "bg-[#f2c200]" : "bg-[#e74c3c]"
                    }`}
                  >
                    ✦
                  </span>
                  {TEST_COST}
                </div>
              </div>

              <h2 className="text-xl font-normal transition-colors group-hover:text-[#8b6c00]">
                {test.title}
              </h2>

              <p className="mt-2 text-sm font-light leading-[18px] text-gray-600">
                {test.description}
              </p>
            </NavLink>
          );
        })}

        <article className="col-span-full overflow-hidden rounded-[36px] border border-[#e4e0d8] bg-white shadow-[0_12px_30px_rgba(24,24,24,0.04)]">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="bg-[linear-gradient(135deg,#e3e3e3_0%,#c9c9c9_100%)] p-6 sm:p-8">
              <div
                className={`flex min-h-[220px] items-center justify-center rounded-[28px] border border-dashed border-white/70 bg-white/20 px-6 text-center text-[15px] font-semibold uppercase tracking-[0.14em] text-white ${
                  !canAfford ? "opacity-60 grayscale" : ""
                }`}
              >
                {adaptiveFigureCopy.card.coverPlaceholder}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-7 px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-[720px]">
                    <p className="m-0 text-[14px] font-semibold uppercase tracking-[0.14em] text-[#8b6c00]">
                      {adaptiveFigureCopy.card.eyebrow}
                    </p>

                    <h2 className="mt-3 text-[34px] font-bold leading-[1.14] text-[#171717] max-[640px]:text-[28px]">
                      {adaptiveFigureCopy.card.title}
                    </h2>
                  </div>

                  <div
                    className={`
                      flex items-center gap-[5px]
                      rounded-[10px] px-[10px] py-[5px]
                      text-[13px] font-bold
                      shadow-md backdrop-blur-sm
                      ${
                        canAfford
                          ? "border border-[#f2c200] bg-[#fff8d9] text-[#9a6e00]"
                          : "border border-[#e74c3c] bg-[#fdecea] text-[#c0392b]"
                      }
                    `}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-[15px] w-[15px] items-center justify-center rounded-full text-[9px] font-black text-white ${
                        canAfford ? "bg-[#f2c200]" : "bg-[#e74c3c]"
                      }`}
                    >
                      ✦
                    </span>
                    {TEST_COST}
                  </div>
                </div>

                <p className="m-0 max-w-[760px] text-[16px] leading-[1.75] text-[#5f5c56]">
                  {adaptiveFigureCopy.card.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="m-0 text-[14px] leading-[1.7] text-[#7a7468]">
                  {adaptiveFigureCopy.intro.hint}
                </p>

                <NavLink
                  to="/tests/adaptive-figure"
                  className={`inline-flex min-h-[52px] min-w-[170px] items-center justify-center rounded-[16px] px-6 text-[15px] font-bold text-white transition-all ${
                    canAfford
                      ? "bg-[#f2b705] hover:opacity-90"
                      : "bg-[#d0d0d0] text-white/90"
                  }`}
                >
                  {adaptiveFigureCopy.card.start}
                </NavLink>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};
