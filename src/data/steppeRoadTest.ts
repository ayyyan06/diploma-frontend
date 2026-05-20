export const STEPPE_ROAD_TEST_TYPE = "road";

const STEPPE_ROAD_STORAGE_KEY = "qazaqweb-steppe-road-result";
const STEPPE_ROAD_ROLE_ORDER = ["guide", "scout", "firekeeper", "lookout"] as const;

export type SteppeRoadRoleKey = (typeof STEPPE_ROAD_ROLE_ORDER)[number];
export type SteppeRoadAxisKey =
  | "initiative"
  | "flexibility"
  | "socialOrientation"
  | "uncertaintyTolerance";

type SteppeRoadAxisWeights = Record<SteppeRoadAxisKey, number>;

interface SteppeRoadRoleProfile {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  firstMove: string;
  pressurePattern: string;
  supportStyle: string;
  developmentFocus: string;
  whyThisRole: string;
  roadEpilogue: string;
  strengths: string[];
  growthAreas: string[];
  accent: string;
  softAccent: string;
  accentBorder: string;
}

interface SteppeRoadAxisConfig {
  label: string;
  lowLabel: string;
  highLabel: string;
  narrative: string;
}

export interface SteppeRoadOption {
  id: string;
  label: string;
  roleKey: SteppeRoadRoleKey;
  axisWeights: SteppeRoadAxisWeights;
}

export interface SteppeRoadScene {
  id: number;
  chapter: string;
  title: string;
  prompt: string;
  options: SteppeRoadOption[];
}

export interface SteppeRoadRoleScore {
  key: SteppeRoadRoleKey;
  label: string;
  score: number;
  narrative: string;
  accent: string;
  softAccent: string;
}

export interface SteppeRoadAxisResult {
  key: SteppeRoadAxisKey;
  label: string;
  score: number;
  lowLabel: string;
  highLabel: string;
  leaningLabel: string;
  narrative: string;
}

export interface SteppeRoadResultData {
  roleKey: SteppeRoadRoleKey;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  firstMove: string;
  pressurePattern: string;
  supportStyle: string;
  developmentFocus: string;
  whyThisRole: string;
  roadEpilogue: string;
  strengths: string[];
  growthAreas: string[];
  accent: string;
  softAccent: string;
  accentBorder: string;
  roleScores: SteppeRoadRoleScore[];
  axes: SteppeRoadAxisResult[];
}

const STEPPE_ROAD_ROLE_PROFILES: Record<
  SteppeRoadRoleKey,
  SteppeRoadRoleProfile
