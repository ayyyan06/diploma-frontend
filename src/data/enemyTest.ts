export const ENEMY_TEST_TYPE = "enemy";

const ENEMY_TEST_STORAGE_KEY = "qazaqweb-enemy-test-result";
const ENEMY_KEYS = ["mystan", "zheztyrnak", "aydahar", "zhalgyzKozdiDau"] as const;

type EnemyKey = (typeof ENEMY_KEYS)[number];
type NeedKey = "attachment" | "selfEsteem" | "control" | "safety";

type EnemyWeights = Record<EnemyKey, number>;
type NeedWeights = Record<NeedKey, number>;

interface EnemyProfile {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  threatenedNeed: string;
  needDescription: string;
  tagline: string;
  description: string;
  psychologicalBasis: string;
  howItWins: string;
  warningSign: string;
  whyThisEnemy: string;
  resistance: string;
  triggerPatterns: string[];
  distortionPatterns: string[];
  accent: string;
  softAccent: string;
  accentBorder: string;
}

interface NeedConfig {
  label: string;
  summary: string;
}

export interface EnemyOption {
  id: string;
  label: string;
  enemyWeights: EnemyWeights;
  needWeights: NeedWeights;
}

export interface EnemyScene {
  id: number;
  chapter: string;
  title: string;
  prompt: string;
  options: EnemyOption[];
}

export interface EnemyScore {
  key: EnemyKey;
  label: string;
  score: number;
  narrative: string;
  accent: string;
  softAccent: string;
}

export interface EnemyResultData {
  enemyKey: EnemyKey;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  threatenedNeed: string;
  needDescription: string;
  tagline: string;
  description: string;
  psychologicalBasis: string;
  howItWins: string;
  warningSign: string;
  whyThisEnemy: string;
  resistance: string;
  triggerPatterns: string[];
  distortionPatterns: string[];
  accent: string;
  softAccent: string;
  accentBorder: string;
  enemyScores: EnemyScore[];
  hiddenTraitSummary: string;
}

