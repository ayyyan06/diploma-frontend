import {
  ALTTYN_ADAM_ACHIEVEMENTS,
  MOST_ACHIEVEMENTS_TARGET,
} from "../data/achievements";
import {
  CULTURAL_DIALOGUE_RESULT_KEYS_BY_TEST,
  TOTAL_CULTURAL_DIALOGUES,
} from "../data/altynAdamCulturalDialogues";
import { getCompletedTestCount, registerCompletedTest } from "./altynAdamReminder";
import type {
  AltynAdamProgressSnapshot,
  CompletedTestKey,
  DialogueChoiceType,
  FriendshipLevelDefinition,
  LocalizedText,
  StandardTestType,
} from "../types/altynAdam";

const FRIENDSHIP_POINTS_KEY = "altynAdamFriendshipPoints";
const CORRECT_ANSWERS_KEY = "altynAdamCorrectAnswers";
const TOTAL_ANSWERS_KEY = "altynAdamTotalAnswers";
const CORRECT_STREAK_KEY = "altynAdamCorrectStreak";
const COMPLETED_UNIQUE_TESTS_KEY = "completedUniqueTests";
const COMPLETED_CULTURAL_DIALOGUES_KEY = "completedCulturalDialogues";
const COMPLETED_DIALOGUES_BY_TEST_KEY = "completedDialoguesByTest";
const UNLOCKED_ACHIEVEMENTS_KEY = "unlockedAchievements";
const LAST_VISIT_DATES_KEY = "lastVisitDates";
const STORY_BRANCH_CHOICES_KEY = "altynAdamStoryBranchChoices";
const STARTED_DIALOGUES_KEY = "altynAdamStartedDialogues";
const ACHIEVEMENT_UNLOCK_DATES_KEY = "altynAdamAchievementUnlockDates";
const COMPLETED_TEST_KEYS = new Set<CompletedTestKey>([
  "personality",
  "animal",
  "weapon",
  "enemy",
  "scale",
  "result",
  "adaptive-figure",
]);

const FRIENDSHIP_LEVELS: readonly FriendshipLevelDefinition[] = [
  {
    id: "novice",
    minPoints: 0,
    maxPoints: 19,
    title: {
      en: "Novice",
      ru: "Новичок",
      kk: "Бастаушы",
    },
  },
  {
    id: "companion",
    minPoints: 20,
    maxPoints: 49,
    title: {
      en: "Companion",
      ru: "Спутник",
      kk: "Серіктес",
    },
  },
  {
    id: "culture-friend",
    minPoints: 50,
    maxPoints: 89,
    title: {
      en: "Friend of Culture",
      ru: "Друг культуры",
      kk: "Мәдениет досы",
    },
  },
  {
    id: "knowledge-keeper",
    minPoints: 90,
    maxPoints: 139,
    title: {
      en: "Knowledge Keeper",
      ru: "Хранитель знаний",
      kk: "Білім сақтаушысы",
    },
  },
  {
    id: "heir",
    minPoints: 140,
    maxPoints: null,
    title: {
      en: "Heir of the Steppe",
      ru: "Наследник степи",
      kk: "Дала мұрагері",
    },
  },
] as const;

type AchievementUnlockDates = Record<string, string[]>;

interface PersistedSnapshot extends AltynAdamProgressSnapshot {
  achievementUnlockDates: AchievementUnlockDates;
}

const getStorage = () =>
  typeof window !== "undefined" ? window.localStorage : null;

const parseStoredCount = (value: string | null) => {
  const parsedValue = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
};