> = {
  guide: {
    title: "The Guide",
    subtitle: "Direction under pressure",
    tagline: "When the road breaks apart, you create a line others can follow.",
    description:
      "You meet uncertainty by creating direction. You do not need perfect conditions before moving; you need enough clarity to organize people, set pace, and prevent drift.",
    firstMove:
      "You look for the decision that will give the whole group momentum.",
    pressurePattern:
      "Under strain, you become more decisive and more focused on keeping the journey moving.",
    supportStyle:
      "People often feel steadier around you because you give shape to a confusing moment.",
    developmentFocus:
      "Leave room for slower voices before locking the group into one path.",
    whyThisRole:
      "Across the journey, your choices repeatedly favored structure, forward movement, and shared direction. You tend to handle pressure by making the path more legible for everyone.",
    roadEpilogue:
      "By sunset, you are the person others glance toward when the horizon stops making sense.",
    strengths: [
      "Creates direction quickly",
      "Keeps momentum during confusion",
      "Can organize people under pressure",
    ],
    growthAreas: [
      "May move faster than others can emotionally follow",
      "Can mistake decisiveness for complete certainty",
      "May underuse quiet observation",
    ],
    accent: "#b86d25",
    softAccent: "#fff3e4",
    accentBorder: "#e7c6a3",
  },
  scout: {
    title: "The Scout",
    subtitle: "Adaptive pathfinder",
    tagline: "You test the unknown instead of waiting for it to disappear.",
    description:
      "You respond to change by exploring options in motion. Rather than defending one fixed plan, you probe, improvise, and keep the group flexible while reality changes around you.",
    firstMove:
      "You look for a trial move that reveals more of the terrain before committing fully.",
    pressurePattern:
      "When things tighten, you stay inventive and keep searching for the next workable opening.",
    supportStyle:
      "Others benefit from your adaptability because you reduce the fear of being stuck with one bad plan.",
    developmentFocus:
      "Commit more clearly once enough evidence has appeared.",
    whyThisRole:
      "Your answers favored experimentation, adjustment, and movement through partial information. You seem most alive when the road requires improvisation rather than rigid control.",
    roadEpilogue:
      "By the final ridge, you are the one who keeps discovering that there is still another way through.",
    strengths: [
      "Adapts quickly when plans break",
      "Comfortable with trial and adjustment",
      "Finds options in changing conditions",
    ],
    growthAreas: [
      "Can stay exploratory for too long",
      "May understate the group's need for stability",
      "Can appear hard to pin down",
    ],
    accent: "#2f7a66",
    softAccent: "#edf8f4",
    accentBorder: "#b9ddcf",
  },
  firekeeper: {
    title: "The Firekeeper",
    subtitle: "Keeper of morale",
    tagline: "You protect the people so the road can keep protecting the purpose.",
    description:
      "You handle uncertainty by stabilizing the human atmosphere around it. Your instinct is to keep trust, morale, and emotional safety intact so the group can continue without quietly splintering.",
    firstMove:
      "You check the people in the story before you trust the plan in the story.",
    pressurePattern:
      "When strain rises, you notice tone, fatigue, and fracture before you notice speed.",
    supportStyle:
      "People often feel seen around you, especially when pressure could easily turn them into tools instead of companions.",
    developmentFocus:
      "Practice making firm calls before harmony turns into delay.",
    whyThisRole:
      "Throughout the journey, your choices consistently protected relationships, morale, and emotional steadiness. You seem to understand that a group can lose the road long before it loses the map.",
    roadEpilogue:
      "By the time night nears, you are the warmth that keeps the journey from becoming every person for themselves.",
    strengths: [
      "Protects trust in tense moments",
      "Reads emotional strain early",
      "Helps groups stay humane under pressure",
    ],
    growthAreas: [
      "May postpone hard calls for too long",
      "Can carry responsibility for everyone's feelings",
      "May understate your own urgency",
    ],
    accent: "#c35d3f",
    softAccent: "#fff0eb",
    accentBorder: "#edc0b2",
  },
  lookout: {
    title: "The Lookout",
    subtitle: "Reader of hidden risk",
    tagline: "You create safety by noticing what others rush past.",
    description:
      "You face uncertainty by studying it closely. Your strength is not speed but signal detection: you slow the moment down enough to read danger, pattern, and consequence before the group commits itself too early.",
    firstMove:
      "You scan for what the situation is quietly telling you before you spend energy on action.",
    pressurePattern:
      "As tension rises, your attention sharpens around risk, detail, and what could go wrong if the group moves blindly.",
    supportStyle:
      "Others benefit from your caution when the cost of one rushed decision would be difficult to undo.",
    developmentFocus:
      "Move sooner once the key risk has become clear enough.",
    whyThisRole:
      "Your answers repeatedly leaned toward observation, caution, and reading the environment before acting. You tend to reduce uncertainty by making it more visible.",
    roadEpilogue:
      "At the edge of dusk, you are the one who keeps the group from paying full price for someone else's hurry.",
    strengths: [
      "Sees risk before it becomes obvious",
      "Thinks carefully about consequences",
      "Protects the group from reckless momentum",
    ],
    growthAreas: [
      "Can wait for more certainty than the moment allows",
      "May sound hesitant when you are actually precise",
      "Can struggle to signal when enough is enough",
    ],
    accent: "#5d6f95",
    softAccent: "#eef2fb",
    accentBorder: "#c8d2ea",
  },
};

const STEPPE_ROAD_AXIS_CONFIG: Record<
  SteppeRoadAxisKey,
  SteppeRoadAxisConfig
