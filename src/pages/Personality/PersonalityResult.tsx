import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";

interface BigFiveTrait {
  key: string;
  label: string;
  shortLabel: string;
  description: string;
  score: number;
  narrative: string;
}

interface PersonalityResultData {
  archetypeKey: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  whyThisArchetype: string;
  shadowArchetype: string;
  topTraits: string[];
  developmentFocus: string;
  bigFive: BigFiveTrait[];
}

export const PersonalityResult = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState<PersonalityResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetchWithToken(
          "/api/v1/tests?type=personality",
          { method: "GET" },
        );

        const data: any = await response.json();

        // берем первый результат personality
        const personalityResult = data.results?.[0]?.result || null;

        setResult(personalityResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
    console.log(result);
  }, []);

  const handleRetake = () => {
    navigate("/tests/personality-questions");
  };

  if (loading) {
    return (
      <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border text-center max-[900px]:px-6">
        <div className="flex flex-col items-center gap-4 mt-20">
          <div className="w-12 h-12 border-4 border-[#f2c200] border-t-transparent rounded-full animate-spin" />
          <p className="text-[18px] text-[#555]">Loading your result...</p>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border text-center max-[900px]:px-6">
        <h1 className="text-[32px] font-bold mb-6">
          {error ? "Error loading result" : "No result yet"}
        </h1>
        <p className="text-[18px] text-[#555] mb-8">
          {error || "Please take the personality test first."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/tests/personality-intro")}
          className="
            w-[230px] h-[58px] border-none rounded-[12px]
            bg-[#F2B705] text-white text-[16px] font-bold
            leading-[20px] cursor-pointer
            transition-opacity hover:opacity-90
          "
        >
          GO TO TEST
        </button>
      </main>
    );
  }

  return (
    <></>
    // <main className="max-w-[1440px] mt-[70px] mb-[154px] mx-auto px-[120px] box-border max-[1100px]:px-10 max-[640px]:px-5">
    //   <p className="m-0 mb-5 text-[14px] font-normal leading-[18px] text-[#7a7a7a]">
    //     YOUR RESULT:
    //   </p>

    //   <h1 className="m-0 mb-8 text-[40px] font-extrabold leading-[50px] text-[#111111] max-[640px]:text-[28px]">
    //     {result.title}
    //   </h1>

    //   <section className="flex items-start gap-10 max-[900px]:flex-col">
    //     <div
    //       className="
    //         w-[360px] min-h-[470px]
    //         border-2 border-[#ece7dd] rounded-[24px] bg-white
    //         flex flex-col items-center
    //         pt-[62px] px-[44px] pb-[41px]
    //         box-border shrink-0
    //         max-[900px]:w-full max-[900px]:max-w-[400px]
    //       "
    //     >
    //       <img
    //         src={result.imageSrc}
    //         alt={result.imageAlt}
    //         className="block mx-auto mb-[49px] max-w-[180px]"
    //       />

    //       <h2 className="m-0 mb-[14px] text-center text-[22px] font-bold leading-[28px] text-[#111111]">
    //         Core traits
    //       </h2>

    //       <ul className="m-0 pl-6 text-[18px] font-normal leading-[23px] text-[#555555]">
    //         {result.topTraits.map((trait) => (
    //           <li key={trait} className="mb-2">
    //             {trait}
    //           </li>
    //         ))}
    //       </ul>

    //       <p className="mt-4 text-[14px] text-[#8b6c00] italic text-center">
    //         {result.subtitle}
    //       </p>
    //     </div>

    //     <div className="flex-1 min-w-0 flex flex-col gap-[30px]">
    //       <div
    //         className="
    //           w-full min-h-[210px]
    //           border-2 border-[#ece7dd] rounded-[24px] bg-white
    //           pt-5 pr-10 pb-10 pl-[41px] box-border
    //           max-[640px]:px-5
    //         "
    //       >
    //         <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
    //           Description
    //         </h2>

    //         <p className="m-0 w-full text-[18px] font-normal leading-[23px] text-[#555555]">
    //           {result.description}
    //         </p>

    //         {result.whyThisArchetype && (
    //           <p className="mt-4 text-[16px] leading-[22px] text-[#6f6a60] italic">
    //             {result.whyThisArchetype}
    //           </p>
    //         )}
    //       </div>

    //       <div className="flex gap-10 max-[640px]:flex-col">
    //         <div
    //           className="
    //             flex-1 min-w-0 min-h-[230px]
    //             rounded-[24px] bg-[#fff9e8]
    //             border-2 border-[#eed892]
    //             pt-5 pr-8 pb-8 pl-10 box-border
    //             max-[640px]:pl-6
    //           "
    //         >
    //           <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
    //             Strengths
    //           </h2>

    //           <ul className="m-0 pl-6 text-[18px] font-normal leading-[23px] text-[#555555]">
    //             {result.strengths.map((item, i) => (
    //               <li key={i} className="mb-2">
    //                 {item}
    //               </li>
    //             ))}
    //           </ul>
    //         </div>

    //         <div
    //           className="
    //             flex-1 min-w-0 min-h-[230px]
    //             rounded-[24px] bg-[#f7f4ff]
    //             border-2 border-[#d8d1f2]
    //             pt-5 pr-8 pb-8 pl-10 box-border
    //             max-[640px]:pl-6
    //           "
    //         >
    //           <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
    //             Growth areas
    //           </h2>

    //           <ul className="m-0 pl-6 text-[18px] font-normal leading-[23px] text-[#555555]">
    //             {result.growthAreas.map((item, i) => (
    //               <li key={i} className="mb-2">
    //                 {item}
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       </div>

    //       <div
    //         className="
    //           w-full border-2 border-[#ece7dd] rounded-[24px] bg-white
    //           pt-5 pr-10 pb-10 pl-[41px] box-border
    //           max-[640px]:px-5
    //         "
    //       >
    //         <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
    //           Big Five Breakdown
    //         </h2>

    //         <div className="flex flex-col gap-5">
    //           {result.bigFive.map((trait) => (
    //             <div key={trait.key}>
    //               <div className="flex justify-between items-center mb-1">
    //                 <span className="text-[16px] font-semibold text-[#111]">
    //                   {trait.label}
    //                 </span>
    //                 <span className="text-[14px] font-bold text-[#8b6c00]">
    //                   {trait.score}%
    //                 </span>
    //               </div>

    //               <div className="w-full h-[10px] rounded-full bg-[#efefef] overflow-hidden">
    //                 <div
    //                   className="h-full rounded-full bg-[#f2c200] transition-all duration-500"
    //                   style={{ width: `${trait.score}%` }}
    //                 />
    //               </div>

    //               <p className="mt-1 mb-0 text-[14px] leading-[1.4] text-[#6f6a60]">
    //                 {trait.narrative}
    //               </p>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       <div className="flex gap-10 max-[640px]:flex-col">
    //         <div
    //           className="
    //             flex-1 min-w-0
    //             rounded-[24px] bg-[#eef8ff]
    //             border-2 border-[#c4dff0]
    //             pt-5 pr-8 pb-8 pl-10 box-border
    //             max-[640px]:pl-6
    //           "
    //         >
    //           <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
    //             Shadow archetype
    //           </h2>
    //           <p className="m-0 text-[18px] text-[#555]">
    //             {result.shadowArchetype}
    //           </p>
    //         </div>

    //         <div
    //           className="
    //             flex-1 min-w-0
    //             rounded-[24px] bg-[#fff5f5]
    //             border-2 border-[#f0c4c4]
    //             pt-5 pr-8 pb-8 pl-10 box-border
    //             max-[640px]:pl-6
    //           "
    //         >
    //           <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
    //             Development focus
    //           </h2>
    //           <p className="m-0 text-[18px] text-[#555]">
    //             {result.developmentFocus}
    //           </p>
    //         </div>
    //       </div>

    //       <div className="flex justify-center mt-4">
    //         <button
    //           type="button"
    //           onClick={handleRetake}
    //           className="
    //             w-[230px] h-[58px] border-2 border-[#f2c200]
    //             rounded-[12px] bg-white
    //             text-[#8b6c00] text-[16px] font-bold
    //             cursor-pointer transition-all duration-200
    //             hover:bg-[#fff9e8]
    //           "
    //         >
    //           RETAKE TEST
    //         </button>
    //       </div>
    //     </div>
    //   </section>
    // </main>
  );
};
