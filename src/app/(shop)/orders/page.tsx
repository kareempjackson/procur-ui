"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrders } from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

const COLS = "200px 1fr 96px 96px 72px 108px";

type StatusKey = "all" | "delivered" | "pending" | "cancelled";

function statusDot(s: string): { color: string; bg: string } {
  const k = (s || "").toLowerCase();
  if (k.includes("delivered")) return { color: "#2e7d4f", bg: "#2e7d4f" };
  if (k.includes("pending")) return { color: "#c49a2a", bg: "#c49a2a" };
  if (k.includes("cancelled")) return { color: "#b43c3c", bg: "#b43c3c" };
  return { color: "#8a9e92", bg: "#8a9e92" };
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function BuyerOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, status, error, pagination } = useAppSelector(
    (state) => state.buyerOrders
  );

  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<StatusKey>("all");
  const [search, setSearch] = useState("");
  const limit = 20;

  const ordersList = Array.isArray(orders) ? orders : [];

  const totalPages = useMemo(
    () => Math.max(1, pagination?.totalPages || 0),
    [pagination]
  );
  const totalItems = pagination?.totalItems || 0;

  useEffect(() => {
    dispatch(fetchOrders({ page, limit }));
  }, [page, dispatch]);

  // Client-side filter (API returns all, we filter locally for the tab/search)
  const filtered = useMemo(() => {
    let list = ordersList;
    if (tab !== "all") {
      list = list.filter((o) =>
        (o.status || "").toLowerCase().includes(tab)
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          (o.order_number || o.id || "").toLowerCase().includes(q) ||
          (o.seller_name || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [ordersList, tab, search]);

  const summary = useMemo(() => {
    const delivered = ordersList.filter((o) =>
      (o.status || "").toLowerCase().includes("delivered")
    ).length;
    const pending = ordersList.filter((o) =>
      (o.status || "").toLowerCase().includes("pending")
    ).length;
    const totalPaid = ordersList
      .filter((o) => (o.payment_status || "").toLowerCase() === "paid")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return { delivered, pending, totalPaid };
  }, [ordersList]);

  const loading = status === "loading";

  // Pagination inside filtered list
  const pageSize = 15;
  const filteredPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const [localPage, setLocalPage] = useState(1);
  const pagedRows = filtered.slice((localPage - 1) * pageSize, localPage * pageSize);
  const showingFrom = filtered.length === 0 ? 0 : (localPage - 1) * pageSize + 1;
  const showingTo = Math.min(localPage * pageSize, filtered.length);

  // Reset local page when filter/search changes
  useEffect(() => { setLocalPage(1); }, [tab, search]);

  function fmtUSD(n: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  }

  const TABS: { key: StatusKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "delivered", label: "Delivered" },
    { key: "pending", label: "Pending" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f4",
        fontFamily: "'Urbanist', system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        color: "#1c2b23",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 28px 64px" }}>
        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.3px" }}>
            Your Orders
          </h1>
          <Link
            href="/"
            style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", textDecoration: "none" }}
          >
            Browse Marketplace →
          </Link>
        </div>

        {/* ── Stats ── */}
        {!loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              marginBottom: 36,
            }}
          >
            {[
              {
                label: "Delivered",
                value: summary.delivered,
                note: "Completed",
                noteColor: "#2e7d4f",
                noteArrow: true,
              },
              {
                label: "Pending",
                value: summary.pending,
                note: "Awaiting fulfillment",
                noteColor: "#8a9e92",
                noteArrow: false,
              },
              {
                label: "Total Paid",
                value: fmtUSD(summary.totalPaid),
                note: "Across all orders",
                noteColor: "#8a9e92",
                noteArrow: false,
              },
              {
                label: "All Orders",
                value: totalItems || ordersList.length,
                note: "All time",
                noteColor: "#8a9e92",
                noteArrow: false,
              },
            ].map((s) => (
              <div key={s.label} style={{ padding: 0 }}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#8a9e92",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#1c2b23",
                    letterSpacing: "-.4px",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{ fontSize: 11, color: s.noteColor, marginTop: 4 }}
                >
                  {s.noteArrow ? (
                    <b style={{ fontWeight: 700, color: "#2e7d4f" }}>
                      {s.note} ✓
                    </b>
                  ) : (
                    s.note
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div
            style={{
              background: "#fdf2f2",
              border: "1px solid #f5c6c6",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 20,
              fontSize: 13,
              color: "#b43c3c",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Loader ── */}
        {loading && <ProcurLoader size="md" />}

        {/* ── Empty ── */}
        {!loading && ordersList.length === 0 && !error && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ebe7df",
              borderRadius: 10,
              padding: "52px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#f5f1ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b0c0b6" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c2b23", marginBottom: 8 }}>
              No orders yet
            </h3>
            <p style={{ fontSize: 13, color: "#8a9e92", marginBottom: 24 }}>
              Your orders will appear here after you purchase from suppliers.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "11px 22px",
                background: "#d4783c",
                color: "#fff",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Explore Products
            </Link>
          </div>
        )}

        {/* ── Table card ── */}
        {!loading && ordersList.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #ebe7df",
              overflow: "hidden",
            }}
          >
            {/* Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 20px",
                gap: 4,
                borderBottom: "1px solid #ebe7df",
              }}
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: "5px 12px",
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: tab === t.key ? "#faf8f4" : "#8a9e92",
                    background: tab === t.key ? "#2d4a3e" : "transparent",
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Urbanist', system-ui, sans-serif",
                    transition: "color .12s",
                  }}
                >
                  {t.label}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              {/* Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  background: "#faf8f4",
                  borderRadius: 6,
                  width: 170,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#b0c0b6" strokeWidth="2" width={13} height={13} style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    fontFamily: "'Urbanist', system-ui, sans-serif",
                    fontSize: 11.5,
                    color: "#1c2b23",
                    fontWeight: 500,
                    background: "transparent",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: COLS,
                columnGap: 16,
                alignItems: "center",
                padding: "0 20px",
                height: 38,
                borderBottom: "1px solid #ebe7df",
              }}
            >
              {["Order", "Items", "Total", "Status", "Payment", "Date"].map(
                (h, i) => (
                  <span
                    key={h}
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: "#b0c0b6",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      textAlign: i === 2 ? "right" : "left",
                    }}
                  >
                    {h}
                  </span>
                )
              )}
            </div>

            {/* Rows */}
            {pagedRows.length === 0 ? (
              <div
                style={{
                  padding: "32px 20px",
                  textAlign: "center",
                  fontSize: 13,
                  color: "#8a9e92",
                }}
              >
                No orders match this filter.
              </div>
            ) : (
              pagedRows.map((order, idx) => {
                const dot = statusDot(order.status || "");
                const dt = order.created_at ? fmtDate(order.created_at) : null;

                return (
                  <div
                    key={order.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: COLS,
                      columnGap: 16,
                      alignItems: "start",
                      padding: "14px 20px",
                      borderBottom:
                        idx < pagedRows.length - 1
                          ? "1px solid rgba(235,231,223,.3)"
                          : "none",
                      cursor: "pointer",
                      transition: "background .1s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.background =
                        "#faf8f4")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.background =
                        "transparent")
                    }
                    onClick={() =>
                      (window.location.href = `/orders/${order.id}`)
                    }
                  >
                    {/* Order */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link
                        href={`/orders/${order.id}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#2d4a3e",
                          fontVariantNumeric: "tabular-nums",
                          textDecoration: "none",
                        }}
                      >
                        {order.order_number || `ORD-${order.id.slice(-8).toUpperCase()}`}
                      </Link>
                      <span style={{ fontSize: 10, color: "#b0c0b6", marginTop: 2 }}>
                        {order.seller_name || "—"}
                      </span>
                    </div>

                    {/* Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, overflow: "hidden" }}>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item: any, iIdx: number) => {
                          const name =
                            item.product_name ||
                            item?.product_snapshot?.product_name ||
                            item?.product_snapshot?.name ||
                            "Item";
                          const qty = Number(item.quantity || 0);
                          const unitPrice = Number(
                            item.unit_price ?? item.price_per_unit ?? item.price ?? 0
                          );
                          const imageUrl =
                            item.product_image ||
                            item.image_url ||
                            item?.product_snapshot?.image_url ||
                            null;
                          return (
                            <div
                              key={item.id || `${item.product_id || "i"}-${iIdx}`}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "26px 1fr 32px 48px",
                                gap: 6,
                                alignItems: "center",
                              }}
                            >
                              {/* Thumbnail */}
                              <div
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 5,
                                  overflow: "hidden",
                                  background: "#ebe7df",
                                  flexShrink: 0,
                                  position: "relative",
                                }}
                              >
                                {typeof imageUrl === "string" && imageUrl && (
                                  <Image
                                    src={imageUrl}
                                    alt={name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                  />
                                )}
                              </div>
                              {/* Name */}
                              <span
                                style={{
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  color: "#1c2b23",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {name}
                              </span>
                              {/* Qty */}
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "#b0c0b6",
                                  textAlign: "right",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                ×{qty}
                              </span>
                              {/* Unit price */}
                              <span
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 600,
                                  color: "#8a9e92",
                                  textAlign: "right",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                ${unitPrice.toFixed(2)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <span style={{ fontSize: 12, color: "#8a9e92" }}>—</span>
                      )}
                    </div>

                    {/* Total */}
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#1c2b23",
                        letterSpacing: "-.1px",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ${(order.total_amount || 0).toFixed(2)}
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: dot.color,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: dot.bg,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        {(order.status || "unknown").replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Payment */}
                    <div
                      style={{ fontSize: 10.5, fontWeight: 600, color: "#8a9e92" }}
                    >
                      {(order.payment_status || "—").replace(/_/g, " ")}
                    </div>

                    {/* Date */}
                    <div>
                      {dt ? (
                        <>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#3e5549",
                              fontVariantNumeric: "tabular-nums",
                              display: "block",
                            }}
                          >
                            {dt.date}
                          </span>
                          <span
                            style={{
                              fontSize: 9.5,
                              color: "#b0c0b6",
                              display: "block",
                              marginTop: 1,
                            }}
                          >
                            {dt.time}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: 11, color: "#8a9e92" }}>—</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Table footer: count + pagination */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderTop: "1px solid #ebe7df",
                background: "#faf8f4",
              }}
            >
              <span style={{ fontSize: 11, color: "#b0c0b6" }}>
                {filtered.length === 0
                  ? "No orders"
                  : `Showing ${showingFrom}–${showingTo} of ${filtered.length} order${filtered.length !== 1 ? "s" : ""}`}
              </span>

              {filteredPages > 1 && (
                <div style={{ display: "flex", gap: 2 }}>
                  {/* Prev */}
                  <button
                    onClick={() => setLocalPage((p) => Math.max(p - 1, 1))}
                    disabled={localPage === 1}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 4,
                      border: "none",
                      background: "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: localPage === 1 ? "#b0c0b6" : "#8a9e92",
                      cursor: localPage === 1 ? "default" : "pointer",
                      fontFamily: "'Urbanist', system-ui, sans-serif",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={12} height={12}>
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: filteredPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setLocalPage(n)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 4,
                        border: "none",
                        background: localPage === n ? "#2d4a3e" : "transparent",
                        color: localPage === n ? "#faf8f4" : "#8a9e92",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'Urbanist', system-ui, sans-serif",
                      }}
                    >
                      {n}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    onClick={() =>
                      setLocalPage((p) => Math.min(p + 1, filteredPages))
                    }
                    disabled={localPage === filteredPages}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 4,
                      border: "none",
                      background: "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:
                        localPage === filteredPages ? "#b0c0b6" : "#8a9e92",
                      cursor:
                        localPage === filteredPages ? "default" : "pointer",
                      fontFamily: "'Urbanist', system-ui, sans-serif",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={12} height={12}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* API-level pagination (fetch more pages from server) */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 16,
            }}
          >
            <span style={{ fontSize: 11, color: "#8a9e92" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                padding: "7px 14px",
                background: "#fff",
                border: "1px solid #ebe7df",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                color: "#1c2b23",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
                fontFamily: "'Urbanist', system-ui, sans-serif",
              }}
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                padding: "7px 14px",
                background: "#fff",
                border: "1px solid #ebe7df",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                color: "#1c2b23",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
                fontFamily: "'Urbanist', system-ui, sans-serif",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
