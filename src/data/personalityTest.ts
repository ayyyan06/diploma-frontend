const PERSONALITY_TEST_STORAGE_KEY = "qazaqweb-personality-test-result";

export const BIG_FIVE_TRAITS = [
  {
    key: "openness",
    label: "Openness",
    shortLabel: "O",
    description: "curiosity, imagination, symbolic thinking",
  },
  {
    key: "conscientiousness",
    label: "Conscientiousness",
    shortLabel: "C",
    description: "discipline, reliability, structure",
  },
  {
    key: "extraversion",
    label: "Extraversion",
    shortLabel: "E",
    description: "assertiveness, social energy, visible action",
  },
  {
    key: "agreeableness",
    label: "Agreeableness",
    shortLabel: "A",
    description: "care, cooperation, warmth",
  },
  {
    key: "neuroticism",
    label: "Neuroticism",
    shortLabel: "N",
    description: "stress sensitivity, emotional reactivity",
  },
];

export const PERSONALITY_SCALE_OPTIONS = [
  {
    id: "strongly-disagree",
    label: "Strongly disagree",
    score: 1,
  },
  {
    id: "somewhat-disagree",
    label: "Somewhat disagree",
    score: 2,
  },
  {
    id: "somewhat-agree",
    label: "Somewhat agree",
    score: 3,
  },
  {
    id: "strongly-agree",
    label: "Strongly agree",
    score: 4,
  },
];

export const PERSONALITY_ITEMS = [
  {
    id: 1,
    title: "When uncertainty rises, I usually step forward instead of waiting.",
    prompt: "Answer as you are most of the time, not as you wish to be.",
    trait: "extraversion",
  },
  {
    id: 2,
    title: "I am drawn to symbols, stories, and meanings beneath the surface.",
    trait: "openness",
  },
  {
    id: 3,
    title:
      "If I promise something, I usually follow through even when it is difficult.",
    trait: "conscientiousness",
  },
  {
    id: 4,
    title:
      "I notice quickly when someone nearby feels left out, hurt, or unsafe.",
    trait: "agreeableness",
  },
  {
    id: 5,
    title: "Stress can stay in my thoughts or body longer than I want.",
    trait: "neuroticism",
  },
  {
    id: 6,
    title: "In groups, I often hold back instead of taking visible space.",
    trait: "extraversion",
    reverse: true,
  },
  {
    id: 7,
    title: "I prefer familiar methods over experimenting with a new angle.",
    trait: "openness",
    reverse: true,
  },
  {
    id: 8,
    title: "I often act first and trust myself to organize the details later.",
    trait: "conscientiousness",
    reverse: true,
  },
  {
    id: 9,
    title:
      "In conflict, proving my point matters more to me than preserving warmth.",
    trait: "agreeableness",
    reverse: true,
  },
  {
    id: 10,
    title: "When plans collapse, I usually stay emotionally steady.",
    trait: "neuroticism",
    reverse: true,
  },
  {
    id: 11,
    title:
      "I feel more alive after active exchange and action than after long isolation.",
    trait: "extraversion",
  },
  {
    id: 12,
    title:
      "I enjoy rethinking rules, patterns, and accepted ideas from unusual angles.",
    trait: "openness",
  },
  {
    id: 13,
    title:
      "I work best when I can turn values into structure, habit, and follow-through.",
    trait: "conscientiousness",
  },
  {
    id: 14,
    title:
      "People often trust me to keep a group connected, safe, or emotionally warm.",
    trait: "agreeableness",
  },
  {
    id: 15,
    title: "Betrayal, uncertainty, or emotional tension affects me strongly.",
    trait: "neuroticism",
  },
];

