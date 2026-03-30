"use client";

import { ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatBubble({ isOpen, onClick }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close assistant" : "Open assistant"}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 50,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#CB5927",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(203,89,39,.35)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        animation: isOpen ? "none" : "bot-bubble-pulse 2.5s ease-in-out 3",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      {isOpen ? (
        <XMarkIcon style={{ width: 26, height: 26 }} />
      ) : (
        <ChatBubbleLeftRightIcon style={{ width: 26, height: 26 }} />
      )}
    </button>
  );
}
