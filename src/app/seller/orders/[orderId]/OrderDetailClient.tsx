"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrderDetail,
  fetchOrderTimeline,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  clearCurrentOrder,
} from "@/store/slices/sellerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

interface OrderDetailClientProps {
  orderId: string;
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentOrder, currentOrderStatus, timeline, timelineStatus, error } =
    useAppSelector((state) => state.sellerOrders);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  // Accept form state
  const [acceptForm, setAcceptForm] = useState({
    seller_notes: "",
    estimated_delivery_date: "",
    shipping_method: "",
  });

  // Reject form state
  const [rejectForm, setRejectForm] = useState({
    reason: "",
    seller_notes: "",
  });

  // Update status form state
  const [statusForm, setStatusForm] = useState({
    status: "",
    tracking_number: "",
    shipping_method: "",
    estimated_delivery_date: "",
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
    const result = await dispatch(
      acceptOrder({ orderId, acceptData: acceptForm })
    );
    if (acceptOrder.fulfilled.match(result)) {
      setShowAcceptModal(false);
      // Refresh timeline
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

  const handleUpdateStatus = async () => {
    const result = await dispatch(
      updateOrderStatus({ orderId, statusData: statusForm })
    );
    if (updateOrderStatus.fulfilled.match(result)) {
      setShowUpdateStatusModal(false);
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
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
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
  const canUpdateStatus =
    currentOrder.status !== "pending" &&
    currentOrder.status !== "cancelled" &&
    currentOrder.status !== "rejected";

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <nav className="text-sm text-[var(--primary-base)] mb-4">
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/seller"
                  className="px-2 py-1 rounded-full hover:bg-white"
                >
                  Seller
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link
                  href="/seller/orders"
                  className="px-2 py-1 rounded-full hover:bg-white"
                >
                  Orders
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <span className="px-2 py-1 rounded-full bg-white text-[var(--secondary-black)]">
                  {currentOrder.order_number}
                </span>
              </li>
            </ol>
          </nav>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--secondary-black)] mb-2">
                Order {currentOrder.order_number}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={classNames(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    getStatusColor(currentOrder.status)
                  )}
                >
                  {currentOrder.status.replace(/_/g, " ").toUpperCase()}
                </span>
                <span
                  className={classNames(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    getPaymentStatusColor(currentOrder.payment_status)
                  )}
                >
                  {currentOrder.payment_status?.toUpperCase() || "UNKNOWN"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {canAccept && (
                <>
                  <button
                    onClick={() => setShowAcceptModal(true)}
                    className="px-6 py-3 bg-[var(--primary-base)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all duration-200"
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-6 py-3 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
                  >
                    Reject Order
                  </button>
                </>
              )}
              {canUpdateStatus && (
                <button
                  onClick={() => setShowUpdateStatusModal(true)}
                  className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] overflow-hidden">
              <div className="p-6 border-b border-[var(--secondary-soft-highlight)]">
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-[var(--secondary-soft-highlight)]">
                {currentOrder.items?.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-4">
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
                        {formatCurrency(item.unit_price, currentOrder.currency)}{" "}
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
                ))}
              </div>

              {/* Order Summary */}
              <div className="p-6 bg-[var(--primary-background)] border-t border-[var(--secondary-soft-highlight)]">
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
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-[var(--secondary-muted-edge)] mb-2">
                    Shipping Address
                  </h3>
                  {currentOrder.shipping_address ? (
                    <div className="text-sm text-[var(--secondary-black)]">
                      {currentOrder.shipping_address.street && (
                        <p>{currentOrder.shipping_address.street}</p>
                      )}
                      {currentOrder.shipping_address.city && (
                        <p>
                          {currentOrder.shipping_address.city}
                          {currentOrder.shipping_address.state &&
                            `, ${currentOrder.shipping_address.state}`}{" "}
                          {currentOrder.shipping_address.zip}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      No address provided
                    </p>
                  )}
                </div>
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
                    {currentOrder.tracking_number && (
                      <div>
                        <span className="text-[var(--secondary-muted-edge)]">
                          Tracking:{" "}
                        </span>
                        <span className="text-[var(--secondary-black)] font-medium">
                          {currentOrder.tracking_number}
                        </span>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(currentOrder.buyer_notes || currentOrder.seller_notes) && (
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
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
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
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
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
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

      {/* Accept Order Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-4">
              Accept Order
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Shipping Method
                </label>
                <input
                  type="text"
                  value={acceptForm.shipping_method}
                  onChange={(e) =>
                    setAcceptForm((prev) => ({
                      ...prev,
                      shipping_method: e.target.value,
                    }))
                  }
                  className="input w-full"
                  placeholder="e.g., Standard Shipping"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={acceptForm.estimated_delivery_date}
                  onChange={(e) =>
                    setAcceptForm((prev) => ({
                      ...prev,
                      estimated_delivery_date: e.target.value,
                    }))
                  }
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={acceptForm.seller_notes}
                  onChange={(e) =>
                    setAcceptForm((prev) => ({
                      ...prev,
                      seller_notes: e.target.value,
                    }))
                  }
                  className="input w-full"
                  rows={3}
                  placeholder="Add any notes for the buyer..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
                disabled={currentOrderStatus === "loading"}
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptOrder}
                className="flex-1 px-4 py-2 bg-[var(--primary-base)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all duration-200"
                disabled={currentOrderStatus === "loading"}
              >
                {currentOrderStatus === "loading"
                  ? "Accepting..."
                  : "Accept Order"}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Update Status Modal */}
      {showUpdateStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-4">
              Update Order Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Status
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) =>
                    setStatusForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="input w-full"
                >
                  <option value="">Keep current status</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready for Pickup/Shipping</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={statusForm.tracking_number}
                  onChange={(e) =>
                    setStatusForm((prev) => ({
                      ...prev,
                      tracking_number: e.target.value,
                    }))
                  }
                  className="input w-full"
                  placeholder="Enter tracking number..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Shipping Method
                </label>
                <input
                  type="text"
                  value={statusForm.shipping_method}
                  onChange={(e) =>
                    setStatusForm((prev) => ({
                      ...prev,
                      shipping_method: e.target.value,
                    }))
                  }
                  className="input w-full"
                  placeholder="e.g., FedEx Express"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  value={statusForm.estimated_delivery_date}
                  onChange={(e) =>
                    setStatusForm((prev) => ({
                      ...prev,
                      estimated_delivery_date: e.target.value,
                    }))
                  }
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={statusForm.seller_notes}
                  onChange={(e) =>
                    setStatusForm((prev) => ({
                      ...prev,
                      seller_notes: e.target.value,
                    }))
                  }
                  className="input w-full"
                  rows={3}
                  placeholder="Add any notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpdateStatusModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
                disabled={currentOrderStatus === "loading"}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
                disabled={currentOrderStatus === "loading"}
              >
                {currentOrderStatus === "loading"
                  ? "Updating..."
                  : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