> = {
  initiative: {
    label: "Initiative",
    lowLabel: "deliberate",
    highLabel: "action-forward",
    narrative:
      "How quickly you move when the situation is still unfolding.",
  },
  flexibility: {
    label: "Flexibility",
    lowLabel: "structured",
    highLabel: "adaptive",
    narrative:
      "How willing you are to change method when the original plan stops fitting reality.",
  },
  socialOrientation: {
    label: "Social Orientation",
    lowLabel: "task-first",
    highLabel: "people-first",
    narrative:
      "Whether your attention goes first to the mission or to the emotional state of the group.",
  },
  uncertaintyTolerance: {
    label: "Uncertainty Tolerance",
    lowLabel: "certainty-seeking",
    highLabel: "ambiguity-tolerant",
    narrative:
      "How comfortably you can keep moving without full information.",
  },
};

const STEPPE_ROAD_ROLE_TARGETS: Record<
  SteppeRoadRoleKey,
  Record<SteppeRoadAxisKey, number>
> = {
  guide: {
    initiative: 82,
    flexibility: 58,
    socialOrientation: 48,
    uncertaintyTolerance: 72,
  },
  scout: {
    initiative: 74,
    flexibility: 88,
    socialOrientation: 34,
    uncertaintyTolerance: 86,
  },
  firekeeper: {
    initiative: 42,
    flexibility: 62,
    socialOrientation: 90,
    uncertaintyTolerance: 52,
  },
  lookout: {
    initiative: 24,
    flexibility: 36,
    socialOrientation: 40,
    uncertaintyTolerance: 18,
  },
};

const STEPPE_ROAD_ROLE_NARRATIVES: Record<SteppeRoadRoleKey, string> = {
  guide: "Creates direction and pace when the group needs a clear line to follow.",
  scout: "Finds openings through experimentation, movement, and quick adjustment.",
  firekeeper: "Protects trust, morale, and emotional steadiness along the way.",
  lookout: "Spots risk, pattern, and hidden cost before the group commits.",
};

