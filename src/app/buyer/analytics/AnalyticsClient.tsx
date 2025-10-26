"use client";

import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions } from "@/store/slices/buyerTransactionsSlice";
import { fetchOrders } from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

export default function AnalyticsClient() {
  const dispatch = useAppDispatch();
  const { summary, status } = useAppSelector(
    (state) => state.buyerTransactions
  );
  const { orders: ordersData } = useAppSelector((state) => state.buyerOrders);

  const [timeRange, setTimeRange] = useState("30days");

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 100 }));
    dispatch(fetchOrders({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Loading state
  if (status === "loading" || !summary) {
    return <ProcurLoader size="lg" text="Loading analytics..." />;
  }

  // Ensure orders is an array
  const orders = Array.isArray(ordersData) ? ordersData : [];

  // Calculate order stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-1">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Insights into your procurement performance
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-[var(--secondary-muted-edge)]" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-[var(--secondary-soft-highlight)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]/20 focus:border-[var(--primary-accent2)] transition-all bg-white"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Spent */}
          <div className="bg-gradient-to-br from-[#CB5927] to-[#653011] rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <CurrencyDollarIcon className="h-7 w-7" />
              </div>
              <div className="text-right">
                <div className="text-xs opacity-90 mb-1">Total Spent</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.total_spent, summary.currency)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {summary.total_transactions} transactions
              </span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-[#C0D1C7] to-[#407178] rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <ShoppingCartIcon className="h-7 w-7" />
              </div>
              <div className="text-right">
                <div className="text-xs opacity-90 mb-1">Total Orders</div>
                <div className="text-2xl font-bold">{totalOrders}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircleIcon className="h-4 w-4 opacity-80" />
              <span className="text-xs opacity-90">
                {completedOrders} completed
              </span>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-gradient-to-br from-[#A6B1E7] to-[#8091D5] rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <ChartBarIcon className="h-7 w-7" />
              </div>
              <div className="text-right">
                <div className="text-xs opacity-90 mb-1">Avg Order Value</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    summary.average_transaction_amount,
                    summary.currency
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BanknotesIcon className="h-4 w-4 opacity-80" />
              <span className="text-xs opacity-90">Per transaction</span>
            </div>
          </div>

          {/* Top Suppliers */}
          <div className="bg-gradient-to-br from-[#E0A374] to-[#CB5927] rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <UserGroupIcon className="h-7 w-7" />
              </div>
              <div className="text-right">
                <div className="text-xs opacity-90 mb-1">Top Suppliers</div>
                <div className="text-2xl font-bold">
                  {summary.top_sellers?.length || 0}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <StarIcon className="h-4 w-4 opacity-80" />
              <span className="text-xs opacity-90">Active partnerships</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Spending Trend - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--secondary-black)] mb-1">
                  Monthly Spending Trend
                </h3>
                <p className="text-xs text-[var(--secondary-muted-edge)]">
                  Your procurement spending over time
                </p>
              </div>
              <div className="px-3 py-1.5 bg-[var(--primary-accent2)]/10 rounded-full text-xs font-medium text-[var(--primary-accent2)]">
                Last 12 months
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {summary.monthly_spending &&
              summary.monthly_spending.length > 0 ? (
                summary.monthly_spending.map((item, index) => {
                  const maxAmount = Math.max(
                    ...summary.monthly_spending.map((m) => m.amount)
                  );
                  const percentage = (item.amount / maxAmount) * 100;

                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 text-xs font-medium text-[var(--secondary-muted-edge)]">
                        {item.month}
                      </div>
                      <div className="flex-1 relative">
                        <div className="h-10 bg-[var(--primary-background)] rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--primary-accent2)] to-[var(--primary-accent3)] rounded-lg transition-all duration-500 flex items-center px-3"
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage > 30 && (
                              <span className="text-xs font-semibold text-white">
                                {formatCurrency(item.amount, summary.currency)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-xs text-[var(--secondary-muted-edge)]">
                          {item.transaction_count} orders
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-sm text-[var(--secondary-muted-edge)]">
                  No spending data available
                </div>
              )}
            </div>
          </div>

          {/* Transaction Status Breakdown */}
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--secondary-black)] mb-4">
              Transaction Status
            </h3>

            <div className="space-y-4">
              {summary.transactions_by_status &&
              Object.keys(summary.transactions_by_status).length > 0 ? (
                Object.entries(summary.transactions_by_status).map(
                  ([status, count]) => {
                    const colors: Record<string, { bg: string; text: string }> =
                      {
                        completed: {
                          bg: "bg-[#C0D1C7]/20",
                          text: "text-[#407178]",
                        },
                        pending: {
                          bg: "bg-[#E0A374]/20",
                          text: "text-[#CB5927]",
                        },
                        failed: {
                          bg: "bg-[#CB5927]/20",
                          text: "text-[#653011]",
                        },
                        cancelled: {
                          bg: "bg-[#6C715D]/20",
                          text: "text-[#6C715D]",
                        },
                      };

                    const color =
                      colors[status.toLowerCase()] || colors.cancelled;

                    return (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${color.bg} rounded-lg flex items-center justify-center`}
                          >
                            <span className={`text-sm font-bold ${color.text}`}>
                              {count}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[var(--secondary-black)] capitalize">
                              {status}
                            </div>
                            <div className="text-xs text-[var(--secondary-muted-edge)]">
                              {(
                                (count / summary.total_transactions) *
                                100
                              ).toFixed(0)}
                              % of total
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div className="text-center py-8 text-sm text-[var(--secondary-muted-edge)]">
                  No transaction status data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Suppliers Table */}
        {summary.top_sellers && summary.top_sellers.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 overflow-hidden shadow-sm mb-8">
            <div className="p-6 border-b border-[var(--secondary-soft-highlight)]">
              <h3 className="text-lg font-bold text-[var(--secondary-black)] mb-1">
                Top Suppliers by Volume
              </h3>
              <p className="text-xs text-[var(--secondary-muted-edge)]">
                Your most valuable supplier partnerships
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--primary-background)]">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-wider">
                      Avg Order
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary.top_sellers.map((seller, index) => (
                    <tr
                      key={seller.seller_id}
                      className={`border-b border-[var(--secondary-soft-highlight)]/20 last:border-0 hover:bg-[var(--primary-background)]/50 transition-colors ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-[var(--primary-background)]/20"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0
                                ? "bg-[#E0A374] text-white"
                                : index === 1
                                  ? "bg-[#C0D1C7] text-[#407178]"
                                  : index === 2
                                    ? "bg-[#A6B1E7] text-white"
                                    : "bg-[var(--primary-background)] text-[var(--secondary-muted-edge)]"
                            }`}
                          >
                            #{index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-sm text-[var(--secondary-black)]">
                          {seller.seller_name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-[var(--secondary-black)]">
                          {formatCurrency(
                            seller.total_amount,
                            summary.currency
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-[var(--secondary-muted-edge)]">
                          {seller.transaction_count} orders
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-[var(--secondary-muted-edge)]">
                          {formatCurrency(
                            seller.total_amount / seller.transaction_count,
                            summary.currency
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

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Net Spent */}
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#CB5927]/10 rounded-lg">
                <BanknotesIcon className="h-5 w-5 text-[#CB5927]" />
              </div>
              <div className="text-xs font-semibold text-[var(--secondary-muted-edge)] uppercase tracking-wide">
                Net Spent
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--secondary-black)] mb-1">
              {formatCurrency(summary.net_spent, summary.currency)}
            </div>
            <div className="text-xs text-[var(--secondary-muted-edge)]">
              After refunds & adjustments
            </div>
          </div>

          {/* Total Refunds */}
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#C0D1C7]/30 rounded-lg">
                <ArrowTrendingDownIcon className="h-5 w-5 text-[#407178]" />
              </div>
              <div className="text-xs font-semibold text-[var(--secondary-muted-edge)] uppercase tracking-wide">
                Refunds
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--secondary-black)] mb-1">
              {formatCurrency(summary.total_refunds, summary.currency)}
            </div>
            <div className="text-xs text-[var(--secondary-muted-edge)]">
              Money returned
            </div>
          </div>

          {/* Total Fees */}
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#E0A374]/20 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-[#CB5927]" />
              </div>
              <div className="text-xs font-semibold text-[var(--secondary-muted-edge)] uppercase tracking-wide">
                Fees Paid
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--secondary-black)] mb-1">
              {formatCurrency(summary.total_fees, summary.currency)}
            </div>
            <div className="text-xs text-[var(--secondary-muted-edge)]">
              Platform & processing
            </div>
          </div>

          {/* Largest Transaction */}
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#A6B1E7]/20 rounded-lg">
                <ArrowTrendingUpIcon className="h-5 w-5 text-[#8091D5]" />
              </div>
              <div className="text-xs font-semibold text-[var(--secondary-muted-edge)] uppercase tracking-wide">
                Largest Order
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--secondary-black)] mb-1">
              {formatCurrency(summary.largest_transaction, summary.currency)}
            </div>
            <div className="text-xs text-[var(--secondary-muted-edge)]">
              Single transaction
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
