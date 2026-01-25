"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  XCircleIcon,
  StarIcon,
  ShoppingBagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrderDetail,
  cancelOrder,
  clearCurrentOrder,
} from "@/store/slices/buyerOrdersSlice";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";

// Demo order data removed; this page uses live order data from the API.

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }> | { orderId: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const {
    currentOrder: order,
    orders: orderList,
    orderDetailStatus,
    orderDetailError,
  } = useAppSelector((state) => state.buyerOrders);
  const authToken = useAppSelector((state) => state.auth.accessToken);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

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
      const res = await client.get(`/buyers/orders/${orderId}/invoice`, {
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
        fallbackFilename;

      downloadBlob(blob, filename);
    };

    setDownloadingInvoice(true);
    try {
      // Single invoice source of truth: backend PDF (formatted like ClassicInvoice).
      await downloadFromApi();
    } catch (error) {
      console.error("Failed to download invoice:", error);
      show("Failed to download invoice. Please try again.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // Next.js 15: unwrap params if it's a Promise
  const unwrappedParams =
    typeof (params as any)?.then === "function"
      ? (React as any).use(params as Promise<{ orderId: string }>)
      : (params as { orderId: string });
  const orderId = unwrappedParams.orderId;

  // Fetch order detail on mount
  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [orderId, dispatch]);

  // Optional fields that may or may not be present on the Order payload
  const acceptedAt = (order as any)?.accepted_at as string | undefined;
  const shippedAt = (order as any)?.shipped_at as string | undefined;
  const deliveredAt = (order as any)?.delivered_at as string | undefined;
  const actualDeliveryDate = (order as any)?.actual_delivery_date as
    | string
    | undefined;
  const shippingMethod = (order as any)?.shipping_method as string | undefined;
  const trackingNumber = (order as any)?.tracking_number as string | undefined;

  const handleCancelOrder = async () => {
    setCancellingOrder(true);
    try {
      await dispatch(cancelOrder({ orderId, reason: cancelReason })).unwrap();
      setShowCancelDialog(false);
      // Refresh order detail
      dispatch(fetchOrderDetail(orderId));
    } catch (error) {
      console.error("Failed to cancel order:", error);
      show("Failed to cancel order. Please try again.");
    } finally {
      setCancellingOrder(false);
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
      router.push(`/buyer/messages?conversationId=${data.id}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      show("Failed to start conversation. Please try again.");
    } finally {
      setIsStartingConversation(false);
    }
  };

  // Loading state
  if (orderDetailStatus === "loading" && !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader size="lg" text="Loading order details..." />
      </div>
    );
  }

  // Error state
  if (orderDetailStatus === "failed" && orderDetailError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBagIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Failed to Load Order
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">
            {orderDetailError}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/buyer/orders")}
              className="px-6 py-3 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full font-semibold hover:bg-white transition-all duration-200"
            >
              Back to Orders
            </button>
            <button
              onClick={() => dispatch(fetchOrderDetail(orderId))}
              className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No order found
  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBagIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Order Not Found
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">
            The order you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/buyer/orders")}
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Transform order data for UI (use real order data)
  const normalizeItems = (items: any) => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (Array.isArray(items?.data)) return items.data;
    return [];
  };

  const fallbackOrder =
    Array.isArray(orderList) && orderList.length > 0
      ? orderList.find((o: any) => o.id === orderId)
      : null;

  const rawItems =
    (order as any)?.items ??
    (order as any)?.order_items ??
    (order as any)?.line_items ??
    (fallbackOrder as any)?.items ??
    (fallbackOrder as any)?.order_items ??
    (fallbackOrder as any)?.line_items ??
    [];
  const orderItems = normalizeItems(rawItems);
  const canCancel = order.status === "pending" || order.status === "accepted";
  const canReview = order.status === "delivered";
  const currencyCode =
    (order as any)?.currency || (order as any)?.currency_code || "USD";
  const formatCurrency = (value: number) =>
    `${currencyCode} ${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const invoiceLineSubtotal = orderItems.reduce((sum: number, item: any) => {
    const qty = Number(item.quantity || 0);
    const unitPrice = Number(
      item.unit_price ?? item.price_per_unit ?? item.price ?? 0
    );
    const lineTotal = Number(
      item.total_price ?? item.subtotal ?? item.line_total ?? qty * unitPrice
    );
    return sum + lineTotal;
  }, 0);
  const invoiceDeliveryFee = Number(
    (order as any)?.shipping_amount ?? (order as any)?.shipping_cost ?? 0
  );
  const invoicePlatformFee = Number(
    (order as any)?.platform_fee_amount ?? (order as any)?.platform_fee ?? 0
  );
  const invoiceDiscount = Number((order as any)?.discount_amount || 0);
  const invoiceTotal =
    Number((order as any)?.total_amount) ||
    invoiceLineSubtotal +
      invoiceDeliveryFee +
      invoicePlatformFee -
      invoiceDiscount;
  const statusOrder = [
    "pending",
    "accepted",
    "processing",
    "shipped",
    "delivered",
  ];
  const currentStatusIndex = Math.max(
    statusOrder.indexOf((order.status || "").toLowerCase()),
    0
  );
  const steps = [
    {
      key: "placed",
      label: "Order Placed",
      date: order.created_at,
      done: true,
      icon: <CheckCircleIcon className="h-4 w-4" />,
    },
    {
      key: "accepted",
      label: "Accepted",
      date: acceptedAt,
      done:
        currentStatusIndex >= statusOrder.indexOf("accepted") ||
        Boolean(acceptedAt),
      icon: <CheckCircleIcon className="h-4 w-4" />,
    },
    {
      key: "shipped",
      label: "Shipped",
      date: shippedAt,
      done:
        currentStatusIndex >= statusOrder.indexOf("shipped") ||
        Boolean(shippedAt),
      icon: <TruckIcon className="h-4 w-4" />,
    },
    {
      key: "delivered",
      label: "Delivered",
      date: (deliveredAt || actualDeliveryDate) as string | undefined,
      eta: order.estimated_delivery_date,
      done:
        currentStatusIndex >= statusOrder.indexOf("delivered") ||
        Boolean(deliveredAt || actualDeliveryDate),
      icon: <CheckBadgeIcon className="h-4 w-4" />,
    },
  ];
  const currentIndex =
    steps.map((s) => s.done).lastIndexOf(true) === -1
      ? 0
      : steps.map((s) => s.done).lastIndexOf(true);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/buyer/orders"
              className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="font-medium">Back to Orders</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              className="flex items-center gap-2 px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {downloadingInvoice
                  ? "Preparing Invoice..."
                  : "Download Invoice"}
              </span>
            </button>
            {canReview && (
              <Link
                href={`/buyer/orders/${orderId}/review`}
                className="flex items-center gap-2 px-5 py-2 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all shadow-sm"
              >
                <StarIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Write Review</span>
              </Link>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--secondary-black)] mb-2">
                    Order {order.order_number}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-[var(--secondary-muted-edge)]">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              {canCancel && (
                <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30 flex items-center gap-4">
                  <Link
                    href={`/buyer/orders/${orderId}/edit`}
                    className="flex items-center gap-2 text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit Order
                  </Link>
                  <span className="text-[var(--secondary-soft-highlight)]">|</span>
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>

            {/* Items Purchased */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Items Purchased
                </h2>
                <span className="text-sm text-[var(--secondary-muted-edge)]">
                  {orderItems.length} item{orderItems.length === 1 ? "" : "s"}
                </span>
              </div>

              {orderItems.length === 0 ? (
                <div className="rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)]/40 p-5">
                  <p className="text-sm text-[var(--secondary-muted-edge)]">
                    No items found for this order.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--secondary-soft-highlight)]/20 rounded-2xl border border-[var(--secondary-soft-highlight)]/20 overflow-hidden">
                  {orderItems.map((item: any, index: number) => {
                    const qty = Number(item.quantity || 0);
                    const unitPrice = Number(
                      item.unit_price ?? item.price_per_unit ?? item.price ?? 0
                    );
                    const lineTotal = Number(
                      item.total_price ?? item.subtotal ?? qty * unitPrice
                    );
                    const unit =
                      item.unit ||
                      item.unit_of_measurement ||
                      item?.product_snapshot?.unit_of_measurement ||
                      item?.product_snapshot?.unit ||
                      "";
                    const name =
                      item.product_name ||
                      item?.product_snapshot?.product_name ||
                      item?.product_snapshot?.name ||
                      "Item";
                    const imageUrl =
                      item.product_image ||
                      item.image_url ||
                      item?.product_snapshot?.image_url ||
                      null;

                    return (
                      <div
                        key={item.id || `${item.product_id || "item"}-${index}`}
                        className="flex items-start justify-between gap-4 p-4 bg-white"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          {typeof imageUrl === "string" && imageUrl ? (
                            <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 bg-[var(--primary-background)]/30 shrink-0">
                              <Image
                                src={imageUrl}
                                alt={name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-14 w-14 rounded-xl border border-[var(--secondary-soft-highlight)]/20 bg-[var(--primary-background)]/30 flex items-center justify-center shrink-0">
                              <ShoppingBagIcon className="h-6 w-6 text-[var(--secondary-muted-edge)]" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-[var(--secondary-black)] truncate">
                              {name}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--secondary-muted-edge)]">
                              <span>
                                Qty:{" "}
                                <span className="text-[var(--secondary-black)] font-medium">
                                  {qty.toLocaleString("en-US")}
                                </span>
                              </span>
                              {unit ? (
                                <span>
                                  Unit:{" "}
                                  <span className="text-[var(--secondary-black)] font-medium">
                                    {unit}
                                  </span>
                                </span>
                              ) : null}
                              <span>
                                Unit price:{" "}
                                <span className="text-[var(--secondary-black)] font-medium">
                                  {formatCurrency(unitPrice)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs text-[var(--secondary-muted-edge)]">
                            Line total
                          </p>
                          <p className="text-sm font-semibold text-[var(--secondary-black)]">
                            {formatCurrency(lineTotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tracking Information */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Order Tracking
                </h2>
                <div className="flex items-center gap-3">
                  {shippingMethod && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-[var(--primary-background)]/60 text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30">
                      Method
                      <span className="font-medium">{shippingMethod}</span>
                    </span>
                  )}
                  {trackingNumber && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-[var(--primary-background)]/60 text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30">
                        Tracking #
                        <span className="font-medium">{trackingNumber}</span>
                      </span>
                      <a
                        href={`https://parcelsapp.com/en/tracking/${encodeURIComponent(
                          trackingNumber
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
                      >
                        Track Package
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Stepper */}
              <div className="relative">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[var(--secondary-soft-highlight)]/40" />
                <ol className="space-y-6">
                  {steps.map((step, index) => {
                    const isDone = step.done;
                    const isCurrent = !step.done && index === currentIndex + 1;
                    const displayDate = step.date
                      ? new Date(step.date).toLocaleString()
                      : step.key === "delivered" && step.eta
                        ? `ETA ${new Date(step.eta).toLocaleDateString()}`
                        : isCurrent
                          ? "In progress"
                          : isDone
                            ? "Completed"
                            : "—";

                    return (
                      <li key={step.key} className="relative pl-8">
                        <span
                          className={`absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ${
                            isDone
                              ? "bg-[var(--primary-accent2)] ring-[var(--primary-accent2)]/15"
                              : isCurrent
                                ? "bg-white ring-[var(--primary-accent2)]/30 border border-[var(--primary-accent2)]"
                                : "bg-white ring-[var(--secondary-soft-highlight)]/40 border border-[var(--secondary-soft-highlight)]/70"
                          }`}
                        >
                          <span
                            className={`${
                              isDone
                                ? "text-white"
                                : isCurrent
                                  ? "text-[var(--primary-accent2)]"
                                  : "text-[var(--secondary-muted-edge)]"
                            }`}
                          >
                            {step.icon}
                          </span>
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[var(--secondary-black)]">
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                                In progress
                              </span>
                            )}
                            {isDone && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                                Completed
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[var(--secondary-muted-edge)]">
                            {displayDate}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Delivery Notes */}
            {order.buyer_notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">
                  Delivery Instructions
                </h3>
                <p className="text-sm text-blue-800">{order.buyer_notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 sticky top-24">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Subtotal
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Delivery fee
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    $
                    {Number(
                      (order as any)?.shipping_amount ??
                        (order as any)?.shipping_cost ??
                        0
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Platform fee
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    $
                    {(() => {
                      const explicit = Number(
                        (order as any)?.platform_fee_amount ??
                          (order as any)?.platform_fee ??
                          0
                      );
                      if (explicit > 0) return explicit.toFixed(2);

                      // Fallback: for some offline/admin-created orders the platform fee
                      // is baked into total_amount but not returned as its own field.
                      const subtotal = Number((order as any)?.subtotal ?? 0);
                      const delivery = Number(
                        (order as any)?.shipping_amount ??
                          (order as any)?.shipping_cost ??
                          0
                      );
                      const discount = Number(
                        (order as any)?.discount_amount ?? 0
                      );
                      const total = Number((order as any)?.total_amount ?? 0);
                      const computed = total - subtotal - delivery + discount;
                      return Math.max(0, computed).toFixed(2);
                    })()}
                  </span>
                </div>
                <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[var(--secondary-black)]">
                      Total
                    </span>
                    <span className="font-bold text-xl text-[var(--secondary-black)]">
                      ${order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                <h4 className="font-semibold text-[var(--secondary-black)] mb-3">
                  Seller Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--secondary-black)]">
                      {order.seller_name}
                    </span>
                  </div>
                  {order.seller_location && (
                    <div className="text-sm text-[var(--secondary-muted-edge)]">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPinIcon className="h-4 w-4" />
                        {order.seller_location}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleContactSeller}
                    disabled={isStartingConversation}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all mt-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isStartingConversation ? "Loading..." : "Contact Seller"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              {order.shipping_address && (
                <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30 mt-4">
                  <h4 className="font-semibold text-[var(--secondary-black)] mb-3">
                    Delivery Address
                  </h4>
                  <div className="text-sm text-[var(--secondary-black)]">
                    {((order.shipping_address as any).contact_name ||
                      (order.shipping_address as any).name) && (
                      <p className="font-medium text-[var(--secondary-black)]">
                        {(order.shipping_address as any).contact_name ||
                          (order.shipping_address as any).name}
                      </p>
                    )}
                    <p className="text-[var(--secondary-muted-edge)]">
                      {(order.shipping_address as any).line1 ||
                        (order.shipping_address as any).address_line1 ||
                        (order.shipping_address as any).street_address ||
                        ""}
                    </p>
                    {((order.shipping_address as any).line2 ||
                      (order.shipping_address as any).address_line2) && (
                      <p className="text-[var(--secondary-muted-edge)]">
                        {(order.shipping_address as any).line2 ||
                          (order.shipping_address as any).address_line2}
                      </p>
                    )}
                    <p className="text-[var(--secondary-muted-edge)]">
                      {(order.shipping_address as any).city}
                      {((order.shipping_address as any).state ||
                        (order.shipping_address as any).postal_code) &&
                        ", "}
                      {(order.shipping_address as any).state}{" "}
                      {(order.shipping_address as any).postal_code}
                    </p>
                    <p className="text-[var(--secondary-muted-edge)]">
                      {(order.shipping_address as any).country}
                    </p>
                    {((order.shipping_address as any).phone ||
                      (order.shipping_address as any).contact_phone) && (
                      <p className="text-[var(--secondary-muted-edge)]">
                        {(order.shipping_address as any).phone ||
                          (order.shipping_address as any).contact_phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Order Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Cancel Order
                </h3>
              </div>
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Let us know why you're cancelling..."
                  rows={3}
                  className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 px-5 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancellingOrder}
                  className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancellingOrder ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

