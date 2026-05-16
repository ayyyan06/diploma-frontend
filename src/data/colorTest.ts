const COLOR_TEST_STORAGE_KEY = "qazaqweb-color-test-result";

export const COLOR_PALETTE = [
  {
    id: "kokAspan",
    label: "Kok Aspan",
    title: "Need for Calm and Clear Space",
    culturalNote: "sky blue connected with the open steppe sky",
    shortMeaning: "calm, clarity, and trust",
    keywords: ["calm", "clarity", "trust"],
    coreNeed:
      "You currently seek emotional calm, honesty, and a sense of open mental space.",
    supportMessage:
      "You restore yourself through quiet, perspective, and relationships that feel sincere rather than loud.",
    stressMessage:
      "When this tone falls low, it can signal fatigue with emotional distance, mistrust, or too much cold control.",
    balanceTip:
      "Keep your calm active. Clear space is useful, but do not hide in distance when real conversation is needed.",
    accentColor: "#249ec9",
    swatchStyle: {
      background: "linear-gradient(135deg, #77d9f2 0%, #249ec9 100%)",
      borderColor: "#249ec9",
    },
  },
  {
    id: "zhasylKoktem",
    label: "Zhasyl Koktem",
    title: "Need for Growth and Recovery",
    culturalNote: "steppe green linked to spring pasture and renewal",
    shortMeaning: "growth, patience, and balance",
    keywords: ["growth", "patience", "balance"],
    coreNeed:
      "You are looking for recovery, steadier rhythms, and room to grow without pressure.",
    supportMessage:
      "You regain energy through routines, care, and environments where things can develop gradually.",
    stressMessage:
      "When green is pushed low, it can point to irritation with waiting, healing, or slow-moving obligations.",
    balanceTip:
      "Patience is a strength, but do not let caution become passivity when a decision needs movement.",
    accentColor: "#4f8a4b",
    swatchStyle: {
      background: "linear-gradient(135deg, #8ec36d 0%, #4f8a4b 100%)",
      borderColor: "#4f8a4b",
    },
  },
  {
    id: "kyzylOt",
    label: "Kyzyl Ot",
    title: "Need for Intensity and Action",
    culturalNote: "hearth red associated with fire, celebration, and courage",
    shortMeaning: "energy, courage, and emotional heat",
    keywords: ["energy", "courage", "warmth"],
    coreNeed:
      "You want life to feel vivid, emotionally real, and strong enough to move something forward.",
    supportMessage:
      "You recharge through passion, visible engagement, and situations where your energy matters.",
    stressMessage:
      "When red is placed low, it may reflect overload, irritation with conflict, or fear of emotional intensity.",
    balanceTip:
      "Use your fire to act, not to burn yourself down. Intensity works best when it has direction.",
    accentColor: "#b64a35",
    swatchStyle: {
      background: "linear-gradient(135deg, #d97a56 0%, #b64a35 100%)",
      borderColor: "#b64a35",
    },
  },
  {
    id: "altynDala",
    label: "Altyn Dala",
    title: "Need for Hope and Meaning",
    culturalNote: "sun-gold tied to light, generosity, and the wide steppe",
    shortMeaning: "optimism, meaning, and expression",
    keywords: ["optimism", "vision", "generosity"],
    coreNeed:
      "You are drawn toward hope, emotional warmth, and the feeling that life is leading somewhere meaningful.",
    supportMessage:
      "You recover through inspiration, creativity, and people who make possibility feel real again.",
    stressMessage:
      "When gold goes low, it can suggest disappointment, cynicism, or exhaustion with forced positivity.",
    balanceTip:
      "Keep your hope concrete. Vision becomes powerful when it is matched with follow-through.",
    accentColor: "#c9971e",
    swatchStyle: {
      background: "linear-gradient(135deg, #f0cf67 0%, #c9971e 100%)",
      borderColor: "#c9971e",
    },
  },
  {
    id: "kokMor",
    label: "Kok Mor",
    title: "Need for Sensitivity and Imagination",
    culturalNote: "violet twilight between day and night over the plain",
    shortMeaning: "sensitivity, imagination, and emotional depth",
    keywords: ["sensitivity", "intuition", "imagination"],
    coreNeed:
      "You may be craving deeper feeling, beauty, imagination, or a more intimate emotional atmosphere.",
    supportMessage:
      "You regain balance through art, symbolism, tenderness, and spaces where subtle feeling is allowed.",
    stressMessage:
      "When violet sits low, it can signal mistrust of sentiment, overstimulation, or resistance to vulnerability.",
    balanceTip:
      "Honor sensitivity without disappearing into fantasy. Emotional depth works best when grounded in reality.",
    accentColor: "#7e61b7",
    swatchStyle: {
      background: "linear-gradient(135deg, #b49de0 0%, #7e61b7 100%)",
      borderColor: "#7e61b7",
    },
  },
  {
    id: "qonyrZher",
    label: "Qonyr Zher",
    title: "Need for Comfort and Stability",
    culturalNote:
      "earth brown connected with soil, leather, felt, and home craft",
    shortMeaning: "comfort, groundedness, and bodily rest",
    keywords: ["comfort", "groundedness", "security"],
    coreNeed:
      "You may need physical ease, dependable routines, and a stronger sense of home or embodied safety.",
    supportMessage:
      "You recharge through rest, touch, familiar spaces, and simple practical stability.",
    stressMessage:
      "When brown falls low, it can suggest discomfort with dependence, fatigue, or frustration with bodily limits.",
    balanceTip:
      "Grounding is not weakness. Build practical support before asking yourself for more emotional output.",
    accentColor: "#8b623b",
    swatchStyle: {
      background: "linear-gradient(135deg, #c39b72 0%, #8b623b 100%)",
      borderColor: "#8b623b",
    },
  },
  {
    id: "kumisTuman",
    label: "Kumis Tuman",
    title: "Need for Distance and Boundaries",
    culturalNote: "silver-gray like morning mist and worked metal",
    shortMeaning: "distance, boundaries, and emotional protection",
    keywords: ["boundaries", "neutrality", "protection"],
    coreNeed:
      "You may be trying to stay protected, neutral, or untouched while you sort out what you really feel.",
    supportMessage:
      "You recover by reducing noise, limiting demands, and giving yourself psychological space.",
    stressMessage:
      "When gray is strongly rejected, it may show resistance to detachment, restraint, or emotional numbness.",
    balanceTip:
      "Boundaries are useful, but do not let neutrality become total withdrawal from the people who matter.",
    accentColor: "#8b919f",
    swatchStyle: {
      background: "linear-gradient(135deg, #d5d9e2 0%, #8b919f 100%)",
      borderColor: "#8b919f",
    },
  },
  {
    id: "qaraTynys",
    label: "Qara Tynys",
    title: "Need for Autonomy and a Hard Reset",
    culturalNote: "deep black tied to night, finality, and refusal",
    shortMeaning: "autonomy, protest, and radical separation",
    keywords: ["autonomy", "control", "defiance"],
    coreNeed:
      "You may be feeling a strong need to cut something off, reclaim control, or push back against pressure.",
    supportMessage:
      "You restore yourself when you can say no clearly, define limits, and stop carrying what is not yours.",
    stressMessage:
      "When black is placed very low, it can suggest fear of collapse, anger, or anything that feels too absolute.",
    balanceTip:
      "Strong boundaries can protect you, but use them intentionally so they become clarity rather than isolation.",
    accentColor: "#2d2d31",
    swatchStyle: {
      background: "linear-gradient(135deg, #5f6067 0%, #2d2d31 100%)",
      borderColor: "#2d2d31",
    },
  },
];

