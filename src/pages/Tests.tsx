import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../api/apiutils";

const TEST_COST = 100;

export const Tests = () => {
  const [tests, setTests] = useState([]);
  const [coins, setCoins] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        setTests(testsData.tests || []);
        setCoins(coinsData.coins ?? null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading tests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <h1 className="mb-4 text-center text-3xl font-normal">
        Choose which test you want to start
      </h1>

      {/* баланс и подсказка */}
      {coins !== null && (
        <p className="mb-12 text-center text-[15px] text-[#888]">
          Your balance:{" "}
          <span className="font-bold text-[#9a6e00]">
            ✦ {coins.toLocaleString()} coins
          </span>
          {coins < TEST_COST && (
            <span className="ml-2 text-[#c0392b]">
              — not enough for a test. Play a game to earn more!
            </span>
          )}
        </p>
      )}

      <section
        className="
          grid justify-center gap-y-10
          sm:grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-x-10 lg:gap-x-[70px]
        "
      >
        {tests.map((test: any) => {
          const canAfford = coins === null || coins >= TEST_COST;

          return (
            <NavLink
              key={test.id}
              to={`/tests/${test.id}/intro`}
              className="group flex max-w-[260px] flex-col items-center text-center"
            >
              {/* картинка */}
              <div className="relative w-full">
                <img
                  src={test.image_src}
                  alt={test.image_alt}
                  className={`h-full w-full object-contain transition-transform group-hover:-translate-y-1 ${
                    !canAfford ? "opacity-50 grayscale" : ""
                  }`}
                />

                {/* бейдж стоимости */}
                <div
                  className={`
                    absolute bottom-2 right-2
                    flex items-center gap-[5px]
                    rounded-[10px] px-[10px] py-[5px]
                    text-[13px] font-bold
                    shadow-md backdrop-blur-sm
                    ${
                      canAfford
                        ? "bg-[#fff8d9] text-[#9a6e00] border border-[#f2c200]"
                        : "bg-[#fdecea] text-[#c0392b] border border-[#e74c3c]"
                    }
                  `}
                >
                  <span
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
