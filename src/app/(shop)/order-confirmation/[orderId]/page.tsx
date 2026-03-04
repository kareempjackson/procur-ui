"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrderDetail } from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";

// Note: legacy demo data removed; page now uses live order data only

export default function OrderConfirmationPage() {
  const router = useRouter();
  // Use useParams() — correct pattern for "use client" page components in Next.js 15
  const { orderId } = useParams() as { orderId: string };

  const dispatch = useAppDispatch();
  const { show } = useToast();
  const { currentOrder, orderDetailStatus } = useAppSelector(
    (s) => s.buyerOrders
  );
  const authToken = useAppSelector((s) => s.auth.accessToken);
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [groupOrders, setGroupOrders] = useState<any[] | null>(null);
  const [groupLoading, setGroupLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetail(orderId));
    }
  }, [orderId, dispatch]);

  const loading = orderDetailStatus === "loading";
  const order = currentOrder as any | null;

  const checkoutGroupId: string | null =
    (order as any)?.checkout_group_id || null;

  // Load all orders for this checkout group (if present)
  useEffect(() => {
    const load = async () => {
      if (!authToken) return;
      if (!checkoutGroupId) return;
      setGroupLoading(true);
      try {
        const client = getApiClient(() => authToken);
        const { data } = await client.get(`/buyers/orders/group/${checkoutGroupId}`);
        const orders = (data as any)?.orders;
        setGroupOrders(Array.isArray(orders) ? orders : []);
      } catch (e) {
        // Non-fatal: fall back to single-order confirmation rendering
        setGroupOrders(null);
      } finally {
        setGroupLoading(false);
      }
    };
    void load();
  }, [authToken, checkoutGroupId]);

  const ordersToDisplay = useMemo(() => {
    if (Array.isArray(groupOrders) && groupOrders.length > 0) return groupOrders;
    return order ? [order] : [];
  }, [groupOrders, order]);

  const aggregatedTotals = useMemo(() => {
    const list = ordersToDisplay;
    const subtotal = list.reduce((sum, o) => sum + Number(o?.subtotal || 0), 0);
    const buyerShipping = list.reduce(
      (sum, o) => sum + Number(o?.shipping_amount || o?.shipping_cost || 0),
      0
    );
    const sellerShipping = list.reduce(
      (sum, o) => sum + Number(o?.seller_shipping_amount || 0),
      0
    );
    const tax = list.reduce((sum, o) => sum + Number(o?.tax_amount || 0), 0);
    const discount = list.reduce(
      (sum, o) => sum + Number(o?.discount_amount || 0),
      0
    );
    const total = list.reduce(
      (sum, o) => sum + Number(o?.total_amount || 0),
      0
    );
    // Derive transaction fee from totals when not explicitly stored
    const explicitFee = list.reduce(
      (sum, o) => sum + Number(o?.transaction_fee || o?.platform_fee_amount || 0),
      0
    );
    const derivedFee = Math.max(0, total - subtotal - buyerShipping - tax + discount);
    const transactionFee = explicitFee > 0 ? explicitFee : derivedFee;
    return { subtotal, buyerShipping, sellerShipping, tax, discount, transactionFee, total };
  }, [ordersToDisplay]);

  const shipping = order?.shipping_address || {};
  const addrLine1 =
    shipping.address_line1 || shipping.street || shipping.street_address || "";
  const addrLine2 = shipping.address_line2 || shipping.apartment || "";
  const addrCity = shipping.city || "";
  const addrState = shipping.state || "";
  const addrPostal =
    shipping.postal_code || shipping.zip || shipping.zipCode || "";
  const addrCountry = shipping.country || "";

  const handleDownloadInvoice = async () => {
    if (!order) return;

    const fallbackFilename = `procur-invoice-${
      (order as any)?.invoice_number || order.order_number || orderId
    }.pdf`;

    const parseFilenameFromContentDisposition = (headerValue?: string) => {
      if (!headerValue) return null;
      // Supports:
      // - filename="file.pdf"
      // - filename=file.pdf
      // - filename*=UTF-8''file%20name.pdf
      const utf8Match = headerValue.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
      if (utf8Match?.[1]) {
        try {
          return decodeURIComponent(utf8Match[1].replace(/(^"|"$)/g, ""));
        } catch {
          return utf8Match[1].replace(/(^"|"$)/g, "");
        }
      }

      const asciiMatch = headerValue.match(/filename\s*=\s*("?)([^";]+)\1/i);
      if (asciiMatch?.[2]) return asciiMatch[2];

      return null;
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

        // iOS Safari can be unreliable with `download` for blob URLs; open in a new tab as a fallback.
        if (typeof (a as any).download === "undefined") {
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          a.click();
        }
        a.remove();
      } finally {
        // Delay revoke slightly to avoid Safari cancelling the download.
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      }
    };

    const downloadFromApi = async () => {
      if (!authToken) throw new Error("Missing auth token");
      const client = getApiClient(() => authToken);
      const groupId =
        (order as any)?.checkout_group_id && Array.isArray(groupOrders) && groupOrders.length > 1
          ? (order as any)?.checkout_group_id
          : null;
      const url = groupId
        ? `/buyers/orders/group/${groupId}/invoice`
        : `/buyers/orders/${orderId}/invoice`;
      const res = await client.get(url, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
      });

      const contentType =
        (res.headers?.["content-type"] as string | undefined) || "";
      const blob = res.data as Blob;

      // If backend returns JSON error, don't silently download it as a .pdf.
      if (!contentType.toLowerCase().includes("application/pdf")) {
        let message = "Invoice download failed.";
        try {
          const text = await blob.text();
          message = text || message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const contentDisposition = res.headers?.[
        "content-disposition"
      ] as string | undefined;
      const filename =
        parseFilenameFromContentDisposition(contentDisposition) ||
        (groupId ? `procur-invoice-${groupId}.pdf` : fallbackFilename);

      downloadBlob(blob, filename);
    };

    setDownloadingInvoice(true);
    try {
      await downloadFromApi();
    } catch (error) {
      console.error("Failed to download invoice:", error);
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
    } catch (error) {
      console.error("Failed to start conversation:", error);
      show("Failed to start conversation. Please try again.");
    } finally {
      setIsStartingConversation(false);
    }
  };
  const S = {
    pageBg: "#faf8f4",
    cardBg: "#f5f1ea",
    border: "#e8e4dc",
    teal: "#2d4a3e",
    orange: "#d4783c",
    dark: "#1c2b23",
    muted: "#8a9e92",
    font: "'Urbanist', system-ui, sans-serif",
  };

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 14,
    border: `1px solid ${S.border}`,
    padding: "24px",
    marginBottom: 20,
  };

  const stepDot = (active: boolean): React.CSSProperties => ({
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: active ? S.teal : S.cardBg,
    border: `2px solid ${active ? S.teal : S.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: active ? "#fff" : S.muted,
    flexShrink: 0,
  });

  return (
    <div style={{ minHeight: "100vh", background: S.pageBg, fontFamily: S.font }}>
      <main style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px" }}>

        {/* Success Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              background: "#f0f7f4",
              borderRadius: "50%",
              marginBottom: 16,
              fontSize: 36,
            }}
          >
            ✓
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: S.dark, marginBottom: 8 }}>
            Order Confirmed!
          </h1>
          <p style={{ fontSize: 16, color: S.muted }}>
            Thank you for your order. We&apos;ve sent a confirmation email to your inbox.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ ...card, display: "flex", justifyContent: "center" }}>
            <ProcurLoader size="md" text="Loading your order..." />
          </div>
        )}

        {/* Order Number & Actions */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as any, gap: 16 }}>
            <div>
              <p style={{ fontSize: 13, color: S.muted, marginBottom: 4 }}>
                Order Number{ordersToDisplay.length > 1 ? "s" : ""}
              </p>
              <p style={{ fontSize: 22, fontWeight: 800, color: S.dark }}>
                {ordersToDisplay.length > 1
                  ? `${ordersToDisplay.length} supplier orders`
                  : order?.order_number || "--"}
              </p>
              {groupLoading && checkoutGroupId ? (
                <p style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>
                  Loading full checkout…
                </p>
              ) : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  border: `1px solid ${S.border}`,
                  background: "#fff",
                  color: S.dark,
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: S.font,
                  opacity: downloadingInvoice ? 0.5 : 1,
                }}
              >
                ⬇ {downloadingInvoice
                  ? "Preparing Invoice..."
                  : ordersToDisplay.length > 1
                    ? "Download Invoice (All)"
                    : "Download Invoice"}
              </button>
              <Link
                href={`/orders/${orderId}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  background: S.orange,
                  color: "#fff",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                🚚 Track Order
              </Link>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: S.dark, marginBottom: 20 }}>
            What&apos;s Next?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                emoji: "✓",
                active: true,
                label: "Order Placed",
                sub: order?.created_at
                  ? new Date(order.created_at).toLocaleString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })
                  : null,
              },
              { emoji: "✓", active: false, label: "Seller Accepts Order", sub: "Usually within 24 hours" },
              { emoji: "🚚", active: false, label: "Order Shipped", sub: "You'll receive tracking information" },
              {
                emoji: "📍",
                active: false,
                label: "Delivered",
                sub: order?.estimated_delivery_date
                  ? `Estimated by ${order.estimated_delivery_date}`
                  : null,
              },
            ].map((step, i, arr) => (
              <div key={step.label} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={stepDot(step.active)}>{step.emoji}</div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: S.border, margin: "4px 0" }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: i < arr.length - 1 ? 20 : 0 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: S.dark, marginBottom: 2 }}>
                    {step.label}
                  </h3>
                  {step.sub && (
                    <p style={{ fontSize: 13, color: S.muted }}>{step.sub}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
          {ordersToDisplay.map((o: any) => (
            <div
              key={o.id}
              style={{
                background: "#fff",
                borderRadius: 14,
                border: `1px solid ${S.border}`,
                overflow: "hidden",
              }}
            >
              {/* Seller Header */}
              <div
                style={{
                  background: S.cardBg,
                  padding: "16px 24px",
                  borderBottom: `1px solid ${S.border}`,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 24,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: S.dark }}>
                      {o.seller_name || "Seller"}
                    </h3>
                    {ordersToDisplay.length > 1 && o.order_number && (
                      <span style={{ fontSize: 12, color: S.muted }}>• {o.order_number}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: S.muted }}>
                    📅 Estimated delivery: {o.estimated_delivery_date || "TBD"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, color: S.muted, marginBottom: 4 }}>Subtotal</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: S.dark }}>
                    ${Number(o.subtotal || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                {(o.items || []).map((item: any) => (
                  <div key={item.id} style={{ display: "flex", gap: 14 }}>
                    <div
                      style={{
                        position: "relative",
                        width: 72,
                        height: 72,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: S.cardBg,
                        flexShrink: 0,
                      }}
                    >
                      {(item.product_image ||
                        item.product_snapshot?.product_images?.find((img: any) => img.is_primary)?.image_url ||
                        item.product_snapshot?.image_url) ? (
                        <Image
                          src={
                            item.product_image ||
                            item.product_snapshot?.product_images?.find((img: any) => img.is_primary)?.image_url ||
                            item.product_snapshot?.image_url
                          }
                          alt={item.product_name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : null}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: S.dark, marginBottom: 4 }}>
                        {item.product_name}
                      </h4>
                      <p style={{ fontSize: 13, color: S.muted }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: S.dark }}>
                        ${Number(item.total_price || item.unit_price * item.quantity || 0).toFixed(2)}
                      </p>
                      <p style={{ fontSize: 12, color: S.muted }}>
                        ${Number(item.unit_price || 0).toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}

                {/* Contact Seller */}
                <div
                  style={{
                    paddingTop: 16,
                    borderTop: `1px solid ${S.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ fontSize: 13, color: S.muted }}>Order ID: {o.id}</p>
                  <button
                    onClick={async () => {
                      if (!authToken || !o?.id) return;
                      setIsStartingConversation(true);
                      try {
                        const client = getApiClient(() => authToken);
                        const { data } = await client.post("/conversations/start", {
                          contextType: "order",
                          contextId: o.id,
                          withOrgId: o.seller_org_id,
                          title: `Order ${o.order_number || o.id}`,
                        });
                        router.push(`/inbox?conversationId=${data.id}`);
                      } catch (error) {
                        console.error("Failed to start conversation:", error);
                        show("Failed to start conversation. Please try again.");
                      } finally {
                        setIsStartingConversation(false);
                      }
                    }}
                    disabled={isStartingConversation || !authToken}
                    style={{
                      padding: "8px 18px",
                      background: S.orange,
                      color: "#fff",
                      border: "none",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: S.font,
                      opacity: isStartingConversation || !authToken ? 0.6 : 1,
                    }}
                  >
                    {isStartingConversation ? "Opening chat..." : "Contact Seller"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping & Payment */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {/* Shipping Address */}
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: S.dark, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              📍 Shipping Address
            </h3>
            <div style={{ fontSize: 13, color: S.dark, lineHeight: 1.7 }}>
              {(shipping.name || shipping.contact_name) && (
                <p style={{ fontWeight: 600 }}>{shipping.name || shipping.contact_name}</p>
              )}
              {addrLine1 && <p style={{ color: S.muted }}>{addrLine1}</p>}
              {addrLine2 && <p style={{ color: S.muted }}>{addrLine2}</p>}
              {(addrCity || addrState || addrPostal) && (
                <p style={{ color: S.muted }}>{[addrCity, addrState, addrPostal].filter(Boolean).join(" ")}</p>
              )}
              {addrCountry && <p style={{ color: S.muted }}>{addrCountry}</p>}
              {(shipping.phone || shipping.contact_phone) && (
                <p style={{ color: S.muted, marginTop: 4 }}>{shipping.phone || shipping.contact_phone}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: S.dark, marginBottom: 12 }}>
              💳 Payment Method
            </h3>
            <div style={{ fontSize: 13 }}>
              <p style={{ fontWeight: 600, color: S.dark, textTransform: "capitalize", marginBottom: 4 }}>
                {order?.payment_status || "pending"}
              </p>
              <p style={{ color: S.muted }}>
                Total ${Number(order?.total_amount || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: S.dark, marginBottom: 16 }}>
            Order Summary
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Subtotal", value: aggregatedTotals.subtotal },
              { label: "Tax", value: aggregatedTotals.tax },
              { label: "Buyer Shipping", value: aggregatedTotals.buyerShipping },
              { label: "Seller Shipping", value: aggregatedTotals.sellerShipping },
              { label: "Transaction Fee", value: aggregatedTotals.transactionFee },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: S.muted }}>{label}</span>
                <span style={{ fontWeight: 600, color: S.dark }}>${Number(value || 0).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: `1px dashed ${S.border}`, paddingTop: 10, marginTop: 2 }}>
              <span style={{ color: aggregatedTotals.discount > 0 ? "#059669" : S.muted }}>Discount</span>
              <span style={{ fontWeight: 600, color: aggregatedTotals.discount > 0 ? "#059669" : S.dark }}>
                {aggregatedTotals.discount > 0 ? "-" : ""}${Number(aggregatedTotals.discount || 0).toFixed(2)}
              </span>
            </div>
            <div
              style={{
                borderTop: `1px solid ${S.border}`,
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, color: S.dark }}>Total paid by buyer</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: S.dark }}>
                ${Number(aggregatedTotals.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              background: S.orange,
              color: "#fff",
              borderRadius: 999,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}
