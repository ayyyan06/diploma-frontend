import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchWithToken } from "../api/apiutils";
import { localizeTestSummary } from "../content/testContentTranslations";

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

      <section className="flex flex-row justify-center justify-evenly gap-x-[70px] gap-y-10">
        {localizedTests.map((test) => {
          const canAfford = coins === null || coins >= TEST_COST;
          const isEnemyTest = test.type === "enemy";

          return (
            <NavLink
              key={test.id}
              to={`/tests/${test.id}/intro`}
              className="group flex max-w-[260px] flex-col items-center text-center"
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
      </section>
    </div>
  );
};
