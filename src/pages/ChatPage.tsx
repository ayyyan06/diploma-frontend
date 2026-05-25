import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { tokenManager } from "../api/apiutils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_username: string;
  recipient_id: number | null;
  content: string;
  created_at: string;
}

interface Friend {
  friendship_id: number;
  user: { id: number; username: string; nickname: string };
  since: string;
}

type ChatMode = "global" | number; // number = peer user_id

const API_URL = import.meta.env.VITE_API_URL;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " " +
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function Avatar({
  name,
  size = 36,
  gold = false,
}: {
  name: string;
  size?: number;
  gold?: boolean;
}) {
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-full font-black text-white select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: gold
          ? "linear-gradient(135deg,#f2c200 0%,#e09900 100%)"
          : "linear-gradient(135deg,#a78bfa 0%,#7c3aed 100%)",
      }}
    >
      {getInitials(name)}
    </div>
  );
}

// ── WS URL builder ────────────────────────────────────────────────────────────

function buildWsUrl(mode: ChatMode): string {
  const token = tokenManager.getToken();
  const apiBase = new URL(API_URL);
  const proto = apiBase.protocol === "https:" ? "wss:" : "ws:";
  const base = `${proto}//${apiBase.host}`;
  if (mode === "global") return `${base}/api/v1/ws/chat?token=${token}`;
  return `${base}/api/v1/ws/chat/${mode}?token=${token}`;
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isOwn,
  showAvatar,
}: {
  msg: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
}) {
  return (
    <div
      className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"} items-end mb-2`}
    >
      {/* Avatar placeholder — keeps alignment consistent */}
      <div className="w-[34px] shrink-0">
        {showAvatar && !isOwn && <Avatar name={msg.sender_name} size={34} />}
      </div>

      <div
        className={`max-w-[72%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-0.5`}
      >
        {showAvatar && !isOwn && (
          <span className="text-[11px] text-[#aaa] ml-1">
            {msg.sender_name}{" "}
            <span className="opacity-60">@{msg.sender_username}</span>
          </span>
        )}

        <div
          className={`rounded-[18px] px-4 py-2.5 text-[15px] leading-[1.45] break-words ${
            isOwn
              ? "rounded-br-[4px] bg-[#f2c200] text-[#4a3500]"
              : "rounded-bl-[4px] bg-white border-2 border-[#ece7dd] text-[#222]"
          }`}
        >
          {msg.content}
        </div>

        <span className="text-[10px] text-[#ccc] px-1">
          {formatTime(msg.created_at)}
        </span>
      </div>
    </div>
  );
}

// ── Sidebar item ──────────────────────────────────────────────────────────────

