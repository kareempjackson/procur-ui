"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TruckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PrinterIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

// Demo orders ready to ship
const demoOrdersReadyToShip = [
  {
    id: "ord_001",
    orderNumber: "#10245",
    buyer: {
      name: "John Smith",
      organization: "Miami Fresh Markets",
    },
    items: 2,
    totalWeight: 15.5,
    destination: "Miami, FL 33101",
    priority: "high",
    createdAt: "2025-10-05T14:30:00Z",
    estimatedDelivery: "2025-10-15",
    thumbnail:
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
  {
    id: "ord_002",
    orderNumber: "#10244",
    buyer: {
      name: "Sarah Johnson",
      organization: "Urban Grocers",
    },
    items: 4,
    totalWeight: 23.2,
    destination: "New York, NY 10001",
    priority: "normal",
    createdAt: "2025-10-05T10:15:00Z",
    estimatedDelivery: "2025-10-16",
    thumbnail:
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
  {
    id: "ord_003",
    orderNumber: "#10243",
    buyer: {
      name: "Mike Williams",
      organization: "Fresh Market Co",
    },
    items: 3,
    totalWeight: 18.7,
    destination: "Los Angeles, CA 90001",
    priority: "urgent",
    createdAt: "2025-10-04T16:20:00Z",
    estimatedDelivery: "2025-10-14",
    thumbnail:
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
];

export default function ShippingManagementPage() {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
    setShowBulkActions(newSelection.size > 0);
  };

  const selectAll = () => {
    if (selectedOrders.size === demoOrdersReadyToShip.length) {
      setSelectedOrders(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedOrders(new Set(demoOrdersReadyToShip.map((o) => o.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkPrintLabels = () => {
    console.log("Printing labels for:", Array.from(selectedOrders));
  };

  const handleBulkMarkShipped = () => {
    console.log("Marking as shipped:", Array.from(selectedOrders));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-2">
            Shipping Management
          </h1>
          <p className="text-[var(--secondary-muted-edge)]">
            Manage orders ready to ship and generate shipping labels
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Ready to Ship", value: "12", color: "blue" },
            { label: "In Transit", value: "8", color: "purple" },
            { label: "Delivered Today", value: "5", color: "green" },
            { label: "Total Weight", value: "245 lbs", color: "gray" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-[var(--secondary-black)]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-4 mb-6">
          <div className="flex gap-3 items-center">
            <div className="flex-1 flex items-center bg-[var(--primary-background)] rounded-lg overflow-hidden border border-[var(--secondary-soft-highlight)]/30">
              <MagnifyingGlassIcon className="h-5 w-5 text-[var(--secondary-muted-edge)] ml-3" />
              <input
                type="text"
                placeholder="Search by order number or buyer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2.5 border border-[var(--secondary-soft-highlight)]/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
            <button className="px-5 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all flex items-center gap-2">
              <FunnelIcon className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bg-[var(--primary-accent2)] text-white rounded-3xl p-4 mb-6 flex items-center justify-between shadow-lg">
            <span className="font-medium">
              {selectedOrders.size} order{selectedOrders.size !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkPrintLabels}
                className="flex items-center gap-2 px-5 py-2 bg-white text-[var(--primary-accent2)] rounded-full hover:bg-gray-50 transition-all font-medium"
              >
                <PrinterIcon className="h-4 w-4" />
                Print Labels
              </button>
              <button
                onClick={handleBulkMarkShipped}
                className="flex items-center gap-2 px-5 py-2 bg-white text-[var(--primary-accent2)] rounded-full hover:bg-gray-50 transition-all font-medium"
              >
                <CheckIcon className="h-4 w-4" />
                Mark as Shipped
              </button>
              <button
                onClick={() => {
                  setSelectedOrders(new Set());
                  setShowBulkActions(false);
                }}
                className="px-5 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Orders Ready to Ship */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--secondary-soft-highlight)]/30 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
              Orders Ready to Ship ({demoOrdersReadyToShip.length})
            </h2>
            <button
              onClick={selectAll}
              className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium"
            >
              {selectedOrders.size === demoOrdersReadyToShip.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          <div className="divide-y divide-[var(--secondary-soft-highlight)]/20">
            {demoOrdersReadyToShip.map((order) => (
              <div
                key={order.id}
                className={`p-6 hover:bg-[var(--primary-background)] transition-colors ${
                  selectedOrders.has(order.id) ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="w-5 h-5 rounded border-[var(--secondary-soft-highlight)] text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                    />
                  </div>

                  {/* Order Preview Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={order.thumbnail}
                      alt="Order items"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {order.items} items
                      </span>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          href={`/seller/orders/${order.id}`}
                          className="font-semibold text-[var(--secondary-black)] hover:text-[var(--primary-accent2)] transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="text-sm text-[var(--secondary-muted-edge)]">
                          {order.buyer.name} • {order.buyer.organization}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                          order.priority
                        )}`}
                      >
                        {order.priority.charAt(0).toUpperCase() +
                          order.priority.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-[var(--secondary-muted-edge)] mb-0.5">
                          Weight
                        </p>
                        <p className="font-medium text-[var(--secondary-black)]">
                          {order.totalWeight} lbs
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--secondary-muted-edge)] mb-0.5 flex items-center gap-1">
                          <MapPinIcon className="h-3.5 w-3.5" />
                          Destination
                        </p>
                        <p className="font-medium text-[var(--secondary-black)]">
                          {order.destination}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--secondary-muted-edge)] mb-0.5 flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" />
                          Est. Delivery
                        </p>
                        <p className="font-medium text-[var(--secondary-black)]">
                          {new Date(order.estimatedDelivery).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/seller/orders/${order.id}/process`}
                      className="px-5 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all text-center whitespace-nowrap shadow-sm"
                    >
                      Process
                    </Link>
                    <button className="px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-white transition-all flex items-center gap-2 justify-center">
                      <PrinterIcon className="h-4 w-4" />
                      Label
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            Shipping Management Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckIcon className="h-5 w-5 flex-shrink-0" />
              <span>
                Process urgent priority orders first to meet delivery deadlines
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="h-5 w-5 flex-shrink-0" />
              <span>
                Use bulk actions to print multiple shipping labels at once
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="h-5 w-5 flex-shrink-0" />
              <span>
                Always verify package weight and dimensions for accurate
                shipping costs
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
