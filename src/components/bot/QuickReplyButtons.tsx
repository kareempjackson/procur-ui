"use client";

import type { QuickReply } from "@/hooks/useBotConversation";

interface QuickReplyButtonsProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
}

export default function QuickReplyButtons({ replies, onSelect }: QuickReplyButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {replies.map((reply) => (
        <button
          key={reply.value}
          onClick={() => onSelect(reply)}
          style={{
            padding: "6px 16px",
            borderRadius: 9999,
            border: "1.5px solid #407178",
            background: "transparent",
            color: "#407178",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Urbanist', system-ui, sans-serif",
            cursor: "pointer",
            transition: "background 0.15s ease, color 0.15s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.background = "#407178";
            btn.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.background = "transparent";
            btn.style.color = "#407178";
          }}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}
