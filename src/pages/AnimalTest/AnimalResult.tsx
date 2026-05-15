import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";

interface EysenckAxis {
  key: string;
  label: string;
  score: number;
  narrative: string;
  leaningLabel: string;
}

interface AnimalResultData {
  animalKey: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  temperament: string;
  quadrant: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  coreTraits: string[];
  developmentFocus: string;
  whyThisAnimal: string;
  axes: EysenckAxis[];
}

export const AnimalResult = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState<AnimalResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetchWithToken("/api/v1/tests?type=animal", {
          method: "GET",
        });
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto mt-[72px] w-full max-w-[1240px] px-[18px] pb-12">
        <div className="flex flex-col items-center gap-4 mt-20">
          <div className="w-12 h-12 border-4 border-[#f2c200] border-t-transparent rounded-full animate-spin" />
          <p className="text-[18px] text-[#555]">Loading your result...</p>
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
          Animal Reading Not Found
        </h1>

        <section className="max-w-[720px] rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
          <p className="text-[17px] leading-[1.6] text-[#555555]">
            {error ||
              "Start the animal test first so the Eysenck temperament profile can be calculated."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/tests/animal-intro")}
            className="
              mt-5 inline-flex rounded-[14px] bg-[#f2c200]
              px-5 py-[14px] text-[16px] font-bold text-white
              transition-opacity duration-200 hover:opacity-90
              cursor-pointer border-none
            "
          >
            Start the Animal Test
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-[72px] w-full max-w-[1240px] px-[18px] pb-14">
      {/* Heading */}
      <p className="mb-2 text-[15px] font-bold uppercase tracking-[0.08em] text-[#8b6c00]">
        YOUR RESULT:
      </p>

      <h1 className="text-[48px] font-bold leading-[1.12] text-[#181818] max-[640px]:text-[34px]">
        {result.title}
      </h1>

      <p className="mt-[-10px] mb-2 text-[18px] font-bold leading-[1.4] text-[#8b6c00] max-[900px]:text-[16px]">
        {result.subtitle}
      </p>

      <p className="mb-7 max-w-[720px] text-[17px] leading-[1.5] text-[#6d665c] max-[900px]:mb-[22px] max-[900px]:text-[15px]">
        {result.tagline}
      </p>

      {/* Content */}
      <section className="grid grid-cols-[360px_1fr] gap-7 max-[1100px]:grid-cols-1">
        {/* Left card */}
        <div className="h-fit rounded-[28px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
          <img
            src={result.imageSrc}
            alt={result.imageAlt}
            className="mx-auto mb-7 block max-w-full"
          />

          <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
            Core traits
          </h2>

          <ul className="mb-0 grid gap-3 pl-5 text-[16px] leading-[1.6] text-[#555555]">
            {result.coreTraits.map((trait) => (
              <li key={trait}>{trait}</li>
            ))}
          </ul>

          <div className="mt-7 w-full rounded-[18px] bg-[#fbf7ef] p-[18px]">
            <h3 className="mb-[10px] text-[18px] font-bold leading-[1.3] text-[#181818]">
              Temperament Type
            </h3>

            <p className="m-0 text-[16px] leading-[1.5] text-[#555555]">
              {result.temperament} — {result.quadrant}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-6">
          {/* Description */}
          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
              Temperament Reading
            </h2>

            <p className="text-[17px] leading-[1.7] text-[#555555]">
              {result.description}
            </p>
          </div>

          {/* Why animal */}
          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
            <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
              Why This Animal
            </h2>

            <p className="text-[17px] leading-[1.7] text-[#555555]">
              {result.whyThisAnimal}
            </p>

            <p className="mt-4 text-[16px] font-semibold leading-[1.5] text-[#6a5730]">
              Development focus: {result.developmentFocus}
            </p>
          </div>

          {/* Axes */}
          <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white px-10 pb-7 pt-5 shadow-[0_8px_24px_rgba(24,24,24,0.04)] max-[900px]:px-[22px] max-[900px]:pb-6">
            <h2 className="mb-6 text-[24px] font-bold leading-[1.25] text-[#181818]">
              Eysenck Axes
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
                      className="h-full rounded-full bg-gradient-to-r from-[#f2c200] to-[#c9971e]"
                      style={{ width: `${axis.score}%` }}
                    />
                  </div>

                  <p className="text-[15px] leading-[1.5] text-[#5e5b55]">
                    Leans toward {axis.leaningLabel}. {axis.narrative}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Growth */}
          <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
                Strengths
              </h2>

              <ul className="grid gap-3 pl-5 text-[16px] leading-[1.6] text-[#555555]">
                {result.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] border-2 border-[#ece7dd] bg-white p-8 shadow-[0_8px_24px_rgba(24,24,24,0.04)]">
              <h2 className="mb-5 text-[24px] font-bold leading-[1.25] text-[#181818]">
                Growth areas
              </h2>

              <ul className="grid gap-3 pl-5 text-[16px] leading-[1.6] text-[#555555]">
                {result.growthAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Retake */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/tests/animal-questions")}
              className="
                w-[230px] h-[58px] border-2 border-[#f2c200]
                rounded-[12px] bg-white
                text-[#8b6c00] text-[16px] font-bold
                cursor-pointer transition-all duration-200
                hover:bg-[#fff9e8]
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
