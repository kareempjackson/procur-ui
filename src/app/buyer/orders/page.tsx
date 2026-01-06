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
  CalendarIcon,
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
      .filter((o) => (o.payment_status || "").toLowerCase() === "paid")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return { completed, pending, totalPaid };
  }, [ordersList]);

  const loading = status === "loading";
  const total = pagination?.totalItems || 0;
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header + Summary */}
        <section className="relative overflow-hidden rounded-3xl border border-[var(--secondary-soft-highlight)]/30 bg-gradient-to-br from-[var(--primary-background)] via-white to-white p-6 sm:p-8 mb-6">
          {/* decorative glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[var(--primary-accent2)]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#A6B1E7]/15 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-white/70 px-3 py-1 text-xs text-[var(--secondary-muted-edge)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                Orders dashboard
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl leading-[1.1] text-[var(--secondary-black)] font-semibold tracking-tight">
                Your Orders
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[var(--secondary-muted-edge)]">
                Track deliveries, payment status, and purchase history.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/buyer"
                className="inline-flex items-center justify-center rounded-full border border-[var(--secondary-soft-highlight)]/40 bg-white/70 px-4 py-2 text-sm font-medium text-[var(--secondary-black)] hover:bg-white transition-colors backdrop-blur"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Delivered */}
            <div className="group rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-white/70 p-5 shadow-sm backdrop-blur hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#C0D1C7]/40 flex items-center justify-center">
                    <CheckCircleIcon className="h-5 w-5 text-[#407178]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[var(--secondary-muted-edge)]">
                      Delivered
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-[var(--secondary-black)] tabular-nums">
                      {summary.completed}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium rounded-full bg-[#C0D1C7]/35 text-[#407178] px-2.5 py-1">
                  Completed
                </span>
              </div>
              <div className="mt-2 text-xs text-[var(--secondary-muted-edge)]">
                Orders delivered
              </div>
            </div>

            {/* Pending */}
            <div className="group rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-white/70 p-5 shadow-sm backdrop-blur hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#E0A374]/30 flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-[#CB5927]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[var(--secondary-muted-edge)]">
                      Pending
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-[var(--secondary-black)] tabular-nums">
                      {summary.pending}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium rounded-full bg-[#E0A374]/30 text-[#CB5927] px-2.5 py-1">
                  In progress
                </span>
              </div>
              <div className="mt-2 text-xs text-[var(--secondary-muted-edge)]">
                Awaiting fulfillment
              </div>
            </div>

            {/* Paid */}
            <div className="group rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-white/70 p-5 shadow-sm backdrop-blur hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#CB5927]/15 flex items-center justify-center">
                    <BanknotesIcon className="h-5 w-5 text-[#653011]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[var(--secondary-muted-edge)]">
                      Paid
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-[var(--secondary-black)] tabular-nums">
                      {formatCurrency(summary.totalPaid)}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium rounded-full bg-[#CB5927]/15 text-[#653011] px-2.5 py-1">
                  This page
                </span>
              </div>
              <div className="mt-2 text-xs text-[var(--secondary-muted-edge)]">
                Value of paid orders
              </div>
            </div>

            {/* Total */}
            <div className="group rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-white/70 p-5 shadow-sm backdrop-blur hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#A6B1E7]/25 flex items-center justify-center">
                    <ShoppingCartIcon className="h-5 w-5 text-[#8091D5]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[var(--secondary-muted-edge)]">
                      Total orders
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-[var(--secondary-black)] tabular-nums">
                      {total}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium rounded-full bg-[#A6B1E7]/25 text-[#8091D5] px-2.5 py-1">
                  All time
                </span>
              </div>
              <div className="mt-2 text-xs text-[var(--secondary-muted-edge)]">
                All orders
              </div>
            </div>
          </div>
        </section>

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
              <table className="w-full">
                <thead className="bg-[var(--primary-background)] border-b border-[var(--secondary-soft-highlight)]">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider min-w-[110px]">
                      Order
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider min-w-[220px]">
                      Items
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider w-24">
                      Total
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider w-28">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider w-28">
                      Payment
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider w-28">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-b border-[var(--secondary-soft-highlight)]/20 last:border-0 hover:bg-[var(--primary-background)]/50 transition-colors ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-[var(--primary-background)]/20"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 bg-[var(--primary-accent2)]/10 rounded-lg">
                            <ShoppingCartIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <Link
                              href={`/buyer/orders/${order.id}`}
                              className="font-medium text-sm text-[var(--secondary-black)] mb-0.5 hover:text-[var(--primary-accent2)] underline-offset-2 hover:underline"
                              aria-label={`View order ${order.order_number || order.id}`}
                            >
                              {order.order_number || order.id}
                            </Link>
                            <div className="text-xs text-[var(--secondary-muted-edge)]">
                              {order.seller_name || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          href={`/buyer/orders/${order.id}`}
                          className="text-xs text-[var(--primary-base)] truncate max-w-[360px] hover:text-[var(--primary-accent2)]"
                          aria-label={`View items in order ${order.order_number || order.id}`}
                        >
                          {order.items && order.items.length > 0
                            ? `${order.items[0]?.product_name || "Item"}${
                                order.items.length > 1
                                  ? ` +${order.items.length - 1} more`
                                  : ""
                              }`
                            : "—"}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-[var(--secondary-black)]">
                          {formatCurrency(order.total_amount || 0)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={classNames(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            (order.status || "")
                              .toLowerCase()
                              .includes("delivered")
                              ? "bg-[#C0D1C7]/20 text-[#407178] border-[#C0D1C7]/40"
                              : (order.status || "")
                                    .toLowerCase()
                                    .includes("pending")
                                ? "bg-[#E0A374]/20 text-[#CB5927] border-[#E0A374]/40"
                                : (order.status || "")
                                      .toLowerCase()
                                      .includes("cancelled")
                                  ? "bg-[#6C715D]/20 text-[#6C715D] border-[#6C715D]/40"
                                  : "bg-[#A6B1E7]/20 text-[#8091D5] border-[#A6B1E7]/40"
                          )}
                        >
                          {(order.status || "").replace(/_/g, " ") || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={classNames(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            (order.payment_status || "").toLowerCase() ===
                              "paid"
                              ? "bg-[#C0D1C7]/20 text-[#407178] border-[#C0D1C7]/40"
                              : (order.payment_status || "").toLowerCase() ===
                                  "pending"
                                ? "bg-[#E0A374]/20 text-[#CB5927] border-[#E0A374]/40"
                                : "bg-[#A6B1E7]/20 text-[#8091D5] border-[#A6B1E7]/40"
                          )}
                        >
                          {(order.payment_status || "—").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--secondary-muted-edge)]">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "—"}
                        </div>
                        {order.created_at && (
                          <div className="text-[10px] text-[var(--secondary-muted-edge)] mt-0.5">
                            {new Date(order.created_at).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        )}
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
