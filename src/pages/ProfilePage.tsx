import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchWithToken, tokenManager } from "../api/apiutils";
import { AchievementsGrid } from "../components/AchievementsGrid";
import { FriendshipProgress } from "../components/FriendshipProgress";
import { RecommendationsSection } from "../components/profile/RecommendationsSection";
import { normalizeAltynAdamLanguage } from "../data/altynAdamCulturalDialogues";
import {
  localizeSubmission,
  localizeTestType,
} from "../content/testContentTranslations";
import {
  getAltynAdamProgress,
  normalizeCompletedTestKey,
  syncCompletedUniqueTests,
} from "../utils/altynAdamProgress";
import type { CompletedTestKey } from "../types/altynAdam";

interface Me {
  id: number;
  username: string;
  nickname: string;
  email: string;
  coins: number;
}

interface Submission {
  test_id: number;
  test_type: string;
  test_title: string;
  test_image_src: string;
  result: {
    resultKey: string;
    title: string;
    subtitle: string | null;
    description: string;
    imageSrc: string;
    imageAlt: string;
    tagline: string;
    strengths?: string[];
    growthAreas?: string[];
  };
  updated_at: string;
}

interface Friend {
  friendship_id: number;
  user: { id: number; username: string; nickname: string };
  since: string;
}

interface LocalizedString {
  en: string;
  ru: string;
  kk: string;
}

interface Recommendation {
  id: number;
  title: LocalizedString | string;
  message: LocalizedString | string;
  description?: LocalizedString | string;
  type: string;
  url?: string | null;
  image_src?: string | null;
  reason?: string | null;
}

interface AdaptiveFigureSessionSummary {
  status: "in_progress" | "completed" | "abandoned";
}

const ARCHETYPE_COLORS: Record<string, { bg: string; accent: string }> = {
  personality: { bg: "#FFF9E8", accent: "#F2C200" },
  animal: { bg: "#EEF8FF", accent: "#60a5fa" },
  weapon: { bg: "#F7F4FF", accent: "#a78bfa" },
  enemy: { bg: "#FFF4EC", accent: "#d97706" },
  color: { bg: "#FFF0F0", accent: "#f87171" },
};

const REC_TYPE_COLORS: Record<string, { bg: string; accent: string }> = {
  book: { bg: "#EFF6FF", accent: "#3b82f6" },
  movie: { bg: "#FFF1F2", accent: "#f43f5e" },
  activity: { bg: "#F0FDF4", accent: "#22c55e" },
  game: { bg: "#F5F3FF", accent: "#8b5cf6" },
  music: { bg: "#FFF7ED", accent: "#f97316" },
};
const ADAPTIVE_FIGURE_SESSION_STORAGE_KEY = "adaptive_figure_session_id";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 text-[13px] font-bold uppercase tracking-widest text-[#9a8c6e]">
      {children}
    </h2>
  );
}

