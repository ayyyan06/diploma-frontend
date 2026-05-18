import { NavLink } from "react-router-dom";

const GAMES = [
  {
    title: "Bauyrsaq's adventure",
    desc: `A playful platformer where bauyrsaq jumps, rolls and avoids obstacles.`,
    img: "/images/baursak-img.png",
    to: "bauyrsaq",
    disabled: false,
  },
  {
    title: "Tulpar Dash",
    desc: `A fast-paced steppe runner game inspired by legendary horses.`,
    img: "/images/tulpar-img.png",
    to: "tulpar",
    disabled: false,
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
          flex flex-wrap justify-center gap-x-20 gap-y-10
        "
      >
        {GAMES.map((game) =>
          game.disabled ? (
            <div
              key={game.title}
              className="flex max-w-[260px] flex-col items-center text-center opacity-60"
            >
              <div className="mb-3 h-[200px] w-[200px] overflow-hidden rounded-3xl bg-gray-100">
                <img
                  src={game.img}
                  alt={game.title}
                  className="h-full w-full object-cover"
                />
              </div>

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
              <div className="mb-3 h-[200px] w-[200px] overflow-hidden rounded-3xl bg-gray-100">
                <img
                  src={game.img}
                  alt={game.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

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