export const PERSONALITY_ARCHETYPE_PROFILES: any = {
  batyr: {
    key: "batyr",
    title: "Batyr - The Hero",
    subtitle: "Jungian analogue: Hero",
    imageSrc: "/images/batyr.svg",
    imageAlt: "Batyr archetype result",
    tagline: "Action, courage, and duty under pressure.",
    description:
      "The Batyr profile reflects a person who meets difficulty by acting, protecting, and carrying responsibility. In Jungian terms this is the Hero pattern, expressed through Kazakh cultural memory as the defender who steps forward when the group needs strength.",
    strengths: [
      "steps into responsibility instead of freezing",
      "can turn pressure into decisive movement",
      "protects others when stakes become real",
    ],
    growthAreas: [
      "may over-identify with being strong all the time",
      "can move too quickly before listening deeply",
      "may hide vulnerability behind competence",
    ],
    targets: {
      openness: 56,
      conscientiousness: 82,
      extraversion: 78,
      agreeableness: 58,
      neuroticism: 24,
    },
  },
  zhyrau: {
    key: "zhyrau",
    title: "Zhyrau - The Sage",
    subtitle: "Jungian analogue: Sage",
    imageSrc: "/images/zhyrau.svg",
    imageAlt: "Zhyrau archetype result",
    tagline: "Meaning, reflection, and long-range insight.",
    description:
      "The Zhyrau profile reflects the Sage: the one who observes, interprets, and gives language to what others feel but cannot yet explain. In Kazakh culture, the zhyrau preserves memory and turns lived experience into meaning, guidance, and perspective.",
    strengths: [
      "sees patterns and meanings others miss",
      "thinks before speaking or acting",
      "can guide through insight rather than force",
    ],
    growthAreas: [
      "may stay in reflection longer than action requires",
      "can become too distant from immediate realities",
      "may overcomplicate simple emotional needs",
    ],
    targets: {
      openness: 88,
      conscientiousness: 60,
      extraversion: 38,
      agreeableness: 66,
      neuroticism: 40,
    },
  },
  shanyraq: {
    key: "shanyraq",
    title: "Shanyraq Keeper - The Mother",
    subtitle: "Jungian analogue: Mother",
    imageSrc: "/images/shanyraqkeeper.svg",
    imageAlt: "Shanyraq Keeper archetype result",
    tagline: "Care, protection, and emotional holding.",
    description:
      "The Shanyraq Keeper profile reflects the Mother archetype: the person who creates continuity, warmth, and relational safety. In Kazakh symbolism, the shanyraq is the center that holds the home together, so this archetype expresses care not as softness alone, but as emotional structure.",
    strengths: [
      "builds trust and belonging naturally",
      "senses emotional atmosphere quickly",
      "supports people with steadiness and care",
    ],
    growthAreas: [
      "may over-function for everyone else",
      "can postpone conflict to preserve harmony",
      "may carry more emotional labor than is fair",
    ],
    targets: {
      openness: 52,
      conscientiousness: 74,
      extraversion: 50,
      agreeableness: 90,
      neuroticism: 46,
    },
  },
  aldarKose: {
    key: "aldarKose",
    title: "Aldar Kose - The Trickster",
    subtitle: "Jungian analogue: Trickster",
    imageSrc: "/images/aldarkose.svg",
    imageAlt: "Aldar Kose archetype result",
    tagline: "Cleverness, adaptability, and rule-bending insight.",
    description:
      "The Aldar Kose profile reflects the Trickster: psychologically flexible, observant, and hard to trap inside rigid expectations. In Kazakh folklore, Aldar Kose survives not through force but through wit, timing, and the ability to expose arrogance or greed by thinking sideways.",
    strengths: [
      "adapts quickly when systems stop making sense",
      "spots hypocrisy, weak logic, and hidden openings",
      "uses humor and intelligence to disarm pressure",
    ],
    growthAreas: [
      "may resist structure even when it would help",
      "can treat seriousness as something to evade",
      "may protect autonomy so strongly that trust becomes harder",
    ],
    targets: {
      openness: 84,
      conscientiousness: 34,
      extraversion: 68,
      agreeableness: 36,
      neuroticism: 42,
    },
  },
};

const TRAIT_WEIGHTS: any = {
  openness: 1,
  conscientiousness: 1.05,
  extraversion: 1,
  agreeableness: 1,
  neuroticism: 0.95,
};

const getScaleScore = (optionId: any) =>
  PERSONALITY_SCALE_OPTIONS.find((option) => option.id === optionId)?.score ||
  1;

const getTraitMeta = (traitKey: any) =>
  BIG_FIVE_TRAITS.find((trait) => trait.key === traitKey) || BIG_FIVE_TRAITS[0];

const getNormalizedScore = (averageScore: any) =>
  Math.round(((averageScore - 1) / 3) * 100);

const getTraitLevel = (score: any) => {
  if (score >= 67) {
    return "high";
  }

  if (score <= 33) {
    return "low";
  }

  return "moderate";
};

const getTraitNarrative = (traitKey: any, score: any) => {
  const level = getTraitLevel(score);

  const narratives: any = {
    openness: {
      high: "You are psychologically open to ambiguity, symbolism, and unusual perspectives.",
      moderate:
        "You balance imagination with practicality and can move between novelty and familiarity.",
      low: "You tend to trust proven paths, direct realities, and what already feels grounded.",
    },
    conscientiousness: {
      high: "You rely on structure, self-control, and follow-through to create stability.",
      moderate:
        "You can organize when needed, but you do not want structure to control everything.",
      low: "You prefer flexibility over routine and may resist systems that feel too constraining.",
    },
    extraversion: {
      high: "You move outward under pressure and often meet life through visible action or expression.",
      moderate:
        "You can be socially engaged or private depending on context, energy, and trust.",
      low: "You process more inwardly and may prefer depth, privacy, and observation before action.",
    },
    agreeableness: {
      high: "You orient strongly toward care, cooperation, and the emotional needs of others.",
      moderate:
        "You value both warmth and honesty, and you can balance care with self-protection.",
      low: "You prioritize autonomy, candor, and skepticism over immediate harmony or accommodation.",
    },
    neuroticism: {
      high: "You feel emotional pressure strongly, which can deepen empathy but also increase strain.",
      moderate:
        "You experience stress clearly, but it does not dominate your whole psychological style.",
      low: "You tend to stay internally steady under stress and are less easily pulled into emotional turbulence.",
    },
  };

  return narratives[traitKey][level];
};

