import { NavLink } from "react-router-dom";

const TESTS = [
  {
    title: "What's your personality?",
    desc: `A psychological test based on Big Five, mapped to Kazakh archetypes.`,
    img: "/images/card1.svg",
    to: "/tests/personality-intro",
    imageMode: "contain",
  },
  {
    title: "What's your animal?",
    desc: `Eysenck temperament mapped to Kazakh animals.`,
    img: "/images/card2.svg",
    to: "/tests/animal-intro",
    imageMode: "contain",
  },
  {
    title: "What's your weapon?",
    desc: `Conflict style based on Thomas-Kilmann model.`,
    img: "/images/card3.svg",
    to: "/tests/weapon-intro",
    imageMode: "contain",
  },
  {
    title: "Who's Your Enemy?",
    desc: `A scenario test based on Klaus Grawe's four basic psychological needs.`,
    img: "/images/enemy-card.svg",
    to: "/tests/enemy-intro",
    imageMode: "cover",
  },
];

export const Tests = () => {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <h1 className="mb-12 text-center text-3xl font-normal">
        Choose which test you want to start
      </h1>

      <section
        className="
        grid justify-center gap-y-10
        sm:grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-x-10 lg:gap-x-[70px]
      "
      >
        {TESTS.map((test) => (
          <NavLink
            key={test.title}
            to={test.to}
            className="group flex max-w-[260px] flex-col items-center text-center"
          >
            <div className="mb-2 w-full max-w-[250px] aspect-square overflow-hidden rounded-[38px] bg-[#f6f3eb]">
              <img
                src={test.img}
                alt={test.title}
                className={`h-full w-full transition-transform group-hover:-translate-y-1 ${
                  test.imageMode === "cover" ? "object-cover" : "object-contain"
                }`}
              />
            </div>

            <h2 className="text-xl font-normal transition-colors group-hover:text-[#8b6c00]">
              {test.title}
            </h2>

            <p className="mt-2 text-sm font-light leading-[18px] text-gray-600">
              {test.desc}
            </p>
          </NavLink>
        ))}
      </section>
    </div>
  );
};
