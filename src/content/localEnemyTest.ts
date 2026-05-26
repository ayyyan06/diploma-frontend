import {
  ENEMY_INTRO_IMAGE_SRC,
  getEnemyResultImageByKey,
  normalizeEnemyResultKey,
} from "./enemyLocalization";

export const LOCAL_ENEMY_TEST_ID = "enemy";
const LOCAL_ENEMY_RESULT_STORAGE_KEY = "local-enemy-result";

export type EnemyKey =
  | "mystan"
  | "zheztyrnak"
  | "aydahar"
  | "zhalgyzKozdiDau";

type EnemyQuestionOption = {
  id: string;
  label: string;
  enemyKey: EnemyKey;
};

type EnemyQuestion = {
  id: number;
  order: number;
  title: string;
  prompt: string;
  options: EnemyQuestionOption[];
};

type EnemyScore = {
  key: EnemyKey;
  label: string;
  title: string;
  count: number;
  percent: number;
  narrative: string;
};

type EnemyResultDetails = {
  threatenedNeed: string;
  needDescription: string;
  psychologicalBasis: string;
  triggerPatterns: string[];
  howItWins: string;
  hiddenTraitSummary: string;
  warningSign: string;
  resistance: string;
  distortionPatterns: string[];
  enemyScores: EnemyScore[];
};

export type LocalEnemyResult = {
  resultKey: EnemyKey;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  developmentFocus: null;
  whyThisResult: null;
  details: EnemyResultDetails;
};

export type LocalEnemyResultResponse = {
  test_id: -1;
  test_type: "enemy";
  test_title: string;
  result: LocalEnemyResult;
  updated_at: string;
};

type EnemyProfile = {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  threatenedNeed: string;
  needDescription: string;
  psychologicalBasis: string;
  howItWins: string;
  hiddenTraitSummary: string;
  warningSign: string;
  resistance: string;
  distortionPatterns: string[];
  scoreNarrative: string;
};

type LocalEnemyTest = {
  id: string;
  type: "enemy";
  title: string;
  description: string;
  image_src: string;
  image_alt: string;
  info_boxes: Array<{
    tone: "duration" | "format" | "result";
    value: string;
    label: string;
  }>;
  questions: EnemyQuestion[];
};

const ENEMY_ORDER: EnemyKey[] = [
  "mystan",
  "zheztyrnak",
  "aydahar",
  "zhalgyzKozdiDau",
];

