"use client";

import { useState } from "react";
import Image from "next/image";
import { Mic, Search, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const CONVERSATIONS = [
  {
    id: "1",
    name: "John Smith",
    preview: "I am a final-year medical...",
    avatar: "/images/logo.png",
  },
  {
    id: "2",
    name: "Admin",
    preview: "I am a final-year medical...",
    avatar: "/images/logo.png",
  },
  {
    id: "3",
    name: "John Smith",
    preview: "I am a final-year medical...",
    avatar: "/images/logo.png",
  },
  {
    id: "4",
    name: "John Smith",
    preview: "I am a final-year medical...",
    avatar: "/images/logo.png",
  },
  {
    id: "5",
    name: "John Smith",
    preview: "I am a final-year medical...",
    avatar: "/images/logo.png",
  },
];

const MESSAGES = [
  {
    id: "1",
    sender: "me",
    text: "I am a final-year medical student who is very interested in cardiology. I have completed my internal",
    time: "10: 32 AM",
  },
  {
    id: "2",
    sender: "other",
    text: "I am a final-year medical student who is very interested in cardiology. I have completed my internal",
    time: "10: 32 AM",
  },
  {
    id: "3",
    sender: "me",
    text: "I am a final-year medical student who is very interested in cardiology. I have completed my internal",
    time: "10: 32 AM",
  },
] as const;

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState("2");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const activeConversation = CONVERSATIONS.find(
    (conversation) => conversation.id === activeConversationId
  );

  const filteredConversations = CONVERSATIONS.filter((conversation) =>
    conversation.name.toLowerCase().includes(search.toLowerCase())
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
          {filteredConversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;

            return (
              <button
                key={conversation.id}
                onClick={() => {
                  setActiveConversationId(conversation.id);
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
                  <Image
                    src={conversation.avatar}
                    alt={conversation.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute text-xs font-semibold text-brand-navy">
                    {conversation.name.charAt(0)}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#3b4349]">
                    {conversation.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#b1b7bd]">
                    {conversation.preview}
                  </p>
                </div>
              </button>
            );
          })}
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
              <Image
                src={activeConversation.avatar}
                alt={activeConversation.name}
                fill
                className="object-cover"
              />
              <span className="absolute text-xs font-semibold text-brand-navy">
                {activeConversation.name.charAt(0)}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#3b4349]">
              {activeConversation.name}
            </p>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto px-1 py-4 sm:space-y-6 sm:px-2 sm:py-5">
          {MESSAGES.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3",
                item.sender === "me" ? "justify-end" : "justify-start"
              )}
            >
              {item.sender === "other" && (
                <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gray">
                  <Image
                    src="/images/logo.png"
                    alt="Ahmed Rahmin"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute text-[10px] font-semibold text-brand-navy">
                    A
                  </span>
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-[10px] px-3 py-3 text-sm leading-[1.6] sm:max-w-[360px] sm:px-4",
                  item.sender === "me"
                    ? "bg-[#163f3a] text-white"
                    : "bg-[#2f2f2f] text-white"
                )}
              >
                <p>{item.text}</p>
                <p className="mt-2 text-right text-[11px] text-white/70">{item.time}</p>
              </div>

              {item.sender === "me" && (
                <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gray">
                  <Image
                    src="/images/logo.png"
                    alt="John Smith"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute text-[10px] font-semibold text-brand-navy">
                    J
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-[#eef2f4] px-1 pt-4 sm:px-2">
          <div className="flex items-center gap-2 rounded-[14px] bg-[#fafafa] px-3 py-3 sm:gap-3 sm:px-4">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Asked Anythings"
              className="flex-1 bg-transparent text-sm text-brand-navy outline-none placeholder:text-[#b1b7bd]"
            />
            <button className="hidden text-[#7c858d] transition-colors hover:text-brand-navy sm:block">
              <Mic size={16} />
            </button>
            <button
              onClick={() => {
                if (message.trim()) {
                  setMessage("");
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2ABFBF] text-white transition-all hover:bg-[#219a9a]"
            >
              <SendHorizontal size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
