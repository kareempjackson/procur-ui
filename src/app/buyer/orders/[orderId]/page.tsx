"use client";

import React, { useState, useEffect } from "react";
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
    orderDetailStatus,
    orderDetailError,
  } = useAppSelector((state) => state.buyerOrders);
  const authToken = useAppSelector((state) => state.auth.accessToken);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);

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
  const canCancel = order.status === "pending" || order.status === "accepted";
  const canReview = order.status === "delivered";
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
      done: Boolean(acceptedAt),
      icon: <CheckCircleIcon className="h-4 w-4" />,
    },
    {
      key: "shipped",
      label: "Shipped",
      date: shippedAt,
      done: Boolean(shippedAt),
      icon: <TruckIcon className="h-4 w-4" />,
    },
    {
      key: "delivered",
      label: "Delivered",
      date: (deliveredAt || actualDeliveryDate) as string | undefined,
      eta: order.estimated_delivery_date,
      done: Boolean(deliveredAt || actualDeliveryDate),
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
            <button className="flex items-center gap-2 px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-white transition-all">
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Download Invoice</span>
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
                            {step.date
                              ? new Date(step.date).toLocaleString()
                              : step.key === "delivered" && step.eta
                                ? `ETA ${new Date(step.eta).toLocaleDateString()}`
                                : "Pending"}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Delivery Map */}
            {order.shipping_address && (
              <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                    Delivery Map
                  </h2>
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1${
                        order.seller_location
                          ? `&origin=${encodeURIComponent(order.seller_location)}`
                          : ""
                      }&destination=${encodeURIComponent(
                        [
                          order.shipping_address.address_line1,
                          order.shipping_address.address_line2,
                          `${order.shipping_address.city || ""} ${
                            order.shipping_address.state || ""
                          } ${order.shipping_address.postal_code || ""}`,
                          order.shipping_address.country,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
                    >
                      Open Live Directions
                    </a>
                  </div>
                </div>
                <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/30">
                  <iframe
                    title="Delivery Map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      [
                        order.shipping_address.address_line1,
                        order.shipping_address.address_line2,
                        `${order.shipping_address.city || ""} ${
                          order.shipping_address.state || ""
                        } ${order.shipping_address.postal_code || ""}`,
                        order.shipping_address.country,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    )}&output=embed`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <p className="mt-3 text-xs text-[var(--secondary-muted-edge)]">
                  Tip: Use “Open Live Directions” to follow the driver’s route
                  in real-time via Google Maps.
                </p>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-[var(--secondary-soft-highlight)]/30 last:border-0 last:pb-0"
                  >
                    <Link
                      href={`/buyer/product/${item.product_id}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 group"
                    >
                      <Image
                        src={
                          item.product_image ||
                          "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                        }
                        alt={item.product_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/buyer/product/${item.product_id}`}
                        className="font-semibold text-[var(--secondary-black)] hover:text-[var(--primary-accent2)] transition-colors"
                      >
                        {item.product_name}
                      </Link>
                      <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                        Quantity: {item.quantity}{" "}
                        {item.unit ||
                          (item as any)?.product_snapshot
                            ?.unit_of_measurement ||
                          ""}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        ${Number(item.unit_price || 0).toFixed(2)} per{" "}
                        {item.unit ||
                          (item as any)?.product_snapshot
                            ?.unit_of_measurement ||
                          ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--secondary-black)]">
                        $
                        {Number(
                          (item as any)?.total_price ??
                            (item.unit_price || 0) * (item.quantity || 0)
                        ).toFixed(2)}
                      </p>
                      <Link
                        href={`/buyer/product/${item.product_id}`}
                        className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] mt-2 inline-block"
                      >
                        Buy Again
                      </Link>
                    </div>
                  </div>
                ))}
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
