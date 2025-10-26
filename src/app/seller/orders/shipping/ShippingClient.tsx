"use client";

import React, { useState, useEffect } from "react";
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
  CubeIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "@/store/slices/sellerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

export default function ShippingClient() {
  const dispatch = useAppDispatch();
  const {
    items: orders,
    status,
    total,
  } = useAppSelector((state) => state.sellerOrders);

  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch orders with status "processing" or "accepted"
  useEffect(() => {
    dispatch(
      fetchSellerOrders({
        page: 1,
        limit: 50,
        status: "processing,accepted",
        sort_by: "created_at",
        sort_order: "desc",
      })
    );
  }, [dispatch]);

  // Filter orders ready to ship (accepted or processing)
  const ordersReadyToShip = orders.filter(
    (order) => order.status === "accepted" || order.status === "processing"
  );

  // Filter by search
  const filteredOrders = ordersReadyToShip.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer_info?.organization_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

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
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkPrintLabels = () => {
    console.log("Printing labels for:", Array.from(selectedOrders));
    alert(
      `Print labels functionality would open a print dialog for ${selectedOrders.size} orders`
    );
  };

  const handleBulkMarkShipped = async () => {
    if (
      !confirm(
        `Are you sure you want to mark ${selectedOrders.size} orders as shipped? Please ensure tracking numbers have been added to each order.`
      )
    ) {
      return;
    }

    console.log("Marking as shipped:", Array.from(selectedOrders));

    // TODO: Implement bulk update
    alert("Bulk shipping update would be processed here");
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Calculate stats
  const readyToShipCount = ordersReadyToShip.length;
  const inTransitCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredTodayCount = orders.filter(
    (o) =>
      o.status === "delivered" &&
      o.delivered_at &&
      new Date(o.delivered_at).toDateString() === new Date().toDateString()
  ).length;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-2">
            Shipping Management
          </h1>
          <p className="text-[var(--secondary-muted-edge)]">
            Manage orders ready to ship and track shipments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
            <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
              Ready to Ship
            </p>
            <p className="text-2xl font-bold text-[var(--secondary-black)]">
              {readyToShipCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
            <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
              In Transit
            </p>
            <p className="text-2xl font-bold text-[var(--secondary-black)]">
              {inTransitCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
            <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
              Delivered Today
            </p>
            <p className="text-2xl font-bold text-[var(--secondary-black)]">
              {deliveredTodayCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
            <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-[var(--secondary-black)]">
              {total}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-4 mb-6">
          <div className="flex gap-3 items-center">
            <div className="flex-1 flex items-center bg-[var(--primary-background)] rounded-full overflow-hidden border border-[var(--secondary-soft-highlight)]/30">
              <MagnifyingGlassIcon className="h-5 w-5 text-[var(--secondary-muted-edge)] ml-3" />
              <input
                type="text"
                placeholder="Search by order number or buyer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
              />
            </div>
            <Link
              href="/seller/orders"
              className="px-5 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all flex items-center gap-2 text-sm"
            >
              <FunnelIcon className="h-4 w-4" />
              All Orders
            </Link>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bg-[var(--primary-accent2)] text-white rounded-2xl p-4 mb-6 flex items-center justify-between">
            <span className="font-medium">
              {selectedOrders.size} order{selectedOrders.size !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkPrintLabels}
                className="flex items-center gap-2 px-5 py-2 bg-white text-[var(--primary-accent2)] rounded-full hover:bg-gray-50 transition-all font-medium text-sm"
              >
                <PrinterIcon className="h-4 w-4" />
                Print Labels
              </button>
              <button
                onClick={handleBulkMarkShipped}
                className="flex items-center gap-2 px-5 py-2 bg-white text-[var(--primary-accent2)] rounded-full hover:bg-gray-50 transition-all font-medium text-sm"
              >
                <CheckIcon className="h-4 w-4" />
                Mark as Shipped
              </button>
              <button
                onClick={() => {
                  setSelectedOrders(new Set());
                  setShowBulkActions(false);
                }}
                className="px-5 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all font-medium text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Orders Ready to Ship */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--secondary-soft-highlight)]/30 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
              Orders Ready to Ship ({filteredOrders.length})
            </h2>
            {filteredOrders.length > 0 && (
              <button
                onClick={selectAll}
                className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium"
              >
                {selectedOrders.size === filteredOrders.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <TruckIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
                No orders ready to ship
              </h3>
              <p className="text-[var(--secondary-muted-edge)] mb-6">
                {searchQuery
                  ? "No orders match your search"
                  : "Orders that are accepted or processing will appear here"}
              </p>
              <Link
                href="/seller/orders"
                className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors font-medium"
              >
                View All Orders
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--secondary-soft-highlight)]/20">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-5 hover:bg-[var(--primary-background)] transition-colors ${
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

                    {/* Order Preview */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {order.items?.[0]?.product_image ? (
                        <Image
                          src={order.items[0].product_image}
                          alt="Order items"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CubeIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {order.items?.length || 0} items
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
                            {order.order_number}
                          </Link>
                          <p className="text-sm text-[var(--secondary-muted-edge)]">
                            {order.buyer_info?.organization_name || "Buyer"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status === "processing"
                            ? "Processing"
                            : "Accepted"}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-[var(--secondary-muted-edge)] mb-0.5">
                            Total Amount
                          </p>
                          <p className="font-medium text-[var(--secondary-black)]">
                            {formatCurrency(order.total_amount, order.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--secondary-muted-edge)] mb-0.5 flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            Destination
                          </p>
                          <p className="font-medium text-[var(--secondary-black)] truncate">
                            {order.shipping_address?.city},{" "}
                            {order.shipping_address?.state}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--secondary-muted-edge)] mb-0.5 flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5" />
                            Order Date
                          </p>
                          <p className="font-medium text-[var(--secondary-black)]">
                            {new Date(order.created_at).toLocaleDateString(
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
                        Process Order
                      </Link>
                      <Link
                        href={`/seller/orders/${order.id}`}
                        className="px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-white transition-all text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h3 className="font-semibold text-blue-900 mb-3 text-sm">
            Shipping Management Tips
          </h3>
          <ul className="space-y-2 text-xs text-blue-800">
            <li className="flex items-start gap-2">
              <CheckIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                Process orders promptly to meet customer delivery expectations
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                Always add tracking numbers when marking orders as shipped
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                Use bulk actions to process multiple orders efficiently
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
