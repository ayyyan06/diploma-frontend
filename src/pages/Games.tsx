import { NavLink } from "react-router-dom";

const GAMES = [
  {
    title: "Bauyrsaq's adventure",
    desc: `A playful platformer where bauyrsaq jumps, rolls and avoids obstacles.`,
    img: "/images/card1.svg",
    to: "bauyrsaq",
  },
  {
    title: "Tulpar Dash",
    desc: `A fast-paced steppe runner game inspired by legendary horses.`,
    img: "/images/card2.svg",
    to: "tulpar",
  },
  {
    title: "Coming soon",
    desc: `Another mini-game is in development. Stay tuned.`,
    img: "/images/card3.svg",
    to: "#",
    disabled: true,
  },
];

export const Games = () => {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <h1 className="mb-12 text-center text-3xl font-normal">
        Choose what Game you want to start
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
        {GAMES.map((game) =>
          game.disabled ? (
            <div
              key={game.title}
              className="flex max-w-[260px] flex-col items-center text-center opacity-60"
            >
              <img
                src={game.img}
                alt={game.title}
                className="mb-2 w-full max-w-[250px]"
              />

              <h2 className="text-xl font-normal">{game.title}</h2>

              <p className="mt-2 text-sm font-light text-gray-600">
                {game.desc}
              </p>
            </div>
          ) : (
            <NavLink
              key={game.title}
              to={game.to}
              className="group flex max-w-[260px] flex-col items-center text-center"
            >
              <img
                src={game.img}
                alt={game.title}
                className="mb-2 w-full max-w-[250px] transition-transform group-hover:-translate-y-1"
              />

              <h2 className="text-xl font-normal transition-colors group-hover:text-[#8b6c00]">
                {game.title}
              </h2>

              <p className="mt-2 text-sm font-light text-gray-600">
                {game.desc}
              </p>
            </NavLink>
          ),
        )}
      </section>
    </div>
  );
};
