"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const dynamic = "force-dynamic";

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
  order_id?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  fee_amount?: number;
  net_amount: number;
  payment_method: PaymentMethod;
  customer_name: string;
  customer_email?: string;
  description: string;
  reference_number?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  metadata?: {
    product_names?: string[];
    quantity?: number;
    shipping_address?: string;
    notes?: string;
  };
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
  const { accessToken } = useSelector(
    (state: RootState) => state?.auth || { accessToken: null }
  );

  // Demo transactions data
  const demoTransactions: Transaction[] = [
    {
      id: "txn_001",
      order_id: "#10234",
      type: TransactionType.SALE,
      status: TransactionStatus.COMPLETED,
      amount: 1240.0,
      currency: "USD",
      fee_amount: 37.2,
      net_amount: 1202.8,
      payment_method: PaymentMethod.CREDIT_CARD,
      customer_name: "GreenLeaf Market",
      customer_email: "orders@greenleafmarket.com",
      description: "Payment for Order #10234 - Organic produce bundle",
      reference_number: "ref_abc123",
      created_at: "2024-01-23T14:30:00Z",
      updated_at: "2024-01-23T14:32:15Z",
      processed_at: "2024-01-23T14:32:15Z",
      metadata: {
        product_names: [
          "Organic Roma Tomatoes",
          "Free-Range Eggs",
          "Baby Spinach",
        ],
        quantity: 8,
        shipping_address: "123 Market St, Green Valley, CA 94102",
      },
    },
    {
      id: "txn_002",
      order_id: "#10233",
      type: TransactionType.SALE,
      status: TransactionStatus.COMPLETED,
      amount: 380.0,
      currency: "USD",
      fee_amount: 11.4,
      net_amount: 368.6,
      payment_method: PaymentMethod.DEBIT_CARD,
      customer_name: "FreshCo Foods",
      customer_email: "procurement@freshcofoods.com",
      description: "Payment for Order #10233 - Fresh vegetables",
      reference_number: "ref_def456",
      created_at: "2024-01-22T09:15:00Z",
      updated_at: "2024-01-22T09:17:30Z",
      processed_at: "2024-01-22T09:17:30Z",
      metadata: {
        product_names: ["Heirloom Carrots", "Organic Honey"],
        quantity: 3,
        shipping_address: "456 Fresh Ave, Organic City, CA 94103",
      },
    },
    {
      id: "txn_003",
      type: TransactionType.PAYOUT,
      status: TransactionStatus.COMPLETED,
      amount: 2450.75,
      currency: "USD",
      net_amount: 2450.75,
      payment_method: PaymentMethod.BANK_TRANSFER,
      customer_name: "Procur Platform",
      description: "Weekly payout - Jan 15-21, 2024",
      reference_number: "payout_week3_2024",
      created_at: "2024-01-22T00:00:00Z",
      updated_at: "2024-01-22T08:30:00Z",
      processed_at: "2024-01-22T08:30:00Z",
      metadata: {
        notes: "Automatic weekly payout to registered bank account",
      },
    },
    {
      id: "txn_004",
      order_id: "#10232",
      type: TransactionType.SALE,
      status: TransactionStatus.PROCESSING,
      amount: 2115.0,
      currency: "USD",
      fee_amount: 63.45,
      net_amount: 2051.55,
      payment_method: PaymentMethod.DIGITAL_WALLET,
      customer_name: "Urban Grocer",
      customer_email: "orders@urbangrocer.com",
      description: "Payment for Order #10232 - Large produce order",
      reference_number: "ref_ghi789",
      created_at: "2024-01-21T16:45:00Z",
      updated_at: "2024-01-21T16:47:00Z",
      metadata: {
        product_names: [
          "Grass-Fed Ground Beef",
          "Artisan Sourdough",
          "Organic Blueberries",
        ],
        quantity: 12,
        shipping_address: "789 Urban St, Metro City, CA 94104",
      },
    },
    {
      id: "txn_005",
      order_id: "#10225",
      type: TransactionType.REFUND,
      status: TransactionStatus.COMPLETED,
      amount: -125.5,
      currency: "USD",
      fee_amount: -3.77,
      net_amount: -129.27,
      payment_method: PaymentMethod.CREDIT_CARD,
      customer_name: "Healthy Eats Co",
      customer_email: "returns@healthyeats.com",
      description: "Refund for Order #10225 - Damaged goods",
      reference_number: "ref_refund_001",
      created_at: "2024-01-20T11:20:00Z",
      updated_at: "2024-01-20T11:25:00Z",
      processed_at: "2024-01-20T11:25:00Z",
      metadata: {
        product_names: ["Organic Spinach"],
        quantity: 2,
        notes: "Customer reported damaged packaging upon delivery",
      },
    },
    {
      id: "txn_006",
      type: TransactionType.FEE,
      status: TransactionStatus.COMPLETED,
      amount: -25.0,
      currency: "USD",
      net_amount: -25.0,
      payment_method: PaymentMethod.BANK_TRANSFER,
      customer_name: "Procur Platform",
      description: "Monthly subscription fee - January 2024",
      reference_number: "fee_monthly_jan2024",
      created_at: "2024-01-20T00:00:00Z",
      updated_at: "2024-01-20T00:01:00Z",
      processed_at: "2024-01-20T00:01:00Z",
      metadata: {
        notes: "Monthly platform subscription fee",
      },
    },
    {
      id: "txn_007",
      order_id: "#10220",
      type: TransactionType.SALE,
      status: TransactionStatus.FAILED,
      amount: 567.25,
      currency: "USD",
      fee_amount: 17.02,
      net_amount: 550.23,
      payment_method: PaymentMethod.CREDIT_CARD,
      customer_name: "Farm Fresh Market",
      customer_email: "billing@farmfreshmarket.com",
      description: "Payment for Order #10220 - Mixed vegetables",
      reference_number: "ref_failed_001",
      created_at: "2024-01-19T13:10:00Z",
      updated_at: "2024-01-19T13:15:00Z",
      metadata: {
        product_names: ["Bell Peppers", "Cucumbers"],
        quantity: 5,
        notes: "Payment failed - insufficient funds",
      },
    },
    {
      id: "txn_008",
      order_id: "#10218",
      type: TransactionType.SALE,
      status: TransactionStatus.COMPLETED,
      amount: 89.99,
      currency: "USD",
      fee_amount: 2.7,
      net_amount: 87.29,
      payment_method: PaymentMethod.CASH,
      customer_name: "Local Farmer's Market",
      description: "Cash payment for Order #10218 - Farmers market booth",
      reference_number: "cash_001",
      created_at: "2024-01-18T08:30:00Z",
      updated_at: "2024-01-18T08:30:00Z",
      processed_at: "2024-01-18T08:30:00Z",
      metadata: {
        product_names: ["Organic Honey"],
        quantity: 1,
        notes: "Direct cash payment at farmers market",
      },
    },
    {
      id: "txn_009",
      type: TransactionType.ADJUSTMENT,
      status: TransactionStatus.COMPLETED,
      amount: 15.75,
      currency: "USD",
      net_amount: 15.75,
      payment_method: PaymentMethod.BANK_TRANSFER,
      customer_name: "Procur Platform",
      description: "Price adjustment - Order #10215",
      reference_number: "adj_001",
      created_at: "2024-01-17T14:20:00Z",
      updated_at: "2024-01-17T14:22:00Z",
      processed_at: "2024-01-17T14:22:00Z",
      metadata: {
        notes: "Price correction due to weight discrepancy",
      },
    },
    {
      id: "txn_010",
      order_id: "#10210",
      type: TransactionType.CHARGEBACK,
      status: TransactionStatus.PENDING,
      amount: -890.0,
      currency: "USD",
      fee_amount: -15.0,
      net_amount: -905.0,
      payment_method: PaymentMethod.CREDIT_CARD,
      customer_name: "Disputed Customer",
      description: "Chargeback dispute for Order #10210",
      reference_number: "cb_001",
      created_at: "2024-01-16T10:00:00Z",
      updated_at: "2024-01-16T10:00:00Z",
      metadata: {
        notes: "Customer disputed charge - under investigation",
      },
    },
  ];

  const [transactions, setTransactions] =
    useState<Transaction[]>(demoTransactions);
  const [error, setError] = useState<string | null>(null);
  const [totalTransactions, setTotalTransactions] = useState(
    demoTransactions.length
  );
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

  // Filter transactions
  const filterTransactions = () => {
    let filtered = [...demoTransactions];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchLower) ||
          transaction.order_id?.toLowerCase().includes(searchLower) ||
          transaction.customer_name.toLowerCase().includes(searchLower) ||
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.reference_number?.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(
        (transaction) => transaction.type === filters.type
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (transaction) => transaction.status === filters.status
      );
    }

    // Payment method filter
    if (filters.payment_method) {
      filtered = filtered.filter(
        (transaction) => transaction.payment_method === filters.payment_method
      );
    }

    // Date range filter
    if (filters.date_range) {
      const now = new Date();
      let startDate: Date;

      switch (filters.date_range) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter(
        (transaction) => new Date(transaction.created_at) >= startDate
      );
    }

    // Amount filters
    if (filters.amount_min) {
      const minAmount = parseFloat(filters.amount_min);
      filtered = filtered.filter(
        (transaction) => Math.abs(transaction.amount) >= minAmount
      );
    }
    if (filters.amount_max) {
      const maxAmount = parseFloat(filters.amount_max);
      filtered = filtered.filter(
        (transaction) => Math.abs(transaction.amount) <= maxAmount
      );
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sort_by) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "customer_name":
          aValue = a.customer_name.toLowerCase();
          bValue = b.customer_name.toLowerCase();
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (filters.sort_order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setTransactions(filtered);
    setTotalTransactions(filtered.length);
  };

  useEffect(() => {
    filterTransactions();
  }, [filters]);

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.SALE:
        return "bg-green-100 text-green-800";
      case TransactionType.REFUND:
        return "bg-red-100 text-red-800";
      case TransactionType.PAYOUT:
        return "bg-blue-100 text-blue-800";
      case TransactionType.FEE:
        return "bg-purple-100 text-purple-800";
      case TransactionType.ADJUSTMENT:
        return "bg-yellow-100 text-yellow-800";
      case TransactionType.CHARGEBACK:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case TransactionStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case TransactionStatus.PROCESSING:
        return "bg-blue-100 text-blue-800";
      case TransactionStatus.FAILED:
        return "bg-red-100 text-red-800";
      case TransactionStatus.CANCELLED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalSales = transactions
      .filter(
        (t) =>
          t.type === TransactionType.SALE &&
          t.status === TransactionStatus.COMPLETED
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRefunds = transactions
      .filter(
        (t) =>
          t.type === TransactionType.REFUND &&
          t.status === TransactionStatus.COMPLETED
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalFees = transactions
      .filter((t) => t.fee_amount)
      .reduce((sum, t) => sum + (t.fee_amount || 0), 0);

    const netRevenue = transactions
      .filter((t) => t.status === TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + t.net_amount, 0);

    return {
      totalSales,
      totalRefunds,
      totalFees,
      netRevenue,
    };
  }, [transactions]);

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

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
                Transactions
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
              onClick={() => setShowExportModal(true)}
              className="btn btn-ghost h-8 px-3 text-sm"
            >
              Export
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-ghost h-8 px-3 text-sm"
            >
              Filters
            </button>

            <Link
              href="/seller/analytics"
              className="btn btn-primary h-8 px-3 text-sm"
            >
              Analytics
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-4 mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-[var(--primary-base)] mb-1">
                Total Sales
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatAmount(summaryStats.totalSales)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--primary-base)] mb-1">
                Total Refunds
              </div>
              <div className="text-lg font-bold text-red-600">
                {formatAmount(summaryStats.totalRefunds)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--primary-base)] mb-1">
                Total Fees
              </div>
              <div className="text-lg font-bold text-purple-600">
                {formatAmount(summaryStats.totalFees)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--primary-base)] mb-1">
                Net Revenue
              </div>
              <div className="text-lg font-bold text-[var(--primary-accent2)]">
                {formatAmount(summaryStats.netRevenue)}
              </div>
            </div>
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
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
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
                onChange={(e) => handleFilterChange("status", e.target.value)}
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
              <select
                value={filters.payment_method}
                onChange={(e) =>
                  handleFilterChange("payment_method", e.target.value)
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
                  handleFilterChange("amount_min", e.target.value)
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
                  handleFilterChange("amount_max", e.target.value)
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
                  handleFilterChange("sort_by", sort_by);
                  handleFilterChange("sort_order", sort_order);
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
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] disabled:opacity-50"
              >
                ←
              </button>
              <span className="px-2 text-[var(--primary-base)]">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Transactions Table */}
        {paginatedTransactions.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-2">
              No transactions found
            </h3>
            <p className="text-[var(--primary-base)] mb-6">
              {filters.search || filters.type || filters.status
                ? "Try adjusting your filters or search terms"
                : "Your transactions will appear here once you start selling"}
            </p>
            <Link href="/seller" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-[var(--secondary-soft-highlight)]">
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
                      Customer
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
                      className="border-b border-[var(--secondary-soft-highlight)] last:border-0 hover:bg-gray-25"
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
                        <div className="font-medium text-[var(--secondary-black)] text-xs">
                          {transaction.id}
                        </div>
                        {transaction.order_id && (
                          <div className="text-xs text-[var(--primary-base)]">
                            {transaction.order_id}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={classNames(
                            "px-1.5 py-0.5 text-xs rounded-full font-medium",
                            getTransactionTypeColor(transaction.type)
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
                            : transaction.type === TransactionType.ADJUSTMENT
                            ? "Adj"
                            : "CB"}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-medium text-[var(--secondary-black)] text-xs truncate max-w-[140px]">
                          {transaction.customer_name}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-[var(--secondary-black)] text-xs">
                          {formatAmount(
                            transaction.amount,
                            transaction.currency
                          )}
                        </div>
                        {transaction.fee_amount && (
                          <div className="text-xs text-[var(--primary-base)]">
                            -
                            {formatAmount(
                              Math.abs(transaction.fee_amount),
                              transaction.currency
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div
                          className={classNames(
                            "font-semibold text-xs",
                            transaction.net_amount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {formatAmount(
                            transaction.net_amount,
                            transaction.currency
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-[var(--primary-base)]">
                        {transaction.payment_method ===
                        PaymentMethod.CREDIT_CARD
                          ? "Card"
                          : transaction.payment_method ===
                            PaymentMethod.DEBIT_CARD
                          ? "Debit"
                          : transaction.payment_method ===
                            PaymentMethod.BANK_TRANSFER
                          ? "Bank"
                          : transaction.payment_method ===
                            PaymentMethod.DIGITAL_WALLET
                          ? "Wallet"
                          : transaction.payment_method === PaymentMethod.CASH
                          ? "Cash"
                          : "Check"}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={classNames(
                            "px-1.5 py-0.5 text-xs rounded-full font-medium",
                            getStatusColor(transaction.status)
                          )}
                        >
                          {transaction.status === TransactionStatus.COMPLETED
                            ? "✓"
                            : transaction.status === TransactionStatus.PENDING
                            ? "⏳"
                            : transaction.status ===
                              TransactionStatus.PROCESSING
                            ? "⚡"
                            : transaction.status === TransactionStatus.FAILED
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

      <Footer />
    </div>
  );
}
