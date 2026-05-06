"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Search, SendHorizontal, ArrowLeft, Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getConversationMessages,
  getStudentProfile,
  getUserConversations,
} from "@/lib/api";
import { socketManager, type ChatMessage } from "@/lib/socket";
import { getAccessToken } from "@/lib/auth";
import type {
  ConversationMessage,
  ConversationParticipant,
  ConversationSummary,
} from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type UiMessage = {
  id: string;
  localId?: string; // used to match optimistic messages to server echo
  sender: "me" | "other";
  text: string;
  time: string;
  pending?: boolean;
};

type UiConversation = {
  id: string;
  name: string;
  preview: string;
  email: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getParticipantId(
  participant?: ConversationParticipant | string | null,
) {
  if (!participant) return "";
  if (typeof participant === "string") return participant;
  return participant._id || participant.id || "";
}

function getParticipantName(participant?: ConversationParticipant | null) {
  if (!participant) return "Conversation";
  return (
    participant.fullName ||
    participant.name ||
    [participant.firstName, participant.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    participant.email ||
    "Conversation"
  );
}

function formatMessageTime(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return value ?? "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getSenderId(
  senderId?: ChatMessage["senderId"] | ConversationMessage["senderId"],
): string {
  if (!senderId) return "";
  if (typeof senderId === "string") return senderId;
  return senderId._id || senderId.id || "";
}

function isOwnMessage(
  messageSender: ChatMessage["senderId"] | ConversationMessage["senderId"],
  currentUserId: string,
): boolean {
  if (!messageSender || !currentUserId) return false;
  return getSenderId(messageSender) === currentUserId;
}

function mapConversation(
  conversation: ConversationSummary,
  currentUserId: string,
): UiConversation {
  const id =
    conversation._id || conversation.id || conversation.conversationId || "";
  const otherParticipant =
    conversation.participants?.find(
      (p) => getParticipantId(p) !== currentUserId,
    ) || conversation.participants?.[0];

  return {
    id,
    name:
      conversation.title ||
      conversation.name ||
      getParticipantName(otherParticipant),
    preview: conversation.lastMessage?.content || "No messages yet.",
    email: otherParticipant?.email || "",
  };
}

function mapMessage(
  message: ConversationMessage,
  currentUserId: string,
): UiMessage {
  return {
    id: message._id || message.id || `msg-${Date.now()}-${Math.random()}`,
    sender: isOwnMessage(message.senderId, currentUserId) ? "me" : "other",
    text: message.content || "",
    time: formatMessageTime(message.createdAt),
  };
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

function Avatar({
  email,
  name,
  size = 40,
}: {
  email: string;
  name: string;
  size?: number;
}) {
  const initial = email?.charAt(0)?.toUpperCase() || name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8f0ee]"
      style={{ width: size, height: size }}
    >
      <span
        className="select-none text-xs font-semibold text-[#163f3a]"
        style={{ fontSize: size * 0.3 }}
      >
        {initial}
      </span>
    </div>
  );
}

// ─── Connection Badge ─────────────────────────────────────────────────────────

function ConnectionBadge({
  state,
}: {
  state: "connecting" | "connected" | "disconnected";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-300",
        state === "connected" && "bg-emerald-50 text-emerald-700",
        state === "connecting" && "bg-amber-50 text-amber-700",
        state === "disconnected" && "bg-red-50 text-red-600",
      )}
    >
      {state === "connected" && <Wifi size={11} />}
      {state === "connecting" && (
        <Loader2 size={11} className="animate-spin" />
      )}
      {state === "disconnected" && <WifiOff size={11} />}
      <span>
        {state === "connected"
          ? "Connected"
          : state === "connecting"
            ? "Connecting…"
            : "Offline"}
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [conversations, setConversations] = useState<UiConversation[]>([]);
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, UiMessage[]>
  >({});
  const [activeConversationId, setActiveConversationId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs that don't trigger re-renders
  const activeConversationRef = useRef("");
  const tokenRef = useRef("");
  const currentUserIdRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep ref in sync with state
  useEffect(() => {
    activeConversationRef.current = activeConversationId;
  }, [activeConversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByConversation, activeConversationId]);

  // ── Socket + initial data setup ──────────────────────────────────────────

  useEffect(() => {
    const token = getAccessToken() ?? "";
    tokenRef.current = token;

    if (!token) {
      setLoadingConversations(false);
      setConnectionState("disconnected");
      setError("Please log in to use messaging.");
      return;
    }

    const loadInitialData = async () => {
      setLoadingConversations(true);

      const [profileResult, conversationsResult] = await Promise.all([
        getStudentProfile(),
        getUserConversations(),
      ]);

      if (profileResult.success) {
        const profile = profileResult.data;
        currentUserIdRef.current =
          profile.id ||
          (typeof profile.userId === "string"
            ? profile.userId
            : profile.userId?._id || "") ||
          "";
      } else {
        console.error("Failed to load user profile:", profileResult);
      }

      if (!conversationsResult.success) {
        setError(conversationsResult.error || conversationsResult.message);
        setLoadingConversations(false);
        return;
      }

      const mapped = conversationsResult.data
        .map((c) => mapConversation(c, currentUserIdRef.current))
        .filter((c) => c.id);

      setConversations(mapped);
      setActiveConversationId((cur) => cur || mapped[0]?.id || "");
      setLoadingConversations(false);
    };

    void loadInitialData();

    const socket = socketManager.connect(token);
    
    if (!socket) {
      setConnectionState("disconnected");
      setError("Could not establish socket connection.");
      return;
    }

    setConnectionState(socket.connected ? "connected" : "connecting");

    const cleanups = [
      socketManager.onConnect(() => {
        setConnectionState("connected");
        setError(null);
        // Rejoin active conversation on reconnect
        if (activeConversationRef.current) {
          socketManager.joinConversation(activeConversationRef.current);
        }
      }),

      socketManager.onDisconnect(() => {
        setConnectionState("disconnected");
      }),

      socketManager.onConnectError((err) => {
        setConnectionState("disconnected");
        setError(err.message || "Connection failed.");
      }),

      socketManager.onAuthError((err) => {
        setConnectionState("disconnected");
        setError(err.message || "Authentication error.");
      }),

      // ── FIX: skip own messages (already optimistically added) ──────────
      socketManager.onNewMessage((incoming: ChatMessage) => {
        const conversationId = incoming.conversationId;
        const content = incoming.content?.trim();
        if (!conversationId || !content) return;

        const incomingId =
          incoming.id ||
          incoming._id ||
          `${conversationId}-${Date.now()}-${Math.random()}`;

        const isMine = isOwnMessage(
          incoming.senderId,
          currentUserIdRef.current,
        );

        setMessagesByConversation((prev) => {
          const existing = prev[conversationId] ?? [];

          // Deduplicate: if we already have this exact server ID, skip
          if (existing.some((m) => m.id === incomingId)) return prev;

          // If it's our own message, replace the pending optimistic entry
          // (matched by text + pending flag) instead of adding a duplicate
          if (isMine) {
            const pendingIndex = existing.findIndex(
              (m) => m.pending && m.text === content,
            );
            if (pendingIndex !== -1) {
              const updated = [...existing];
              updated[pendingIndex] = {
                id: incomingId,
                sender: "me",
                text: content,
                time: formatMessageTime(incoming.createdAt),
                pending: false,
              };
              return { ...prev, [conversationId]: updated };
            }
            // No pending match — still add it (e.g. from another tab/device)
          }

          return {
            ...prev,
            [conversationId]: [
              ...existing,
              {
                id: incomingId,
                sender: isMine ? "me" : "other",
                text: content,
                time: formatMessageTime(incoming.createdAt),
              },
            ],
          };
        });

        // Update conversation preview
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === conversationId);
          if (exists) {
            return prev.map((c) =>
              c.id === conversationId ? { ...c, preview: content } : c,
            );
          }
          return [
            {
              id: conversationId,
              name: "New Conversation",
              preview: content,
              email: "",
            },
            ...prev,
          ];
        });
      }),
    ];

    return () => {
      cleanups.forEach((dispose) => dispose?.());
      socketManager.leaveConversation(activeConversationRef.current);
      socketManager.disconnect();
    };
  }, []);

  // ── Load messages when active conversation changes ───────────────────────

  useEffect(() => {
    if (!activeConversationId) return;

    const loadMessages = async () => {
      const token = tokenRef.current;
      if (!token) return;

      // Don't re-fetch if we already have messages loaded
      if (messagesByConversation[activeConversationId]) {
        socketManager.joinConversation(activeConversationId);
        socketManager.markAsRead(activeConversationId);
        return;
      }

      setLoadingMessages(true);
      const result = await getConversationMessages(activeConversationId);

      if (!result.success) {
        setError(result.message);
        setLoadingMessages(false);
        return;
      }

      setMessagesByConversation((prev) => ({
        ...prev,
        [activeConversationId]: result.data.map((m) =>
          mapMessage(m, currentUserIdRef.current),
        ),
      }));
      setLoadingMessages(false);
    };

    void loadMessages();
    socketManager.joinConversation(activeConversationId);
    socketManager.markAsRead(activeConversationId);

    return () => {
      socketManager.leaveConversation(activeConversationId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  // ── Derived state ────────────────────────────────────────────────────────

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId],
  );

  const filteredConversations = useMemo(
    () =>
      conversations.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [conversations, search],
  );

  const activeMessages = useMemo(
    () => messagesByConversation[activeConversationId] ?? [],
    [activeConversationId, messagesByConversation],
  );

  // ── Send message ─────────────────────────────────────────────────────────

  const handleSendMessage = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || !activeConversationId) return;

    // Optimistic update — mark as pending so we can match the server echo
    const optimisticId = `local-${Date.now()}-${Math.random()}`;

    setMessagesByConversation((prev) => ({
      ...prev,
      [activeConversationId]: [
        ...(prev[activeConversationId] ?? []),
        {
          id: optimisticId,
          sender: "me",
          text: trimmed,
          time: formatMessageTime(),
          pending: true,
        },
      ],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId ? { ...c, preview: trimmed } : c,
      ),
    );

    console.log("🔍 Debug: Sending message", { activeConversationId, trimmed, socketConnected: socketManager.isConnected() });
    const sent = socketManager.sendMessage(activeConversationId, trimmed);

    // If socket failed, mark message as non-pending (still show it)
    if (!sent) {
      setMessagesByConversation((prev) => {
        const msgs = prev[activeConversationId] ?? [];
        return {
          ...prev,
          [activeConversationId]: msgs.map((m) =>
            m.id === optimisticId ? { ...m, pending: false } : m,
          ),
        };
      });
    }

    setMessage("");
    inputRef.current?.focus();
  }, [message, activeConversationId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setShowChatOnMobile(true);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex h-auto min-h-[calc(100vh-10rem)] w-full max-w-[1120px] flex-col gap-4 lg:h-[calc(100vh-10rem)] lg:flex-row">

      {/* ── Sidebar: Conversation List ───────────────────────────────────── */}
      <section
        className={cn(
          "flex flex-col rounded-[22px] bg-white p-4 shadow-soft lg:w-[320px] lg:flex-shrink-0",
          showChatOnMobile ? "hidden lg:flex" : "flex",
        )}
      >
        {/* Search + status */}
        <div className="mb-4">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b1b8be]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="h-11 w-full rounded-[14px] bg-[#fafafa] pl-10 pr-4 text-sm text-brand-navy outline-none placeholder:text-[#b1b8be] focus:ring-2 focus:ring-brand-teal/20"
            />
          </div>

          <div className="mt-3 flex items-center justify-between px-1">
            <ConnectionBadge state={connectionState} />
            {error ? (
              <p className="max-w-[160px] truncate text-right text-[11px] text-red-500">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {loadingConversations ? (
            <div className="flex h-32 items-center justify-center gap-2 text-sm text-brand-muted">
              <Loader2 size={16} className="animate-spin" />
              Loading…
            </div>
          ) : null}

          {filteredConversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;
            return (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[14px] border px-3 py-3 text-left transition-all duration-150",
                  isActive
                    ? "border-brand-teal/40 bg-[#f0faf8] shadow-sm"
                    : "border-transparent bg-white hover:border-[#edf0f2] hover:bg-[#fafafa]",
                )}
              >
                <Avatar
                  email={conversation.email}
                  name={conversation.name}
                  size={42}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1e2b28]">
                    {conversation.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#9ba6a3]">
                    {conversation.preview}
                  </p>
                </div>
              </button>
            );
          })}

          {!loadingConversations && filteredConversations.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-brand-muted">
              No conversations found.
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Chat Pane ────────────────────────────────────────────────────── */}
      <section
        className={cn(
          "min-w-0 flex-1 flex-col rounded-[22px] bg-white shadow-soft",
          showChatOnMobile ? "flex" : "hidden lg:flex",
        )}
      >
        {/* Header */}
        {activeConversation ? (
          <div className="flex items-center gap-3 border-b border-[#f0f3f2] px-4 py-3.5 sm:px-5">
            <button
              onClick={() => setShowChatOnMobile(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f7f6] lg:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={18} className="text-[#4a5a57]" />
            </button>

            <Avatar
              email={activeConversation.email}
              name={activeConversation.name}
              size={38}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1e2b28]">
                {activeConversation.name}
              </p>
              <p className="text-[11px] text-[#9ba6a3]">
                {connectionState === "connected" ? "Online" : "Connecting…"}
              </p>
            </div>

            <ConnectionBadge state={connectionState} />
          </div>
        ) : (
          <div className="flex items-center gap-3 border-b border-[#f0f3f2] px-5 py-3.5">
            <button
              onClick={() => setShowChatOnMobile(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f7f6] lg:hidden"
            >
              <ArrowLeft size={18} className="text-[#4a5a57]" />
            </button>
            <p className="text-sm text-[#9ba6a3]">Select a conversation</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          {loadingMessages ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-brand-muted">
              <Loader2 size={16} className="animate-spin" />
              Loading messages…
            </div>
          ) : null}

          {!loadingMessages && activeMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-brand-muted">
              <div className="h-12 w-12 rounded-full bg-[#f0faf8] flex items-center justify-center">
                <SendHorizontal size={20} className="text-brand-teal" />
              </div>
              <p>No messages yet. Say hello!</p>
            </div>
          ) : null}

          <div className="space-y-4">
            {activeMessages.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-end gap-2.5",
                  item.sender === "me" ? "justify-end" : "justify-start",
                )}
              >
                {item.sender === "other" && (
                  <Avatar
                    email={activeConversation?.email || ""}
                    name={activeConversation?.name || ""}
                    size={32}
                  />
                )}

                <div
                  className={cn(
                    "max-w-[75%] rounded-[16px] px-4 py-3 text-sm leading-relaxed transition-opacity duration-200 sm:max-w-[360px]",
                    item.sender === "me"
                      ? "rounded-br-[4px] bg-[#163f3a] text-white"
                      : "rounded-bl-[4px] bg-[#f3f6f5] text-[#1e2b28]",
                    item.pending && "opacity-60",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{item.text}</p>
                  <p
                    className={cn(
                      "mt-1.5 text-right text-[10px]",
                      item.sender === "me"
                        ? "text-white/50"
                        : "text-[#9ba6a3]",
                    )}
                  >
                    {item.pending ? "Sending…" : item.time}
                  </p>
                </div>

                {item.sender === "me" && (
                  <Avatar
                    email="me@example.com"
                    name="Me"
                    size={32}
                  />
                )}
              </div>
            ))}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-[#f0f3f2] px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2 rounded-[16px] bg-[#f7f9f8] px-4 py-2.5 ring-1 ring-transparent transition-all focus-within:ring-brand-teal/30">
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeConversationId
                  ? "Type a message… (Enter to send)"
                  : "Select a conversation to start messaging"
              }
              disabled={!activeConversationId}
              className="flex-1 bg-transparent text-sm text-[#1e2b28] outline-none placeholder:text-[#b1b8be] disabled:cursor-not-allowed disabled:opacity-50"
            />

            
            <button
              onClick={handleSendMessage}
              disabled={
                !message.trim() ||
                !activeConversationId
              }
              className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white transition-all hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              aria-label="Send message"
            >
              <SendHorizontal size={15} />
            </button>
          </div>

          {connectionState === "disconnected" && (
            <p className="mt-2 text-center text-[11px] text-amber-600">
              You&apos;re offline. Messages will be sent when connection is restored.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}