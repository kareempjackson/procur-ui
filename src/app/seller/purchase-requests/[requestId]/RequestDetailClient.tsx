"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  TagIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserCircleIcon,
  StarIcon,
  TruckIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type RequestDetailClientProps = {
  requestId: string;
};

export default function RequestDetailClient({
  requestId,
}: RequestDetailClientProps) {
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidForm, setBidForm] = useState({
    price: "",
    deliveryDate: "",
    notes: "",
  });

  // Mock request data
  const request = {
    id: requestId,
    buyerName: "Kingston Restaurant Group",
    buyerRating: 4.8,
    buyerReviews: 145,
    buyerLocation: "Kingston, Jamaica",
    productName: "Organic Hass Avocados",
    status: "new",
    orderType: "one-off",
    quantity: "500 kg",
    unit: "kg",
    qualityGrade: "Grade A",
    deliveryLocation: "Kingston, Jamaica",
    deliveryDate: "2024-11-15",
    budgetMin: 2.0,
    budgetMax: 3.0,
    urgency: "medium",
    additionalNotes:
      "Looking for consistent supply. Packaging in crates preferred. Please specify origin. We need certified organic produce with proper documentation.",
    createdAt: "2024-10-01",
    totalBids: 3,
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting bid:", bidForm);
    alert("Bid submitted successfully!");
    setShowBidModal(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href="/seller/purchase-requests"
          className="inline-flex items-center gap-2 text-sm text-[var(--secondary-muted-edge)] hover:text-[var(--secondary-black)] transition-colors duration-200 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to All Requests
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Header */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[var(--secondary-black)] mb-2">
                    {request.productName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                        request.urgency
                      )}`}
                    >
                      {request.urgency} urgency
                    </span>
                    <div className="flex items-center gap-1 text-sm text-[var(--secondary-muted-edge)]">
                      <TagIcon className="h-4 w-4" />
                      <span>
                        {request.orderType === "recurring"
                          ? "Recurring Order"
                          : "One-Off Order"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[var(--secondary-muted-edge)]">
                      <ClockIcon className="h-4 w-4" />
                      <span>Posted {request.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="flex items-center justify-between p-4 bg-[var(--primary-background)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary-accent2)]/10 flex items-center justify-center">
                    <UserCircleIcon className="h-8 w-8 text-[var(--primary-accent2)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--secondary-black)]">
                      {request.buyerName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-[var(--secondary-black)]">
                          {request.buyerRating}
                        </span>
                        <span className="text-[var(--secondary-muted-edge)]">
                          ({request.buyerReviews} reviews)
                        </span>
                      </div>
                      <span className="text-[var(--secondary-muted-edge)]">
                        · {request.buyerLocation}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200">
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  Message
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--secondary-soft-highlight)]/20">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Product Requirements
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                    Quantity
                  </p>
                  <p className="text-base font-semibold text-[var(--secondary-black)]">
                    {request.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                    Quality Grade
                  </p>
                  <p className="text-base font-semibold text-[var(--secondary-black)]">
                    {request.qualityGrade}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                    Budget Range
                  </p>
                  <p className="text-base font-semibold text-[var(--secondary-black)]">
                    ${request.budgetMin.toFixed(2)} - $
                    {request.budgetMax.toFixed(2)} / {request.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                    Order Type
                  </p>
                  <p className="text-base font-semibold text-[var(--secondary-black)]">
                    {request.orderType === "recurring"
                      ? "Recurring"
                      : "One-Off"}
                  </p>
                </div>
              </div>

              {request.additionalNotes && (
                <div className="mt-4 pt-4 border-t border-[var(--secondary-soft-highlight)]/20">
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-2">
                    Additional Notes
                  </p>
                  <p className="text-sm text-[var(--secondary-black)]">
                    {request.additionalNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--secondary-soft-highlight)]/20">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Delivery Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CalendarDaysIcon className="h-5 w-5 text-[var(--primary-accent2)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      Delivery Date
                    </p>
                    <p className="text-base font-semibold text-[var(--secondary-black)]">
                      {request.deliveryDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-[var(--primary-accent2)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      Delivery Location
                    </p>
                    <p className="text-base font-semibold text-[var(--secondary-black)]">
                      {request.deliveryLocation}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TruckIcon className="h-5 w-5 text-[var(--primary-accent2)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      Shipping Method
                    </p>
                    <p className="text-base font-semibold text-[var(--secondary-black)]">
                      Buyer's Preferred Method
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--secondary-soft-highlight)]/20 sticky top-6">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Submit Your Bid
              </h3>

              <div className="space-y-4 mb-6">
                <div className="p-3 bg-[var(--primary-background)] rounded-xl">
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                    Budget Range
                  </p>
                  <p className="text-xl font-bold text-[var(--primary-accent2)]">
                    ${request.budgetMin.toFixed(2)} - $
                    {request.budgetMax.toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
                    per {request.unit}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Total Bids
                  </span>
                  <span className="font-semibold text-[var(--secondary-black)]">
                    {request.totalBids} bids
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowBidModal(true)}
                className="w-full px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
              >
                Submit Bid
              </button>

              <p className="text-xs text-[var(--secondary-muted-edge)] text-center mt-3">
                Your bid will be reviewed by the buyer
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                💡 Bidding Tips
              </h3>
              <ul className="space-y-2 text-xs text-blue-800">
                <li>• Be competitive but fair with your pricing</li>
                <li>• Highlight your product quality and certifications</li>
                <li>• Offer flexible delivery options if possible</li>
                <li>• Respond promptly to buyer questions</li>
                <li>• Include photos of your products if available</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Bid Submission Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowBidModal(false)}
          />
          <div className="relative bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] w-full max-w-md p-6 mx-4">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-4">
              Submit Your Bid
            </h2>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Your Price (per {request.unit})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-muted-edge)]">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full pl-8 pr-3 py-2 border border-[var(--secondary-soft-highlight)]/30 rounded-lg outline-none focus:border-[var(--primary-accent2)] text-[var(--secondary-black)]"
                    placeholder="0.00"
                    value={bidForm.price}
                    onChange={(e) =>
                      setBidForm({ ...bidForm, price: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
                  Budget range: ${request.budgetMin.toFixed(2)} - $
                  {request.budgetMax.toFixed(2)}
                </p>
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Earliest Delivery Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-[var(--secondary-soft-highlight)]/30 rounded-lg outline-none focus:border-[var(--primary-accent2)] text-[var(--secondary-black)]"
                  value={bidForm.deliveryDate}
                  onChange={(e) =>
                    setBidForm({ ...bidForm, deliveryDate: e.target.value })
                  }
                />
                <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
                  Requested by: {request.deliveryDate}
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Message to Buyer (Optional)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-[var(--secondary-soft-highlight)]/30 rounded-lg outline-none focus:border-[var(--primary-accent2)] text-[var(--secondary-black)] resize-none"
                  placeholder="Tell the buyer about your product quality, certifications, or any other relevant information..."
                  value={bidForm.notes}
                  onChange={(e) =>
                    setBidForm({ ...bidForm, notes: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
                >
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