const ENEMY_PROFILES: Record<EnemyKey, EnemyProfile> = {
  mystan: {
    title: "Mystan",
    subtitle: "Threat to trust and hidden motives",
    tagline:
      "Your main enemy is hidden intent, broken trust, and the feeling that another game is already unfolding behind your back.",
    description:
      "This result appears when open conflict is not what unsettles you most. What hits harder is not knowing who is sincere, what is being concealed, and whether the real alliances are happening somewhere just outside your sight.",
    strengths: [
      "You quickly notice cracks in trust and emotional inconsistency.",
      "You do not hand over your confidence too easily to a polished version of events.",
      "You protect yourself from naive loyalty and one-sided dependence.",
    ],
    growthAreas: [
      "Ambiguity can start to feel like proof of a hidden plot all by itself.",
      "Suspicion can consume attention before real evidence appears.",
      "It becomes harder to stay open when every unclear signal feels loaded.",
    ],
    threatenedNeed: "Attachment / trust",
    needDescription:
      "You are most vulnerable when reliable connection and interpersonal trust start to feel unstable.",
    psychologicalBasis:
      "In Klaus Grawe's model, this enemy threatens the need for attachment: the sense that people are emotionally readable, loyalty is not secretly shifting, and connection is still safe enough to lean on.",
    howItWins:
      "It wins when uncertainty stops feeling abstract and starts feeling personal. The less transparent other people seem, the more your attention shifts from events to decoding motives.",
    hiddenTraitSummary:
      "Across the night, you reacted most strongly to hidden alliances, incomplete truth, and the possibility that trust had already been compromised before you even knew it.",
    warningSign:
      "You start tracking hints, silence, and loyalty patterns more than the actual problem in front of you.",
    resistance:
      "Slow down the jump from ambiguity to conclusion. Separate what is known, what is only suspected, and what evidence would genuinely change your reading of the situation.",
    distortionPatterns: [
      "Ambiguity starts to look like intention.",
      "Lack of explanation feels automatically suspicious.",
      "You read motives faster than you verify facts.",
    ],
    scoreNarrative:
      "Hidden motives, fragile trust, and unreadable alliances are especially hard for you to carry.",
  },
  zheztyrnak: {
    title: "Zheztyrnak",
    subtitle: "Threat to dignity and social standing",
    tagline:
      "Your main enemy is humiliation, public diminishment, and the pain of being made smaller in front of others.",
    description:
      "This result appears when the sharpest wound in a difficult moment is not the task itself, but the blow to your dignity. Being interrupted, reduced, dismissed, or publicly misread lands more deeply than most people realize.",
    strengths: [
      "You are highly sensitive to disrespect and social injustice.",
      "You do not let other people casually erase your weight in the room.",
      "You protect your sense of value when external judgment turns cold.",
    ],
    growthAreas: [
      "Social pain can begin to feel more urgent than the original problem.",
      "The fear of losing face can speed up your defenses before the facts are clear.",
      "It can be hard to separate damage to your image from damage to your real standing.",
    ],
    threatenedNeed: "Self-esteem / dignity",
    needDescription:
      "You are most vulnerable when your sense of worth, dignity, or social respect feels under direct threat.",
    psychologicalBasis:
      "In Grawe's model, this enemy threatens the need for self-esteem: the need to feel significant, seen, and not stripped of human weight in front of others.",
    howItWins:
      "It wins when public evaluation becomes the true battlefield. Then the situation stops being mainly about the problem and becomes about the pain of being lowered, doubted, or shamed.",
    hiddenTraitSummary:
      "Throughout the story, you were most activated by scenes where name, standing, and the right to be taken seriously were at stake.",
    warningSign:
      "You begin to feel that losing face is more dangerous than the original problem itself.",
    resistance:
      "Name the difference between real harm and wounded image. The more clearly you separate dignity from momentary public judgment, the less power this enemy gets over your decisions.",
    distortionPatterns: [
      "Criticism feels like total diminishment.",
      "Public reaction starts to feel like the measure of your value.",
      "Restoring status can overshadow solving the actual problem.",
    ],
    scoreNarrative:
      "Humiliation, loss of face, and public diminishment hit you especially hard.",
  },
  aydahar: {
    title: "Aydahar",
    subtitle: "Threat to clarity and control",
    tagline:
      "Your main enemy is chaos: rising instability, lost direction, and the feeling that if no one steadies the night now, everything will break apart.",
    description:
      "This result appears when what overwhelms you most is not malice, but instability. Unclear direction, delayed decisions, and collapsing structure create a pressure that quickly becomes hard to carry.",
    strengths: [
      "You quickly sense when a situation urgently needs structure.",
      "You do not let dangerous uncertainty drift forever without response.",
      "You protect the ability to orient, plan, and keep the line from scattering.",
    ],
    growthAreas: [
      "Speed can start to feel safer than accuracy.",
      "Delays increase strain even before the facts change.",
      "Visible control can be mistaken for actual clarity.",
    ],
    threatenedNeed: "Orientation & control",
    needDescription:
      "You are most vulnerable when clarity, structure, and the sense of influence over events begin to disappear.",
    psychologicalBasis:
      "In Grawe's model, this enemy threatens the need for orientation and control: the sense that you understand what is happening and still have enough structure to respond effectively.",
    howItWins:
      "It wins when uncertainty becomes almost physically unbearable. At that point, decisive movement can start to feel safer than careful understanding.",
    hiddenTraitSummary:
      "Across the night, delay, instability, and the fear that events were slipping beyond recovery activated you more strongly than any other pressure.",
    warningSign:
      "You already feel calmer the moment someone takes control, even if the situation is still not truly clear.",
    resistance:
      "Return structure before you accelerate. Name what is urgent, what is known, and what next limited step would reduce chaos without creating more of it.",
    distortionPatterns: [
      "Speed feels like safety.",
      "Pause starts to feel more dangerous than error.",
      "Restoring control can outrun understanding.",
    ],
    scoreNarrative:
      "Chaos, delay, and slipping control unsettle you more quickly than other threats do.",
  },
  zhalgyzKozdiDau: {
    title: "Zhalgyz Kozdi Dau",
    subtitle: "Threat to safety under crushing power",
    tagline:
      "Your main enemy is cold force: hard hierarchy, sacrificial logic, and the feeling that people can be crushed in the name of order.",
    description:
      "This result appears when what frightens you most is not confusion, but the opposite: a system hardening into something cold, impersonal, and willing to justify harm as necessity.",
    strengths: [
      "You notice early when people begin turning human beings into functions.",
      "You are sensitive to moral cooling and unfair hardness in groups.",
      "You protect human scale where power tries to flatten everything into necessity.",
    ],
    growthAreas: [
      "A rigid system can start to feel even more merciless than it really is.",
      "Rules and pressure can quickly look like proof that compassion has vanished.",
      "A situation can feel trapped before it is truly without options.",
    ],
    threatenedNeed: "Safety / pain avoidance",
    needDescription:
      "You are most vulnerable when the world starts to feel cold, overpowering, and dangerous to human vulnerability itself.",
    psychologicalBasis:
      "In Grawe's model, this enemy threatens the need for safety and pain avoidance: the need to feel that stronger systems, harsh necessity, or impersonal force will not simply crush the vulnerable.",
    howItWins:
      "It wins when the night stops feeling like a conflict between people and starts feeling like a machine that will demand a sacrifice and call it reasonable.",
    hiddenTraitSummary:
      "Across the story, you were most activated when the group hardened, warmth disappeared, and events began moving according to force, hierarchy, and the logic of a convenient victim.",
    warningSign:
      "You begin to read the scene not as a disagreement between people, but as a system closing around the most powerless person in it.",
    resistance:
      "Bring the human dimension back into view. Ask who still has a choice, who can still be protected, and which parts of the pressure are truly necessary versus merely dressed up as necessity.",
    distortionPatterns: [
      "Structure starts to feel automatically inhuman.",
      "Necessity begins to justify coldness before the facts are checked.",
      "The danger of the system overshadows the remaining room for choice and care.",
    ],
    scoreNarrative:
      "Crushing power, cold hierarchy, and sacrificial logic unsettle you most strongly.",
  },
};

