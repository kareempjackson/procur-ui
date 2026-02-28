"use client";

import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken, selectAuthUser } from "@/store/slices/authSlice";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useMessagingSocket } from "@/hooks/useMessagingSocket";

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG    = "#faf8f4";
const CARD  = "#fff";
const EDGE  = "#ebe7df";
const TEAL  = "#2d4a3e";
const ORANGE = "#d4783c";
const DARK  = "#1c2b23";
const MUTED = "#8a9e92";
const F     = "'Urbanist', system-ui, sans-serif";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IcoSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={15} height={15}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IcoPaperclip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={16} height={16}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);
const IcoSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={15} height={15}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IcoInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={17} height={17}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="8.01" strokeWidth="2.5" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
);
const IcoChatBubble = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width={40} height={40}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IcoX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────────
type ApiConversation = {
  id: string; type: "direct" | "group" | "contextual";
  title: string | null; context_type: string | null; context_id: string | null;
  created_at: string; updated_at: string;
  metadata?: Record<string, unknown> | null; unread_count?: number;
};

type ApiMessage = {
  id: string; conversation_id: string; sender_user_id: string;
  text: string | null; created_at: string; deleted_at: string | null;
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatTime = (d: Date) => {
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const dy = Math.floor(diff / 86400000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  if (dy < 7) return `${dy}d`;
  return d.toLocaleDateString();
};

const formatMsgTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const convName = (c: ApiConversation) =>
  c.title || c.context_type || "Conversation";

const initials = (s: string) => s.charAt(0).toUpperCase();

// ── Component ──────────────────────────────────────────────────────────────────
export default function SellerMessagesPage() {
  const searchParams         = useSearchParams();
  const conversationIdParam  = searchParams.get("conversationId");
  const authToken            = useSelector(selectAuthToken);
  const authUser             = useSelector(selectAuthUser);

  const [searchQuery,          setSearchQuery]         = useState("");
  const [conversations,        setConversations]       = useState<ApiConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationIdParam);
  const [messages,             setMessages]            = useState<ApiMessage[]>([]);
  const [loadingMessages,      setLoadingMessages]     = useState(false);
  const [messageInput,         setMessageInput]        = useState("");
  const [showDetails,          setShowDetails]         = useState(false);
  const [participants,         setParticipants]        = useState<any[]>([]);
  const [unreadCounts,         setUnreadCounts]        = useState<Record<string, number>>({});
  const [typingUsers,          setTypingUsers]         = useState<Record<string, boolean>>({});
  const [contextItem,          setContextItem]         = useState<any | null>(null);
  const [contextLoading,       setContextLoading]      = useState(false);
  const [contextError,         setContextError]        = useState<string | null>(null);

  const listEndRef       = useRef<HTMLDivElement | null>(null);
  const audioRef         = useRef<HTMLAudioElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const client   = useMemo(() => getApiClient(() => authToken || null), [authToken]);
  const supabase = useMemo(() => getSupabaseClient(), []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification.mp3");
      audioRef.current.volume = 0.5;
    }
  }, []);

  const { emitTyping, isConnected } = useMessagingSocket({
    onNewMessage: useCallback((event: any) => {
      const { conversationId, message } = event;
      if (conversationId === activeConversationId && message.sender_user_id !== authUser?.id) {
        setMessages(prev => prev.some(m => m.id === message.id) ? prev : [...prev, message]);
        setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else if (message.sender_user_id !== authUser?.id) {
        setUnreadCounts(prev => ({ ...prev, [conversationId]: (prev[conversationId] || 0) + 1 }));
        try { audioRef.current?.play().catch(console.error); } catch {}
        setConversations(prev => prev.map(c =>
          c.id === conversationId ? { ...c, updated_at: new Date().toISOString() } : c
        ));
      }
    }, [activeConversationId, authUser?.id]),
    onTyping: useCallback((event: any) => {
      const { conversationId, userId, isTyping } = event;
      setTypingUsers(prev => ({ ...prev, [`${conversationId}:${userId}`]: isTyping }));
    }, []),
    onError: useCallback((error: any) => { console.error("WebSocket error:", error); }, []),
  });

  useEffect(() => {
    if (conversationIdParam) setActiveConversationId(conversationIdParam);
  }, [conversationIdParam]);

  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const { data } = await client.get<ApiConversation[]>("/conversations", { params: { limit: 50 } });
      setConversations(data);
      if (!activeConversationId && data.length > 0) setActiveConversationId(data[0].id);
    } catch {
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [client, activeConversationId]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const { data } = await client.get<ApiMessage[]>(
        `/conversations/${conversationId}/messages`, { params: { limit: 50 } }
      );
      setMessages(data.reverse());
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
      setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }
  }, [client]);

  useEffect(() => { if (authToken) fetchConversations(); }, [authToken, fetchConversations]);

  useEffect(() => {
    if (!activeConversationId) return;
    fetchMessages(activeConversationId);
    setUnreadCounts(prev => { const u = { ...prev }; delete u[activeConversationId]; return u; });
    client.get(`/conversations/${activeConversationId}/participants`)
      .then(({ data }) => setParticipants(data || []))
      .catch(() => setParticipants([]));
  }, [activeConversationId, fetchMessages, client]);

  // Context item
  useEffect(() => {
    const loadContext = async () => {
      const conv = conversations.find(c => c.id === activeConversationId) || null;
      if (!conv || !conv.context_type || !conv.context_id) {
        setContextItem(null); setContextError(null); return;
      }
      setContextLoading(true); setContextError(null);
      try {
        let path = "";
        const ct = (conv.context_type || "").toLowerCase();
        if (["product_request", "purchase_request", "rfq"].includes(ct))
          path = `/sellers/product-requests/${conv.context_id}`;
        else if (ct === "order")
          path = `/sellers/orders/${conv.context_id}`;
        else if (ct === "product")
          path = `/sellers/products/${conv.context_id}`;
        if (!path) { setContextItem(null); setContextError(null); }
        else {
          const { data } = await client.get(path);
          setContextItem(data || null);
          setShowDetails(true);
        }
      } catch {
        setContextItem(null);
        setContextError("Failed to load the linked item. It may have been removed or is temporarily unavailable.");
      } finally {
        setContextLoading(false);
      }
    };
    loadContext();
  }, [client, activeConversationId, conversations]);

  // Supabase realtime
  useEffect(() => {
    if (!supabase || !activeConversationId) return;
    const channel = supabase
      .channel(`conversation:${activeConversationId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `conversation_id=eq.${activeConversationId}`,
      }, (payload) => {
        const m = payload.new as ApiMessage;
        setMessages(prev => [...prev, m]);
        setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
      })
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "messages",
        filter: `conversation_id=eq.${activeConversationId}`,
      }, (payload) => {
        const m = payload.new as ApiMessage;
        setMessages(prev => prev.map(x => x.id === m.id ? m : x));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, activeConversationId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversationId || !authUser) return;
    const text = messageInput.trim();
    setMessageInput("");
    try {
      await client.post(`/conversations/${activeConversationId}/messages`, {
        senderUserId: authUser.id,
        senderOrgId: authUser.organizationId ?? undefined,
        content_type: "text", text,
      });
      if (!supabase) fetchMessages(activeConversationId);
    } catch {
      setMessageInput(text);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    if (!activeConversationId) return;
    emitTyping(activeConversationId, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(activeConversationId, false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      if (activeConversationId) emitTyping(activeConversationId, false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const filtered = conversations.filter(c =>
    convName(c).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = useMemo(
    () => conversations.find(c => c.id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  const totalUnread = useMemo(
    () => Object.values(unreadCounts).reduce((s, n) => s + n, 0), [unreadCounts]
  );

  const isTypingInActive = useMemo(() => {
    if (!activeConversationId) return false;
    return Object.entries(typingUsers).some(
      ([k, v]) => k.startsWith(`${activeConversationId}:`) && v
    );
  }, [activeConversationId, typingUsers]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      height: "calc(100vh - 56px)", display: "flex", overflow: "hidden",
      background: BG, fontFamily: F,
    }}>

      {/* ── LEFT: Conversation list ───────────────────────────────────────── */}
      <div style={{
        width: 300, flexShrink: 0,
        borderRight: `1px solid ${EDGE}`, background: CARD,
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${EDGE}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: DARK }}>Messages</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Connection dot */}
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "3px 9px", borderRadius: 9999,
                background: isConnected ? "rgba(34,197,94,.1)" : "#f5f5f5",
                fontSize: 11, fontWeight: 600, color: isConnected ? "#16a34a" : MUTED,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: isConnected ? "#22c55e" : "#c8c8c8",
                }} />
                {isConnected ? "Live" : "Offline"}
              </div>
              {totalUnread > 0 && (
                <div style={{
                  minWidth: 20, height: 20, borderRadius: 9999,
                  background: ORANGE, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, padding: "0 5px",
                }}>
                  {totalUnread > 99 ? "99+" : totalUnread}
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: MUTED }}>
              <IcoSearch />
            </div>
            <input
              type="text"
              placeholder="Search conversations…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "8px 12px 8px 32px", fontSize: 13, fontFamily: F,
                border: `1px solid ${EDGE}`, borderRadius: 8, background: BG,
                outline: "none", color: DARK, boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loadingConversations ? (
            <div style={{ padding: "24px 16px", textAlign: "center", fontSize: 13, color: MUTED }}>
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "24px 16px", textAlign: "center", fontSize: 13, color: MUTED }}>
              No conversations yet. Start from an order or RFQ.
            </div>
          ) : (
            filtered.map(conv => {
              const active = conv.id === activeConversationId;
              const unread = unreadCounts[conv.id] || 0;
              const name   = convName(conv);
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  style={{
                    width: "100%", padding: "11px 14px",
                    display: "flex", alignItems: "flex-start", gap: 10,
                    background: active ? BG : "transparent",
                    border: "none", borderBottom: `1px solid ${EDGE}`,
                    cursor: "pointer", textAlign: "left",
                    transition: "background .12s",
                    borderLeft: active ? `3px solid ${ORANGE}` : "3px solid transparent",
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    background: active ? ORANGE : "rgba(45,74,62,.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700,
                    color: active ? "#fff" : TEAL,
                  }}>
                    {initials(name)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                      <div style={{
                        fontSize: 13.5, fontWeight: unread > 0 ? 700 : 600,
                        color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        maxWidth: 150,
                      }}>
                        {name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, marginLeft: 4 }}>
                        <span style={{ fontSize: 10.5, color: MUTED }}>
                          {formatTime(new Date(conv.updated_at))}
                        </span>
                        {unread > 0 && (
                          <div style={{
                            minWidth: 17, height: 17, borderRadius: 9999,
                            background: ORANGE, color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9.5, fontWeight: 800, padding: "0 4px",
                          }}>
                            {unread > 9 ? "9+" : unread}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 11.5, color: MUTED,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {conv.context_type
                        ? `${conv.context_type}${conv.context_id ? " · " + conv.context_id.slice(0, 8) + "…" : ""}`
                        : conv.id.slice(0, 12) + "…"}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── CENTER: Message thread ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: CARD }}>
        {activeConv ? (
          <>
            {/* Thread header */}
            <div style={{
              padding: "12px 18px", borderBottom: `1px solid ${EDGE}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: CARD, flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(45,74,62,.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: TEAL,
                }}>
                  {initials(convName(activeConv))}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: DARK }}>
                    {convName(activeConv)}
                  </div>
                  {activeConv.context_type && (
                    <div style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>
                      {activeConv.context_type}
                      {activeConv.context_id ? ` · ${activeConv.context_id.slice(0, 10)}…` : ""}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                title="Toggle details"
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: showDetails ? "rgba(212,120,60,.1)" : "transparent",
                  color: showDetails ? ORANGE : MUTED,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <IcoInfo />
              </button>
            </div>

            {/* Messages area */}
            <div style={{
              flex: 1, overflowY: "auto",
              padding: "20px 20px", background: BG,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {loadingMessages ? (
                <div style={{ textAlign: "center", fontSize: 13, color: MUTED, paddingTop: 40 }}>
                  Loading messages…
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: "center", fontSize: 13, color: MUTED, paddingTop: 40 }}>
                  No messages yet. Say hello!
                </div>
              ) : (
                messages.map(msg => {
                  const mine = msg.sender_user_id === authUser?.id;
                  return (
                    <div
                      key={msg.id}
                      style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}
                    >
                      <div style={{ maxWidth: "62%" }}>
                        <div style={{
                          padding: "10px 14px",
                          borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: mine ? TEAL : CARD,
                          border: mine ? "none" : `1px solid ${EDGE}`,
                          color: mine ? "#fff" : DARK,
                          fontSize: 14, lineHeight: 1.55,
                        }}>
                          {msg.text}
                        </div>
                        <div style={{
                          fontSize: 10.5, color: MUTED, marginTop: 3,
                          textAlign: mine ? "right" : "left", paddingInline: 4,
                        }}>
                          {formatMsgTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {isTypingInActive && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding: "10px 14px", borderRadius: "16px 16px 16px 4px",
                    background: CARD, border: `1px solid ${EDGE}`,
                    display: "flex", gap: 4, alignItems: "center",
                  }}>
                    {[0, 150, 300].map(delay => (
                      <div
                        key={delay}
                        style={{
                          width: 7, height: 7, borderRadius: "50%",
                          background: MUTED, animation: "bounce 1s infinite",
                          animationDelay: `${delay}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={listEndRef} />
            </div>

            {/* Input bar */}
            <div style={{
              padding: "12px 16px", borderTop: `1px solid ${EDGE}`,
              background: CARD, flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <button
                  title="Attach file"
                  style={{
                    width: 36, height: 36, borderRadius: "50%", border: "none",
                    background: "transparent", color: MUTED, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IcoPaperclip />
                </button>

                <textarea
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  rows={1}
                  style={{
                    flex: 1, padding: "10px 14px", fontSize: 14, fontFamily: F,
                    border: `1px solid ${EDGE}`, borderRadius: 20,
                    outline: "none", resize: "none", color: DARK,
                    background: BG, minHeight: 42, maxHeight: 120,
                    lineHeight: 1.45,
                  }}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  title="Send"
                  style={{
                    width: 38, height: 38, borderRadius: "50%", border: "none",
                    background: messageInput.trim() ? ORANGE : EDGE,
                    color: messageInput.trim() ? "#fff" : MUTED,
                    cursor: messageInput.trim() ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "background .15s",
                  }}
                >
                  <IcoSend />
                </button>
              </div>
              <div style={{ fontSize: 10.5, color: MUTED, textAlign: "center", marginTop: 6 }}>
                Enter to send · Shift+Enter for newline
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <div style={{ color: "#dde8e3" }}>
              <IcoChatBubble />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: DARK }}>No conversation selected</div>
            <div style={{ fontSize: 13, color: MUTED }}>
              Choose a conversation from the sidebar to start messaging
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Details pane ───────────────────────────────────────────── */}
      {showDetails && activeConv && (
        <div style={{
          width: 300, flexShrink: 0,
          borderLeft: `1px solid ${EDGE}`, background: CARD,
          overflowY: "auto",
        }}>
          {/* Pane header */}
          <div style={{
            padding: "14px 16px", borderBottom: `1px solid ${EDGE}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>
              {activeConv.context_type ? "Linked Item" : "Details"}
            </span>
            <button
              onClick={() => setShowDetails(false)}
              style={{
                width: 26, height: 26, borderRadius: "50%", border: "none",
                background: BG, color: MUTED, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <IcoX />
            </button>
          </div>

          <div style={{ padding: 16 }}>
            {contextLoading ? (
              <div style={{ fontSize: 13, color: MUTED }}>Loading…</div>
            ) : contextError ? (
              <div style={{
                padding: "10px 12px",
                background: "rgba(212,120,60,.08)", border: `1px solid ${ORANGE}`,
                borderRadius: 8, fontSize: 12.5, color: DARK,
              }}>
                {contextError}
              </div>
            ) : !activeConv.context_type || !contextItem ? (
              <div style={{ fontSize: 13, color: MUTED }}>No linked item for this conversation.</div>
            ) : (
              <ContextPanel conv={activeConv} item={contextItem} />
            )}

            {/* Participants */}
            {participants.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: DARK, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>
                  Participants
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {participants.map((p: any, i: number) => (
                    <div key={p.id || i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "rgba(45,74,62,.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: TEAL,
                      }}>
                        {(p.fullname || p.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: DARK }}>{p.fullname || p.email}</div>
                        {p.email && p.fullname && <div style={{ fontSize: 11, color: MUTED }}>{p.email}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Context panel ─────────────────────────────────────────────────────────────
function ContextPanel({ conv, item }: { conv: ApiConversation; item: any }) {
  const ct = (conv.context_type || "").toLowerCase();
  const isRfq = ["product_request", "purchase_request", "rfq"].includes(ct);
  const isOrder = ct === "order";
  const isProduct = ct === "product";

  const CARD  = "#fff";
  const EDGE  = "#ebe7df";
  const BG    = "#faf8f4";
  const TEAL  = "#2d4a3e";
  const ORANGE = "#d4783c";
  const DARK  = "#1c2b23";
  const MUTED = "#8a9e92";
  const F     = "'Urbanist', system-ui, sans-serif";

  const cardStyle: React.CSSProperties = {
    border: `1px solid ${EDGE}`, borderRadius: 10, overflow: "hidden", marginBottom: 10,
  };
  const rowStyle: React.CSSProperties = {
    display: "flex", justifyContent: "space-between",
    padding: "8px 14px", borderBottom: `1px solid ${EDGE}`,
    fontSize: 12.5,
  };

  const btnPrimary: React.CSSProperties = {
    flex: 1, padding: "8px 0", borderRadius: 9999,
    background: ORANGE, color: "#fff", border: "none",
    fontSize: 12.5, fontWeight: 600, cursor: "pointer",
    textAlign: "center", textDecoration: "none",
    display: "block", fontFamily: F,
  };
  const btnGhost: React.CSSProperties = {
    padding: "8px 14px", borderRadius: 9999,
    border: `1px solid ${EDGE}`, background: CARD,
    color: DARK, fontSize: 12.5, fontWeight: 600,
    cursor: "pointer", textAlign: "center",
    textDecoration: "none", display: "block", fontFamily: F,
  };

  if (isRfq) return (
    <div>
      <div style={cardStyle}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${EDGE}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>
            Purchase Request
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>
            {item.product_name || "Request"}
          </div>
        </div>
        <div>
          <div style={rowStyle}>
            <span style={{ color: MUTED }}>Quantity</span>
            <span style={{ fontWeight: 600, color: DARK }}>{item.quantity} {item.unit_of_measurement}</span>
          </div>
          {item.budget_range?.max_price != null && (
            <div style={rowStyle}>
              <span style={{ color: MUTED }}>Budget</span>
              <span style={{ fontWeight: 600, color: DARK }}>
                {item.budget_range.currency || "USD"} {item.budget_range.max_price}
              </span>
            </div>
          )}
          {item.date_needed && (
            <div style={{ ...rowStyle, borderBottom: "none" }}>
              <span style={{ color: MUTED }}>Need by</span>
              <span style={{ fontWeight: 600, color: DARK }}>
                {new Date(item.date_needed).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Link href={`/seller/purchase-requests/${conv.context_id}`} style={btnPrimary}>Open RFQ</Link>
        <Link href="/seller/orders" style={btnGhost}>Orders</Link>
      </div>
    </div>
  );

  if (isOrder) return (
    <div>
      <div style={cardStyle}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${EDGE}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>
            Order
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>
            {item.order_number || conv.context_id}
          </div>
        </div>
        <div>
          {item.buyer_info?.organization_name && (
            <div style={rowStyle}>
              <span style={{ color: MUTED }}>Buyer</span>
              <span style={{ fontWeight: 600, color: DARK }}>{item.buyer_info.organization_name}</span>
            </div>
          )}
          <div style={rowStyle}>
            <span style={{ color: MUTED }}>Total</span>
            <span style={{ fontWeight: 600, color: DARK }}>
              {new Intl.NumberFormat("en-US", { style: "currency", currency: item.currency || "USD" }).format(item.total_amount || 0)}
            </span>
          </div>
          {item.status && (
            <div style={{ ...rowStyle, borderBottom: "none" }}>
              <span style={{ color: MUTED }}>Status</span>
              <span style={{ fontWeight: 600, color: DARK, textTransform: "capitalize" }}>
                {String(item.status).replaceAll("_", " ")}
              </span>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Link href={`/seller/orders/${conv.context_id}`} style={btnPrimary}>Open Order</Link>
        <Link href="/seller/orders" style={btnGhost}>All</Link>
      </div>
    </div>
  );

  if (isProduct) return (
    <div>
      <div style={cardStyle}>
        {item.images?.[0]?.image_url && (
          <div style={{ aspectRatio: "4/3", background: "#f0ece4", overflow: "hidden" }}>
            <img
              src={item.images[0].image_url} alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
        <div style={{ padding: "12px 14px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4 }}>{item.name}</div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{item.category}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: ORANGE }}>
            {new Intl.NumberFormat("en-US", { style: "currency", currency: item.currency || "USD" })
              .format(item.sale_price ?? item.base_price ?? 0)}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Link href={`/seller/products/${conv.context_id}/edit`} style={btnPrimary}>Edit</Link>
        <Link href={`/seller/products/${conv.context_id}/preview`} style={btnGhost}>Preview</Link>
      </div>
    </div>
  );

  return null;
}