function ResultCard({ sub }: { sub: Submission }) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const palette = ARCHETYPE_COLORS[sub.test_type] ?? {
    bg: "#f7f2ea",
    accent: "#F2C200",
  };

  return (
    <article className="overflow-hidden rounded-[22px] border-2 border-[#ece7dd] bg-white transition-all duration-200 hover:border-[#f2c200] hover:shadow-[0_8px_32px_rgba(242,194,0,0.10)]">
      <div className="flex gap-4 p-5">
        <div
          className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[16px]"
          style={{ background: palette.bg }}
        >
          <img
            src={sub.result.imageSrc}
            alt={sub.result.imageAlt}
            className="h-[52px] w-[52px] rounded-[14px] object-cover"
            onError={(event) => {
              (event.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="rounded-[6px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ background: palette.bg, color: palette.accent }}
            >
              {localizeTestType(sub.test_type, i18n.language)}
            </span>
          </div>

          <p className="mb-0.5 truncate text-[17px] font-bold text-[#111]">
            {sub.result.title}
          </p>

          {sub.result.subtitle && (
            <p className="text-[13px] text-[#888]">{sub.result.subtitle}</p>
          )}

          <p className="mt-1 text-[13px] italic text-[#aaa]">
            {sub.result.tagline}
          </p>
        </div>

        <button
          onClick={() => setExpanded((value) => !value)}
          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full border-2 border-[#ece7dd] text-[#bbb] transition-all hover:border-[#f2c200] hover:text-[#f2c200]"
          aria-label={expanded ? t("profile.collapse") : t("profile.expand")}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            {expanded ? <path d="M2 8L6 4L10 8" /> : <path d="M2 4L6 8L10 4" />}
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="border-t-2 border-[#ece7dd] px-5 pb-5 pt-4">
          <p className="mb-4 text-[15px] leading-relaxed text-[#555]">
            {sub.result.description}
          </p>

          <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
            {sub.result.strengths && (
              <div>
                <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#22c55e]">
                  {t("profile.strengths")}
                </p>

                <ul className="space-y-1">
                  {sub.result.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-[14px] text-[#444]"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sub.result.growthAreas && (
              <div>
                <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#f59e0b]">
                  {t("profile.growthAreas")}
                </p>

                <ul className="space-y-1">
                  {sub.result.growthAreas.map((growthArea, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-[14px] text-[#444]"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f59e0b]" />
                      {growthArea}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function resolveLocalized(
  value: LocalizedString | string | undefined,
  lang: "en" | "ru" | "kk",
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.en ?? "";
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const { t, i18n } = useTranslation();
  const lang =
    i18n.language === "ru" || i18n.language === "kk" ? i18n.language : "en";
  const palette = REC_TYPE_COLORS[rec.type] ?? {
    bg: "#FFF9E8",
    accent: "#f2c200",
  };

  const typeLabels: Record<string, string> = {
    book: t("profile.recommendationTypes.book"),
    movie: t("profile.recommendationTypes.movie"),
    activity: t("profile.recommendationTypes.activity"),
    game: t("profile.recommendationTypes.game"),
    music: t("profile.recommendationTypes.music"),
  };

  return (
    <article className="overflow-hidden rounded-[22px] border-2 border-[#ece7dd] bg-white transition-all duration-200 hover:border-[#f2c200] hover:shadow-[0_8px_32px_rgba(242,194,0,0.10)]">
      <div className="flex gap-4 p-5">
        {rec.image_src ? (
          <img
            src={rec.image_src}
            alt={resolveLocalized(rec.title, lang)}
            className="h-[72px] w-[72px] shrink-0 rounded-[16px] object-cover"
            onError={(event) => {
              (event.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[16px] text-[18px] font-black"
            style={{ background: palette.bg, color: palette.accent }}
          >
            AI
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-1">
            <span
              className="rounded-[6px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ background: palette.bg, color: palette.accent }}
            >
              {typeLabels[rec.type] ?? rec.type}
            </span>
          </div>

          <p className="mb-1 text-[17px] font-bold text-[#111]">
            {resolveLocalized(rec.title, lang)}
          </p>

          <p className="text-[14px] leading-relaxed text-[#666]">
            {resolveLocalized(rec.message ?? rec.description, lang)}
          </p>

          {rec.reason && (
            <p className="mt-2 text-[12px] italic text-[#aaa]">
              {t("profile.recommendationWhy")}: {rec.reason}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function FriendCard({
  friend,
  onRemove,
}: {
  friend: Friend;
  onRemove: (id: number) => void;
}) {
  const { t } = useTranslation();
  const initials = friend.user.nickname
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-[16px] border-2 border-[#ece7dd] bg-white p-4 transition-all hover:border-[#f2c200]">
      <div
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-[15px] font-black text-white"
        style={{
          background: "linear-gradient(135deg,#f2c200 0%,#e09900 100%)",
        }}
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-bold text-[#111]">
          {friend.user.nickname}
        </p>

        <p className="text-[12px] text-[#999]">@{friend.user.username}</p>
      </div>

      <button
        onClick={() => onRemove(friend.friendship_id)}
        className="rounded-[8px] border-2 border-[#ece7dd] px-3 py-1 text-[12px] text-[#bbb] transition-all hover:border-red-200 hover:text-red-400"
        title={t("profile.removeFriendTitle")}
      >
        {t("profile.removeFriend")}
      </button>
    </div>
  );
}

export const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [me, setMe] = useState<Me | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [tab, setTab] = useState<"results" | "friends">("results");
  const [loading, setLoading] = useState(true);
  const [hasCompletedAdaptiveFigure, setHasCompletedAdaptiveFigure] =
    useState(false);
  const [altynAdamProgress, setAltynAdamProgress] = useState(() =>
    getAltynAdamProgress(),
  );

  useEffect(() => {
    void (async () => {
      try {
        const storedAdaptiveSessionId = localStorage.getItem(
          ADAPTIVE_FIGURE_SESSION_STORAGE_KEY,
        );
        const adaptiveSessionPromise = storedAdaptiveSessionId
          ? fetchWithToken(
              `/api/v1/adaptive-figure/sessions/${storedAdaptiveSessionId}`,
            )
              .then((response) => response.json() as Promise<AdaptiveFigureSessionSummary>)
              .catch(() => null)
          : Promise.resolve<AdaptiveFigureSessionSummary | null>(null);

        const [
          meResult,
          submissionsResult,
          friendsResult,
          adaptiveSessionData,
        ] = await Promise.allSettled([
          fetchWithToken("/api/v1/me").then((response) => response.json()),
          fetchWithToken("/api/v1/submissions").then((response) =>
            response.json(),
          ),
          fetchWithToken("/api/v1/community/friends").then((response) =>
            response.json(),
          ),
          adaptiveSessionPromise,
        ]);

        if (meResult.status === "rejected") {
          throw meResult.reason;
        }

        setMe(meResult.value as Me);

        if (submissionsResult.status === "fulfilled") {
          setSubmissions(submissionsResult.value.submissions ?? []);
        } else {
          console.error("Profile submissions load failed:", submissionsResult.reason);
          setSubmissions([]);
        }

        if (friendsResult.status === "fulfilled") {
          setFriends(friendsResult.value.friends ?? []);
        } else {
          console.error("Profile friends load failed:", friendsResult.reason);
          setFriends([]);
        }

        if (adaptiveSessionData.status === "fulfilled") {
          setHasCompletedAdaptiveFigure(
            adaptiveSessionData.value?.status === "completed",
          );
        } else {
          console.error(
            "Adaptive figure session load failed:",
            adaptiveSessionData.reason,
          );
          setHasCompletedAdaptiveFigure(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetchWithToken("/api/v1/me/recommendations");
        const data = (await response.json()) as { recommendations: Recommendation[] };
        setRecommendations(data.recommendations ?? []);
      } catch (error) {
        console.error("Profile recommendations load failed:", error);
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const loadMeCoins = async () => {
      try {
        const response = await fetchWithToken("/api/v1/me");
        const data = (await response.json()) as Me;
        const nextCoins = data.coins;

        setMe((prev) =>
          prev
            ? {
                ...prev,
                coins: nextCoins,
              }
            : {
                ...data,
                coins: nextCoins,
              },
        );
      } catch {
        // Keep the current profile state if the balance refresh fails.
      }
    };

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "coins:updated") {
        const nextCoins = event.data.coins;

        if (typeof nextCoins === "number") {
          setMe((prev) =>
            prev
              ? {
                  ...prev,
                  coins: nextCoins,
                }
              : prev,
          );
        } else {
          void loadMeCoins();
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    const completedTestKeys = Array.from(
      new Set<CompletedTestKey>(
        [
          ...submissions.map((submission) =>
            normalizeCompletedTestKey(submission.test_type),
          ),
          hasCompletedAdaptiveFigure ? "adaptive-figure" : null,
        ].filter((testKey): testKey is CompletedTestKey => testKey !== null),
      ),
    );

    const { progress } = syncCompletedUniqueTests(completedTestKeys);

    setAltynAdamProgress(progress);
  }, [hasCompletedAdaptiveFigure, submissions]);

  const handleRemoveFriend = useCallback(async (friendshipId: number) => {
    await fetchWithToken(`/api/v1/community/friend-requests/${friendshipId}`, {
      method: "DELETE",
    });

    setFriends((prev) =>
      prev.filter((friend) => friend.friendship_id !== friendshipId),
    );
  }, []);

  const handleLogout = () => {
    tokenManager.clearToken();
    navigate("/auth");
  };

  const localizedSubmissions = useMemo(
    () =>
      submissions.map((submission) =>
        localizeSubmission(submission, i18n.language),
      ),
    [submissions, i18n.language],
  );
  const altynAdamLanguage = useMemo(
    () => normalizeAltynAdamLanguage(i18n.language),
    [i18n.language],
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#f2c200] border-t-transparent" />
      </div>
    );
  }

  if (!me) return null;

  const initials = me.nickname
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <main className="mx-auto mt-[60px] max-w-[860px] px-[18px] pb-24">
      <section className="mb-10 flex items-center gap-6 rounded-[28px] border-2 border-[#ece7dd] bg-white p-8 max-[640px]:flex-col max-[640px]:text-center">
        <div
          className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full text-[28px] font-black text-white"
          style={{
            background: "linear-gradient(135deg,#f2c200 0%,#e09900 100%)",
          }}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="mb-0.5 text-[28px] font-bold text-[#111]">
            {me.nickname}
          </h1>

          <p className="text-[15px] text-[#999]">
            @{me.username} · {me.email}
          </p>
        </div>

        <div className="flex h-[44px] min-w-[130px] select-none items-center justify-center gap-2 rounded-[12px] border-[3px] border-[#f2c200] bg-[#fff8d9] px-4 text-[16px] font-bold text-[#9a6e00]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f2c200] text-[10px] font-black text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]">
            ✦
          </span>
          {me.coins.toLocaleString()}
        </div>

        <button
          onClick={handleLogout}
          className="rounded-[12px] border-2 border-[#ece7dd] px-5 py-2 text-[14px] font-semibold text-[#999] transition-all hover:border-red-200 hover:text-red-400"
        >
          {t("profile.logout")}
        </button>
      </section>

      <div className="mb-6 flex gap-2 rounded-[16px] border-2 border-[#ece7dd] bg-white p-1.5">
        {(["results", "friends"] as const).map((value) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className="flex-1 rounded-[12px] py-2.5 text-[15px] font-semibold capitalize transition-all"
            style={
              tab === value
                ? { background: "#f2c200", color: "#fff" }
                : { color: "#999" }
            }
          >
            {value === "results"
              ? `${t("profile.resultsTab")}${localizedSubmissions.length ? ` (${localizedSubmissions.length})` : ""}`
              : `${t("profile.friendsTab")}${friends.length ? ` (${friends.length})` : ""}`}
          </button>
        ))}
      </div>

      {tab === "results" && (
        <div>
          <SectionTitle>{t("profile.myResults")}</SectionTitle>

          <div className="mb-6 space-y-6">
            <FriendshipProgress
              progress={altynAdamProgress}
              language={altynAdamLanguage}
            />
            <AchievementsGrid
              unlockedAchievementIds={altynAdamProgress.unlockedAchievements}
              language={altynAdamLanguage}
            />
          </div>

          {localizedSubmissions.length === 0 ? (
            <div className="rounded-[22px] border-2 border-dashed border-[#ece7dd] py-16 text-center">
              <p className="text-[17px] text-[#bbb]">
                {t("profile.noTestsCompletedYet")}
              </p>

              <button
                onClick={() => navigate("/tests")}
                className="mt-4 rounded-[12px] bg-[#f2c200] px-6 py-2.5 text-[15px] font-bold text-white"
              >
                {t("profile.takeTest")}
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {localizedSubmissions.map((submission) => (
                  <ResultCard key={submission.test_id} sub={submission} />
                ))}
              </div>

              <div className="mt-10">
                <SectionTitle>{t("profile.recommendationsTitle")}</SectionTitle>

                {recommendationsLoading ? (
                  <div className="flex items-center gap-4 rounded-[22px] border-2 border-[#ece7dd] bg-white px-6 py-10">
                    <div className="h-6 w-6 shrink-0 animate-spin rounded-full border-[3px] border-[#f2c200] border-t-transparent" />
                    <p className="text-[15px] text-[#999]">
                      {t("profile.recommendationsLoading")}
                    </p>
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="rounded-[22px] border-2 border-dashed border-[#ece7dd] py-12 text-center">
                    <p className="text-[16px] text-[#bbb]">
                      {t("profile.noRecommendationsYet")}
                    </p>

                    <p className="mt-2 text-[14px] text-[#ccc]">
                      {t("profile.recommendationsHint")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((recommendation, index) => (
                      <RecommendationCard
                        key={recommendation.id ?? index}
                        rec={recommendation}
                      />
                    ))}
                  </div>
                )}
              </div>

              <RecommendationsSection testResults={submissions} />
            </>
          )}
        </div>
      )}

      {tab === "friends" && (
        <div>
          <SectionTitle>{t("profile.myFriends")}</SectionTitle>

          {friends.length === 0 ? (
            <div className="rounded-[22px] border-2 border-dashed border-[#ece7dd] py-16 text-center">
              <p className="text-[17px] text-[#bbb]">
                {t("profile.noFriendsYet")}
              </p>

              <button
                onClick={() => navigate("/community")}
                className="mt-4 rounded-[12px] bg-[#f2c200] px-6 py-2.5 text-[15px] font-bold text-white"
              >
                {t("profile.meetCommunity")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              {friends.map((friend) => (
                <FriendCard
                  key={friend.friendship_id}
                  friend={friend}
                  onRemove={handleRemoveFriend}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};
