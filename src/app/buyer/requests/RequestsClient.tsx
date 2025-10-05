"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchRequests, setFilters } from "@/store/slices/buyerRequestsSlice";
import ProcurLoader from "@/components/ProcurLoader";

export default function RequestsClient() {
  const dispatch = useAppDispatch();
  const { requests, status, error, pagination } = useAppSelector(
    (state) => state.buyerRequests
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Fetch requests on mount
  useEffect(() => {
    dispatch(fetchRequests({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Fetch requests when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filters: any = {
        page: 1,
        limit: 20,
      };

      if (searchQuery) filters.search = searchQuery;
      if (selectedStatus !== "all") filters.status = selectedStatus;

      dispatch(fetchRequests(filters));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedStatus, dispatch]);

  // Mock requests data
  const allRequests = [
    {
      id: 1,
      productName: "Organic Cherry Tomatoes",
      quantity: "500 kg",
      deliveryDate: "Oct 25, 2025",
      deliveryLocation: "Kingston, Jamaica",
      status: "active",
      createdDate: "Oct 1, 2025",
      bidsCount: 5,
      budget: "$2,500 - $3,000",
      orderType: "one-off",
      urgency: "standard",
      bids: [
        {
          id: 1,
          supplierName: "Caribbean Farms Co.",
          supplierRating: 4.8,
          price: "$2,750",
          pricePerUnit: "$5.50/kg",
          deliveryDate: "Oct 25, 2025",
          message:
            "We can provide premium organic cherry tomatoes, GAP certified.",
          responseTime: "2 hours ago",
          verified: true,
          status: "pending",
        },
        {
          id: 2,
          supplierName: "Island Fresh Produce",
          supplierRating: 4.7,
          price: "$2,650",
          pricePerUnit: "$5.30/kg",
          deliveryDate: "Oct 26, 2025",
          message:
            "High quality tomatoes available. Can deliver on your schedule.",
          responseTime: "5 hours ago",
          verified: true,
          status: "pending",
        },
        {
          id: 3,
          supplierName: "Green Valley Farms",
          supplierRating: 4.6,
          price: "$2,950",
          pricePerUnit: "$5.90/kg",
          deliveryDate: "Oct 24, 2025",
          message: "Premium grade, early delivery available.",
          responseTime: "1 day ago",
          verified: false,
          status: "pending",
        },
      ],
    },
    {
      id: 2,
      productName: "Fresh Mangoes (Alphonso)",
      quantity: "200 kg",
      deliveryDate: "Oct 20, 2025",
      deliveryLocation: "Kingston, Jamaica",
      status: "completed",
      createdDate: "Sep 28, 2025",
      bidsCount: 8,
      budget: "$1,200 - $1,500",
      orderType: "one-off",
      urgency: "urgent",
      acceptedBid: {
        supplierName: "Tropical Harvest Ltd",
        price: "$1,350",
        pricePerUnit: "$6.75/kg",
      },
    },
    {
      id: 3,
      productName: "Sweet Potatoes",
      quantity: "1000 kg",
      deliveryDate: "Nov 5, 2025",
      deliveryLocation: "Montego Bay, Jamaica",
      status: "active",
      createdDate: "Oct 3, 2025",
      bidsCount: 3,
      budget: "$800 - $1,000",
      orderType: "recurring",
      urgency: "standard",
      recurringFrequency: "monthly",
      bids: [
        {
          id: 4,
          supplierName: "Island Fresh Produce",
          supplierRating: 4.7,
          price: "$900",
          pricePerUnit: "$0.90/kg",
          deliveryDate: "Nov 5, 2025",
          message: "We can commit to monthly deliveries at this rate.",
          responseTime: "3 hours ago",
          verified: true,
          status: "pending",
        },
      ],
    },
    {
      id: 4,
      productName: "Organic Lettuce",
      quantity: "150 kg",
      deliveryDate: "Oct 15, 2025",
      deliveryLocation: "Kingston, Jamaica",
      status: "expired",
      createdDate: "Sep 25, 2025",
      bidsCount: 2,
      budget: "$450 - $600",
      orderType: "one-off",
      urgency: "standard",
    },
    {
      id: 5,
      productName: "Fresh Herbs Mix",
      quantity: "50 kg",
      deliveryDate: "Oct 30, 2025",
      deliveryLocation: "Kingston, Jamaica",
      status: "active",
      createdDate: "Oct 5, 2025",
      bidsCount: 7,
      budget: "$300 - $400",
      orderType: "recurring",
      urgency: "standard",
      recurringFrequency: "weekly",
      bids: [
        {
          id: 5,
          supplierName: "Herb Haven",
          supplierRating: 4.5,
          price: "$350",
          pricePerUnit: "$7.00/kg",
          deliveryDate: "Oct 30, 2025",
          message: "Fresh cut herbs available weekly. Premium quality.",
          responseTime: "1 hour ago",
          verified: true,
          status: "pending",
        },
        {
          id: 6,
          supplierName: "Spice Island Farms",
          supplierRating: 4.9,
          price: "$375",
          pricePerUnit: "$7.50/kg",
          deliveryDate: "Oct 29, 2025",
          message:
            "Organic certified herbs, can start weekly deliveries immediately.",
          responseTime: "4 hours ago",
          verified: true,
          status: "pending",
        },
      ],
    },
  ];

  // Use requests from Redux (already filtered by API)
  const filteredRequests = requests.map((request) => ({
    id: request.id,
    productName: request.product_name,
    quantity: `${request.quantity} ${request.unit_of_measurement}`,
    deliveryDate: request.date_needed
      ? new Date(request.date_needed).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Flexible",
    deliveryLocation: request.target_seller_name || "Open Market",
    status: request.status,
    createdDate: new Date(request.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    bidsCount: request.response_count || 0,
    budget:
      request.budget_range?.min && request.budget_range?.max
        ? `${request.budget_range.currency || "$"}${
            request.budget_range.min
          } - ${request.budget_range.currency || "$"}${
            request.budget_range.max
          }`
        : "Open",
    orderType: request.category || "one-off",
    urgency: request.product_type || "standard",
  }));

  // Status counts from pagination
  const statusCounts = {
    all: pagination.totalItems,
    active: requests.filter((r) => r.status === "active").length,
    completed: requests.filter((r) => r.status === "completed").length,
    expired: requests.filter((r) => r.status === "expired").length,
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <ClockIcon className="h-4 w-4" />;
      case "completed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "expired":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  // Loading state
  if (status === "loading" && requests.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <ProcurLoader size="lg" text="Loading requests..." />
      </div>
    );
  }

  // Error state
  if (status === "failed" && error) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <DocumentTextIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Failed to Load Requests
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchRequests({ page: 1, limit: 20 }))}
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main>
        {/* Header */}
        <section className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
          <div className="max-w-[1400px] mx-auto px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-[var(--secondary-black)] mb-1">
                  My Requests
                </h1>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  View and manage your produce requests and supplier bids
                </p>
              </div>
              <Link
                href="/buyer/request"
                className="px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
              >
                + New Request
              </Link>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 mb-4">
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "completed", label: "Completed" },
                { key: "expired", label: "Expired" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedStatus === tab.key
                      ? "bg-[var(--primary-accent2)] text-white"
                      : "bg-[var(--primary-background)] text-[var(--secondary-black)] hover:bg-white border border-[var(--secondary-soft-highlight)]/30"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs">
                    ({statusCounts[tab.key as keyof typeof statusCounts]})
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex items-center bg-[var(--primary-background)] rounded-full overflow-hidden border border-[var(--secondary-soft-highlight)]/30">
                <input
                  type="text"
                  placeholder="Search requests by product name..."
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent placeholder:text-[var(--secondary-muted-edge)] text-[var(--secondary-black)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-2.5 m-1 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all duration-200">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Requests List */}
        <section className="max-w-[1400px] mx-auto px-6 py-6">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[var(--secondary-soft-highlight)]/20">
              <FunnelIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
                No requests found
              </h3>
              <p className="text-[var(--secondary-muted-edge)] mb-6">
                {selectedStatus === "all"
                  ? "You haven't created any requests yet."
                  : `You don't have any ${selectedStatus} requests.`}
              </p>
              <Link
                href="/buyer/request"
                className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
              >
                Create Your First Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/buyer/requests/${request.id}`}
                  className="block bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                >
                  <div className="p-5">
                    {/* Request Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                            {request.productName}
                          </h3>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusStyles(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                          {request.orderType === "recurring" && (
                            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              Recurring
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--secondary-muted-edge)]">
                          Requested on {request.createdDate}
                        </p>
                      </div>
                    </div>

                    {/* Request Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-[var(--primary-background)] rounded-lg">
                          <svg
                            className="h-4 w-4 text-[var(--primary-accent2)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-[var(--secondary-muted-edge)]">
                            Quantity
                          </div>
                          <div className="text-sm font-medium text-[var(--secondary-black)]">
                            {request.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-[var(--primary-background)] rounded-lg">
                          <CalendarIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                        </div>
                        <div>
                          <div className="text-xs text-[var(--secondary-muted-edge)]">
                            Delivery Date
                          </div>
                          <div className="text-sm font-medium text-[var(--secondary-black)]">
                            {request.deliveryDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-[var(--primary-background)] rounded-lg">
                          <CurrencyDollarIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                        </div>
                        <div>
                          <div className="text-xs text-[var(--secondary-muted-edge)]">
                            Budget
                          </div>
                          <div className="text-sm font-medium text-[var(--secondary-black)]">
                            {request.budget}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-[var(--primary-background)] rounded-lg">
                          <svg
                            className="h-4 w-4 text-[var(--primary-accent2)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-[var(--secondary-muted-edge)]">
                            Location
                          </div>
                          <div className="text-sm font-medium text-[var(--secondary-black)]">
                            {request.deliveryLocation}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bids Summary */}
                    {request.status === "active" && (
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--secondary-soft-highlight)]/20">
                        <div className="flex items-center gap-2">
                          <ChatBubbleLeftIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                          <span className="text-sm font-medium text-[var(--secondary-black)]">
                            {request.bidsCount} Bid
                            {request.bidsCount !== 1 ? "s" : ""} Received
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--primary-accent2)] font-medium group-hover:gap-3 transition-all duration-200">
                          View Bids
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
