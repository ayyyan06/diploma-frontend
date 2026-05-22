import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";

const TEST_COST = 100;

const toneColors: any = {
  duration: "bg-[#FFF9E8]",
  format: "bg-[#F7F4FF]",
  result: "bg-[#EEF8FF]",
};

export const TestIntroPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [test, setTest] = useState<any>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [testRes, coinsRes] = await Promise.all([
          fetchWithToken(`/api/v1/tests/${id}`),
          fetchWithToken("/api/v1/coins"),
        ]);
        const testJson = await testRes.json();
        const coinsJson = await coinsRes.json();
        setTest(testJson);
        setCoins(coinsJson.coins ?? null);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const canAfford = coins === null || coins >= TEST_COST;

  const handleStart = () => {
    if (!canAfford) return;
    navigate(`/tests/${id}`);
  };

  if (loading) {
    return (
      <main className="mt-[74px] mx-[110px]">
        <p className="text-[20px] font-medium">Loading...</p>
      </main>
    );
  }

  if (!test) {
    return (
      <main className="mt-[74px] mx-[110px]">
        <p className="text-[20px] font-medium">Test not found</p>
      </main>
    );
  }

  return (
    <main className="mt-[74px] mx-[110px] mb-[150px]">
      <section
        className="
          
          min-h-[580px]
          box-border
          border-2
          border-[#ECE7DD]
          rounded-[28px]
          bg-white
          flex
          justify-between
          items-center
          pt-[62px]
          pr-[103px]
          pb-[68px]
          pl-[50px]
        "
      >
        <div className="w-[580px]">
          <p className="m-0 mb-[20px] text-[14px] font-normal leading-[18px] text-[#7A7A7A] uppercase">
            Step 1 · Before you begin
          </p>

          <h1 className="m-0 mb-[31px] text-[40px] font-bold leading-[50px] text-[#111111]">
            {test.title}
          </h1>

          <p className="m-0 mb-[40px] w-[595px] text-[16px] font-normal leading-[26px] text-[#444444]">
            {test.description}
          </p>

          {/* ── Блок стоимости ── */}
          <div
            className={`
              mb-[32px] flex items-center gap-[14px]
              rounded-[16px] border-2 px-[20px] py-[16px]
              w-fit
              ${
                canAfford
                  ? "border-[#f2c200] bg-[#fffbec]"
                  : "border-[#e74c3c] bg-[#fef5f5]"
              }
            `}
          >
            {/* иконка монеты */}
            <span
              className={`
                flex h-[36px] w-[36px] shrink-0 items-center justify-center
                rounded-full text-[16px] font-black text-white shadow-md
                ${canAfford ? "bg-[#f2c200]" : "bg-[#e74c3c]"}
              `}
            >
              ✦
            </span>

            <div>
              <p className="m-0 text-[13px] font-medium text-[#888]">
                Test cost
              </p>
              <p
                className={`m-0 text-[18px] font-bold ${
                  canAfford ? "text-[#9a6e00]" : "text-[#c0392b]"
                }`}
              >
                {TEST_COST} coins
              </p>
            </div>

            <div className="mx-[6px] h-[36px] w-[1px] bg-[#e0d9c8]" />

            <div>
              <p className="m-0 text-[13px] font-medium text-[#888]">
                Your balance
              </p>
              <p
                className={`m-0 text-[18px] font-bold ${
                  canAfford ? "text-[#9a6e00]" : "text-[#c0392b]"
                }`}
              >
                {coins !== null ? `${coins} coins` : "—"}
              </p>
            </div>
          </div>

          {/* предупреждение если не хватает */}
          {!canAfford && (
            <div
              className="
                mb-[32px] flex items-start gap-[12px]
                rounded-[14px] border border-[#fbc8c2]
                bg-[#fff5f4] px-[18px] py-[14px]
                w-[480px]
              "
            >
              <span className="mt-[1px] text-[18px]">🎮</span>
              <div>
                <p className="m-0 text-[14px] font-bold text-[#c0392b]">
                  Not enough coins
                </p>
                <p className="m-0 mt-[4px] text-[13px] leading-[20px] text-[#888]">
                  You need {TEST_COST} coins to start this test. Play a game to
                  earn more coins and come back!
                </p>
                <button
                  onClick={() => navigate("/games")}
                  className="
                    mt-[10px]
                    rounded-[9px] border-none
                    bg-[#e74c3c] px-[16px] py-[8px]
                    text-[13px] font-bold text-white
                    cursor-pointer transition-opacity hover:opacity-85
                  "
                >
                  Go to Games →
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-[20px] mb-[54px]">
            {test.info_boxes?.map((box: any, index: any) => (
              <div
                key={index}
                className={`
                  w-[180px] h-[116px] rounded-[18px]
                  pt-[18px] pr-[17px] pb-[38px] pl-[16px]
                  box-border
                  ${toneColors[box.tone] || "bg-[#F5F5F5]"}
                `}
              >
                <h3 className="m-0 mb-[9px] text-[22px] font-bold leading-[28px] text-[#111111]">
                  {box.value}
                </h3>
                <p className="m-0 text-[18px] font-normal leading-[23px] text-[#555555]">
                  {box.label}
                </p>
              </div>
            ))}
          </div>

          {/* кнопка старта */}
          <button
            onClick={handleStart}
            disabled={!canAfford}
            title={
              !canAfford
                ? `You need ${TEST_COST} coins to start`
                : "Start the test"
            }
            className={`
              w-[230px] h-[58px]
              border-none rounded-[12px]
              text-white text-[16px] font-bold leading-[20px]
              transition-all duration-200
              ${
                canAfford
                  ? "bg-[#F2B705] cursor-pointer hover:opacity-90"
                  : "bg-[#ccc] cursor-not-allowed opacity-60"
              }
            `}
          >
            {canAfford ? "START TEST" : `NEED ${TEST_COST} COINS`}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={test.image_src}
            alt={test.image_alt}
            className={`block w-[420px] object-contain transition-all duration-300 ${
              !canAfford ? "opacity-40 grayscale" : ""
            }`}
          />
        </div>
      </section>
    </main>
  );
};
