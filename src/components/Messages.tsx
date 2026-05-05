"use client";

import { useState, useEffect, useRef } from "react";
import { Search, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getConversations, getConversationMessages, type Conversation, type Message } from "@/lib/api";
import { socketManager, type ChatMessage } from "@/lib/socket";
import { getAccessToken, getCurrentUserId } from "@/lib/auth";

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      socketManager.connect(token);
      
      // Listen for connection events
      const handleConnect = () => {
        setIsConnected(true);
        console.log("Socket connected");
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      };

      const handleConnectError = (error: Error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      };

      // Listen for new messages
      const handleNewMessage = (chatMessage: ChatMessage) => {
        if (chatMessage.conversationId === activeConversationId) {
          // Convert ChatMessage to Message format and add to messages
          const newMessage: Message = {
            _id: chatMessage.id || chatMessage._id || Date.now().toString(),
            conversationId: chatMessage.conversationId,
            senderId: chatMessage.senderId || "",
            content: chatMessage.content,
            timestamp: chatMessage.createdAt || new Date().toISOString(),
            senderName: chatMessage.senderId === "me" ? "Me" : "Other",
            isRead: false,
            createdAt: chatMessage.createdAt || new Date().toISOString(),
            updatedAt: chatMessage.updatedAt || new Date().toISOString(),
          };
          
          setMessages(prev => [...prev, newMessage]);
          
          // Scroll to bottom when new message arrives
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      };

      // Set up event listeners
      socketManager.onConnect(handleConnect);
      socketManager.onDisconnect(handleDisconnect);
      socketManager.onConnectError(handleConnectError);
      socketManager.onNewMessage(handleNewMessage);

      return () => {
        // Clean up listeners
        socketManager.onConnect(() => {});
        socketManager.onDisconnect(() => {});
        socketManager.onConnectError(() => {});
        socketManager.onNewMessage(() => {});
      };
    }
  }, [activeConversationId]);

  // Load conversation messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      const loadMessages = async () => {
        setMessagesLoading(true);
        try {
          const result = await getConversationMessages(activeConversationId);
          setMessages(result.data);
        } catch (err) {
          console.error("Failed to load messages:", err);
        } finally {
          setMessagesLoading(false);
        }
      };

      loadMessages();
    }
  }, [activeConversationId]);

  // Join/leave conversation when active conversation changes
  useEffect(() => {
    if (activeConversationId && isConnected) {
      socketManager.joinConversation(activeConversationId);
      
      return () => {
        socketManager.leaveConversation(activeConversationId);
      };
    }
  }, [activeConversationId, isConnected]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketManager.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      setError("");

      try {
        const result = await getConversations();
        setConversations(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load conversations."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  // Handle sending messages
  const handleSendMessage = () => {
    if (!message.trim() || !activeConversationId || !isConnected) return;

    const messageContent = message.trim();
    const currentUserId = getCurrentUserId();
    
    // Add message to UI immediately for better UX
    const newMessage: Message = {
      _id: Date.now().toString(), // Temporary ID
      conversationId: activeConversationId,
      senderId: currentUserId || "me",
      content: messageContent,
      timestamp: new Date().toISOString(),
      senderName: "Me",
      senderEmail: "",
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message via socket
    socketManager.sendMessage(activeConversationId, messageContent);
    
    // Clear input
    setMessage("");
  };

  // Handle Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeConversation = conversations.find(
    (conversation) => conversation._id === activeConversationId
  );

  const filteredConversations = conversations.filter((conversation) =>
    (conversation.participantName || conversation.participantEmail || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto flex h-auto min-h-[calc(100vh-10rem)] w-full max-w-[1120px] flex-col gap-4 lg:h-[calc(100vh-10rem)] lg:flex-row">
      <section
        className={cn(
          "flex flex-col rounded-[22px] bg-white p-4 shadow-soft lg:w-[320px] lg:flex-shrink-0",
          showChatOnMobile ? "hidden lg:flex" : "flex"
        )}
      >
        <div className="mb-4">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b1b8be]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Name, ..."
              className="h-11 w-full rounded-[14px] bg-[#fafafa] pl-10 pr-4 text-sm text-brand-navy outline-none placeholder:text-[#b1b8be] focus:ring-2 focus:ring-brand-teal/20"
            />
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex w-full items-start gap-3 rounded-[12px] border bg-white p-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 font-medium">No conversations found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isActive = conversation._id === activeConversationId;
              const displayName = conversation.participantName || conversation.participantEmail || 'Unknown';

              return (
                <button
                  key={conversation._id}
                  onClick={() => {
                    setActiveConversationId(conversation._id);
                    setShowChatOnMobile(true);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[12px] border bg-white px-3 py-2.5 text-left transition-all",
                    isActive
                      ? "border-brand-teal/60 shadow-[0_0_0_1px_rgba(42,191,191,0.08)]"
                      : "border-transparent hover:border-[#edf0f2] hover:bg-[#fcfcfc]"
                  )}
                >
                  <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gray">
                    <div className="text-xs font-semibold text-brand-navy">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#3b4349]">
                      {displayName}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#b1b7bd]">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal text-xs font-medium text-white">
                      {conversation.unreadCount}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>

      <section
        className={cn(
          "min-w-0 flex-1 flex-col rounded-[22px] bg-white px-3 py-4 shadow-soft sm:px-4 md:px-5",
          showChatOnMobile ? "flex" : "hidden lg:flex"
        )}
      >
        {activeConversation && (
          <div className="flex items-center gap-3 border-b border-[#eef2f4] px-1 pb-4 sm:px-2">
            <button
              onClick={() => setShowChatOnMobile(false)}
              className="rounded-full px-2 py-1 text-xs font-medium text-brand-slate hover:bg-[#f5f7f8] lg:hidden"
            >
              Back
            </button>
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-gray">
              <div className="text-xs font-semibold text-brand-navy">
                {(activeConversation.participantName || activeConversation.participantEmail || 'Unknown').charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#3b4349]">
                {activeConversation.participantName || activeConversation.participantEmail || 'Unknown'}
              </p>
              <p className="truncate text-xs text-[#b1b7bd]">
                {new Date(activeConversation.lastMessageTime).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto px-1 py-4 sm:space-y-6 sm:px-2 sm:py-5">
          {activeConversation ? (
            !isConnected ? (
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium">Connecting...</p>
                <p className="text-gray-400 text-sm mt-1">Establishing secure connection</p>
              </div>
            ) : messagesLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium">Loading messages...</p>
                <p className="text-gray-400 text-sm mt-1">Please wait</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium">No messages yet</p>
                <p className="text-gray-400 text-sm mt-1">Start the conversation with a message</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => {
                  const currentUserId = getCurrentUserId();
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex items-start gap-3",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isMe && (
                        <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gray">
                          <div className="text-[10px] font-semibold text-brand-navy">
                            {(msg.senderName || msg.senderEmail || 'U').charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-[10px] px-3 py-3 text-sm leading-[1.6] sm:max-w-[360px] sm:px-4",
                          isMe
                            ? "bg-[#163f3a] text-white"
                            : "bg-[#2f2f2f] text-white"
                        )}
                      >
                        <p>{msg.content}</p>
                        <p className="mt-2 text-right text-[11px] text-white/70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {isMe && (
                        <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gray">
                          <div className="text-[10px] font-semibold text-brand-navy">
                            ME
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500 font-medium">Select a conversation to start messaging</p>
            </div>
          )}
        </div>

        {activeConversation && (
          <div className="border-t border-[#eef2f4] px-1 py-3 sm:px-2 sm:py-4">
            <div className="flex items-center gap-2 rounded-[14px] bg-[#fafafa] px-3 py-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={!isConnected}
                className="flex-1 bg-transparent text-sm text-brand-navy outline-none placeholder:text-[#b1b8be] disabled:opacity-50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim() || !isConnected}
                className="rounded-lg bg-brand-teal p-2 text-white transition-all hover:bg-brand-teal/90 hover:scale-105 shadow-md shadow-brand-teal/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
            {!isConnected && (
              <p className="text-xs text-gray-400 mt-2 text-center">Reconnecting...</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
