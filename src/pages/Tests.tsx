import { NavLink } from "react-router-dom";

const TESTS = [
  {
    title: "What's your personality?",
    desc: `A psychological test based on Big Five, mapped to Kazakh archetypes.`,
    img: "/images/card1.svg",
    to: "/tests/personality",
  },
  {
    title: "What's your animal?",
    desc: `Eysenck temperament mapped to Kazakh animals.`,
    img: "/images/card2.svg",
    to: "/tests/animal",
  },
  {
    title: "What's your weapon?",
    desc: `Conflict style based on Thomas-Kilmann model.`,
    img: "/images/card3.svg",
    to: "/tests/weapon",
  },
  {
    title: "Which color is yours?",
    desc: `Color psychology inspired by Luscher test.`,
    img: "/images/card4.svg",
    to: "/tests/color",
  },
];

export const Tests = () => {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <h1 className="mb-12 text-center text-3xl font-normal">
        Choose what Test you want to start
      </h1>

      <section
        className="
        grid justify-center gap-y-10
        sm:grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-x-10 lg:gap-x-[120px]
      "
      >
        {TESTS.map((test) => (
          <NavLink
            key={test.title}
            to={test.to}
            className="group flex max-w-[260px] flex-col items-center text-center"
          >
            <img
              src={test.img}
              alt={test.title}
              className="mb-2 w-full max-w-[250px] transition-transform group-hover:-translate-y-1"
            />

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