const QUESTIONS: EnemyQuestion[] = [
  {
    id: 1,
    order: 1,
    title: "When the yurt falls silent, what stings first?",
    prompt:
      "You arrive at the winter camp and hear another person being praised for the idea that first came from you.",
    options: [
      {
        id: "e1-mystan",
        enemyKey: "mystan",
        label:
          "That I still cannot tell whether this was simple convenience or the beginning of someone else's hidden game.",
      },
      {
        id: "e1-zheztyrnak",
        enemyKey: "zheztyrnak",
        label:
          "That I was made smaller in front of everyone, and now they have all seen it.",
      },
      {
        id: "e1-aydahar",
        enemyKey: "aydahar",
        label:
          "That if nobody pulls the room back into line right now, the whole evening could unravel.",
      },
      {
        id: "e1-zhalgyz",
        enemyKey: "zhalgyzKozdiDau",
        label:
          "That people forget fairness so quickly once hierarchy and power enter the room.",
      },
    ],
  },
  {
    id: 2,
    order: 2,
    title: "At the saddlebag, which thought comes first?",
    prompt:
      "Near the yurt entrance, you notice the missing rider's saddlebag. The strap is loosened, and a folded letter is visible inside.",
    options: [
      {
        id: "e2-mystan",
        enemyKey: "mystan",
        label:
          "If someone has already looked inside before me, then much more is hidden here than people are saying aloud.",
      },
      {
        id: "e2-zheztyrnak",
        enemyKey: "zheztyrnak",
        label:
          "If there is something inside that makes me look blind or weak, I do not want to be the last to know it.",
      },
      {
        id: "e2-aydahar",
        enemyKey: "aydahar",
        label:
          "Until we understand what is happening, the night is only becoming more dangerous.",
      },
      {
        id: "e2-zhalgyz",
        enemyKey: "zhalgyzKozdiDau",
        label:
          "The worst part is how quickly important truth ends up in the hands of a few, while everyone else becomes an instrument.",
      },
    ],
  },
  {
    id: 3,
    order: 3,
    title: "What feels heaviest when the young rider confesses?",
    prompt:
      "A young rider admits he sent the missing messenger along the shorter road even though the weather was already turning.",
    options: [
      {
        id: "e3-mystan",
        enemyKey: "mystan",
        label:
          "That this may not be the whole truth, and I am being asked to trust what I cannot verify.",
      },
      {
        id: "e3-zheztyrnak",
        enemyKey: "zheztyrnak",
        label:
          "That if this comes to light, his disgrace could drag my name down with it.",
      },
      {
        id: "e3-aydahar",
        enemyKey: "aydahar",
        label:
          "That there may be no time left for softness, and the damage has to be contained before dawn.",
      },
      {
        id: "e3-zhalgyz",
        enemyKey: "zhalgyzKozdiDau",
        label:
          "That one mistake can trigger a harsher order for everyone, where nobody will be treated humanly anymore.",
      },
    ],
  },
  {
    id: 4,
    order: 4,
    title: "At the council fire, what cuts deepest?",
    prompt:
      "During the night council, you are interrupted and told that decisions on a night like this should belong to people who are truly trusted.",
    options: [
      {
        id: "e4-mystan",
        enemyKey: "mystan",
        label:
          "That this does not sound like a casual insult at all, but like part of a larger move already set against me.",
      },
      {
        id: "e4-zheztyrnak",
        enemyKey: "zheztyrnak",
        label:
          "That I am being publicly stripped of weight and dignity before I can even finish speaking.",
      },
      {
        id: "e4-aydahar",
        enemyKey: "aydahar",
        label:
          "That if the room is not steadied now, the entire conversation will collapse beyond repair.",
      },
      {
        id: "e4-zhalgyz",
        enemyKey: "zhalgyzKozdiDau",
        label:
          "That in a hard night like this, a group can so easily take away one person's right to a voice.",
      },
    ],
  },
  {
    id: 5,
    order: 5,
    title: "What is most dangerous in the rumor outside?",
    prompt:
      "By the fires outside, whispers are already spreading that you are the one partly responsible for the missing rider and the strain now spreading through camp.",
    options: [
      {
        id: "e5-mystan",
        enemyKey: "mystan",
        label:
          "That I do not know who started this, or who is quietly feeding it against me.",
      },
      {
        id: "e5-zheztyrnak",
        enemyKey: "zheztyrnak",
        label:
          "That people may decide who I am before I ever get the chance to answer for myself.",
      },
      {
        id: "e5-aydahar",
        enemyKey: "aydahar",
        label:
          "That if it spreads just a little further, the whole situation may become impossible to hold together.",
      },
      {
        id: "e5-zhalgyz",
        enemyKey: "zhalgyzKozdiDau",
        label:
          "That in a hard night, a community can choose one useful person to blame with frightening ease.",
      },
    ],
  },
  {
    id: 6,
    order: 6,
    title: "When the stores are counted, what strikes first?",
    prompt:
      "Near midnight it becomes clear that if the storm deepens, there may not be enough food and fuel for everyone to make it through the cold safely.",
    options: [
      {
        id: "e6-mystan",
        enemyKey: "mystan",
        label:
          "That scarcity will reveal who was only ever speaking generously while thinking only of themselves.",
      },
      {
        id: "e6-zheztyrnak",
        enemyKey: "zheztyrnak",
        label:
          "That someone will soon be judged less worthy of protection and help.",
      },
      {
        id: "e6-aydahar",
        enemyKey: "aydahar",
        label:
          "That if a clear order does not appear now, panic alone may do even more damage than the shortage.",
      },
      {
        id: "e6-zhalgyz",
        enemyKey: "zhalgyzKozdiDau",
        label:
          "That necessity becomes an excuse for cruelty so easily once fear enters the camp.",
      },
    ],
  },
  {
    id: 7,
    order: 7,
    title: "When your ally falters, what feels most dangerous?",
    prompt:
      "The person who had been standing with you suddenly says the wrong thing in council and weakens your position in the worst possible moment.",
    options: [
      {
        id: "e7-mystan",
        enemyKey: "mystan",
        label:
          "That loyalty around me may never have been as solid as I believed it was.",
      },
      {
        id: "e7-zheztyrnak",
        enemyKey: "zheztyrnak",
        label:
          "That someone else's visible failure now stains my name too.",
      },
      {
        id: "e7-aydahar",
        enemyKey: "aydahar",
        label:
          "That the ground is slipping too fast, and if nobody regathers the night now, everything may scatter.",
      },
      {
        id: "e7-zhalgyz",
        enemyKey: "zhalgyzKozdiDau",
        label:
          "That once people sense weakness, they can become colder and harsher than anyone expected.",
      },
    ],
  },
  {
    id: 8,
    order: 8,
    title: "Before dawn, what troubles you most about the final choice?",
    prompt:
      "The rider is found too late. The elders want one clear person to blame before sunrise so order can be restored fast.",
    options: [
      {
        id: "e8-mystan",
        enemyKey: "mystan",
        label:
          "That another hidden calculation may be sitting inside this decision, and I still cannot fully see it.",
      },
      {
        id: "e8-zheztyrnak",
        enemyKey: "zheztyrnak",
        label:
          "That if I step back now, I may be remembered as lesser, weaker, or easy to set aside.",
      },
      {
        id: "e8-aydahar",
        enemyKey: "aydahar",
        label:
          "That waiting any longer feels unbearable, because uncertainty itself has become worse than almost any answer.",
      },
      {
        id: "e8-zhalgyz",
        enemyKey: "zhalgyzKozdiDau",
        label:
          "That a community can demand a sacrifice so easily and call that necessity.",
      },
    ],
  },
];

