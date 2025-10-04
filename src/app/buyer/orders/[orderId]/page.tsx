"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "@heroicons/react/24/outline";

// Demo order data with full tracking
const demoOrder = {
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
  params: { orderId: string };
}) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelOrder = () => {
    // Will handle order cancellation
    console.log("Cancelling order with reason:", cancelReason);
    setShowCancelDialog(false);
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
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
            {demoOrder.canReview && (
              <Link
                href={`/buyer/orders/${params.orderId}/review`}
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
                    Order {demoOrder.orderNumber}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-[var(--secondary-muted-edge)]">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      Placed on{" "}
                      {new Date(demoOrder.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      statusColors[demoOrder.status]
                    }`}
                  >
                    {demoOrder.status.charAt(0).toUpperCase() +
                      demoOrder.status.slice(1)}
                  </span>
                  <span className="text-sm text-[var(--secondary-muted-edge)]">
                    Payment: {demoOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              {demoOrder.canCancel && (
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
            {demoOrder.tracking && (
              <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                    Tracking Information
                  </h2>
                  <a
                    href={demoOrder.tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium"
                  >
                    View on {demoOrder.tracking.carrier} →
                  </a>
                </div>

                {/* Current Status */}
                <div className="bg-gradient-to-r from-[var(--primary-accent2)]/10 to-[var(--primary-accent3)]/10 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--primary-accent2)] rounded-full flex items-center justify-center">
                      <TruckIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--secondary-black)]">
                        {demoOrder.tracking.currentStatus}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        {demoOrder.tracking.lastLocation}
                      </p>
                    </div>
                    <div className="text-right text-sm text-[var(--secondary-muted-edge)]">
                      {new Date(demoOrder.tracking.lastUpdate).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* Tracking Number */}
                <div className="flex items-center justify-between p-3 bg-[var(--primary-background)] rounded-lg mb-6">
                  <span className="text-sm text-[var(--secondary-muted-edge)]">
                    Tracking Number
                  </span>
                  <span className="font-mono font-semibold text-[var(--secondary-black)]">
                    {demoOrder.tracking.trackingNumber}
                  </span>
                </div>

                {/* Timeline */}
                <div className="space-y-1">
                  {demoOrder.tracking.events.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? event.isEstimate
                                ? "bg-gray-300"
                                : "bg-green-500"
                              : event.isEstimate
                              ? "bg-gray-300"
                              : "bg-[var(--primary-accent2)]"
                          }`}
                        />
                        {index < demoOrder.tracking.events.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200" />
                        )}
                      </div>
                      <div
                        className={`flex-1 ${
                          index < demoOrder.tracking.events.length - 1
                            ? "pb-4"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p
                              className={`font-semibold ${
                                event.isEstimate
                                  ? "text-[var(--secondary-muted-edge)]"
                                  : "text-[var(--secondary-black)]"
                              }`}
                            >
                              {event.status}
                            </p>
                            <p className="text-sm text-[var(--secondary-muted-edge)] mt-0.5">
                              {event.description}
                            </p>
                            <p className="text-xs text-[var(--secondary-muted-edge)] mt-0.5">
                              {event.location}
                            </p>
                          </div>
                          {event.date && (
                            <span className="text-xs text-[var(--secondary-muted-edge)]">
                              {new Date(event.date).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                          {event.isEstimate && (
                            <span className="text-xs text-[var(--secondary-muted-edge)]">
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                Order Items
              </h2>
              <div className="space-y-4">
                {demoOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-[var(--secondary-soft-highlight)]/30 last:border-0 last:pb-0"
                  >
                    <Link
                      href={`/buyer/product/${item.productId}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 group"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/buyer/product/${item.productId}`}
                        className="font-semibold text-[var(--secondary-black)] hover:text-[var(--primary-accent2)] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                        Quantity: {item.quantity} {item.unit}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        ${item.price.toFixed(2)} per {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--secondary-black)]">
                        ${item.total.toFixed(2)}
                      </p>
                      <Link
                        href={`/buyer/product/${item.productId}`}
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
            {demoOrder.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">
                  Delivery Instructions
                </h3>
                <p className="text-sm text-blue-800">{demoOrder.notes}</p>
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
                    ${demoOrder.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Shipping
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    ${demoOrder.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Tax
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    ${demoOrder.tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[var(--secondary-black)]">
                      Total
                    </span>
                    <span className="font-bold text-xl text-[var(--secondary-black)]">
                      ${demoOrder.total.toFixed(2)}
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
                      {demoOrder.seller.name}
                    </span>
                    {demoOrder.seller.verified && (
                      <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-[var(--secondary-black)]">
                      {demoOrder.seller.rating}
                    </span>
                    <span className="text-[var(--secondary-muted-edge)]">
                      ({demoOrder.seller.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="text-sm text-[var(--secondary-muted-edge)]">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPinIcon className="h-4 w-4" />
                      {demoOrder.seller.location}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <EnvelopeIcon className="h-4 w-4" />
                      {demoOrder.seller.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      {demoOrder.seller.phone}
                    </div>
                  </div>
                  <Link
                    href={`/buyer/messages?seller=${demoOrder.seller.id}`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all mt-3 shadow-sm"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Contact Seller</span>
                  </Link>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30 mt-4">
                <h4 className="font-semibold text-[var(--secondary-black)] mb-3">
                  Shipping Address
                </h4>
                <div className="text-sm text-[var(--secondary-black)]">
                  <p className="font-medium">
                    {demoOrder.shippingAddress.name}
                  </p>
                  <p className="text-[var(--secondary-muted-edge)] mt-1">
                    {demoOrder.shippingAddress.street}
                  </p>
                  {demoOrder.shippingAddress.apartment && (
                    <p className="text-[var(--secondary-muted-edge)]">
                      {demoOrder.shippingAddress.apartment}
                    </p>
                  )}
                  <p className="text-[var(--secondary-muted-edge)]">
                    {demoOrder.shippingAddress.city},{" "}
                    {demoOrder.shippingAddress.state}{" "}
                    {demoOrder.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
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
                  className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-sm"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
