import { useEffect, useState, useCallback } from "react";
import { fetchWithToken } from "../api/apiutils";

// ── Types ────────────────────────────────────────────────────────────────────

type FriendshipStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "friends";

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

// ── Helpers ──────────────────────────────────────────────────────────────────

const ARCHETYPE_COLORS: Record<string, string> = {
  personality: "#FFF9E8",
  animal: "#EEF8FF",
  weapon: "#F7F4FF",
  color: "#FFF0F0",
};

const STATUS_CONFIG: Record<
  FriendshipStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  none: {
    label: "Add Friend",
    color: "#fff",
    bg: "#F2C200",
    border: "#F2C200",
  },
  pending_sent: {
    label: "Pending…",
    color: "#9a6e00",
    bg: "#FFF8D9",
    border: "#F2C200",
  },
  pending_received: {
    label: "Accept",
    color: "#fff",
    bg: "#22c55e",
    border: "#22c55e",
  },
  friends: {
    label: "Friends ✓",
    color: "#166534",
    bg: "#dcfce7",
    border: "#86efac",
  },
};

// ── ResultsDrawer ─────────────────────────────────────────────────────────────

function ResultsDrawer({
  userId,
  nickname,
  onClose,
}: {
  userId: number;
  nickname: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<UserResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[640px] max-h-[80vh] overflow-y-auto rounded-t-[28px] bg-white p-8 pb-12"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mb-6 h-[5px] w-[48px] rounded-full bg-[#e4e0d8]" />

        <p className="mb-1 text-[13px] font-semibold uppercase tracking-widest text-[#9a8c6e]">
          Test Results
        </p>
        <h2 className="mb-6 text-[24px] font-bold text-[#111]">{nickname}</h2>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#f2c200] border-t-transparent" />
          </div>
        )}

        {!loading && data && data.results.length === 0 && (
          <p className="py-8 text-center text-[16px] text-[#999]">
            No tests completed yet.
          </p>
        )}

        {!loading &&
          data &&
          data.results.map((r) => (
            <div
              key={r.test_id}
              className="mb-4 flex items-center gap-4 rounded-[18px] border-2 border-[#ece7dd] bg-white p-4"
            >
              <div
                className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[14px]"
                style={{
                  background: ARCHETYPE_COLORS[r.test_type] ?? "#f7f2ea",
                }}
              >
                <img
                  src={r.image_src}
                  alt={r.image_alt}
                  className="h-[52px] w-[52px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-[12px] font-semibold uppercase tracking-wider text-[#9a8c6e]">
                  {r.test_title}
                </p>
                <p className="mb-0.5 truncate text-[17px] font-bold text-[#111]">
                  {r.title}
                </p>
                {r.subtitle && (
                  <p className="text-[13px] text-[#777]">{r.subtitle}</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// ── UserCard ──────────────────────────────────────────────────────────────────

function UserCard({
  user,
  onAction,
  onViewResults,
}: {
  user: CommunityUser;
  onAction: (user: CommunityUser) => void;
  onViewResults: (user: CommunityUser) => void;
}) {
  const cfg = STATUS_CONFIG[user.friendship_status];
  const initials = user.nickname
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="group relative flex flex-col rounded-[22px] border-2 border-[#ece7dd] bg-white p-6 transition-all duration-200 hover:border-[#f2c200] hover:shadow-[0_8px_32px_rgba(242,194,0,0.10)]">
      {/* Avatar */}
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

      {/* View Results */}
      <button
        onClick={() => onViewResults(user)}
        className="mb-3 w-full rounded-[12px] border-2 border-[#ece7dd] bg-[#faf8f4] py-2 text-[14px] font-semibold text-[#7a6e5a] transition-all hover:border-[#f2c200] hover:text-[#8b6c00]"
      >
        View Results
      </button>

      {/* Friend Action */}
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

// ── IncomingRequestsBanner ────────────────────────────────────────────────────

function IncomingBanner({
  requests,
  onRespond,
}: {
  requests: CommunityUser[];
  onRespond: (user: CommunityUser, action: "accepted" | "declined") => void;
}) {
  if (requests.length === 0) return null;

  return (
    <div className="mb-8 rounded-[20px] border-2 border-[#f2c200] bg-[#fffbec] px-6 py-5">
      <p className="mb-4 text-[13px] font-bold uppercase tracking-widest text-[#9a6e00]">
        Friend Requests · {requests.length}
      </p>
      <div className="flex flex-wrap gap-3">
        {requests.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-3 rounded-[14px] border border-[#f2c200] bg-white px-4 py-2"
          >
            <span className="text-[15px] font-semibold text-[#111]">
              {u.nickname}
            </span>
            <button
              onClick={() => onRespond(u, "accepted")}
              className="rounded-[8px] bg-[#22c55e] px-3 py-1 text-[13px] font-bold text-white"
            >
              Accept
            </button>
            <button
              onClick={() => onRespond(u, "declined")}
              className="rounded-[8px] bg-[#f1f1f1] px-3 py-1 text-[13px] font-bold text-[#666]"
            >
              Decline
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export const CommunityPage = () => {
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerUser, setDrawerUser] = useState<CommunityUser | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetchWithToken("/api/v1/community/users");
      const data = await res.json();
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const incomingRequests = users.filter(
    (u) => u.friendship_status === "pending_received",
  );

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.nickname.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    );
  });

  const handleAction = async (user: CommunityUser) => {
    if (user.friendship_status === "none") {
      // send request
      await fetchWithToken(
        `/api/v1/community/users/${user.id}/friend-request`,
        { method: "POST" },
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, friendship_status: "pending_sent" } : u,
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
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              friendship_status: action === "accepted" ? "friends" : "none",
              friendship_id: action === "accepted" ? u.friendship_id : null,
            }
          : u,
      ),
    );
  };

  // For UserCard — action & respond combined
  const handleCardAction = async (user: CommunityUser) => {
    if (user.friendship_status === "pending_received") {
      await handleRespond(user, "accepted");
    } else {
      await handleAction(user);
    }
  };

  return (
    <main className="mx-auto mt-[60px] max-w-[1240px] px-[18px] pb-20">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-widest text-[#9a8c6e]">
          Community
        </p>
        <h1 className="mb-1 text-[40px] font-bold leading-tight text-[#111]">
          Meet the community
        </h1>
        <p className="text-[17px] text-[#777]">
          See how others passed the tests, connect with people, build your
          circle.
        </p>
      </div>

      {/* Incoming requests banner */}
      <IncomingBanner requests={incomingRequests} onRespond={handleRespond} />

      {/* Search */}
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
          placeholder="Search by name or username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#bbb]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-[#bbb] hover:text-[#888]"
          >
            ✕
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#f2c200] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[18px] text-[#aaa]">No users found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-3 max-[740px]:grid-cols-2 max-[480px]:grid-cols-1">
          {filtered.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onAction={handleCardAction}
              onViewResults={setDrawerUser}
            />
          ))}
        </div>
      )}

      {/* Drawer */}
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
