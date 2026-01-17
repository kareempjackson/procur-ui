"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { addDays, formatShortDate } from "@/lib/utils/date";

type RequestDetailClientProps = {
  requestId: string;
};

export default function RequestDetailClient({
  requestId,
}: RequestDetailClientProps) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const now = new Date();

  // Mock request data (in real app, fetch by requestId)
  const request = {
    id: parseInt(requestId),
    productName: "Organic Cherry Tomatoes",
    quantity: "500 kg",
    deliveryDate: formatShortDate(addDays(now, 14)),
    deliveryLocation: "Kingston, Jamaica",
    status: "active",
    createdDate: formatShortDate(addDays(now, -7)),
    budget: "$2,500 - $3,000",
    orderType: "one-off",
    urgency: "standard",
    qualityGrade: "Grade A",
    additionalNotes:
      "Need fresh, premium quality cherry tomatoes for restaurant supply. Must be organic certified and delivered in refrigerated transport.",
    bids: [
      {
        id: 1,
        supplierName: "Caribbean Farms Co.",
        supplierRating: 4.8,
        supplierReviews: 234,
        price: 2750,
        pricePerUnit: "$5.50/kg",
        deliveryDate: formatShortDate(addDays(now, 14)),
        message:
          "We can provide premium organic cherry tomatoes, GAP certified. Our produce is freshly harvested and we have refrigerated transport available. We've been supplying restaurants for over 10 years.",
        responseTime: "2 hours ago",
        verified: true,
        status: "pending",
        certifications: ["Organic", "GAP"],
        estimatedDeliveryTime: "Same day",
      },
      {
        id: 2,
        supplierName: "Island Fresh Produce",
        supplierRating: 4.7,
        supplierReviews: 156,
        price: 2650,
        pricePerUnit: "$5.30/kg",
        deliveryDate: formatShortDate(addDays(now, 15)),
        message:
          "High quality tomatoes available. Can deliver on your schedule. We pride ourselves on consistent quality and reliability.",
        responseTime: "5 hours ago",
        verified: true,
        status: "pending",
        certifications: ["Organic", "Local"],
        estimatedDeliveryTime: "Next day",
      },
      {
        id: 3,
        supplierName: "Green Valley Farms",
        supplierRating: 4.6,
        supplierReviews: 98,
        price: 2950,
        pricePerUnit: "$5.90/kg",
        deliveryDate: formatShortDate(addDays(now, 13)),
        message:
          "Premium grade, early delivery available. We can guarantee the highest quality organic tomatoes.",
        responseTime: "1 day ago",
        verified: false,
        status: "pending",
        certifications: ["Hydroponic"],
        estimatedDeliveryTime: "1 day early",
      },
      {
        id: 4,
        supplierName: "Tropical Harvest Ltd",
        supplierRating: 4.9,
        supplierReviews: 189,
        price: 2800,
        pricePerUnit: "$5.60/kg",
        deliveryDate: formatShortDate(addDays(now, 14)),
        message:
          "We specialize in organic produce for commercial clients. Can provide documentation and quality certificates upon request.",
        responseTime: "3 hours ago",
        verified: true,
        status: "pending",
        certifications: ["Organic", "Export Ready", "HACCP"],
        estimatedDeliveryTime: "On time",
      },
      {
        id: 5,
        supplierName: "Spice Island Farms",
        supplierRating: 4.9,
        supplierReviews: 167,
        price: 2700,
        pricePerUnit: "$5.40/kg",
        deliveryDate: formatShortDate(addDays(now, 15)),
        message:
          "Best value for premium quality. We have a proven track record with restaurant chains.",
        responseTime: "6 hours ago",
        verified: true,
        status: "pending",
        certifications: ["Organic", "Fair Trade"],
        estimatedDeliveryTime: "Next day",
      },
    ],
  };

  const handleAccept = (bidId: number) => {
    setSelectedBidId(bidId);
    setShowAcceptModal(true);
  };

  const handleReject = (bidId: number) => {
    setSelectedBidId(bidId);
    setShowRejectModal(true);
  };

  const confirmAccept = () => {
    console.log("Accepting bid:", selectedBidId);
    setShowAcceptModal(false);
    // In real app, make API call to accept bid
  };

  const confirmReject = () => {
    console.log("Rejecting bid:", selectedBidId, "Reason:", rejectReason);
    setShowRejectModal(false);
    setRejectReason("");
    // In real app, make API call to reject bid
  };

  const selectedBid = request.bids.find((bid) => bid.id === selectedBidId);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main>
        {/* Header */}
        <section className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
          <div className="max-w-[1400px] mx-auto px-6 py-5">
            <Link
              href="/buyer/requests"
              className="inline-flex items-center gap-2 text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] mb-4 group"
            >
              <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Requests
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[var(--secondary-black)] mb-2">
                  {request.productName}
                </h1>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  Request #{request.id} • Created on {request.createdDate}
                </p>
              </div>

              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                Active
              </span>
            </div>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - Bids */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Bids Received ({request.bids.length})
                  </h2>
                  <div className="text-sm text-[var(--secondary-muted-edge)]">
                    Sort by:{" "}
                    <select className="ml-2 px-3 py-1 border border-[var(--secondary-soft-highlight)]/30 rounded-lg text-sm">
                      <option>Lowest Price</option>
                      <option>Highest Rating</option>
                      <option>Newest</option>
                    </select>
                  </div>
                </div>

                {request.bids.length === 0 ? (
                  <div className="text-center py-12">
                    <ChatBubbleLeftIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      No bids yet
                    </h3>
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      Suppliers will start sending bids soon. Check back later.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {request.bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="border border-[var(--secondary-soft-highlight)]/30 rounded-xl p-4 hover:border-[var(--primary-accent2)]/30 transition-all duration-200"
                      >
                        {/* Bid Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--primary-accent2)]/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-[var(--primary-accent2)]">
                                {bid.supplierName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-[var(--secondary-black)]">
                                  {bid.supplierName}
                                </h3>
                                {bid.verified && (
                                  <CheckBadgeIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-[var(--secondary-muted-edge)]">
                                <div className="flex items-center gap-1">
                                  <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium text-[var(--secondary-black)]">
                                    {bid.supplierRating}
                                  </span>
                                  <span>({bid.supplierReviews} reviews)</span>
                                </div>
                                <span>•</span>
                                <span>{bid.responseTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-[var(--primary-accent2)] mb-1">
                              ${bid.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-[var(--secondary-muted-edge)]">
                              {bid.pricePerUnit}
                            </div>
                          </div>
                        </div>

                        {/* Bid Details */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-xs">
                            <CalendarIcon className="h-4 w-4 text-[var(--secondary-muted-edge)]" />
                            <div>
                              <div className="text-[var(--secondary-muted-edge)]">
                                Delivery
                              </div>
                              <div className="font-medium text-[var(--secondary-black)]">
                                {bid.deliveryDate}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <ClockIcon className="h-4 w-4 text-[var(--secondary-muted-edge)]" />
                            <div>
                              <div className="text-[var(--secondary-muted-edge)]">
                                Timeline
                              </div>
                              <div className="font-medium text-[var(--secondary-black)]">
                                {bid.estimatedDeliveryTime}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircleIcon className="h-4 w-4 text-[var(--secondary-muted-edge)]" />
                            <div>
                              <div className="text-[var(--secondary-muted-edge)]">
                                Certifications
                              </div>
                              <div className="font-medium text-[var(--secondary-black)]">
                                {bid.certifications.length}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Certifications */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {bid.certifications.map((cert) => (
                            <span
                              key={cert}
                              className="px-2 py-1 bg-[var(--primary-background)] rounded text-xs font-medium text-[var(--secondary-black)]"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>

                        {/* Message */}
                        <p className="text-sm text-[var(--secondary-black)] mb-4 p-3 bg-[var(--primary-background)] rounded-lg">
                          {bid.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(bid.id)}
                            className="flex-1 px-4 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            Accept Bid
                          </button>
                          <button
                            onClick={() => handleReject(bid.id)}
                            className="flex-1 px-4 py-2.5 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <XCircleIcon className="h-4 w-4" />
                            Decline
                          </button>
                          <Link
                            href={`/buyer/messages?supplier=${bid.supplierName}`}
                            className="px-4 py-2.5 bg-white border border-[var(--primary-accent2)] text-[var(--primary-accent2)] rounded-full text-sm font-medium hover:bg-[var(--primary-accent2)] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <ChatBubbleLeftIcon className="h-4 w-4" />
                            Message
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Request Details */}
            <div className="space-y-6">
              {/* Request Info */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
                <h3 className="text-sm font-semibold text-[var(--secondary-black)] mb-4 flex items-center gap-2">
                  <InformationCircleIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  Request Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                      Quantity Needed
                    </div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      {request.quantity}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                      Delivery Date
                    </div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      {request.deliveryDate}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                      Delivery Location
                    </div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      {request.deliveryLocation}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                      Budget Range
                    </div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      {request.budget}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                      Quality Grade
                    </div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      {request.qualityGrade}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                      Order Type
                    </div>
                    <div className="text-sm font-medium text-[var(--secondary-black)] capitalize">
                      {request.orderType.replace("-", " ")}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                      Urgency
                    </div>
                    <div className="text-sm font-medium text-[var(--secondary-black)] capitalize">
                      {request.urgency}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
                <h3 className="text-sm font-semibold text-[var(--secondary-black)] mb-3">
                  Additional Notes
                </h3>
                <p className="text-sm text-[var(--secondary-black)] leading-relaxed">
                  {request.additionalNotes}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-[var(--primary-background)] rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
                <h3 className="text-sm font-semibold text-[var(--secondary-black)] mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    href={`/buyer/request?edit=${request.id}`}
                    className="block w-full px-4 py-2 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-lg text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 text-center"
                  >
                    Edit Request
                  </Link>
                  <button className="block w-full px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-all duration-200">
                    Cancel Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Accept Bid Modal */}
      {showAcceptModal && selectedBid && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Accept Bid
                </h3>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  {selectedBid.supplierName}
                </p>
              </div>
            </div>

            <div className="bg-[var(--primary-background)] rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--secondary-muted-edge)]">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-[var(--primary-accent2)]">
                  ${selectedBid.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--secondary-muted-edge)]">
                  Delivery
                </span>
                <span className="font-medium text-[var(--secondary-black)]">
                  {selectedBid.deliveryDate}
                </span>
              </div>
            </div>

            <p className="text-sm text-[var(--secondary-muted-edge)] mb-6">
              By accepting this bid, you agree to proceed with this supplier.
              They will be notified immediately and can start preparing your
              order.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAccept}
                className="flex-1 px-4 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
              >
                Confirm Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Bid Modal */}
      {showRejectModal && selectedBid && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Decline Bid
                </h3>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  {selectedBid.supplierName}
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
              Please provide a reason for declining this bid (optional). This
              helps suppliers improve their offerings.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for declining..."
              className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-xl text-sm outline-none focus:border-[var(--primary-accent2)] transition-colors resize-none mb-6"
              rows={4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-all duration-200"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
