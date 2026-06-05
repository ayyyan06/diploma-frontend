const STORAGE_KEY = "standard_test_pending_charges";

interface PendingCharge {
  amount: number;
  baseCoins: number | null;
}

type PendingChargeMap = Record<string, PendingCharge>;

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
      Object.entries(parsed).flatMap(([testId, value]) => {
        if (typeof value === "number" && value > 0) {
          return [[testId, { amount: value, baseCoins: null }]];
        }

        if (!value || typeof value !== "object") {
          return [];
        }

        const charge = value as Partial<PendingCharge>;

        if (typeof charge.amount !== "number" || charge.amount <= 0) {
          return [];
        }

        return [
          [
            testId,
            {
              amount: charge.amount,
              baseCoins:
                typeof charge.baseCoins === "number" ? charge.baseCoins : null,
            },
          ],
        ];
      }),
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
  return readPendingCharges()[testId]?.amount ?? 0;
}

export function setPendingStandardTestCharge(
  testId: string,
  amount: number,
  baseCoins: number | null = null,
) {
  const charges = readPendingCharges();

  if (amount > 0) {
    charges[testId] = {
      amount,
      baseCoins,
    };
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
    (sum, value) => sum + value.amount,
    0,
  );
}

export function applyPendingStandardTestCharges(
  coins: number | null,
): number | null {
  if (coins === null) {
    return null;
  }

  const pendingTotal = Object.values(readPendingCharges()).reduce(
    (sum, charge) => {
      if (charge.baseCoins !== null && coins < charge.baseCoins) {
        return sum;
      }

      return sum + charge.amount;
    },
    0,
  );

  return Math.max(coins - pendingTotal, 0);
}