const ENEMY_PROFILES: Record<EnemyKey, EnemyProfile> = {
  mystan: {
    title: "Mystan",
    subtitle: "Your dominant enemy is hidden motive and betrayal",
    imageSrc: "/images/mystan.png",
    imageAlt: "Mystan result illustration",
    threatenedNeed: "Attachment / Trust",
    needDescription:
      "In Grawe's model, this result points to Attachment under threat. What gets shaken first is trust: the feeling that people are reliable, readable, and emotionally safe to stand near.",
    tagline:
      "This enemy grows strongest when people stop feeling readable and every silence starts sounding like a hidden game.",
    description:
      "Mystan is the enemy of unclear intention. It appears when what unsettles you most is secrecy: mixed loyalties, half-truths, private alliances, and the feeling that others may know more than they are saying.",
    psychologicalBasis:
      "This path is interpreted through Klaus Grawe's four basic psychological needs. Mystan reflects threats to Attachment: trust, reliable connection, and the sense that other people are emotionally safe rather than quietly dangerous.",
    howItWins:
      "It wins by making ambiguity feel personal. Once motives stop looking clear, uncertainty itself starts feeling like evidence that something is being hidden.",
    warningSign:
      "You start watching for what is being concealed more than for what is openly happening.",
    whyThisEnemy:
      "Across the story, you reacted most strongly to unclear loyalties, hidden information, and the fear that something important was happening outside your view.",
    resistance:
      "Slow down before turning uncertainty into conclusion. Separate what you know from what you suspect, and look for evidence before you let distrust define the whole situation.",
    triggerPatterns: [
      "mixed signals and incomplete information",
      "private alliances you cannot read clearly",
      "moments when trust suddenly feels unstable",
    ],
    distortionPatterns: [
      "reads ambiguity as concealed intent",
      "treats uncertainty as proof of betrayal",
      "focuses on hidden motives before checking facts",
    ],
    accent: "#7E5A95",
    softAccent: "#F3ECF8",
    accentBorder: "#D7C7E6",
  },
  zheztyrnak: {
    title: "Zheztyrnak",
    subtitle: "Your dominant enemy is humiliation and wounded status",
    imageSrc: "/images/zheztyrnaq.png",
    imageAlt: "Zheztyrnak result illustration",
    threatenedNeed: "Self-Esteem / Dignity",
    needDescription:
      "In Grawe's model, this result points to Self-Esteem under threat. What gets shaken first is dignity: the need to feel respected, valued, and not publicly reduced.",
    tagline:
      "This enemy becomes powerful when public diminishment hurts more than the practical problem itself.",
    description:
      "Zheztyrnak is the enemy of social wound. It appears when the hardest part of a situation is being underestimated, embarrassed, spoken over, or made to look smaller than you are.",
    psychologicalBasis:
      "This path is interpreted through Klaus Grawe's four basic psychological needs. Zheztyrnak reflects threats to Self-Esteem: social worth, dignity, face, and the feeling of still having value in the eyes of others and yourself.",
    howItWins:
      "It wins by making social pain feel central. The mind starts tracking disrespect, shame, and public exposure faster than it tracks the wider reality of the situation.",
    warningSign:
      "You begin feeling that being publicly diminished is more dangerous than the original problem.",
    whyThisEnemy:
      "Your answers repeatedly treated humiliation, loss of face, and visible status damage as the sharpest pressure in the story.",
    resistance:
      "Name the difference between real harm and injured image. The more clearly you separate dignity from immediate public approval, the less power this enemy gains.",
    triggerPatterns: [
      "public criticism or interruption",
      "being underestimated in front of others",
      "moments when status and respect feel threatened",
    ],
    distortionPatterns: [
      "hears status threat inside criticism",
      "treats exposure as worse than uncertainty",
      "ties self-worth too closely to public image",
    ],
    accent: "#C14B3C",
    softAccent: "#FCEDEA",
    accentBorder: "#EDC6BF",
  },
  aydahar: {
    title: "Aydahar",
    subtitle: "Your dominant enemy is chaos and loss of control",
    imageSrc: "/images/aidahar.png",
    imageAlt: "Aydahar result illustration",
    threatenedNeed: "Orientation & Control",
    needDescription:
      "In Grawe's model, this result points to Orientation and Control under threat. What gets shaken first is the need to understand what is happening and feel that the situation can still be held together.",
    tagline:
      "This enemy rises when instability starts feeling more dangerous than the possibility of a wrong move.",
    description:
      "Aydahar is the enemy of escalating uncertainty. It appears when what overwhelms you most is drift: no clear direction, too many moving parts, and the fear that if no one steadies things soon the whole situation will run away from everyone.",
    psychologicalBasis:
      "This path is interpreted through Klaus Grawe's four basic psychological needs. Aydahar reflects threats to Orientation and Control: clarity, predictability, and the sense that events can still be understood and guided.",
    howItWins:
      "It wins by making delay feel intolerable. Under pressure, speed can start feeling safer than reflection simply because movement feels better than uncertainty.",
    warningSign:
      "You start feeling calmer only when someone is taking visible control of the situation.",
    whyThisEnemy:
      "Across the scenes, you reacted most strongly to instability, delay, and the feeling that events could spiral if no one reasserted direction quickly.",
    resistance:
      "Build structure before force. Name the actual threat, the next step, and what really needs to happen now versus what only feels urgent because the uncertainty is loud.",
    triggerPatterns: [
      "unclear direction and delayed decisions",
      "rapidly escalating pressure",
      "moments when nobody seems to be holding the line",
    ],
    distortionPatterns: [
      "mistakes speed for safety",
      "trusts visible control more than clear information",
      "rushes toward action to silence uncertainty",
    ],
    accent: "#D17A26",
    softAccent: "#FFF2E7",
    accentBorder: "#EEC9A6",
  },
  zhalgyzKozdiDau: {
    title: "Zhalgyz Kozdi Dau",
    subtitle: "Your dominant enemy is crushing power and entrapment",
    imageSrc: "/images/dau.png",
    imageAlt: "Zhalgyz Kozdi Dau result illustration",
    threatenedNeed: "Safety / Pain Avoidance",
    needDescription:
      "In Grawe's model, this result points to safety under threat. What gets shaken first is the need not to be crushed, sacrificed, or trapped inside a force that has stopped seeing people as people.",
    tagline:
      "This enemy becomes strongest when a human situation starts feeling cold, rigid, and impossible to escape.",
    description:
      "Zhalgyz Kozdi Dau is the enemy of overpowering force. It appears when what unsettles you most is not chaos, but a harsh system closing in: rigid hierarchy, sacrifice logic, and the feeling that someone may simply be reduced to a role or a cost.",
    psychologicalBasis:
      "This path is interpreted through Klaus Grawe's four basic psychological needs. Zhalgyz Kozdi Dau reflects threats to safety and pain avoidance: the need not to be overwhelmed by harsh force, exposure, or a system that turns necessity into cruelty.",
    howItWins:
      "It wins by making the situation feel morally sealed. Once necessity and hierarchy start sounding absolute, this enemy turns pressure into the sense that someone will simply be crushed by the system.",
    warningSign:
      "You start reading the room less as a conflict between people and more as a harsh structure that may sacrifice whoever has the least power.",
    whyThisEnemy:
      "Your answers repeatedly focused on scenes where people became expendable, powerless, or trapped inside a colder logic than the story began with.",
    resistance:
      "Put people back into the picture. Ask who still has agency, what choices remain, and which parts of the pressure are real versus which only feel absolute in the moment.",
    triggerPatterns: [
      "rigid hierarchy and unequal power",
      "necessity used to justify harm",
      "moments when people start looking expendable",
    ],
    distortionPatterns: [
      "expects systems to become harsher than they may be",
      "sees hierarchy before humanity",
      "treats necessity as proof that compassion is gone",
    ],
    accent: "#415170",
    softAccent: "#EEF2FB",
    accentBorder: "#C8D2EA",
  },
};