export const STEPPE_ROAD_SCENES: SteppeRoadScene[] = [
  {
    id: 1,
    chapter: "Dawn Departure",
    title:
      "You leave the aul before sunrise. An elder warns that the wind may turn by afternoon. What is your first move?",
    prompt:
      "This is one connected journey. Choose the action that feels most like your real instinct, not the nicest answer.",
    options: [
      {
        id: "road-1-guide",
        label:
          "Set a clear pace, give each person a role, and get the group moving before the weather changes.",
        roleKey: "guide",
        axisWeights: {
          initiative: 5,
          flexibility: 3,
          socialOrientation: 2,
          uncertaintyTolerance: 4,
        },
      },
      {
        id: "road-1-scout",
        label:
          "Ride ahead far enough to test the shorter route while the others prepare to follow if it looks sound.",
        roleKey: "scout",
        axisWeights: {
          initiative: 4,
          flexibility: 5,
          socialOrientation: 2,
          uncertaintyTolerance: 5,
        },
      },
      {
        id: "road-1-firekeeper",
        label:
          "Gather everyone first, check readiness, and make sure the journey does not begin with hidden tension.",
        roleKey: "firekeeper",
        axisWeights: {
          initiative: 2,
          flexibility: 3,
          socialOrientation: 5,
          uncertaintyTolerance: 3,
        },
      },
      {
        id: "road-1-lookout",
        label:
          "Pause to study the sky and terrain before committing the whole group to one direction.",
        roleKey: "lookout",
        axisWeights: {
          initiative: 1,
          flexibility: 2,
          socialOrientation: 2,
          uncertaintyTolerance: 1,
        },
      },
    ],
  },
  {
    id: 2,
    chapter: "Broken Crossing",
    title:
      "By midmorning, the usual river crossing is half washed out. You have to decide before losing more light.",
    prompt:
      "The story continues on the same road. Pick the move you would most likely make in the moment.",
    options: [
      {
        id: "road-2-guide",
        label:
          "Choose the safest workable crossing, assign an order, and move everyone through with discipline.",
        roleKey: "guide",
        axisWeights: {
          initiative: 5,
          flexibility: 3,
          socialOrientation: 3,
          uncertaintyTolerance: 4,
        },
      },
      {
        id: "road-2-scout",
        label:
          "Walk the bank quickly and test for a narrower crossing or a better detour before settling.",
        roleKey: "scout",
        axisWeights: {
          initiative: 4,
          flexibility: 5,
          socialOrientation: 2,
          uncertaintyTolerance: 5,
        },
      },
      {
        id: "road-2-firekeeper",
        label:
          "Slow the group down, calm anyone spooked by the water, and make sure nobody crosses while rattled.",
        roleKey: "firekeeper",
        axisWeights: {
          initiative: 2,
          flexibility: 3,
          socialOrientation: 5,
          uncertaintyTolerance: 2,
        },
      },
      {
        id: "road-2-lookout",
        label:
          "Study the current, the banks, and the weak points before anyone risks a wrong step.",
        roleKey: "lookout",
        axisWeights: {
          initiative: 1,
          flexibility: 2,
          socialOrientation: 2,
          uncertaintyTolerance: 1,
        },
      },
    ],
  },
  {
    id: 3,
    chapter: "Voices Split",
    title:
      "The delay sparks disagreement. One companion wants speed at any cost, another wants caution even if you arrive late.",
    prompt:
      "Choose the move that feels most natural when people around you stop moving as one.",
    options: [
      {
        id: "road-3-guide",
        label:
          "Hear both sides briefly, then make a firm call so the group does not lose more momentum to debate.",
        roleKey: "guide",
        axisWeights: {
          initiative: 5,
          flexibility: 3,
          socialOrientation: 3,
          uncertaintyTolerance: 4,
        },
      },
      {
        id: "road-3-scout",
        label:
          "Propose a temporary test move that lets the group learn from the road before arguing further.",
        roleKey: "scout",
        axisWeights: {
          initiative: 4,
          flexibility: 5,
          socialOrientation: 2,
          uncertaintyTolerance: 5,
        },
      },
      {
        id: "road-3-firekeeper",
        label:
          "Address the fear under the disagreement first so the group can think together instead of just pushing against each other.",
        roleKey: "firekeeper",
        axisWeights: {
          initiative: 2,
          flexibility: 4,
          socialOrientation: 5,
          uncertaintyTolerance: 3,
        },
      },
      {
        id: "road-3-lookout",
        label:
          "Pull the argument back to facts, risks, and what each option could cost if the weather turns.",
        roleKey: "lookout",
        axisWeights: {
          initiative: 2,
          flexibility: 2,
          socialOrientation: 2,
          uncertaintyTolerance: 1,
        },
      },
    ],
  },
  {
    id: 4,
    chapter: "Short Supplies",
    title:
      "When you count the packs, there is less water than expected. The road ahead is still long.",
    prompt:
      "Now the pressure shifts from debate to resources. Choose what you would actually do next.",
    options: [
      {
        id: "road-4-guide",
        label:
          "Rework the plan immediately, ration clearly, and reset the group's pace around what is still possible.",
        roleKey: "guide",
        axisWeights: {
          initiative: 5,
          flexibility: 4,
          socialOrientation: 3,
          uncertaintyTolerance: 4,
        },
      },
      {
        id: "road-4-scout",
        label:
          "Look for alternate sources, shortcut options, or a route adjustment that changes the resource problem itself.",
        roleKey: "scout",
        axisWeights: {
          initiative: 4,
          flexibility: 5,
          socialOrientation: 2,
          uncertaintyTolerance: 5,
        },
      },
      {
        id: "road-4-firekeeper",
        label:
          "Talk openly about the shortage so nobody starts hiding fear or resentment while the group keeps moving.",
        roleKey: "firekeeper",
        axisWeights: {
          initiative: 2,
          flexibility: 3,
          socialOrientation: 5,
          uncertaintyTolerance: 3,
        },
      },
      {
        id: "road-4-lookout",
        label:
          "Calculate the numbers carefully before changing course, because one sloppy assumption now could cost more later.",
        roleKey: "lookout",
        axisWeights: {
          initiative: 1,
          flexibility: 2,
          socialOrientation: 2,
          uncertaintyTolerance: 1,
        },
      },
    ],
  },
  {
    id: 5,
    chapter: "A Stranger On The Road",
    title:
      "A tired rider appears and asks for help finding the road to the next settlement. Helping will cost time.",
    prompt:
      "This scene is still part of the same journey. Choose the response that feels closest to your instinct under limited time.",
    options: [
      {
        id: "road-5-guide",
        label:
          "Help quickly and efficiently, but keep the group's main objective clearly in front of everyone.",
        roleKey: "guide",
        axisWeights: {
          initiative: 4,
          flexibility: 3,
          socialOrientation: 3,
          uncertaintyTolerance: 4,
        },
      },
      {
        id: "road-5-scout",
        label:
          "See whether helping the rider could also reveal a better route, new information, or another way forward.",
        roleKey: "scout",
        axisWeights: {
          initiative: 4,
          flexibility: 5,
          socialOrientation: 3,
          uncertaintyTolerance: 5,
        },
      },
      {
        id: "road-5-firekeeper",
        label:
          "Make room to help because how the group treats vulnerable people matters even under pressure.",
        roleKey: "firekeeper",
        axisWeights: {
          initiative: 2,
          flexibility: 4,
          socialOrientation: 5,
          uncertaintyTolerance: 3,
        },
      },
      {
        id: "road-5-lookout",
        label:
          "Ask careful questions first and make sure the request is safe and genuine before changing the plan.",
        roleKey: "lookout",
        axisWeights: {
          initiative: 1,
          flexibility: 2,
          socialOrientation: 3,
          uncertaintyTolerance: 1,
        },
      },
    ],
  },
  {
    id: 6,
    chapter: "Dust In The Distance",
    title:
      "The wind rises. Dust begins to blur the landmarks, and the road is no longer easy to read.",
    prompt:
      "Choose the response that sounds most like your real pattern when clarity starts disappearing.",
    options: [
      {
        id: "road-6-guide",
        label:
          "Keep everyone close, simplify the plan, and make sure the group still has one direction even with poor visibility.",
        roleKey: "guide",
        axisWeights: {
          initiative: 5,
          flexibility: 3,
          socialOrientation: 3,
          uncertaintyTolerance: 4,
        },
      },
      {
        id: "road-6-scout",
        label:
          "Adjust on the fly, using whatever new signs the terrain still offers instead of clinging to the old route.",
        roleKey: "scout",
        axisWeights: {
          initiative: 4,
          flexibility: 5,
          socialOrientation: 2,
          uncertaintyTolerance: 5,
        },
      },
      {
        id: "road-6-firekeeper",
        label:
          "Focus first on keeping the group calm, steady, and connected so fear does not spread faster than the storm.",
        roleKey: "firekeeper",
        axisWeights: {
          initiative: 2,
          flexibility: 3,
          socialOrientation: 5,
          uncertaintyTolerance: 2,
        },
      },
      {
        id: "road-6-lookout",
        label:
          "Stop long enough to identify the most reliable signal left before the group drifts into a preventable mistake.",
        roleKey: "lookout",
        axisWeights: {
          initiative: 1,
          flexibility: 2,
          socialOrientation: 2,
          uncertaintyTolerance: 1,
        },
      },
    ],
  },
  {
    id: 7,
    chapter: "A Costly Mistake",
    title:
      "Under stress, one companion mishandles the pack and part of your supplies slide down a rocky slope.",
    prompt:
      "The moment is tense, practical, and emotional at once. Pick the reaction that feels most natural for you.",
    options: [
      {
        id: "road-7-guide",
        label:
          "Stabilize the situation, decide what can still be recovered, and move the group back into action.",
        roleKey: "guide",
        axisWeights: {
          initiative: 5,
          flexibility: 4,
          socialOrientation: 2,
          uncertaintyTolerance: 4,
        },
      },
      {
        id: "road-7-scout",
        label:
          "Look immediately for a creative workaround rather than spending too long on what is already lost.",
        roleKey: "scout",
        axisWeights: {
          initiative: 4,
          flexibility: 5,
          socialOrientation: 2,
          uncertaintyTolerance: 5,
        },
      },
      {
        id: "road-7-firekeeper",
        label:
          "Make sure the person who made the mistake does not shut down or get turned into the group's scapegoat.",
        roleKey: "firekeeper",
        axisWeights: {
          initiative: 2,
          flexibility: 3,
          socialOrientation: 5,
          uncertaintyTolerance: 3,
        },
      },
      {
        id: "road-7-lookout",
        label:
          "Reconstruct what happened carefully so the next mistake does not come from the same blind spot.",
        roleKey: "lookout",
        axisWeights: {
          initiative: 1,
          flexibility: 2,
          socialOrientation: 2,
          uncertaintyTolerance: 1,
        },
      },
    ],
  },
  {
    id: 8,
    chapter: "Before Sunset",
    title:
      "At the last ridge, you can still reach the aul by sunset, but only if you make one final call with incomplete certainty.",
    prompt:
      "This final choice closes the same story. Pick the ending move that feels most like you.",
    options: [
      {
        id: "road-8-guide",
        label:
          "Make the call, set the pace, and accept that the group now needs commitment more than more debate.",
        roleKey: "guide",
        axisWeights: {
          initiative: 5,
          flexibility: 3,
          socialOrientation: 3,
          uncertaintyTolerance: 4,
        },
      },
      {
        id: "road-8-scout",
        label:
          "Choose the path that leaves the most room to adjust mid-move if the terrain changes again.",
        roleKey: "scout",
        axisWeights: {
          initiative: 4,
          flexibility: 5,
          socialOrientation: 2,
          uncertaintyTolerance: 5,
        },
      },
      {
        id: "road-8-firekeeper",
        label:
          "Choose the option the group can sustain together, even if it is not the fastest on paper.",
        roleKey: "firekeeper",
        axisWeights: {
          initiative: 2,
          flexibility: 3,
          socialOrientation: 5,
          uncertaintyTolerance: 3,
        },
      },
      {
        id: "road-8-lookout",
        label:
          "Delay just long enough to verify the most dangerous unknown before committing everyone to the final stretch.",
        roleKey: "lookout",
        axisWeights: {
          initiative: 1,
          flexibility: 2,
          socialOrientation: 2,
          uncertaintyTolerance: 1,
        },
      },
    ],
  },
];

