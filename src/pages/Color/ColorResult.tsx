import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";
import { buildColorTestResult, COLOR_PALETTE } from "../../data/colorTest";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorEntry {
  id: string;
  label: string;
  title: string;
  shortMeaning: string;
  culturalNote: string;
  keywords: string[];
  coreNeed: string;
  supportMessage: string;
  stressMessage: string;
  balanceTip: string;
  accentColor: string;
  swatchStyle: any;
}

interface ColorResultData {
  title: string;
  note: string;
  description: string;
  coreTraits: string[];
  dominantColor: ColorEntry;
  supportColor: ColorEntry;
  tensionColor: ColorEntry;
  avoidedColor: ColorEntry;
  currentNeed: string;
  supportZone: string;
  stressSignal: string;
  balanceTip: string;
  topPair: ColorEntry[];
  rankingInsight: string[];
}

interface ColorApiRawResult {
  winner: string;
  dominant: string;
  support: string;
  tension: string;
  avoided: string;
  firstRound: string[];
  secondRound: string[];
}

interface ColorApiItem {
  id: number;
  type: string;
  result: ColorApiRawResult;
}

interface ColorApiResponse {
  results: ColorApiItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────

const ColorResultPage = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState<ColorResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async (): Promise<void> => {
      try {
        setLoading(true);

        const response: Response = await fetchWithToken(
          "/api/v1/tests?type=color",
          {
            method: "GET",
          },
        );

        const data: ColorApiResponse = await response.json();

        const colorResults: ColorApiItem[] =
          data.results?.filter(
            (item: ColorApiItem) => item.type === "color" && item.result,
          ) || [];

        if (colorResults.length === 0) {
          setResult(null);
          return;
        }

        const latestResult: ColorApiItem = colorResults.sort(
          (a: ColorApiItem, b: ColorApiItem) => b.id - a.id,
        )[0];

        const raw: ColorApiRawResult = latestResult.result;

        // Reconstruct full result via the same builder used during the test
        const built: any = buildColorTestResult({
          firstRound: raw.firstRound,
          secondRound: raw.secondRound,
        });

        setResult(built as ColorResultData);
      } catch (err: any) {
        setError(err?.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const handleRetake = (): any => navigate("/tests/color-questions");

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#f2c200] border-t-transparent rounded-full animate-spin" />
        <p className="text-[18px] text-[#555]">Loading your result…</p>
      </main>
    );
  }

  // ─── Error / Empty ─────────────────────────────────────────────────────────

  if (error || !result) {
    return (
      <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border text-center max-[900px]:px-6">
        <h1 className="text-[32px] font-bold mb-6">
          {error ? "Error loading result" : "Color Reading Not Found"}
        </h1>
        <p className="text-[18px] text-[#555] mb-8">
          {error ||
            "Start the color test first so the psychological reading can be generated."}
        </p>
        <a
          href="#/tests/color"
          className="inline-flex items-center justify-center w-[230px] h-[58px] rounded-[12px] bg-[#f2c200] text-white text-[16px] font-bold no-underline transition-opacity hover:opacity-90"
        >
          START COLOR TEST
        </a>
      </main>
    );
  }

  // ─── Result ────────────────────────────────────────────────────────────────

  return (
    <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border max-[1100px]:px-10 max-[640px]:px-5">
      {/* Header */}
      <p className="m-0 mb-5 text-[14px] font-normal leading-[18px] text-[#7a7a7a]">
        YOUR RESULT:
      </p>
      <h1 className="m-0 mb-3 text-[40px] font-extrabold leading-[1.25] text-[#111111] max-[640px]:text-[28px]">
        {result.title}
      </h1>
      <p className="mb-8 max-w-[760px] text-[17px] leading-[1.5] text-[#6d665c]">
        {result.note}
      </p>

      <section className="flex items-start gap-10 max-[900px]:flex-col">
        {/* ── LEFT CARD ───────────────────────────────────────────────────── */}
        <div className="w-[360px] border-2 border-[#ece7dd] rounded-[24px] bg-white flex flex-col items-center pt-[48px] px-[44px] pb-[40px] box-border shrink-0 max-[900px]:w-full max-[900px]:max-w-[400px]">
          {/* Dominant swatch */}
          <div
            className="w-[150px] h-[150px] rounded-[42px] border-4 border-black/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] mb-[34px] max-[900px]:w-[132px] max-[900px]:h-[132px] max-[900px]:rounded-[36px]"
            style={result.dominantColor.swatchStyle}
            aria-hidden="true"
          />

          <h2 className="m-0 mb-[14px] text-center text-[22px] font-bold leading-[1.3] text-[#111]">
            Core signals
          </h2>

          <ul className="m-0 pl-6 text-[18px] font-normal leading-[1.5] text-[#555]">
            {result.coreTraits.map((trait: string) => (
              <li key={trait} className="mb-2">
                {trait}
              </li>
            ))}
          </ul>

          {/* Top pair */}
          <div className="w-full mt-7 px-[18px] pt-[18px] pb-[8px] rounded-[18px] bg-[#fbf7ef]">
            <h3 className="m-0 mb-[14px] text-[18px] font-bold leading-[1.3] text-left">
              Top Pair
            </h3>

            {result.topPair.map((color: ColorEntry) => (
              <div
                key={color.id}
                className="flex items-center gap-3 text-[#333] text-[15px] leading-[1.4] mb-[10px] last:mb-0"
              >
                <span
                  className="w-[22px] min-w-[22px] h-[22px] rounded-[7px] border-2 border-black/[0.08]"
                  style={color.swatchStyle}
                  aria-hidden="true"
                />
                <span>{color.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDE ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-[30px]">
          {/* Psychological Reading */}
          <div className="w-full border-2 border-[#ece7dd] rounded-[24px] bg-white pt-5 pr-10 pb-10 pl-[41px] box-border max-[640px]:px-5">
            <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[1.25] text-[#111]">
              Psychological Reading
            </h2>
            <p className="m-0 text-[18px] font-normal leading-[1.65] text-[#555]">
              {result.description}
            </p>
          </div>

          {/* 2×2 grid: Need / Support / Stress / Balance */}
          <div className="grid grid-cols-2 gap-6 max-[1080px]:grid-cols-1">
            <div className="rounded-[24px] bg-[#fff9e8] border-2 border-[#eed892] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <h2 className="m-0 mb-[14px] text-[22px] font-bold leading-[1.3] text-[#111]">
                Current Need
              </h2>
              <p className="m-0 text-[17px] leading-[1.5] text-[#555]">
                {result.currentNeed}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f0faf3] border-2 border-[#b8dfc5] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <h2 className="m-0 mb-[14px] text-[22px] font-bold leading-[1.3] text-[#111]">
                Support Zone
              </h2>
              <p className="m-0 text-[17px] leading-[1.5] text-[#555]">
                {result.supportZone}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#fdf1ee] border-2 border-[#edc5bb] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <h2 className="m-0 mb-[14px] text-[22px] font-bold leading-[1.3] text-[#111]">
                Stress Signal
              </h2>
              <p className="m-0 text-[17px] leading-[1.5] text-[#555]">
                {result.stressSignal}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#eff6fb] border-2 border-[#c7dceb] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <h2 className="m-0 mb-[14px] text-[22px] font-bold leading-[1.3] text-[#111]">
                Balance Tip
              </h2>
              <p className="m-0 text-[17px] leading-[1.5] text-[#555]">
                {result.balanceTip}
              </p>
            </div>
          </div>

          {/* Ranking Insight */}
          <div className="w-full border-2 border-[#ece7dd] rounded-[24px] bg-white pt-5 pr-10 pb-10 pl-[41px] box-border max-[640px]:px-5">
            <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[1.25] text-[#111]">
              Ranking Insight
            </h2>
            <ul className="m-0 pl-6 text-[18px] font-normal leading-[1.65] text-[#555]">
              {result.rankingInsight.map((item: string) => (
                <li key={item} className="mb-2 last:mb-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Avoided color callout */}
          <div className="flex gap-10 max-[640px]:flex-col">
            <div className="flex-1 min-w-0 rounded-[24px] bg-[#f7f4ff] border-2 border-[#d8d1f2] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-6 h-6 rounded-[8px] border-2 border-black/[0.08] shrink-0"
                  style={result.avoidedColor.swatchStyle}
                  aria-hidden="true"
                />
                <h2 className="m-0 text-[22px] font-bold leading-[1.3] text-[#111]">
                  Avoided color
                </h2>
              </div>
              <p className="m-0 text-[18px] text-[#555]">
                {result.avoidedColor.label} — {result.avoidedColor.shortMeaning}
              </p>
            </div>

            <div className="flex-1 min-w-0 rounded-[24px] bg-[#fff5f5] border-2 border-[#f0c4c4] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-6 h-6 rounded-[8px] border-2 border-black/[0.08] shrink-0"
                  style={result.tensionColor.swatchStyle}
                  aria-hidden="true"
                />
                <h2 className="m-0 text-[22px] font-bold leading-[1.3] text-[#111]">
                  Tension color
                </h2>
              </div>
              <p className="m-0 text-[18px] text-[#555]">
                {result.tensionColor.label} — {result.tensionColor.shortMeaning}
              </p>
            </div>
          </div>

          {/* Retake */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleRetake}
              className="w-[230px] h-[58px] border-2 border-[#f2c200] rounded-[12px] bg-white text-[#8b6c00] text-[16px] font-bold cursor-pointer transition-all duration-200 hover:bg-[#fff9e8]"
            >
              RETAKE TEST
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ColorResultPage;
