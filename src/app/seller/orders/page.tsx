"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { getApiClient } from "@/lib/apiClient";
import { fetchSellerOrders } from "@/store/slices/sellerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";
import SellerVerificationChecklist from "@/components/seller/SellerVerificationChecklist";

// Enums for order statuses and types
enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

enum OrderPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

enum FulfillmentMethod {
  PICKUP = "pickup",
  DELIVERY = "delivery",
  SHIPPING = "shipping",
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit_of_measurement: string;
  image_url?: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  status: OrderStatus;
  priority: OrderPriority;
  payment_status: PaymentStatus;
  fulfillment_method: FulfillmentMethod;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  currency: string;
  items: OrderItem[];
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

interface OrderFilters {
  search: string;
  status: OrderStatus | "";
  priority: OrderPriority | "";
  payment_status: PaymentStatus | "";
  fulfillment_method: FulfillmentMethod | "";
  date_range: "today" | "7d" | "30d" | "90d" | "custom" | "";
  amount_min: string;
  amount_max: string;
  sort_by: string;
  sort_order: "asc" | "desc";
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SellerOrdersPage() {
  const router = useRouter();

  // Data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Initialize with API data instead of demo
  useEffect(() => {
    setOrders([]);
    setTotalOrders(0);
  }, []);

  // Filter states
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "",
    priority: "",
    payment_status: "",
    fulfillment_method: "",
    date_range: "",
    amount_min: "",
    amount_max: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useAppDispatch();
  const ordersState = useAppSelector((s) => s.sellerOrders);

  async function runFetch(page: number) {
    const params: any = {
      page,
      limit: itemsPerPage,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    };
    if (filters.status) params.status = filters.status;
    if (filters.payment_status) params.payment_status = filters.payment_status;
    if (filters.search) params.order_number = filters.search;
    if (filters.date_range) {
      const now = new Date();
      let from: Date | null = null;
      switch (filters.date_range) {
        case "today":
          from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "7d":
          from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          from = null;
      }
      if (from) params.from_date = from.toISOString();
    }
    await dispatch(fetchSellerOrders(params));
  }

  useEffect(() => {
    runFetch(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  useEffect(() => {
    if (ordersState.status === "succeeded") {
      setOrders(ordersState.items as unknown as Order[]);
      setTotalOrders(ordersState.total);
      setError(null);
      setLoading(false);
    } else if (ordersState.status === "loading") {
      setLoading(true);
    } else if (ordersState.status === "failed") {
      setError(ordersState.error || "Failed to load orders.");
      setOrders([]);
      setTotalOrders(0);
      setLoading(false);
    }
  }, [ordersState]);

  const handleFilterChange = (key: keyof OrderFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case OrderStatus.CONFIRMED:
        return "bg-[#A6B1E7]/20 text-[#8091D5]";
      case OrderStatus.PREPARING:
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case OrderStatus.READY:
        return "bg-[#A6B1E7]/20 text-[#8091D5]";
      case OrderStatus.IN_TRANSIT:
        return "bg-[#A6B1E7]/20 text-[#8091D5]";
      case OrderStatus.DELIVERED:
        return "bg-[#C0D1C7]/20 text-[#407178]";
      case OrderStatus.CANCELLED:
        return "bg-[#6C715D]/20 text-[#6C715D]";
      case OrderStatus.REFUNDED:
        return "bg-[#6C715D]/20 text-[#6C715D]";
      default:
        return "bg-[#6C715D]/20 text-[#6C715D]";
    }
  };

  const getPriorityColor = (priority: OrderPriority) => {
    switch (priority) {
      case OrderPriority.LOW:
        return "bg-[#6C715D]/20 text-[#6C715D]";
      case OrderPriority.NORMAL:
        return "bg-[#A6B1E7]/20 text-[#8091D5]";
      case OrderPriority.HIGH:
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case OrderPriority.URGENT:
        return "bg-[#CB5927]/20 text-[#653011]";
      default:
        return "bg-[#6C715D]/20 text-[#6C715D]";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "bg-[#C0D1C7]/20 text-[#407178]";
      case PaymentStatus.PENDING:
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case PaymentStatus.FAILED:
        return "bg-[#CB5927]/20 text-[#653011]";
      case PaymentStatus.REFUNDED:
        return "bg-[#6C715D]/20 text-[#6C715D]";
      default:
        return "bg-[#6C715D]/20 text-[#6C715D]";
    }
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const handleBulkExport = () => {
    if (selectedOrders.length === 0) return;

    const selected = orders.filter((o) => selectedOrders.includes(o.id));
    if (selected.length === 0) return;

    const headers = [
      "Order Number",
      "Customer",
      "Email",
      "Status",
      "Payment Status",
      "Total Amount",
      "Currency",
      "Created At",
    ];

    const rows = selected.map((o) => [
      o.order_number,
      o.customer_name,
      o.customer_email,
      o.status,
      o.payment_status,
      o.total_amount?.toString() ?? "",
      o.currency ?? "USD",
      o.created_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkPrintLabels = () => {
    if (selectedOrders.length === 0) return;

    const selected = orders.filter((o) => selectedOrders.includes(o.id));
    if (selected.length === 0) return;

    const printContent = selected
      .map(
        (o) => `
        <div style="padding:12px;border-bottom:1px solid #eee;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;">
          <h2>Order ${o.order_number}</h2>
          <p><strong>Customer:</strong> ${o.customer_name}</p>
          <p><strong>Email:</strong> ${o.customer_email}</p>
          <p><strong>Destination:</strong> ${
            o.shipping_address
              ? [
                  o.shipping_address.street,
                  o.shipping_address.city,
                  o.shipping_address.state,
                  o.shipping_address.zip,
                ]
                  .filter(Boolean)
                  .join(", ")
              : ""
          }</p>
        </div>
      `
      )
      .join("");

    const win = window.open("", "_blank", "width=800,height=600");
    if (!win) return;

    win.document.write(
      `<html><head><title>Shipping Labels</title></head><body>${printContent}</body></html>`
    );
    win.document.close();
    win.focus();
    win.print();
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.payment_status === PaymentStatus.PAID)
      .reduce((sum, o) => sum + o.total_amount, 0);

    const pendingOrders = orders.filter(
      (o) => o.status === OrderStatus.PENDING
    ).length;

    const inProgressOrders = orders.filter(
      (o) =>
        o.status === OrderStatus.CONFIRMED ||
        o.status === OrderStatus.PREPARING ||
        o.status === OrderStatus.READY ||
        o.status === OrderStatus.IN_TRANSIT
    ).length;

    const completedOrders = orders.filter(
      (o) => o.status === OrderStatus.DELIVERED
    ).length;

    return {
      totalRevenue,
      pendingOrders,
      inProgressOrders,
      completedOrders,
    };
  }, [orders]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const paginatedOrders = orders; // server paginated

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav
          className="mb-6 text-sm text-[var(--primary-base)]"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="px-2 py-1 rounded-full hover:bg-white">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/seller"
                className="px-2 py-1 rounded-full hover:bg-white"
              >
                Seller
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="px-2 py-1 rounded-full bg-white text-[var(--secondary-black)]">
                Orders
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl leading-tight text-[var(--secondary-black)] font-medium">
              Order Management
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              Track and manage all your customer orders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-ghost h-8 px-3 text-sm"
            >
              Filters
            </button>
            <Link
              href="/seller/orders/shipping"
              className="btn btn-ghost h-8 px-3 text-sm flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Shipping
            </Link>
            <Link
              href="/seller/analytics"
              className="btn btn-ghost h-8 px-3 text-sm"
            >
              Analytics
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-[#C0D1C7] to-[#407178] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <svg
                className="h-8 w-8 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Revenue
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatAmount(summaryStats.totalRevenue)}
            </div>
            <div className="text-xs opacity-80">Total revenue</div>
          </div>

          {/* Pending Orders */}
          <div className="bg-gradient-to-br from-[#E0A374] to-[#CB5927] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <svg
                className="h-8 w-8 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Pending
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {summaryStats.pendingOrders}
            </div>
            <div className="text-xs opacity-80">Awaiting action</div>
          </div>

          {/* In Progress */}
          <div className="bg-gradient-to-br from-[#A6B1E7] to-[#8091D5] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <svg
                className="h-8 w-8 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Active
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {summaryStats.inProgressOrders}
            </div>
            <div className="text-xs opacity-80">Being processed</div>
          </div>

          {/* Completed */}
          <div className="bg-gradient-to-br from-[#CB5927] to-[#653011] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <svg
                className="h-8 w-8 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Done
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {summaryStats.completedOrders}
            </div>
            <div className="text-xs opacity-80">Delivered</div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search..."
                className="input w-full text-sm h-8"
              />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="input w-full text-sm h-8"
              >
                <option value="">All Status</option>
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                <option value={OrderStatus.PREPARING}>Preparing</option>
                <option value={OrderStatus.READY}>Ready</option>
                <option value={OrderStatus.IN_TRANSIT}>In Transit</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
                <option value={OrderStatus.REFUNDED}>Refunded</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="input w-full text-sm h-8"
              >
                <option value="">All Priority</option>
                <option value={OrderPriority.LOW}>Low</option>
                <option value={OrderPriority.NORMAL}>Normal</option>
                <option value={OrderPriority.HIGH}>High</option>
                <option value={OrderPriority.URGENT}>Urgent</option>
              </select>
              <select
                value={filters.payment_status}
                onChange={(e) =>
                  handleFilterChange("payment_status", e.target.value)
                }
                className="input w-full text-sm h-8"
              >
                <option value="">All Payment</option>
                <option value={PaymentStatus.PAID}>Paid</option>
                <option value={PaymentStatus.PENDING}>Pending</option>
                <option value={PaymentStatus.FAILED}>Failed</option>
                <option value={PaymentStatus.REFUNDED}>Refunded</option>
              </select>
              <select
                value={filters.fulfillment_method}
                onChange={(e) =>
                  handleFilterChange("fulfillment_method", e.target.value)
                }
                className="input w-full text-sm h-8"
              >
                <option value="">All Methods</option>
                <option value={FulfillmentMethod.PICKUP}>Pickup</option>
                <option value={FulfillmentMethod.DELIVERY}>Delivery</option>
                <option value={FulfillmentMethod.SHIPPING}>Shipping</option>
              </select>
              <select
                value={filters.date_range}
                onChange={(e) =>
                  handleFilterChange("date_range", e.target.value)
                }
                className="input w-full text-sm h-8"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
              </select>
              <input
                type="number"
                value={filters.amount_min}
                onChange={(e) =>
                  handleFilterChange("amount_min", e.target.value)
                }
                placeholder="Min $"
                className="input w-full text-sm h-8"
                min="0"
                step="0.01"
              />
              <select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split("-");
                  handleFilterChange("sort_by", sort_by);
                  handleFilterChange("sort_order", sort_order);
                }}
                className="input w-full text-sm h-8"
              >
                <option value="created_at-desc">Newest</option>
                <option value="created_at-asc">Oldest</option>
                <option value="total_amount-desc">$ High</option>
                <option value="total_amount-asc">$ Low</option>
                <option value="customer_name-asc">A-Z</option>
                <option value="priority-desc">Priority</option>
              </select>
            </div>
          </div>
        )}

        {/* Orders Count and Bulk Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--primary-base)]">
              {totalOrders} orders
            </span>
            {selectedOrders.length > 0 && (
              <>
                <span className="text-[var(--primary-accent2)]">
                  ({selectedOrders.length} selected)
                </span>
                <button
                  onClick={handleBulkExport}
                  className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)]"
                >
                  Export
                </button>
                <button
                  onClick={handleBulkPrintLabels}
                  className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)]"
                >
                  Print Labels
                </button>
                {/* Status changes are admin-only; no Mark Shipped action here */}
              </>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <>
            <div className="bg-[#CB5927]/10 border border-[#CB5927]/30 rounded-xl p-4 mb-4">
              <p className="text-[#653011] font-medium">{error}</p>
            </div>
            {error.toLowerCase().includes("verified") && (
              <SellerVerificationChecklist />
            )}
          </>
        )}