const getColorById = (colorId: any) =>
  COLOR_PALETTE.find((color) => color.id === colorId) || COLOR_PALETTE[0];

const getWeightedScore = (ranking: any, colorId: any, multiplier = 1) => {
  const position = ranking.indexOf(colorId);
  const baseScore = COLOR_PALETTE.length - position;

  return baseScore * multiplier;
};

const buildTopPairText = (dominantColor: any, supportColor: any) =>
  `Across both rankings, ${dominantColor.label} and ${supportColor.label} stayed strongest. In a Luscher-inspired reading, that usually means you are pulled toward ${dominantColor.shortMeaning} while also needing ${supportColor.shortMeaning}.`;

export const buildColorTestResult = ({ firstRound, secondRound }: any) => {
  const rankedColors = [...COLOR_PALETTE]
    .map((color) => ({
      ...color,
      totalScore:
        getWeightedScore(firstRound, color.id, 2) +
        getWeightedScore(secondRound, color.id, 1),
    }))
    .sort((left, right) => right.totalScore - left.totalScore);

  const dominantColor = rankedColors[0];
  const supportColor = rankedColors[1];
  const tensionColor = rankedColors[rankedColors.length - 2];
  const avoidedColor = rankedColors[rankedColors.length - 1];
  const firstChoice = getColorById(firstRound[0]);
  const secondPassChoice = getColorById(secondRound[0]);
  const stablePreference = firstChoice.id === secondPassChoice.id;

  const coreTraits = [...dominantColor.keywords, ...supportColor.keywords]
    .filter((trait, index, traits) => traits.indexOf(trait) === index)
    .slice(0, 3);

  return {
    title: `${dominantColor.label} - ${dominantColor.title}`,
    note: "Psychological color ranking inspired by Luscher, adapted to a Kazakh cultural palette.",
    description: `${buildTopPairText(
      dominantColor,
      supportColor,
    )} ${dominantColor.culturalNote.charAt(0).toUpperCase()}${dominantColor.culturalNote.slice(
      1,
    )} becomes your leading symbol right now. ${
      stablePreference
        ? `Your first choice stayed stable in both rounds, which suggests this preference is not random.`
        : `Your first choice shifted between rounds, which suggests a more mixed or changing inner state.`
    }`,
    coreTraits,
    dominantColor,
    supportColor,
    tensionColor,
    avoidedColor,
    currentNeed: dominantColor.coreNeed,
    supportZone: supportColor.supportMessage,
    stressSignal: `${avoidedColor.label} stayed closest to the bottom. ${avoidedColor.stressMessage}`,
    balanceTip: `${tensionColor.balanceTip} ${dominantColor.balanceTip}`,
    topPair: [dominantColor, supportColor],
    rankingInsight: [
      `Round 1 first choice: ${firstChoice.label}`,
      `Round 2 first choice: ${secondPassChoice.label}`,
      `Lowest overall color: ${avoidedColor.label}`,
    ],
  };
};

export const saveColorTestResult = (result: any) => {
  window.sessionStorage.setItem(COLOR_TEST_STORAGE_KEY, JSON.stringify(result));
};

export const loadColorTestResult = () => {
  const rawResult = window.sessionStorage.getItem(COLOR_TEST_STORAGE_KEY);

  if (!rawResult) {
    return null;
  }

  try {
    return JSON.parse(rawResult);
  } catch (error) {
    return null;
  }
};

export const clearColorTestResult = () => {
  window.sessionStorage.removeItem(COLOR_TEST_STORAGE_KEY);
};
