"use client";

import type { BotMessage } from "@/hooks/useBotConversation";
import QuickReplyButtons from "./QuickReplyButtons";
import RequestSummaryCard from "./RequestSummaryCard";
import type { QuickReply } from "@/hooks/useBotConversation";

interface MessageBubbleProps {
  message: BotMessage;
  isLatest: boolean;
  onQuickReply: (reply: QuickReply) => void;
}

export default function MessageBubble({ message, isLatest, onQuickReply }: MessageBubbleProps) {
  const isBot = message.sender === "bot";

  // Typing indicator
  if (message.isTyping) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: "18px 18px 18px 4px",
            padding: "12px 18px",
            display: "flex",
            gap: 4,
            alignItems: "center",
          }}
        >
          <span className="bot-typing-dot" style={{ animationDelay: "0ms" }} />
          <span className="bot-typing-dot" style={{ animationDelay: "150ms" }} />
          <span className="bot-typing-dot" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isBot ? "flex-start" : "flex-end",
        marginBottom: 12,
      }}
    >
      {/* Text bubble */}
      <div
        style={{
          maxWidth: "82%",
          padding: "10px 16px",
          fontSize: 14,
          lineHeight: 1.55,
          fontFamily: "'Urbanist', system-ui, sans-serif",
          wordBreak: "break-word",
          ...(isBot
            ? {
                background: "#f3f4f6",
                color: "#1f2937",
                borderRadius: "18px 18px 18px 4px",
              }
            : {
                background: "#407178",
                color: "#fff",
                borderRadius: "18px 18px 4px 18px",
              }),
        }}
      >
        {message.text}
      </div>

      {/* Submitted request number */}
      {message.submittedRequestNumber && (
        <div
          style={{
            marginTop: 6,
            padding: "8px 14px",
            background: "#ecfdf5",
            borderRadius: 12,
            fontSize: 13,
            color: "#065f46",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill="#10b981" />
            <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Request #{message.submittedRequestNumber}
        </div>
      )}

      {/* Request summary card */}
      {message.requestSummary && (
        <div style={{ marginTop: 8, width: "100%", maxWidth: "82%" }}>
          <RequestSummaryCard draft={message.requestSummary} />
        </div>
      )}

      {/* Quick replies - only on latest bot message */}
      {isBot && isLatest && message.quickReplies && message.quickReplies.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <QuickReplyButtons replies={message.quickReplies} onSelect={onQuickReply} />
        </div>
      )}
    </div>
  );
}
