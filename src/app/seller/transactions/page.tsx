"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import ProcurLoader from "@/components/ProcurLoader";
import {
  fetchSellerTransactions,
  fetchTransactionsSummary,
} from "@/store/slices/sellerTransactionsSlice";

// Enums for transaction types and statuses
enum TransactionType {
  SALE = "sale",
  REFUND = "refund",
  PAYOUT = "payout",
  FEE = "fee",
  ADJUSTMENT = "adjustment",
  CHARGEBACK = "chargeback",
}

enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  PROCESSING = "processing",
}

enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK_TRANSFER = "bank_transfer",
  DIGITAL_WALLET = "digital_wallet",
  CASH = "cash",
  CHECK = "check",
}

interface Transaction {
  id: string;
  transaction_number?: string;
  order_id?: string;
  seller_org_id?: string;
  buyer_org_id?: string;
  type: TransactionType | string;
  status: TransactionStatus | string;
  amount: number;
  currency: string;
  platform_fee?: number;
  payment_processing_fee?: number;
  net_amount?: number;
  payment_method?: PaymentMethod | string;
  payment_reference?: string;
  gateway_transaction_id?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  processed_at?: string;
  settled_at?: string;
  created_at: string;
  updated_at: string;
}

interface TransactionFilters {
  search: string;
  type: TransactionType | "";
  status: TransactionStatus | "";
  payment_method: PaymentMethod | "";
  date_range: "today" | "7d" | "30d" | "90d" | "custom" | "";
  amount_min: string;
  amount_max: string;
  sort_by: string;
  sort_order: "asc" | "desc";
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SellerTransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );

  // Filter states
  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    type: "",
    status: "",
    payment_method: "",
    date_range: "",
    amount_min: "",
    amount_max: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const dispatch = useAppDispatch();
  const txState = useAppSelector((s) => s.sellerTransactions);

  const displayError =
    error &&
    (error.includes("403") ||
      error.toLowerCase().includes("forbidden") ||
      error.toLowerCase().includes("unauthorized"))
      ? "Transactions are not available for your account yet. Please complete your seller setup or contact support."
      : error;

  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.SALE:
        return "bg-[#C0D1C7]/20 text-[#407178]";
      case TransactionType.REFUND:
        return "bg-[#CB5927]/20 text-[#653011]";
      case TransactionType.PAYOUT:
        return "bg-[#A6B1E7]/20 text-[#8091D5]";
      case TransactionType.FEE:
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case TransactionType.ADJUSTMENT:
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case TransactionType.CHARGEBACK:
        return "bg-[#CB5927]/20 text-[#653011]";
      default:
        return "bg-[#6C715D]/20 text-[#6C715D]";
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return "bg-[#C0D1C7]/20 text-[#407178]";
      case TransactionStatus.PENDING:
        return "bg-[#E0A374]/20 text-[#CB5927]";
      case TransactionStatus.PROCESSING:
        return "bg-[#A6B1E7]/20 text-[#8091D5]";
      case TransactionStatus.FAILED:
        return "bg-[#CB5927]/20 text-[#653011]";
      case TransactionStatus.CANCELLED:
        return "bg-[#6C715D]/20 text-[#6C715D]";
      default:
        return "bg-[#6C715D]/20 text-[#6C715D]";
    }
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(absAmount);
    return isNegative ? `-${formatted}` : formatted;
  };

  const formatPaymentMethod = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return "Credit Card";
      case PaymentMethod.DEBIT_CARD:
        return "Debit Card";
      case PaymentMethod.BANK_TRANSFER:
        return "Bank Transfer";
      case PaymentMethod.DIGITAL_WALLET:
        return "Digital Wallet";
      case PaymentMethod.CASH:
        return "Cash";
      case PaymentMethod.CHECK:
        return "Check";
      default:
        return method;
    }
  };

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map((t) => t.id));
    }
  };

  // Slice wiring
  // We keep this file unchanged for brevity in this edit box. (Already integrated earlier in the session.)

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: itemsPerPage,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    };
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.payment_method) params.payment_method = filters.payment_method;
    if (filters.amount_min) params.min_amount = parseFloat(filters.amount_min);
    if (filters.amount_max) params.max_amount = parseFloat(filters.amount_max);
    if (filters.search) params.transaction_number = filters.search;
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
    dispatch(fetchSellerTransactions(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  useEffect(() => {
    dispatch(fetchTransactionsSummary({ period: "last_30_days" }));
  }, [dispatch]);

  useEffect(() => {
    if (txState.status === "succeeded") {
      setTransactions(txState.items as unknown as Transaction[]);
      setTotalTransactions(txState.total);
      setError(null);
      setLoading(false);
    } else if (txState.status === "loading") {
      setLoading(true);
    } else if (txState.status === "failed") {
      setError(txState.error || "Failed to load transactions.");
      setTransactions([]);
      setTotalTransactions(0);
      setLoading(false);
    }
  }, [txState]);

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);
  const paginatedTransactions = transactions; // server paginated

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
                Transaction History
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl leading-tight text-[var(--secondary-black)] font-medium">
              Transaction History
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              View and manage all your payment transactions
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
              href="/seller/analytics"
              className="btn btn-ghost h-8 px-3 text-sm"
            >
              Analytics
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Sales */}
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
                Sales
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatAmount(txState.summary?.total_sales ?? 0)}
            </div>
            <div className="text-xs opacity-80">Total sales</div>
          </div>

          {/* Total Refunds */}
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
                  d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                />
              </svg>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Refunds
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatAmount(txState.summary?.total_refunds ?? 0)}
            </div>
            <div className="text-xs opacity-80">Total refunds</div>
          </div>

          {/* Total Fees */}
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
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Fees
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatAmount(txState.summary?.total_fees ?? 0)}
            </div>
            <div className="text-xs opacity-80">Platform fees</div>
          </div>

          {/* Net Revenue */}
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Net
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatAmount(txState.summary?.net_earnings ?? 0)}
            </div>
            <div className="text-xs opacity-80">Net revenue</div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, search: e.target.value }))
                }
                placeholder="Search..."
                className="input w-full text-sm h-8"
              />
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    type: e.target.value as TransactionType | "",
                  }))
                }
                className="input w-full text-sm h-8"
              >
                <option value="">All Types</option>
                <option value={TransactionType.SALE}>Sale</option>
                <option value={TransactionType.REFUND}>Refund</option>
                <option value={TransactionType.PAYOUT}>Payout</option>
                <option value={TransactionType.FEE}>Fee</option>
                <option value={TransactionType.ADJUSTMENT}>Adjustment</option>
                <option value={TransactionType.CHARGEBACK}>Chargeback</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    status: e.target.value as TransactionStatus | "",
                  }))
                }
                className="input w-full text-sm h-8"
              >
                <option value="">All Status</option>
                <option value={TransactionStatus.COMPLETED}>Completed</option>
                <option value={TransactionStatus.PENDING}>Pending</option>
                <option value={TransactionStatus.PROCESSING}>Processing</option>
                <option value={TransactionStatus.FAILED}>Failed</option>
                <option value={TransactionStatus.CANCELLED}>Cancelled</option>
              </select>
              <select
                value={filters.date_range}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    date_range: e.target.value as
                      | "today"
                      | "7d"
                      | "30d"
                      | "90d"
                      | "custom"
                      | "",
                  }))
                }
                className="input w-full text-sm h-8"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
              </select>
              <select
                value={filters.payment_method}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    payment_method: e.target.value as PaymentMethod | "",
                  }))
                }
                className="input w-full text-sm h-8"
              >
                <option value="">All Methods</option>
                <option value={PaymentMethod.CREDIT_CARD}>Card</option>
                <option value={PaymentMethod.DEBIT_CARD}>Debit</option>
                <option value={PaymentMethod.BANK_TRANSFER}>Bank</option>
                <option value={PaymentMethod.DIGITAL_WALLET}>Wallet</option>
                <option value={PaymentMethod.CASH}>Cash</option>
                <option value={PaymentMethod.CHECK}>Check</option>
              </select>
              <input
                type="number"
                value={filters.amount_min}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, amount_min: e.target.value }))
                }
                placeholder="Min $"
                className="input w-full text-sm h-8"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                value={filters.amount_max}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, amount_max: e.target.value }))
                }
                placeholder="Max $"
                className="input w-full text-sm h-8"
                min="0"
                step="0.01"
              />
              <select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split("-");
                  setFilters((p) => ({
                    ...p,
                    sort_by: sort_by,
                    sort_order: sort_order as "asc" | "desc",
                  }));
                }}
                className="input w-full text-sm h-8"
              >
                <option value="created_at-desc">Newest</option>
                <option value="created_at-asc">Oldest</option>
                <option value="amount-desc">$ High</option>
                <option value="amount-asc">$ Low</option>
                <option value="customer_name-asc">A-Z</option>
                <option value="customer_name-desc">Z-A</option>
              </select>
            </div>
          </div>
        )}

        {/* Transactions Count and Bulk Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--primary-base)]">
              {totalTransactions} transactions
            </span>
            {selectedTransactions.length > 0 && (
              <>
                <span className="text-[var(--primary-accent2)]">
                  ({selectedTransactions.length} selected)
                </span>
                <button className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)]">
                  Export
                </button>
                <button className="text-red-600 hover:text-red-700">
                  Delete
                </button>
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
        {displayError && (
          <div className="bg-[#CB5927]/10 border border-[#CB5927]/30 rounded-xl p-4 mb-6">
            <p className="text-[#653011] font-medium">{displayError}</p>
          </div>
        )}

        {/* Transactions Table */}
        {loading ? (
          <ProcurLoader size="md" text="Loading transactions..." />
        ) : paginatedTransactions.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
              No transactions found
            </h3>
            <p className="text-[var(--secondary-muted-edge)] mb-6">
              {filters.search || filters.type || filters.status
                ? "Try adjusting your filters or search terms"
                : "Your transactions will appear here once you start selling"}
            </p>
            <Link
              href="/seller"
              className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--primary-background)] border-b border-[var(--secondary-soft-highlight)]">
                  <tr>
                    <th className="text-left py-2 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          selectedTransactions.length ===
                          paginatedTransactions.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] min-w-[120px]">
                      ID
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-16">
                      Type
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] min-w-[140px]">
                      Buyer
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-20">
                      Amount
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-20">
                      Net
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-16">
                      Method
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-20">
                      Status
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-20">
                      Date
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-[var(--secondary-black)] w-16">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-[var(--secondary-soft-highlight)]/20 last:border-0 hover:bg-[var(--primary-background)]/50 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.includes(
                            transaction.id
                          )}
                          onChange={() =>
                            handleSelectTransaction(transaction.id)
                          }
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Link
                          href={`/seller/transactions/${transaction.id}`}
                          className="font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] text-xs"
                        >
                          {transaction.transaction_number ||
                            transaction.id.slice(0, 12) + "..."}
                        </Link>
                        {transaction.order_id && (
                          <Link
                            href={`/seller/orders/${transaction.order_id}`}
                            className="text-xs text-[var(--secondary-muted-edge)] hover:text-[var(--primary-accent2)] block mt-0.5"
                          >
                            Order: {transaction.order_id.slice(0, 8)}...
                          </Link>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={classNames(
                            "px-1.5 py-0.5 text-xs rounded-full font-medium",
                            getTransactionTypeColor(
                              (transaction.type as TransactionType) ||
                                TransactionType.SALE
                            )
                          )}
                        >
                          {transaction.type === TransactionType.SALE
                            ? "Sale"
                            : transaction.type === TransactionType.REFUND
                              ? "Refund"
                              : transaction.type === TransactionType.PAYOUT
                                ? "Payout"
                                : transaction.type === TransactionType.FEE
                                  ? "Fee"
                                  : transaction.type ===
                                      TransactionType.ADJUSTMENT
                                    ? "Adj"
                                    : "CB"}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-medium text-[var(--secondary-black)] text-xs truncate max-w-[140px]">
                          {transaction.buyer_org_id
                            ? transaction.buyer_org_id.slice(0, 8) + "…"
                            : "—"}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-[var(--secondary-black)] text-xs">
                          {formatAmount(
                            transaction.amount,
                            transaction.currency
                          )}
                        </div>
                        {transaction.platform_fee && (
                          <div className="text-xs text-[var(--primary-base)]">
                            -
                            {formatAmount(
                              Math.abs(transaction.platform_fee),
                              transaction.currency
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div
                          className={classNames(
                            "font-semibold text-xs",
                            (transaction.net_amount ?? 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {formatAmount(
                            transaction.net_amount ?? 0,
                            transaction.currency
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-[var(--primary-base)]">
                        {transaction.payment_method
                          ? formatPaymentMethod(
                              transaction.payment_method as PaymentMethod
                            )
                          : "—"}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={classNames(
                            "px-1.5 py-0.5 text-xs rounded-full font-medium",
                            getStatusColor(
                              (transaction.status as TransactionStatus) ||
                                TransactionStatus.PENDING
                            )
                          )}
                        >
                          {transaction.status === TransactionStatus.COMPLETED
                            ? "✓"
                            : transaction.status === TransactionStatus.PENDING
                              ? "⏳"
                              : transaction.status ===
                                  TransactionStatus.PROCESSING
                                ? "⚡"
                                : transaction.status ===
                                    TransactionStatus.FAILED
                                  ? "✗"
                                  : "⊘"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-[var(--primary-base)]">
                        <div>
                          {new Date(transaction.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </div>
                        <div className="text-xs opacity-60">
                          {new Date(transaction.created_at).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <button
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
                          </button>
                          {transaction.type === TransactionType.SALE && (
                            <button
                              className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)] p-1"
                              title="Download Receipt"
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
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </button>
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
      </main>
    </div>
  );
}
