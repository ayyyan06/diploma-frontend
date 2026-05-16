import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WeaponScore {
  key: string;
  label: string;
  score: number;
  narrative: string;
}

interface WeaponResultData {
  weaponKey: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  whyThisWeapon: string;
  shadowWeapon: string;
  topTraits: string[];
  developmentFocus: string;
  weaponScores: WeaponScore[];
}

interface WeaponApiRawResult {
  winner: string;
  bow: number;
  spear: number;
  saber: number;
  shield: number;
}

interface WeaponApiItem {
  id: number;
  type: string;
  result: WeaponApiRawResult;
}

interface WeaponApiResponse {
  results: WeaponApiItem[];
}

// ─── Weapon Config ────────────────────────────────────────────────────────────

const WEAPON_RESULT_MAP: Record<
  string,
  Omit<WeaponResultData, "weaponScores">
> = {
  shield: {
    weaponKey: "shield",
    title: "Shield",
    subtitle: "Protector archetype",
    imageSrc: "/images/shield.svg",
    imageAlt: "Shield",
    tagline: "You defend before you attack.",
    description:
      "You value stability, safety and protecting the people around you. You are dependable and emotionally grounded.",
    strengths: [
      "Reliable under pressure",
      "Protective of others",
      "Emotionally steady",
    ],
    growthAreas: ["Can avoid confrontation", "May suppress emotions"],
    whyThisWeapon:
      "Your answers show strong defensive and stabilizing instincts.",
    shadowWeapon: "Overprotection and emotional isolation.",
    topTraits: ["Loyal", "Calm", "Protective"],
    developmentFocus: "Learn to express vulnerability and act proactively.",
  },

  saber: {
    weaponKey: "saber",
    title: "Saber",
    subtitle: "Strategic duelist",
    imageSrc: "/images/saber.svg",
    imageAlt: "Saber",
    tagline: "Precision over chaos.",
    description:
      "You rely on intelligence, adaptability and timing rather than brute force.",
    strengths: ["Strategic thinker", "Fast decision-making", "Adaptable"],
    growthAreas: [
      "Can become overly calculating",
      "May struggle with emotional openness",
    ],
    whyThisWeapon: "Your responses reflect flexibility and precision.",
    shadowWeapon: "Manipulation and emotional detachment.",
    topTraits: ["Focused", "Adaptive", "Sharp-minded"],
    developmentFocus: "Balance logic with emotional honesty.",
  },

  spear: {
    weaponKey: "spear",
    title: "Spear",
    subtitle: "Fearless initiator",
    imageSrc: "/images/spear.svg",
    imageAlt: "Spear",
    tagline: "Direct action changes reality.",
    description:
      "You move forward decisively and prefer confronting problems head-on.",
    strengths: [
      "Bold leadership",
      "Direct communication",
      "Courageous under stress",
    ],
    growthAreas: ["Can become impulsive", "May ignore subtle emotions"],
    whyThisWeapon: "You consistently chose assertive and proactive responses.",
    shadowWeapon: "Aggression and impatience.",
    topTraits: ["Brave", "Energetic", "Assertive"],
    developmentFocus: "Develop patience and emotional awareness.",
  },

  bow: {
    weaponKey: "bow",
    title: "Bow",
    subtitle: "Observant strategist",
    imageSrc: "/images/bow.svg",
    imageAlt: "Bow",
    tagline: "Distance gives clarity.",
    description:
      "You analyze situations carefully and prefer thoughtful action over emotional reactions.",
    strengths: ["Analytical thinking", "Patience", "Strategic planning"],
    growthAreas: ["Can overthink", "May become emotionally distant"],
    whyThisWeapon: "Your answers show reflection, observation and planning.",
    shadowWeapon: "Isolation and indecision.",
    topTraits: ["Insightful", "Patient", "Strategic"],
    developmentFocus: "Trust your instincts and engage more directly.",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const WeaponResult = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState<WeaponResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);

        const response = await fetchWithToken("/api/v1/tests?type=weapon", {
          method: "GET",
        });

        const data: WeaponApiResponse = await response.json();

        const weaponResults =
          data.results?.filter(
            (item) => item.type === "weapon" && item.result,
          ) || [];

        if (weaponResults.length === 0) {
          setResult(null);
          return;
        }

        // Берём результат с самым большим ID
        const latestResult = weaponResults.sort((a, b) => b.id - a.id)[0];

        const raw = latestResult.result;

        const mappedResult = WEAPON_RESULT_MAP[raw.winner];

        if (!mappedResult) {
          setError("Unknown weapon result");
          return;
        }

        const scores: WeaponScore[] = [
          {
            key: "bow",
            label: "Bow",
            score: raw.bow * 12.5,
            narrative: "Distance, patience and strategic observation.",
          },
          {
            key: "spear",
            label: "Spear",
            score: raw.spear * 12.5,
            narrative: "Direct action, courage and initiative.",
          },
          {
            key: "saber",
            label: "Saber",
            score: raw.saber * 12.5,
            narrative: "Precision, adaptability and intellect.",
          },
          {
            key: "shield",
            label: "Shield",
            score: raw.shield * 12.5,
            narrative: "Defense, loyalty and emotional stability.",
          },
        ];

        setResult({
          ...mappedResult,
          weaponScores: scores,
        });
      } catch (err) {
        console.error(err);

        setError(err instanceof Error ? err.message : "Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const handleRetake = () => navigate("/tests/weapon-questions");

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border text-center max-[900px]:px-6">
        <div className="flex flex-col items-center gap-4 mt-20">
          <div className="w-12 h-12 border-4 border-[#f2c200] border-t-transparent rounded-full animate-spin" />

          <p className="text-[18px] text-[#555]">Loading your result…</p>
        </div>
      </main>
    );
  }

  // ─── Error / Empty ─────────────────────────────────────────────────────────

  if (error || !result) {
    return (
      <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border text-center max-[900px]:px-6">
        <h1 className="text-[32px] font-bold mb-6">
          {error ? "Error loading result" : "No result yet"}
        </h1>

        <p className="text-[18px] text-[#555] mb-8">
          {error || "Please take the weapon test first."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/tests/weapon-intro")}
          className="w-[230px] h-[58px] border-none rounded-[12px] bg-[#F2B705] text-white text-[16px] font-bold leading-[20px] cursor-pointer transition-opacity hover:opacity-90"
        >
          GO TO TEST
        </button>
      </main>
    );
  }

  // ─── Result ────────────────────────────────────────────────────────────────

  return (
    <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border max-[1100px]:px-10 max-[640px]:px-5">
      <p className="m-0 mb-5 text-[14px] font-normal leading-[18px] text-[#7a7a7a]">
        YOUR RESULT:
      </p>

      <h1 className="m-0 mb-3 text-[40px] font-extrabold leading-[50px] text-[#111111] max-[640px]:text-[28px]">
        {result.title}
      </h1>

      <p className="mb-8 text-[18px] text-[#8b6c00] italic">{result.tagline}</p>

      <section className="flex items-start gap-10 max-[900px]:flex-col">
        {/* LEFT CARD */}

        <div className="w-[360px] min-h-[470px] border-2 border-[#ece7dd] rounded-[24px] bg-white flex flex-col items-center pt-[62px] px-[44px] pb-[41px] box-border shrink-0 max-[900px]:w-full max-[900px]:max-w-[400px]">
          <img
            src={result.imageSrc}
            alt={result.imageAlt}
            className="block mx-auto mb-[49px] max-w-[180px]"
          />

          <h2 className="m-0 mb-[14px] text-center text-[22px] font-bold leading-[28px] text-[#111111]">
            Core traits
          </h2>

          <ul className="m-0 pl-6 text-[18px] font-normal leading-[23px] text-[#555555]">
            {result.topTraits.map((trait) => (
              <li key={trait} className="mb-2">
                {trait}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[14px] text-[#8b6c00] italic text-center">
            {result.subtitle}
          </p>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex-1 min-w-0 flex flex-col gap-[30px]">
          {/* Description */}

          <div className="w-full border-2 border-[#ece7dd] rounded-[24px] bg-white pt-5 pr-10 pb-10 pl-[41px] box-border max-[640px]:px-5">
            <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
              Description
            </h2>

            <p className="m-0 text-[18px] font-normal leading-[30px] text-[#555555]">
              {result.description}
            </p>

            {result.whyThisWeapon && (
              <p className="mt-5 text-[16px] leading-[26px] text-[#6f6a60] italic">
                {result.whyThisWeapon}
              </p>
            )}
          </div>

          {/* Strengths + Growth */}

          <div className="flex gap-10 max-[640px]:flex-col">
            <div className="flex-1 min-w-0 rounded-[24px] bg-[#fff9e8] border-2 border-[#eed892] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
                Strengths
              </h2>

              <ul className="m-0 pl-6 text-[18px] font-normal leading-[28px] text-[#555555]">
                {result.strengths.map((item, i) => (
                  <li key={i} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 min-w-0 rounded-[24px] bg-[#f7f4ff] border-2 border-[#d8d1f2] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
                Growth areas
              </h2>

              <ul className="m-0 pl-6 text-[18px] font-normal leading-[28px] text-[#555555]">
                {result.growthAreas.map((item, i) => (
                  <li key={i} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Scores */}

          <div className="w-full border-2 border-[#ece7dd] rounded-[24px] bg-white pt-5 pr-10 pb-10 pl-[41px] box-border max-[640px]:px-5">
            <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
              Conflict Style Breakdown
            </h2>

            <div className="flex flex-col gap-5">
              {result.weaponScores.map((ws) => (
                <div key={ws.key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[16px] font-semibold text-[#111]">
                      {ws.label}
                    </span>

                    <span className="text-[14px] font-bold text-[#8b6c00]">
                      {ws.score}%
                    </span>
                  </div>

                  <div className="w-full h-[10px] rounded-full bg-[#efefef] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#f2c200] transition-all duration-500"
                      style={{ width: `${ws.score}%` }}
                    />
                  </div>

                  <p className="mt-2 mb-0 text-[14px] leading-[1.6] text-[#6f6a60]">
                    {ws.narrative}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shadow + Development */}

          <div className="flex gap-10 max-[640px]:flex-col">
            <div className="flex-1 min-w-0 rounded-[24px] bg-[#eef8ff] border-2 border-[#c4dff0] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
                Shadow weapon
              </h2>

              <p className="m-0 text-[18px] text-[#555]">
                {result.shadowWeapon}
              </p>
            </div>

            <div className="flex-1 min-w-0 rounded-[24px] bg-[#fff5f5] border-2 border-[#f0c4c4] pt-5 pr-8 pb-8 pl-10 box-border max-[640px]:pl-6">
              <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
                Development focus
              </h2>

              <p className="m-0 text-[18px] text-[#555]">
                {result.developmentFocus}
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

export default WeaponResult;
