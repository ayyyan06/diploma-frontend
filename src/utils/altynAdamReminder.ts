const COMPLETED_TEST_COUNT_KEY = "completedTestCount";
const LAST_ALTYN_ADAM_REMINDER_COUNT_KEY = "lastAltynAdamReminderCount";

export interface TestCompletionState {
  completedTestCount: number;
  shouldShowReminder: boolean;
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

export function getCompletedTestCount() {
  return parseStoredCount(getStorage()?.getItem(COMPLETED_TEST_COUNT_KEY) ?? null);
}

export function getLastAltynAdamReminderCount() {
  return parseStoredCount(
    getStorage()?.getItem(LAST_ALTYN_ADAM_REMINDER_COUNT_KEY) ?? null,
  );
}

export function shouldShowAltynAdamReminder(completedTestCount: number) {
  return (
    completedTestCount > 0 &&
    completedTestCount % 2 === 0 &&
    getLastAltynAdamReminderCount() !== completedTestCount
  );
}

export function registerCompletedTest(): TestCompletionState {
  const storage = getStorage();
  const completedTestCount = getCompletedTestCount() + 1;

  storage?.setItem(COMPLETED_TEST_COUNT_KEY, String(completedTestCount));

  return {
    completedTestCount,
    shouldShowReminder: shouldShowAltynAdamReminder(completedTestCount),
  };
}

export function markAltynAdamReminderDismissed(completedTestCount: number) {
  if (completedTestCount <= 0) {
    return;
  }

  getStorage()?.setItem(
    LAST_ALTYN_ADAM_REMINDER_COUNT_KEY,
    String(completedTestCount),
  );
}
