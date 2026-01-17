"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions } from "@/store/slices/buyerTransactionsSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/components/ui/Toast";

export default function BuyerTransactionsPage() {
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const { transactions, summary, status, error, pagination } = useAppSelector(
    (state) => state.buyerTransactions
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);
  const inFlightPageRef = useRef<number | null>(null);

  const requestFilters = useMemo(() => {
    const filters: {
      page: number;
      limit: number;
      search?: string;
      status?: string;
      type?: string;
    } = { page: 1, limit: 20 };

    if (searchQuery) filters.search = searchQuery;
    if (selectedStatus !== "all") filters.status = selectedStatus;
    if (selectedType !== "all") filters.type = selectedType;

    return filters;
  }, [searchQuery, selectedStatus, selectedType]);

  // Fetch transactions on mount
  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Fetch transactions when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchTransactions(requestFilters));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [requestFilters, dispatch]);

  // Reset infinite-scroll tracking when filters change
  useEffect(() => {
    inFlightPageRef.current = null;
  }, [requestFilters]);

  // Infinite scroll: when the sentinel enters view, fetch the next page (if any)
  useEffect(() => {
    const el = loadMoreSentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        const hasMore = pagination.page < pagination.totalPages;
        if (!hasMore) return;
        if (status === "loading") return;

        const nextPage = pagination.page + 1;
        if (inFlightPageRef.current === nextPage) return;
        inFlightPageRef.current = nextPage;
        dispatch(
          fetchTransactions({
            ...requestFilters,
            page: nextPage,
            limit: requestFilters.limit,
          })
        );
      },
      { root: null, rootMargin: "400px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [
    dispatch,
    pagination.page,
    pagination.totalPages,
    requestFilters,
    status,
  ]);

  // Allow retry after success/failure (e.g., scrolling again after a transient error)
  useEffect(() => {
    if (status === "loading") return;
    inFlightPageRef.current = null;
  }, [status, pagination.page]);

  // Toast on background refresh failures (keep stale data visible)
  const lastToastErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (status !== "failed" || !error) return;
    if (transactions.length === 0) return; // page-level error UI handles initial load failure
    if (lastToastErrorRef.current === error) return;
    lastToastErrorRef.current = error;
    show({
      variant: "error",
      title: "Couldn’t refresh transactions",
      message: error,
      actionLabel: "Retry",
      onAction: () => dispatch(fetchTransactions(requestFilters)),
    });
  }, [status, error, transactions.length, show, dispatch, requestFilters]);
  useEffect(() => {
    if (status === "succeeded") lastToastErrorRef.current = null;
  }, [status]);

  const getStatusIcon = (status?: string) => {
    if (!status) return <ClockIcon className="h-4 w-4" />;

    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      case "failed":
        return <XCircleIcon className="h-4 w-4" />;
      case "cancelled":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusStyles = (status?: string) => {
    if (!status) return "bg-gray-50 text-gray-700 border-gray-200";

    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type?: string) => {
    if (!type) return <BanknotesIcon className="h-4 w-4" />;

    switch (type.toLowerCase()) {
      case "payment":
        return <CreditCardIcon className="h-4 w-4" />;
      case "refund":
        return <ArrowPathIcon className="h-4 w-4" />;
      case "credit":
        return <ArrowTrendingUpIcon className="h-4 w-4" />;
      case "debit":
        return <ArrowTrendingDownIcon className="h-4 w-4" />;
      default:
        return <BanknotesIcon className="h-4 w-4" />;
    }
  };

  // Loading state with ProcurLoader
  if (status === "loading" && transactions.length === 0) {
    return <ProcurLoader size="lg" text="Loading transactions..." />;
  }

  // Page-level error state (only when we have nothing to show)
  if (status === "failed" && error && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-lg px-6">
          <Alert
            variant="error"
            title="Failed to load transactions"
            description={error}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => dispatch(fetchTransactions(requestFilters))}
                  className="inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                >
                  Retry
                </button>
                <Link
                  href="/buyer/orders"
                  className="inline-flex items-center rounded-full border border-[var(--secondary-soft-highlight)] bg-white px-4 py-2 text-xs font-medium text-[var(--secondary-black)] hover:bg-[var(--primary-background)] transition-colors"
                >
                  View orders
                </Link>
              </>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Inline error (keep content visible) */}
        {status === "failed" && error && transactions.length > 0 && (
          <div className="mb-6">
            <Alert
              variant="error"
              title="Some data may be out of date"
              description={error}
              actions={
                <button
                  type="button"
                  onClick={() => dispatch(fetchTransactions(requestFilters))}
                  className="inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                >
                  Retry
                </button>
              }
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-1">
                Transaction History
              </h1>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                View and manage your payment history
              </p>
            </div>
            <Link
              href="/buyer/orders"
              className="px-5 py-2.5 bg-white border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#CB5927] to-[#653011] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <BanknotesIcon className="h-8 w-8 opacity-80" />
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Total Spent
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: summary.currency || "USD",
                }).format(summary.total_spent)}
              </div>
              <div className="text-xs opacity-80">
                {summary.total_transactions} transactions
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#C0D1C7] to-[#407178] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <ArrowTrendingDownIcon className="h-8 w-8 opacity-80" />
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Refunds
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: summary.currency || "USD",
                }).format(summary.total_refunds)}
              </div>
              <div className="text-xs opacity-80">Returned to account</div>
            </div>

            <div className="bg-gradient-to-br from-[#A6B1E7] to-[#8091D5] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <ChartBarIcon className="h-8 w-8 opacity-80" />
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Average
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: summary.currency || "USD",
                }).format(summary.average_transaction_amount)}
              </div>
              <div className="text-xs opacity-80">Per transaction</div>
            </div>

            <div className="bg-gradient-to-br from-[#E0A374] to-[#CB5927] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CreditCardIcon className="h-8 w-8 opacity-80" />
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Fees Paid
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: summary.currency || "USD",
                }).format(summary.total_fees)}
              </div>
              <div className="text-xs opacity-80">Platform & processing</div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--secondary-muted-edge)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--secondary-soft-highlight)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]/20 focus:border-[var(--primary-accent2)] transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-[var(--secondary-soft-highlight)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]/20 focus:border-[var(--primary-accent2)] transition-all bg-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 border border-[var(--secondary-soft-highlight)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]/20 focus:border-[var(--primary-accent2)] transition-all bg-white"
            >
              <option value="all">All Types</option>
              <option value="payment">Payment</option>
              <option value="refund">Refund</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border border-[var(--secondary-soft-highlight)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-12 text-center">
            <BanknotesIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
              No Transactions Found
            </h3>
            <p className="text-[var(--secondary-muted-edge)] mb-6">
              Place orders to see your transaction history here
            </p>
            <Link
              href="/buyer"
              className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--primary-background)] border-b border-[var(--secondary-soft-highlight)]">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`border-b border-[var(--secondary-soft-highlight)]/20 last:border-0 hover:bg-[var(--primary-background)]/50 transition-colors ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-[var(--primary-background)]/20"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 bg-[var(--primary-accent2)]/10 rounded-lg">
                            {getTypeIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-[var(--secondary-black)] mb-0.5">
                              {transaction.transaction_number || "N/A"}
                            </div>
                            <div className="text-xs text-[var(--secondary-muted-edge)]">
                              {transaction.seller_name || "Unknown"}
                            </div>
                            {transaction.order_number && (
                              <Link
                                href={`/buyer/orders/${transaction.order_id}`}
                                className="text-xs text-[var(--primary-accent2)] hover:underline mt-1 inline-block"
                              >
                                Order: {transaction.order_number}
                              </Link>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--secondary-black)] capitalize">
                          {transaction.type || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-[var(--secondary-black)]">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: transaction.currency || "USD",
                          }).format(transaction.amount || 0)}
                        </div>
                        <div className="text-[10px] text-[var(--secondary-muted-edge)] mt-0.5">
                          Net:{" "}
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: transaction.currency || "USD",
                          }).format(transaction.net_amount || 0)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                            transaction.status
                          )}`}
                        >
                          {getStatusIcon(transaction.status)}
                          <span className="capitalize">
                            {transaction.status || "pending"}
                          </span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--secondary-muted-edge)]">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {new Date(transaction.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-[10px] text-[var(--secondary-muted-edge)] mt-0.5">
                          {new Date(transaction.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Infinite scroll footer */}
        {transactions.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="text-sm text-[var(--secondary-muted-edge)]">
              Showing {Math.min(transactions.length, pagination.totalItems)} of{" "}
              {pagination.totalItems} transactions
            </div>

            {pagination.page < pagination.totalPages ? (
              <div
                ref={loadMoreSentinelRef}
                className="w-full flex items-center justify-center py-4"
              >
                {status === "loading" ? (
                  <div className="flex items-center gap-2 text-xs text-[var(--secondary-muted-edge)]">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Loading more...
                  </div>
                ) : (
                  <span className="text-xs text-[var(--secondary-muted-edge)]">
                    Scroll to load more
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-[var(--secondary-muted-edge)]">
                You’ve reached the end
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
