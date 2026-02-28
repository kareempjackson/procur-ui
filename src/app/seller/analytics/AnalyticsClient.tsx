"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchDashboardMetrics, fetchSalesAnalytics, AnalyticsPeriod,
  selectDashboardMetrics, selectSalesAnalytics,
  selectAnalyticsStatus, selectAnalyticsError,
} from "@/store/slices/sellerAnalyticsSlice";

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG    = "#faf8f4";
const CARD  = "#fff";
const EDGE  = "#ebe7df";
const TEAL  = "#2d4a3e";
const ORANGE = "#d4783c";
const DARK  = "#1c2b23";
const MUTED = "#8a9e92";
const F     = "'Urbanist', system-ui, sans-serif";

const card: React.CSSProperties = {
  background: CARD, border: `1px solid ${EDGE}`,
  borderRadius: 10, padding: 20, fontFamily: F,
};

const PERIODS = [
  { key: AnalyticsPeriod.LAST_7_DAYS,  label: "7D"   },
  { key: AnalyticsPeriod.LAST_30_DAYS, label: "30D"  },
  { key: AnalyticsPeriod.LAST_90_DAYS, label: "90D"  },
  { key: AnalyticsPeriod.THIS_YEAR,    label: "Year" },
];

const fmt = (n: number, cur = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: cur, maximumFractionDigits: 0,
  }).format(n);

const fmtPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// ── Micro icons ────────────────────────────────────────────────────────────────
const IcoRevenue = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={15} height={15}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);
const IcoOrders = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={15} height={15}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const IcoPending = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={15} height={15}>
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IcoBar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={15} height={15}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IcoTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={11} height={11}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IcoTrendDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={11} height={11}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

