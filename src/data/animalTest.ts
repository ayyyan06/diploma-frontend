const ANIMAL_TEST_STORAGE_KEY = "qazaqweb-animal-test-result";

export const EYSENCK_SCALE_OPTIONS = [
  { id: "strongly-disagree", label: "Strongly disagree", score: 1 },
  { id: "somewhat-disagree", label: "Somewhat disagree", score: 2 },
  { id: "somewhat-agree", label: "Somewhat agree", score: 3 },
  { id: "strongly-agree", label: "Strongly agree", score: 4 },
];

export const EYSENCK_AXES = [
  {
    key: "extraversion",
    label: "Extraversion",
    lowPole: "Introversion",
    highPole: "Extraversion",
  },
  {
    key: "stability",
    label: "Emotional Stability",
    lowPole: "Instability",
    highPole: "Stability",
  },
];

export const ANIMAL_TEMPERAMENT_ITEMS = [
  {
    id: 1,
    title:
      "I gain energy from active contact, visible movement, and being part of what is happening.",
    prompt: "Answer as you are most of the time, not as you wish to be.",
    axis: "extraversion",
  },
  {
    id: 2,
    title:
      "Before responding outwardly, I usually need private space to process things inwardly.",
    axis: "extraversion",
    reverse: true,
  },
  {
    id: 3,
    title:
      "In a group, I naturally take social space instead of staying in the background.",
    axis: "extraversion",
  },
  {
    id: 4,
    title: "Too much social stimulation drains me faster than it energizes me.",
    axis: "extraversion",
    reverse: true,
  },
  {
    id: 5,
    title:
      "When plans collapse or pressure rises, I usually remain calmer than people expect.",
    axis: "stability",
  },
  {
    id: 6,
    title: "Stress can change my mood quickly and strongly.",
    axis: "stability",
    reverse: true,
  },
  {
    id: 7,
    title:
      "I recover my emotional balance fairly fast after tension or conflict.",
    axis: "stability",
  },
  {
    id: 8,
    title: "Uncertainty can stay in my thoughts or body for a long time.",
    axis: "stability",
    reverse: true,
  },
  {
    id: 9,
    title:
      "I usually prefer outward momentum and interaction over long periods of quiet observation.",
    axis: "extraversion",
  },
  {
    id: 10,
    title: "I would rather observe carefully than react immediately in public.",
    axis: "extraversion",
    reverse: true,
  },
  {
    id: 11,
    title: "Even under emotional pressure, I tend to stay internally steady.",
    axis: "stability",
  },
  {
    id: 12,
    title: "I am easily unsettled by emotional intensity around me.",
    axis: "stability",
    reverse: true,
  },
];

