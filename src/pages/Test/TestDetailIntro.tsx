import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchWithToken } from "../../api/apiutils";
import { localizeTestDetail } from "../../content/testContentTranslations";
import {
  applyPendingStandardTestCharges,
  clearPendingStandardTestCharge,
  getPendingStandardTestCharge,
  setPendingStandardTestCharge,
} from "../../utils/standardTestPendingCharges";

const TEST_COST = 100;

const toneColors: Record<string, string> = {
  duration: "bg-[#FFF9E8]",
  format: "bg-[#F7F4FF]",
  result: "bg-[#EEF8FF]",
};

interface TestInfoBox {
  tone: string;
  value: string;
  label: string;
}

interface TestOption {
  id: string;
  label: string;
}

interface TestQuestion {
  id: number;
  order: number;
  title: string;
  prompt?: string | null;
  options?: TestOption[] | null;
}

interface TestDetail {
  id: number;
  type: string;
  title: string;
  description: string;
  image_src: string;
  image_alt: string;
  info_boxes?: TestInfoBox[];
  questions?: TestQuestion[];
}

interface StandardTestSession {
  session_id: number;
  test_id: number;
  status: "in_progress" | "completed";
  coins_remaining: number | null;
}

function getHttpStatus(error: unknown): number | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const match = error.message.match(/Status:\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

export const TestIntroPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [test, setTest] = useState<TestDetail | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const [activeSession, setActiveSession] = useState<StandardTestSession | null>(
    null,
  );
  const [hasPendingCharge, setHasPendingCharge] = useState(false);
  const [sessionFlowUnavailable, setSessionFlowUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const testId = id ?? "";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const existingPending = testId
          ? getPendingStandardTestCharge(testId)
          : 0;
        const [coinsResult, testResult, sessionResult] = await Promise.allSettled([
          fetchWithToken("/api/v1/coins").then((response) =>
            response.json() as Promise<{ coins?: number }>,
          ),
          fetchWithToken(`/api/v1/tests/${id}`).then((response) =>
            response.json() as Promise<TestDetail>,
          ),
          fetchWithToken(`/api/v1/tests/${id}/session`).then((response) =>
            response.json() as Promise<{
              session: StandardTestSession | null;
            }>,
          ),
        ]);

        if (coinsResult.status === "rejected") {
          throw coinsResult.reason;
        }

        if (testResult.status === "rejected") {
          throw testResult.reason;
        }

        const coinsJson = coinsResult.value;
        const testJson = testResult.value;

        setTest(testJson);

        if (sessionResult.status === "fulfilled") {
          const nextSession = sessionResult.value.session ?? null;
          const isCurrentTestSession =
            nextSession !== null && String(nextSession.test_id) === testId;

          if (isCurrentTestSession) {
            setHasPendingCharge(existingPending > 0);
            setSessionFlowUnavailable(false);
            setActiveSession(nextSession);
            setCoins(
              applyPendingStandardTestCharges(
                nextSession.coins_remaining ?? coinsJson.coins ?? null,
              ),
            );
            return;
          }

          setActiveSession(null);

          if (existingPending > 0) {
            setHasPendingCharge(true);
            setSessionFlowUnavailable(true);
            setCoins(applyPendingStandardTestCharges(coinsJson.coins ?? null));
            return;
          }

          setHasPendingCharge(false);
          setSessionFlowUnavailable(false);
          setCoins(applyPendingStandardTestCharges(coinsJson.coins ?? null));
          return;
        }

        console.warn(
          "Standard test session endpoint unavailable; using legacy flow.",
          sessionResult.reason,
        );
        setSessionFlowUnavailable(true);
        setActiveSession(null);
        setHasPendingCharge(existingPending > 0);
        setCoins(applyPendingStandardTestCharges(coinsJson.coins ?? null));
      } catch (error) {
        console.error("Test intro loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void loadData();
    }
  }, [id, testId]);

  const canAfford =
    activeSession !== null ||
    hasPendingCharge ||
    coins === null ||
    coins >= TEST_COST;
  const localizedTest = useMemo(
    () => (test ? localizeTestDetail(test, i18n.language) : null),
    [test, i18n.language],
  );
  const isEnemyTest = localizedTest?.type === "enemy";
  const introImageSrc = localizedTest?.image_src;

  const syncCoins = (nextCoins: number | null) => {
    setCoins(nextCoins);

    if (typeof nextCoins === "number") {
      window.postMessage(
        { type: "coins:updated", coins: nextCoins },
        window.location.origin,
      );
      return;
    }

    window.postMessage({ type: "coins:updated" }, window.location.origin);
  };

  const handleStart = async () => {
    if (!canAfford) return;

    const existingPending = testId ? getPendingStandardTestCharge(testId) : 0;

    if (sessionFlowUnavailable && existingPending > 0) {
      setHasPendingCharge(true);
      navigate(`/tests/${id}`);
      return;
    }

    const initialCoins = coins;
    const createdPending = testId && existingPending === 0;

    if (createdPending) {
      setPendingStandardTestCharge(
        testId,
        TEST_COST,
        typeof initialCoins === "number" ? initialCoins : null,
      );
      setHasPendingCharge(true);
    }

    const optimisticCoins =
      typeof initialCoins === "number"
        ? existingPending > 0
          ? initialCoins
          : Math.max(initialCoins - TEST_COST, 0)
        : null;

    if (optimisticCoins !== null) {
      syncCoins(optimisticCoins);
    }

    try {
      const response = await fetchWithToken(`/api/v1/tests/${id}/start`, {
        method: "POST",
      });
      const nextSession = (await response.json()) as StandardTestSession;
      setHasPendingCharge(getPendingStandardTestCharge(testId) > 0);
      setSessionFlowUnavailable(false);
      setActiveSession(nextSession);

      if (typeof nextSession.coins_remaining === "number") {
        syncCoins(applyPendingStandardTestCharges(nextSession.coins_remaining));
      } else {
        syncCoins(optimisticCoins);
      }
      navigate(`/tests/${id}`);
    } catch (error) {
      console.error("Test start error:", error);

      const status = getHttpStatus(error);
      if (
        (status === 404 ||
          status === 405 ||
          status === 500 ||
          status === 502 ||
          status === 503 ||
          status === 504) &&
        testId
      ) {
        setSessionFlowUnavailable(true);
        if (existingPending === 0) {
          setPendingStandardTestCharge(
            testId,
            TEST_COST,
            typeof initialCoins === "number" ? initialCoins : null,
          );
        }
        setHasPendingCharge(true);

        if (optimisticCoins !== null) {
          syncCoins(optimisticCoins);
        } else {
          syncCoins(null);
        }

        navigate(`/tests/${id}`);
        return;
      }

      if (createdPending) {
        clearPendingStandardTestCharge(testId);
      }

      if (typeof initialCoins === "number") {
        syncCoins(initialCoins);
      } else {
        syncCoins(null);
      }

      setHasPendingCharge(existingPending > 0);
    }
  };

  if (loading) {
    return (
      <main className="mx-[110px] mt-[74px]">
        <p className="text-[20px] font-medium">{t("testIntro.loading")}</p>
      </main>
    );
  }

  if (!localizedTest) {
    return (
      <main className="mx-[110px] mt-[74px]">
        <p className="text-[20px] font-medium">{t("testIntro.notFound")}</p>
      </main>
    );
  }

  return (
    <main className="mx-[110px] mb-[150px] mt-[74px]">
      <section className="box-border flex min-h-[580px] items-center justify-between rounded-[28px] border-2 border-[#ECE7DD] bg-white pb-[68px] pl-[50px] pr-[103px] pt-[62px]">
        <div className="w-[580px]">
          <p className="m-0 mb-[20px] text-[14px] font-normal uppercase leading-[18px] text-[#7A7A7A]">
            {t("testIntro.step")}
          </p>

          <h1 className="m-0 mb-[31px] text-[40px] font-bold leading-[50px] text-[#111111]">
            {localizedTest.title}
          </h1>

          <p className="m-0 mb-[40px] w-[595px] text-[16px] font-normal leading-[26px] text-[#444444]">
            {localizedTest.description}
          </p>

          <div
            className={`mb-[32px] flex w-fit items-center gap-[14px] rounded-[16px] border-2 px-[20px] py-[16px] ${
              canAfford
                ? "border-[#f2c200] bg-[#fffbec]"
                : "border-[#e74c3c] bg-[#fef5f5]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full text-[16px] font-black text-white shadow-md ${
                canAfford ? "bg-[#f2c200]" : "bg-[#e74c3c]"
              }`}
            >
              ✦
            </span>

            <div>
              <p className="m-0 text-[13px] font-medium text-[#888]">
                {t("testIntro.testCost")}
              </p>
              <p
                className={`m-0 text-[18px] font-bold ${
                  canAfford ? "text-[#9a6e00]" : "text-[#c0392b]"
                }`}
              >
                {TEST_COST} {t("common.coins")}
              </p>
            </div>

            <div className="mx-[6px] h-[36px] w-[1px] bg-[#e0d9c8]" />

            <div>
              <p className="m-0 text-[13px] font-medium text-[#888]">
                {t("testIntro.yourBalance")}
              </p>
              <p
                className={`m-0 text-[18px] font-bold ${
                  canAfford ? "text-[#9a6e00]" : "text-[#c0392b]"
                }`}
              >
                {coins !== null ? `${coins} ${t("common.coins")}` : "—"}
              </p>
            </div>
          </div>

          {!canAfford && (
            <div className="mb-[32px] flex w-[480px] items-start gap-[12px] rounded-[14px] border border-[#fbc8c2] bg-[#fff5f4] px-[18px] py-[14px]">
              <span className="mt-[1px] text-[18px]">🎮</span>
              <div>
                <p className="m-0 text-[14px] font-bold text-[#c0392b]">
                  {t("testIntro.notEnoughCoins")}
                </p>
                <p className="m-0 mt-[4px] text-[13px] leading-[20px] text-[#888]">
                  {t("testIntro.notEnoughDescription", { cost: TEST_COST })}
                </p>
                <button
                  onClick={() => navigate("/games")}
                  className="mt-[10px] cursor-pointer rounded-[9px] border-none bg-[#e74c3c] px-[16px] py-[8px] text-[13px] font-bold text-white transition-opacity hover:opacity-85"
                >
                  {t("testIntro.goToGames")}
                </button>
              </div>
            </div>
          )}

          <div className="mb-[54px] flex gap-[20px]">
            {localizedTest.info_boxes?.map((box, index: number) => (
              <div
                key={index}
                className={`box-border h-[116px] w-[180px] rounded-[18px] pb-[38px] pl-[16px] pr-[17px] pt-[18px] ${
                  toneColors[box.tone] || "bg-[#F5F5F5]"
                }`}
              >
                <h3 className="m-0 mb-[9px] text-[22px] font-bold leading-[28px] text-[#111111]">
                  {box.value}
                </h3>
                <p className="m-0 text-[18px] font-normal leading-[23px] text-[#555555]">
                  {box.label}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              void handleStart();
            }}
            disabled={!canAfford}
            title={
              !canAfford
                ? t("testIntro.needTooltip", { cost: TEST_COST })
                : t("testIntro.startTooltip")
            }
            className={`h-[58px] w-[230px] rounded-[12px] border-none text-[16px] font-bold leading-[20px] text-white transition-all duration-200 ${
              canAfford
                ? "cursor-pointer bg-[#F2B705] hover:opacity-90"
                : "cursor-not-allowed bg-[#ccc] opacity-60"
            }`}
          >
            {canAfford
              ? t("testIntro.startTest")
              : t("testIntro.needCoins", { cost: TEST_COST })}
          </button>
        </div>

        <div className="flex items-center justify-center">
          {isEnemyTest ? (
            <div className="h-[281px] w-[281px] shrink-0 overflow-hidden rounded-[44px] bg-[#f6f3eb]">
              <img
                src={introImageSrc}
                alt={localizedTest.image_alt}
                className={`block h-full w-full scale-[1.08] object-cover object-[46%_44%] transition-all duration-300 ${
                  !canAfford ? "opacity-40 grayscale" : ""
                }`}
              />
            </div>
          ) : (
            <img
              src={introImageSrc}
              alt={localizedTest.image_alt}
              className={`block w-[420px] object-contain transition-all duration-300 ${
                !canAfford ? "opacity-40 grayscale" : ""
              }`}
            />
          )}
        </div>
      </section>
    </main>
  );
};