const createEmptyAxisTotals = (): Record<SteppeRoadAxisKey, number> => ({
  initiative: 0,
  flexibility: 0,
  socialOrientation: 0,
  uncertaintyTolerance: 0,
});

const createEmptyRoleScores = (): Record<SteppeRoadRoleKey, number> => ({
  guide: 0,
  scout: 0,
  firekeeper: 0,
  lookout: 0,
});

const toPercent = (rawScore: number): number =>
  Math.max(0, Math.min(100, Math.round(((rawScore - 1) / 4) * 100)));

const buildAxisResults = (
  axisTotals: Record<SteppeRoadAxisKey, number>,
  itemCount: number,
): SteppeRoadAxisResult[] =>
  (Object.keys(STEPPE_ROAD_AXIS_CONFIG) as SteppeRoadAxisKey[]).map((key) => {
    const config = STEPPE_ROAD_AXIS_CONFIG[key];
    const averageScore = itemCount > 0 ? axisTotals[key] / itemCount : 1;
    const score = toPercent(averageScore);

    let leaningLabel = `Balanced between ${config.lowLabel} and ${config.highLabel}`;
    if (score >= 60) {
      leaningLabel = config.highLabel;
    } else if (score <= 40) {
      leaningLabel = config.lowLabel;
    }

    return {
      key,
      label: config.label,
      score,
      lowLabel: config.lowLabel,
      highLabel: config.highLabel,
      leaningLabel,
      narrative: config.narrative,
    };
  });

