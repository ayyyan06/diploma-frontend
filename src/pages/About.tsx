import { NavLink } from "react-router-dom";
const ABOUT_FEATURES = [
  {
    value: "3",
    label: "interactive games",
    description:
      "Personality, animal-temperament, and conflict-style journeys inspired by Kazakh motifs.",
  },
  {
    value: "5-10 min",
    label: "to complete",
    description:
      "Short, playful sessions built for curiosity, reflection, and shareable results.",
  },
  {
    value: "100%",
    label: "culture-centered",
    description:
      "Every path is shaped by symbols, stories, and emotional tones from the steppe.",
  },
];

const ABOUT_PATHS = [
  {
    title: "Archetype stories",
    description: "Batyr, Zhyrau, Aldar Kose, Shanyraq Keeper archetypes.",
  },
  {
    title: "Animal temperament lens",
    description: "Eagle, horse, wolf, snow leopard psychology mapping.",
  },
  {
    title: "Weapon symbolism",
    description: "Bow, spear, saber, shield conflict styles.",
  },
];

const ABOUT_STEPS = [
  {
    number: "01",
    title: "Choose a path",
    description: "Pick personality, animal or weapon journey.",
  },
  {
    number: "02",
    title: "Answer questions",
    description: "Symbolic scenarios and choices.",
  },
  {
    number: "03",
    title: "Get result",
    description: "Personal archetype card and insights.",
  },
];

export const About = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fffdf7] to-[#fff9eb] pb-20">
      <main className="mx-auto mt-10 max-w-6xl px-6">
        {/* HERO */}
        <section className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8b6c00]">
              About Ruh Compass
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text -5xl">
              A cultural journey through Kazakh archetypes, symbols, and stories
            </h1>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Ruh Compass explores personality through steppe-inspired
              storytelling instead of generic labels.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "Kazakh storytelling",
                "Interactive experience",
                "Personality insights",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-yellow-300 bg-white px-4 py-2 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-white">
                Start Test
              </button>

              <NavLink
                to="/games"
                className="rounded-xl border px-6 py-3 font-semibold"
              >
                Explore Games
              </NavLink>
            </div>
          </div>

          <div className="relative rounded-3xl border bg-white p-6 shadow-xl">
            <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-yellow-700 shadow">
              Steppe spirit, modern play
            </div>

            <img
              src="/images/reading-boy.svg"
              alt=""
              className="mx-auto mt-16 w-[320px]"
            />
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {ABOUT_FEATURES.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border bg-white p-6 shadow"
            >
              <div className="text-3xl font-extrabold">{f.value}</div>
              <div className="mt-2 text-xl font-semibold">{f.label}</div>
              <p className="mt-3 text-gray-600">{f.description}</p>
            </div>
          ))}
        </section>

        {/* STORY */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow">
            <p className="text-xs font-bold uppercase text-yellow-700">
              Why we made it
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Personality feels richer when it is cultural
            </h2>

            <p className="mt-4 text-gray-600">
              Built to make self-discovery warm, symbolic, and memorable.
            </p>
          </div>

          <div className="space-y-4">
            {ABOUT_PATHS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border bg-white p-6 shadow"
              >
                <div className="text-xl font-bold">{p.title}</div>
                <p className="mt-2 text-gray-600">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STEPS */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold">How it works</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {ABOUT_STEPS.map((s) => (
              <div
                key={s.number}
                className="rounded-2xl border bg-white p-6 shadow"
              >
                <div className="text-yellow-600 font-bold text-xl">
                  {s.number}
                </div>
                <div className="mt-2 text-xl font-bold">{s.title}</div>
                <p className="mt-2 text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 flex flex-col justify-between gap-6 rounded-2xl border bg-white p-6 shadow lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-yellow-700">
              Ready to try
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Start your archetype journey today
            </h2>
          </div>

          <button className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-white">
            Go To Tests
          </button>
        </section>
      </main>
    </div>
  );
};
