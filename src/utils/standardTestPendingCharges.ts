const STORAGE_KEY = "standard_test_pending_charges";

type PendingChargeMap = Record<string, number>;

function readPendingCharges(): PendingChargeMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, value]) => typeof value === "number" && value > 0,
      ),
    );
  } catch {
    return {};
  }
}

function writePendingCharges(charges: PendingChargeMap) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(charges));
}

export function getPendingStandardTestCharge(testId: string): number {
  return readPendingCharges()[testId] ?? 0;
}

export function setPendingStandardTestCharge(testId: string, amount: number) {
  const charges = readPendingCharges();

  if (amount > 0) {
    charges[testId] = amount;
  } else {
    delete charges[testId];
  }

  writePendingCharges(charges);
}

export function clearPendingStandardTestCharge(testId: string) {
  const charges = readPendingCharges();
  delete charges[testId];
  writePendingCharges(charges);
}

export function getTotalPendingStandardTestCharges(): number {
  return Object.values(readPendingCharges()).reduce(
    (sum, value) => sum + value,
    0,
  );
}

export function applyPendingStandardTestCharges(
  coins: number | null,
): number | null {
  if (coins === null) {
    return null;
  }

  return Math.max(coins - getTotalPendingStandardTestCharges(), 0);
}
