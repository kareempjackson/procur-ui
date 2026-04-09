"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import type { BotMessage, QuickReply } from "@/hooks/useBotConversation";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
  messages: BotMessage[];
  onSend: (text: string) => void;
  onQuickReply: (reply: QuickReply) => void;
  onClose: () => void;
  onReset: () => void;
  visible: boolean;
}

export default function ChatWindow({ messages, onSend, onQuickReply, onClose, onReset, visible }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when window opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div
      className="bot-chat-window"
      style={{
        position: "fixed",
        bottom: 92,
        right: 24,
        zIndex: 50,
        width: 380,
        height: 520,
        borderRadius: 18,
        background: "#fff",
        boxShadow: "0 8px 40px rgba(0,0,0,.15), 0 2px 8px rgba(0,0,0,.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Urbanist', system-ui, sans-serif",
        animation: visible ? "bot-window-enter 0.25s ease-out forwards" : "bot-window-exit 0.2s ease-in forwards",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#407178",
          color: "#fff",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Procur Assistant</div>
            <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.2, marginTop: 2 }}>We help you find what you need</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={onReset}
            aria-label="New conversation"
            title="New conversation"
            style={{
              background: "rgba(255,255,255,.15)",
              border: "none",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.15)";
            }}
          >
            <ArrowPathIcon style={{ width: 16, height: 16 }} />
          </button>
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{
              background: "rgba(255,255,255,.15)",
              border: "none",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.15)";
            }}
          >
            <XMarkIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 14px",
          background: "#fafaf9",
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isLatest={i === messages.length - 1}
            onQuickReply={onQuickReply}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ──────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "12px 14px",
          borderTop: "1px solid #f0eee9",
          background: "#fff",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            height: 40,
            borderRadius: 9999,
            border: "1.5px solid #e5e2da",
            padding: "0 16px",
            fontSize: 14,
            fontFamily: "'Urbanist', system-ui, sans-serif",
            outline: "none",
            transition: "border-color 0.15s",
            background: "#faf8f4",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#407178";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e5e2da";
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send message"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: input.trim() ? "#CB5927" : "#d1d5db",
            color: "#fff",
            border: "none",
            cursor: input.trim() ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
        >
          <PaperAirplaneIcon style={{ width: 18, height: 18 }} />
        </button>
      </form>
    </div>
  );
}
