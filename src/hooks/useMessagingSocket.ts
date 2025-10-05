"use client";

import { useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/store";

let socket: Socket | null = null;

interface NewMessageEvent {
  conversationId: string;
  message: {
    id: string;
    conversation_id: string;
    sender_user_id: string;
    text: string | null;
    created_at: string;
  };
}

interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

interface UseMessagingSocketProps {
  onNewMessage?: (event: NewMessageEvent) => void;
  onTyping?: (event: TypingEvent) => void;
  onError?: (error: Error) => void;
}

export function useMessagingSocket({
  onNewMessage,
  onTyping,
  onError,
}: UseMessagingSocketProps = {}) {
  const token = useAppSelector((s) => s.auth.accessToken);
  const userId = useAppSelector((s) => s.auth.user?.id);

  useEffect(() => {
    if (!token) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_WS_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000";

    // Create socket connection if it doesn't exist
    if (!socket) {
      socket = io(baseUrl, {
        transports: ["websocket"],
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("✅ Messaging WebSocket connected");
      });

      socket.on("disconnect", (reason) => {
        console.log("⚠️ Messaging WebSocket disconnected:", reason);
      });

      socket.on("connect_error", (error) => {
        console.error("❌ Messaging WebSocket error:", error);
        onError?.(error);
      });
    }

    // Set up new_message handler
    const handleNewMessage = (data: NewMessageEvent) => {
      console.log("📬 New message received:", data);
      onNewMessage?.(data);
    };

    // Set up typing handler
    const handleTyping = (data: TypingEvent) => {
      console.log("⌨️ Typing event:", data);
      onTyping?.(data);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket?.off("new_message", handleNewMessage);
      socket?.off("typing", handleTyping);
    };
  }, [token, userId, onNewMessage, onTyping, onError]);

  // Function to emit typing status
  const emitTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      if (socket?.connected && userId) {
        socket.emit("typing", {
          conversationId,
          userId,
          isTyping,
        });
      }
    },
    [userId]
  );

  return {
    emitTyping,
    isConnected: socket?.connected ?? false,
  };
}
