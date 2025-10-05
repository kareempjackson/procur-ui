"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrders } from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";
import {
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function BuyerOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, status, error, pagination } = useAppSelector(
    (state) => state.buyerOrders
  );

  const [page, setPage] = useState(1);
  const limit = 20;

  // Ensure orders is always an array
  const ordersList = Array.isArray(orders) ? orders : [];

  const totalPages = useMemo(
    () => Math.max(1, pagination?.totalPages || 0),
    [pagination]
  );

  useEffect(() => {
    dispatch(fetchOrders({ page, limit }));
  }, [page, dispatch]);

  const summary = useMemo(() => {
    const completed = ordersList.filter((o) =>
      (o.status || "").toLowerCase().includes("delivered")
    ).length;
    const pending = ordersList.filter((o) =>
      (o.status || "").toLowerCase().includes("pending")
    ).length;
    const totalPaid = ordersList
      .filter((o) => o.status?.toLowerCase() === "completed")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return { completed, pending, totalPaid };
  }, [ordersList]);

  const loading = status === "loading";
  const total = pagination?.totalItems || 0;

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl leading-tight text-[var(--secondary-black)] font-medium">
              Your Orders
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              Track your purchases and deliveries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/buyer" className="btn btn-ghost h-8 px-3 text-sm">
              Browse Marketplace
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Completed Orders */}
          <div className="bg-gradient-to-br from-[#C0D1C7] to-[#407178] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircleIcon className="h-8 w-8 opacity-80" />
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Completed
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{summary.completed}</div>
            <div className="text-xs opacity-80">Orders delivered</div>
          </div>

          {/* Pending Orders */}
          <div className="bg-gradient-to-br from-[#E0A374] to-[#CB5927] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ClockIcon className="h-8 w-8 opacity-80" />
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Pending
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{summary.pending}</div>
            <div className="text-xs opacity-80">In progress</div>
          </div>

          {/* Total Paid */}
          <div className="bg-gradient-to-br from-[#CB5927] to-[#653011] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <BanknotesIcon className="h-8 w-8 opacity-80" />
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Paid
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(summary.totalPaid)}
            </div>
            <div className="text-xs opacity-80">This page</div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-[#A6B1E7] to-[#8091D5] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCartIcon className="h-8 w-8 opacity-80" />
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Total
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{total}</div>
            <div className="text-xs opacity-80">All orders</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#CB5927]/10 border border-[#CB5927]/30 rounded-xl p-4 mb-6">
            <p className="text-[#653011] font-medium">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {loading ? (
          <ProcurLoader size="md" text="Loading orders..." />
        ) : ordersList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary-background)] rounded-full flex items-center justify-center">
              <ShoppingCartIcon className="w-8 h-8 text-[var(--secondary-muted-edge)] opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
              No orders found
            </h3>
            <p className="text-[var(--secondary-muted-edge)] mb-6">
              Your orders will appear here after you purchase from sellers
            </p>
            <Link
              href="/buyer"
              className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--primary-background)] border-b border-[var(--secondary-soft-highlight)]">
                  <tr>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] min-w-[110px]">
                      Order
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] min-w-[220px]">
                      Items
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-24">
                      Total
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-28">
                      Status
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-28">
                      Payment
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-28">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--secondary-soft-highlight)]/20 last:border-0 hover:bg-[var(--primary-background)]/50 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <div className="font-medium text-[var(--secondary-black)] text-xs">
                          {order.order_number || order.id}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-xs text-[var(--primary-base)] truncate max-w-[360px]">
                          {order.items && order.items.length > 0
                            ? `${order.items[0]?.product_name || "Item"}${
                                order.items.length > 1
                                  ? ` +${order.items.length - 1} more`
                                  : ""
                              }`
                            : "—"}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-[var(--secondary-black)] text-xs">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(order.total_amount || 0)}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={classNames(
                            "px-1.5 py-0.5 text-xs rounded-full font-medium",
                            (order.status || "")
                              .toLowerCase()
                              .includes("delivered")
                              ? "bg-[#C0D1C7]/20 text-[#407178]"
                              : (order.status || "")
                                  .toLowerCase()
                                  .includes("pending")
                              ? "bg-[#E0A374]/20 text-[#CB5927]"
                              : (order.status || "")
                                  .toLowerCase()
                                  .includes("cancelled")
                              ? "bg-[#6C715D]/20 text-[#6C715D]"
                              : "bg-[#A6B1E7]/20 text-[#8091D5]"
                          )}
                        >
                          {(order.status || "").replace(/_/g, " ") || "—"}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 text-xs rounded-full font-medium bg-[#6C715D]/20 text-[#6C715D]">
                          —
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-[var(--primary-base)]">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-[var(--secondary-muted-edge)]">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
