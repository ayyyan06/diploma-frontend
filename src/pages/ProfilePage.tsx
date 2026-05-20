import { useNavigate } from "react-router-dom";

// ─── Test card config ─────────────────────────────────────────────────────────

const TEST_CARDS = [
  {
    key: "personality",
    title: "Personality",
    subtitle: "Archetype profile",
    description:
      "Discover your core personality archetype and Big Five breakdown.",
    resultPath: "/tests/personality-result",
    introPath: "/tests/personality-intro",
    icon: "✦",
    accent: "#f2c200",
    accentBg: "#fff9e8",
    accentBorder: "#eed892",
    accentText: "#8b6c00",
  },
  {
    key: "animal",
    title: "Animal",
    subtitle: "Eysenck temperament",
    description: "Reveal your spirit animal and Eysenck temperament quadrant.",
    resultPath: "/tests/animal-result",
    introPath: "/tests/animal-intro",
    icon: "◈",
    accent: "#4caf82",
    accentBg: "#f0faf3",
    accentBorder: "#b8dfc5",
    accentText: "#2e7d57",
  },
  {
    key: "weapon",
    title: "Weapon",
    subtitle: "Conflict style",
    description:
      "Understand how you face conflict and what drives your decisions.",
    resultPath: "/tests/weapon-result",
    introPath: "/tests/weapon-intro",
    icon: "◇",
    accent: "#e07b54",
    accentBg: "#fdf1ee",
    accentBorder: "#edc5bb",
    accentText: "#a34f2e",
  },
  {
    key: "road",
    title: "The Steppe Road",
    subtitle: "Scenario journey",
    description:
      "See how you usually move through uncertainty, pressure, and changing conditions.",
    resultPath: "/tests/road-result",
    introPath: "/tests/road-intro",
    icon: "RD",
    accent: "#5d6f95",
    accentBg: "#eef2fb",
    accentBorder: "#c8d2ea",
    accentText: "#415170",
  },
  {
    key: "enemy",
    title: "Who's Your Enemy?",
    subtitle: "Mythic threat",
    description:
      "A Grawe-based scenario test about which threat most strongly disrupts trust, dignity, control, or safety.",
    resultPath: "/tests/enemy-result",
    introPath: "/tests/enemy-intro",
    icon: "EN",
    accent: "#7E5A95",
    accentBg: "#F3ECF8",
    accentBorder: "#D7C7E6",
    accentText: "#5C3D74",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border max-[1100px]:px-10 max-[640px]:px-5">
      {/* Header */}
      <div className="mb-12">
        <p className="m-0 mb-3 text-[14px] font-normal leading-[18px] text-[#7a7a7a] uppercase tracking-widest">
          My Profile
        </p>
        <h1 className="m-0 mb-4 text-[40px] font-extrabold leading-[50px] text-[#111111] max-[640px]:text-[28px]">
          Your Test Results
        </h1>
        <p className="m-0 text-[18px] leading-[1.6] text-[#6d665c] max-w-[560px]">
          View your completed psychological profiles or retake any test to see
          how you've changed.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
        {TEST_CARDS.map((card) => (
          <div
            key={card.key}
            className="relative rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 box-border flex flex-col gap-5 transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(24,24,24,0.08)]"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] font-bold shrink-0"
                style={{
                  background: card.accentBg,
                  color: card.accent,
                  border: `2px solid ${card.accentBorder}`,
                }}
              >
                {card.icon}
              </div>

              <span
                className="text-[12px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  background: card.accentBg,
                  color: card.accentText,
                  border: `1px solid ${card.accentBorder}`,
                }}
              >
                {card.subtitle}
              </span>
            </div>

            {/* Text */}
            <div>
              <h2 className="m-0 mb-2 text-[24px] font-bold leading-[1.25] text-[#111111]">
                {card.title} Test
              </h2>
              <p className="m-0 text-[16px] leading-[1.6] text-[#6d665c]">
                {card.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-auto pt-2">
              <button
                type="button"
                onClick={() => navigate(card.resultPath)}
                className="flex-1 h-[48px] rounded-[12px] text-[15px] font-bold cursor-pointer transition-all duration-200 border-none"
                style={{ background: card.accent, color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                View Result
              </button>

              <button
                type="button"
                onClick={() => navigate(card.introPath)}
                className="flex-1 h-[48px] rounded-[12px] text-[15px] font-bold cursor-pointer transition-all duration-200"
                style={{
                  background: "#fff",
                  color: card.accentText,
                  border: `2px solid ${card.accentBorder}`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = card.accentBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                Retake Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Profile;
