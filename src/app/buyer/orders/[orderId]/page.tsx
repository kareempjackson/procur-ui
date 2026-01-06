"use client";

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
  EnvelopeIcon,
  PhoneIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  XCircleIcon,
  StarIcon,
  ShoppingBagIcon,
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Demo order data with full tracking
const order = {
  id: "ord_abc123",
  orderNumber: "#10245",
  status: "shipped",
  paymentStatus: "paid",
  createdAt: "2025-10-05T14:30:00Z",
  acceptedAt: "2025-10-05T16:00:00Z",
  shippedAt: "2025-10-06T10:00:00Z",
  estimatedDelivery: "2025-10-15",
  total: 245.83,
  currency: "USD",
  canCancel: false,
  canReview: false,
  tracking: {
    carrier: "FedEx",
    trackingNumber: "789456123098",
    trackingUrl: "https://fedex.com/track/789456123098",
    currentStatus: "In Transit",
    lastLocation: "Miami, FL Distribution Center",
    lastUpdate: "2025-10-07T08:30:00Z",
    events: [
      {
        id: 1,
        status: "Delivered",
        location: "Miami, FL 33101",
        date: null,
        description: "Estimated delivery",
        isEstimate: true,
      },
      {
        id: 2,
        status: "In Transit",
        location: "Miami, FL Distribution Center",
        date: "2025-10-07T08:30:00Z",
        description: "Package arrived at facility",
        isEstimate: false,
      },
      {
        id: 3,
        status: "In Transit",
        location: "Atlanta, GA Hub",
        date: "2025-10-06T18:45:00Z",
        description: "Package departed facility",
        isEstimate: false,
      },
      {
        id: 4,
        status: "Picked Up",
        location: "Kingston, Jamaica",
        date: "2025-10-06T10:00:00Z",
        description: "Package picked up by carrier",
        isEstimate: false,
      },
      {
        id: 5,
        status: "Accepted",
        location: "Caribbean Farms Co.",
        date: "2025-10-05T16:00:00Z",
        description: "Order accepted by seller",
        isEstimate: false,
      },
      {
        id: 6,
        status: "Order Placed",
        location: "Procur Platform",
        date: "2025-10-05T14:30:00Z",
        description: "Order successfully placed",
        isEstimate: false,
      },
    ],
  },
  seller: {
    id: "seller_1",
    name: "Caribbean Farms Co.",
    email: "orders@caribbeanfarms.com",
    phone: "(876) 555-0123",
    location: "Kingston, Jamaica",
    verified: true,
    rating: 4.8,
    totalReviews: 234,
  },
  items: [
    {
      id: "item_1",
      productId: "prod_1",
      name: "Organic Cherry Tomatoes",
      quantity: 10,
      unit: "lb",
      price: 3.5,
      total: 35.0,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: "item_2",
      productId: "prod_2",
      name: "Fresh Basil",
      quantity: 5,
      unit: "bunch",
      price: 8.5,
      total: 42.5,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
  ],
  shippingAddress: {
    name: "John Smith",
    street: "123 Main Street",
    apartment: "Apt 4B",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    country: "United States",
    phone: "(305) 555-0123",
  },
  paymentMethod: {
    type: "card",
    brand: "Visa",
    last4: "4242",
  },
  subtotal: 77.5,
  shipping: 25.0,
  tax: 6.2,
  notes: "Please leave at door if no one is home. Ring doorbell twice.",
};

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
  const invoiceRef = useRef<HTMLDivElement | null>(null);

  // Tailwind v4 can emit color values using lab() inside @supports blocks.
  // html2canvas does not understand lab(), so we proactively strip those
  // fallback rules from runtime stylesheets before capturing.
  const stripLabColorRules = () => {
    if (typeof document === "undefined") return;

    try {
      const styleSheets = Array.from(document.styleSheets || []);

      for (const sheet of styleSheets) {
        const cssSheet = sheet as CSSStyleSheet;
        let rules: CSSRuleList;

        try {
          rules = cssSheet.cssRules;
        } catch {
          // Ignore cross-origin or locked stylesheets
          continue;
        }

        for (let i = rules.length - 1; i >= 0; i -= 1) {
          const rule = rules[i];
          // Narrow supports rules that declare lab() colors
          if (
            typeof CSSSupportsRule !== "undefined" &&
            rule instanceof CSSSupportsRule &&
            rule.conditionText.includes("color: lab(")
          ) {
            cssSheet.deleteRule(i);
          }
        }
      }
    } catch (e) {
      // Fail-safe: never block invoice generation if stylesheet inspection fails
      console.warn("stripLabColorRules failed, continuing without strip:", e);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order || !invoiceRef.current) return;

    setDownloadingInvoice(true);
    const element = invoiceRef.current;

    try {
      // Remove any @supports blocks that redefine palette variables using lab()
      // so html2canvas doesn't attempt to parse unsupported color functions.
      stripLabColorRules();

      // Tailwind v4 can emit color functions like lab() which html2canvas
      // cannot parse. Temporarily wrap getComputedStyle so any lab() values
      // are stripped before html2canvas processes styles.
      const originalGetComputedStyle = window.getComputedStyle;
      (window as any).getComputedStyle = (
        elt: Element,
        pseudoElt?: string | null
      ) => {
        const style = originalGetComputedStyle.call(
          window,
          elt,
          pseudoElt as any
        );
        if (!style) return style;

        const originalGetPropertyValue = style.getPropertyValue.bind(style);
        (style as any).getPropertyValue = (prop: string) => {
          const value = originalGetPropertyValue(prop);
          if (typeof value === "string" && value.includes("lab(")) {
            return "";
          }
          return value;
        };

        return style;
      };

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
      } finally {
        (window as any).getComputedStyle = originalGetComputedStyle;
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const invoiceNumber =
        (order as any)?.invoice_number ||
        order.order_number ||
        `ORDER-${order.id || ""}`;
      pdf.save(`procur-invoice-${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Failed to download invoice:", error);
      show("Failed to generate invoice. Please try again.");
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
            The order you're looking for doesn't exist or has been removed.
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
  const firstItemName =
    orderItems[0]?.product_name ||
    (orderItems[0] as any)?.product_snapshot?.product_name ||
    (orderItems[0] as any)?.product_snapshot?.name ||
    undefined;
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
  const invoiceShipping = Number((order as any)?.shipping_cost || 0);
  const invoiceTax = Number((order as any)?.tax || 0);
  const invoicePlatformFee = Number((order as any)?.platform_fee || 0);
  const invoiceDiscount = Number((order as any)?.discount_amount || 0);
  const invoiceTotal =
    Number((order as any)?.total_amount) ||
    invoiceLineSubtotal +
      invoiceShipping +
      invoicePlatformFee +
      invoiceTax -
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
      {/* Classic balance invoice template (off-screen for PDF capture) */}
      <div className="fixed -left-[9999px] top-0 z-[-1]">
        <div
          ref={invoiceRef}
          className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] p-8 sm:p-10 w-[900px] max-w-[900px]"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-background)] px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-[var(--primary-accent2)]" />
                <span className="text-xs font-medium tracking-wide text-[var(--primary-base)]">
                  Procur marketplace
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--secondary-black)]">
                  Tax invoice
                </h2>
                <p className="text-sm text-[var(--primary-base)] mt-1">
                  Official summary of your order on Procur.
                </p>
              </div>
              <div className="text-xs text-[var(--primary-base)] space-y-0.5">
                <p>{order.seller_name}</p>
                {order.seller_location && <p>{order.seller_location}</p>}
                {(order as any).seller_email && (
                  <p>{(order as any).seller_email}</p>
                )}
              </div>
            </div>

            <div className="space-y-3 text-sm sm:text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary-soft-highlight)]/40 px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-[var(--secondary-black)]">
                  Payment {order.payment_status || "status"}
                </span>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-1 text-xs text-[var(--primary-base)]">
                <div className="flex justify-between sm:justify-end gap-3">
                  <dt className="uppercase tracking-[0.16em]">Invoice</dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {(order as any)?.invoice_number ||
                      order.order_number ||
                      `ORDER-${order.id}`}
                  </dd>
                </div>
                <div className="flex justify-between sm:justify-end gap-3">
                  <dt className="uppercase tracking-[0.16em]">Issued</dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                {order.estimated_delivery_date && (
                  <div className="flex justify-between sm:justify-end gap-3">
                    <dt className="uppercase tracking-[0.16em]">Due</dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {new Date(
                        order.estimated_delivery_date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                Billed to
              </p>
              {order.shipping_address && (
                <div className="space-y-0.5 text-sm">
                  <p className="font-medium text-[var(--secondary-black)]">
                    {(order.shipping_address as any).name ||
                      (order as any)?.buyer_name ||
                      ""}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    {order.shipping_address.address_line1}
                  </p>
                  {order.shipping_address.address_line2 && (
                    <p className="text-[var(--primary-base)]">
                      {order.shipping_address.address_line2}
                    </p>
                  )}
                  <p className="text-[var(--primary-base)]">
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.state}{" "}
                    {order.shipping_address.postal_code}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    {order.shipping_address.country}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                Order reference
              </p>
              <div className="space-y-1 text-sm text-[var(--primary-base)]">
                <p>Order: {order.order_number}</p>
                {order.estimated_delivery_date && (
                  <p>
                    Estimated delivery:{" "}
                    {new Date(order.estimated_delivery_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden mb-8">
            <table className="w-full border-collapse text-xs">
              <thead className="bg-[var(--primary-background)]">
                <tr className="text-[var(--primary-base)] text-left">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    Details
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">
                    Unit price
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    Line total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item: any, index: number) => {
                  const qty = Number(item.quantity || 0);
                  const unitPrice = Number(
                    item.unit_price ??
                      item.price_per_unit ??
                      item.price ??
                      item.unitPrice ??
                      0
                  );
                  const lineTotal = Number(
                    item.total_price ??
                      item.subtotal ??
                      item.line_total ??
                      qty * unitPrice
                  );
                  const unit =
                    item.unit ||
                    (item as any)?.product_snapshot?.unit_of_measurement ||
                    (item as any)?.product_snapshot?.unit ||
                    "";
                  const name =
                    item.product_name ||
                    (item as any)?.product_snapshot?.product_name ||
                    (item as any)?.product_snapshot?.name ||
                    "Item";
                  return (
                    <tr
                      key={item.id || `${item.product_id}-${index}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                    >
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-[var(--secondary-black)]">
                          {name}
                        </p>
                        <p className="text-[var(--primary-base)] sm:hidden mt-1">
                          {unit && `Unit: ${unit}`}
                        </p>
                      </td>
                      <td className="px-4 py-3 align-top text-[var(--primary-base)] hidden sm:table-cell">
                        {unit && `Unit: ${unit}`}
                      </td>
                      <td className="px-4 py-3 align-top text-right text-[var(--secondary-black)]">
                        {qty.toLocaleString("en-US")}
                      </td>
                      <td className="px-4 py-3 align-top text-right text-[var(--secondary-black)]">
                        {formatCurrency(unitPrice)}
                      </td>
                      <td className="px-4 py-3 align-top text-right font-medium text-[var(--secondary-black)]">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="text-xs text-[var(--primary-base)] max-w-sm">
              <p className="font-medium text-[var(--secondary-black)] mb-1">
                Payment instructions
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Payment is processed via Procur secure settlement.</li>
                <li>
                  Include the invoice or order number as the payment reference.
                </li>
              </ul>
            </div>

            <div className="w-full sm:max-w-xs">
              <dl className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--primary-base)]">Subtotal</dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {formatCurrency(invoiceLineSubtotal)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--primary-base)]">
                    Shipping &amp; handling
                  </dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {formatCurrency(invoiceShipping)}
                  </dd>
                </div>
                {invoicePlatformFee > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--primary-base)]">Platform fee</dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {formatCurrency(invoicePlatformFee)}
                    </dd>
                  </div>
                )}
                {invoiceTax > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--primary-base)]">Tax</dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {formatCurrency(invoiceTax)}
                    </dd>
                  </div>
                )}
                {invoiceDiscount > 0 && (
                  <div className="flex justify-between gap-4 pt-2 border-t border-dashed border-gray-200 mt-1">
                    <dt className="text-[var(--primary-base)]">Discount</dt>
                    <dd className="font-medium text-emerald-600">
                      -{formatCurrency(invoiceDiscount)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 pt-2 border-t border-gray-900/10 mt-2">
                  <dt className="text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-[0.16em]">
                    Amount due
                  </dt>
                  <dd className="text-base font-semibold text-[var(--secondary-black)]">
                    {formatCurrency(invoiceTotal)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="mt-8 text-[0.68rem] text-[var(--primary-base)] leading-relaxed">
            Thank you for sourcing fresh produce through Procur. Payments help
            us keep farmers on the land and buyers fully supplied.
          </p>
        </div>
      </div>

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
                <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Cancel Order
                  </button>
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
                    Shipping
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    ${Number(order.shipping_cost || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Tax
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    ${Number(order.tax || 0).toFixed(2)}
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

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30 mt-4">
                  <h4 className="font-semibold text-[var(--secondary-black)] mb-3">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-[var(--secondary-black)]">
                    <p className="text-[var(--secondary-muted-edge)]">
                      {order.shipping_address.address_line1}
                    </p>
                    {order.shipping_address.address_line2 && (
                      <p className="text-[var(--secondary-muted-edge)]">
                        {order.shipping_address.address_line2}
                      </p>
                    )}
                    <p className="text-[var(--secondary-muted-edge)]">
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.state}{" "}
                      {order.shipping_address.postal_code}
                    </p>
                    <p className="text-[var(--secondary-muted-edge)]">
                      {order.shipping_address.country}
                    </p>
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