function SidebarItem({
  label,
  sub,
  active,
  onClick,
  gold,
}: {
  label: string;
  sub?: string;
  active: boolean;
  onClick: () => void;
  gold?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-left transition-all ${
        active
          ? "bg-[#fff8d9] border-2 border-[#f2c200]"
          : "border-2 border-transparent hover:bg-[#faf7f0]"
      }`}
    >
      <Avatar name={label} size={38} gold={gold} />
      <div className="min-w-0 flex-1">
        <p
          className={`text-[14px] font-bold truncate ${active ? "text-[#9a6e00]" : "text-[#222]"}`}
        >
          {label}
        </p>
        {sub && <p className="text-[11px] text-[#bbb] truncate">@{sub}</p>}
      </div>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export const ChatPage = () => {
  const navigate = useNavigate();
  // current user
  const myId = useRef<number | null>(null);
  const [myNickname, setMyNickname] = useState<string>("");

  // chat state
  const [mode, setMode] = useState<ChatMode>("global");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // ── Fetch me + friends ──────────────────────────────────────────────────────

  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) {
      navigate("/auth");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/api/v1/me`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/v1/community/friends`, { headers }).then((r) =>
        r.json(),
      ),
    ]).then(([me, fr]) => {
      myId.current = me.id;
      setMyNickname(me.nickname ?? me.username);
      setFriends(fr.friends ?? []);
    });
  }, [navigate]);

  // ── Open / re-open WebSocket when mode changes ──────────────────────────────

  useEffect(() => {
    if (!tokenManager.getToken()) return;

    // Close previous connection
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
    setMessages([]);

    const ws = new WebSocket(buildWsUrl(mode));
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "history") {
          setMessages(data.messages ?? []);
        } else if (data.type === "message") {
          setMessages((prev) => {
            // Дедупликация: не добавляем если уже есть с тем же id
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }
      } catch {
        // ignore
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // Пробуем переподключиться через 3 сек
      const timer = setTimeout(() => {
        if (wsRef.current === ws) {
          wsRef.current = null;
          setMode((m) => m); // trigger re-run
        }
      }, 3000);
      return () => clearTimeout(timer);
    };

    ws.onerror = () => ws.close();

    return () => {
      ws.onclose = null;
      ws.close();
    };
  }, [mode]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send ────────────────────────────────────────────────────────────────────

  const send = useCallback(() => {
    const content = input.trim();
    if (
      !content ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    )
      return;
    wsRef.current.send(JSON.stringify({ content }));
    setInput("");
    inputRef.current?.focus();
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ── Render helpers ──────────────────────────────────────────────────────────

  const peerFriend =
    mode !== "global" ? friends.find((f) => f.user.id === mode) : null;

  const chatTitle =
    mode === "global"
      ? "Global Chat"
      : (peerFriend?.user.nickname ?? `User #${mode}`);

  // Group messages: show avatar only for first in a run from same sender
  const enriched = messages.map((msg, i) => {
    const prev = messages[i - 1];
    const showAvatar = !prev || prev.sender_id !== msg.sender_id;
    return { msg, showAvatar };
  });

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-[#faf7f0]">
      {/* ── Sidebar overlay (mobile) ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed md:static z-30 md:z-auto top-[60px] left-0 h-[calc(100vh-60px)]
          w-[270px] shrink-0 flex flex-col border-r-2 border-[#ece7dd] bg-white
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar header */}
        <div className="px-4 pt-5 pb-3 border-b-2 border-[#ece7dd]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#9a8c6e] mb-3">
            Channels
          </p>
          <SidebarItem
            label="Global Chat"
            active={mode === "global"}
            onClick={() => {
              setMode("global");
              setSidebarOpen(false);
            }}
            gold
          />
        </div>

        {/* DMs */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#9a8c6e] mb-3">
            Direct Messages
          </p>
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[13px] text-[#bbb]">No friends yet.</p>
              <button
                onClick={() => navigate("/community")}
                className="mt-3 text-[13px] font-semibold text-[#f2c200] underline underline-offset-2"
              >
                Find people
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {friends.map((f) => (
                <SidebarItem
                  key={f.user.id}
                  label={f.user.nickname}
                  sub={f.user.username}
                  active={mode === f.user.id}
                  onClick={() => {
                    setMode(f.user.id);
                    setSidebarOpen(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Chat pane ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b-2 border-[#ece7dd] shrink-0">
          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-1.5 rounded-[8px] border-2 border-[#ece7dd] text-[#bbb] hover:text-[#f2c200]"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="2" y1="5" x2="16" y2="5" />
              <line x1="2" y1="9" x2="16" y2="9" />
              <line x1="2" y1="13" x2="16" y2="13" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {mode === "global" ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff8d9]">
                <span className="text-[18px]">🌐</span>
              </div>
            ) : (
              <Avatar name={chatTitle} size={36} />
            )}
            <div className="min-w-0">
              <p className="text-[16px] font-bold text-[#111] truncate">
                {chatTitle}
              </p>
              {mode === "global" && (
                <p className="text-[11px] text-[#aaa]">Everyone can see this</p>
              )}
              {mode !== "global" && peerFriend && (
                <p className="text-[11px] text-[#aaa]">
                  @{peerFriend.user.username}
                </p>
              )}
            </div>
          </div>

          {/* Connection dot */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={`h-2 w-2 rounded-full transition-colors ${
                connected ? "bg-[#22c55e]" : "bg-[#f87171] animate-pulse"
              }`}
            />
            <span className="text-[11px] text-[#bbb] hidden sm:block">
              {connected ? "Connected" : "Connecting…"}
            </span>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0">
          {messages.length === 0 && connected && (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
              <span className="text-5xl">
                {mode === "global" ? "🌐" : "💬"}
              </span>
              <p className="text-[16px] text-[#bbb]">
                {mode === "global"
                  ? "Be the first to say something!"
                  : `Start a conversation with ${chatTitle}`}
              </p>
            </div>
          )}

          {!connected && messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#f2c200] border-t-transparent" />
            </div>
          )}

          {enriched.map(({ msg, showAvatar }) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isOwn={msg.sender_id === myId.current}
              showAvatar={showAvatar}
            />
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="shrink-0 bg-white border-t-2 border-[#ece7dd] px-4 py-3">
          <div className="flex items-end gap-2 max-w-[860px] mx-auto">
            {myNickname && <Avatar name={myNickname} size={34} gold />}

            <div className="flex-1 flex items-end gap-2 rounded-[18px] border-2 border-[#ece7dd] bg-[#faf7f0] px-4 py-2 focus-within:border-[#f2c200] transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  connected
                    ? mode === "global"
                      ? "Message global chat…"
                      : `Message ${chatTitle}…`
                    : "Connecting…"
                }
                disabled={!connected}
                rows={1}
                className="flex-1 resize-none bg-transparent text-[15px] text-[#222] placeholder:text-[#ccc] outline-none leading-[1.45] max-h-[140px] disabled:opacity-50"
                style={{ scrollbarWidth: "none" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 140) + "px";
                }}
              />
            </div>

            <button
              onClick={send}
              disabled={!connected || !input.trim()}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#f2c200] text-white shadow-[0_4px_14px_rgba(242,194,0,0.35)] transition-all hover:bg-[#e0b000] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 9L16 2L9 16L8 10L2 9Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <p className="text-center text-[11px] text-[#ddd] mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};
