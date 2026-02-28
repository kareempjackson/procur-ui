"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken, selectAuthUser } from "@/store/slices/authSlice";
import { getSupabaseClient } from "@/lib/supabaseClient";

// Design tokens
const T = {
  pageBg: "#faf8f4",
  cardBg: "#f5f1ea",
  cardBorder: "#e8e4dc",
  teal: "#2d4a3e",
  orange: "#d4783c",
  orangeHover: "#c26838",
  dark: "#1c2b23",
  muted: "#8a9e92",
  tealText: "#3e5549",
  font: "'Urbanist', system-ui, sans-serif",
  radius: "12px",
  btnRadius: "999px",
};

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

export default function BuyerMessagesPage() {
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
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const [lastMessageByConv, setLastMessageByConv] = useState<
    Record<string, ApiMessage | null>
  >({});

  const client = useMemo(
    () => getApiClient(() => authToken || null),
    [authToken]
  );
  const supabase = useMemo(() => getSupabaseClient(), []);

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
      if (!activeConversationId && data.length > 0)
        setActiveConversationId(data[0].id);
    } catch {
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
      } catch {
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

  const fetchConversationById = useCallback(
    async (id: string) => {
      try {
        const { data } = await client.get<ApiConversation>(
          `/conversations/${id}`
        );
        return data;
      } catch {
        return null;
      }
    },
    [client]
  );

  useEffect(() => {
    if (!authToken) return;
    fetchConversations();
  }, [authToken, fetchConversations]);

  useEffect(() => {
    const fetchLatestForAll = async () => {
      if (conversations.length === 0) return;
      try {
        const results = await Promise.all(
          conversations.map(async (c) => {
            try {
              const { data } = await client.get<ApiMessage[]>(
                `/conversations/${c.id}/messages`,
                { params: { limit: 1 } }
              );
              return {
                id: c.id,
                msg: Array.isArray(data) ? (data[0] ?? null) : null,
              };
            } catch {
              return { id: c.id, msg: null };
            }
          })
        );
        setLastMessageByConv((prev) => {
          const next = { ...prev };
          results.forEach(({ id, msg }) => {
            next[id] = msg || null;
          });
          return next;
        });
      } catch {
        // ignore preview errors
      }
    };
    fetchLatestForAll();
  }, [conversations, client]);

  useEffect(() => {
    const ensureConversationPresent = async () => {
      if (!activeConversationId) return;
      const exists = conversations.some((c) => c.id === activeConversationId);
      if (!exists) {
        const conv = await fetchConversationById(activeConversationId);
        if (conv) {
          setConversations((prev) => {
            const already = prev.some((c) => c.id === conv.id);
            return already ? prev : [conv, ...prev];
          });
        }
      }
    };
    ensureConversationPresent();
  }, [activeConversationId, conversations, fetchConversationById]);

  useEffect(() => {
    if (!activeConversationId) return;
    fetchMessages(activeConversationId);
    client
      .get(`/conversations/${activeConversationId}/participants`)
      .then(({ data }) => {
        setParticipants(data || []);
      })
      .catch(() => setParticipants([]));
  }, [activeConversationId, fetchMessages, client]);

  useEffect(() => {
    if (!supabase || !activeConversationId) {
      console.log(
        "Real-time not available - Supabase or conversation ID missing"
      );
      return;
    }

    console.log(
      `Setting up real-time subscription for conversation: ${activeConversationId}`
    );

    const channel = supabase
      .channel(`conversation:${activeConversationId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          console.log("Real-time: New message received", payload);
          const m = payload.new as ApiMessage;
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === m.id)) {
              return prev;
            }
            return [...prev, m];
          });
          setTimeout(
            () => listEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            100
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
          console.log("Real-time: Message updated", payload);
          const m = payload.new as ApiMessage;
          setMessages((prev) => prev.map((x) => (x.id === m.id ? m : x)));
        }
      )
      .subscribe((status, err) => {
        console.log(`Real-time subscription status: ${status}`, err);
      });

    return () => {
      console.log(
        `Cleaning up real-time subscription for: ${activeConversationId}`
      );
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

  const formatMessageTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversationId || !authUser) return;
    const text = messageInput.trim();
    setMessageInput("");

    try {
      const response = await client.post(
        `/conversations/${activeConversationId}/messages`,
        {
          senderUserId: authUser.id,
          senderOrgId: authUser.organizationId ?? undefined,
          content_type: "text",
          text,
        }
      );

      console.log("Message sent successfully", response);

      if (!supabase) {
        console.log("Real-time not available, manually fetching messages");
        fetchMessages(activeConversationId);
      } else {
        const timeoutId = setTimeout(() => {
          console.log("Real-time didn't update in time, manually fetching");
          fetchMessages(activeConversationId);
        }, 2000);

        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
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

  const activeConv = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: T.pageBg, display: "flex", flexDirection: "column", fontFamily: T.font }}>
      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Conversations Sidebar */}
        <div
          style={{
            width: 340,
            minWidth: 280,
            borderRight: `1px solid ${T.cardBorder}`,
            background: T.cardBg,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Sidebar Header */}
          <div
            style={{
              padding: "24px 20px 16px",
              borderBottom: `1px solid ${T.cardBorder}`,
            }}
          >
            <h1 style={{ fontSize: 20, fontWeight: 700, color: T.dark, margin: "0 0 14px" }}>
              Messages
            </h1>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: 36,
                  paddingRight: 12,
                  paddingTop: 9,
                  paddingBottom: 9,
                  border: `1px solid ${T.cardBorder}`,
                  borderRadius: T.btnRadius,
                  fontSize: 13,
                  color: T.dark,
                  background: "#fff",
                  outline: "none",
                  fontFamily: T.font,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loadingConversations ? (
              <div style={{ padding: "24px", textAlign: "center", fontSize: 13, color: T.muted }}>
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", fontSize: 13, color: T.muted }}>
                No conversations yet. Start a conversation from an order or RFQ.
              </div>
            ) : (
              <div>
                {filteredConversations.map((conversation) => {
                  const isActive = activeConversationId === conversation.id;
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setActiveConversationId(conversation.id)}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        background: isActive ? "#fff" : "transparent",
                        borderLeft: isActive ? `3px solid ${T.teal}` : "3px solid transparent",
                        borderRight: "none",
                        borderTop: "none",
                        borderBottom: `1px solid ${T.cardBorder}`,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.15s",
                        fontFamily: T.font,
                      }}
                    >
                      <div style={{ flexShrink: 0 }}>
                        <div
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            background: isActive ? T.teal : T.cardBorder,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 15,
                            fontWeight: 700,
                            color: isActive ? "#fff" : T.tealText,
                          }}
                        >
                          {conversation.title?.[0]?.toUpperCase() ||
                            conversation.type[0].toUpperCase()}
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <h3
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: T.dark,
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 160,
                            }}
                          >
                            {conversation.title || conversation.context_type || "Conversation"}
                          </h3>
                          <span style={{ fontSize: 11, color: T.muted, flexShrink: 0, marginLeft: 8 }}>
                            {formatTime(new Date(conversation.updated_at))}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 12,
                            color: T.muted,
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lastMessageByConv[conversation.id]?.text || "No messages yet"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", overflow: "hidden" }}>
          {activeConversationId ? (
            <>
              {/* Thread Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${T.cardBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: T.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {activeConv?.title?.[0]?.toUpperCase() ||
                      activeConv?.type?.[0]?.toUpperCase() ||
                      "C"}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: T.dark, margin: 0 }}>
                      {activeConv?.title || activeConv?.context_type || "Conversation"}
                    </h2>
                    {activeConv?.context_type && (
                      <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
                        {activeConv?.context_type === "order"
                          ? "Order conversation"
                          : activeConv?.context_type === "product" ||
                              activeConv?.context_type === "item"
                            ? "Product conversation"
                            : "Conversation"}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "none",
                      border: `1px solid ${T.cardBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: T.muted,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: showDetails ? T.cardBg : "none",
                      border: `1px solid ${T.cardBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: showDetails ? T.teal : T.muted,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </button>
                  <button
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "none",
                      border: `1px solid ${T.cardBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: T.muted,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  background: T.pageBg,
                }}
              >
                {loadingMessages ? (
                  <div style={{ textAlign: "center", fontSize: 13, color: T.muted }}>
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: "center", fontSize: 13, color: T.muted }}>
                    No messages yet. Say hello!
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMine = message.sender_user_id === authUser?.id;
                    return (
                      <div
                        key={message.id}
                        style={{
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 8,
                            maxWidth: "70%",
                            flexDirection: isMine ? "row-reverse" : "row",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                padding: "10px 14px",
                                borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                background: isMine ? T.orange : T.cardBg,
                                color: isMine ? "#fff" : T.dark,
                                fontSize: 13,
                                lineHeight: 1.5,
                              }}
                            >
                              {message.text}
                            </div>
                            <p
                              style={{
                                fontSize: 11,
                                color: T.muted,
                                marginTop: 4,
                                textAlign: isMine ? "right" : "left",
                                padding: "0 4px",
                              }}
                            >
                              {formatMessageTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={listEndRef} />
              </div>

              {/* Message Input */}
              <div
                style={{
                  padding: "14px 16px",
                  borderTop: `1px solid ${T.cardBorder}`,
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                  <button
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "none",
                      border: `1px solid ${T.cardBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: T.muted,
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                  </button>
                  <div style={{ flex: 1, position: "relative" }}>
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      style={{
                        width: "100%",
                        padding: "10px 44px 10px 16px",
                        border: `1px solid ${T.cardBorder}`,
                        borderRadius: 20,
                        fontSize: 13,
                        color: T.dark,
                        background: T.pageBg,
                        outline: "none",
                        resize: "none",
                        minHeight: 44,
                        maxHeight: 120,
                        fontFamily: T.font,
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      style={{
                        position: "absolute",
                        right: 10,
                        bottom: 9,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "none",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: T.muted,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: messageInput.trim() ? T.orange : T.cardBorder,
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: messageInput.trim() ? "pointer" : "not-allowed",
                      color: "#fff",
                      flexShrink: 0,
                      transition: "background 0.15s",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: T.cardBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: T.dark, marginBottom: 8 }}>
                  No conversation selected
                </h3>
                <p style={{ fontSize: 14, color: T.muted }}>
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {showDetails && (activeConversationId || activeConv) && (
          <div
            style={{
              width: 280,
              borderLeft: `1px solid ${T.cardBorder}`,
              background: T.cardBg,
              padding: "24px 20px",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, color: T.dark, marginBottom: 24, marginTop: 0 }}>
              Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Conversation Context */}
              {activeConv?.context_type && activeConv?.context_id && (
                <div
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${T.cardBorder}`,
                    background: "#fff",
                    padding: "14px",
                  }}
                >
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: T.dark, marginBottom: 8, marginTop: 0 }}>
                    Conversation Context
                  </h4>
                  {activeConv.context_type === "order" ? (
                    <div style={{ fontSize: 13, color: T.muted }}>
                      <p style={{ marginBottom: 8, marginTop: 0 }}>
                        This conversation was started from an order.
                      </p>
                      <a
                        href={`/orders/${activeConv.context_id}`}
                        style={{ color: T.teal, fontWeight: 600, textDecoration: "underline" }}
                      >
                        View Order
                      </a>
                    </div>
                  ) : activeConv.context_type === "product" ||
                    activeConv.context_type === "item" ? (
                    <div style={{ fontSize: 13, color: T.muted }}>
                      <p style={{ marginBottom: 8, marginTop: 0 }}>
                        This conversation was started from a product.
                      </p>
                      <a
                        href={`/product/${activeConv.context_id}`}
                        style={{ color: T.teal, fontWeight: 600, textDecoration: "underline" }}
                      >
                        View Product
                      </a>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: T.muted }}>
                      <p style={{ marginTop: 0, marginBottom: 0, textTransform: "capitalize" }}>
                        {activeConv.context_type || "Conversation"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Supplier Info */}
              {(() => {
                const other =
                  participants.find(
                    (p: any) => p.user_id !== authUser?.id && !p.is_removed
                  ) || null;
                const org = other?.organizations || null;
                const user = other?.users || null;
                const displayName =
                  org?.business_name ||
                  org?.name ||
                  user?.full_name ||
                  "Supplier";
                const location = org?.country || "";
                return (
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: T.teal,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 10px",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {(displayName?.[0] || "S").toUpperCase()}
                    </div>
                    <h4 style={{ fontWeight: 700, color: T.dark, margin: "0 0 4px", fontSize: 14 }}>
                      {displayName}
                    </h4>
                    {location && (
                      <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>{location}</p>
                    )}
                  </div>
                );
              })()}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: T.orange,
                    border: "none",
                    borderRadius: T.btnRadius,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: T.font,
                  }}
                >
                  View Order History
                </button>
                <button
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: `1px solid ${T.cardBorder}`,
                    borderRadius: T.btnRadius,
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.dark,
                    cursor: "pointer",
                    fontFamily: T.font,
                  }}
                >
                  Create RFQ
                </button>
              </div>

              <div style={{ borderTop: `1px solid ${T.cardBorder}`, paddingTop: 20 }}>
                <h5 style={{ fontSize: 12, fontWeight: 700, color: T.dark, marginBottom: 10, marginTop: 0 }}>
                  Contact Information
                </h5>
                {(() => {
                  const other =
                    participants.find(
                      (p: any) => p.user_id !== authUser?.id && !p.is_removed
                    ) || null;
                  const org = other?.organizations || null;
                  const user = other?.users || null;
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: T.muted }}>
                      <p style={{ margin: 0 }}>Email: {user?.email || "—"}</p>
                      {org?.address && <p style={{ margin: 0 }}>Address: {org.address}</p>}
                      {org?.country && <p style={{ margin: 0 }}>{org.country}</p>}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