export const ANIMAL_TEMPERAMENT_PROFILES: any = {
  snowLeopard: {
    key: "snowLeopard",
    title: "Snow Leopard - The Phlegmatic",
    subtitle: "Eysenck temperament: Phlegmatic",
    temperament: "Phlegmatic",
    quadrant: "Introvert + Stable",
    imageSrc: "/images/snowleo.svg",
    imageAlt: "Snow Leopard result",
    tagline: "Quiet steadiness, contained depth, and calm endurance.",
    coreTraits: ["reserve", "stability", "patience"],
    description:
      "In this test, the snow leopard represents the phlegmatic quadrant of Eysenck's model: introverted but emotionally steady. You tend to process inwardly, stay composed under pressure, and move only when timing feels right. In Kazakh animal symbolism, the snow leopard carries contained power rather than noisy display.",
    strengths: [
      "stays composed in difficult situations",
      "observes deeply before acting",
      "does not waste energy on unnecessary drama",
    ],
    growthAreas: [
      "may stay too private for others to read easily",
      "can delay expression until the moment passes",
      "may appear distant when actually just self-contained",
    ],
  },
  wolf: {
    key: "wolf",
    title: "Wolf - The Choleric",
    subtitle: "Eysenck temperament: Choleric",
    temperament: "Choleric",
    quadrant: "Extravert + Unstable",
    imageSrc: "/images/wolf.svg",
    imageAlt: "Wolf result",
    tagline: "Intensity, outward drive, and emotionally charged action.",
    coreTraits: ["intensity", "drive", "reactivity"],
    description:
      "In this reading, the wolf stands for the choleric pattern in Eysenck's model: outward-moving, forceful, and more emotionally reactive under strain. You do not stay neutral for long; you engage, protect, and respond fast when something matters. The wolf fits this temperament because its energy is social, urgent, and hard to ignore.",
    strengths: [
      "acts quickly when the situation becomes urgent",
      "brings passion and visible energy to people or causes",
      "protects the group with force and immediacy",
    ],
    growthAreas: [
      "may react before enough reflection",
      "can intensify tension without meaning to",
      "may find it hard to slow down once emotionally activated",
    ],
  },
  horse: {
    key: "horse",
    title: "Horse - The Sanguine",
    subtitle: "Eysenck temperament: Sanguine",
    temperament: "Sanguine",
    quadrant: "Extravert + Stable",
    imageSrc: "/images/horse.svg",
    imageAlt: "Horse result",
    tagline: "Warm momentum, sociability, and steady outward energy.",
    coreTraits: ["sociability", "optimism", "steadiness"],
    description:
      "In Eysenck's framework, the horse reflects the sanguine quadrant: extraverted and emotionally stable. You are energized by movement, contact, and openness, but you usually keep your balance while doing it. In Kazakh cultural imagery, the horse captures this blend of outward vitality and reliable inner rhythm.",
    strengths: [
      "brings steady energy into groups and shared activity",
      "recovers well after stress or disruption",
      "connects with people without losing overall balance",
    ],
    growthAreas: [
      "may underestimate quieter or slower emotional processes",
      "can keep moving instead of pausing for depth",
      "may rely on momentum when stillness is needed",
    ],
  },
  eagle: {
    key: "eagle",
    title: "Eagle - The Melancholic",
    subtitle: "Eysenck temperament: Melancholic",
    temperament: "Melancholic",
    quadrant: "Introvert + Unstable",
    imageSrc: "/images/eagle.svg",
    imageAlt: "Eagle result",
    tagline: "Inner depth, sensitivity, and watchful intensity.",
    coreTraits: ["sensitivity", "depth", "reflection"],
    description:
      "Here the eagle represents the melancholic quadrant in Eysenck's model: introverted, reflective, and more emotionally sensitive to pressure. You often process deeply and privately, noticing nuance and meaning that others miss, but tension can affect you strongly. The eagle fits this pattern because it combines distance, perception, and emotional seriousness.",
    strengths: [
      "notices subtle signals and hidden meaning quickly",
      "thinks with depth rather than surface reaction",
      "cares intensely about what feels true or important",
    ],
    growthAreas: [
      "may carry stress inward for too long",
      "can become overwhelmed by uncertainty or criticism",
      "may withdraw when support would actually help",
    ],
  },
};

const getScaleScore = (optionId: any) =>
  EYSENCK_SCALE_OPTIONS.find((option) => option.id === optionId)?.score || 1;

const getNormalizedScore = (averageScore: any) =>
  Math.round(((averageScore - 1) / 3) * 100);

const getAxisLevel = (score: any) => {
  if (score >= 67) {
    return "high";
  }

  if (score <= 33) {
    return "low";
  }

  return "moderate";
};

const getAxisNarrative = (axisKey: any, score: any) => {
  const level = getAxisLevel(score);
  const narratives: any = {
    extraversion: {
      high: "You move outward for energy, expression, and visible involvement.",
      moderate:
        "You can be socially active or private depending on context and trust.",
      low: "You process more inwardly and often prefer depth, privacy, and observation.",
    },
    stability: {
      high: "You tend to stay emotionally steady and recover your balance relatively fast.",
      moderate:
        "You feel pressure clearly, but it does not control your whole style.",
      low: "You are more emotionally reactive under stress and may carry tension for longer.",
    },
  };

  return narratives[axisKey][level];
};

const getAnimalKeyFromAxes = ({
  extraversion,
  stability,
}: {
  extraversion: any;
  stability: any;
}) => {
  const isExtraverted = extraversion >= 50;
  const isStable = stability >= 50;

  if (isExtraverted && isStable) {
    return "horse";
  }

  if (isExtraverted && !isStable) {
    return "wolf";
  }

  if (!isExtraverted && isStable) {
    return "snowLeopard";
  }

  return "eagle";
};

