"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  TagIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ClockIcon as ClockSolidIcon,
  XCircleIcon as XCircleSolidIcon,
} from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProductRequests,
  setFilters,
} from "@/store/slices/sellerProductRequestsSlice";
import ProcurLoader from "@/components/ProcurLoader";

export default function PurchaseRequestsClient() {
  const dispatch = useAppDispatch();
  const { requests, status, error, pagination, filters } = useAppSelector(
    (state) => state.sellerProductRequests
  );

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch requests on mount and when filters change
  useEffect(() => {
    const statusFilter =
      activeTab === "all"
        ? undefined
        : activeTab === "new"
        ? "open"
        : activeTab;

    dispatch(
      fetchProductRequests({
        ...filters,
        status: statusFilter,
        search: searchQuery || undefined,
      })
    );
  }, [dispatch, activeTab, searchQuery]);

  // Loading state
  if (status === "loading" && requests.length === 0) {
    return <ProcurLoader size="lg" text="Loading purchase requests..." />;
  }

  const getStatusBadge = (request: any) => {
    // Has quote and it's accepted
    if (request.my_quote?.status === "accepted") {
      return {
        text: "Accepted",
        className: "bg-green-100 text-green-700",
        icon: <CheckCircleSolidIcon className="h-3.5 w-3.5" />,
      };
    }
    // Has quote and it's rejected
    if (request.my_quote?.status === "rejected") {
      return {
        text: "Declined",
        className: "bg-red-100 text-red-700",
        icon: <XCircleSolidIcon className="h-3.5 w-3.5" />,
      };
    }
    // Has quote but still pending
    if (request.my_quote) {
      return {
        text: "Awaiting Response",
        className: "bg-yellow-100 text-yellow-700",
        icon: <ClockSolidIcon className="h-3.5 w-3.5" />,
      };
    }
    // New request - no quote yet
    return {
      text: "New Request",
      className: "bg-blue-100 text-blue-700",
      icon: <DocumentTextIcon className="h-3.5 w-3.5" />,
    };
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Tab counts
  const tabCounts = {
    all: pagination.total,
    new: requests.filter((r) => !r.my_quote && r.status === "open").length,
    responded: requests.filter((r) => r.my_quote).length,
    accepted: requests.filter((r) => r.my_quote?.status === "accepted").length,
    declined: requests.filter((r) => r.my_quote?.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--secondary-black)] mb-1">
              Purchase Requests
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              View buyer requests and submit your bids
            </p>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/20 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            {/* Tabs */}
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {[
                { key: "all", label: "All" },
                { key: "new", label: "New" },
                { key: "responded", label: "Responded" },
                { key: "accepted", label: "Accepted" },
                { key: "declined", label: "Declined" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-[var(--primary-accent2)] text-white shadow-md"
                      : "bg-[var(--primary-background)] text-[var(--secondary-black)] hover:bg-gray-100"
                  }`}
                >
                  {tab.label} (
                  {tabCounts[tab.key as keyof typeof tabCounts] || 0})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--secondary-muted-edge)]" />
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full pl-9 pr-3 py-2 bg-[var(--primary-background)] border border-[var(--secondary-soft-highlight)]/30 rounded-full text-sm outline-none focus:border-[var(--primary-accent2)] text-[var(--secondary-black)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Active Filters/Info */}
          {searchQuery && (
            <div className="mt-4 pt-4 border-t border-[var(--secondary-soft-highlight)]/20">
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Showing results for &quot;
                <span className="font-medium text-[var(--secondary-black)]">
                  {searchQuery}
                </span>
                &quot; in{" "}
                <span className="font-medium text-[var(--secondary-black)]">
                  {activeTab === "all" ? "All" : activeTab} Requests
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Error state */}
        {status === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[var(--secondary-soft-highlight)]/20">
            <DocumentTextIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
              No {activeTab === "all" ? "" : activeTab} requests found
            </h3>
            <p className="text-[var(--secondary-muted-edge)] mb-6">
              {activeTab === "all"
                ? "There are no buyer requests at the moment."
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => {
              const statusBadge = getStatusBadge(request);
              const hasQuote = !!request.my_quote;
              const isAccepted = request.my_quote?.status === "accepted";
              const isRejected = request.my_quote?.status === "rejected";

              return (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--secondary-black)] line-clamp-1 mb-1">
                          {request.product_name}
                        </h3>
                        <p className="text-sm text-[var(--secondary-muted-edge)] line-clamp-1">
                          {request.buyer_name}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className} flex-shrink-0 ml-2`}
                      >
                        {statusBadge.icon}
                        <span>{statusBadge.text}</span>
                      </div>
                    </div>

                    {/* Category */}
                    {request.category && (
                      <div className="flex items-center gap-1 text-sm text-[var(--secondary-muted-edge)] mb-3">
                        <TagIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{request.category}</span>
                      </div>
                    )}

                    {/* Request Details */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
                      <div className="flex items-center gap-1 text-[var(--secondary-muted-edge)]">
                        <span className="font-medium text-[var(--secondary-black)]">
                          Qty:
                        </span>
                        <span>
                          {request.quantity} {request.unit_of_measurement}
                        </span>
                      </div>
                      {request.budget_range && (
                        <div className="flex items-center gap-1 text-[var(--secondary-muted-edge)]">
                          <span className="font-medium text-[var(--secondary-black)]">
                            Budget:
                          </span>
                          <span>
                            {formatCurrency(
                              request.budget_range.max_price || 0,
                              request.budget_range.currency
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[var(--secondary-muted-edge)] col-span-2">
                        <CalendarDaysIcon className="h-4 w-4 flex-shrink-0" />
                        <span>Delivery: {formatDate(request.date_needed)}</span>
                      </div>
                      {request.delivery_location && (
                        <div className="flex items-center gap-1 text-[var(--secondary-muted-edge)] col-span-2">
                          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {request.delivery_location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* My Bid Info (if responded) */}
                    {hasQuote &&
                      request.my_quote &&
                      request.my_quote.unit_price && (
                        <div className="mb-4 p-3 bg-[var(--primary-background)] rounded-xl">
                          <p className="text-xs font-semibold text-[var(--secondary-black)] mb-1">
                            Your Quote:
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--secondary-muted-edge)]">
                              Price:
                            </span>
                            <span className="font-bold text-[var(--primary-accent2)]">
                              {formatCurrency(
                                request.my_quote.unit_price,
                                request.my_quote.currency || "USD"
                              )}
                              /{request.unit_of_measurement}
                            </span>
                          </div>
                          {request.my_quote.notes && (
                            <p className="text-xs text-[var(--secondary-muted-edge)] mt-1 line-clamp-2">
                              {request.my_quote.notes}
                            </p>
                          )}
                        </div>
                      )}

                    {/* Actions */}
                    <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/20">
                      {!hasQuote && request.status === "open" && (
                        <Link
                          href={`/seller/purchase-requests/${request.id}`}
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
                        >
                          Submit Bid
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      )}
                      {hasQuote && !isAccepted && !isRejected && (
                        <div className="flex gap-2">
                          <Link
                            href={`/seller/purchase-requests/${request.id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--primary-background)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--secondary-soft-highlight)]/20 transition-all duration-200"
                          >
                            View Details
                          </Link>
                          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200">
                            <ChatBubbleLeftIcon className="h-4 w-4" />
                            Message
                          </button>
                        </div>
                      )}
                      {isAccepted && (
                        <div className="text-center">
                          <p className="text-sm text-green-600 font-medium mb-2">
                            🎉 Your bid was accepted!
                          </p>
                          <Link
                            href={`/seller/orders`}
                            className="flex items-center justify-center gap-1.5 w-full px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-all duration-200"
                          >
                            View Order
                            <ArrowRightIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      )}
                      {isRejected && (
                        <div className="text-center">
                          <p className="text-sm text-red-600 font-medium">
                            Your bid was not selected this time.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
