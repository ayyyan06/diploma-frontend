import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchWithToken } from "../../api/apiutils";
import { localizeResultPayload } from "../../content/testContentTranslations";
import {
  getStoredLocalEnemyResult,
  isLocalEnemyTestId,
} from "../../content/localEnemyTest";

interface BaseResult {
  resultKey: string;
  title: string;
  subtitle: string | null;
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  developmentFocus: string | null;
  whyThisResult: string | null;
}

interface BigFiveTrait {
  key: string;
  label: string;
  shortLabel: string;
  description: string;
  score: number;
  narrative: string;
}

interface PersonalityDetails {
  shadowArchetype: string;
  topTraits: string[];
  bigFive: BigFiveTrait[];
}

interface PersonalityResult extends BaseResult {
  details: PersonalityDetails;
}

interface AnimalAxis {
  key: string;
  label: string;
  lowPole: string;
  highPole: string;
  score: number;
  narrative: string;
  leaningLabel: string;
}

interface AnimalDetails {
  temperament: string;
  quadrant: string;
  coreTraits: string[];
  axes: AnimalAxis[];
}

interface AnimalResult extends BaseResult {
  details: AnimalDetails;
}

interface WeaponDetails {
  scores: Record<string, number>;
}

interface WeaponResult extends BaseResult {
  details: WeaponDetails;
}

interface EnemyScore {
  key: string;
  label: string;
  title: string;
  count: number;
  percent: number;
  narrative: string;
}

interface EnemyDetails {
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
}

interface EnemyResult extends BaseResult {
  details: EnemyDetails;
}

type TestResultData =
  | PersonalityResult
  | AnimalResult
  | WeaponResult
  | EnemyResult;

interface ResultApiResponse {
  test_id: number;
  test_type: "personality" | "animal" | "weapon" | "enemy";
  test_title: string;
  result: TestResultData;
  updated_at: string;
}

function isPersonality(
  type: string,
  details: unknown,
): details is PersonalityDetails {
  return (
    type === "personality" &&
    details != null &&
    "bigFive" in (details as object)
  );
}

function isAnimal(type: string, details: unknown): details is AnimalDetails {
  return type === "animal" && details != null && "axes" in (details as object);
}

function isWeapon(type: string, details: unknown): details is WeaponDetails {
  return (
    type === "weapon" && details != null && "scores" in (details as object)
  );
}

function isEnemy(type: string, details: unknown): details is EnemyDetails {
  return (
    type === "enemy" &&
    details != null &&
    "enemyScores" in (details as object)
  );
}

function ScoreBar({
  label,
  badge,
  score,
  narrative,
  lowPole,
  highPole,
}: {
  label: string;
  badge?: string;
  score: number;
  narrative?: string;
  lowPole?: string;
  highPole?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div>
          <span className="text-[16px] font-semibold text-[#111]">{label}</span>
          {badge && (
            <span className="ml-2 text-[13px] text-[#777]">({badge})</span>
          )}
        </div>

        <span className="text-[14px] font-bold text-[#8b6c00]">{score}%</span>
      </div>

      {lowPole && highPole && (
        <div className="mb-1 flex justify-between text-[11px] text-[#aaa]">
          <span>{lowPole}</span>
          <span>{highPole}</span>
        </div>
      )}

      <div className="h-[10px] w-full overflow-hidden rounded-full bg-[#efefef]">
        <div
          className="h-full rounded-full bg-[#f2c200] transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>

      {narrative && (
        <p className="mb-0 mt-2 text-[14px] leading-[1.6] text-[#6f6a60]">
          {narrative}
        </p>
      )}
    </div>
  );
}

function WeaponScoreBar({
  label,
  score,
  maxScore,
}: {
  label: string;
  score: number;
  maxScore: number;
}) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[16px] font-semibold text-[#111]">
          {capitalized}
        </span>

        <span className="text-[14px] font-bold text-[#8b6c00]">
          {score} pts
        </span>
      </div>

      <div className="h-[10px] w-full overflow-hidden rounded-full bg-[#efefef]">
        <div
          className="h-full rounded-full bg-[#f2c200] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function PersonalityLeftCard({ details }: { details: PersonalityDetails }) {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="m-0 mb-[14px] text-center text-[22px] font-bold leading-[28px] text-[#111111]">
        {t("testResult.coreTraits")}
      </h2>

      <ul className="m-0 pl-6 text-[18px] font-normal leading-[23px] text-[#555555]">
        {details.topTraits?.map((trait) => (
          <li key={trait} className="mb-2">
            {trait}
          </li>
        ))}
      </ul>
    </>
  );
}