const getDevelopmentFocus = (scores: any) => {
  const distances = [
    {
      label: "Outward expression",
      distance: Math.abs(scores.extraversion - 50),
      preferred: scores.extraversion < 50,
    },
    {
      label: "Emotional regulation",
      distance: Math.abs(scores.stability - 50),
      preferred: scores.stability < 50,
    },
  ];

  distances.sort((left, right) => left.distance - right.distance);

  return distances.find((item) => item.preferred)?.label || distances[0].label;
};

const buildWhyThisAnimal = (profile: any, scores: any) => {
  const extraversionLabel =
    scores.extraversion >= 50 ? "extraversion" : "introversion";
  const stabilityLabel =
    scores.stability >= 50 ? "emotional stability" : "emotional instability";

  return `Your answers leaned toward ${extraversionLabel} and ${stabilityLabel}. In Eysenck's two-axis model, that combination corresponds to the ${profile.temperament.toLowerCase()} temperament. In this Kazakh animal retelling, that pattern is expressed through the ${profile.title.toLowerCase()}. ${getAxisNarrative(
    "extraversion",
    scores.extraversion,
  )} ${getAxisNarrative("stability", scores.stability)}`;
};

export const buildAnimalTestResult = (selectedAnswers: any) => {
  const axisTotals = EYSENCK_AXES.reduce((totals: any, axis) => {
    totals[axis.key] = 0;
    return totals;
  }, {});

  const axisCounts = EYSENCK_AXES.reduce((counts: any, axis: any) => {
    counts[axis.key] = 0;
    return counts;
  }, {});

  ANIMAL_TEMPERAMENT_ITEMS.forEach((item) => {
    const rawScore = getScaleScore(selectedAnswers[item.id]);
    const score = item.reverse ? 5 - rawScore : rawScore;

    axisTotals[item.axis] += score;
    axisCounts[item.axis] += 1;
  });

  const axisScores: any = EYSENCK_AXES.reduce((scores: any, axis: any) => {
    const averageScore = axisTotals[axis.key] / axisCounts[axis.key];
    scores[axis.key] = getNormalizedScore(averageScore);
    return scores;
  }, {});

  const animalKey = getAnimalKeyFromAxes(axisScores);
  const profile = ANIMAL_TEMPERAMENT_PROFILES[animalKey];

  return {
    animalKey: profile.key,
    title: profile.title,
    subtitle: profile.subtitle,
    imageSrc: profile.imageSrc,
    imageAlt: profile.imageAlt,
    tagline: profile.tagline,
    temperament: profile.temperament,
    quadrant: profile.quadrant,
    description: profile.description,
    strengths: profile.strengths,
    growthAreas: profile.growthAreas,
    coreTraits: profile.coreTraits,
    developmentFocus: getDevelopmentFocus(axisScores),
    whyThisAnimal: buildWhyThisAnimal(profile, axisScores),
    axes: EYSENCK_AXES.map((axis) => ({
      ...axis,
      score: axisScores[axis.key],
      narrative: getAxisNarrative(axis.key, axisScores[axis.key]),
      leaningLabel: axisScores[axis.key] >= 50 ? axis.highPole : axis.lowPole,
    })),
  };
};

export const saveAnimalTestResult = (result: any) => {
  window.sessionStorage.setItem(
    ANIMAL_TEST_STORAGE_KEY,
    JSON.stringify(result),
  );
};

export const loadAnimalTestResult = () => {
  const rawResult = window.sessionStorage.getItem(ANIMAL_TEST_STORAGE_KEY);

  if (!rawResult) {
    return null;
  }

  try {
    const parsedResult = JSON.parse(rawResult);
    const currentProfile = ANIMAL_TEMPERAMENT_PROFILES[parsedResult.animalKey];

    if (!currentProfile) {
      return parsedResult;
    }

    return {
      ...parsedResult,
      title: currentProfile.title,
      subtitle: currentProfile.subtitle,
      temperament: currentProfile.temperament,
      quadrant: currentProfile.quadrant,
      imageSrc: currentProfile.imageSrc,
      imageAlt: currentProfile.imageAlt,
      tagline: currentProfile.tagline,
      description: currentProfile.description,
      strengths: currentProfile.strengths,
      growthAreas: currentProfile.growthAreas,
      coreTraits: currentProfile.coreTraits,
    };
  } catch (error) {
    return null;
  }
};
