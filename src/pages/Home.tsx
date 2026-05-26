import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Home = () => {
  const { t } = useTranslation();
  const features = t("home.features", { returnObjects: true }) as Array<{
    value: string;
    label: string;
    description: string;
  }>;
  const paths = t("home.paths", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;
  const steps = t("home.steps", { returnObjects: true }) as Array<{
    number: string;
    title: string;
    description: string;
  }>;
  const heroTags = t("home.heroTags", { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen w-full pb-20">
      <main className="mx-auto mt-10 max-w-6xl px-6">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8b6c00]">
              {t("home.eyebrow")}
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text -5xl">
              {t("home.title")}
            </h1>

            <p className="mt-6 leading-relaxed text-gray-600">
              {t("home.description")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {heroTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-yellow-300 bg-white px-4 py-2 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <NavLink
                to="/tests"
                className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-white"
              >
                {t("header.startTest")}
              </NavLink>

              <NavLink
                to="/games"
                className="rounded-xl border px-6 py-3 font-semibold"
              >
                {t("home.exploreGames")}
              </NavLink>
            </div>
          </div>

          <div className="relative rounded-3xl border bg-white p-6 shadow-xl">
            <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-yellow-700 shadow">
              {t("home.heroBadge")}
            </div>

            <img
              src="/images/reading-boy.svg"
              alt=""
              className="mx-auto mt-16 w-[320px]"
            />
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="rounded-2xl border bg-white p-6 shadow"
            >
              <div className="text-3xl font-extrabold">{feature.value}</div>
              <div className="mt-2 text-xl font-semibold">{feature.label}</div>
              <p className="mt-3 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow">
            <p className="text-xs font-bold uppercase text-yellow-700">
              {t("home.storyEyebrow")}
            </p>

            <h2 className="mt-2 text-2xl font-bold">{t("home.storyTitle")}</h2>

            <p className="mt-4 text-gray-600">{t("home.storyDescription")}</p>
          </div>

          <div className="space-y-4">
            {paths.map((path) => (
              <div
                key={path.title}
                className="rounded-2xl border bg-white p-6 shadow"
              >
                <div className="text-xl font-bold">{path.title}</div>
                <p className="mt-2 text-gray-600">{path.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">{t("home.stepsTitle")}</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border bg-white p-6 shadow"
              >
                <div className="text-xl font-bold text-yellow-600">
                  {step.number}
                </div>
                <div className="mt-2 text-xl font-bold">{step.title}</div>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 flex flex-col justify-between gap-6 rounded-2xl border bg-white p-6 shadow lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-yellow-700">
              {t("home.ctaEyebrow")}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{t("home.ctaTitle")}</h2>
          </div>

          <NavLink
            to="/tests"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-white"
          >
            {t("home.ctaButton")}
          </NavLink>
        </section>
      </main>
    </div>
  );
};
