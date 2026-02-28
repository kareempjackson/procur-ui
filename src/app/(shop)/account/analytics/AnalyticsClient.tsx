"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions } from "@/store/slices/buyerTransactionsSlice";
import { fetchOrders } from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

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

// Helper: compute the cutoff Date for a time range key
function getCutoffDate(timeRange: string): Date | null {
  const now = new Date();
  switch (timeRange) {
    case "7days": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case "30days": {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d;
    }
    case "90days": {
      const d = new Date(now);
      d.setDate(d.getDate() - 90);
      return d;
    }
    case "1year": {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return d;
    }
    case "all":
    default:
      return null;
  }
}

export default function AnalyticsClient() {
  const dispatch = useAppDispatch();
  const { summary, status } = useAppSelector(
    (state) => state.buyerTransactions
  );
  const { orders: ordersData } = useAppSelector((state) => state.buyerOrders);

  const [timeRange, setTimeRange] = useState("30days");

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 100 }));
    dispatch(fetchOrders({ page: 1, limit: 100 }));
  }, [dispatch]);

  const allOrders = Array.isArray(ordersData) ? ordersData : [];

  // Filter orders by the selected time range using the created_at field
  // useMemo must be called unconditionally before any early return
  const orders = useMemo(() => {
    const cutoff = getCutoffDate(timeRange);
    if (!cutoff) return allOrders;
    return allOrders.filter((o) => {
      if (!o.created_at) return true;
      return new Date(o.created_at) >= cutoff;
    });
  }, [allOrders, timeRange]);

  if (status === "loading" || !summary) {
    return <ProcurLoader size="lg" text="Loading analytics..." />;
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Stat card definitions
  const statCards = [
    {
      label: "Total Spent",
      value: formatCurrency(summary.total_spent, summary.currency),
      sub: `${summary.total_transactions} transactions`,
      accentColor: T.orange,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Total Orders",
      value: String(totalOrders),
      sub: `${completedOrders} completed`,
      accentColor: T.teal,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(summary.average_transaction_amount, summary.currency),
      sub: "Per transaction",
      accentColor: "#5b7fa6",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      label: "Top Suppliers",
      value: String(summary.top_sellers?.length || 0),
      sub: "Active partnerships",
      accentColor: "#6b7e4a",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.font }}>
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: T.teal, marginBottom: 4, margin: "0 0 4px 0" }}>
                Analytics Dashboard
              </h1>
              <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
                Insights into your procurement performance
              </p>
            </div>

            {/* Time Range Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ padding: "8px 16px", border: `1px solid ${T.cardBorder}`, borderRadius: T.btnRadius, fontSize: 13, outline: "none", background: "#fff", color: T.dark, fontFamily: T.font, cursor: "pointer" }}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
          {statCards.map((card) => (
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
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ padding: 8, background: `${card.accentColor}18`, borderRadius: 8, color: card.accentColor }}>
                  {card.icon}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: T.dark }}>{card.value}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: T.muted }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 32 }}>
          {/* Spending Trend */}
          <div style={{ background: T.cardBg, borderRadius: T.cardRadius, border: `1px solid ${T.cardBorder}`, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: T.dark, marginBottom: 4, margin: "0 0 4px 0" }}>
                  Monthly Spending Trend
                </h3>
                <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
                  Your procurement spending over time
                </p>
              </div>
              <div style={{ padding: "4px 12px", background: `${T.teal}15`, borderRadius: T.btnRadius, fontSize: 12, fontWeight: 500, color: T.teal }}>
                Last 12 months
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {summary.monthly_spending && summary.monthly_spending.length > 0 ? (
                summary.monthly_spending.map((item, index) => {
                  const maxAmount = Math.max(...summary.monthly_spending.map((m) => m.amount));
                  const percentage = (item.amount / maxAmount) * 100;

                  return (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, fontSize: 12, fontWeight: 500, color: T.muted }}>{item.month}</div>
                      <div style={{ flex: 1, position: "relative" }}>
                        <div style={{ height: 40, background: "#fff", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.cardBorder}` }}>
                          <div
                            style={{
                              height: "100%",
                              background: `linear-gradient(90deg, ${T.teal} 0%, ${T.orange} 100%)`,
                              borderRadius: 8,
                              width: `${percentage}%`,
                              transition: "width 0.5s",
                              display: "flex",
                              alignItems: "center",
                              paddingLeft: 12,
                            }}
                          >
                            {percentage > 30 && (
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
                                {formatCurrency(item.amount, summary.currency)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ width: 64, textAlign: "right" }}>
                        <span style={{ fontSize: 12, color: T.muted }}>{item.transaction_count} orders</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "32px 0", fontSize: 13, color: T.muted }}>
                  No spending data available
                </div>
              )}
            </div>
          </div>

          {/* Transaction Status Breakdown */}
          <div style={{ background: T.cardBg, borderRadius: T.cardRadius, border: `1px solid ${T.cardBorder}`, padding: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: T.dark, marginBottom: 16 }}>
              Transaction Status
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {summary.transactions_by_status &&
              Object.keys(summary.transactions_by_status).length > 0 ? (
                Object.entries(summary.transactions_by_status).map(
                  ([statusKey, count]) => {
                    const colorMap: Record<string, { bg: string; color: string }> = {
                      completed: { bg: `${T.teal}15`, color: T.teal },
                      pending: { bg: `${T.orange}15`, color: T.orange },
                      failed: { bg: "#dc262615", color: "#dc2626" },
                      cancelled: { bg: `${T.muted}20`, color: T.muted },
                    };
                    const color = colorMap[statusKey.toLowerCase()] || colorMap.cancelled;

                    return (
                      <div
                        key={statusKey}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 40, height: 40,
                              background: color.bg,
                              borderRadius: 8,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: 14, fontWeight: 700, color: color.color }}>{count}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: T.dark, textTransform: "capitalize" }}>{statusKey}</div>
                            <div style={{ fontSize: 12, color: T.muted }}>
                              {((count / summary.total_transactions) * 100).toFixed(0)}% of total
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div style={{ textAlign: "center", padding: "32px 0", fontSize: 13, color: T.muted }}>
                  No transaction status data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Suppliers Table */}
        {summary.top_sellers && summary.top_sellers.length > 0 && (
          <div style={{ background: T.cardBg, borderRadius: T.cardRadius, border: `1px solid ${T.cardBorder}`, overflow: "hidden", marginBottom: 32 }}>
            <div style={{ padding: 24, borderBottom: `1px solid ${T.cardBorder}` }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: T.dark, marginBottom: 4, margin: "0 0 4px 0" }}>
                Top Suppliers by Volume
              </h3>
              <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
                Your most valuable supplier partnerships
              </p>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fff" }}>
                    {["Rank", "Supplier", "Total Spent", "Orders", "Avg Order"].map((col) => (
                      <th key={col} style={{ textAlign: "left", padding: "12px 24px", fontSize: 11, fontWeight: 600, color: T.dark, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summary.top_sellers.map((seller, index) => {
                    const rankColors = [
                      { bg: T.orange, color: "#fff" },
                      { bg: T.teal, color: "#fff" },
                      { bg: "#5b7fa6", color: "#fff" },
                    ];
                    const rankStyle = rankColors[index] || { bg: T.cardBg, color: T.muted };

                    return (
                      <tr
                        key={seller.seller_id}
                        style={{
                          borderTop: `1px solid ${T.cardBorder}`,
                          background: index % 2 === 0 ? "transparent" : "#fff",
                        }}
                      >
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: rankStyle.bg, color: rankStyle.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                            #{index + 1}
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ fontWeight: 500, fontSize: 13, color: T.dark }}>{seller.seller_name}</div>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: T.dark }}>
                            {formatCurrency(seller.total_amount, summary.currency)}
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ fontSize: 13, color: T.muted }}>{seller.transaction_count} orders</div>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ fontSize: 13, color: T.muted }}>
                            {formatCurrency(seller.total_amount / seller.transaction_count, summary.currency)}
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

        {/* Key Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[
            {
              label: "Net Spent",
              value: formatCurrency(summary.net_spent, summary.currency),
              sub: "After refunds & adjustments",
              accentColor: T.orange,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 16.1A5 5 0 0 1 5.5 8h.08" /><path d="M3.27 12H5.5a5 5 0 0 1 4.9 4" />
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              ),
            },
            {
              label: "Refunds",
              value: formatCurrency(summary.total_refunds, summary.currency),
              sub: "Money returned",
              accentColor: T.teal,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                  <polyline points="17 18 23 18 23 12" />
                </svg>
              ),
            },
            {
              label: "Fees Paid",
              value: formatCurrency(summary.total_fees, summary.currency),
              sub: "Platform & processing",
              accentColor: "#b08040",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              ),
            },
            {
              label: "Largest Order",
              value: formatCurrency(summary.largest_transaction, summary.currency),
              sub: "Single transaction",
              accentColor: "#5b7fa6",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              ),
            },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                background: T.cardBg,
                borderRadius: T.cardRadius,
                border: `1px solid ${T.cardBorder}`,
                borderLeft: `3px solid ${metric.accentColor}`,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ padding: 6, background: `${metric.accentColor}18`, borderRadius: 8, color: metric.accentColor }}>
                  {metric.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {metric.label}
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.dark, marginBottom: 4 }}>{metric.value}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{metric.sub}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
