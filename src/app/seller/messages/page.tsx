"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MagnifyingGlassIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken, selectAuthUser } from "@/store/slices/authSlice";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useMessagingSocket } from "@/hooks/useMessagingSocket";

type ApiConversation = {
  id: string;
  type: "direct" | "group" | "contextual";
  title: string | null;
  context_type: string | null;
  context_id: string | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown> | null;
  unread_count?: number;
};

type ApiMessage = {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  text: string | null;
  created_at: string;
  deleted_at: string | null;
};

export default function SellerMessagesPage() {
  const searchParams = useSearchParams();
  const conversationIdParam = searchParams.get("conversationId");

  const authToken = useSelector(selectAuthToken);
  const authUser = useSelector(selectAuthUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(conversationIdParam);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [contextItem, setContextItem] = useState<any | null>(null);
  const [contextLoading, setContextLoading] = useState<boolean>(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const client = useMemo(
    () => getApiClient(() => authToken || null),
    [authToken]
  );
  const supabase = useMemo(() => getSupabaseClient(), []);

  // Initialize audio notification
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification.mp3");
      audioRef.current.volume = 0.5;
    }
  }, []);

  // WebSocket integration for real-time notifications
  const { emitTyping, isConnected } = useMessagingSocket({
    onNewMessage: useCallback(
      (event: any) => {
        const { conversationId, message } = event;

        // If message is from current conversation and not from us, add it
        if (
          conversationId === activeConversationId &&
          message.sender_user_id !== authUser?.id
        ) {
          setMessages((prev) => {
            // Avoid duplicates (Supabase realtime might also fire)
            if (prev.some((m) => m.id === message.id)) {
              return prev;
            }
            return [...prev, message];
          });
          setTimeout(
            () => listEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            100
          );
        } else if (message.sender_user_id !== authUser?.id) {
          // Message from different conversation - update unread count
          setUnreadCounts((prev) => ({
            ...prev,
            [conversationId]: (prev[conversationId] || 0) + 1,
          }));

          // Play notification sound
          try {
            audioRef.current?.play().catch(console.error);
          } catch (e) {
            console.error("Failed to play notification sound:", e);
          }

          // Update conversations list order
          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId
                ? { ...c, updated_at: new Date().toISOString() }
                : c
            )
          );
        }
      },
      [activeConversationId, authUser?.id]
    ),
    onTyping: useCallback((event: any) => {
      const { conversationId, userId, isTyping } = event;
      setTypingUsers((prev) => ({
        ...prev,
        [`${conversationId}:${userId}`]: isTyping,
      }));
    }, []),
    onError: useCallback((error: any) => {
      console.error("WebSocket error:", error);
    }, []),
  });

  // Handle conversation ID from URL params
  useEffect(() => {
    if (conversationIdParam) {
      setActiveConversationId(conversationIdParam);
    }
  }, [conversationIdParam]);

  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const { data } = await client.get<ApiConversation[]>("/conversations", {
        params: { limit: 50 },
      });
      setConversations(data);
      if (!activeConversationId && data.length > 0) {
        setActiveConversationId(data[0].id);
      }
    } catch (e) {
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [client, activeConversationId]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setLoadingMessages(true);
      try {
        const { data } = await client.get<ApiMessage[]>(
          `/conversations/${conversationId}/messages`,
          { params: { limit: 50 } }
        );
        setMessages(data.reverse());
      } catch (e) {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
        setTimeout(
          () => listEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          0
        );
      }
    },
    [client]
  );

  useEffect(() => {
    if (!authToken) return;
    fetchConversations();
  }, [authToken, fetchConversations]);

  useEffect(() => {
    if (!activeConversationId) return;
    fetchMessages(activeConversationId);

    // Clear unread count for this conversation
    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[activeConversationId];
      return updated;
    });

    // Fetch participants
    client
      .get(`/conversations/${activeConversationId}/participants`)
      .then(({ data }) => setParticipants(data || []))
      .catch(() => setParticipants([]));
  }, [activeConversationId, fetchMessages, client]);

  // Fetch context item for right pane
  useEffect(() => {
    const loadContext = async () => {
      const conv =
        conversations.find((c) => c.id === activeConversationId) || null;
      if (!conv || !conv.context_type || !conv.context_id) {
        setContextItem(null);
        return;
      }
      setContextLoading(true);
      try {
        let path = "";
        switch ((conv.context_type || "").toLowerCase()) {
          case "product_request":
          case "purchase_request":
          case "rfq":
            path = `/sellers/product-requests/${conv.context_id}`;
            break;
          case "order":
            path = `/sellers/orders/${conv.context_id}`;
            break;
          case "product":
            path = `/sellers/products/${conv.context_id}`;
            break;
          default:
            path = "";
        }
        if (!path) {
          setContextItem(null);
        } else {
          const { data } = await client.get(path);
          setContextItem(data || null);
          // Auto-show details pane when we have a contextual item
          setShowDetails(true);
        }
      } catch {
        setContextItem(null);
      } finally {
        setContextLoading(false);
      }
    };
    loadContext();
  }, [client, activeConversationId, conversations]);

  // Supabase Realtime subscriptions (optional if env provided)
  useEffect(() => {
    if (!supabase || !activeConversationId) return;
    const channel = supabase
      .channel(`conversation:${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const m = payload.new as ApiMessage;
          setMessages((prev) => [...prev, m]);
          setTimeout(
            () => listEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            0
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const m = payload.new as ApiMessage;
          setMessages((prev) => prev.map((x) => (x.id === m.id ? m : x)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, activeConversationId]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversationId || !authUser) return;
    const text = messageInput.trim();
    setMessageInput("");
    try {
      await client.post(`/conversations/${activeConversationId}/messages`, {
        senderUserId: authUser.id,
        senderOrgId: authUser.organizationId ?? undefined,
        content_type: "text",
        text,
      });
      // Optimistic: message will arrive via realtime insert; if realtime not configured, fallback fetch
      if (!supabase) {
        fetchMessages(activeConversationId);
      }
    } catch {
      // restore input on failure
      setMessageInput(text);
    }
  };

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);

    if (!activeConversationId) return;

    // Emit typing started
    emitTyping(activeConversationId, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to emit typing stopped
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(activeConversationId, false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();

      // Clear typing indicator
      if (activeConversationId) {
        emitTyping(activeConversationId, false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const name = c.title || c.context_type || c.id;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  // Calculate total unread count
  const totalUnreadCount = useMemo(() => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  }, [unreadCounts]);

  // Check if someone is typing in active conversation
  const isTypingInActiveConv = useMemo(() => {
    if (!activeConversationId) return false;
    return Object.entries(typingUsers).some(
      ([key, isTyping]) =>
        key.startsWith(`${activeConversationId}:`) && isTyping
    );
  }, [activeConversationId, typingUsers]);

  return (
    <div className="h-screen overflow-hidden bg-[var(--primary-background)] flex flex-col">
      <main className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full lg:w-96 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
              <div className="flex items-center gap-2">
                {/* WebSocket Connection Indicator */}
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                    isConnected
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  title={isConnected ? "Connected" : "Disconnected"}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {isConnected ? "Live" : "Offline"}
                </div>
                {/* Unread Badge */}
                {totalUnreadCount > 0 && (
                  <div className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-[var(--primary-accent2)] text-white text-xs font-bold rounded-full">
                    {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="p-6 text-center text-gray-500">
                Loading conversations…
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No conversations yet. Start a conversation from an order or RFQ.
              </div>
            ) : (
              <div>
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversationId(conversation.id)}
                    className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 ${
                      activeConversationId === conversation.id
                        ? "bg-gray-50"
                        : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                        {conversation.title?.[0]?.toUpperCase() ||
                          conversation.type[0].toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold truncate text-gray-900">
                          {conversation.title ||
                            conversation.context_type ||
                            "Conversation"}
                        </h3>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {formatTime(new Date(conversation.updated_at))}
                          </span>
                          {unreadCounts[conversation.id] > 0 && (
                            <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[var(--primary-accent2)] text-white text-[10px] font-bold rounded-full">
                              {unreadCounts[conversation.id] > 9
                                ? "9+"
                                : unreadCounts[conversation.id]}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-1 truncate">
                        {conversation.context_type
                          ? `${conversation.context_type} • ${conversation.context_id}`
                          : conversation.id}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                      {activeConv.title?.[0]?.toUpperCase() ||
                        activeConv.type[0].toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeConv.title ||
                        activeConv.context_type ||
                        "Conversation"}
                    </h2>
                    {activeConv.context_type && (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600">
                          {activeConv.context_type}
                          {activeConv.context_id
                            ? ` • ${activeConv.context_id}`
                            : ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <InformationCircleIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {loadingMessages ? (
                  <div className="text-center text-gray-500">
                    Loading messages…
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No messages yet. Say hello!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_user_id === authUser?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-end space-x-2 max-w-xl ${
                          message.sender_user_id === authUser?.id
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <div>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              message.sender_user_id === authUser?.id
                                ? "bg-[var(--primary-accent2)] text-white rounded-br-sm"
                                : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">
                              {message.text}
                            </p>
                          </div>
                          <p
                            className={`text-xs text-gray-500 mt-1 px-1 ${
                              message.sender_user_id === authUser?.id
                                ? "text-right"
                                : ""
                            }`}
                          >
                            {formatMessageTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {/* Typing Indicator */}
                {isTypingInActiveConv && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2 max-w-xl">
                      <div>
                        <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-sm">
                          <div className="flex items-center space-x-1">
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          Typing...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={listEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0">
                    <PaperClipIcon className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent resize-none"
                      style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                    <button className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
                      <FaceSmileIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Details Sidebar (Optional) */}
        {showDetails && activeConv && (
          <div className="w-[360px] border-l border-gray-200 bg-white p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {activeConv.context_type ? "Item" : "Details"}
            </h3>

            {/* Context Loader / Empty */}
            {contextLoading ? (
              <div className="text-sm text-gray-500">Loading item…</div>
            ) : !activeConv.context_type || !contextItem ? (
              <div className="text-sm text-gray-500">
                No linked item for this conversation.
              </div>
            ) : (
              <div className="space-y-6">
                {activeConv.context_type
                  ?.toLowerCase()
                  .includes("product_request") ||
                activeConv.context_type
                  ?.toLowerCase()
                  .includes("purchase_request") ||
                activeConv.context_type?.toLowerCase() === "rfq" ? (
                  <div>
                    <div className="rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Purchase Request
                        </div>
                        <div className="text-base font-semibold text-gray-900 mt-1 line-clamp-2">
                          {contextItem.product_name || "Request"}
                        </div>
                      </div>
                      <div className="p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity</span>
                          <span className="font-medium text-gray-900">
                            {contextItem.quantity}{" "}
                            {contextItem.unit_of_measurement}
                          </span>
                        </div>
                        {contextItem.budget_range?.max_price != null && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Budget</span>
                            <span className="font-medium text-gray-900">
                              {contextItem.budget_range.currency || "USD"}{" "}
                              {contextItem.budget_range.max_price}
                            </span>
                          </div>
                        )}
                        {contextItem.date_needed && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Need by</span>
                            <span className="font-medium text-gray-900">
                              {new Date(
                                contextItem.date_needed
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/seller/purchase-requests/${activeConv.context_id}`}
                        className="flex-1 px-4 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm text-center hover:bg-[var(--primary-accent3)]"
                      >
                        Open RFQ
                      </Link>
                      <Link
                        href={`/seller/orders`}
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-full text-sm text-center hover:bg-gray-50"
                      >
                        Orders
                      </Link>
                    </div>
                  </div>
                ) : activeConv.context_type?.toLowerCase() === "order" ? (
                  <div>
                    <div className="rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Order
                        </div>
                        <div className="text-base font-semibold text-gray-900 mt-1">
                          {contextItem.order_number || activeConv.context_id}
                        </div>
                      </div>
                      <div className="p-4 space-y-2 text-sm">
                        {contextItem.buyer_info?.organization_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Buyer</span>
                            <span className="font-medium text-gray-900">
                              {contextItem.buyer_info.organization_name}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total</span>
                          <span className="font-medium text-gray-900">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: contextItem.currency || "USD",
                            }).format(contextItem.total_amount || 0)}
                          </span>
                        </div>
                        {contextItem.status && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status</span>
                            <span className="font-medium text-gray-900 capitalize">
                              {String(contextItem.status).replaceAll("_", " ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/seller/orders/${activeConv.context_id}`}
                        className="flex-1 px-4 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm text-center hover:bg-[var(--primary-accent3)]"
                      >
                        Open Order
                      </Link>
                      <Link
                        href={`/seller/orders`}
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-full text-sm text-center hover:bg-gray-50"
                      >
                        All Orders
                      </Link>
                    </div>
                  </div>
                ) : activeConv.context_type?.toLowerCase() === "product" ? (
                  <div>
                    <div className="rounded-2xl border border-gray-200 overflow-hidden">
                      {contextItem.images?.[0]?.image_url && (
                        <div className="aspect-square bg-gray-50 overflow-hidden">
                          <img
                            src={contextItem.images[0].image_url}
                            alt={contextItem.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="text-base font-semibold text-gray-900 line-clamp-2">
                          {contextItem.name}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {contextItem.category}
                        </div>
                        <div className="mt-1 text-lg font-bold text-[var(--primary-accent2)]">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: contextItem.currency || "USD",
                          }).format(
                            contextItem.sale_price ??
                              contextItem.base_price ??
                              0
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/seller/products/${activeConv.context_id}/edit`}
                        className="flex-1 px-4 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm text-center hover:bg-[var(--primary-accent3)]"
                      >
                        Edit Product
                      </Link>
                      <Link
                        href={`/seller/products/${activeConv.context_id}/preview`}
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-full text-sm text-center hover:bg-gray-50"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </main>

      {/* No footer on messaging page to keep full-viewport messenger */}
    </div>
  );
}

// Import for the icon used in empty state
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