const ENEMY_SCORE_NARRATIVES: Record<EnemyKey, string> = {
  mystan: "Hidden motives, betrayal, and the fear of being played.",
  zheztyrnak: "Humiliation, public diminishment, and wounded status.",
  aydahar: "Uncertainty, loss of control, and pressure that escalates too fast.",
  zhalgyzKozdiDau: "Cold domination, sacrifice logic, and coercive power.",
};

const NEED_CONFIG: Record<NeedKey, NeedConfig> = {
  attachment: {
    label: "Attachment / Trust",
    summary:
      "Across the story, threats to trust and reliable connection kept hitting you first.",
  },
  selfEsteem: {
    label: "Self-Esteem / Dignity",
    summary:
      "Across the story, threats to dignity, respect, and public worth kept hitting you first.",
  },
  control: {
    label: "Orientation & Control",
    summary:
      "Across the story, threats to clarity, order, and the ability to steer events kept hitting you first.",
  },
  safety: {
    label: "Safety / Pain Avoidance",
    summary:
      "Across the story, threats of harsh force, sacrifice, and being overrun kept hitting you first.",
  },
};

const createEnemyWeights = (
  dominant: EnemyKey,
  secondary: EnemyKey,
): EnemyWeights => ({
  mystan: dominant === "mystan" ? 3 : secondary === "mystan" ? 1 : 0,
  zheztyrnak: dominant === "zheztyrnak" ? 3 : secondary === "zheztyrnak" ? 1 : 0,
  aydahar: dominant === "aydahar" ? 3 : secondary === "aydahar" ? 1 : 0,
  zhalgyzKozdiDau:
    dominant === "zhalgyzKozdiDau" ? 3 : secondary === "zhalgyzKozdiDau" ? 1 : 0,
});

const createNeedWeights = (
  attachment: number,
  selfEsteem: number,
  control: number,
  safety: number,
): NeedWeights => ({
  attachment,
  selfEsteem,
  control,
  safety,
});

