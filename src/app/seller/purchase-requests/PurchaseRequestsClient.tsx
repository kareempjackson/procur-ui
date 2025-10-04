"use client";

import React, { useState } from "react";
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

export default function PurchaseRequestsClient() {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'new', 'responded', 'accepted', 'declined'
  const [searchQuery, setSearchQuery] = useState("");

  // Mock purchase requests data
  const requests = [
    {
      id: "req1",
      buyerName: "Kingston Restaurant Group",
      buyerRating: 4.8,
      productName: "Organic Hass Avocados",
      status: "new", // new, responded, accepted, declined
      orderType: "one-off",
      quantity: "500 kg",
      unitPrice: "$2.50/kg",
      totalBudget: "$1250",
      deliveryDate: "2024-11-15",
      deliveryLocation: "Kingston, Jamaica",
      createdAt: "2024-10-01",
      urgency: "medium",
      responded: false,
      bidAccepted: false,
    },
    {
      id: "req2",
      buyerName: "Caribbean Hotels Ltd",
      buyerRating: 4.9,
      productName: "Fresh Scotch Bonnet Peppers",
      status: "accepted",
      orderType: "recurring",
      recurringFrequency: "weekly",
      quantity: "100 lbs",
      unitPrice: "$3.00/lb",
      totalBudget: "$300",
      deliveryDate: "2024-10-28",
      deliveryLocation: "Montego Bay, Jamaica",
      createdAt: "2024-09-20",
      urgency: "high",
      responded: true,
      myBid: {
        price: "$2.80/lb",
        deliveryDate: "2024-10-28",
        notes: "We can supply premium quality peppers with weekly delivery.",
      },
      bidAccepted: true,
    },
    {
      id: "req3",
      buyerName: "Island Fresh Markets",
      buyerRating: 4.7,
      productName: "Sweet Potatoes (Beauregard)",
      status: "responded",
      orderType: "one-off",
      quantity: "2 tons",
      unitPrice: "$0.80/kg",
      totalBudget: "$1600",
      deliveryDate: "2024-12-01",
      deliveryLocation: "Port of Spain, Trinidad",
      createdAt: "2024-10-10",
      urgency: "low",
      responded: true,
      myBid: {
        price: "$0.75/kg",
        deliveryDate: "2024-12-01",
        notes:
          "Fresh harvest available. Can accommodate your delivery schedule.",
      },
      bidAccepted: false,
    },
    {
      id: "req4",
      buyerName: "Green Leaf Grocery",
      buyerRating: 4.5,
      productName: "Organic Callaloo",
      status: "declined",
      orderType: "recurring",
      recurringFrequency: "biweekly",
      quantity: "50 lbs",
      unitPrice: "$4.00/lb",
      totalBudget: "$200",
      deliveryDate: "2024-09-30",
      deliveryLocation: "Kingston, Jamaica",
      createdAt: "2024-09-01",
      urgency: "high",
      responded: true,
      myBid: {
        price: "$4.20/lb",
        deliveryDate: "2024-09-30",
        notes: "Premium organic callaloo, certified.",
      },
      bidAccepted: false,
      bidDeclined: true,
    },
    {
      id: "req5",
      buyerName: "Tropicana Food Services",
      buyerRating: 4.6,
      productName: "Yellow Yams",
      status: "new",
      orderType: "one-off",
      quantity: "1000 kg",
      unitPrice: "$1.20/kg",
      totalBudget: "$1200",
      deliveryDate: "2024-11-20",
      deliveryLocation: "Kingston, Jamaica",
      createdAt: "2024-10-12",
      urgency: "medium",
      responded: false,
      bidAccepted: false,
    },
    {
      id: "req6",
      buyerName: "Sunshine Catering Co.",
      buyerRating: 4.4,
      productName: "Fresh Ginger Root",
      status: "responded",
      orderType: "recurring",
      recurringFrequency: "monthly",
      quantity: "200 kg",
      unitPrice: "$3.50/kg",
      totalBudget: "$700",
      deliveryDate: "2024-11-05",
      deliveryLocation: "Kingston, Jamaica",
      createdAt: "2024-10-08",
      urgency: "medium",
      responded: true,
      myBid: {
        price: "$3.40/kg",
        deliveryDate: "2024-11-05",
        notes: "Fresh ginger, can supply monthly. Quality guaranteed.",
      },
      bidAccepted: false,
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.buyerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") {
      return matchesSearch;
    }
    return request.status === activeTab && matchesSearch;
  });

  const getStatusBadge = (
    status: string,
    bidAccepted?: boolean,
    bidDeclined?: boolean
  ) => {
    if (status === "accepted" || bidAccepted) {
      return {
        text: "Accepted",
        className: "bg-green-100 text-green-700",
        icon: <CheckCircleSolidIcon className="h-3.5 w-3.5" />,
      };
    }
    if (status === "declined" || bidDeclined) {
      return {
        text: "Declined",
        className: "bg-red-100 text-red-700",
        icon: <XCircleSolidIcon className="h-3.5 w-3.5" />,
      };
    }
    if (status === "responded") {
      return {
        text: "Awaiting Response",
        className: "bg-yellow-100 text-yellow-700",
        icon: <ClockSolidIcon className="h-3.5 w-3.5" />,
      };
    }
    return {
      text: "New Request",
      className: "bg-blue-100 text-blue-700",
      icon: <DocumentTextIcon className="h-3.5 w-3.5" />,
    };
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
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
                  {
                    requests.filter(
                      (r) => tab.key === "all" || r.status === tab.key
                    ).length
                  }
                  )
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

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
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
            {filteredRequests.map((request) => {
              const statusBadge = getStatusBadge(
                request.status,
                request.bidAccepted,
                request.bidDeclined
              );

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
                          {request.productName}
                        </h3>
                        <p className="text-sm text-[var(--secondary-muted-edge)] line-clamp-1">
                          {request.buyerName}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className} flex-shrink-0 ml-2`}
                      >
                        {statusBadge.icon}
                        <span>{statusBadge.text}</span>
                      </div>
                    </div>

                    {/* Order Type & Urgency */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-sm text-[var(--secondary-muted-edge)]">
                        <TagIcon className="h-4 w-4 flex-shrink-0" />
                        <span>
                          {request.orderType === "recurring"
                            ? `Recurring (${request.recurringFrequency})`
                            : "One-Off"}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium uppercase ${getUrgencyColor(
                          request.urgency
                        )}`}
                      >
                        {request.urgency} urgency
                      </span>
                    </div>

                    {/* Request Details */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
                      <div className="flex items-center gap-1 text-[var(--secondary-muted-edge)]">
                        <span className="font-medium text-[var(--secondary-black)]">
                          Qty:
                        </span>
                        <span>{request.quantity}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--secondary-muted-edge)]">
                        <span className="font-medium text-[var(--secondary-black)]">
                          Budget:
                        </span>
                        <span>{request.totalBudget}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--secondary-muted-edge)] col-span-2">
                        <CalendarDaysIcon className="h-4 w-4 flex-shrink-0" />
                        <span>Delivery: {request.deliveryDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--secondary-muted-edge)] col-span-2">
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {request.deliveryLocation}
                        </span>
                      </div>
                    </div>

                    {/* My Bid Info (if responded) */}
                    {request.responded && request.myBid && (
                      <div className="mb-4 p-3 bg-[var(--primary-background)] rounded-xl">
                        <p className="text-xs font-semibold text-[var(--secondary-black)] mb-1">
                          Your Bid:
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--secondary-muted-edge)]">
                            Price:
                          </span>
                          <span className="font-bold text-[var(--primary-accent2)]">
                            {request.myBid.price}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--secondary-muted-edge)] mt-1 line-clamp-2">
                          {request.myBid.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/20">
                      {request.status === "new" && !request.responded && (
                        <Link
                          href={`/seller/purchase-requests/${request.id}`}
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
                        >
                          Submit Bid
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      )}
                      {request.status === "responded" && (
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
                      {request.status === "accepted" && request.bidAccepted && (
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
                      {request.status === "declined" && request.bidDeclined && (
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
