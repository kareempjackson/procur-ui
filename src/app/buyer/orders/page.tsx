"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Footer from "@/components/footer/Footer";
import { getApiClient } from "@/lib/apiClient";

type BuyerOrder = {
  id: string;
  order_number?: string;
  status?: string;
  payment_status?: string;
  total_amount?: number;
  currency?: string;
  created_at?: string;
  items?: Array<{ product_name?: string; quantity?: number }>;
};

type OrdersResponse = {
  orders?: BuyerOrder[];
  total?: number;
  page?: number;
  limit?: number;
};

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function getClient() {
  return getApiClient(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { accessToken?: string };
      return parsed.accessToken ?? null;
    } catch {
      return null;
    }
  });
}

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  async function fetchOrders(p: number) {
    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const { data } = await client.get<OrdersResponse>("/buyers/orders", {
        params: { page: p, limit, sort_by: "created_at", sort_order: "desc" },
      });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (e: unknown) {
      setError((e as any)?.response?.data?.message || "Failed to load orders");
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const summary = useMemo(() => {
    const completed = orders.filter((o) =>
      (o.status || "").toLowerCase().includes("delivered")
    ).length;
    const pending = orders.filter((o) =>
      (o.status || "").toLowerCase().includes("pending")
    ).length;
    const totalPaid = orders
      .filter((o) => (o.payment_status || "").toLowerCase() === "paid")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return { completed, pending, totalPaid };
  }, [orders]);

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
          {[
            { label: "Completed", value: String(summary.completed) },
            { label: "Pending", value: String(summary.pending) },
            {
              label: "Paid (this page)",
              value: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(summary.totalPaid),
            },
            { label: "Total Orders", value: String(total) },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 hover:shadow-sm transition-shadow"
            >
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                {k.label}
              </div>
              <div className="mt-1 text-2xl font-semibold text-[color:var(--secondary-black)]">
                {k.value}
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12 text-sm text-[color:var(--secondary-muted-edge)]">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-2">
              No orders found
            </h3>
            <p className="text-[var(--primary-base)] mb-6">
              Your orders will appear here after you purchase from sellers
            </p>
            <Link href="/buyer" className="btn btn-primary">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-[var(--secondary-soft-highlight)]">
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
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--secondary-soft-highlight)] last:border-0 hover:bg-gray-25"
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
                            currency: order.currency || "USD",
                          }).format(order.total_amount || 0)}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={classNames(
                            "px-1.5 py-0.5 text-xs rounded-full font-medium",
                            "bg-gray-100 text-gray-800"
                          )}
                        >
                          {(order.status || "").replace(/_/g, " ") || "—"}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={classNames(
                            "px-1.5 py-0.5 text-xs rounded-full font-medium",
                            (order.payment_status || "").toLowerCase() ===
                              "paid"
                              ? "bg-green-100 text-green-800"
                              : (order.payment_status || "").toLowerCase() ===
                                "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : (order.payment_status || "").toLowerCase() ===
                                "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {order.payment_status || "—"}
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
          <div className="flex items-center justify-center gap-2 mt-6 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-full border text-[var(--primary-base)] disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-[var(--primary-base)]">
              {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-full border text-[var(--primary-base)] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
