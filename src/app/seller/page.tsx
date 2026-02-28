"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSellerHome } from "@/store/slices/sellerHomeSlice";
import { fetchSellerInsights } from "@/store/slices/sellerInsightsSlice";
import { fetchProfile } from "@/store/slices/profileSlice";
import { selectAuthUser } from "@/store/slices/authSlice";
import { getApiClient } from "@/lib/apiClient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number | undefined | null, currency = "XCD") {
  const n = Number(amount ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: "Pending",    bg: "#fef3c7", color: "#92400e" },
  new:        { label: "New",        bg: "#dbeafe", color: "#1e40af" },
  accepted:   { label: "Accepted",   bg: "#d1fae5", color: "#065f46" },
  preparing:  { label: "Preparing",  bg: "#ede9fe", color: "#5b21b6" },
  in_transit: { label: "In Transit", bg: "#dbeafe", color: "#1e40af" },
  shipped:    { label: "Shipped",    bg: "#dbeafe", color: "#1e40af" },
  delivered:  { label: "Delivered",  bg: "#d1fae5", color: "#065f46" },
  cancelled:  { label: "Cancelled",  bg: "#fee2e2", color: "#991b1b" },
  issue:      { label: "Issue",      bg: "#fee2e2", color: "#991b1b" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_META[status?.toLowerCase()] ?? {
    label: status,
    bg: "#f5f1ea",
    color: "#6a7f73",
  };
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 99,
        fontSize: 10.5,
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
        textTransform: "capitalize",
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SellerDashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const authUser = useAppSelector(selectAuthUser);
  const profile = useAppSelector((s) => s.profile.profile);
  const sellerHome = useAppSelector((s) => s.sellerHome);
  const insights = useAppSelector((s) => s.sellerInsights.items);

  const [balance, setBalance] = useState<{ amount: number; currency: string } | null>(null);
  const [orderTab, setOrderTab] = useState<"all" | "pending" | "active">("all");

  const displayName =
    profile?.fullname?.trim() ||
    authUser?.fullname?.trim() ||
    (authUser?.email ? authUser.email.split("@")[0] : "Seller");
  const firstName = displayName.split(" ")[0];
  const businessName =
    (profile?.organization as any)?.businessName ||
    (profile?.organization as any)?.name ||
    authUser?.organizationName ||
    "Your Business";
  const isFarmVerified = Boolean((profile?.organization as any)?.farmVerified);

  const hour = new Date().getHours();
  const timeLabel = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  useEffect(() => {
    dispatch(fetchSellerHome({ period: "last_30_days" }));
    dispatch(fetchProfile());
    dispatch(fetchSellerInsights());
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const api = getApiClient();
        const { data } = await api.get("/sellers/balance");
        setBalance({
          amount: (data as any)?.available_amount ?? 0,
          currency: (data as any)?.currency ?? "XCD",
        });
      } catch { /* silent */ }
    })();
  }, []);

  const metrics = sellerHome.data?.metrics;
  const recentOrders = sellerHome.data?.recent_orders ?? [];
  const inventory = sellerHome.data?.inventory ?? [];
  const isLoading = sellerHome.status === "loading" && !sellerHome.data;
  const isBlocked = sellerHome.status === "failed" && sellerHome.errorStatus === 403;

  const filteredOrders = (() => {
    if (orderTab === "pending")
      return recentOrders.filter((o) => ["pending", "new"].includes(o.status));
    if (orderTab === "active")
      return recentOrders.filter((o) =>
        ["accepted", "preparing", "in_transit", "shipped"].includes(o.status)
      );
    return recentOrders;
  })();

  const currency = metrics?.currency ?? "XCD";

  // ── Shared styles ─────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #ebe7df",
    borderRadius: 10,
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#faf8f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Urbanist', system-ui, sans-serif",
        }}
      >
        <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center", color: "#8a9e92" }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid #ebe7df",
              borderTopColor: "#d4783c",
              borderRadius: "50%",
              animation: "_spin .8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          Loading dashboard…
        </div>
      </div>
    );
  }

  // ── Blocked (unverified / 403) ────────────────────────────────────────────
  if (isBlocked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#faf8f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Urbanist', system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ ...card, maxWidth: 480, width: "100%", padding: "40px 36px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" width={26} height={26}>
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1c2b23", marginBottom: 10 }}>Pending Verification</h2>
          <p style={{ fontSize: 14, color: "#6a7f73", lineHeight: 1.65, marginBottom: 24 }}>
            Your seller account is under review. Once a farm visit is completed and approved, you&apos;ll have full access to your dashboard.
          </p>
          <Link
            href="/seller/business"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", background: "#2d4a3e", color: "#f5f1ea", borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
          >
            Complete Setup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f4",
        fontFamily: "'Urbanist', system-ui, sans-serif",
        color: "#1c2b23",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#8a9e92", fontWeight: 500, marginBottom: 4 }}>
              Good {timeLabel}.
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1c2b23", margin: 0, letterSpacing: "-.4px" }}>
              {firstName}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 13, color: "#6a7f73", fontWeight: 500 }}>{businessName}</span>
              {isFarmVerified ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#2e7d4f",
                    background: "#dcfce7",
                    padding: "2px 8px",
                    borderRadius: 99,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width={10} height={10}>
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#92400e",
                    background: "#fef3c7",
                    padding: "2px 8px",
                    borderRadius: 99,
                  }}
                >
                  Pending Verification
                </span>
              )}
            </div>
          </div>

          <Link
            href="/seller/analytics"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              background: "#fff",
              border: "1px solid #ebe7df",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              color: "#1c2b23",
              textDecoration: "none",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}>
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
            Analytics
          </Link>
        </div>

        {/* ── Verification banner (partial) ─────────────────────────────── */}
        {!isFarmVerified && (
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 10,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" width={18} height={18}>
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div style={{ flex: 1, fontSize: 13, color: "#92400e", fontWeight: 500 }}>
              Your account is pending verification. A farm visit must be scheduled and completed before payouts and product listing are enabled.
            </div>
            <Link
              href="/seller/business"
              style={{ fontSize: 12.5, fontWeight: 700, color: "#d97706", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Complete setup →
            </Link>
          </div>
        )}

        {/* ── KPI strip ────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Revenue",
              value: fmt(metrics?.total_revenue, currency),
              sub: "last 30 days",
              highlight: false,
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#d4783c" strokeWidth="1.75" strokeLinecap="round" width={20} height={20}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              ),
            },
            {
              label: "Pending Orders",
              value: String(metrics?.pending_orders ?? 0),
              sub: "awaiting action",
              highlight: (metrics?.pending_orders ?? 0) > 0,
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#d4783c" strokeWidth="1.75" strokeLinecap="round" width={20} height={20}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
              ),
            },
            {
              label: "Active Products",
              value: String(metrics?.active_products ?? 0),
              sub: "in catalog",
              highlight: false,
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#d4783c" strokeWidth="1.75" strokeLinecap="round" width={20} height={20}>
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
              ),
            },
            {
              label: "Available Balance",
              value: balance ? fmt(balance.amount, balance.currency) : "—",
              sub: "ready to withdraw",
              highlight: false,
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#d4783c" strokeWidth="1.75" strokeLinecap="round" width={20} height={20}>
                  <rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" />
                </svg>
              ),
            },
          ].map((k) => (
            <div
              key={k.label}
              style={{
                ...card,
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#8a9e92",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  {k.label}
                </span>
                {k.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: k.highlight ? "#d4783c" : "#1c2b23",
                    letterSpacing: "-.5px",
                    lineHeight: 1,
                  }}
                >
                  {k.value}
                </div>
                <div style={{ fontSize: 11, color: "#b0c0b6", marginTop: 5, fontWeight: 500 }}>
                  {k.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Two-column body ───────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* ────────────── LEFT ────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Recent Orders card */}
            <div style={card}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px 0",
                }}
              >
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: 0 }}>
                  Recent Orders
                </h2>
                <Link
                  href="/seller/orders"
                  style={{ fontSize: 12, fontWeight: 600, color: "#d4783c", textDecoration: "none" }}
                >
                  View all →
                </Link>
              </div>

              {/* Tab pills */}
              <div style={{ display: "flex", gap: 4, padding: "12px 20px 0" }}>
                {(["all", "pending", "active"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setOrderTab(t)}
                    style={{
                      padding: "5px 12px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      borderRadius: 5,
                      border: "none",
                      cursor: "pointer",
                      background: orderTab === t ? "#2d4a3e" : "none",
                      color: orderTab === t ? "#f5f1ea" : "#8a9e92",
                      fontFamily: "inherit",
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* Rows */}
              {filteredOrders.length === 0 ? (
                <div
                  style={{
                    padding: "36px 20px",
                    textAlign: "center",
                    color: "#8a9e92",
                    fontSize: 13,
                  }}
                >
                  No orders in this view.
                </div>
              ) : (
                filteredOrders.slice(0, 8).map((order, i) => {
                  const buyerName =
                    order.buyer_info?.organization_name ||
                    order.buyer_info?.business_name ||
                    "Buyer";
                  const initials = buyerName.slice(0, 2).toUpperCase();
                  return (
                    <div
                      key={order.id}
                      onClick={() => router.push(`/seller/orders/${order.id}`)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "36px 1fr auto",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 20px",
                        borderTop: "1px solid #f4f1ec",
                        cursor: "pointer",
                        marginTop: i === 0 ? 12 : 0,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8f4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#2d4a3e",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#f5f1ea",
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>
                            #{order.order_number}
                          </span>
                          <StatusPill status={order.status} />
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: "#8a9e92",
                            marginTop: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {buyerName} ·{" "}
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1c2b23",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmt(order.total_amount, order.currency ?? "XCD")}
                      </div>
                    </div>
                  );
                })
              )}
              <div style={{ height: 8 }} />
            </div>

            {/* Products horizontal scroll */}
            {inventory.length > 0 && (
              <div style={card}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px 12px",
                  }}
                >
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: 0 }}>
                    Your Products
                  </h2>
                  <Link
                    href="/seller/products"
                    style={{ fontSize: 12, fontWeight: 600, color: "#d4783c", textDecoration: "none" }}
                  >
                    Manage →
                  </Link>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    overflowX: "auto",
                    padding: "0 20px 20px",
                    scrollbarWidth: "none",
                  }}
                >
                  {inventory.slice(0, 14).map((p) => {
                    const imgUrl =
                      p.images?.find((img) => img.is_primary)?.image_url ??
                      p.images?.[0]?.image_url;
                    const price = p.sale_price ?? p.base_price ?? 0;
                    const stock = p.stock_quantity ?? 0;
                    const low = p.min_stock_level ?? 5;
                    const stockBg =
                      stock === 0 ? "#fee2e2" : stock <= low ? "#fef3c7" : "#dcfce7";
                    const stockColor =
                      stock === 0 ? "#991b1b" : stock <= low ? "#92400e" : "#065f46";
                    const stockLabel =
                      stock === 0 ? "Out" : stock <= low ? "Low" : `${stock}`;
                    return (
                      <div
                        key={p.id}
                        onClick={() => router.push(`/seller/products/${p.id}/edit`)}
                        style={{
                          flexShrink: 0,
                          width: 136,
                          border: "1px solid #ebe7df",
                          borderRadius: 8,
                          overflow: "hidden",
                          cursor: "pointer",
                          background: "#fff",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4783c")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ebe7df")}
                      >
                        <div style={{ height: 88, background: "#f5f1ea", position: "relative" }}>
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={p.name}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="136px"
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="#b0c0b6" strokeWidth="1.5" width={28} height={28}>
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M9 21V9" />
                              </svg>
                            </div>
                          )}
                          <span
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              padding: "2px 6px",
                              borderRadius: 99,
                              fontSize: 9.5,
                              fontWeight: 700,
                              background: stockBg,
                              color: stockColor,
                            }}
                          >
                            {stockLabel}
                          </span>
                        </div>
                        <div style={{ padding: "8px 10px" }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#1c2b23",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {p.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 2 }}>
                            {fmt(price, p.currency ?? "XCD")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ────────────── RIGHT ────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Quick Actions */}
            <div style={card}>
              <div style={{ padding: "16px 20px 8px" }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: 0 }}>
                  Quick Actions
                </h2>
              </div>
              <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  {
                    label: "Add Product",
                    href: "/seller/add/product",
                    disabled: !isFarmVerified,
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={15} height={15}>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    ),
                  },
                  {
                    label: "View All Orders",
                    href: "/seller/orders",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={15} height={15}>
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    ),
                  },
                  {
                    label: "Manage Inventory",
                    href: "/seller/products",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={15} height={15}>
                        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                      </svg>
                    ),
                  },
                  {
                    label: "Purchase Requests",
                    href: "/seller/purchase-requests",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={15} height={15}>
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Request Payout",
                    href: "/seller/payouts",
                    disabled: !isFarmVerified,
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={15} height={15}>
                        <rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" />
                      </svg>
                    ),
                  },
                  {
                    label: "Analytics",
                    href: "/seller/analytics",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={15} height={15}>
                        <path d="M18 20V10M12 20V4M6 20v-6" />
                      </svg>
                    ),
                  },
                ].map(({ label, href, icon, disabled }) =>
                  disabled ? (
                    <span
                      key={label}
                      title="Complete verification to unlock"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#b0c0b6",
                        cursor: "not-allowed",
                      }}
                    >
                      {icon}
                      {label}
                    </span>
                  ) : (
                    <Link
                      key={label}
                      href={href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1c2b23",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8f4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {icon}
                      {label}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Insights */}
            {insights.length > 0 && (
              <div style={card}>
                <div style={{ padding: "16px 20px 8px" }}>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: 0 }}>
                    Insights
                  </h2>
                </div>
                <div
                  style={{
                    padding: "0 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {insights.slice(0, 4).map((insight) => (
                    <div
                      key={insight.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: insight.urgent ? "rgba(212,120,60,.06)" : "#faf8f4",
                        border: insight.urgent
                          ? "1px solid rgba(212,120,60,.2)"
                          : "1px solid #ebe7df",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: insight.urgent ? "#d4783c" : "#2d4a3e",
                            marginTop: 5,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1c2b23" }}>
                            {insight.title}
                          </div>
                          {insight.sub && (
                            <div style={{ fontSize: 11.5, color: "#8a9e92", marginTop: 3 }}>
                              {insight.sub}
                            </div>
                          )}
                          {insight.actionUrl && (
                            <Link
                              href={insight.actionUrl}
                              style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: "#d4783c",
                                textDecoration: "none",
                                marginTop: 6,
                                display: "inline-block",
                              }}
                            >
                              {insight.cta ?? "Take action →"}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
