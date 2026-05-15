import { useNavigate } from "react-router-dom";


const PersonalityTestIntroPage = () => {
    const navigate = useNavigate();

  const handleStart = () => {
    navigate("/tests/animal-questions");
  };
  return (
    <> 
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
              What's your personality?
            </h1>

            <p className="mb-[63px] text-[16px] font-normal leading-[20px] text-[#555555] max-[768px]:mb-10">
              After passing this test, you can find out your
              personality type by Kazakh culture. Rather, find out
              if you are a batyr, khan, zhyrau or someone else.
            </p>

            {/* Info boxes */}
            <div className="mb-[54px] flex gap-5 max-[768px]:flex-col">
              <div className="box-border h-[116px] w-[180px] rounded-[18px] bg-[rgba(255,249,232,1)] px-4 pb-[38px] pt-[18px]">
                <h3 className="mb-[9px] text-[22px] font-bold leading-[28px] text-[#111111]">
                  5–10 min
                </h3>

                <p className="text-[18px] font-normal leading-[23px] text-[#555555]">
                  Average duration
                </p>
              </div>

              <div className="box-border h-[116px] w-[180px] rounded-[18px] bg-[rgba(247,244,255,1)] px-4 pb-[38px] pt-[18px]">
                <h3 className="mb-[9px] text-[22px] font-bold leading-[28px] text-[#111111]">
                  8 Qs
                </h3>

                <p className="text-[18px] font-normal leading-[23px] text-[#555555]">
                  Questions &
                  <br />
                  scenarios
                </p>
              </div>

              <div className="box-border h-[116px] w-[180px] rounded-[18px] bg-[rgba(238,248,255,1)] px-4 pb-[38px] pt-[18px]">
                <h3 className="mb-[9px] text-[22px] font-bold leading-[28px] text-[#111111]">
                  1 Result
                </h3>

                <p className="text-[18px] font-normal leading-[23px] text-[#555555]">
                  Your Kazakh
                  <br />
                  archetype
                </p>
              </div>
            </div>

            <button
            onClick={handleStart}
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
            <img
              src="/images/personality-boy-large.svg"
              alt="Personality character"
              className="block max-w-full"
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default PersonalityTestIntroPage;