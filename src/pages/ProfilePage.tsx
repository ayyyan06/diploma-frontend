import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken, tokenManager } from "../api/apiutils";

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

const ARCHETYPE_COLORS: Record<string, { bg: string; accent: string }> = {
  personality: { bg: "#FFF9E8", accent: "#F2C200" },
  animal: { bg: "#EEF8FF", accent: "#60a5fa" },
  weapon: { bg: "#F7F4FF", accent: "#a78bfa" },
  color: { bg: "#FFF0F0", accent: "#f87171" },
};

const typeLabel: Record<string, string> = {
  personality: "Personality",
  animal: "Animal",
  weapon: "Weapon",
  color: "Color",
};

// ── SubSection Header ─────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-[13px] font-bold uppercase tracking-widest text-[#9a8c6e]">
      {children}
    </h2>
  );
}

// ── Result Card ───────────────────────────────────────────────────────────────

function ResultCard({ sub }: { sub: Submission }) {
  const [expanded, setExpanded] = useState(false);
  const palette = ARCHETYPE_COLORS[sub.test_type] ?? {
    bg: "#f7f2ea",
    accent: "#F2C200",
  };

  return (
    <article className="rounded-[22px] border-2 border-[#ece7dd] bg-white overflow-hidden transition-all duration-200 hover:border-[#f2c200] hover:shadow-[0_8px_32px_rgba(242,194,0,0.10)]">
      <div className="flex gap-4 p-5">
        {/* Icon */}
        <div
          className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[16px]"
          style={{ background: palette.bg }}
        >
          <img
            src={sub.result.imageSrc}
            alt={sub.result.imageAlt}
            className="h-[52px] w-[52px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="rounded-[6px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ background: palette.bg, color: palette.accent }}
            >
              {typeLabel[sub.test_type] ?? sub.test_type}
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

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full border-2 border-[#ece7dd] text-[#bbb] transition-all hover:border-[#f2c200] hover:text-[#f2c200]"
          aria-label={expanded ? "Collapse" : "Expand"}
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

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t-2 border-[#ece7dd] px-5 pb-5 pt-4">
          <p className="mb-4 text-[15px] leading-relaxed text-[#555]">
            {sub.result.description}
          </p>
          <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
            {sub.result.strengths && (
              <div>
                <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#22c55e]">
                  Strengths
                </p>
                <ul className="space-y-1">
                  {sub.result.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[14px] text-[#444]"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sub.result.growthAreas && (
              <div>
                <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#f59e0b]">
                  Growth Areas
                </p>
                <ul className="space-y-1">
                  {sub.result.growthAreas.map((g, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[14px] text-[#444]"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f59e0b]" />
                      {g}
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

// ── Friend Card ───────────────────────────────────────────────────────────────

function FriendCard({
  friend,
  onRemove,
}: {
  friend: Friend;
  onRemove: (id: number) => void;
}) {
  const initials = friend.user.nickname
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
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
        title="Remove friend"
      >
        Remove
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [tab, setTab] = useState<"results" | "friends">("results");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [meRes, subRes, frRes] = await Promise.all([
          fetchWithToken("/api/v1/me"),
          fetchWithToken("/api/v1/submissions"),
          fetchWithToken("/api/v1/community/friends"),
        ]);
        setMe(await meRes.json());
        const subData = await subRes.json();
        setSubmissions(subData.submissions ?? []);
        const frData = await frRes.json();
        setFriends(frData.friends ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRemoveFriend = useCallback(async (friendshipId: number) => {
    await fetchWithToken(`/api/v1/community/friend-requests/${friendshipId}`, {
      method: "DELETE",
    });
    setFriends((prev) => prev.filter((f) => f.friendship_id !== friendshipId));
  }, []);

  const handleLogout = () => {
    tokenManager.clearToken();
    navigate("/auth");
  };

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
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <main className="mx-auto mt-[60px] max-w-[860px] px-[18px] pb-24">
      {/* Profile card */}
      <section className="mb-10 flex items-center gap-6 rounded-[28px] border-2 border-[#ece7dd] bg-white p-8 max-[640px]:flex-col max-[640px]:text-center">
        <div
          className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full text-[28px] font-black text-white"
          style={{
            background: "linear-gradient(135deg,#f2c200 0%,#e09900 100%)",
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="mb-0.5 text-[28px] font-bold text-[#111]">
            {me.nickname}
          </h1>
          <p className="text-[15px] text-[#999]">
            @{me.username} · {me.email}
          </p>
        </div>
        {/* Coin balance */}
        <div className="flex h-[44px] min-w-[130px] items-center justify-center gap-2 rounded-[12px] border-[3px] border-[#f2c200] bg-[#fff8d9] px-4 text-[16px] font-bold text-[#9a6e00] select-none">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f2c200] text-[10px] font-black text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]">
            ✦
          </span>
          {me.coins.toLocaleString()}
        </div>
        <button
          onClick={handleLogout}
          className="rounded-[12px] border-2 border-[#ece7dd] px-5 py-2 text-[14px] font-semibold text-[#999] transition-all hover:border-red-200 hover:text-red-400"
        >
          Log out
        </button>
      </section>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-[16px] border-2 border-[#ece7dd] bg-white p-1.5">
        {(["results", "friends"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 rounded-[12px] py-2.5 text-[15px] font-semibold capitalize transition-all"
            style={
              tab === t
                ? { background: "#f2c200", color: "#fff" }
                : { color: "#999" }
            }
          >
            {t === "results"
              ? `Test Results${submissions.length ? ` (${submissions.length})` : ""}`
              : `Friends${friends.length ? ` (${friends.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "results" && (
        <div>
          <SectionTitle>My Test Results</SectionTitle>
          {submissions.length === 0 ? (
            <div className="rounded-[22px] border-2 border-dashed border-[#ece7dd] py-16 text-center">
              <p className="text-[17px] text-[#bbb]">No tests completed yet.</p>
              <button
                onClick={() => navigate("/tests")}
                className="mt-4 rounded-[12px] bg-[#f2c200] px-6 py-2.5 text-[15px] font-bold text-white"
              >
                Take a Test
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((s) => (
                <ResultCard key={s.test_id} sub={s} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "friends" && (
        <div>
          <SectionTitle>My Friends</SectionTitle>
          {friends.length === 0 ? (
            <div className="rounded-[22px] border-2 border-dashed border-[#ece7dd] py-16 text-center">
              <p className="text-[17px] text-[#bbb]">No friends yet.</p>
              <button
                onClick={() => navigate("/community")}
                className="mt-4 rounded-[12px] bg-[#f2c200] px-6 py-2.5 text-[15px] font-bold text-white"
              >
                Meet the Community
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              {friends.map((f) => (
                <FriendCard
                  key={f.friendship_id}
                  friend={f}
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
