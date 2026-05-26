import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tokenManager } from "../api/apiutils";

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

type ChatMode = "global" | number;

const API_URL = import.meta.env.VITE_API_URL;

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  return sameDay
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0] ?? "")
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
      className="flex shrink-0 items-center justify-center rounded-full font-black text-white select-none"
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

function buildWsUrl(mode: ChatMode): string {
  const token = tokenManager.getToken();
  const apiBase = new URL(API_URL);
  const protocol = apiBase.protocol === "https:" ? "wss:" : "ws:";
  const base = `${protocol}//${apiBase.host}`;

  if (mode === "global") {
    return `${base}/api/v1/ws/chat?token=${token}`;
  }

  return `${base}/api/v1/ws/chat/${mode}?token=${token}`;
}

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
      className={`mb-2 flex items-end gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="w-[34px] shrink-0">
        {showAvatar && !isOwn && <Avatar name={msg.sender_name} size={34} />}
      </div>

      <div
        className={`flex max-w-[72%] flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
      >
        {showAvatar && !isOwn && (
          <span className="ml-1 text-[11px] text-[#aaa]">
            {msg.sender_name}{" "}
            <span className="opacity-60">@{msg.sender_username}</span>
          </span>
        )}

        <div
          className={`break-words rounded-[18px] px-4 py-2.5 text-[15px] leading-[1.45] ${
            isOwn
              ? "rounded-br-[4px] bg-[#f2c200] text-[#4a3500]"
              : "rounded-bl-[4px] border-2 border-[#ece7dd] bg-white text-[#222]"
          }`}
        >
          {msg.content}
        </div>

        <span className="px-1 text-[10px] text-[#ccc]">
          {formatTime(msg.created_at)}
        </span>
      </div>
    </div>
  );
}

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
      className={`flex w-full items-center gap-3 rounded-[14px] border-2 px-3 py-2.5 text-left transition-all ${
        active
          ? "border-[#f2c200] bg-[#fff8d9]"
          : "border-transparent hover:bg-[#faf7f0]"
      }`}
    >
      <Avatar name={label} size={38} gold={gold} />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[14px] font-bold ${active ? "text-[#9a6e00]" : "text-[#222]"}`}
        >
          {label}
        </p>
        {sub && <p className="truncate text-[11px] text-[#bbb]">@{sub}</p>}
      </div>
    </button>
  );
}

export const ChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const myId = useRef<number | null>(null);
  const [myNickname, setMyNickname] = useState("");
  const [mode, setMode] = useState<ChatMode>("global");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) {
      navigate("/auth");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    void Promise.all([
      fetch(`${API_URL}/api/v1/me`, { headers }).then((response) =>
        response.json(),
      ),
      fetch(`${API_URL}/api/v1/community/friends`, { headers }).then(
        (response) => response.json(),
      ),
    ]).then(([me, friendsData]) => {
      myId.current = me.id;
      setMyNickname(me.nickname ?? me.username);
      setFriends(friendsData.friends ?? []);
    });
  }, [navigate]);

  useEffect(() => {
    if (!tokenManager.getToken()) return;

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    setConnected(false);
    setMessages([]);

    const ws = new WebSocket(buildWsUrl(mode));
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "history") {
          setMessages(data.messages ?? []);
        } else if (data.type === "message") {
          setMessages((prev) => {
            if (prev.some((message) => message.id === data.message.id)) {
              return prev;
            }
            return [...prev, data.message];
          });
        }
      } catch {
        // ignore malformed message
      }
    };

    ws.onclose = () => {
      setConnected(false);
      reconnectTimerRef.current = setTimeout(() => {
        if (wsRef.current === ws) {
          wsRef.current = null;
          setMode((current) => current);
        }
      }, 3000);
    };

    ws.onerror = () => ws.close();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      ws.onclose = null;
      ws.close();
    };
  }, [mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(() => {
    const content = input.trim();
    if (
      !content ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    wsRef.current.send(JSON.stringify({ content }));
    setInput("");
    inputRef.current?.focus();
  }, [input]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const peerFriend =
    mode !== "global" ? friends.find((friend) => friend.user.id === mode) : null;

  const chatTitle =
    mode === "global"
      ? t("chat.globalChat")
      : (peerFriend?.user.nickname ?? `User #${mode}`);

  const enrichedMessages = messages.map((msg, index) => {
    const previous = messages[index - 1];
    return {
      msg,
      showAvatar: !previous || previous.sender_id !== msg.sender_id,
    };
  });

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-[#faf7f0]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-[60px] z-30 flex h-[calc(100vh-60px)] w-[270px] shrink-0
          flex-col border-r-2 border-[#ece7dd] bg-white transition-transform duration-200
          md:static md:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="border-b-2 border-[#ece7dd] px-4 pb-3 pt-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#9a8c6e]">
            {t("chat.channels")}
          </p>
          <SidebarItem
            label={t("chat.globalChat")}
            active={mode === "global"}
            onClick={() => {
              setMode("global");
              setSidebarOpen(false);
            }}
            gold
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#9a8c6e]">
            {t("chat.directMessages")}
          </p>

          {friends.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[13px] text-[#bbb]">{t("chat.noFriendsYet")}</p>
              <button
                onClick={() => navigate("/community")}
                className="mt-3 text-[13px] font-semibold text-[#f2c200] underline underline-offset-2"
              >
                {t("chat.findPeople")}
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {friends.map((friend) => (
                <SidebarItem
                  key={friend.user.id}
                  label={friend.user.nickname}
                  sub={friend.user.username}
                  active={mode === friend.user.id}
                  onClick={() => {
                    setMode(friend.user.id);
                    setSidebarOpen(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b-2 border-[#ece7dd] bg-white px-4 py-3">
          <button
            className="rounded-[8px] border-2 border-[#ece7dd] p-1.5 text-[#bbb] hover:text-[#f2c200] md:hidden"
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

          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            {mode === "global" ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff8d9]">
                <span className="text-[18px]">🌐</span>
              </div>
            ) : (
              <Avatar name={chatTitle} size={36} />
            )}
            <div className="min-w-0">
              <p className="truncate text-[16px] font-bold text-[#111]">
                {chatTitle}
              </p>
              {mode === "global" && (
                <p className="text-[11px] text-[#aaa]">
                  {t("chat.everyoneCanSeeThis")}
                </p>
              )}
              {mode !== "global" && peerFriend && (
                <p className="text-[11px] text-[#aaa]">
                  @{peerFriend.user.username}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full transition-colors ${
                connected ? "bg-[#22c55e]" : "animate-pulse bg-[#f87171]"
              }`}
            />
            <span className="hidden text-[11px] text-[#bbb] sm:block">
              {connected ? t("chat.connected") : t("chat.connecting")}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-0 overflow-y-auto px-4 py-4">
          {messages.length === 0 && connected && (
            <div className="flex h-full flex-col items-center justify-center gap-3 opacity-50">
              <span className="text-5xl">{mode === "global" ? "🌐" : "💬"}</span>
              <p className="text-[16px] text-[#bbb]">
                {mode === "global"
                  ? t("chat.beFirst")
                  : t("chat.startConversation", { name: chatTitle })}
              </p>
            </div>
          )}

          {!connected && messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#f2c200] border-t-transparent" />
            </div>
          )}

          {enrichedMessages.map(({ msg, showAvatar }) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isOwn={msg.sender_id === myId.current}
              showAvatar={showAvatar}
            />
          ))}

          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t-2 border-[#ece7dd] bg-white px-4 py-3">
          <div className="mx-auto flex max-w-[860px] items-end gap-2">
            {myNickname && <Avatar name={myNickname} size={34} gold />}

            <div className="flex flex-1 items-end gap-2 rounded-[18px] border-2 border-[#ece7dd] bg-[#faf7f0] px-4 py-2 transition-colors focus-within:border-[#f2c200]">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  connected
                    ? mode === "global"
                      ? t("chat.messageGlobal")
                      : t("chat.messageUser", { name: chatTitle })
                    : t("chat.connecting")
                }
                disabled={!connected}
                rows={1}
                className="max-h-[140px] flex-1 resize-none bg-transparent text-[15px] leading-[1.45] text-[#222] outline-none placeholder:text-[#ccc] disabled:opacity-50"
                style={{ scrollbarWidth: "none" }}
                onInput={(event) => {
                  const element = event.currentTarget;
                  element.style.height = "auto";
                  element.style.height = `${Math.min(element.scrollHeight, 140)}px`;
                }}
              />
            </div>

            <button
              onClick={send}
              disabled={!connected || !input.trim()}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#f2c200] text-white shadow-[0_4px_14px_rgba(242,194,0,0.35)] transition-all hover:bg-[#e0b000] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
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

          <p className="mt-2 text-center text-[11px] text-[#ddd]">
            {t("chat.enterToSend")}
          </p>
        </div>
      </div>
    </div>
  );
};
