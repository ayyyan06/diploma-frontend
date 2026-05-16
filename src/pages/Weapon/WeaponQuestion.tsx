import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Option {
  id: string;
  label: string;
  resultKey: string;
}

interface Question {
  id: number;
  title: string;
  prompt?: string;
  options: Option[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const RESULT_ORDER: string[] = ["bow", "spear", "saber", "shield"];

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "When a disagreement begins, what is your first instinct?",
    prompt: "Choose the response that feels most natural in real conflict.",
    options: [
      {
        id: "w1-bow",
        label: "Step back, observe, and wait for the right moment to respond",
        resultKey: "bow",
      },
      {
        id: "w1-spear",
        label: "State my position directly and push the issue into the open",
        resultKey: "spear",
      },
      {
        id: "w1-saber",
        label: "Look for a workable middle ground before things harden",
        resultKey: "saber",
      },
      {
        id: "w1-shield",
        label: "Calm the tension and protect the relationship first",
        resultKey: "shield",
      },
    ],
  },
  {
    id: 2,
    title: "In a tense team discussion, you usually\u2026",
    options: [
      {
        id: "w2-bow",
        label: "Watch quietly until there is a strategic opening",
        resultKey: "bow",
      },
      {
        id: "w2-spear",
        label: "Push clearly for the solution I believe is right",
        resultKey: "spear",
      },
      {
        id: "w2-saber",
        label: "Trade concessions so everyone can keep moving",
        resultKey: "saber",
      },
      {
        id: "w2-shield",
        label: "Make sure each person feels heard and respected",
        resultKey: "shield",
      },
    ],
  },
  {
    id: 3,
    title: "If someone crosses your boundary, what feels most natural?",
    options: [
      {
        id: "w3-bow",
        label: "Create distance and decide later whether to engage",
        resultKey: "bow",
      },
      {
        id: "w3-spear",
        label: "Confront it immediately and firmly",
        resultKey: "spear",
      },
      {
        id: "w3-saber",
        label: "Negotiate new terms that both sides can live with",
        resultKey: "saber",
      },
      {
        id: "w3-shield",
        label: "Name the impact gently while keeping trust intact",
        resultKey: "shield",
      },
    ],
  },
  {
    id: 4,
    title: "What matters most to you inside a conflict?",
    options: [
      {
        id: "w4-bow",
        label: "Avoiding unnecessary escalation",
        resultKey: "bow",
      },
      {
        id: "w4-spear",
        label: "Defending my position clearly",
        resultKey: "spear",
      },
      {
        id: "w4-saber",
        label: "Reaching a practical solution fast",
        resultKey: "saber",
      },
      {
        id: "w4-shield",
        label: "Preserving trust and safety",
        resultKey: "shield",
      },
    ],
  },
  {
    id: 5,
    title: "A long argument drains you most when\u2026",
    options: [
      {
        id: "w5-bow",
        label: "It forces confrontation before I am ready",
        resultKey: "bow",
      },
      {
        id: "w5-spear",
        label: "People avoid saying what they really mean",
        resultKey: "spear",
      },
      {
        id: "w5-saber",
        label: "Neither side is willing to give a little",
        resultKey: "saber",
      },
      {
        id: "w5-shield",
        label: "The relationship starts feeling emotionally unsafe",
        resultKey: "shield",
      },
    ],
  },
  {
    id: 6,
    title: "When two people around you clash, you tend to\u2026",
    options: [
      {
        id: "w6-bow",
        label: "Stay back and read the dynamics before stepping in",
        resultKey: "bow",
      },
      {
        id: "w6-spear",
        label: "Cut through the tension with a decisive stance",
        resultKey: "spear",
      },
      {
        id: "w6-saber",
        label: "Broker a middle path both people can accept",
        resultKey: "saber",
      },
      {
        id: "w6-shield",
        label: "Lower the emotional heat and protect the bond",
        resultKey: "shield",
      },
    ],
  },
  {
    id: 7,
    title: "Which conflict strength sounds most like you?",
    options: [
      { id: "w7-bow", label: "Strategic restraint", resultKey: "bow" },
      { id: "w7-spear", label: "Assertive clarity", resultKey: "spear" },
      { id: "w7-saber", label: "Flexible negotiation", resultKey: "saber" },
      { id: "w7-shield", label: "Protective cooperation", resultKey: "shield" },
    ],
  },
  {
    id: 8,
    title: "A conflict feels well resolved to you when\u2026",
    options: [
      {
        id: "w8-bow",
        label: "Damage was minimised and space was created",
        resultKey: "bow",
      },
      {
        id: "w8-spear",
        label: "My position was defended honestly and clearly",
        resultKey: "spear",
      },
      {
        id: "w8-saber",
        label: "Both sides gave a little and gained a little",
        resultKey: "saber",
      },
      {
        id: "w8-shield",
        label: "People leave feeling respected and connected",
        resultKey: "shield",
      },
    ],
  },
];

// ─── Scoring ─────────────────────────────────────────────────────────────────

const buildScores = (
  questions: Question[],
  selectedAnswers: Record<number, string>,
): Record<string, number> => {
  const scores: Record<string, number> = Object.fromEntries(
    RESULT_ORDER.map((k: any) => [k, 0]),
  );
  questions.forEach((q: any) => {
    const chosen = q.options.find((o: any) => o.id === selectedAnswers[q.id]);
    if (chosen) scores[chosen.resultKey] += 1;
  });
  return scores;
};

const getWinner = (scores: Record<string, number>): string =>
  RESULT_ORDER.reduce((best: any, k: any) =>
    scores[k] > scores[best] ? k : best,
  );

// ─── Component ───────────────────────────────────────────────────────────────