        {/* Orders Table */}
        {loading ? (
          <ProcurLoader size="md" text="Loading orders..." />
        ) : !error && paginatedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary-background)] rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--secondary-muted-edge)] opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
              No orders found
            </h3>
            <p className="text-[var(--secondary-muted-edge)] mb-6">
              {filters.search || filters.status || filters.priority
                ? "Try adjusting your filters or search terms"
                : "Your orders will appear here once customers start purchasing"}
            </p>
            <Link
              href="/seller"
              className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          !error && (
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--primary-background)] border-b border-[var(--secondary-soft-highlight)]">
                    <tr>
                      <th className="text-left py-2 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={
                            selectedOrders.length === paginatedOrders.length
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] min-w-[100px]">
                        Order
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] min-w-[140px]">
                        Customer
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] min-w-[200px]">
                        Items
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-20">
                        Total
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-16">
                        Priority
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-20">
                        Status
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-16">
                        Payment
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-20">
                        Date
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[var(--secondary-soft-highlight)]/20 last:border-0 hover:bg-[var(--primary-background)]/50 transition-colors"
                      >
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Link
                            href={`/seller/orders/${order.id}`}
                            className="block hover:opacity-75 transition-opacity"
                          >
                            <div className="font-medium text-[var(--secondary-black)] text-xs hover:text-[var(--primary-accent2)]">
                              {order.order_number}
                            </div>
                            <div className="text-xs text-[var(--primary-base)]">
                              {order.fulfillment_method ===
                              FulfillmentMethod.PICKUP
                                ? "Pickup"
                                : order.fulfillment_method ===
                                    FulfillmentMethod.DELIVERY
                                  ? "Delivery"
                                  : "Shipping"}
                            </div>
                          </Link>
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-medium text-[var(--secondary-black)] text-xs truncate max-w-[140px]">
                            {order.customer_name}
                          </div>
                          <div className="text-xs text-[var(--primary-base)] truncate max-w-[140px]">
                            {order.customer_email}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <div
                                  key={item.id}
                                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100 flex-shrink-0"
                                  title={item.product_name}
                                >
                                  {item.image_url ? (
                                    <img
                                      src={item.image_url}
                                      alt={item.product_name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-[var(--primary-base)]">
                              <div className="font-medium text-[var(--secondary-black)]">
                                {order.items[0]?.product_name}
                                {order.items.length > 1 &&
                                  ` +${order.items.length - 1} more`}
                              </div>
                              <div>{order.items.length} items</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-[var(--secondary-black)] text-xs">
                            {formatAmount(order.total_amount, order.currency)}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={classNames(
                              "px-1.5 py-0.5 text-xs rounded-full font-medium",
                              getPriorityColor(order.priority)
                            )}
                          >
                            {order.priority === OrderPriority.LOW
                              ? "L"
                              : order.priority === OrderPriority.NORMAL
                                ? "N"
                                : order.priority === OrderPriority.HIGH
                                  ? "H"
                                  : "U"}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={classNames(
                              "px-1.5 py-0.5 text-xs rounded-full font-medium",
                              getStatusColor(order.status)
                            )}
                          >
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={classNames(
                              "px-1.5 py-0.5 text-xs rounded-full font-medium flex items-center justify-center w-6 h-6",
                              getPaymentStatusColor(order.payment_status)
                            )}
                          >
                            {order.payment_status === PaymentStatus.PAID ? (
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : order.payment_status ===
                              PaymentStatus.PENDING ? (
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : order.payment_status ===
                              PaymentStatus.FAILED ? (
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-xs text-[var(--primary-base)]">
                          <div>
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </div>
                          <div className="text-xs opacity-60">
                            {new Date(order.created_at).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/seller/orders/${order.id}`}
                              className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)] p-1"
                              title="View Details"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </Link>
                            <button
                              className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)] p-1"
                              title="Print Label"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
