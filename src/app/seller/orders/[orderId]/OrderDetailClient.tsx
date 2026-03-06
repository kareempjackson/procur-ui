"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrderDetail,
  fetchOrderTimeline,
  acceptOrder,
  rejectOrder,
  clearCurrentOrder,
} from "@/store/slices/sellerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";
import { getApiClient } from "@/lib/apiClient";

interface OrderDetailClientProps {
  orderId: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function normalizeAddressToLines(address: any): string[] {
  if (!address) return [];
  const line1 =
    address.line1 ||
    address.address_line1 ||
    address.street ||
    address.street_address ||
    "";
  const line2 = address.line2 || address.address_line2 || address.apartment || "";
  const city = address.city || "";
  const state = address.state || "";
  const postal = address.postal_code || address.postalCode || address.zip || "";
  const country = address.country || "";

  return [line1, line2, [city, state, postal].filter(Boolean).join(", "), country]
    .map((v) => String(v || "").trim())
    .filter(Boolean);
}

const STATUS_META: Record<string, { bg: string; color: string }> = {
  pending:    { bg: "rgba(212,120,60,.12)", color: "#c26838" },
  confirmed:  { bg: "rgba(45,74,62,.10)",  color: "#2d4a3e" },
  accepted:   { bg: "rgba(45,74,62,.10)",  color: "#2d4a3e" },
  preparing:  { bg: "rgba(212,120,60,.12)", color: "#c26838" },
  ready:      { bg: "rgba(212,120,60,.12)", color: "#c26838" },
  in_transit: { bg: "rgba(45,74,62,.10)",  color: "#2d4a3e" },
  shipped:    { bg: "rgba(45,74,62,.10)",  color: "#2d4a3e" },
  delivered:  { bg: "rgba(45,74,62,.12)",  color: "#1a4035" },
  cancelled:  { bg: "rgba(0,0,0,.06)",     color: "#6a7f73" },
  rejected:   { bg: "rgba(0,0,0,.06)",     color: "#6a7f73" },
};

const PAYMENT_META: Record<string, { bg: string; color: string }> = {
  paid:    { bg: "rgba(45,74,62,.10)",  color: "#2d4a3e" },
  pending: { bg: "rgba(212,120,60,.12)", color: "#c26838" },
  failed:  { bg: "rgba(212,60,60,.10)", color: "#9b2020" },
};

function pill(meta: { bg: string; color: string } | undefined): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: ".03em",
    background: meta?.bg ?? "rgba(0,0,0,.06)",
    color: meta?.color ?? "#6a7f73",
    textTransform: "uppercase" as const,
  };
}