export const ENEMY_TEST_SCENES: EnemyScene[] = [
  {
    id: 1,
    chapter: "Arrival",
    title:
      "You arrive at the winter camp as dusk settles over the steppe. Inside the main yurt, an elder praises another person for a plan that was first spoken by you that morning.",
    prompt: "As the yurt falls quiet, what hits you first?",
    options: [
      {
        id: "enemy-1-mystan",
        label:
          "That I still cannot tell whether this was simple convenience or part of someone else's hidden game.",
        enemyWeights: createEnemyWeights("mystan", "zhalgyzKozdiDau"),
        needWeights: createNeedWeights(5, 1, 1, 2),
      },
      {
        id: "enemy-1-zheztyrnak",
        label:
          "That I was made smaller in front of everyone, and now they have all seen it.",
        enemyWeights: createEnemyWeights("zheztyrnak", "aydahar"),
        needWeights: createNeedWeights(1, 5, 2, 1),
      },
      {
        id: "enemy-1-aydahar",
        label:
          "That if nobody steadies the room right now, the whole evening could start sliding in the wrong direction.",
        enemyWeights: createEnemyWeights("aydahar", "zheztyrnak"),
        needWeights: createNeedWeights(1, 2, 5, 1),
      },
      {
        id: "enemy-1-dau",
        label:
          "That people can abandon fairness very quickly once rank and power enter the room.",
        enemyWeights: createEnemyWeights("zhalgyzKozdiDau", "mystan"),
        needWeights: createNeedWeights(1, 1, 1, 5),
      },
    ],
  },
  {
    id: 2,
    chapter: "The Rider's Satchel",
    title:
      "While the elders argue, you notice the missing rider's satchel near the entrance. Its strap is open, and a folded note is visible inside.",
    prompt: "What thought reaches you first?",
    options: [
      {
        id: "enemy-2-mystan",
        label:
          "If someone has already looked inside before me, then more is being hidden tonight than anyone admits.",
        enemyWeights: createEnemyWeights("mystan", "zhalgyzKozdiDau"),
        needWeights: createNeedWeights(5, 1, 1, 2),
      },
      {
        id: "enemy-2-zheztyrnak",
        label:
          "If there is something in that satchel that leaves me looking blind or weak, I do not want to be the last to learn it.",
        enemyWeights: createEnemyWeights("zheztyrnak", "mystan"),
        needWeights: createNeedWeights(2, 5, 1, 1),
      },
      {
        id: "enemy-2-aydahar",
        label:
          "Until we understand what is happening, this night is only becoming harder to control.",
        enemyWeights: createEnemyWeights("aydahar", "mystan"),
        needWeights: createNeedWeights(1, 1, 5, 1),
      },
      {
        id: "enemy-2-dau",
        label:
          "What unsettles me most is how quickly truth can fall into a few hands while everyone else becomes an extra.",
        enemyWeights: createEnemyWeights("zhalgyzKozdiDau", "mystan"),
        needWeights: createNeedWeights(2, 1, 1, 5),
      },
    ],
  },
  {
    id: 3,
    chapter: "The Young Rider",
    title:
      "Outside by the tethering posts, a young rider confesses that he was the one who sent the missing messenger along the shorter winter path. If the elders learn this, his name will be ruined.",
    prompt: "What feels heaviest in this moment?",
    options: [
      {
        id: "enemy-3-mystan",
        label:
          "That this may still not be the whole truth, and I am being asked to trust what I cannot verify.",
        enemyWeights: createEnemyWeights("mystan", "zhalgyzKozdiDau"),
        needWeights: createNeedWeights(5, 1, 1, 2),
      },
      {
        id: "enemy-3-zheztyrnak",
        label:
          "That if this comes out, his disgrace could easily damage my name as well.",
        enemyWeights: createEnemyWeights("zheztyrnak", "mystan"),
        needWeights: createNeedWeights(2, 5, 1, 1),
      },
      {
        id: "enemy-3-aydahar",
        label:
          "That there may no longer be time for softness if the damage has to be contained before dawn.",
        enemyWeights: createEnemyWeights("aydahar", "zheztyrnak"),
        needWeights: createNeedWeights(1, 2, 5, 1),
      },
      {
        id: "enemy-3-dau",
        label:
          "That one mistake can give the whole camp an excuse to become colder and harsher.",
        enemyWeights: createEnemyWeights("zhalgyzKozdiDau", "aydahar"),
        needWeights: createNeedWeights(1, 1, 2, 5),
      },
    ],
  },
  {
    id: 4,
    chapter: "Council Fire",
    title:
      "Back inside the yurt, a respected elder interrupts you and says that in a night like this, decisions should be left to those who are truly trusted.",
    prompt: "What would hurt most here?",
    options: [
      {
        id: "enemy-4-mystan",
        label:
          "That this does not sound like one sharp comment. It sounds like part of a move that began before I walked in.",
        enemyWeights: createEnemyWeights("mystan", "zheztyrnak"),
        needWeights: createNeedWeights(5, 2, 1, 1),
      },
      {
        id: "enemy-4-zheztyrnak",
        label:
          "That I am being stripped of weight and dignity in front of the whole yurt.",
        enemyWeights: createEnemyWeights("zheztyrnak", "aydahar"),
        needWeights: createNeedWeights(1, 5, 2, 1),
      },
      {
        id: "enemy-4-aydahar",
        label:
          "That if this council slips much further, it may be impossible to pull it back.",
        enemyWeights: createEnemyWeights("aydahar", "zheztyrnak"),
        needWeights: createNeedWeights(1, 2, 5, 1),
      },
      {
        id: "enemy-4-dau",
        label:
          "That a group can turn cold enough to take one person's voice away in a single moment.",
        enemyWeights: createEnemyWeights("zhalgyzKozdiDau", "zheztyrnak"),
        needWeights: createNeedWeights(1, 2, 1, 5),
      },
    ],
  },
  {
    id: 5,
    chapter: "Rumor In The Snow",
    title:
      "When you step outside again, whispers are already moving between the fires: people are saying the messenger rode too late because of you.",
    prompt: "Which part of that would be hardest to sit with?",
    options: [
      {
        id: "enemy-5-mystan",
        label:
          "That I do not know who started this or who is quietly feeding it.",
        enemyWeights: createEnemyWeights("mystan", "zheztyrnak"),
        needWeights: createNeedWeights(5, 2, 1, 1),
      },
      {
        id: "enemy-5-zheztyrnak",
        label:
          "That people may decide who I am before they ever hear me speak.",
        enemyWeights: createEnemyWeights("zheztyrnak", "mystan"),
        needWeights: createNeedWeights(2, 5, 1, 1),
      },
      {
        id: "enemy-5-aydahar",
        label:
          "That if this rumor grows any further, the whole camp could become unmanageable by morning.",
        enemyWeights: createEnemyWeights("aydahar", "zheztyrnak"),
        needWeights: createNeedWeights(1, 2, 5, 1),
      },
      {
        id: "enemy-5-dau",
        label:
          "That in a hard night, a community can choose one convenient person to close around.",
        enemyWeights: createEnemyWeights("zhalgyzKozdiDau", "mystan"),
        needWeights: createNeedWeights(1, 1, 1, 5),
      },
    ],
  },
  {
    id: 6,
    chapter: "The Empty Store",
    title:
      "Near midnight the stores are counted. If the storm deepens, there will not be enough food and fuel to carry everyone through the rest of the night in equal safety.",
    prompt: "What feels most dangerous in a moment like this?",
    options: [
      {
        id: "enemy-6-mystan",
        label:
          "That shortage will reveal who means their promises and who was only speaking well while things were easy.",
        enemyWeights: createEnemyWeights("mystan", "zhalgyzKozdiDau"),
        needWeights: createNeedWeights(5, 1, 1, 2),
      },
      {
        id: "enemy-6-zheztyrnak",
        label:
          "That someone will soon be judged less worthy of help, and that judgment can spread fast.",
        enemyWeights: createEnemyWeights("zheztyrnak", "zhalgyzKozdiDau"),
        needWeights: createNeedWeights(1, 5, 1, 2),
      },
      {
        id: "enemy-6-aydahar",
        label:
          "That if no clear order appears soon, fear alone will make everything worse.",
        enemyWeights: createEnemyWeights("aydahar", "zhalgyzKozdiDau"),
        needWeights: createNeedWeights(1, 1, 5, 2),
      },
      {
        id: "enemy-6-dau",
        label:
          "That necessity becomes an excuse for cruelty faster than people admit.",
        enemyWeights: createEnemyWeights("zhalgyzKozdiDau", "aydahar"),
        needWeights: createNeedWeights(1, 1, 2, 5),
      },
    ],
  },
  {
    id: 7,
    chapter: "Broken Support",
    title:
      "The person who was supposed to support you on the council floor chooses the wrong words at the worst moment, and the room shifts against you.",
    prompt: "What would feel most dangerous here?",
    options: [
      {
        id: "enemy-7-mystan",
        label:
          "That perhaps loyalty around me was never as solid as it seemed.",
        enemyWeights: createEnemyWeights("mystan", "zhalgyzKozdiDau"),
        needWeights: createNeedWeights(5, 1, 1, 2),
      },
      {
        id: "enemy-7-zheztyrnak",
        label:
          "That another person's public mistake is now pulling my name down with it.",
        enemyWeights: createEnemyWeights("zheztyrnak", "aydahar"),
        needWeights: createNeedWeights(1, 5, 2, 1),
      },
      {
        id: "enemy-7-aydahar",
        label:
          "That the ground is shifting too fast, and if no one regains control the whole night could crack.",
        enemyWeights: createEnemyWeights("aydahar", "zheztyrnak"),
        needWeights: createNeedWeights(1, 2, 5, 1),
      },
      {
        id: "enemy-7-dau",
        label:
          "That once people sense weakness, they grow colder than they were a moment before.",
        enemyWeights: createEnemyWeights("zhalgyzKozdiDau", "zheztyrnak"),
        needWeights: createNeedWeights(1, 2, 1, 5),
      },
    ],
  },
  {
    id: 8,
    chapter: "Before Dawn",
    title:
      "Before dawn, word finally comes: the missing rider has been found, but too late. The elders want a name to blame before sunrise so the camp can settle.",
    prompt: "What in this final turn troubles you most?",
    options: [
      {
        id: "enemy-8-mystan",
        label:
          "That there may still be another bargain or hidden motive inside this decision.",
        enemyWeights: createEnemyWeights("mystan", "zhalgyzKozdiDau"),
        needWeights: createNeedWeights(5, 1, 1, 2),
      },
      {
        id: "enemy-8-zheztyrnak",
        label:
          "That if I step back now, I may be remembered as weak or unimportant.",
        enemyWeights: createEnemyWeights("zheztyrnak", "aydahar"),
        needWeights: createNeedWeights(1, 5, 2, 1),
      },
      {
        id: "enemy-8-aydahar",
        label:
          "That waiting even longer feels unbearable because the uncertainty is becoming worse than the choice itself.",
        enemyWeights: createEnemyWeights("aydahar", "zheztyrnak"),
        needWeights: createNeedWeights(1, 2, 5, 1),
      },
      {
        id: "enemy-8-dau",
        label:
          "That a community can ask for a sacrifice so easily and call it necessity.",
        enemyWeights: createEnemyWeights("zhalgyzKozdiDau", "mystan"),
        needWeights: createNeedWeights(2, 1, 1, 5),
      },
    ],
  },
];

