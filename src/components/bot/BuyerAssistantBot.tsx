"use client";

import { useBotConversation } from "@/hooks/useBotConversation";
import ChatBubble from "./ChatBubble";
import ChatWindow from "./ChatWindow";

export default function BuyerAssistantBot() {
  const {
    hydrated,
    isOpen,
    toggleOpen,
    messages,
    sendMessage,
    handleQuickReply,
  } = useBotConversation();

  // Don't render until client hydration is complete to avoid SSR mismatch
  if (!hydrated) return null;

  return (
    <>
      {isOpen && (
        <ChatWindow
          messages={messages}
          onSend={sendMessage}
          onQuickReply={handleQuickReply}
          onClose={toggleOpen}
          visible={isOpen}
        />
      )}
      <ChatBubble isOpen={isOpen} onClick={toggleOpen} />
    </>
  );
}
