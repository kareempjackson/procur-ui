"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";
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
  const router = useRouter();
  const client = useMemo(() => getApiClient(), []);

  const [showBidModal, setShowBidModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<any | null>(null);
  const [bidForm, setBidForm] = useState({
    price: "",
    deliveryDate: "",
    notes: "",
  });
  const { show } = useToast();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await client.get(
          `/sellers/product-requests/${requestId}`
        );
        if (isMounted) setRequest(data);
      } catch (e: any) {
        if (isMounted)
          setError(e?.response?.data?.message || "Failed to load request");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [client, requestId]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting bid:", bidForm);
    show("Bid submitted successfully!");
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

  const handleMessageBuyer = async () => {
    if (!request) return;
    try {
      const payload: any = {
        contextType: "product_request",
        contextId: request.id,
        title: request.request_number
          ? `RFQ ${request.request_number} • ${request.buyer_name || "Buyer"}`
          : request.product_name,
      };
      if (request.buyer_user_id) {
        payload.withUserId = request.buyer_user_id;
      }
      const { data } = await client.post("/conversations/start", payload);
      if (data?.id) {
        router.push(`/seller/messages?conversationId=${data.id}`);
      }
    } catch (e) {
      // no-op; you could show a toast here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="text-[var(--secondary-muted-edge)]">Loading…</div>
        </main>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="text-red-600">{error || "Request not found"}</div>
        </main>
      </div>
    );
  }

  const buyerName = request.buyer_name || "Buyer";
  const productName = request.product_name || "Purchase Request";
  const deliveryDate = request.date_needed || "—";
  const deliveryLocation = request.delivery_location || "—";
  const unit = request.unit_of_measurement || "unit";
  const quantity =
    request.quantity != null ? `${request.quantity} ${unit}` : "—";
  const budgetMin = request.budget_range?.min_price;
  const budgetMax = request.budget_range?.max_price;
  const budgetCurrency = request.budget_range?.currency || "";
  const mapQuery = request.delivery_location || request.buyer_country || "";
  const mapEmbedUrl = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : null;

  return (
    <div className="min-h-screen bg-white">
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
                    {productName}
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
                      <span>
                        Posted{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
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
                      {buyerName}
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
                <button
                  onClick={handleMessageBuyer}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
                >
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
                    {quantity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                    Budget Range
                  </p>
                  <p className="text-base font-semibold text-[var(--secondary-black)]">
                    {typeof budgetMin === "number" &&
                    typeof budgetMax === "number"
                      ? `${budgetCurrency} ${budgetMin.toFixed(2)} - ${budgetCurrency} ${budgetMax.toFixed(2)} / ${unit}`
                      : "—"}
                  </p>
                </div>
              </div>

              {request.description && (
                <div className="mt-4 pt-4 border-t border-[var(--secondary-soft-highlight)]/20">
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-2">
                    Additional Notes
                  </p>
                  <p className="text-sm text-[var(--secondary-black)]">
                    {request.description}
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
                      {deliveryDate}
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
                      {deliveryLocation}
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
                {mapEmbedUrl && (
                  <div className="pt-3">
                    <div
                      className="relative w-full overflow-hidden rounded-xl border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)]"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        title="Delivery Location Map"
                        src={mapEmbedUrl}
                        className="absolute top-0 left-0 w-full h-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--primary-accent2)] hover:underline"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                )}
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
                    {typeof budgetMin === "number" &&
                    typeof budgetMax === "number"
                      ? `${budgetCurrency} ${budgetMin.toFixed(2)} - ${budgetCurrency} ${budgetMax.toFixed(2)}`
                      : "—"}
                  </p>
                  <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
                    per {unit}
                  </p>
                </div>

                {/* Optionally add quote count here if exposed */}
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
            className="absolute inset-0 bg-black/30"
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
                  Your Price (per {unit})
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
                {typeof budgetMin === "number" &&
                  typeof budgetMax === "number" && (
                    <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
                      Budget range: {budgetCurrency} {budgetMin.toFixed(2)} -{" "}
                      {budgetCurrency} {budgetMax.toFixed(2)}
                    </p>
                  )}
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
                  Requested by: {deliveryDate}
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