const createEmptyEnemyTotals = (): Record<EnemyKey, number> => ({
  mystan: 0,
  zheztyrnak: 0,
  aydahar: 0,
  zhalgyzKozdiDau: 0,
});

const createEmptyNeedTotals = (): Record<NeedKey, number> => ({
  attachment: 0,
  selfEsteem: 0,
  control: 0,
  safety: 0,
});

const getDominantEnemy = (
  enemyTotals: Record<EnemyKey, number>,
): EnemyKey =>
  ENEMY_KEYS.reduce((best, key) =>
    enemyTotals[key] > enemyTotals[best] ? key : best,
  );

const buildEnemyScores = (
  enemyTotals: Record<EnemyKey, number>,
): EnemyScore[] => {
  const total = ENEMY_KEYS.reduce((sum, key) => sum + enemyTotals[key], 0);

  return ENEMY_KEYS.map((key) => {
    const profile = ENEMY_PROFILES[key];

    return {
      key,
      label: profile.title,
      score: total > 0 ? Math.round((enemyTotals[key] / total) * 100) : 0,
      narrative: ENEMY_SCORE_NARRATIVES[key],
      accent: profile.accent,
      softAccent: profile.softAccent,
    };
  });
};

const buildNeedSummary = (needTotals: Record<NeedKey, number>): string => {
  const dominantNeed = (Object.keys(needTotals) as NeedKey[]).reduce((best, key) =>
    needTotals[key] > needTotals[best] ? key : best,
  );
  const config = NEED_CONFIG[dominantNeed];

  return `${config.summary} In Grawe's model, this points to ${config.label} under pressure.`;
};