const LOCAL_ENEMY_TEST: LocalEnemyTest = {
  id: LOCAL_ENEMY_TEST_ID,
  type: "enemy",
  title: "Who's Your Enemy?",
  description:
    "This scenario-based test is built around Klaus Grawe's four basic psychological needs. It explores what is most likely to overpower you before dawn: hidden motives, humiliation, chaos, or crushing power.",
  image_src: ENEMY_INTRO_IMAGE_SRC,
  image_alt: "Enemy test intro illustration",
  info_boxes: [
    { tone: "duration", value: "5-7 min", label: "Average duration" },
    { tone: "format", value: "8 scenes", label: "One connected pressure story" },
    { tone: "result", value: "4 scales", label: "One dominant enemy + full spectrum" },
  ],
  questions: QUESTIONS,
};

function buildCounts(answers: Record<string, string>) {
  const counts: Record<EnemyKey, number> = {
    mystan: 0,
    zheztyrnak: 0,
    aydahar: 0,
    zhalgyzKozdiDau: 0,
  };

  QUESTIONS.forEach((question) => {
    const selectedId = answers[String(question.id)];
    const selectedOption = question.options.find((option) => option.id === selectedId);
    if (selectedOption) {
      counts[selectedOption.enemyKey] += 1;
    }
  });

  return counts;
}

