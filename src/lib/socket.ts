import { io, type Socket } from "socket.io-client";

type Listener<T> = (payload: T) => void;

export interface ChatMessage {
  id?: string;
  _id?: string;
  senderId?: string | { _id?: string; id?: string; email?: string };
  conversationId: string;
  content: string;
  attachments?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatReadReceipt {
  conversationId: string;
}

export interface RealtimeNotification {
  id?: string;
  _id?: string;
  title?: string;
  message?: string;
  receiver?: string;
  read?: boolean;
  type?: string;
  createdAt?: string;
}

function normalizeSocketUrl(rawUrl?: string) {
  const fallback = "https://server.lumieramed.com";
  console.log("🔍 Debug: normalizeSocketUrl called");
  const trimmed = (rawUrl ?? fallback).trim().replace(/\/+$/, "");
  console.log("🔍 Debug: Raw socket URL:", rawUrl);
  if (trimmed.endsWith("/api/v1")) {
    return trimmed.replace(/\/api\/v1$/, "");
  }
  return trimmed;
}

const SOCKET_URL = normalizeSocketUrl(
  process.env.NEXT_PUBLIC_SOCKET_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_BACKEND_URL,
);

class SocketManager {
  private socket: Socket | null = null;
  private currentConversationId: string | null = null;

  connect(token: string) {
    if (!token) {
      console.error("❌ Socket: No token provided");
      return null;
    }

    if (this.socket?.connected) {
      console.log("✅ Socket: Already connected");
      return this.socket;
    }

    // Disconnect stale socket if exists
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    console.log("🔌 Socket: Connecting to", SOCKET_URL);
    this.socket = io(SOCKET_URL, {
      query: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }

  onConnect(listener: Listener<void>) {
    this.socket?.on("connect", listener);
    return () => this.socket?.off("connect", listener);
  }

  onDisconnect(listener: Listener<string>) {
    this.socket?.on("disconnect", listener);
    return () => this.socket?.off("disconnect", listener);
  }

  onConnectError(listener: Listener<Error>) {
    this.socket?.on("connect_error", listener);
    return () => this.socket?.off("connect_error", listener);
  }

  onAuthError(listener: Listener<{ message?: string }>) {
    this.socket?.on("auth_error", listener);
    return () => this.socket?.off("auth_error", listener);
  }

  onNewMessage(listener: Listener<ChatMessage>) {
    this.socket?.on("newMessage", listener);
    return () => this.socket?.off("newMessage", listener);
  }

  onMessagesRead(listener: Listener<ChatReadReceipt>) {
    this.socket?.on("messagesRead", listener);
    return () => this.socket?.off("messagesRead", listener);
  }

  onNotification(listener: Listener<RealtimeNotification>) {
    this.socket?.on("notification", listener);
    return () => this.socket?.off("notification", listener);
  }

  joinConversation(conversationId: string) {
    if (!this.socket || !conversationId) return;

    if (
      this.currentConversationId &&
      this.currentConversationId !== conversationId
    ) {
      this.socket.emit("leaveConversation", this.currentConversationId);
    }

    this.socket.emit("joinConversation", conversationId);
    this.currentConversationId = conversationId;
  }

  leaveConversation(conversationId?: string) {
    const id = conversationId || this.currentConversationId;
    if (!this.socket || !id) return;

    this.socket.emit("leaveConversation", id);
    if (this.currentConversationId === id) {
      this.currentConversationId = null;
    }
  }

  sendMessage(
    conversationId: string,
    content: string,
    attachments: unknown[] = [],
  ) {
    if (!this.socket || !conversationId || !content.trim()) {
      console.error("❌ Socket: Cannot send message");
      return false;
    }

    this.socket.emit("sendMessage", {
      conversationId,
      content: content.trim(),
      attachments,
    });
    return true;
  }

  markAsRead(conversationId: string) {
    if (!this.socket || !conversationId) return;
    this.socket.emit("markAsRead", { conversationId });
  }

  disconnect() {
    if (!this.socket) return;
    if (this.currentConversationId) {
      this.socket.emit("leaveConversation", this.currentConversationId);
      this.currentConversationId = null;
    }
    this.socket.disconnect();
    this.socket = null;
  }
}

const socketManager = new SocketManager();
export { SOCKET_URL, socketManager };