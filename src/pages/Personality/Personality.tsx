import { useNavigate } from "react-router-dom";

export const PersonalityTestIntroPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/tests/personality-questions");
  };

  return (
    <>
      <main className="mt-[74px] mx-[110px] mb-[150px]">
        <section
          className="
            w-[1220px]
            h-[580px]
            box-border
            border-2 border-[#ECE7DD]
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
          <div className="w-[580px] h-[450px]">
            <p
              className="
                m-0
                mb-[20px]
                text-[14px]
                font-normal
                leading-[18px]
                text-[#7A7A7A]
              "
            >
              STEP 1 · BEFORE YOU BEGIN
            </p>

            <h1
              className="
                m-0
                mb-[31px]
                text-[40px]
                font-bold
                leading-[50px]
              "
            >
              What's your personality?
            </h1>

            <p
              className="
                m-0
                mb-[63px]
                w-[595px]
                text-[16px]
                font-normal
                leading-[20px]
              "
            >
              After passing this test, you can find out your personality type by
              Kazakh culture. Rather, find out if you are a batyr, khan, zhyrau
              or someone else.
            </p>

            <div className="flex gap-[20px] mb-[54px]">
              <div
                className="
                  w-[180px]
                  h-[116px]
                  rounded-[18px]
                  pt-[18px]
                  pr-[17px]
                  pb-[38px]
                  pl-[16px]
                  box-border
                  bg-[#FFF9E8]
                "
              >
                <h3
                  className="
                    m-0
                    mb-[9px]
                    text-[22px]
                    font-bold
                    leading-[28px]
                    text-[#111111]
                  "
                >
                  5–10 min
                </h3>

                <p
                  className="
                    m-0
                    text-[18px]
                    font-normal
                    leading-[23px]
                    text-[#555555]
                  "
                >
                  Average duration
                </p>
              </div>

              <div
                className="
                  w-[180px]
                  h-[116px]
                  rounded-[18px]
                  pt-[18px]
                  pr-[17px]
                  pb-[38px]
                  pl-[16px]
                  box-border
                  bg-[#F7F4FF]
                "
              >
                <h3
                  className="
                    m-0
                    mb-[9px]
                    text-[22px]
                    font-bold
                    leading-[28px]
                    text-[#111111]
                  "
                >
                  8 Qs
                </h3>

                <p
                  className="
                    m-0
                    text-[18px]
                    font-normal
                    leading-[23px]
                    text-[#555555]
                  "
                >
                  Questions &
                  <br />
                  scenarios
                </p>
              </div>

              <div
                className="
                  w-[180px]
                  h-[116px]
                  rounded-[18px]
                  pt-[18px]
                  pr-[17px]
                  pb-[38px]
                  pl-[16px]
                  box-border
                  bg-[#EEF8FF]
                "
              >
                <h3
                  className="
                    m-0
                    mb-[9px]
                    text-[22px]
                    font-bold
                    leading-[28px]
                    text-[#111111]
                  "
                >
                  1 Result
                </h3>

                <p
                  className="
                    m-0
                    text-[18px]
                    font-normal
                    leading-[23px]
                    text-[#555555]
                  "
                >
                  Your Kazakh
                  <br />
                  archetype
                </p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="
                w-[230px]
                h-[58px]
                border-none
                rounded-[12px]
                bg-[#F2B705]
                text-white
                text-[16px]
                font-bold
                leading-[20px]
                cursor-pointer
              "
            >
              START TEST
            </button>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="/images/personality-boy-large.svg"
              alt="Personality character"
              className="block"
            />
          </div>
        </section>
      </main>
    </>
  );
};
