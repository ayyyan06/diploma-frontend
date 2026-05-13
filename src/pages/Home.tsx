import { NavLink } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <main className="mx-auto mt-[133px] flex w-full max-w-[1021px] items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex w-[533px] flex-col items-start">
          {/* TOP LINE */}
          <div className="mb-[15px] flex items-center gap-[23px]">
            <img
              src="/images/kazakhstan-flag.svg"
              alt="Kazakhstan flag"
              className="h-[29px]"
            />

            <span className="text-[13px] text-[#6a6a6a]">
              JOIN THOUSANDS DISCOVERING THEIR CULTURAL ARCHETYPE
            </span>
          </div>

          {/* TITLE */}
          <h1 className="mb-[14px] text-[50px] font-extrabold leading-[63px]">
            DISCOVER YOURSELF <br />
            THROUGH KAZAKH <br />
            ARCHETYPES
          </h1>

          {/* DESCRIPTION */}
          <p className="mb-[10px] w-[445px] text-[17px] leading-[29px]">
            A gamified personality journey inspired by the spirit of the steppe,
            nomadic heritage, and Kazakh traditions.
          </p>

          {/* POINTS */}
          <div className="mb-[28px] flex flex-col gap-0">
            {[
              "5–10 minute interactive test",
              "Archetypes inspired by Kazakh culture",
              "Personal profile and insights",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-[9px] text-[17px] text-[#6a6a6a]"
              >
                <span className="h-[15px] w-[15px] rounded-full bg-[#ffd800]" />
                {text}
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <NavLink
            to="/tests"
            className="flex h-[67px] w-[361px] items-center justify-center rounded-[10px] bg-[#ffd800] text-[20px] font-extrabold tracking-[2px] text-white"
          >
            START TEST
          </NavLink>
        </div>

        {/* RIGHT */}
        <div className="flex items-center">
          <img
            src="/images/reading-boy.svg"
            alt="Reading boy"
            className="block"
          />
        </div>
      </main>

      {/* BOTTOM LINE */}
      <div className="mx-auto mt-[75px] h-[1px] w-[1176px] bg-black" />
    </div>
  );
};