function AnimalLeftCard({ details }: { details: AnimalDetails }) {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="m-0 mb-[14px] text-center text-[22px] font-bold leading-[28px] text-[#111111]">
        {t("testResult.temperament")}
      </h2>

      <p className="m-0 mb-3 text-center text-[20px] font-bold text-[#8b6c00]">
        {details.temperament}
      </p>

      <p className="m-0 mb-5 text-center text-[14px] italic text-[#777]">
        {details.quadrant}
      </p>

      {details.coreTraits?.length > 0 && (
        <>
          <h3 className="m-0 mb-2 text-[16px] font-semibold text-[#111]">
            {t("testResult.coreTraits")}
          </h3>

          <ul className="m-0 pl-6 text-[18px] font-normal leading-[23px] text-[#555555]">
            {details.coreTraits.map((trait) => (
              <li key={trait} className="mb-2">
                {trait}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function WeaponLeftCard({ details }: { details: WeaponDetails }) {
  const { t } = useTranslation();
  const entries = Object.entries(details.scores ?? {});
  const maxScore = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <>
      <h2 className="m-0 mb-[14px] text-center text-[22px] font-bold leading-[28px] text-[#111111]">
        {t("testResult.scores")}
      </h2>

      <div className="flex w-full flex-col gap-4">
        {entries.map(([key, score]) => (
          <WeaponScoreBar
            key={key}
            label={key}
            score={score}
            maxScore={maxScore}
          />
        ))}
      </div>
    </>
  );
}

function EnemySpectrumBar({ score }: { score: EnemyScore }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[18px] font-bold leading-[1.35] text-[#222222]">
          {score.label}
        </span>

        <span className="text-[15px] font-bold text-[#8b6c00]">
          {score.count}/8 • {score.percent}%
        </span>
      </div>

      <div
        className="h-3 w-full overflow-hidden rounded-full bg-[#f4ece1]"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-[#d97706] transition-all duration-500"
          style={{ width: `${score.percent}%` }}
        />
      </div>

      <p className="m-0 text-[15px] leading-[1.55] text-[#5e5b55]">
        {score.narrative}
      </p>
    </div>
  );
}

function EnemyLeftCard({ details }: { details: EnemyDetails }) {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="m-0 mb-[14px] text-center text-[22px] font-bold leading-[28px] text-[#111111]">
        {t("testResult.threatenedNeed", {
          defaultValue: "Threatened need",
        })}
      </h2>

      <p className="m-0 mb-3 text-center text-[20px] font-bold text-[#8b6c00]">
        {details.threatenedNeed}
      </p>

      <p className="m-0 text-center text-[15px] leading-[1.65] text-[#6f6a60]">
        {details.needDescription}
      </p>
    </>
  );
}

function PersonalityDetailsSection({ result }: { result: PersonalityResult }) {
  const { t } = useTranslation();
  const { details } = result;

  return (
    <>
      <div className="box-border w-full rounded-[24px] border-2 border-[#ece7dd] bg-white pb-10 pl-[41px] pr-10 pt-5 max-[640px]:px-5">
        <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
          {t("testResult.bigFive")}
        </h2>

        <div className="flex flex-col gap-5">
          {details.bigFive?.map((trait) => (
            <ScoreBar
              key={trait.key}
              label={trait.label}
              badge={trait.shortLabel}
              score={trait.score}
              narrative={trait.narrative}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-10 max-[640px]:flex-col">
        <div className="box-border min-w-0 flex-1 rounded-[24px] border-2 border-[#c4dff0] bg-[#eef8ff] pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
          <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
            {t("testResult.shadowArchetype")}
          </h2>

          <p className="m-0 text-[18px] text-[#555]">
            {details.shadowArchetype}
          </p>
        </div>

        {result.developmentFocus && (
          <div className="box-border min-w-0 flex-1 rounded-[24px] border-2 border-[#f0c4c4] bg-[#fff5f5] pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
            <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
              {t("testResult.developmentFocus")}
            </h2>

            <p className="m-0 text-[18px] text-[#555]">
              {result.developmentFocus}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function AnimalDetailsSection({ result }: { result: AnimalResult }) {
  const { t } = useTranslation();
  const { details } = result;

  return (
    <>
      <div className="box-border w-full rounded-[24px] border-2 border-[#ece7dd] bg-white pb-10 pl-[41px] pr-10 pt-5 max-[640px]:px-5">
        <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
          {t("testResult.eysenckAxes")}
        </h2>

        <div className="flex flex-col gap-5">
          {details.axes?.map((axis) => (
            <ScoreBar
              key={axis.key}
              label={axis.label}
              badge={axis.leaningLabel}
              score={axis.score}
              narrative={axis.narrative}
              lowPole={axis.lowPole}
              highPole={axis.highPole}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-10 max-[640px]:flex-col">
        <div className="box-border min-w-0 flex-1 rounded-[24px] border-2 border-[#c4dff0] bg-[#eef8ff] pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
          <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
            {t("testResult.temperamentQuadrant")}
          </h2>

          <p className="m-0 text-[20px] font-bold text-[#8b6c00]">
            {details.temperament}
          </p>

          <p className="mt-1 text-[16px] italic text-[#555]">
            {details.quadrant}
          </p>
        </div>

        {result.developmentFocus && (
          <div className="box-border min-w-0 flex-1 rounded-[24px] border-2 border-[#f0c4c4] bg-[#fff5f5] pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
            <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
              {t("testResult.developmentFocus")}
            </h2>

            <p className="m-0 text-[18px] text-[#555]">
              {result.developmentFocus}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function WeaponDetailsSection({ result }: { result: WeaponResult }) {
  const { t } = useTranslation();
  const entries = Object.entries(result.details.scores ?? {});
  const maxScore = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <div className="box-border w-full rounded-[24px] border-2 border-[#ece7dd] bg-white pb-10 pl-[41px] pr-10 pt-5 max-[640px]:px-5">
      <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
        {t("testResult.weaponScores")}
      </h2>

      <div className="flex flex-col gap-5">
        {entries.map(([key, score]) => (
          <WeaponScoreBar
            key={key}
            label={key}
            score={score}
            maxScore={maxScore}
          />
        ))}
      </div>
    </div>
  );
}

function EnemyDetailsSection({ result }: { result: EnemyResult }) {
  const { t } = useTranslation();
  const { details } = result;

  return (
    <>
      <div className="box-border w-full rounded-[24px] border-2 border-[#ece7dd] bg-white pb-10 pl-[41px] pr-10 pt-5 max-[640px]:px-5">
        <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
          {t("testResult.enemySpectrum", {
            defaultValue: "Enemy spectrum",
          })}
        </h2>

        <div className="flex flex-col gap-5">
          {details.enemyScores.map((score) => (
            <EnemySpectrumBar key={score.key} score={score} />
          ))}
        </div>
      </div>

      <div className="flex gap-10 max-[640px]:flex-col">
        <div className="box-border min-w-0 flex-1 rounded-[24px] border-2 border-[#f2dcc5] bg-[#fff7f0] pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
          <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
            {t("testResult.graweModel", {
              defaultValue: "Grawe model",
            })}
          </h2>

          <p className="m-0 mb-4 text-[18px] text-[#8b6c00]">
            {details.threatenedNeed}
          </p>

          <p className="m-0 text-[16px] leading-[1.65] text-[#555]">
            {details.psychologicalBasis}
          </p>
        </div>

        <div className="box-border min-w-0 flex-1 rounded-[24px] border-2 border-[#f0c4c4] bg-[#fff5f5] pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
          <h2 className="m-0 mb-3 text-[22px] font-bold leading-[28px] text-[#111]">
            {t("testResult.earlySign", {
              defaultValue: "Early sign",
            })}
          </h2>

          <p className="m-0 text-[16px] leading-[1.65] text-[#555]">
            {details.warningSign}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="box-border min-w-0 rounded-[24px] border-2 border-[#ece7dd] bg-white pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
          <h2 className="m-0 mb-4 text-[22px] font-bold leading-[28px] text-[#111]">
            {t("testResult.howItWins", {
              defaultValue: "How it wins",
            })}
          </h2>

          <p className="m-0 text-[16px] leading-[1.65] text-[#555]">
            {details.howItWins}
          </p>
        </div>

        <div className="box-border min-w-0 rounded-[24px] border-2 border-[#ece7dd] bg-white pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
          <h2 className="m-0 mb-4 text-[22px] font-bold leading-[28px] text-[#111]">
            {t("testResult.patternAcrossStory", {
              defaultValue: "Pattern across the story",
            })}
          </h2>

          <p className="m-0 text-[16px] leading-[1.65] text-[#555]">
            {details.hiddenTraitSummary}
          </p>
        </div>
      </div>

      <div className="box-border w-full rounded-[24px] border-2 border-[#ece7dd] bg-white pb-10 pl-[41px] pr-10 pt-5 max-[640px]:px-5">
        <h2 className="m-0 mb-[18px] text-[28px] font-bold leading-[35px] text-[#111111]">
          {t("testResult.howToResist", {
            defaultValue: "How to resist it",
          })}
        </h2>

        <p className="m-0 mb-5 text-[16px] leading-[1.7] text-[#555555]">
          {details.resistance}
        </p>

        <h3 className="m-0 mb-3 text-[20px] font-bold text-[#111]">
          {t("testResult.whatItCanMisread", {
            defaultValue: "What it can make you misread",
          })}
        </h3>

        <ul className="m-0 pl-6 text-[18px] font-normal leading-[28px] text-[#555555]">
          {details.distortionPatterns.map((item) => (
            <li key={item} className="mb-2">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export const TestResult = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [resultData, setResultData] = useState<ResultApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        if (isLocalEnemyTestId(id)) {
          setResultData(getStoredLocalEnemyResult());
          return;
        }

        const response = await fetchWithToken(`/api/v1/tests/${id}/result`, {
          method: "GET",
        });
        setResultData(await response.json());
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : t("testResult.failedToLoad"),
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void fetchResult();
    }
  }, [id, t]);

  const localizedResultData = useMemo(
    () =>
      resultData
        ? {
            ...resultData,
            result: localizeResultPayload(
              resultData.test_type,
              resultData.result,
              i18n.language,
            ),
          }
        : null,
    [resultData, i18n.language],
  );

  const testType = localizedResultData?.test_type;
  const result = localizedResultData?.result;

  const handleRetake = () => navigate(`/tests/${id}`);

  if (loading) {
    return (
      <main className="mx-auto mb-[154px] mt-[70px] box-border max-w-[1440px] px-[120px] text-center max-[900px]:px-6">
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f2c200] border-t-transparent" />
          <p className="text-[18px] text-[#555]">{t("testResult.loading")}</p>
        </div>
      </main>
    );
  }

  if (error || !result || !testType) {
    return (
      <main className="mx-auto mb-[154px] mt-[70px] box-border max-w-[1440px] px-[120px] text-center max-[900px]:px-6">
        <h1 className="mb-6 text-[32px] font-bold">
          {error ? t("testResult.errorLoading") : t("testResult.noResultYet")}
        </h1>

        <p className="mb-8 text-[18px] text-[#555]">
          {error || t("testResult.takeTestFirst")}
        </p>

        <button
          type="button"
          onClick={() => navigate(`/tests/${id}/intro`)}
          className="h-[58px] w-[230px] cursor-pointer rounded-[12px] border-none bg-[#F2B705] text-[16px] font-bold leading-[20px] text-white transition-opacity hover:opacity-90"
        >
          {t("testResult.goToTest")}
        </button>
      </main>
    );
  }

  const leftCardContent = (() => {
    if (isPersonality(testType, result.details)) {
      return <PersonalityLeftCard details={result.details} />;
    }

    if (isAnimal(testType, result.details)) {
      return <AnimalLeftCard details={result.details} />;
    }

    if (isWeapon(testType, result.details)) {
      return <WeaponLeftCard details={result.details} />;
    }

    if (isEnemy(testType, result.details)) {
      return <EnemyLeftCard details={result.details} />;
    }

    return null;
  })();

  const detailsSection = (() => {
    if (isPersonality(testType, result.details)) {
      return <PersonalityDetailsSection result={result as PersonalityResult} />;
    }

    if (isAnimal(testType, result.details)) {
      return <AnimalDetailsSection result={result as AnimalResult} />;
    }

    if (isWeapon(testType, result.details)) {
      return <WeaponDetailsSection result={result as WeaponResult} />;
    }

    if (isEnemy(testType, result.details)) {
      return <EnemyDetailsSection result={result as EnemyResult} />;
    }

    return null;
  })();

  const strengthsHeading = isEnemy(testType, result.details)
    ? t("testResult.whatThisSensitivityProtects", {
        defaultValue: "What this sensitivity protects",
      })
    : t("testResult.strengths");

  const growthAreasHeading = isEnemy(testType, result.details)
    ? t("testResult.whereItCanMislead", {
        defaultValue: "Where it can mislead you",
      })
    : t("testResult.growthAreas");

  return (
    <main className="mx-auto mb-[154px] mt-[70px] box-border max-w-[1440px] px-[120px] max-[1100px]:px-10 max-[640px]:px-5">
      <p className="m-0 mb-5 text-[14px] font-normal leading-[18px] text-[#7a7a7a]">
        {t("testResult.yourResult")}
      </p>

      <h1 className="m-0 mb-3 text-[40px] font-extrabold leading-[50px] text-[#111111] max-[640px]:text-[28px]">
        {result.title}
      </h1>

      <p className="mb-8 text-[18px] italic text-[#8b6c00]">
        {result.tagline}
      </p>

      <section className="flex items-start gap-10 max-[900px]:flex-col">
        <div className="box-border flex min-h-[470px] w-[360px] shrink-0 flex-col items-center rounded-[24px] border-2 border-[#ece7dd] bg-white px-[44px] pb-[41px] pt-[62px] max-[900px]:w-full max-[900px]:max-w-[400px]">
          <img
            src={result.imageSrc}
            alt={result.imageAlt}
            className="mx-auto mb-[49px] block max-w-[180px]"
          />

          {leftCardContent}

          <p className="mt-6 text-center text-[14px] italic text-[#8b6c00]">
            {result.subtitle}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[30px]">
          <div className="box-border w-full rounded-[24px] border-2 border-[#ece7dd] bg-white pb-10 pl-[41px] pr-10 pt-5 max-[640px]:px-5">
            <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
              {t("testResult.description")}
            </h2>

            <p className="m-0 text-[18px] font-normal leading-[30px] text-[#555555]">
              {result.description}
            </p>

            {result.whyThisResult && (
              <p className="mt-5 text-[16px] italic leading-[26px] text-[#6f6a60]">
                {result.whyThisResult}
              </p>
            )}
          </div>

          <div className="flex gap-10 max-[640px]:flex-col">
            <div className="box-border min-w-0 flex-1 rounded-[24px] border-2 border-[#eed892] bg-[#fff9e8] pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
              <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
                {strengthsHeading}
              </h2>

              <ul className="m-0 pl-6 text-[18px] font-normal leading-[28px] text-[#555555]">
                {result.strengths.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="box-border min-w-0 flex-1 rounded-[24px] border-2 border-[#d8d1f2] bg-[#f7f4ff] pb-8 pl-10 pr-8 pt-5 max-[640px]:pl-6">
              <h2 className="m-0 mb-[22px] text-[28px] font-bold leading-[35px] text-[#111111]">
                {growthAreasHeading}
              </h2>

              <ul className="m-0 pl-6 text-[18px] font-normal leading-[28px] text-[#555555]">
                {result.growthAreas.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {detailsSection}

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleRetake}
              className="h-[58px] w-[230px] cursor-pointer rounded-[12px] border-2 border-[#f2c200] bg-white text-[16px] font-bold text-[#8b6c00] transition-all duration-200 hover:bg-[#fff9e8]"
            >
              {t("testResult.retake")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