const axisDistanceForRole = (
  axisMap: Record<SteppeRoadAxisKey, number>,
  roleKey: SteppeRoadRoleKey,
): number =>
  (Object.keys(STEPPE_ROAD_ROLE_TARGETS[roleKey]) as SteppeRoadAxisKey[]).reduce(
    (total, axisKey) =>
      total +
      Math.abs(axisMap[axisKey] - STEPPE_ROAD_ROLE_TARGETS[roleKey][axisKey]),
    0,
  );

const getWinningRole = (
  roleScores: Record<SteppeRoadRoleKey, number>,
  axisMap: Record<SteppeRoadAxisKey, number>,
): SteppeRoadRoleKey => {
  const topScore = Math.max(
    ...STEPPE_ROAD_ROLE_ORDER.map((roleKey) => roleScores[roleKey]),
  );
  const topRoles = STEPPE_ROAD_ROLE_ORDER.filter(
    (roleKey) => roleScores[roleKey] === topScore,
  );

  if (topRoles.length === 1) {
    return topRoles[0];
  }

  return topRoles.reduce((bestRole, currentRole) =>
    axisDistanceForRole(axisMap, currentRole) <
    axisDistanceForRole(axisMap, bestRole)
      ? currentRole
      : bestRole,
  );
};

const buildRoleScoreCards = (
  roleScores: Record<SteppeRoadRoleKey, number>,
  itemCount: number,
): SteppeRoadRoleScore[] =>
  STEPPE_ROAD_ROLE_ORDER.map((roleKey) => {
    const profile = STEPPE_ROAD_ROLE_PROFILES[roleKey];

    return {
      key: roleKey,
      label: profile.title,
      score: itemCount > 0 ? Math.round((roleScores[roleKey] / itemCount) * 100) : 0,
      narrative: STEPPE_ROAD_ROLE_NARRATIVES[roleKey],
      accent: profile.accent,
      softAccent: profile.softAccent,
    };
  });

