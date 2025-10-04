"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiClient } from "@/lib/apiClient";

type BuyerTransaction = {
  id: string;
  status?: string;
  amount?: number;
  currency?: string;
  method?: string;
  created_at?: string;
  reference?: string;
};

type TransactionsResponse = {
  transactions?: BuyerTransaction[];
  total?: number;
  page?: number;
  limit?: number;
};

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

export default function BuyerTransactionsPage() {
  const [items, setItems] = useState<BuyerTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  async function fetchTransactions(p: number) {
    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const { data } = await client.get<TransactionsResponse>(
        "/buyers/transactions",
        {
          params: { page: p, limit, sort_by: "created_at", sort_order: "desc" },
        }
      );
      setItems(data.transactions || []);
      setTotal(data.total || 0);
    } catch (e: unknown) {
      setError(
        (e as any)?.response?.data?.message || "Failed to load transactions"
      );
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const paidTotal = useMemo(
    () => items.reduce((sum, t) => sum + (t.amount || 0), 0),
    [items]
  );

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl leading-tight text-[var(--secondary-black)] font-medium">
              Transactions
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              Payments, refunds, and adjustments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/buyer/orders"
              className="btn btn-ghost h-8 px-3 text-sm"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 hover:shadow-sm transition-shadow">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Count
            </div>
            <div className="mt-1 text-2xl font-semibold text-[color:var(--secondary-black)]">
              {total}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 hover:shadow-sm transition-shadow">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Amount (this page)
            </div>
            <div className="mt-1 text-2xl font-semibold text-[color:var(--secondary-black)]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(paidTotal)}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-12 text-sm text-[color:var(--secondary-muted-edge)]">
            Loading transactions…
          </div>
        ) : items.length === 0 ? (
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v.01M12 20h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-2">
              No transactions found
            </h3>
            <p className="text-[var(--primary-base)] mb-6">
              Place orders to see transactions here
            </p>
            <Link href="/buyer" className="btn btn-primary">
              Go to Marketplace
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-[var(--secondary-soft-highlight)]">
                  <tr>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] min-w-[140px]">
                      Reference
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-28">
                      Amount
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-28">
                      Status
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-28">
                      Method
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-28">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-[var(--secondary-soft-highlight)] last:border-0 hover:bg-gray-25"
                    >
                      <td className="py-2 px-3">
                        <div className="font-medium text-[var(--secondary-black)] text-xs">
                          {t.reference || t.id}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-[var(--secondary-black)] text-xs">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: t.currency || "USD",
                          }).format(t.amount || 0)}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 text-xs rounded-full font-medium bg-gray-100 text-gray-800">
                          {t.status || "—"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-[var(--primary-base)]">
                        {t.method || "—"}
                      </td>
                      <td className="py-2 px-3 text-xs text-[var(--primary-base)]">
                        {t.created_at
                          ? new Date(t.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
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
    </div>
  );
}
