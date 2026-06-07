import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchWithToken } from "../api/apiutils";
import { localizeCommunityResult } from "../content/testContentTranslations";

type FriendshipStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "friends";

interface SharedArchetype {
  test_type: string;
  test_title: string;
  result_key: string;
  result_title: string;
}

interface SuggestedFriend {
  user: CommunityUser;
  score: number;
  shared_test_count: number;
  shared_archetypes: SharedArchetype[];
}

interface CommunityUser {
  id: number;
  username: string;
  nickname: string;
  friendship_status: FriendshipStatus;
  friendship_id: number | null;
}

interface TestResult {
  test_id: number;
  test_type: string;
  test_title: string;
  result_key: string;
  title: string;
  subtitle: string | null;
  description: string;
  image_src: string;
  image_alt: string;
  updated_at: string;
}

interface UserResults {
  user: { id: number; username: string; nickname: string };
  results: TestResult[];
}

const ARCHETYPE_COLORS: Record<string, string> = {
  personality: "#FFF9E8",
  animal: "#EEF8FF",
  weapon: "#F7F4FF",
  enemy: "#FFF4EC",
  color: "#FFF0F0",
};

function ResultsDrawer({
  userId,
  nickname,
  onClose,
}: {
  userId: number;
  nickname: string;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<UserResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetchWithToken(
          `/api/v1/community/users/${userId}/results`,
        );
        setData(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const localizedResults = useMemo(
    () =>
      data?.results.map((result) =>
        localizeCommunityResult(result, i18n.language),
      ) ?? [],
    [data?.results, i18n.language],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-[640px] overflow-y-auto rounded-t-[28px] bg-white p-8 pb-12"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-6 h-[5px] w-[48px] rounded-full bg-[#e4e0d8]" />

        <p className="mb-1 text-[13px] font-semibold uppercase tracking-widest text-[#9a8c6e]">
          {t("community.testResults")}
        </p>
        <h2 className="mb-6 text-[24px] font-bold text-[#111]">{nickname}</h2>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#f2c200] border-t-transparent" />
          </div>
        )}

        {!loading && data && localizedResults.length === 0 && (
          <p className="py-8 text-center text-[16px] text-[#999]">
            {t("community.noTestsCompletedYet")}
          </p>
        )}

        {!loading &&
          data &&
          localizedResults.map((result) => {
            return (
              <div
                key={result.test_id}
                className="mb-4 flex items-center gap-4 rounded-[18px] border-2 border-[#ece7dd] bg-white p-4"
              >
                <div
                  className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[14px]"
                  style={{
                    background: ARCHETYPE_COLORS[result.test_type] ?? "#f7f2ea",
                  }}
                >
                  <img
                    src={result.image_src}
                    alt={result.image_alt}
                    className="h-[52px] w-[52px] rounded-[14px] object-cover"
                    onError={(event) => {
                      (event.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 text-[12px] font-semibold uppercase tracking-wider text-[#9a8c6e]">
                    {result.test_title}
                  </p>
                  <p className="mb-0.5 truncate text-[17px] font-bold text-[#111]">
                    {result.title}
                  </p>
                  {result.subtitle && (
                    <p className="text-[13px] text-[#777]">{result.subtitle}</p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function UserCard({
  user,
  onAction,
  onViewResults,
}: {
  user: CommunityUser;
  onAction: (user: CommunityUser) => void;
  onViewResults: (user: CommunityUser) => void;
}) {
  const { t } = useTranslation();
  const cfg = {
    none: {
      label: t("community.addFriend"),
      color: "#fff",
      bg: "#F2C200",
      border: "#F2C200",
    },
    pending_sent: {
      label: t("community.pending"),
      color: "#9a6e00",
      bg: "#FFF8D9",
      border: "#F2C200",
    },
    pending_received: {
      label: t("community.accept"),
      color: "#fff",
      bg: "#22c55e",
      border: "#22c55e",
    },
    friends: {
      label: t("community.friends"),
      color: "#166534",
      bg: "#dcfce7",
      border: "#86efac",
    },
  }[user.friendship_status];

  const initials = user.nickname
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <article className="group relative flex flex-col rounded-[22px] border-2 border-[#ece7dd] bg-white p-6 transition-all duration-200 hover:border-[#f2c200] hover:shadow-[0_8px_32px_rgba(242,194,0,0.10)]">
      <div className="mb-4 flex items-center gap-4">
        <div
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-[18px] font-black text-white"
          style={{
            background: "linear-gradient(135deg,#f2c200 0%,#e09900 100%)",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[17px] font-bold leading-tight text-[#111]">
            {user.nickname}
          </p>
          <p className="text-[13px] text-[#999]">@{user.username}</p>
        </div>
      </div>

      <button
        onClick={() => onViewResults(user)}
        className="mb-3 w-full rounded-[12px] border-2 border-[#ece7dd] bg-[#faf8f4] py-2 text-[14px] font-semibold text-[#7a6e5a] transition-all hover:border-[#f2c200] hover:text-[#8b6c00]"
      >
        {t("community.viewResults")}
      </button>

      <button
        onClick={() => onAction(user)}
        disabled={
          user.friendship_status === "pending_sent" ||
          user.friendship_status === "friends"
        }
        className="w-full rounded-[12px] border-2 py-2 text-[14px] font-bold transition-all disabled:cursor-default"
        style={{
          color: cfg.color,
          background: cfg.bg,
          borderColor: cfg.border,
        }}
      >
        {cfg.label}
      </button>
    </article>
  );
}

function IncomingBanner({
  requests,
  onRespond,
}: {
  requests: CommunityUser[];
  onRespond: (user: CommunityUser, action: "accepted" | "declined") => void;
}) {
  const { t } = useTranslation();

  if (requests.length === 0) return null;

  return (
    <div className="mb-8 rounded-[20px] border-2 border-[#f2c200] bg-[#fffbec] px-6 py-5">
      <p className="mb-4 text-[13px] font-bold uppercase tracking-widest text-[#9a6e00]">
        {t("community.incomingRequests", { count: requests.length })}
      </p>
      <div className="flex flex-wrap gap-3">
        {requests.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 rounded-[14px] border border-[#f2c200] bg-white px-4 py-2"
          >
            <span className="text-[15px] font-semibold text-[#111]">
              {user.nickname}
            </span>
            <button
              onClick={() => onRespond(user, "accepted")}
              className="rounded-[8px] bg-[#22c55e] px-3 py-1 text-[13px] font-bold text-white"
            >
              {t("community.accept")}
            </button>
            <button
              onClick={() => onRespond(user, "declined")}
              className="rounded-[8px] bg-[#f1f1f1] px-3 py-1 text-[13px] font-bold text-[#666]"
            >
              {t("community.decline")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const ARCHETYPE_CHIP_COLORS: Record<string, { bg: string; text: string }> = {
  personality: { bg: "#FFF9E8", text: "#9a6e00" },
  animal:      { bg: "#EEF8FF", text: "#1d6fa4" },
  weapon:      { bg: "#F7F4FF", text: "#6d40c4" },
  enemy:       { bg: "#FFF4EC", text: "#b45309" },
};

function SuggestedFriendCard({
  suggestion,
  onAdd,
}: {
  suggestion: SuggestedFriend;
  onAdd: (user: CommunityUser) => void;
}) {
  const { t } = useTranslation();
  const { user, shared_archetypes, shared_test_count } = suggestion;

  const initials = user.nickname
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="flex flex-col rounded-[20px] border-2 border-[#ece7dd] bg-white p-5 transition-all duration-200 hover:border-[#f2c200] hover:shadow-[0_6px_24px_rgba(242,194,0,0.10)]">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-[15px] font-black text-white"
          style={{ background: "linear-gradient(135deg,#f2c200 0%,#e09900 100%)" }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[16px] font-bold leading-tight text-[#111]">
            {user.nickname}
          </p>
          <p className="text-[12px] text-[#999]">@{user.username}</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {shared_archetypes.length > 0 ? (
          shared_archetypes.map((a) => {
            const color = ARCHETYPE_CHIP_COLORS[a.test_type] ?? { bg: "#f5f2ea", text: "#6b675f" };
            return (
              <span
                key={a.test_type}
                className="rounded-[6px] px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: color.bg, color: color.text }}
              >
                {a.result_title}
              </span>
            );
          })
        ) : (
          <span className="text-[12px] text-[#aaa]">
            {t("community.sharedTests", { count: shared_test_count })}
          </span>
        )}
      </div>

      <button
        onClick={() => onAdd(user)}
        disabled={user.friendship_status !== "none"}
        className="mt-auto w-full rounded-[11px] border-2 border-[#f2c200] bg-[#fff8d9] py-1.5 text-[13px] font-bold text-[#9a6e00] transition-all hover:bg-[#f2c200] hover:text-white disabled:cursor-default disabled:opacity-60"
      >
        {user.friendship_status === "pending_sent"
          ? t("community.pending")
          : t("community.addFriend")}
      </button>
    </article>
  );
}

export const CommunityPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedFriend[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerUser, setDrawerUser] = useState<CommunityUser | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const [usersRes, suggestionsRes] = await Promise.all([
        fetchWithToken("/api/v1/community/users"),
        fetchWithToken("/api/v1/community/suggested-friends"),
      ]);
      const usersData = await usersRes.json();
      const suggestionsData = await suggestionsRes.json();
      setUsers(usersData.users);
      setSuggestions(suggestionsData.suggestions ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const incomingRequests = users.filter(
    (user) => user.friendship_status === "pending_received",
  );

  const filtered = users.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.nickname.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    );
  });

  const handleAction = async (user: CommunityUser) => {
    if (user.friendship_status === "none") {
      await fetchWithToken(`/api/v1/community/users/${user.id}/friend-request`, {
        method: "POST",
      });
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? { ...item, friendship_status: "pending_sent" }
            : item,
        ),
      );
      setSuggestions((prev) =>
        prev.map((s) =>
          s.user.id === user.id
            ? { ...s, user: { ...s.user, friendship_status: "pending_sent" } }
            : s,
        ),
      );
    }
  };

  const handleRespond = async (
    user: CommunityUser,
    action: "accepted" | "declined",
  ) => {
    if (!user.friendship_id) return;

    await fetchWithToken(
      `/api/v1/community/friend-requests/${user.friendship_id}`,
      { method: "PATCH" },
      { action },
    );

    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? {
              ...item,
              friendship_status: action === "accepted" ? "friends" : "none",
              friendship_id:
                action === "accepted" ? item.friendship_id : null,
            }
          : item,
      ),
    );
  };

  const handleCardAction = async (user: CommunityUser) => {
    if (user.friendship_status === "pending_received") {
      await handleRespond(user, "accepted");
    } else {
      await handleAction(user);
    }
  };

  return (
    <main className="mx-auto mt-[60px] max-w-[1240px] px-[18px] pb-20">
      <div className="mb-10">
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-widest text-[#9a8c6e]">
          {t("community.section")}
        </p>
        <h1 className="mb-1 text-[40px] font-bold leading-tight text-[#111]">
          {t("community.title")}
        </h1>
        <p className="text-[17px] text-[#777]">{t("community.description")}</p>
      </div>

      <IncomingBanner requests={incomingRequests} onRespond={handleRespond} />

      {suggestions.length > 0 && (
        <div className="mb-10">
          <p className="mb-4 text-[13px] font-bold uppercase tracking-widest text-[#9a8c6e]">
            {t("community.suggestedFriends")}
          </p>
          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
            {suggestions.map((s) => (
              <SuggestedFriendCard
                key={s.user.id}
                suggestion={s}
                onAdd={handleAction}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center gap-3 rounded-[16px] border-2 border-[#ece7dd] bg-white px-5 py-3 focus-within:border-[#f2c200]">
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#aaa"
          strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder={t("community.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#bbb]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-[#bbb] hover:text-[#888]"
          >
            ×
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#f2c200] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[18px] text-[#aaa]">{t("community.noUsersFound")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-3 max-[740px]:grid-cols-2 max-[480px]:grid-cols-1">
          {filtered.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onAction={handleCardAction}
              onViewResults={setDrawerUser}
            />
          ))}
        </div>
      )}

      {drawerUser && (
        <ResultsDrawer
          userId={drawerUser.id}
          nickname={drawerUser.nickname}
          onClose={() => setDrawerUser(null)}
        />
      )}
    </main>
  );
};