export const buildSteppeRoadResult = (
  selectedAnswers: Record<number, string>,
): SteppeRoadResultData => {
  const axisTotals = createEmptyAxisTotals();
  const roleScores = createEmptyRoleScores();

  STEPPE_ROAD_SCENES.forEach((scene) => {
    const chosenOption = scene.options.find(
      (option) => option.id === selectedAnswers[scene.id],
    );

    if (!chosenOption) {
      return;
    }

    roleScores[chosenOption.roleKey] += 1;

    (Object.keys(chosenOption.axisWeights) as SteppeRoadAxisKey[]).forEach(
      (axisKey) => {
        axisTotals[axisKey] += chosenOption.axisWeights[axisKey];
      },
    );
  });

  const axes = buildAxisResults(axisTotals, STEPPE_ROAD_SCENES.length);
  const axisMap = axes.reduce<Record<SteppeRoadAxisKey, number>>(
    (accumulator, axis) => {
      accumulator[axis.key] = axis.score;
      return accumulator;
    },
    {
      initiative: 0,
      flexibility: 0,
      socialOrientation: 0,
      uncertaintyTolerance: 0,
    },
  );
  const winner = getWinningRole(roleScores, axisMap);
  const profile = STEPPE_ROAD_ROLE_PROFILES[winner];

  return {
    roleKey: winner,
    title: profile.title,
    subtitle: profile.subtitle,
    tagline: profile.tagline,
    description: profile.description,
    firstMove: profile.firstMove,
    pressurePattern: profile.pressurePattern,
    supportStyle: profile.supportStyle,
    developmentFocus: profile.developmentFocus,
    whyThisRole: profile.whyThisRole,
    roadEpilogue: profile.roadEpilogue,
    strengths: profile.strengths,
    growthAreas: profile.growthAreas,
    accent: profile.accent,
    softAccent: profile.softAccent,
    accentBorder: profile.accentBorder,
    roleScores: buildRoleScoreCards(roleScores, STEPPE_ROAD_SCENES.length),
    axes,
  };
};

export const getSteppeRoadOptionLabel = (
  sceneId: number,
  optionId: string,
): string | null => {
  const scene = STEPPE_ROAD_SCENES.find((item) => item.id === sceneId);
  const option = scene?.options.find((item) => item.id === optionId);

  return option?.label ?? null;
};

export const saveSteppeRoadResult = (result: SteppeRoadResultData): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    STEPPE_ROAD_STORAGE_KEY,
    JSON.stringify(result),
  );
};

export const loadSteppeRoadResult = (): SteppeRoadResultData | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawResult = window.sessionStorage.getItem(STEPPE_ROAD_STORAGE_KEY);
  if (!rawResult) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawResult) as Partial<SteppeRoadResultData>;

    if (parsed && typeof parsed === "object" && typeof parsed.roleKey === "string") {
      return parsed as SteppeRoadResultData;
    }
  } catch (error) {
    console.error("Failed to read Steppe Road result:", error);
  }

  return null;
};