function readJsonValue<T>(key: string, fallback: T) {
  const storage = getStorage();
  const rawValue = storage?.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeJsonValue<T>(key: string, value: T) {
  getStorage()?.setItem(key, JSON.stringify(value));
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function createEmptyCompletedDialoguesByTest() {
  return {
    personality: [],
    animal: [],
    weapon: [],
    enemy: [],
  } satisfies Record<StandardTestType, string[]>;
}

function normalizeCompletedDialoguesByTest(value: unknown) {
  const fallback = createEmptyCompletedDialoguesByTest();

  if (!value || typeof value !== "object") {
    return fallback;
  }

  return {
    personality: normalizeStringArray(
      (value as Record<string, unknown>).personality,
    ),
    animal: normalizeStringArray((value as Record<string, unknown>).animal),
    weapon: normalizeStringArray((value as Record<string, unknown>).weapon),
    enemy: normalizeStringArray((value as Record<string, unknown>).enemy),
  } satisfies Record<StandardTestType, string[]>;
}

function normalizeAchievementUnlockDates(value: unknown) {
  if (!value || typeof value !== "object") {
    return {} as AchievementUnlockDates;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([date, ids]) => [
      date,
      normalizeStringArray(ids),
    ]),
  );
}

function orderedAchievementIds(ids: Iterable<string>) {
  const idSet = new Set(ids);
  return ALTTYN_ADAM_ACHIEVEMENTS.filter((achievement) =>
    idSet.has(achievement.id),
  ).map((achievement) => achievement.id);
}

function getTodayStorageKey() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addAchievementUnlockDate(
  unlockDates: AchievementUnlockDates,
  dateKey: string,
  achievementId: string,
) {
  const nextUnlockDates = { ...unlockDates };
  const currentEntries = new Set(nextUnlockDates[dateKey] ?? []);

  currentEntries.add(achievementId);
  nextUnlockDates[dateKey] = Array.from(currentEntries);

  return nextUnlockDates;
}

function computeBaseAchievementIds(snapshot: AltynAdamProgressSnapshot) {
  const unlocked = new Set<string>();
  const uniqueCompletedTestsCount = snapshot.completedUniqueTests.length;

  if (uniqueCompletedTestsCount >= 2) {
    unlocked.add("first-steps");
  }

  if (uniqueCompletedTestsCount >= 3) {
    unlocked.add("explorer");
  }

  if (uniqueCompletedTestsCount >= 4) {
    unlocked.add("self-seeker");
  }

  if (uniqueCompletedTestsCount >= 5) {
    unlocked.add("completed-journey");
  }

  if (snapshot.startedDialogues.length > 0) {
    unlocked.add("first-meeting");
  }

  if (snapshot.friendshipPoints >= 50) {
    unlocked.add("culture-friend");
  }

  if (snapshot.friendshipPoints >= 90) {
    unlocked.add("knowledge-keeper");
  }

  if (snapshot.friendshipPoints >= 140) {
    unlocked.add("altyn-adam-favorite");
  }

  if (snapshot.completedCulturalDialogues.length >= 5) {
    unlocked.add("curious-traveler");
  }

  if (snapshot.correctAnswers >= 10) {
    unlocked.add("good-listener");
  }

  if (snapshot.correctAnswers >= 25) {
    unlocked.add("steppe-scholar");
  }

  if (
    Object.entries(CULTURAL_DIALOGUE_RESULT_KEYS_BY_TEST).some(
      ([testType, resultKeys]) =>
        snapshot.completedDialoguesByTest[testType as StandardTestType].length >=
        resultKeys.length,
    )
  ) {
    unlocked.add("culture-explorer");
  }

  if (snapshot.completedCulturalDialogues.length >= TOTAL_CULTURAL_DIALOGUES) {
    unlocked.add("steppe-sage");
  }

  if (snapshot.correctStreak >= 5) {
    unlocked.add("flawless");
  }

  if (snapshot.storyBranchChoices >= 5) {
    unlocked.add("story-lover");
  }

  if (snapshot.completedCulturalDialogues.length >= 10) {
    unlocked.add("culture-enthusiast");
  }

  if (snapshot.lastVisitDates.length >= 3) {
    unlocked.add("loyal-friend");
  }

  const completedTestsWithDialogue = (
    Object.keys(CULTURAL_DIALOGUE_RESULT_KEYS_BY_TEST) as StandardTestType[]
  ).filter(
    (testType) => snapshot.completedDialoguesByTest[testType].length > 0,
  );

  if (completedTestsWithDialogue.length === 4) {
    unlocked.add("secret-achievement");
  }

  return unlocked;
}

function synchronizeUnlockedAchievements(
  snapshot: AltynAdamProgressSnapshot,
  unlockDates: AchievementUnlockDates,
) {
  const previousUnlocked = new Set(snapshot.unlockedAchievements);
  const todayKey = getTodayStorageKey();
  const baseUnlocked = computeBaseAchievementIds(snapshot);
  let nextUnlockDates = { ...unlockDates };

  baseUnlocked.forEach((achievementId) => {
    if (!previousUnlocked.has(achievementId)) {
      nextUnlockDates = addAchievementUnlockDate(
        nextUnlockDates,
        todayKey,
        achievementId,
      );
    }
  });

  const unlockedWithDerived = new Set(baseUnlocked);
  const hasFastLearner = Object.values(nextUnlockDates).some(
    (achievementIds) => new Set(achievementIds).size >= 3,
  );

  if (hasFastLearner) {
    unlockedWithDerived.add("fast-learner");
  }

  if (
    Array.from(unlockedWithDerived).filter(
      (achievementId) => achievementId !== "heir-of-the-steppe",
    ).length >= MOST_ACHIEVEMENTS_TARGET
  ) {
    unlockedWithDerived.add("heir-of-the-steppe");
  }

  ["fast-learner", "heir-of-the-steppe"].forEach((achievementId) => {
    if (
      unlockedWithDerived.has(achievementId) &&
      !previousUnlocked.has(achievementId)
    ) {
      nextUnlockDates = addAchievementUnlockDate(
        nextUnlockDates,
        todayKey,
        achievementId,
      );
    }
  });

  const unlockedAchievements = orderedAchievementIds(unlockedWithDerived);
  const newlyUnlockedAchievements = unlockedAchievements.filter(
    (achievementId) => !previousUnlocked.has(achievementId),
  );

  return {
    unlockedAchievements,
    newlyUnlockedAchievements,
    achievementUnlockDates: nextUnlockDates,
  };
}

function readPersistedSnapshot(): PersistedSnapshot {
  return {
    friendshipPoints: parseStoredCount(
      getStorage()?.getItem(FRIENDSHIP_POINTS_KEY) ?? null,
    ),
    correctAnswers: parseStoredCount(
      getStorage()?.getItem(CORRECT_ANSWERS_KEY) ?? null,
    ),
    totalAnswers: parseStoredCount(
      getStorage()?.getItem(TOTAL_ANSWERS_KEY) ?? null,
    ),
    correctStreak: parseStoredCount(
      getStorage()?.getItem(CORRECT_STREAK_KEY) ?? null,
    ),
    completedTestCount: getCompletedTestCount(),
    completedUniqueTests: normalizeStringArray(
      readJsonValue<unknown[]>(COMPLETED_UNIQUE_TESTS_KEY, []),
    ) as CompletedTestKey[],
    completedCulturalDialogues: normalizeStringArray(
      readJsonValue<unknown[]>(COMPLETED_CULTURAL_DIALOGUES_KEY, []),
    ),
    completedDialoguesByTest: normalizeCompletedDialoguesByTest(
      readJsonValue(COMPLETED_DIALOGUES_BY_TEST_KEY, {}),
    ),
    unlockedAchievements: normalizeStringArray(
      readJsonValue<unknown[]>(UNLOCKED_ACHIEVEMENTS_KEY, []),
    ),
    lastVisitDates: normalizeStringArray(
      readJsonValue<unknown[]>(LAST_VISIT_DATES_KEY, []),
    ),
    storyBranchChoices: parseStoredCount(
      getStorage()?.getItem(STORY_BRANCH_CHOICES_KEY) ?? null,
    ),
    startedDialogues: normalizeStringArray(
      readJsonValue<unknown[]>(STARTED_DIALOGUES_KEY, []),
    ),
    achievementUnlockDates: normalizeAchievementUnlockDates(
      readJsonValue(ACHIEVEMENT_UNLOCK_DATES_KEY, {}),
    ),
  };
}

function persistSnapshot(snapshot: PersistedSnapshot) {
  const storage = getStorage();

  storage?.setItem(FRIENDSHIP_POINTS_KEY, String(snapshot.friendshipPoints));
  storage?.setItem(CORRECT_ANSWERS_KEY, String(snapshot.correctAnswers));
  storage?.setItem(TOTAL_ANSWERS_KEY, String(snapshot.totalAnswers));
  storage?.setItem(CORRECT_STREAK_KEY, String(snapshot.correctStreak));
  storage?.setItem(
    STORY_BRANCH_CHOICES_KEY,
    String(snapshot.storyBranchChoices),
  );

  writeJsonValue(COMPLETED_UNIQUE_TESTS_KEY, snapshot.completedUniqueTests);
  writeJsonValue(
    COMPLETED_CULTURAL_DIALOGUES_KEY,
    snapshot.completedCulturalDialogues,
  );
  writeJsonValue(
    COMPLETED_DIALOGUES_BY_TEST_KEY,
    snapshot.completedDialoguesByTest,
  );
  writeJsonValue(UNLOCKED_ACHIEVEMENTS_KEY, snapshot.unlockedAchievements);
  writeJsonValue(LAST_VISIT_DATES_KEY, snapshot.lastVisitDates);
  writeJsonValue(STARTED_DIALOGUES_KEY, snapshot.startedDialogues);
  writeJsonValue(
    ACHIEVEMENT_UNLOCK_DATES_KEY,
    snapshot.achievementUnlockDates,
  );
}

function writeAndCollect(
  nextSnapshot: PersistedSnapshot,
  previousUnlockedAchievements: readonly string[],
) {
  const {
    unlockedAchievements,
    newlyUnlockedAchievements,
    achievementUnlockDates,
  } = synchronizeUnlockedAchievements(
    {
      ...nextSnapshot,
      unlockedAchievements: [...previousUnlockedAchievements],
    },
    nextSnapshot.achievementUnlockDates,
  );

  const persistedSnapshot: PersistedSnapshot = {
    ...nextSnapshot,
    unlockedAchievements,
    achievementUnlockDates,
  };

  persistSnapshot(persistedSnapshot);

  return {
    progress: {
      ...persistedSnapshot,
    } satisfies PersistedSnapshot,
    newlyUnlockedAchievements,
  };
}

export function getAltynAdamProgress(): AltynAdamProgressSnapshot {
  const snapshot = readPersistedSnapshot();
  const synchronized = synchronizeUnlockedAchievements(
    snapshot,
    snapshot.achievementUnlockDates,
  );

  if (
    synchronized.unlockedAchievements.join("|") !==
      snapshot.unlockedAchievements.join("|") ||
    JSON.stringify(synchronized.achievementUnlockDates) !==
      JSON.stringify(snapshot.achievementUnlockDates)
  ) {
    persistSnapshot({
      ...snapshot,
      unlockedAchievements: synchronized.unlockedAchievements,
      achievementUnlockDates: synchronized.achievementUnlockDates,
    });

    return {
      ...snapshot,
      unlockedAchievements: synchronized.unlockedAchievements,
    };
  }

  return snapshot;
}

export function registerDailyVisit() {
  const snapshot = readPersistedSnapshot();
  const dateKey = getTodayStorageKey();

  if (!snapshot.lastVisitDates.includes(dateKey)) {
    snapshot.lastVisitDates = [...snapshot.lastVisitDates, dateKey].slice(-30);
  }

  return writeAndCollect(snapshot, snapshot.unlockedAchievements);
}

export function registerDialogueStarted(dialogueId: string) {
  const snapshot = readPersistedSnapshot();

  if (!snapshot.startedDialogues.includes(dialogueId)) {
    snapshot.startedDialogues = [...snapshot.startedDialogues, dialogueId];
  }

  return writeAndCollect(snapshot, snapshot.unlockedAchievements);
}

export function registerTestCompletion(testKey: CompletedTestKey) {
  const snapshot = readPersistedSnapshot();
  const completionState = registerCompletedTest();
  const completedUniqueTests = new Set<CompletedTestKey>(
    snapshot.completedUniqueTests,
  );

  completedUniqueTests.add(testKey);
  snapshot.completedTestCount = completionState.completedTestCount;
  snapshot.completedUniqueTests = Array.from(completedUniqueTests);

  const result = writeAndCollect(snapshot, snapshot.unlockedAchievements);

  return {
    ...completionState,
    ...result,
  };
}

export function normalizeCompletedTestKey(
  value: string,
): CompletedTestKey | null {
  return COMPLETED_TEST_KEYS.has(value as CompletedTestKey)
    ? (value as CompletedTestKey)
    : null;
}

export function syncCompletedUniqueTests(testKeys: readonly CompletedTestKey[]) {
  const snapshot = readPersistedSnapshot();
  const completedUniqueTests = new Set<CompletedTestKey>(
    snapshot.completedUniqueTests,
  );
  let hasChanges = false;

  testKeys.forEach((testKey) => {
    if (!completedUniqueTests.has(testKey)) {
      completedUniqueTests.add(testKey);
      hasChanges = true;
    }
  });

  if (!hasChanges) {
    return {
      progress: getAltynAdamProgress(),
      newlyUnlockedAchievements: [] as string[],
    };
  }

  snapshot.completedUniqueTests = Array.from(completedUniqueTests);

  return writeAndCollect(snapshot, snapshot.unlockedAchievements);
}

export function submitCulturalKnowledgeCheck({
  dialogueId,
  testType,
  resultKey,
  branchType,
  isCorrect,
}: {
  dialogueId: string;
  testType: StandardTestType;
  resultKey: string;
  branchType: DialogueChoiceType | null;
  isCorrect: boolean;
}) {
  const snapshot = readPersistedSnapshot();
  const completedDialogues = new Set(snapshot.completedCulturalDialogues);
  const completedDialoguesByTest = {
    ...snapshot.completedDialoguesByTest,
    [testType]: [...snapshot.completedDialoguesByTest[testType]],
  };

  snapshot.totalAnswers += 1;

  if (branchType === "story") {
    snapshot.storyBranchChoices += 1;
  }

  if (isCorrect) {
    snapshot.correctAnswers += 1;
    snapshot.correctStreak += 1;
    snapshot.friendshipPoints += 5;
  } else {
    snapshot.correctStreak = 0;
  }

  completedDialogues.add(dialogueId);

  if (!completedDialoguesByTest[testType].includes(resultKey)) {
    completedDialoguesByTest[testType].push(resultKey);
  }

  snapshot.completedCulturalDialogues = Array.from(completedDialogues);
  snapshot.completedDialoguesByTest = completedDialoguesByTest;

  return writeAndCollect(snapshot, snapshot.unlockedAchievements);
}

export function getFriendshipLevel(points: number) {
  return (
    FRIENDSHIP_LEVELS.find((level) => {
      const withinUpperBound =
        level.maxPoints === null ? true : points <= level.maxPoints;

      return points >= level.minPoints && withinUpperBound;
    }) ?? FRIENDSHIP_LEVELS[0]
  );
}

export function getNextFriendshipLevel(points: number) {
  return FRIENDSHIP_LEVELS.find((level) => level.minPoints > points) ?? null;
}

export function getFriendshipProgressMeta(points: number) {
  const currentLevel = getFriendshipLevel(points);
  const nextLevel = getNextFriendshipLevel(points);

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progressPercent: 100,
      progressValue: points,
      progressTarget: points,
    };
  }

  const currentStart = currentLevel.minPoints;
  const currentEnd = nextLevel.minPoints;
  const progressValue = points;
  const progressTarget = currentEnd;
  const progressPercent =
    ((points - currentStart) / (currentEnd - currentStart)) * 100;

  return {
    currentLevel,
    nextLevel,
    progressPercent: Math.max(0, Math.min(100, progressPercent)),
    progressValue,
    progressTarget,
  };
}

export function getDialogueId(testType: StandardTestType, resultKey: string) {
  return `${testType}-${resultKey}`;
}

export function getEmptyLocalizedLevelTitle(): LocalizedText {
  return {
    en: "Novice",
    ru: "Новичок",
    kk: "Бастаушы",
  };
}
