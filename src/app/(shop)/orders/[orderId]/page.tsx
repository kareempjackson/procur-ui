"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrderDetail,
  cancelOrder,
  clearCurrentOrder,
} from "@/store/slices/buyerOrdersSlice";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";

const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  pending:   { color: "#c49a2a", bg: "#fffbeb" },
  accepted:  { color: "#3d5a99", bg: "#eff4ff" },
  processing:{ color: "#6b46c1", bg: "#f5f0ff" },
  shipped:   { color: "#2d6a9f", bg: "#eff6ff" },
  delivered: { color: "#2e7d4f", bg: "#f0f7f4" },
  cancelled: { color: "#b43c3c", bg: "#fdf2f2" },
  rejected:  { color: "#b43c3c", bg: "#fdf2f2" },
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "9px 0", borderBottom: "1px solid #f0ece6" }}>
      <span style={{ fontSize: 12, color: "#8a9e92" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1c2b23" }}>{value}</span>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const { currentOrder: order, orders: orderList, orderDetailStatus, orderDetailError } =
    useAppSelector((s) => s.buyerOrders);
  const authToken = useAppSelector((s) => s.auth.accessToken);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  const { orderId } = React.use(params);

  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
    return () => { dispatch(clearCurrentOrder()); };
  }, [orderId, dispatch]);

  const handleDownloadInvoice = async () => {
    if (!order || !authToken) return;
    const fallbackFilename = `procur-invoice-${(order as any)?.invoice_number || order.order_number || orderId}.pdf`;
    setDownloadingInvoice(true);
    try {
      const client = getApiClient(() => authToken);
      const res = await client.get(`/buyers/orders/${orderId}/invoice`, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
      });
      const blob = res.data as Blob;
      const contentDisposition = res.headers?.["content-disposition"] as string | undefined;
      let filename = fallbackFilename;
      if (contentDisposition) {
        const m = contentDisposition.match(/filename\*?\s*=\s*(?:UTF-8'')?["']?([^"';\r\n]+)/i);
        if (m?.[1]) filename = decodeURIComponent(m[1].replace(/(^"|"$)/g, ""));
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.style.display = "none";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch {
      show("Failed to download invoice. Please try again.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const handleContactSeller = async () => {
    if (!authToken || !order) return;
    setIsStartingConversation(true);
    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.post("/conversations/start", {
        contextType: "order",
        contextId: orderId,
        withOrgId: order.seller_org_id,
        title: `Order ${order.order_number}`,
      });
      router.push(`/inbox?conversationId=${data.id}`);
    } catch {
      show("Failed to start conversation. Please try again.");
    } finally {
      setIsStartingConversation(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancellingOrder(true);
    try {
      await dispatch(cancelOrder({ orderId, reason: cancelReason })).unwrap();
      setShowCancelDialog(false);
      dispatch(fetchOrderDetail(orderId));
    } catch {
      show("Failed to cancel order. Please try again.");
    } finally {
      setCancellingOrder(false);
    }
  };

  // ── Loading / error states ──
  if (orderDetailStatus === "loading" && !order) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ProcurLoader size="md" />
      </div>
    );
  }

  if (orderDetailStatus === "failed" && orderDetailError) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Urbanist', system-ui, sans-serif" }}>
        <p style={{ fontSize: 15, color: "#6a7f73" }}>{orderDetailError}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => router.push("/orders")} style={{ padding: "10px 20px", border: "1px solid #e8e4dc", background: "#fff", borderRadius: 999, fontWeight: 600, fontSize: 13, color: "#1c2b23", cursor: "pointer", fontFamily: "inherit" }}>
            ← Back to Orders
          </button>
          <button onClick={() => dispatch(fetchOrderDetail(orderId))} style={{ padding: "10px 20px", background: "#2d4a3e", border: "none", borderRadius: 999, fontWeight: 700, fontSize: 13, color: "#f5f1ea", cursor: "pointer", fontFamily: "inherit" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "'Urbanist', system-ui, sans-serif" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1c2b23" }}>Order not found</p>
        <button onClick={() => router.push("/orders")} style={{ padding: "10px 20px", background: "#2d4a3e", border: "none", borderRadius: 999, fontWeight: 700, fontSize: 13, color: "#f5f1ea", cursor: "pointer", fontFamily: "inherit" }}>
          ← Your Orders
        </button>
      </div>
    );
  }

  // ── Data helpers ──
  const normalizeItems = (items: any) => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (Array.isArray(items?.data)) return items.data;
    return [];
  };
  const fallbackOrder = Array.isArray(orderList) ? orderList.find((o: any) => o.id === orderId) : null;
  const rawItems =
    (order as any)?.items ?? (order as any)?.order_items ?? (order as any)?.line_items ??
    (fallbackOrder as any)?.items ?? (fallbackOrder as any)?.order_items ?? (fallbackOrder as any)?.line_items ?? [];
  const orderItems = normalizeItems(rawItems);

  const canCancel = order.status === "pending" || order.status === "accepted";
  const canReview = order.status === "delivered";
  const statusKey = (order.status || "").toLowerCase();
  const sc = STATUS_COLOR[statusKey] || { color: "#8a9e92", bg: "#f5f1ea" };

  const fmtUSD = (n: number) =>
    `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const acceptedAt = (order as any)?.accepted_at as string | undefined;
  const shippedAt = (order as any)?.shipped_at as string | undefined;
  const deliveredAt = (order as any)?.delivered_at as string | undefined;
  const actualDeliveryDate = (order as any)?.actual_delivery_date as string | undefined;
  const trackingNumber = (order as any)?.tracking_number as string | undefined;
  const shippingMethod = (order as any)?.shipping_method as string | undefined;

  const statusOrder = ["pending", "accepted", "processing", "shipped", "delivered"];
  const currentStatusIndex = Math.max(statusOrder.indexOf(statusKey), 0);

  const steps = [
    { key: "placed",    label: "Placed",    ts: order.created_at,                                  done: true },
    { key: "accepted",  label: "Accepted",  ts: acceptedAt,                                        done: currentStatusIndex >= statusOrder.indexOf("accepted") || !!acceptedAt },
    { key: "shipped",   label: "Shipped",   ts: shippedAt,                                         done: currentStatusIndex >= statusOrder.indexOf("shipped")  || !!shippedAt  },
    { key: "delivered", label: "Delivered", ts: deliveredAt || actualDeliveryDate, eta: order.estimated_delivery_date,
      done: currentStatusIndex >= statusOrder.indexOf("delivered") || !!(deliveredAt || actualDeliveryDate) },
  ];
  const lastDoneIdx = steps.map((s) => s.done).lastIndexOf(true);

  const shippingAmount = Number((order as any)?.shipping_amount ?? (order as any)?.shipping_cost ?? 0);
  const platformFeeExplicit = Number((order as any)?.platform_fee_amount ?? (order as any)?.platform_fee ?? 0);
  const platformFee = platformFeeExplicit > 0
    ? platformFeeExplicit
    : Math.max(0, (order.total_amount || 0) - (order.subtotal || 0) - shippingAmount + Number((order as any)?.discount_amount ?? 0));

  const addr = order.shipping_address as any;

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif", WebkitFontSmoothing: "antialiased", color: "#1c2b23" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 28px 72px" }}>

        {/* ── Top bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <Link href="/orders" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#2d4a3e", textDecoration: "none" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Your Orders
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid #e8e4dc", background: "#fff", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#1c2b23", cursor: downloadingInvoice ? "not-allowed" : "pointer", opacity: downloadingInvoice ? 0.5 : 1, fontFamily: "inherit" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={13} height={13}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {downloadingInvoice ? "Preparing…" : "Invoice"}
            </button>
            {canReview && (
              <Link href={`/orders/${orderId}/review`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#d4783c", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={13} height={13}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Write Review
              </Link>
            )}
          </div>
        </div>

        {/* ── Order identity ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.3px", margin: 0 }}>
              {order.order_number || `ORD-${orderId.slice(-8).toUpperCase()}`}
            </h1>
            <span style={{ fontSize: 11, fontWeight: 700, color: sc.color, background: sc.bg, padding: "3px 10px", borderRadius: 999 }}>
              {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
            </span>
            {canCancel && (
              <button
                onClick={() => setShowCancelDialog(true)}
                style={{ fontSize: 11, fontWeight: 700, color: "#b43c3c", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
              >
                Cancel order
              </button>
            )}
          </div>
          <p style={{ fontSize: 12, color: "#8a9e92", margin: 0 }}>
            Placed {fmtDate(order.created_at)}
            {(order as any).is_aggregate ? (
              <> · <span style={{ color: "#6a7f73", fontWeight: 600 }}>Multiple Sellers</span></>
            ) : (
              order.seller_name && <> · <span style={{ color: "#6a7f73", fontWeight: 600 }}>{order.seller_name}</span></>
            )}
          </p>
        </div>

        {/* ── Horizontal stepper ── */}
        <div
          style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "20px 28px", marginBottom: 24 }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            {/* Connecting track */}
            <div style={{ position: "absolute", top: 11, left: 0, right: 0, height: 2, background: "#ebe7df", zIndex: 0 }} />
            <div style={{ position: "absolute", top: 11, left: 0, height: 2, background: "#2d4a3e", zIndex: 1, width: `${(lastDoneIdx / (steps.length - 1)) * 100}%`, transition: "width .4s" }} />

            {steps.map((step, i) => {
              const done = step.done;
              const current = !done && i === lastDoneIdx + 1;
              const ts = step.ts ? fmtDateTime(step.ts) : step.key === "delivered" && step.eta ? `ETA ${fmtDate(step.eta)}` : null;
              return (
                <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative", zIndex: 2 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: done ? "#2d4a3e" : current ? "#fff" : "#fff",
                    border: done ? "2px solid #2d4a3e" : current ? "2px solid #2d4a3e" : "2px solid #d8d2c8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "none",
                    transition: "all .2s",
                  }}>
                    {done ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" width={11} height={11}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : current ? (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2d4a3e", display: "block" }} />
                    ) : (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d8d2c8", display: "block" }} />
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: done || current ? "#1c2b23" : "#b0c0b6", marginTop: 8, whiteSpace: "nowrap" }}>
                    {step.label}
                  </span>
                  {ts && (
                    <span style={{ fontSize: 9.5, color: "#b0c0b6", marginTop: 2, textAlign: "center" }}>{ts}</span>
                  )}
                  {current && !ts && (
                    <span style={{ fontSize: 9.5, color: "#c49a2a", marginTop: 2 }}>In progress</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tracking / shipping info */}
          {(trackingNumber || shippingMethod) && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, paddingTop: 16, borderTop: "1px solid #f0ece6", flexWrap: "wrap" }}>
              {shippingMethod && (
                <span style={{ fontSize: 11, color: "#6a7f73", background: "#f5f1ea", padding: "4px 10px", borderRadius: 999 }}>
                  {shippingMethod}
                </span>
              )}
              {trackingNumber && (
                <span style={{ fontSize: 11, color: "#6a7f73" }}>
                  Tracking #{" "}
                  <a href={`https://parcelsapp.com/en/tracking/${encodeURIComponent(trackingNumber)}`} target="_blank" rel="noopener noreferrer" style={{ color: "#2d4a3e", fontWeight: 700, textDecoration: "none" }}>
                    {trackingNumber}
                  </a>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Two-column body ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

          {/* Left: items + notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Items card — aggregate (multi-seller) or single seller */}
            {(order as any).is_aggregate && Array.isArray((order as any).fulfillments) && (order as any).fulfillments.length > 0 ? (
              // Aggregate view: one card per seller fulfillment
              (order as any).fulfillments.map((fulfillment: any) => {
                const fStatus = (fulfillment.status || "pending").toLowerCase();
                const fSc = STATUS_COLOR[fStatus] || { color: "#8a9e92", bg: "#f5f1ea" };
                return (
                  <div key={fulfillment.id} style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #f0ece6", background: "#f9f7f4" }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23" }}>{fulfillment.seller_name || "Seller"}</span>
                        {fulfillment.tracking_number && (
                          <span style={{ fontSize: 11, color: "#8a9e92", marginLeft: 8 }}>
                            Tracking #{" "}
                            <a href={`https://parcelsapp.com/en/tracking/${encodeURIComponent(fulfillment.tracking_number)}`} target="_blank" rel="noopener noreferrer" style={{ color: "#2d4a3e", fontWeight: 700 }}>
                              {fulfillment.tracking_number}
                            </a>
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: fSc.color, background: fSc.bg, padding: "3px 10px", borderRadius: 999 }}>
                        {fStatus.charAt(0).toUpperCase() + fStatus.slice(1)}
                      </span>
                    </div>
                    {(fulfillment.items || []).map((item: any, index: number) => {
                      const qty = Number(item.quantity || 0);
                      const unitPrice = Number(item.unit_price ?? 0);
                      const lineTotal = Number(item.total_price ?? qty * unitPrice);
                      const unit = item.unit || item.unit_of_measurement || item?.product_snapshot?.unit_of_measurement || "";
                      const name = item.product_name || "Item";
                      const imageUrl = item.product_image || item.image_url || item?.product_snapshot?.image_url || null;
                      return (
                        <div key={item.id || `fi-${index}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 20px", borderBottom: index < (fulfillment.items.length - 1) ? "1px solid rgba(235,231,223,.4)" : "none" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", border: "1px solid #e8e4dc", background: "#f5f1ea", flexShrink: 0, position: "relative" }}>
                              {imageUrl ? <Image src={imageUrl} alt={name} fill style={{ objectFit: "cover" }} /> : null}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                              <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>×{qty}{unit ? ` ${unit}` : ""} · {fmtUSD(unitPrice)} each</p>
                            </div>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: 0, flexShrink: 0 }}>{fmtUSD(lineTotal)}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              // Single-seller view (legacy or single-seller order)
              <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0ece6" }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23", margin: 0 }}>Items Purchased</h2>
                  <span style={{ fontSize: 11, color: "#8a9e92" }}>{orderItems.length} item{orderItems.length !== 1 ? "s" : ""}</span>
                </div>

                {orderItems.length === 0 ? (
                  <p style={{ padding: "20px", fontSize: 13, color: "#8a9e92", margin: 0 }}>No items found for this order.</p>
                ) : (
                  orderItems.map((item: any, index: number) => {
                    const qty = Number(item.quantity || 0);
                    const unitPrice = Number(item.unit_price ?? item.price_per_unit ?? item.price ?? 0);
                    const lineTotal = Number(item.total_price ?? item.subtotal ?? qty * unitPrice);
                    const unit = item.unit || item.unit_of_measurement || item?.product_snapshot?.unit_of_measurement || item?.product_snapshot?.unit || "";
                    const name = item.product_name || item?.product_snapshot?.product_name || item?.product_snapshot?.name || "Item";
                    const imageUrl = item.product_image || item.image_url || item?.product_snapshot?.image_url || null;

                    return (
                      <div
                        key={item.id || `${item.product_id || "i"}-${index}`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 20px", borderBottom: index < orderItems.length - 1 ? "1px solid rgba(235,231,223,.4)" : "none" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                          {/* Thumbnail */}
                          <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", border: "1px solid #e8e4dc", background: "#f5f1ea", flexShrink: 0, position: "relative" }}>
                            {typeof imageUrl === "string" && imageUrl ? (
                              <Image src={imageUrl} alt={name} fill style={{ objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#c8c0b8" strokeWidth="1.5" width={18} height={18}>
                                  <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                            <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>
                              ×{qty}{unit ? ` ${unit}` : ""}
                              <span style={{ margin: "0 5px", color: "#d8d2c8" }}>·</span>
                              {fmtUSD(unitPrice)} each
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: 0, fontVariantNumeric: "tabular-nums" }}>{fmtUSD(lineTotal)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Delivery notes */}
            {order.buyer_notes && (
              <div style={{ background: "#f0f7f4", border: "1px solid #c8ddd4", borderRadius: 10, padding: "14px 18px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#2d4a3e", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 6px" }}>Delivery Instructions</p>
                <p style={{ fontSize: 13, color: "#3e5549", margin: 0, lineHeight: 1.6 }}>{order.buyer_notes}</p>
              </div>
            )}
          </div>

          {/* Right: sticky sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 }}>

            {/* Order summary */}
            <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "18px 20px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 4px" }}>Order Summary</h3>
              <div style={{ marginTop: 12 }}>
                <Row label="Subtotal" value={fmtUSD(order.subtotal || 0)} />
                <Row label="Delivery fee" value={fmtUSD(shippingAmount)} />
                <Row label="Platform fee" value={fmtUSD(platformFee)} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, paddingTop: 14, borderTop: "2px solid #1c2b23" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.4px", fontVariantNumeric: "tabular-nums" }}>{fmtUSD(order.total_amount || 0)}</span>
              </div>
              {/* Payment status */}
              {order.payment_status && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0ece6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#8a9e92" }}>Payment</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: order.payment_status === "paid" ? "#2e7d4f" : "#c49a2a", background: order.payment_status === "paid" ? "#f0f7f4" : "#fffbeb", padding: "3px 10px", borderRadius: 999 }}>
                    {order.payment_status}
                  </span>
                </div>
              )}
            </div>

            {/* Seller(s) */}
            <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "18px 20px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 12px" }}>
                {(order as any).is_aggregate ? "Suppliers" : "Supplier"}
              </h3>
              {(order as any).is_aggregate && Array.isArray((order as any).fulfillments) ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(order as any).fulfillments.map((f: any) => (
                    <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2d4a3e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{(f.seller_name || "?").charAt(0)}</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#1c2b23", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.seller_name || "—"}</p>
                        <p style={{ fontSize: 10, color: "#8a9e92", margin: "1px 0 0", textTransform: "capitalize" }}>{f.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#2d4a3e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{(order.seller_name || "?").charAt(0)}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: 0 }}>{order.seller_name || "—"}</p>
                      {order.seller_location && (
                        <p style={{ fontSize: 11, color: "#8a9e92", margin: "2px 0 0" }}>{order.seller_location}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleContactSeller}
                    disabled={isStartingConversation}
                    style={{ width: "100%", padding: "10px 16px", background: "#2d4a3e", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#f5f1ea", cursor: isStartingConversation ? "not-allowed" : "pointer", opacity: isStartingConversation ? 0.6 : 1, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={13} height={13}>
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    {isStartingConversation ? "Loading…" : "Message Supplier"}
                  </button>
                </>
              )}
            </div>

            {/* Delivery address */}
            {addr && (
              <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "18px 20px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 10px" }}>Delivery Address</h3>
                <div style={{ fontSize: 12, color: "#6a7f73", lineHeight: 1.7 }}>
                  {(addr.contact_name || addr.name) && <p style={{ fontWeight: 700, color: "#1c2b23", margin: "0 0 2px" }}>{addr.contact_name || addr.name}</p>}
                  <p style={{ margin: 0 }}>{addr.line1 || addr.address_line1 || addr.street_address || ""}</p>
                  {(addr.line2 || addr.address_line2) && <p style={{ margin: 0 }}>{addr.line2 || addr.address_line2}</p>}
                  <p style={{ margin: 0 }}>{[addr.city, addr.state, addr.postal_code].filter(Boolean).join(", ")}</p>
                  {addr.country && <p style={{ margin: 0 }}>{addr.country}</p>}
                  {(addr.phone || addr.contact_phone) && <p style={{ margin: "4px 0 0", color: "#8a9e92" }}>{addr.phone || addr.contact_phone}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cancel dialog ── */}
      {showCancelDialog && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}
          onClick={() => setShowCancelDialog(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 16, maxWidth: 420, width: "100%", padding: "28px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1c2b23", margin: "0 0 8px", letterSpacing: "-.2px" }}>Cancel this order?</h3>
            <p style={{ fontSize: 13, color: "#6a7f73", margin: "0 0 18px", lineHeight: 1.6 }}>This action cannot be undone. The supplier will be notified.</p>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>
              Reason (optional)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Let us know why you're cancelling…"
              rows={3}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #e8e4dc", borderRadius: 8, fontSize: 13, color: "#1c2b23", background: "#fff", outline: "none", resize: "none", fontFamily: "'Urbanist', system-ui, sans-serif", boxSizing: "border-box", marginBottom: 18 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowCancelDialog(false)}
                style={{ flex: 1, padding: "11px 16px", border: "1px solid #e8e4dc", background: "#f5f1ea", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#1c2b23", cursor: "pointer", fontFamily: "inherit" }}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
                style={{ flex: 1, padding: "11px 16px", background: "#b43c3c", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#fff", cursor: cancellingOrder ? "not-allowed" : "pointer", opacity: cancellingOrder ? 0.6 : 1, fontFamily: "inherit" }}
              >
                {cancellingOrder ? "Cancelling…" : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