function buildEnemyScores(counts: Record<EnemyKey, number>): EnemyScore[] {
  return ENEMY_ORDER.map((key) => {
    const profile = ENEMY_PROFILES[key];
    const count = counts[key];
    return {
      key,
      label: profile.title,
      title: profile.title,
      count,
      percent: Math.round((count / QUESTIONS.length) * 100),
      narrative: profile.scoreNarrative,
    };
  });
}

function pickDominantEnemy(counts: Record<EnemyKey, number>): EnemyKey {
  return ENEMY_ORDER.reduce((best, key) =>
    counts[key] > counts[best] ? key : best,
  );
}

export function isLocalEnemyTestId(id?: string | null) {
  return id === LOCAL_ENEMY_TEST_ID;
}

export function getLocalEnemyTest() {
  return LOCAL_ENEMY_TEST;
}

export function evaluateLocalEnemyTest(
  answers: Record<string, string>,
): LocalEnemyResultResponse {
  const counts = buildCounts(answers);
  const dominantKey = pickDominantEnemy(counts);
  const profile = ENEMY_PROFILES[dominantKey];
  const image = getEnemyResultImageByKey(dominantKey) ?? {
    imageSrc: ENEMY_INTRO_IMAGE_SRC,
    imageAlt: profile.title,
  };

  const result: LocalEnemyResult = {
    resultKey: dominantKey,
    title: profile.title,
    subtitle: profile.subtitle,
    imageSrc: image.imageSrc,
    imageAlt: image.imageAlt,
    tagline: profile.tagline,
    description: profile.description,
    strengths: profile.strengths,
    growthAreas: profile.growthAreas,
    developmentFocus: null,
    whyThisResult: null,
    details: {
      threatenedNeed: profile.threatenedNeed,
      needDescription: profile.needDescription,
      psychologicalBasis: profile.psychologicalBasis,
      triggerPatterns: [],
      howItWins: profile.howItWins,
      hiddenTraitSummary: profile.hiddenTraitSummary,
      warningSign: profile.warningSign,
      resistance: profile.resistance,
      distortionPatterns: profile.distortionPatterns,
      enemyScores: buildEnemyScores(counts),
    },
  };

  return {
    test_id: -1,
    test_type: "enemy",
    test_title: LOCAL_ENEMY_TEST.title,
    result,
    updated_at: new Date().toISOString(),
  };
}

export function storeLocalEnemyResult(result: LocalEnemyResultResponse) {
  sessionStorage.setItem(
    LOCAL_ENEMY_RESULT_STORAGE_KEY,
    JSON.stringify(result),
  );
}

export function getStoredLocalEnemyResult(): LocalEnemyResultResponse | null {
  const raw = sessionStorage.getItem(LOCAL_ENEMY_RESULT_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as LocalEnemyResultResponse;
    const normalizedKey = normalizeEnemyResultKey(parsed.result?.resultKey);
    if (!normalizedKey) return null;
    return parsed;
  } catch {
    return null;
  }
}