function EmptyChart({ label }: { label: string }) {
  return (
    <div style={{
      height: 260, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      border: `1.5px dashed ${EDGE}`, borderRadius: 8,
    }}>
      <div style={{ fontSize: 13, color: MUTED, fontFamily: F }}>{label}</div>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: CARD, border: `1px solid ${EDGE}`,
  borderRadius: 8, fontSize: 12, fontFamily: F,
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AnalyticsClient() {
  const dispatch         = useAppDispatch();
  const dashboardMetrics = useAppSelector(selectDashboardMetrics);
  const salesAnalytics   = useAppSelector(selectSalesAnalytics);
  const status           = useAppSelector(selectAnalyticsStatus);
  const error            = useAppSelector(selectAnalyticsError);

  const [period, setPeriod] = useState<AnalyticsPeriod>(AnalyticsPeriod.LAST_30_DAYS);

  useEffect(() => {
    dispatch(fetchDashboardMetrics({ period }));
    dispatch(fetchSalesAnalytics({ period, group_by: "day" }));
  }, [dispatch, period]);

  const retry = () => {
    dispatch(fetchDashboardMetrics({ period }));
    dispatch(fetchSalesAnalytics({ period, group_by: "day" }));
  };

  const loading = status === "loading";
  const failed  = status === "failed";
  const cur     = dashboardMetrics?.currency || "USD";

  const kpis = dashboardMetrics ? [
    {
      label: "Revenue",        value: fmt(dashboardMetrics.total_revenue, cur),
      change: fmtPct(dashboardMetrics.revenue_growth),
      trend: dashboardMetrics.revenue_growth >= 0 ? "up" : "down",
      icon: <IcoRevenue />, color: ORANGE,
    },
    {
      label: "Total Orders",   value: String(dashboardMetrics.total_orders),
      change: fmtPct(dashboardMetrics.orders_growth),
      trend: dashboardMetrics.orders_growth >= 0 ? "up" : "down",
      icon: <IcoOrders />, color: TEAL,
    },
    {
      label: "Pending Orders", value: String(dashboardMetrics.pending_orders),
      change: "", trend: "neutral",
      icon: <IcoPending />, color: TEAL,
    },
    {
      label: "Avg Order Value", value: fmt(dashboardMetrics.average_order_value, cur),
      change: "", trend: "neutral",
      icon: <IcoBar />, color: TEAL,
    },
  ] : [];

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: F }}>

      {/* Header */}
      <div style={{ background: CARD, borderBottom: `1px solid ${EDGE}` }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: DARK }}>Analytics</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>
              Track your sales performance and business metrics
            </div>
          </div>

          {/* Period pill selector */}
          <div style={{ display: "flex", gap: 2, background: "#f0ece4", borderRadius: 8, padding: 3 }}>
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: "5px 13px", borderRadius: 6, border: "none",
                  cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: F,
                  background: period === p.key ? CARD : "transparent",
                  color: period === p.key ? DARK : MUTED,
                  boxShadow: period === p.key ? "0 1px 4px rgba(0,0,0,.08)" : "none",
                  transition: "all .15s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* Error banner — non-blocking, shown with data if partially available */}
        {failed && (
          <div style={{
            marginBottom: 20, padding: "12px 16px",
            background: "rgba(212,120,60,.08)", border: `1px solid ${ORANGE}`,
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ fontSize: 13, color: DARK, fontFamily: F }}>
              <strong>Couldn&apos;t load analytics data.</strong>{" "}
              {error || "Check your connection and try again."}
            </div>
            <button
              onClick={retry}
              style={{
                padding: "5px 14px", borderRadius: 6, border: "none",
                cursor: "pointer", background: ORANGE, color: "#fff",
                fontSize: 12.5, fontWeight: 600, fontFamily: F, flexShrink: 0,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading placeholder */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: MUTED, fontSize: 14 }}>
            Loading analytics…
          </div>
        )}

        {!loading && (
          <>
            {/* KPI strip */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)",
              gap: 12, marginBottom: 14,
            }}>
              {kpis.map(k => (
                <div key={k.label} style={card}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", marginBottom: 12,
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: `${k.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: k.color,
                    }}>
                      {k.icon}
                    </div>
                    {k.change && (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 3,
                        fontSize: 11.5, fontWeight: 600,
                        color: k.trend === "up" ? "#2d9e6c" : ORANGE,
                      }}>
                        {k.trend === "up" ? <IcoTrendUp /> : <IcoTrendDown />}
                        {k.change}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 3 }}>
                    {k.value}
                  </div>
                  <div style={{ fontSize: 12, color: MUTED }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Inventory + Top Product */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>

              {/* Inventory */}
              <div style={card}>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 14 }}>
                  Product Inventory
                </div>
                {dashboardMetrics ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Active",       value: dashboardMetrics.active_products,       dot: TEAL    },
                      { label: "Low Stock",    value: dashboardMetrics.low_stock_products,    dot: ORANGE  },
                      { label: "Out of Stock", value: dashboardMetrics.out_of_stock_products, dot: "#c84b38" },
                    ].map(s => (
                      <div key={s.label} style={{
                        padding: "12px 14px", border: `1px solid ${EDGE}`,
                        borderRadius: 8,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: s.dot, flexShrink: 0,
                          }} />
                          <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: DARK }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: MUTED, fontSize: 13, paddingTop: 8 }}>No inventory data</div>
                )}
              </div>

              {/* Top Selling Product */}
              <div style={card}>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 14 }}>
                  Top Selling Product
                </div>
                {dashboardMetrics?.top_selling_product ? (
                  <div style={{
                    padding: "14px 16px", background: BG,
                    borderRadius: 8, border: `1px solid ${EDGE}`,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 12 }}>
                      {dashboardMetrics.top_selling_product.name}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Qty Sold</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: DARK }}>
                          {dashboardMetrics.top_selling_product.quantity_sold}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Revenue</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: TEAL }}>
                          {fmt(dashboardMetrics.top_selling_product.revenue, cur)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    color: MUTED, fontSize: 13, paddingTop: 30,
                    textAlign: "center",
                  }}>
                    No sales data yet
                  </div>
                )}
              </div>
            </div>

            {/* Charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>

              {/* Revenue over time */}
              <div style={card}>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
                  Revenue Over Time
                </div>
                {salesAnalytics?.sales_data?.length ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={salesAnalytics.sales_data}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={TEAL} stopOpacity={0.22} />
                          <stop offset="95%" stopColor={TEAL} stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: F }} tickFormatter={fmtDate} />
                      <YAxis tick={{ fontSize: 11, fontFamily: F }} tickFormatter={v => `$${Number(v).toLocaleString()}`} />
                      <Tooltip
                        formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                        labelFormatter={fmtDate}
                        contentStyle={tooltipStyle}
                      />
                      <Area type="monotone" dataKey="revenue" stroke={TEAL} strokeWidth={2} fill="url(#revGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label="No revenue data for this period" />
                )}
              </div>

              {/* Orders over time */}
              <div style={card}>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
                  Orders Over Time
                </div>
                {salesAnalytics?.sales_data?.length ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={salesAnalytics.sales_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: F }} tickFormatter={fmtDate} />
                      <YAxis tick={{ fontSize: 11, fontFamily: F }} />
                      <Tooltip labelFormatter={fmtDate} contentStyle={tooltipStyle} />
                      <Bar dataKey="orders_count" fill={TEAL} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label="No orders in this period" />
                )}
              </div>
            </div>

            {/* Top Products by Revenue (full width) */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
                Top Products by Revenue
              </div>
              {salesAnalytics?.top_products?.length ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={salesAnalytics.top_products.slice(0, 10).map(p => ({
                      name: p.product_name, revenue: p.revenue,
                    }))}
                    layout="vertical"
                    margin={{ left: 110 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                    <XAxis type="number" tick={{ fontSize: 11, fontFamily: F }}
                      tickFormatter={v => `$${Number(v).toLocaleString()}`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontFamily: F }} width={100} />
                    <Tooltip
                      formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                      contentStyle={tooltipStyle}
                    />
                    <Bar dataKey="revenue" fill={ORANGE} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart label="No product revenue data yet" />
              )}
            </div>

            {/* Period footer */}
            {dashboardMetrics && (
              <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: MUTED }}>
                Data from{" "}
                {new Date(dashboardMetrics.period_start).toLocaleDateString()} to{" "}
                {new Date(dashboardMetrics.period_end).toLocaleDateString()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
