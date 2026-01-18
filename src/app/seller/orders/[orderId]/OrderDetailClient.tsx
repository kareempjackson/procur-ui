"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
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

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

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

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const { currentOrder, currentOrderStatus, timeline, timelineStatus, error } =
    useAppSelector((state) => state.sellerOrders);
  const authToken = useAppSelector((state) => state.auth.accessToken);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  // Reject form state
  const [rejectForm, setRejectForm] = useState({
    reason: "",
    seller_notes: "",
  });

  // Fetch order details and timeline on mount
  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
    dispatch(fetchOrderTimeline(orderId));

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  const handleAcceptOrder = async () => {
    const result = await dispatch(acceptOrder({ orderId }));
    if (acceptOrder.fulfilled.match(result)) {
      dispatch(fetchOrderTimeline(orderId));
    }
  };

  const handleRejectOrder = async () => {
    const result = await dispatch(
      rejectOrder({ orderId, rejectData: rejectForm })
    );
    if (rejectOrder.fulfilled.match(result)) {
      setShowRejectModal(false);
      // Refresh timeline
      dispatch(fetchOrderTimeline(orderId));
    }
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case "confirmed":
      case "accepted":
        return "bg-[#A6B1E7]/20 text-[#8091D5]";
      case "preparing":
      case "ready":
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case "in_transit":
      case "shipped":
        return "bg-[#A6B1E7]/20 text-[#8091D5]";
      case "delivered":
        return "bg-[#C0D1C7]/20 text-[#407178]";
      case "cancelled":
      case "rejected":
        return "bg-[#6C715D]/20 text-[#6C715D]";
      default:
        return "bg-[#6C715D]/20 text-[#6C715D]";
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-[#C0D1C7]/20 text-[#407178]";
      case "pending":
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case "failed":
        return "bg-[#CB5927]/20 text-[#653011]";
      default:
        return "bg-[#6C715D]/20 text-[#6C715D]";
    }
  };

  if (currentOrderStatus === "loading" && !currentOrder) {
    return <ProcurLoader size="lg" text="Loading order details..." />;
  }

  if (currentOrderStatus === "failed" && !currentOrder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-semibold text-[var(--secondary-black)] mb-2">
            Order Not Found
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-6">
            {error || "The order you're looking for doesn't exist."}
          </p>
          <Link
            href="/seller/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!currentOrder) return null;

  const canAccept = currentOrder.status === "pending";
  // Order status updates are now handled internally by the admin team

  const paymentStatus = (currentOrder.payment_status || "").toLowerCase();
  const orderStatus = (currentOrder.status || "").toLowerCase();
  const showPaymentStatusPill =
    Boolean(paymentStatus) && paymentStatus !== orderStatus;
  const canDownloadReceipt = ["paid", "settled"].includes(paymentStatus);
  const receiptBuyerName =
    currentOrder.buyer_info?.organization_name ||
    currentOrder.buyer_info?.business_name ||
    currentOrder.buyer_org_id ||
    "Buyer";

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

      const client = getApiClient(() => authToken);
      const res = await client.get(`/sellers/orders/${orderId}/invoice`, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
      });

      const contentType =
        (res.headers?.["content-type"] as string | undefined) || "";
      const blob = res.data as Blob;

      // If backend returns JSON error, don't silently download it as a .pdf.
      if (!contentType.toLowerCase().includes("application/pdf")) {
        let message = "Receipt download failed.";
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
        fallbackFilename;

      downloadBlob(blob, filename);
    } catch (e) {
      console.error("Failed to download receipt:", e);
      show("Failed to download receipt. Please try again.");
    } finally {
      setDownloadingReceipt(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Bar (match buyer styling) */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/seller/orders"
            className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="font-medium">Back to Orders</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              disabled={!canDownloadReceipt || downloadingReceipt}
              className="flex items-center gap-2 px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                canDownloadReceipt
                  ? "Download Receipt"
                  : "Receipt available once payment is complete"
              }
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {downloadingReceipt ? "Preparing Receipt..." : "Download Receipt"}
              </span>
            </button>

            {canAccept && (
              <>
                <button
                  type="button"
                  onClick={handleAcceptOrder}
                  className="px-5 py-2 bg-[var(--primary-base)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all duration-200"
                  disabled={currentOrderStatus === "loading"}
                >
                  {currentOrderStatus === "loading"
                    ? "Accepting..."
                    : "Accept Order"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="px-5 py-2 bg-white border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-white transition-all duration-200"
                >
                  Reject Order
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header (match buyer styling) */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--secondary-black)] mb-2">
                    Order {currentOrder.order_number}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-[var(--secondary-muted-edge)]">
                    <div>
                      Placed on{" "}
                      {new Date(currentOrder.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                    <div className="text-[var(--secondary-muted-edge)]">•</div>
                    <div className="truncate">
                      Buyer:{" "}
                      <span className="text-[var(--secondary-black)] font-medium">
                        {receiptBuyerName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={classNames(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold",
                      getStatusColor(currentOrder.status)
                    )}
                  >
                    {currentOrder.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                  {showPaymentStatusPill && (
                    <span
                      className={classNames(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold",
                        getPaymentStatusColor(currentOrder.payment_status)
                      )}
                    >
                      {currentOrder.payment_status?.toUpperCase() || "UNKNOWN"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 overflow-hidden">
              <div className="p-6 border-b border-[var(--secondary-soft-highlight)]/20">
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-[var(--secondary-soft-highlight)]/20">
                {currentOrder.items?.map((item) => {
                  const imageUrl =
                    (item as any)?.product_image ||
                    (item as any)?.product_snapshot?.product_images?.find(
                      (img: any) => img.is_primary
                    )?.image_url ||
                    (item as any)?.product_snapshot?.image_url ||
                    null;

                  return (
                    <div key={item.id} className="p-6 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[var(--secondary-black)] mb-1">
                          {item.product_name}
                        </h3>
                        {item.product_sku && (
                          <p className="text-sm text-[var(--secondary-muted-edge)]">
                            SKU: {item.product_sku}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-[var(--secondary-black)]">
                          {formatCurrency(
                            item.unit_price,
                            currentOrder.currency
                          )}{" "}
                          each
                        </p>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="text-lg font-bold text-[var(--secondary-black)]">
                          {formatCurrency(
                            item.total_price,
                            currentOrder.currency
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="p-6 bg-[var(--primary-background)] border-t border-[var(--secondary-soft-highlight)]/20">
                <div className="space-y-2 max-w-md ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--secondary-muted-edge)]">
                      Subtotal
                    </span>
                    <span className="font-medium text-[var(--secondary-black)]">
                      {formatCurrency(
                        currentOrder.subtotal,
                        currentOrder.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--secondary-muted-edge)]">
                      Tax
                    </span>
                    <span className="font-medium text-[var(--secondary-black)]">
                      {formatCurrency(
                        currentOrder.tax_amount,
                        currentOrder.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--secondary-muted-edge)]">
                      Shipping
                    </span>
                    <span className="font-medium text-[var(--secondary-black)]">
                      {formatCurrency(
                        currentOrder.shipping_amount,
                        currentOrder.currency
                      )}
                    </span>
                  </div>
                  {currentOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--secondary-muted-edge)]">
                        Discount
                      </span>
                      <span className="font-medium text-green-600">
                        -
                        {formatCurrency(
                          currentOrder.discount_amount,
                          currentOrder.currency
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--secondary-soft-highlight)]">
                    <span className="text-[var(--secondary-black)]">Total</span>
                    <span className="text-[var(--primary-accent2)]">
                      {formatCurrency(
                        currentOrder.total_amount,
                        currentOrder.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Shipping Address from Seller */}
                <div>
                  <h3 className="text-sm font-medium text-[var(--secondary-muted-edge)] mb-2">
                    Shipping Address
                  </h3>
                  {currentOrder.shipping_address ? (
                    <div className="text-sm text-[var(--secondary-black)] space-y-1">
                      {(currentOrder.shipping_address.contact_name ||
                        currentOrder.shipping_address.name) && (
                        <p className="font-medium">
                          {currentOrder.shipping_address.contact_name ||
                            currentOrder.shipping_address.name}
                        </p>
                      )}
                      {currentOrder.shipping_address.company && (
                        <p className="text-[var(--secondary-muted-edge)]">
                          {currentOrder.shipping_address.company}
                        </p>
                      )}
                      {(currentOrder.shipping_address.street ||
                        currentOrder.shipping_address.street_address ||
                        currentOrder.shipping_address.address_line1) && (
                        <p>
                          {currentOrder.shipping_address.street ||
                            currentOrder.shipping_address.street_address ||
                            currentOrder.shipping_address.address_line1}
                        </p>
                      )}
                      {(currentOrder.shipping_address.apartment ||
                        currentOrder.shipping_address.address_line2) && (
                        <p>
                          {currentOrder.shipping_address.apartment ||
                            currentOrder.shipping_address.address_line2}
                        </p>
                      )}
                      {(currentOrder.shipping_address.city ||
                        currentOrder.shipping_address.state ||
                        currentOrder.shipping_address.postal_code ||
                        currentOrder.shipping_address.zip) && (
                        <p>
                          {currentOrder.shipping_address.city}
                          {currentOrder.shipping_address.state &&
                            `, ${currentOrder.shipping_address.state}`}{" "}
                          {currentOrder.shipping_address.postal_code ??
                            currentOrder.shipping_address.zip}
                        </p>
                      )}
                      {currentOrder.shipping_address.country && (
                        <p>{currentOrder.shipping_address.country}</p>
                      )}
                      {(currentOrder.shipping_address.contact_phone ||
                        currentOrder.shipping_address.phone ||
                        currentOrder.shipping_address.email) && (
                        <div className="pt-2 space-y-1 text-[var(--secondary-muted-edge)]">
                          {(currentOrder.shipping_address.contact_phone ||
                            currentOrder.shipping_address.phone) && (
                            <p>
                              Phone:{" "}
                              {currentOrder.shipping_address.contact_phone ||
                                currentOrder.shipping_address.phone}
                            </p>
                          )}
                          {currentOrder.shipping_address.email && (
                            <p>Email: {currentOrder.shipping_address.email}</p>
                          )}
                        </div>
                      )}
                      {currentOrder.shipping_address.additional_info && (
                        <p className="pt-2 text-xs text-[var(--secondary-muted-edge)]">
                          {currentOrder.shipping_address.additional_info}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      No address provided
                    </p>
                  )}
                </div>

                {/* Delivery details */}
                <div>
                  <h3 className="text-sm font-medium text-[var(--secondary-muted-edge)] mb-2">
                    Delivery Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    {currentOrder.shipping_method && (
                      <div>
                        <span className="text-[var(--secondary-muted-edge)]">
                          Method:{" "}
                        </span>
                        <span className="text-[var(--secondary-black)] font-medium">
                          {currentOrder.shipping_method}
                        </span>
                      </div>
                    )}
                    {typeof currentOrder.shipping_amount === "number" && (
                      <div>
                        <span className="text-[var(--secondary-muted-edge)]">
                          Shipping Cost:{" "}
                        </span>
                        <span className="text-[var(--secondary-black)] font-medium">
                          {formatCurrency(
                            currentOrder.shipping_amount,
                            currentOrder.currency
                          )}
                        </span>
                      </div>
                    )}
                    {currentOrder.tracking_number && (
                      <div>
                        <span className="text-[var(--secondary-muted-edge)]">
                          Tracking:{" "}
                        </span>
                        <a
                          className="text-[var(--primary-accent2)] font-medium hover:underline"
                          href={`https://parcelsapp.com/en/tracking/${encodeURIComponent(
                            currentOrder.tracking_number
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {currentOrder.tracking_number}
                        </a>
                      </div>
                    )}
                    {currentOrder.estimated_delivery_date && (
                      <div>
                        <span className="text-[var(--secondary-muted-edge)]">
                          Est. Delivery:{" "}
                        </span>
                        <span className="text-[var(--secondary-black)] font-medium">
                          {formatDate(currentOrder.estimated_delivery_date)}
                        </span>
                      </div>
                    )}
                    {currentOrder.actual_delivery_date && (
                      <div>
                        <span className="text-[var(--secondary-muted-edge)]">
                          Actual Delivery:{" "}
                        </span>
                        <span className="text-[var(--secondary-black)] font-medium">
                          {formatDate(currentOrder.actual_delivery_date)}
                        </span>
                      </div>
                    )}
                    {currentOrder.buyer_notes && (
                      <div className="pt-2">
                        <span className="block text-[var(--secondary-muted-edge)] mb-1">
                          Delivery instructions
                        </span>
                        <p className="text-[var(--secondary-black)] bg-[var(--primary-background)] rounded-xl p-3">
                          {currentOrder.buyer_notes}
                        </p>
                      </div>
                    )}
                    {/* Billing address (if different) */}
                    {currentOrder.billing_address && (
                      <div className="pt-2">
                        <span className="block text-[var(--secondary-muted-edge)] mb-1">
                          Billing address
                        </span>
                        {(() => {
                          const shippingLines = normalizeAddressToLines(
                            currentOrder.shipping_address
                          );
                          const billingLines = normalizeAddressToLines(
                            currentOrder.billing_address
                          );
                          const isSame =
                            shippingLines.join(" | ") ===
                            billingLines.join(" | ");

                          if (isSame) {
                            return (
                              <p className="text-xs text-[var(--secondary-muted-edge)]">
                                Same as shipping address
                              </p>
                            );
                          }

                          return (
                            <div className="text-sm text-[var(--secondary-black)] space-y-1">
                              {billingLines.map((line, idx) => (
                                <p key={`${line}-${idx}`}>{line}</p>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    {currentOrder.internal_notes && (
                      <div className="pt-2">
                        <span className="block text-[var(--secondary-muted-edge)] mb-1">
                          Packaging / Internal Notes
                        </span>
                        <p className="text-[var(--secondary-black)] bg-[var(--primary-background)] rounded-xl p-3">
                          {currentOrder.internal_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(currentOrder.buyer_notes || currentOrder.seller_notes) && (
              <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
                <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                  Notes
                </h2>
                <div className="space-y-4">
                  {currentOrder.buyer_notes && (
                    <div>
                      <h3 className="text-sm font-medium text-[var(--secondary-muted-edge)] mb-2">
                        Buyer Notes
                      </h3>
                      <p className="text-sm text-[var(--secondary-black)] p-3 bg-[var(--primary-background)] rounded-xl">
                        {currentOrder.buyer_notes}
                      </p>
                    </div>
                  )}
                  {currentOrder.seller_notes && (
                    <div>
                      <h3 className="text-sm font-medium text-[var(--secondary-muted-edge)] mb-2">
                        Your Notes
                      </h3>
                      <p className="text-sm text-[var(--secondary-black)] p-3 bg-[var(--primary-accent1)]/10 rounded-xl">
                        {currentOrder.seller_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Timeline & Quick Info */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Order Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[var(--secondary-muted-edge)]">
                    Order Date
                  </span>
                  <p className="font-medium text-[var(--secondary-black)] mt-1">
                    {formatDate(currentOrder.created_at)}
                  </p>
                </div>
                {currentOrder.accepted_at && (
                  <div>
                    <span className="text-[var(--secondary-muted-edge)]">
                      Accepted
                    </span>
                    <p className="font-medium text-[var(--secondary-black)] mt-1">
                      {formatDate(currentOrder.accepted_at)}
                    </p>
                  </div>
                )}
                {currentOrder.shipped_at && (
                  <div>
                    <span className="text-[var(--secondary-muted-edge)]">
                      Shipped
                    </span>
                    <p className="font-medium text-[var(--secondary-black)] mt-1">
                      {formatDate(currentOrder.shipped_at)}
                    </p>
                  </div>
                )}
                {currentOrder.delivered_at && (
                  <div>
                    <span className="text-[var(--secondary-muted-edge)]">
                      Delivered
                    </span>
                    <p className="font-medium text-[var(--secondary-black)] mt-1">
                      {formatDate(currentOrder.delivered_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Order Timeline
              </h2>
              {timelineStatus === "loading" && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary-accent2)]"></div>
                </div>
              )}
              {timelineStatus === "succeeded" && (
                <div className="space-y-4">
                  {timeline.length === 0 ? (
                    <p className="text-sm text-[var(--secondary-muted-edge)] text-center py-4">
                      No timeline events yet
                    </p>
                  ) : (
                    timeline.map((event, index) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-[var(--primary-accent1)]/20 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-[var(--primary-accent2)]"></div>
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 flex-1 bg-[var(--secondary-soft-highlight)] mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <h3 className="text-sm font-medium text-[var(--secondary-black)]">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                              {event.description}
                            </p>
                          )}
                          <p className="text-xs text-[var(--secondary-muted-edge)] mt-2">
                            {formatDateTime(event.created_at)}
                          </p>
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

      {/* Reject Order Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-4">
              Reject Order
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Reason *
                </label>
                <select
                  value={rejectForm.reason}
                  onChange={(e) =>
                    setRejectForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="input w-full"
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="Out of stock">Out of stock</option>
                  <option value="Cannot meet delivery date">
                    Cannot meet delivery date
                  </option>
                  <option value="Pricing error">Pricing error</option>
                  <option value="Unable to fulfill quantity">
                    Unable to fulfill quantity
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={rejectForm.seller_notes}
                  onChange={(e) =>
                    setRejectForm((prev) => ({
                      ...prev,
                      seller_notes: e.target.value,
                    }))
                  }
                  className="input w-full"
                  rows={3}
                  placeholder="Provide more details..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
                disabled={currentOrderStatus === "loading"}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-all duration-200"
                disabled={
                  currentOrderStatus === "loading" || !rejectForm.reason
                }
              >
                {currentOrderStatus === "loading"
                  ? "Rejecting..."
                  : "Reject Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
