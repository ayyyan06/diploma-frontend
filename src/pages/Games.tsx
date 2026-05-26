import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const GAMES = [
  {
    img: "/images/baursak-img.png",
    to: "bauyrsaq",
    disabled: false,
  },
  {
    img: "/images/tulpar-img.png",
    to: "tulpar",
    disabled: false,
  },
];

export const Games = () => {
  const { t } = useTranslation();
  const games = t("games.items", { returnObjects: true }) as Array<{
    title: string;
    desc: string;
  }>;

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <h1 className="mb-12 text-center text-3xl font-normal">
        {t("games.title")}
      </h1>

      <section className="flex flex-wrap justify-center gap-x-20 gap-y-10">
        {GAMES.map((game, index) => {
          const content = games[index];

          return game.disabled ? (
            <div
              key={content.title}
              className="flex max-w-[260px] flex-col items-center text-center opacity-60"
            >
              <div className="mb-3 h-[200px] w-[200px] overflow-hidden rounded-3xl bg-gray-100">
                <img
                  src={game.img}
                  alt={content.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="text-xl font-normal">{content.title}</h2>

              <p className="mt-2 text-sm font-light text-gray-600">
                {content.desc}
              </p>
            </div>
          ) : (
            <NavLink
              key={content.title}
              to={game.to}
              className="group flex max-w-[260px] flex-col items-center text-center"
            >
              <div className="mb-3 h-[200px] w-[200px] overflow-hidden rounded-3xl bg-gray-100">
                <img
                  src={game.img}
                  alt={content.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h2 className="text-xl font-normal transition-colors group-hover:text-[#8b6c00]">
                {content.title}
              </h2>

              <p className="mt-2 text-sm font-light text-gray-600">
                {content.desc}
              </p>
            </NavLink>
          );
        })}
      </section>
    </div>
  );
};
