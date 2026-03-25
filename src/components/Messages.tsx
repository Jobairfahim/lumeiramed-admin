"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import type { Message, Contact } from "@/types";
import { Avatar } from "./ui";
import { Icon } from "./Icon";

const CONTACTS: Contact[] = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  name: "John Smith",
  preview: "I am a final-year medical...",
  avatar: `https://i.pravatar.cc/40?img=${10 + i}`,
}));

const SAMPLE =
  "I am a final-year medical student who is very interested in cardiology. I have completed my internal";

const INITIAL_MESSAGES: Message[] = [
  { id: 1, from: "me",   text: SAMPLE, time: "10:32 AM" },
  { id: 2, from: "them", text: SAMPLE, time: "10:32 AM" },
  { id: 3, from: "me",   text: SAMPLE, time: "10:32 AM" },
];

export function Messages() {
  const [activeId, setActiveId] = useState(0);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now(), from: "me", text, time }]);
    setInput("");
    // Simulated reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "them",
          text: "Thank you for reaching out. We will get back to you shortly.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1100);
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const active = CONTACTS.find(c => c.id === activeId);

  return (
    <div
      className="flex rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
      style={{ height: "calc(100vh - 130px)" }}
    >
      {/* Contact sidebar */}
      <aside className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-gray-50">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search Name, ..."
              className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-700"
              value={contactSearch}
              onChange={e => setContactSearch(e.target.value)}
            />
          </div>
        </div>

        <ul className="flex-1 overflow-auto">
          {filteredContacts.map(contact => {
            const isActive = activeId === contact.id;
            return (
              <li key={contact.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(contact.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 ${isActive ? "bg-teal-50 border-r-2 border-teal-500" : ""}`}
                >
                  <Avatar size="w-10 h-10" src={contact.avatar} alt={contact.name} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold leading-tight ${isActive ? "text-teal-700" : "text-gray-800"}`}>
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{contact.preview}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-white">
          <Avatar size="w-9 h-9" src={active?.avatar} alt={active?.name} />
          <div>
            <p className="font-semibold text-gray-800 text-sm leading-tight">{active?.name ?? "—"}</p>
            <p className="text-xs text-teal-500">Online</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button type="button" className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600" aria-label="Call">
              <Icon path="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </button>
            <button type="button" className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600" aria-label="More">
              <Icon path="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto px-5 py-4 space-y-3" role="log" aria-live="polite">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
              {msg.from === "them" && (
                <Avatar size="w-8 h-8" src={active?.avatar} alt={active?.name} />
              )}
              <div className={`max-w-xs lg:max-w-sm rounded-2xl px-4 py-2.5 ${
                msg.from === "me"
                  ? "bg-teal-500 text-white rounded-br-sm"
                  : "bg-slate-800 text-white rounded-bl-sm"
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 text-right ${msg.from === "me" ? "text-teal-100" : "text-slate-400"}`}>
                  {msg.time}
                </p>
              </div>
              {msg.from === "me" && (
                <Avatar size="w-8 h-8" src="https://i.pravatar.cc/32?img=60" alt="Admin" />
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
          <button type="button" className="p-2 text-gray-400 hover:text-teal-500 hover:bg-teal-50 rounded-xl" aria-label="Attach image">
            <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </button>
          <input
            type="text"
            placeholder="Asked Anythings"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Message input"
          />
          <button type="button" className="p-2 text-gray-400 hover:text-teal-500 hover:bg-teal-50 rounded-xl" aria-label="Voice">
            <Icon path="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-10 h-10 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shadow-md shadow-teal-200/50 flex-shrink-0"
            aria-label="Send"
          >
            <Icon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