export const buildEnemyTestResult = (
  selectedAnswers: Record<number, string>,
): EnemyResultData => {
  const enemyTotals = createEmptyEnemyTotals();
  const needTotals = createEmptyNeedTotals();

  ENEMY_TEST_SCENES.forEach((scene) => {
    const chosenOption = scene.options.find(
      (option) => option.id === selectedAnswers[scene.id],
    );

    if (!chosenOption) {
      return;
    }

    ENEMY_KEYS.forEach((key) => {
      enemyTotals[key] += chosenOption.enemyWeights[key];
    });

    (Object.keys(needTotals) as NeedKey[]).forEach((needKey) => {
      needTotals[needKey] += chosenOption.needWeights[needKey];
    });
  });

  const enemyKey = getDominantEnemy(enemyTotals);
  const profile = ENEMY_PROFILES[enemyKey];

  return {
    enemyKey,
    title: profile.title,
    subtitle: profile.subtitle,
    imageSrc: profile.imageSrc,
    imageAlt: profile.imageAlt,
    threatenedNeed: profile.threatenedNeed,
    needDescription: profile.needDescription,
    tagline: profile.tagline,
    description: profile.description,
    psychologicalBasis: profile.psychologicalBasis,
    howItWins: profile.howItWins,
    warningSign: profile.warningSign,
    whyThisEnemy: profile.whyThisEnemy,
    resistance: profile.resistance,
    triggerPatterns: profile.triggerPatterns,
    distortionPatterns: profile.distortionPatterns,
    accent: profile.accent,
    softAccent: profile.softAccent,
    accentBorder: profile.accentBorder,
    enemyScores: buildEnemyScores(enemyTotals),
    hiddenTraitSummary: buildNeedSummary(needTotals),
  };
};

export const getEnemyOptionLabel = (
  sceneId: number,
  optionId: string,
): string | null => {
  const scene = ENEMY_TEST_SCENES.find((item) => item.id === sceneId);
  const option = scene?.options.find((item) => item.id === optionId);

  return option?.label ?? null;
};

export const saveEnemyTestResult = (result: EnemyResultData): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(ENEMY_TEST_STORAGE_KEY, JSON.stringify(result));
};

export const loadEnemyTestResult = (): EnemyResultData | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawResult = window.sessionStorage.getItem(ENEMY_TEST_STORAGE_KEY);
  if (!rawResult) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawResult) as Partial<EnemyResultData>;

    if (parsed && typeof parsed === "object" && typeof parsed.enemyKey === "string") {
      return parsed as EnemyResultData;
    }
  } catch (error) {
    console.error("Failed to read enemy test result:", error);
  }

  return null;
};
