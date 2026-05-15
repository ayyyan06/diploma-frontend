import { useNavigate } from "react-router-dom";
import { TEST_INTRO_CONTENT } from "../../data/testIntros";

const TONE_STYLES: any = {
  duration: "bg-[rgba(255,249,232,1)]",
  format: "bg-[rgba(247,244,255,1)]",
  result: "bg-[rgba(238,248,255,1)]",
};

export const AnimalIntroPage = () => {
  const navigate = useNavigate();
  const { title, description, imageSrc, imageAlt, infoBoxes } =
    TEST_INTRO_CONTENT.animal;

  return (
    <main className="mx-[110px] mb-[150px] mt-[74px] max-[1280px]:mx-8 max-[768px]:mx-4">
      <section
        className="
          flex
          min-h-[580px]
          w-full
          max-w-[1220px]
          items-center
          justify-between
          rounded-[28px]
          border-2
          border-[rgba(236,231,221,1)]
          bg-white
          px-[50px]
          pb-[68px]
          pr-[103px]
          pt-[62px]
          max-[1100px]:flex-col
          max-[1100px]:gap-10
          max-[1100px]:px-8
          max-[1100px]:py-10
          max-[768px]:px-5
        "
      >
        {/* Left */}
        <div className="max-w-[595px]">
          <p className="mb-5 text-[14px] font-normal leading-[18px] text-[rgba(122,122,122,1)]">
            STEP 1 · BEFORE YOU BEGIN
          </p>

          <h1 className="mb-[31px] text-[40px] font-bold leading-[50px] max-[768px]:text-[32px] max-[768px]:leading-[40px]">
            {title}
          </h1>

          <p className="mb-[63px] text-[16px] font-normal leading-[20px] text-[#555555] max-[768px]:mb-10">
            {description}
          </p>

          {/* Info boxes */}
          <div className="mb-[54px] flex gap-5 max-[768px]:flex-col">
            {infoBoxes.map(({ tone, value, label }) => (
              <div
                key={tone}
                className={`box-border h-[116px] w-[180px] rounded-[18px] px-4 pb-[38px] pt-[18px] ${TONE_STYLES[tone]}`}
              >
                <h3 className="mb-[9px] text-[22px] font-bold leading-[28px] text-[#111111]">
                  {value}
                </h3>
                <p className="text-[18px] font-normal leading-[23px] text-[#555555]">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/tests/animal-questions")}
            className="
              h-[58px]
              w-[230px]
              rounded-[12px]
              border-none
              bg-[rgba(242,183,5,1)]
              text-[16px]
              font-bold
              leading-[20px]
              text-white
              transition-opacity
              duration-200
              hover:opacity-90
            "
          >
            START TEST
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center justify-center">
          <img src={imageSrc} alt={imageAlt} className="block max-w-full" />
        </div>
      </section>
    </main>
  );
};
