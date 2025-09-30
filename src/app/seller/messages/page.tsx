"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MagnifyingGlassIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken, selectAuthUser } from "@/store/slices/authSlice";
import { getSupabaseClient } from "@/lib/supabaseClient";

type ApiConversation = {
  id: string;
  type: "direct" | "group" | "contextual";
  title: string | null;
  context_type: string | null;
  context_id: string | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown> | null;
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
  const authToken = useSelector(selectAuthToken);
  const authUser = useSelector(selectAuthUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  const client = useMemo(
    () => getApiClient(() => authToken || null),
    [authToken]
  );
  const supabase = useMemo(() => getSupabaseClient(), []);

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
  }, [activeConversationId, fetchMessages]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  return (
    <div className="h-screen overflow-hidden bg-[var(--primary-background)] flex flex-col">
      <main className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full lg:w-96 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Messages
            </h1>

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
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {formatTime(new Date(conversation.updated_at))}
                        </span>
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

                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <PhoneIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <InformationCircleIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
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
                      onChange={(e) => setMessageInput(e.target.value)}
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
          <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Details
            </h3>

            <div className="space-y-6">
              {/* Buyer Info */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3 text-gray-600 text-lg">
                  {activeConv.title?.[0]?.toUpperCase() ||
                    activeConv.type[0].toUpperCase()}
                </div>
                <h4 className="font-semibold text-gray-900">
                  {activeConv.title ||
                    activeConv.context_type ||
                    "Conversation"}
                </h4>
                {activeConv.context_type && (
                  <p className="text-sm text-gray-600">
                    {activeConv.context_type}
                    {activeConv.context_id ? ` • ${activeConv.context_id}` : ""}
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full px-4 py-2.5 bg-[var(--primary-accent2)] text-white rounded-lg font-medium hover:bg-[var(--primary-accent3)] transition-colors duration-200">
                  View Order History
                </button>
                <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  Create Invoice
                </button>
              </div>

              {/* Info Sections */}
              <div className="border-t border-gray-200 pt-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">
                  Contact Information
                </h5>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Email: buyer@greenleaf.com</p>
                  <p className="text-gray-600">Phone: (555) 123-4567</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">
                  Recent Orders
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order #10234</span>
                    <span className="text-gray-900">$1,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order #10198</span>
                    <span className="text-gray-900">$980</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order #10156</span>
                    <span className="text-gray-900">$1,450</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* No footer on messaging page to keep full-viewport messenger */}
    </div>
  );
}

// Import for the icon used in empty state
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
