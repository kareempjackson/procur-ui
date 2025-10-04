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
  XCircleIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  CubeIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const demoOrder = {
  id: "ord_abc123",
  orderNumber: "#10245",
  status: "pending",
  paymentStatus: "paid",
  createdAt: "2025-10-05T14:30:00Z",
  total: 77.5,
  subtotal: 77.5,
  shipping: 25.0,
  tax: 6.2,
  currency: "USD",
  buyer: {
    id: "buyer_1",
    name: "John Smith",
    organizationName: "Miami Fresh Markets",
    email: "john.smith@miamifresh.com",
    phone: "(305) 555-0123",
  },
  items: [
    {
      id: "item_1",
      productId: "prod_1",
      productName: "Organic Cherry Tomatoes",
      sku: "TOM-CHE-001",
      quantity: 10,
      unit: "lb",
      unitPrice: 3.5,
      totalPrice: 35.0,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      stockAvailable: 100,
    },
    {
      id: "item_2",
      productId: "prod_2",
      productName: "Fresh Basil",
      sku: "BAS-FRE-001",
      quantity: 5,
      unit: "bunch",
      unitPrice: 8.5,
      totalPrice: 42.5,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      stockAvailable: 30,
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
  buyerNotes: "Please leave at door if no one is home. Ring doorbell twice.",
  estimatedDelivery: "2025-10-15",
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

export default function SellerOrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showShipDialog, setShowShipDialog] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    demoOrder.estimatedDelivery
  );
  const [sellerNotes, setSellerNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("FedEx");

  const handleAcceptOrder = () => {
    console.log("Accepting order", { estimatedDelivery, sellerNotes });
    setShowAcceptDialog(false);
  };

  const handleRejectOrder = () => {
    console.log("Rejecting order", { rejectReason });
    setShowRejectDialog(false);
  };

  const handleMarkAsShipped = () => {
    console.log("Marking as shipped", { trackingNumber, carrier });
    setShowShipDialog(false);
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/seller/orders"
              className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="font-medium">Back to Orders</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-white transition-all">
              <PrinterIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Print Packing Slip</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-white transition-all">
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Download Invoice</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <div className="flex items-start justify-between mb-6">
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
                          hour: "numeric",
                          minute: "2-digit",
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

              {/* Action Buttons */}
              {demoOrder.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                  <button
                    onClick={() => setShowAcceptDialog(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-sm"
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span className="font-medium">Accept Order</span>
                  </button>
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-all"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span className="font-medium">Reject Order</span>
                  </button>
                </div>
              )}

              {demoOrder.status === "processing" && (
                <div className="flex gap-3 pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                  <Link
                    href={`/seller/orders/${params.orderId}/process`}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-sm"
                  >
                    <CubeIcon className="h-5 w-5" />
                    <span className="font-medium">Process Order</span>
                  </Link>
                  <button
                    onClick={() => setShowShipDialog(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all shadow-sm"
                  >
                    <TruckIcon className="h-5 w-5" />
                    <span className="font-medium">Mark as Shipped</span>
                  </button>
                </div>
              )}
            </div>

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
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--secondary-black)]">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                        SKU: {item.sku}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        Quantity: {item.quantity} {item.unit} × $
                        {item.unitPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
                        Stock Available: {item.stockAvailable} {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--secondary-black)]">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                      <Link
                        href={`/seller/products/${item.productId}`}
                        className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] mt-2 inline-block"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer Notes */}
            {demoOrder.buyerNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  Buyer's Delivery Instructions
                </h3>
                <p className="text-sm text-blue-800">{demoOrder.buyerNotes}</p>
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
                    Shipping (charged to buyer)
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
                      Total Revenue
                    </span>
                    <span className="font-bold text-xl text-green-600">
                      ${demoOrder.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--secondary-black)]">
                    Estimated Delivery
                  </span>
                  <span className="text-sm font-semibold text-[var(--primary-accent2)]">
                    {new Date(demoOrder.estimatedDelivery).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30 mt-4">
                <h4 className="font-semibold text-[var(--secondary-black)] mb-3">
                  Buyer Information
                </h4>
                <div className="space-y-2">
                  <p className="font-medium text-[var(--secondary-black)]">
                    {demoOrder.buyer.name}
                  </p>
                  <p className="text-sm text-[var(--secondary-muted-edge)]">
                    {demoOrder.buyer.organizationName}
                  </p>
                  <div className="text-sm text-[var(--secondary-muted-edge)] space-y-1">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      {demoOrder.buyer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      {demoOrder.buyer.phone}
                    </div>
                  </div>
                  <Link
                    href={`/seller/messages?buyer=${demoOrder.buyer.id}`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all mt-3 shadow-sm"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Contact Buyer</span>
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
                  <p className="text-[var(--secondary-muted-edge)]">
                    {demoOrder.shippingAddress.country}
                  </p>
                  <p className="text-[var(--secondary-muted-edge)] mt-2">
                    {demoOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accept Order Dialog */}
        {showAcceptDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Accept Order
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Notes for Buyer (Optional)
                  </label>
                  <textarea
                    value={sellerNotes}
                    onChange={(e) => setSellerNotes(e.target.value)}
                    placeholder="Add any special instructions or information..."
                    rows={3}
                    className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAcceptDialog(false)}
                  className="flex-1 px-5 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptOrder}
                  className="flex-1 px-5 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-sm"
                >
                  Accept Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Order Dialog */}
        {showRejectDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Reject Order
                </h3>
              </div>

              <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                Please provide a reason for rejecting this order. The buyer will
                be notified.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Out of stock, Unable to fulfill order, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectDialog(false)}
                  className="flex-1 px-5 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectOrder}
                  disabled={!rejectReason}
                  className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Reject Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mark as Shipped Dialog */}
        {showShipDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Mark as Shipped
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Carrier
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  >
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="USPS">USPS</option>
                    <option value="DHL">DHL</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowShipDialog(false)}
                  className="flex-1 px-5 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsShipped}
                  disabled={!trackingNumber}
                  className="flex-1 px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Mark as Shipped
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