const getArchetypeMatch = (bigFiveScores: any, archetype: any) =>
  BIG_FIVE_TRAITS.reduce((distance, trait) => {
    const weight = TRAIT_WEIGHTS[trait.key] || 1;
    const targetScore = archetype.targets[trait.key];

    return distance + Math.abs(bigFiveScores[trait.key] - targetScore) * weight;
  }, 0);

const getTopTraitKeys = (bigFiveScores: any) =>
  [...BIG_FIVE_TRAITS]
    .map((trait) => ({ key: trait.key, score: bigFiveScores[trait.key] }))
    .sort((left, right) => right.score - left.score)
    .map((trait) => trait.key);

const buildWhyThisArchetype = (
  archetype: any,
  topTraits: any,
  bigFiveScores: any,
) => {
  const firstTrait = getTraitMeta(topTraits[0]);
  const secondTrait = getTraitMeta(topTraits[1]);

  return `${archetype.title} fits best because your profile leans most strongly toward ${firstTrait.label.toLowerCase()} and ${secondTrait.label.toLowerCase()}. ${getTraitNarrative(
    firstTrait.key,
    bigFiveScores[firstTrait.key],
  )}`;
};

export const buildPersonalityTestResult = (selectedAnswers: any) => {
  const traitTotals = BIG_FIVE_TRAITS.reduce((totals: any, trait: any) => {
    totals[trait.key] = 0;
    return totals;
  }, {});

  const traitCounts = BIG_FIVE_TRAITS.reduce((counts: any, trait: any) => {
    counts[trait.key] = 0;
    return counts;
  }, {});

  PERSONALITY_ITEMS.forEach((item) => {
    const selectedOptionId = selectedAnswers[item.id];
    const rawScore = getScaleScore(selectedOptionId);
    const score = item.reverse ? 5 - rawScore : rawScore;

    traitTotals[item.trait] += score;
    traitCounts[item.trait] += 1;
  });

  const bigFiveScores = BIG_FIVE_TRAITS.reduce((scores: any, trait: any) => {
    const averageScore = traitTotals[trait.key] / traitCounts[trait.key];
    scores[trait.key] = getNormalizedScore(averageScore);
    return scores;
  }, {});

  const archetypeEntries = Object.values(PERSONALITY_ARCHETYPE_PROFILES).map(
    (archetype: any) => ({
      ...archetype,
      matchDistance: getArchetypeMatch(bigFiveScores, archetype),
    }),
  );

  archetypeEntries.sort(
    (left, right) => left.matchDistance - right.matchDistance,
  );

  const leadingArchetype = archetypeEntries[0];
  const shadowArchetype = archetypeEntries[1];
  const topTraitKeys = getTopTraitKeys(bigFiveScores);
  const lowestTraitKey = [...topTraitKeys].reverse()[0];

  return {
    archetypeKey: leadingArchetype.key,
    title: leadingArchetype.title,
    subtitle: leadingArchetype.subtitle,
    imageSrc: leadingArchetype.imageSrc,
    imageAlt: leadingArchetype.imageAlt,
    tagline: leadingArchetype.tagline,
    description: leadingArchetype.description,
    strengths: leadingArchetype.strengths,
    growthAreas: leadingArchetype.growthAreas,
    whyThisArchetype: buildWhyThisArchetype(
      leadingArchetype,
      topTraitKeys,
      bigFiveScores,
    ),
    shadowArchetype: shadowArchetype.title,
    topTraits: topTraitKeys
      .slice(0, 2)
      .map((traitKey) => getTraitMeta(traitKey).label),
    developmentFocus: getTraitMeta(lowestTraitKey).label,
    bigFive: BIG_FIVE_TRAITS.map((trait) => ({
      ...trait,
      score: bigFiveScores[trait.key],
      narrative: getTraitNarrative(trait.key, bigFiveScores[trait.key]),
    })),
  };
};

export const savePersonalityTestResult = (result: any) => {
  window.sessionStorage.setItem(
    PERSONALITY_TEST_STORAGE_KEY,
    JSON.stringify(result),
  );
};

export const loadPersonalityTestResult = () => {
  const rawResult = window.sessionStorage.getItem(PERSONALITY_TEST_STORAGE_KEY);

  if (!rawResult) {
    return null;
  }

  try {
    const parsedResult = JSON.parse(rawResult);
    const currentArchetypeProfile =
      PERSONALITY_ARCHETYPE_PROFILES[parsedResult.archetypeKey];

    if (!currentArchetypeProfile) {
      return parsedResult;
    }

    return {
      ...parsedResult,
      title: currentArchetypeProfile.title,
      subtitle: currentArchetypeProfile.subtitle,
      imageSrc: currentArchetypeProfile.imageSrc,
      imageAlt: currentArchetypeProfile.imageAlt,
      tagline: currentArchetypeProfile.tagline,
      description: currentArchetypeProfile.description,
      strengths: currentArchetypeProfile.strengths,
      growthAreas: currentArchetypeProfile.growthAreas,
    };
  } catch (error) {
    return null;
  }
};
