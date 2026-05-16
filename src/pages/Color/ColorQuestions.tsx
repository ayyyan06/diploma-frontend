import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildColorTestResult,
  COLOR_PALETTE,
  saveColorTestResult,
} from "../../data/colorTest";
import { fetchWithToken } from "../../api/apiutils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "idle" | "submitting" | "error";

interface RoundContent {
  badgeLines: [string, string];
  title: string;
  prompt: string;
}

interface RankingPreviewProps {
  title: string;
  ranking: string[];
}

interface ColorQuestionPageProps {
  apiUrl?: string;
  onComplete?: (data: any) => void;
}

interface SubmitArgs {
  firstRound: string[];
  secondRound: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROUND_CONTENT: RoundContent[] = [
  {
    badgeLines: ["Round", "One"],
    title: "Choose the color that feels most pleasant to you right now.",
    prompt:
      "Do not think about clothes, design, or symbolism. Choose only by inner feeling.",
  },
  {
    badgeLines: ["Round", "Two"],
    title:
      "Choose again from the same colors, in the order that feels right now.",
    prompt:
      "A second ranking helps make the reading more psychological and less random.",
  },
];

const TOTAL_STEPS: number = COLOR_PALETTE.length * ROUND_CONTENT.length;

const getColorById = (colorId: string): any =>
  COLOR_PALETTE.find((color: any) => color.id === colorId) || COLOR_PALETTE[0];

// ─── RankingPreview ───────────────────────────────────────────────────────────

const RankingPreview = ({ title, ranking }: RankingPreviewProps) => (
  <div className="border-2 border-[#ece7dd] rounded-[22px] bg-[#fcfbf8] p-[22px_22px_20px]">
    <h2 className="m-0 mb-4 text-[22px] font-bold leading-[1.3]">{title}</h2>

    {ranking.length ? (
      <ol className="m-0 p-0 list-none grid gap-[10px]">
        {ranking.map((colorId: string, index: number) => {
          const color: any = getColorById(colorId);
          return (
            <li key={color.id} className="flex items-center gap-3">
              <span className="w-7 min-w-[28px] h-7 rounded-full bg-[#f2c200] text-white inline-flex items-center justify-center text-[14px] font-bold">
                {index + 1}
              </span>
              <span
                className="w-6 min-w-[24px] h-6 rounded-[8px] border-2 border-black/[0.08]"
                style={color.swatchStyle}
                aria-hidden="true"
              />
              <span className="text-[#313131] text-[15px] leading-[1.4]">
                {color.label}
              </span>
            </li>
          );
        })}
      </ol>
    ) : (
      <p className="m-0 text-[#80776a] text-[15px] leading-[1.5]">
        No colors ranked yet in this round.
      </p>
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ColorQuestionPage = ({
  apiUrl = "/api/v1/tests",
  onComplete,
}: ColorQuestionPageProps) => {
  const navigate = useNavigate();

  const [firstRound, setFirstRound] = useState<string[]>([]);
  const [secondRound, setSecondRound] = useState<string[]>([]);
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const currentRoundRanking: string[] =
    roundIndex === 0 ? firstRound : secondRound;
  const currentRound: RoundContent = ROUND_CONTENT[roundIndex];

  const progressStep: number =
    roundIndex * COLOR_PALETTE.length + currentRoundRanking.length + 1;
  const progressValue: number =
    ((roundIndex * COLOR_PALETTE.length + currentRoundRanking.length) /
      TOTAL_STEPS) *
    100;

  const availableColors: any[] = useMemo(
    () =>
      COLOR_PALETTE.filter(
        (color: any) => !currentRoundRanking.includes(color.id),
      ),
    [currentRoundRanking],
  );

  // ── Submit to backend ──────────────────────────────────────────────────────
  const submit = async ({
    firstRound: fr,
    secondRound: sr,
  }: SubmitArgs): Promise<void> => {
    setStatus("submitting");

    const result: any = buildColorTestResult({
      firstRound: fr,
      secondRound: sr,
    });
    saveColorTestResult(result);

    const payload: Record<string, any> = {
      type: "color",
      result: {
        winner: result.dominantColor.id,
        dominant: result.dominantColor.id,
        support: result.supportColor.id,
        tension: result.tensionColor.id,
        avoided: result.avoidedColor.id,
        firstRound: fr,
        secondRound: sr,
      },
    };

    try {
      const res: Response = await fetchWithToken(
        apiUrl,
        { method: "POST" },
        payload,
      );
      const data: any = await res.json().catch(() => ({}));
      setStatus("idle");
      onComplete?.(data);
      navigate("/tests/color-result");
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong.");
      setStatus("error");
    }
  };

  // ── Color selection handler ────────────────────────────────────────────────
  const handleColorSelect = (colorId: string): void => {
    if (roundIndex === 0) {
      const nextFirstRound: string[] = [...firstRound, colorId];
      setFirstRound(nextFirstRound);
      if (nextFirstRound.length === COLOR_PALETTE.length) {
        setRoundIndex(1);
      }
      return;
    }

    const nextSecondRound: string[] = [...secondRound, colorId];
    setSecondRound(nextSecondRound);

    if (nextSecondRound.length === COLOR_PALETTE.length) {
      submit({ firstRound, secondRound: nextSecondRound });
    }
  };

  // ── Submitting state ───────────────────────────────────────────────────────
  if (status === "submitting") {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#f2c200] border-t-transparent rounded-full animate-spin" />
        <p className="text-[18px] text-[#555]">Saving your result…</p>
      </main>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <p className="text-[18px] text-red-500 max-w-md">{errorMsg}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="px-8 h-[50px] rounded-[12px] border-2 border-[#f2c200] text-[#8b6c00] font-bold cursor-pointer hover:bg-[#fff9e8] transition-colors"
        >
          TRY AGAIN
        </button>
      </main>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-14 bg-white font-sans text-[#181818] box-border">
      <main className="w-full max-w-[1240px] mt-[72px] mx-auto px-[18px] box-border max-[900px]:mt-12">
        {/* Progress */}
        <section
          className="grid gap-[14px] mb-9"
          aria-label="Selection progress"
        >
          <p className="m-0 text-[#7a7a7a] text-[20px] font-normal tracking-[0.02em] max-[640px]:text-[16px]">
            SELECTION {Math.min(progressStep, TOTAL_STEPS)} OF {TOTAL_STEPS}
          </p>
          <div
            className="w-full h-[14px] rounded-full bg-[#efefef] overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-[inherit] bg-[#f2c200] transition-[width] duration-300 ease-in-out"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </section>

        {/* Card */}
        <div className="flex flex-col gap-7 border-2 border-[#ece7dd] rounded-[28px] bg-white px-[38px] pt-[40px] pb-[28px] shadow-[0_8px_24px_rgba(24,24,24,0.04)] max-[900px]:px-[22px] max-[900px]:pt-[28px] max-[900px]:pb-[24px]">
          {/* Top row: copy + badge */}
          <div className="flex justify-between items-start gap-8 max-[900px]:flex-col">
            <div className="max-w-[720px]">
              <p className="m-0 mb-3 text-[#8b6c00] text-[15px] font-bold tracking-[0.08em] uppercase">
                {roundIndex === 0 ? "Round 1 of 2" : "Round 2 of 2"}
              </p>
              <h1 className="m-0 mb-[18px] text-[37px] font-bold leading-[1.25] max-[640px]:text-[28px]">
                {currentRound.title}
              </h1>
              <p className="m-0 text-[#555] text-[18px] leading-[1.4]">
                {currentRound.prompt}
              </p>
              <p className="m-0 mt-[14px] text-[#6f6a60] text-[15px] leading-[1.5]">
                This is a reflective psychological reading inspired by Luscher,
                not a clinical diagnosis.
              </p>
            </div>

            <div
              className="w-[190px] aspect-square rounded-full bg-gradient-to-b from-[#fbf5e8] to-[#f3e5c0] flex items-center justify-center shrink-0 text-[#7c651c] text-center text-[18px] leading-[1.55] max-[640px]:w-[140px] max-[640px]:text-[16px]"
              aria-hidden="true"
            >
              <span>
                {currentRound.badgeLines[0]}
                <br />
                {currentRound.badgeLines[1]}
              </span>
            </div>
          </div>

          {/* Status bar */}
          <div className="rounded-[18px] bg-[#fbf7ef] px-[18px] py-4 text-[#6a5730] text-[16px] leading-[1.4]">
            Choose preference #{currentRoundRanking.length + 1} in this round.
          </div>

          {/* Color options grid */}
          <div
            className="grid grid-cols-2 gap-x-[22px] gap-y-[18px] max-[900px]:grid-cols-1"
            role="group"
            aria-label="Available colors"
          >
            {availableColors.map((color: any) => (
              <button
                key={color.id}
                type="button"
                onClick={() => handleColorSelect(color.id)}
                className="flex items-center gap-[18px] min-h-[104px] px-[22px] py-[18px] border-2 border-[#e7e1d6] rounded-[22px] bg-white cursor-pointer text-left transition-[transform,border-color,box-shadow] duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(24,24,24,0.08)] max-[640px]:min-h-[94px] max-[640px]:gap-[14px] max-[640px]:px-[18px] max-[640px]:py-4"
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.borderColor = color.accentColor)
                }
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.borderColor = "")
                }
              >
                {/* Swatch */}
                <span
                  className="w-[74px] min-w-[74px] h-[74px] rounded-[24px] border-[3px] border-black/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] max-[640px]:w-[62px] max-[640px]:min-w-[62px] max-[640px]:h-[62px] max-[640px]:rounded-[20px]"
                  style={color.swatchStyle}
                  aria-hidden="true"
                />

                {/* Copy */}
                <span className="flex flex-col gap-[6px] min-w-0">
                  <span className="text-[19px] font-bold leading-[1.3] text-[#181818] max-[640px]:text-[17px]">
                    {color.label}
                  </span>
                  <span className="text-[#666] text-[15px] leading-[1.45] max-[640px]:text-[14px]">
                    {color.culturalNote}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Round previews */}
          <div className="grid grid-cols-2 gap-[22px] max-[900px]:grid-cols-1">
            <RankingPreview title="Round One Order" ranking={firstRound} />
            <RankingPreview title="Round Two Order" ranking={secondRound} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ColorQuestionPage;