// ── component ─────────────────────────────────────────────────────────────────

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const { currentOrder, currentOrderStatus, timeline, timelineStatus, error } =
    useAppSelector((state) => state.sellerOrders);
  const authToken = useAppSelector((state) => state.auth.accessToken);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [rejectForm, setRejectForm] = useState({ reason: "", seller_notes: "" });

  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
    dispatch(fetchOrderTimeline(orderId));
    return () => { dispatch(clearCurrentOrder()); };
  }, [dispatch, orderId]);

  const handleAcceptOrder = async () => {
    const result = await dispatch(acceptOrder({ orderId }));
    if (acceptOrder.fulfilled.match(result)) {
      dispatch(fetchOrderTimeline(orderId));
    }
  };

  const handleRejectOrder = async () => {
    const result = await dispatch(rejectOrder({ orderId, rejectData: rejectForm }));
    if (rejectOrder.fulfilled.match(result)) {
      setShowRejectModal(false);
      dispatch(fetchOrderTimeline(orderId));
    }
  };

  const fmt = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

  const fmtDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "Not set";

  const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ── loading / error states ───────────────────────────────────────────────

  if (currentOrderStatus === "loading" && !currentOrder) {
    return <ProcurLoader size="lg" text="Loading order details..." />;
  }

  if (currentOrderStatus === "failed" && !currentOrder) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>😞</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", marginBottom: 8 }}>Order Not Found</h2>
          <p style={{ fontSize: 14, color: "#8a9e92", marginBottom: 24 }}>
            {error || "The order you're looking for doesn't exist."}
          </p>
          <Link
            href="/seller/orders"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", background: "#d4783c", color: "#fff", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!currentOrder) return null;

  // ── derived values ───────────────────────────────────────────────────────

  const canAccept = currentOrder.status === "pending";
  const paymentStatus = (currentOrder.payment_status || "").toLowerCase();
  const orderStatus = (currentOrder.status || "").toLowerCase();
  const showPaymentPill = Boolean(paymentStatus) && paymentStatus !== orderStatus;
  const canDownloadReceipt = ["paid", "settled"].includes(paymentStatus);
  const receiptBuyerName =
    currentOrder.buyer_info?.organization_name ||
    currentOrder.buyer_info?.business_name ||
    currentOrder.buyer_org_id ||
    "Buyer";

  // ── PDF download ─────────────────────────────────────────────────────────

  const handleDownloadReceipt = async () => {
    if (!currentOrder) return;
    setDownloadingReceipt(true);
    try {
      if (!canDownloadReceipt) {
        show("Receipt is available once payment is complete.");
        return;
      }
      if (!authToken) throw new Error("Missing auth token");

      const fallbackFilename = `procur-receipt-${
        (currentOrder as any)?.invoice_number || currentOrder.order_number || orderId
      }.pdf`;

      const parseFilename = (header?: string) => {
        if (!header) return null;
        const utf8 = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
        if (utf8?.[1]) {
          try { return decodeURIComponent(utf8[1].replace(/(^"|"$)/g, "")); }
          catch { return utf8[1].replace(/(^"|"$)/g, ""); }
        }
        const ascii = header.match(/filename\s*=\s*("?)([^";]+)\1/i);
        return ascii?.[2] ?? null;
      };

      const downloadBlob = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        try {
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.rel = "noopener";
          a.style.display = "none";
          document.body.appendChild(a);
          if (typeof (a as any).download === "undefined") {
            window.open(url, "_blank", "noopener,noreferrer");
          } else {
            a.click();
          }
          a.remove();
        } finally {
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }
      };

      const client = getApiClient(() => authToken);
      const res = await client.get(`/sellers/orders/${orderId}/invoice`, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
      });

      const contentType = (res.headers?.["content-type"] as string | undefined) || "";
      const blob = res.data as Blob;

      if (!contentType.toLowerCase().includes("application/pdf")) {
        let message = "Receipt download failed.";
        try { message = (await blob.text()) || message; } catch { /* ignore */ }
        throw new Error(message);
      }

      const filename =
        parseFilename(res.headers?.["content-disposition"] as string | undefined) ||
        fallbackFilename;

      downloadBlob(blob, filename);
    } catch (e) {
      console.error("Failed to download receipt:", e);
      show("Failed to download receipt. Please try again.");
    } finally {
      setDownloadingReceipt(false);
    }
  };

  // ── shared styles ────────────────────────────────────────────────────────

  const card: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #ebe7df",
    borderRadius: 10,
    padding: 24,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #ebe7df",
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "'Urbanist', system-ui, sans-serif",
    color: "#1c2b23",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#8a9e92",
    marginBottom: 6,
    textTransform: "uppercase" as const,
    letterSpacing: ".04em",
  };

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <Link
            href="/seller/orders"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "#d4783c", textDecoration: "none" }}
          >
            {/* arrow-left */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={15} height={15}>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Orders
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={handleDownloadReceipt}
              disabled={!canDownloadReceipt || downloadingReceipt}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                border: "1px solid #ebe7df",
                borderRadius: 999,
                background: "#fff",
                fontSize: 13,
                fontWeight: 600,
                color: canDownloadReceipt ? "#1c2b23" : "#b0c0b6",
                cursor: canDownloadReceipt && !downloadingReceipt ? "pointer" : "not-allowed",
                opacity: downloadingReceipt ? 0.7 : 1,
                fontFamily: "inherit",
              }}
              title={canDownloadReceipt ? "Download Receipt" : "Receipt available once payment is complete"}
            >
              {/* download icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              {downloadingReceipt ? "Preparing..." : "Download Receipt"}
            </button>

            {canAccept && (
              <>
                <button
                  type="button"
                  onClick={handleAcceptOrder}
                  disabled={currentOrderStatus === "loading"}
                  style={{
                    padding: "8px 18px",
                    background: "#2d4a3e",
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: currentOrderStatus === "loading" ? "not-allowed" : "pointer",
                    opacity: currentOrderStatus === "loading" ? 0.7 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {currentOrderStatus === "loading" ? "Accepting…" : "Accept Order"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  style={{
                    padding: "8px 18px",
                    background: "#fff",
                    color: "#1c2b23",
                    border: "1px solid #ebe7df",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Reject Order
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(212,60,60,.08)", border: "1px solid rgba(212,60,60,.2)", borderRadius: 8, fontSize: 13, color: "#9b2020" }}>
            {error}
          </div>
        )}

        {/* 2-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* ── LEFT column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Order header */}
            <div style={card}>
              {/* "Part of order" banner for multi-seller checkout fulfillments */}
              {(currentOrder as any).parent_order_id && (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#2d4a3e",
                  background: "#f0f7f4",
                  border: "1px solid #c8ddd4",
                  borderRadius: 999,
                  padding: "4px 12px",
                  marginBottom: 12,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={11} height={11}>
                    <path d="M21 10H3M16 6l5 4-5 4"/>
                  </svg>
                  Part of order {currentOrder.order_number}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1c2b23", margin: 0, marginBottom: 6 }}>
                    Order {currentOrder.order_number}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#8a9e92" }}>
                    <span>Placed {new Date(currentOrder.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <span>·</span>
                    <span>
                      Buyer:{" "}
                      <span style={{ color: "#1c2b23", fontWeight: 600 }}>{receiptBuyerName}</span>
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={pill(STATUS_META[orderStatus])}>
                    {currentOrder.status.replace(/_/g, " ")}
                  </span>
                  {showPaymentPill && (
                    <span style={pill(PAYMENT_META[paymentStatus])}>
                      {currentOrder.payment_status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order items */}
            <div style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #ebe7df" }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: 0 }}>Order Items</h2>
              </div>

              {currentOrder.items?.map((item, i) => {
                const imageUrl =
                  (item as any)?.product_image ||
                  (item as any)?.product_snapshot?.product_images?.find(
                    (img: any) => img.is_primary
                  )?.image_url ||
                  (item as any)?.product_snapshot?.image_url ||
                  null;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 24px",
                      borderBottom: i < (currentOrder.items?.length ?? 1) - 1 ? "1px solid #f5f2ec" : "none",
                    }}
                  >
                    <div style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden", background: "#f5f2ec", flexShrink: 0, position: "relative" }}>
                      {imageUrl && (
                        <Image src={imageUrl} alt={item.product_name} fill style={{ objectFit: "cover" }} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1c2b23", marginBottom: 3 }}>
                        {item.product_name}
                      </div>
                      {item.product_sku && (
                        <div style={{ fontSize: 12, color: "#8a9e92" }}>SKU: {item.product_sku}</div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "#8a9e92", marginBottom: 3 }}>Qty: {item.quantity}</div>
                      <div style={{ fontSize: 13, color: "#1c2b23", fontWeight: 500 }}>
                        {fmt(item.unit_price, currentOrder.currency)} ea
                      </div>
                    </div>

                    <div style={{ textAlign: "right", minWidth: 90 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23" }}>
                        {fmt(item.total_price, currentOrder.currency)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Order totals */}
              <div style={{ padding: "16px 24px", borderTop: "1px solid #ebe7df", background: "#faf8f4" }}>
                <div style={{ maxWidth: 280, marginLeft: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Subtotal", value: fmt(currentOrder.subtotal, currentOrder.currency) },
                    { label: "Tax",      value: fmt(currentOrder.tax_amount, currentOrder.currency) },
                    { label: "Shipping", value: fmt(currentOrder.shipping_amount, currentOrder.currency) },
                    ...(currentOrder.discount_amount > 0
                      ? [{ label: "Discount", value: `-${fmt(currentOrder.discount_amount, currentOrder.currency)}`, red: true }]
                      : []),
                  ].map(({ label, value, red }: any) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#8a9e92" }}>{label}</span>
                      <span style={{ fontWeight: 500, color: red ? "#16a34a" : "#1c2b23" }}>{value}</span>
                    </div>
                  ))}

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, paddingTop: 10, borderTop: "1px solid #ebe7df" }}>
                    <span style={{ color: "#1c2b23" }}>Total</span>
                    <span style={{ color: "#d4783c" }}>{fmt(currentOrder.total_amount, currentOrder.currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping information */}
            <div style={card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 18px" }}>Shipping Information</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Shipping address */}
                <div>
                  <div style={labelStyle}>Shipping Address</div>
                  {currentOrder.shipping_address ? (
                    <div style={{ fontSize: 13, color: "#1c2b23", lineHeight: 1.6 }}>
                      {(currentOrder.shipping_address.contact_name || currentOrder.shipping_address.name) && (
                        <div style={{ fontWeight: 600 }}>
                          {currentOrder.shipping_address.contact_name || currentOrder.shipping_address.name}
                        </div>
                      )}
                      {currentOrder.shipping_address.company && (
                        <div style={{ color: "#8a9e92" }}>{currentOrder.shipping_address.company}</div>
                      )}
                      {(currentOrder.shipping_address.street ||
                        currentOrder.shipping_address.street_address ||
                        currentOrder.shipping_address.address_line1) && (
                        <div>
                          {currentOrder.shipping_address.street ||
                            currentOrder.shipping_address.street_address ||
                            currentOrder.shipping_address.address_line1}
                        </div>
                      )}
                      {(currentOrder.shipping_address.apartment ||
                        currentOrder.shipping_address.address_line2) && (
                        <div>
                          {currentOrder.shipping_address.apartment ||
                            currentOrder.shipping_address.address_line2}
                        </div>
                      )}
                      {(currentOrder.shipping_address.city ||
                        currentOrder.shipping_address.state ||
                        currentOrder.shipping_address.postal_code ||
                        currentOrder.shipping_address.zip) && (
                        <div>
                          {currentOrder.shipping_address.city}
                          {currentOrder.shipping_address.state &&
                            `, ${currentOrder.shipping_address.state}`}{" "}
                          {currentOrder.shipping_address.postal_code ??
                            currentOrder.shipping_address.zip}
                        </div>
                      )}
                      {currentOrder.shipping_address.country && (
                        <div>{currentOrder.shipping_address.country}</div>
                      )}
                      {(currentOrder.shipping_address.contact_phone ||
                        currentOrder.shipping_address.phone ||
                        currentOrder.shipping_address.email) && (
                        <div style={{ marginTop: 8, color: "#8a9e92" }}>
                          {(currentOrder.shipping_address.contact_phone ||
                            currentOrder.shipping_address.phone) && (
                            <div>
                              Phone:{" "}
                              {currentOrder.shipping_address.contact_phone ||
                                currentOrder.shipping_address.phone}
                            </div>
                          )}
                          {currentOrder.shipping_address.email && (
                            <div>Email: {currentOrder.shipping_address.email}</div>
                          )}
                        </div>
                      )}
                      {currentOrder.shipping_address.additional_info && (
                        <div style={{ marginTop: 8, fontSize: 12, color: "#8a9e92" }}>
                          {currentOrder.shipping_address.additional_info}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: "#8a9e92" }}>No address provided</div>
                  )}
                </div>

                {/* Delivery details */}
                <div>
                  <div style={labelStyle}>Delivery Details</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                    {currentOrder.shipping_method && (
                      <div>
                        <span style={{ color: "#8a9e92" }}>Method: </span>
                        <span style={{ fontWeight: 600, color: "#1c2b23" }}>{currentOrder.shipping_method}</span>
                      </div>
                    )}
                    {typeof currentOrder.shipping_amount === "number" && (
                      <div>
                        <span style={{ color: "#8a9e92" }}>Shipping cost: </span>
                        <span style={{ fontWeight: 600, color: "#1c2b23" }}>
                          {fmt(currentOrder.shipping_amount, currentOrder.currency)}
                        </span>
                      </div>
                    )}
                    {currentOrder.tracking_number && (
                      <div>
                        <span style={{ color: "#8a9e92" }}>Tracking: </span>
                        <a
                          href={`https://parcelsapp.com/en/tracking/${encodeURIComponent(currentOrder.tracking_number)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#d4783c", fontWeight: 600, textDecoration: "none" }}
                        >
                          {currentOrder.tracking_number}
                        </a>
                      </div>
                    )}
                    {currentOrder.estimated_delivery_date && (
                      <div>
                        <span style={{ color: "#8a9e92" }}>Est. Delivery: </span>
                        <span style={{ fontWeight: 600, color: "#1c2b23" }}>
                          {fmtDate(currentOrder.estimated_delivery_date)}
                        </span>
                      </div>
                    )}
                    {currentOrder.actual_delivery_date && (
                      <div>
                        <span style={{ color: "#8a9e92" }}>Delivered: </span>
                        <span style={{ fontWeight: 600, color: "#1c2b23" }}>
                          {fmtDate(currentOrder.actual_delivery_date)}
                        </span>
                      </div>
                    )}

                    {/* Delivery instructions */}
                    {currentOrder.buyer_notes && (
                      <div style={{ marginTop: 4 }}>
                        <div style={{ color: "#8a9e92", marginBottom: 4 }}>Delivery instructions</div>
                        <p style={{ margin: 0, padding: "10px 12px", background: "#f5f2ec", borderRadius: 8, color: "#1c2b23", lineHeight: 1.5 }}>
                          {currentOrder.buyer_notes}
                        </p>
                      </div>
                    )}

                    {/* Billing address if different */}
                    {currentOrder.billing_address && (() => {
                      const shippingLines = normalizeAddressToLines(currentOrder.shipping_address);
                      const billingLines = normalizeAddressToLines(currentOrder.billing_address);
                      const isSame = shippingLines.join(" | ") === billingLines.join(" | ");
                      return (
                        <div style={{ marginTop: 4 }}>
                          <div style={{ color: "#8a9e92", marginBottom: 4 }}>Billing address</div>
                          {isSame ? (
                            <div style={{ fontSize: 12, color: "#8a9e92" }}>Same as shipping address</div>
                          ) : (
                            <div style={{ fontSize: 13, color: "#1c2b23", lineHeight: 1.6 }}>
                              {billingLines.map((line, idx) => <div key={`${line}-${idx}`}>{line}</div>)}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Internal notes */}
                    {currentOrder.internal_notes && (
                      <div style={{ marginTop: 4 }}>
                        <div style={{ color: "#8a9e92", marginBottom: 4 }}>Packaging / Internal notes</div>
                        <p style={{ margin: 0, padding: "10px 12px", background: "#f5f2ec", borderRadius: 8, color: "#1c2b23", lineHeight: 1.5 }}>
                          {currentOrder.internal_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes (buyer + seller) */}
            {(currentOrder.buyer_notes || currentOrder.seller_notes) && (
              <div style={card}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 16px" }}>Notes</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {currentOrder.buyer_notes && (
                    <div>
                      <div style={labelStyle}>Buyer Notes</div>
                      <p style={{ margin: 0, padding: "10px 12px", background: "#f5f2ec", borderRadius: 8, fontSize: 13, color: "#1c2b23", lineHeight: 1.5 }}>
                        {currentOrder.buyer_notes}
                      </p>
                    </div>
                  )}
                  {currentOrder.seller_notes && (
                    <div>
                      <div style={labelStyle}>Your Notes</div>
                      <p style={{ margin: 0, padding: "10px 12px", background: "rgba(45,74,62,.07)", borderRadius: 8, fontSize: 13, color: "#1c2b23", lineHeight: 1.5 }}>
                        {currentOrder.seller_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Order information */}
            <div style={card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 16px" }}>Order Information</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13 }}>
                <div>
                  <div style={labelStyle}>Order Date</div>
                  <div style={{ fontWeight: 600, color: "#1c2b23" }}>{fmtDate(currentOrder.created_at)}</div>
                </div>
                {currentOrder.accepted_at && (
                  <div>
                    <div style={labelStyle}>Accepted</div>
                    <div style={{ fontWeight: 600, color: "#1c2b23" }}>{fmtDate(currentOrder.accepted_at)}</div>
                  </div>
                )}
                {currentOrder.shipped_at && (
                  <div>
                    <div style={labelStyle}>Shipped</div>
                    <div style={{ fontWeight: 600, color: "#1c2b23" }}>{fmtDate(currentOrder.shipped_at)}</div>
                  </div>
                )}
                {currentOrder.delivered_at && (
                  <div>
                    <div style={labelStyle}>Delivered</div>
                    <div style={{ fontWeight: 600, color: "#1c2b23" }}>{fmtDate(currentOrder.delivered_at)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Order timeline */}
            <div style={card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 16px" }}>Order Timeline</h2>

              {timelineStatus === "loading" && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{
                    width: 22,
                    height: 22,
                    border: "2.5px solid #ebe7df",
                    borderTopColor: "#d4783c",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }} />
                </div>
              )}

              {timelineStatus === "succeeded" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {timeline.length === 0 ? (
                    <div style={{ fontSize: 13, color: "#8a9e92", textAlign: "center", padding: "16px 0" }}>
                      No timeline events yet
                    </div>
                  ) : (
                    timeline.map((event, idx) => (
                      <div key={event.id} style={{ display: "flex", gap: 12 }}>
                        {/* dot + line */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "rgba(45,74,62,.10)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d4783c" }} />
                          </div>
                          {idx < timeline.length - 1 && (
                            <div style={{ width: 1, flex: 1, background: "#ebe7df", margin: "4px 0" }} />
                          )}
                        </div>

                        {/* content */}
                        <div style={{ flex: 1, paddingBottom: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1c2b23" }}>{event.title}</div>
                          {event.description && (
                            <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 2 }}>{event.description}</div>
                          )}
                          <div style={{ fontSize: 11, color: "#b0c0b6", marginTop: 4 }}>
                            {fmtDateTime(event.created_at)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Reject modal */}
      {showRejectModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 600,
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowRejectModal(false); }}
        >
          <div style={{ background: "#fff", borderRadius: 14, maxWidth: 440, width: "100%", padding: 28, fontFamily: "'Urbanist', system-ui, sans-serif" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1c2b23", marginBottom: 20, marginTop: 0 }}>
              Reject Order
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Reason *</label>
                <select
                  value={rejectForm.reason}
                  onChange={(e) => setRejectForm((p) => ({ ...p, reason: e.target.value }))}
                  style={inputStyle}
                  required
                >
                  <option value="">Select a reason…</option>
                  <option value="Out of stock">Out of stock</option>
                  <option value="Cannot meet delivery date">Cannot meet delivery date</option>
                  <option value="Pricing error">Pricing error</option>
                  <option value="Unable to fulfill quantity">Unable to fulfill quantity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Additional Notes (Optional)</label>
                <textarea
                  value={rejectForm.seller_notes}
                  onChange={(e) => setRejectForm((p) => ({ ...p, seller_notes: e.target.value }))}
                  rows={3}
                  placeholder="Provide more details…"
                  style={{ ...inputStyle, resize: "vertical" as const }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={currentOrderStatus === "loading"}
                style={{
                  flex: 1,
                  padding: "9px 16px",
                  border: "1px solid #ebe7df",
                  borderRadius: 999,
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1c2b23",
                  cursor: currentOrderStatus === "loading" ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                disabled={currentOrderStatus === "loading" || !rejectForm.reason}
                style={{
                  flex: 1,
                  padding: "9px 16px",
                  border: "none",
                  borderRadius: 999,
                  background: currentOrderStatus === "loading" || !rejectForm.reason ? "#f0ece4" : "#9b2020",
                  fontSize: 13,
                  fontWeight: 700,
                  color: currentOrderStatus === "loading" || !rejectForm.reason ? "#b0c0b6" : "#fff",
                  cursor: currentOrderStatus === "loading" || !rejectForm.reason ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {currentOrderStatus === "loading" ? "Rejecting…" : "Reject Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