interface WeaponQuestionProps {
  apiUrl?: string;
  onDone?: (data: any) => void;
}

export const WeaponQuestion = ({
  apiUrl = "/api/v1/tests",
  onDone,
}: WeaponQuestionProps) => {
  const navigate = useNavigate();

  const [index, setIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const question = QUESTIONS[index];
  const qNum = index + 1;
  const total = QUESTIONS.length;
  const selected = answers[question.id];
  const isLast = qNum === total;
  const progress = useMemo(() => (qNum / total) * 100, [qNum, total]);

  const pick = (id: string) =>
    setAnswers((prev: any) => ({ ...prev, [question.id]: id }));

  // ── Submit ──────────────────────────────────────────────────────────────────
  // fetchWithToken принимает body третьим аргументом и сам делает JSON.stringify.
  // Передавать body внутри options нельзя — там он игнорируется.
  //
  // Итоговый payload:
  // { "type": "weapon", "result": { "winner": "bow", "bow": 4, "spear": 2, ... } }
  const submit = async (finalAnswers: Record<number, string>) => {
    setStatus("submitting");

    const scores = buildScores(QUESTIONS, finalAnswers);
    const winner = getWinner(scores);

    const payload: Record<string, any> = {
      type: "weapon",
      result: {
        winner,
        ...scores,
      },
    };

    try {
      // body — третий аргумент, не внутри options!
      const res: Response = await fetchWithToken(
        apiUrl,
        { method: "POST" },
        payload,
      );

      const data: any = await res.json().catch(() => ({}));
      setStatus("done");
      onDone?.(data);
      navigate("/tests/weapon-result");
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong.");
      setStatus("error");
    }
  };

  const next = () => {
    if (!selected) return;
    if (isLast) {
      submit(answers);
    } else {
      setIndex((i: any) => i + 1);
    }
  };

  // ── Submitting ──
  if (status === "submitting") {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#f2c200] border-t-transparent rounded-full animate-spin" />
        <p className="text-[18px] text-[#555]">Submitting your result\u2026</p>
      </main>
    );
  }

  // ── Error ──
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

  // ── Quiz ──
  return (
    <div className="min-h-screen pb-14 bg-white font-sans text-[#181818] box-border">
      <main className="w-full max-w-[1240px] mt-[72px] mx-auto px-[18px] box-border max-[900px]:mt-12">
        {/* Progress */}
        <section
          className="grid gap-[14px] mb-9"
          aria-label="Question progress"
        >
          <p className="m-0 text-[#7a7a7a] text-[20px] font-normal tracking-[0.02em] max-[640px]:text-[16px]">
            QUESTION {qNum} OF {total}
          </p>
          <div
            className="w-full h-[14px] rounded-full bg-[#efefef] overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-[inherit] bg-[#f2c200] transition-[width] duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Card */}
        <div className="border-2 border-[#ece7dd] rounded-[28px] bg-white px-[38px] pt-[40px] pb-[28px] shadow-[0_8px_24px_rgba(24,24,24,0.04)] max-[900px]:px-[22px] max-[900px]:pt-[28px] max-[900px]:pb-[24px]">
          {/* Top */}
          <div className="flex justify-between items-start gap-8 mb-[18px] max-[900px]:flex-col">
            <div className="max-w-[720px]">
              <h1
                className={[
                  "m-0 text-[37px] font-bold leading-[1.25] max-[640px]:text-[28px]",
                  question.prompt ? "mb-[34px]" : "mb-0",
                ].join(" ")}
              >
                {question.title}
              </h1>
              {question.prompt && (
                <p className="m-0 text-[#555] text-[18px] leading-[1.4]">
                  {question.prompt}
                </p>
              )}
            </div>

            <div
              className="w-[190px] aspect-square rounded-full bg-[#f7f2ea] flex items-center justify-center shrink-0 text-[#606060] text-center text-[18px] leading-[1.55] max-[640px]:w-[140px] max-[640px]:text-[16px]"
              aria-hidden="true"
            >
              <span>
                Conflict
                <br />
                Style
              </span>
            </div>
          </div>

          {/* Options */}
          <div
            className="grid grid-cols-2 gap-x-[28px] gap-y-[22px] mt-[28px] max-[900px]:grid-cols-1"
            role="group"
            aria-label="Answers"
          >
            {question.options.map((answer: any) => {
              const isSel = answer.id === selected;
              return (
                <button
                  key={answer.id}
                  type="button"
                  onClick={() => pick(answer.id)}
                  aria-pressed={isSel}
                  className={[
                    "min-h-[78px] px-[28px] py-[18px]",
                    "border-2 rounded-[18px]",
                    "text-left text-[17px] leading-[1.45] cursor-pointer",
                    "transition-[border-color,background-color,box-shadow] duration-200 ease-in-out",
                    isSel
                      ? "border-[#f2c200] bg-[#fff7de] shadow-[0_4px_16px_rgba(242,194,0,0.12)]"
                      : "border-[#e4e4e4] bg-white hover:border-[#f2c200]",
                  ].join(" ")}
                >
                  {answer.label}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-[42px] max-[640px]:justify-stretch">
            <button
              type="button"
              onClick={next}
              disabled={!selected}
              className={[
                "w-[200px] min-h-[56px] border-none rounded-[16px]",
                "text-white text-[18px] font-bold tracking-[0.03em]",
                "max-[640px]:w-full",
                selected
                  ? "bg-[#f2c200] cursor-pointer hover:opacity-90"
                  : "bg-[#f2c200] opacity-55 cursor-not-allowed",
              ].join(" ")}
            >
              {isLast ? "SEE RESULT" : "NEXT"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeaponQuestion;
