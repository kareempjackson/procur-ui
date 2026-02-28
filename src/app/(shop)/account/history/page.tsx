"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions } from "@/store/slices/buyerTransactionsSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/components/ui/Toast";

// Design tokens
const T = {
  pageBg: "#faf8f4",
  cardBg: "#f5f1ea",
  cardBorder: "#e8e4dc",
  teal: "#2d4a3e",
  orange: "#d4783c",
  dark: "#1c2b23",
  muted: "#8a9e92",
  font: "'Urbanist', system-ui, sans-serif",
  cardRadius: 12,
  btnRadius: 999,
};

// Inline SVG icons
function IconBanknotes({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function IconCreditCard({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconRefund({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.99" />
    </svg>
  );
}

function IconTrendUp({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconTrendDown({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function IconClock({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheck({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconX({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function IconCalendar({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconMagnify({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconSpin({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function getStatusIcon(status?: string) {
  if (!status) return <IconClock size={16} />;
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      return <IconCheck size={16} />;
    case "pending":
      return <IconClock size={16} />;
    case "failed":
    case "cancelled":
      return <IconX size={16} />;
    default:
      return <IconClock size={16} />;
  }
}

function getStatusStyle(status?: string): { background: string; color: string; border: string } {
  if (!status) return { background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb" };
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      return { background: `${T.teal}12`, color: T.teal, border: `1px solid ${T.teal}30` };
    case "pending":
      return { background: `${T.orange}12`, color: T.orange, border: `1px solid ${T.orange}30` };
    case "failed":
      return { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
    case "cancelled":
      return { background: "#f9fafb", color: T.muted, border: `1px solid ${T.cardBorder}` };
    default:
      return { background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb" };
  }
}

function getTypeIcon(type?: string) {
  if (!type) return <IconBanknotes size={16} />;
  switch (type.toLowerCase()) {
    case "payment": return <IconCreditCard size={16} />;
    case "refund": return <IconRefund size={16} />;
    case "credit": return <IconTrendUp size={16} />;
    case "debit": return <IconTrendDown size={16} />;
    default: return <IconBanknotes size={16} />;
  }
}

export default function BuyerTransactionsPage() {
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const { transactions, summary, status, error, pagination } = useAppSelector(
    (state) => state.buyerTransactions
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);
  const inFlightPageRef = useRef<number | null>(null);

  const requestFilters = useMemo(() => {
    const filters: {
      page: number;
      limit: number;
      search?: string;
      status?: string;
      type?: string;
    } = { page: 1, limit: 20 };

    if (searchQuery) filters.search = searchQuery;
    if (selectedStatus !== "all") filters.status = selectedStatus;
    if (selectedType !== "all") filters.type = selectedType;

    return filters;
  }, [searchQuery, selectedStatus, selectedType]);

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchTransactions(requestFilters));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [requestFilters, dispatch]);

  useEffect(() => {
    inFlightPageRef.current = null;
  }, [requestFilters]);

  useEffect(() => {
    const el = loadMoreSentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        const hasMore = pagination.page < pagination.totalPages;
        if (!hasMore) return;
        if (status === "loading") return;

        const nextPage = pagination.page + 1;
        if (inFlightPageRef.current === nextPage) return;
        inFlightPageRef.current = nextPage;
        dispatch(
          fetchTransactions({
            ...requestFilters,
            page: nextPage,
            limit: requestFilters.limit,
          })
        );
      },
      { root: null, rootMargin: "400px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch, pagination.page, pagination.totalPages, requestFilters, status]);

  useEffect(() => {
    if (status === "loading") return;
    inFlightPageRef.current = null;
  }, [status, pagination.page]);

  const lastToastErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (status !== "failed" || !error) return;
    if (transactions.length === 0) return;
    if (lastToastErrorRef.current === error) return;
    lastToastErrorRef.current = error;
    show({
      variant: "error",
      title: "Couldn't refresh transactions",
      message: error,
      actionLabel: "Retry",
      onAction: () => dispatch(fetchTransactions(requestFilters)),
    });
  }, [status, error, transactions.length, show, dispatch, requestFilters]);
  useEffect(() => {
    if (status === "succeeded") lastToastErrorRef.current = null;
  }, [status]);

  if (status === "loading" && transactions.length === 0) {
    return <ProcurLoader size="lg" text="Loading transactions..." />;
  }

  if (status === "failed" && error && transactions.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: T.pageBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font }}>
        <div style={{ width: "100%", maxWidth: 512, padding: "0 24px" }}>
          <Alert
            variant="error"
            title="Failed to load transactions"
            description={error}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => dispatch(fetchTransactions(requestFilters))}
                  style={{ display: "inline-flex", alignItems: "center", borderRadius: T.btnRadius, background: T.orange, color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: T.font }}
                >
                  Retry
                </button>
                <Link
                  href="/orders"
                  style={{ display: "inline-flex", alignItems: "center", borderRadius: T.btnRadius, border: `1px solid ${T.cardBorder}`, background: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 500, color: T.dark, textDecoration: "none" }}
                >
                  View orders
                </Link>
              </>
            }
          />
        </div>
      </div>
    );
  }

  // Summary card data
  const summaryCards = summary
    ? [
        {
          label: "Total Spent",
          value: new Intl.NumberFormat("en-US", { style: "currency", currency: summary.currency || "USD" }).format(summary.total_spent),
          sub: `${summary.total_transactions} transactions`,
          accentColor: T.orange,
          icon: <IconBanknotes size={28} color={T.orange} />,
        },
        {
          label: "Refunds",
          value: new Intl.NumberFormat("en-US", { style: "currency", currency: summary.currency || "USD" }).format(summary.total_refunds),
          sub: "Returned to account",
          accentColor: T.teal,
          icon: <IconTrendDown size={28} color={T.teal} />,
        },
        {
          label: "Average",
          value: new Intl.NumberFormat("en-US", { style: "currency", currency: summary.currency || "USD" }).format(summary.average_transaction_amount),
          sub: "Per transaction",
          accentColor: "#5b7fa6",
          icon: <IconBanknotes size={28} color="#5b7fa6" />,
        },
        {
          label: "Fees Paid",
          value: new Intl.NumberFormat("en-US", { style: "currency", currency: summary.currency || "USD" }).format(summary.total_fees),
          sub: "Platform & processing",
          accentColor: "#b08040",
          icon: <IconCreditCard size={28} color="#b08040" />,
        },
      ]
    : [];

  const selectStyle: React.CSSProperties = {
    padding: "10px 16px",
    border: `1px solid ${T.cardBorder}`,
    borderRadius: T.btnRadius,
    fontSize: 13,
    outline: "none",
    background: "#fff",
    color: T.dark,
    fontFamily: T.font,
    cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.font }}>
      {/* keyframes for spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        {/* Inline error */}
        {status === "failed" && error && transactions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <Alert
              variant="error"
              title="Some data may be out of date"
              description={error}
              actions={
                <button
                  type="button"
                  onClick={() => dispatch(fetchTransactions(requestFilters))}
                  style={{ display: "inline-flex", alignItems: "center", borderRadius: T.btnRadius, background: T.orange, color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: T.font }}
                >
                  Retry
                </button>
              }
            />
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: T.teal, marginBottom: 4, margin: "0 0 4px 0" }}>
                Transaction History
              </h1>
              <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
                View and manage your payment history
              </p>
            </div>
            <Link
              href="/orders"
              style={{ padding: "10px 20px", background: "#fff", border: `1px solid ${T.cardBorder}`, color: T.dark, borderRadius: T.btnRadius, fontSize: 13, fontWeight: 500, textDecoration: "none" }}
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {summaryCards.map((card) => (
              <div
                key={card.label}
                style={{
                  background: T.cardBg,
                  borderRadius: T.cardRadius,
                  padding: 20,
                  border: `1px solid ${T.cardBorder}`,
                  borderLeft: `4px solid ${card.accentColor}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ padding: 8, background: `${card.accentColor}15`, borderRadius: 8 }}>
                    {card.icon}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{card.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: T.dark }}>{card.value}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: T.muted }}>{card.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters Bar */}
        <div style={{ background: T.cardBg, borderRadius: T.cardRadius, border: `1px solid ${T.cardBorder}`, padding: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            {/* Search */}
            <div style={{ flex: "1 1 240px", position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <IconMagnify size={18} color={T.muted} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, border: `1px solid ${T.cardBorder}`, borderRadius: T.btnRadius, fontSize: 13, outline: "none", fontFamily: T.font, color: T.dark, background: "#fff", boxSizing: "border-box" }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Types</option>
              <option value="payment">Payment</option>
              <option value="refund">Refund</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{ padding: "10px 16px", border: `1px solid ${T.cardBorder}`, borderRadius: T.btnRadius, fontSize: 13, fontWeight: 500, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: T.font, color: T.dark }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              More Filters
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div style={{ background: T.cardBg, borderRadius: T.cardRadius, border: `1px solid ${T.cardBorder}`, padding: 48, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, opacity: 0.5 }}>
              <IconBanknotes size={64} color={T.muted} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: T.dark, marginBottom: 8 }}>
              No Transactions Found
            </h3>
            <p style={{ color: T.muted, marginBottom: 24 }}>
              Place orders to see your transaction history here
            </p>
            <Link
              href="/"
              style={{ display: "inline-block", padding: "12px 24px", background: T.orange, color: "#fff", borderRadius: T.btnRadius, fontWeight: 500, textDecoration: "none" }}
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div style={{ background: T.cardBg, borderRadius: T.cardRadius, border: `1px solid ${T.cardBorder}`, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fff", borderBottom: `1px solid ${T.cardBorder}` }}>
                    {["Transaction", "Type", "Amount", "Status", "Date"].map((col) => (
                      <th key={col} style={{ textAlign: "left", padding: "16px 24px", fontSize: 11, fontWeight: 600, color: T.dark, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => {
                    const statusStyle = getStatusStyle(transaction.status);
                    return (
                      <tr
                        key={transaction.id}
                        style={{
                          borderBottom: `1px solid ${T.cardBorder}`,
                          background: index % 2 === 0 ? "transparent" : "#fff",
                        }}
                      >
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <div style={{ marginTop: 2, padding: 8, background: `${T.orange}15`, borderRadius: 8, color: T.orange }}>
                              {getTypeIcon(transaction.type)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500, fontSize: 13, color: T.dark, marginBottom: 2 }}>
                                {transaction.transaction_number || "N/A"}
                              </div>
                              <div style={{ fontSize: 12, color: T.muted }}>
                                {transaction.seller_name || "Unknown"}
                              </div>
                              {transaction.order_number && (
                                <Link
                                  href={`/orders/${transaction.order_id}`}
                                  style={{ fontSize: 12, color: T.teal, textDecoration: "none", marginTop: 4, display: "inline-block" }}
                                >
                                  Order: {transaction.order_number}
                                </Link>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: T.dark, textTransform: "capitalize" }}>
                            {transaction.type || "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: T.dark }}>
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: transaction.currency || "USD",
                            }).format(transaction.amount || 0)}
                          </div>
                          <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
                            Net:{" "}
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: transaction.currency || "USD",
                            }).format(transaction.net_amount || 0)}
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <span
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "4px 10px", borderRadius: T.btnRadius,
                              fontSize: 12, fontWeight: 500,
                              ...statusStyle,
                            }}
                          >
                            {getStatusIcon(transaction.status)}
                            <span style={{ textTransform: "capitalize" }}>
                              {transaction.status || "pending"}
                            </span>
                          </span>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.muted }}>
                            <IconCalendar size={14} color={T.muted} />
                            {new Date(transaction.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </div>
                          <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
                            {new Date(transaction.created_at).toLocaleTimeString("en-US", {
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Infinite scroll footer */}
        {transactions.length > 0 && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 13, color: T.muted }}>
              Showing {Math.min(transactions.length, pagination.totalItems)} of {pagination.totalItems} transactions
            </div>

            {pagination.page < pagination.totalPages ? (
              <div ref={loadMoreSentinelRef} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
                {status === "loading" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.muted }}>
                    <IconSpin size={16} color={T.muted} />
                    Loading more...
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: T.muted }}>Scroll to load more</span>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: T.muted }}>You've reached the end</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
