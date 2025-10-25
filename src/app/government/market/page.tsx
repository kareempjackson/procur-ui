"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ScaleIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchSupplyDemand,
  fetchTransactions,
  fetchMarketStats,
  selectSupplyDemand,
  selectSupplyDemandStatus,
  selectTransactions,
  selectTransactionsStatus,
  selectMarketStats,
  selectMarketStatsStatus,
  selectSelectedPeriod,
  setSelectedPeriod as setReduxSelectedPeriod,
} from "@/store/slices/governmentMarketSlice";

export default function MarketPage() {
  const dispatch = useAppDispatch();

  // Redux state
  const supplyDemandData = useAppSelector(selectSupplyDemand);
  const supplyDemandStatus = useAppSelector(selectSupplyDemandStatus);
  const transactions = useAppSelector(selectTransactions);
  const transactionsStatus = useAppSelector(selectTransactionsStatus);
  const marketStats = useAppSelector(selectMarketStats);
  const marketStatsStatus = useAppSelector(selectMarketStatsStatus);
  const reduxSelectedPeriod = useAppSelector(selectSelectedPeriod);

  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "quarter" | "year"
  >(reduxSelectedPeriod);

  // Fetch data on mount and when period changes
  useEffect(() => {
    if (
      supplyDemandStatus === "idle" ||
      selectedPeriod !== reduxSelectedPeriod
    ) {
      dispatch(setReduxSelectedPeriod(selectedPeriod));
      dispatch(fetchSupplyDemand({ period: selectedPeriod }));
    }
  }, [supplyDemandStatus, selectedPeriod, reduxSelectedPeriod, dispatch]);

  useEffect(() => {
    if (transactionsStatus === "idle") {
      dispatch(fetchTransactions({ page: 1, limit: 10 }));
    }
  }, [transactionsStatus, dispatch]);

  useEffect(() => {
    if (marketStatsStatus === "idle") {
      dispatch(fetchMarketStats({ period: selectedPeriod }));
    }
  }, [marketStatsStatus, selectedPeriod, dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchSupplyDemand({ period: selectedPeriod }));
    dispatch(fetchTransactions({ page: 1, limit: 10 }));
    dispatch(fetchMarketStats({ period: selectedPeriod }));
  };

  // Mock market data (fallback)
  const mockSupplyDemandData = [
    {
      crop: "Tomatoes",
      supply: 45000,
      demand: 48000,
      gap: -3000,
      gapPercentage: -6.3,
      avgPrice: "$2.50/kg",
      trend: "increasing",
    },
    {
      crop: "Lettuce",
      supply: 24000,
      demand: 20000,
      gap: 4000,
      gapPercentage: 20,
      avgPrice: "$3.20/kg",
      trend: "stable",
    },
    {
      crop: "Peppers",
      supply: 50000,
      demand: 48500,
      gap: 1500,
      gapPercentage: 3.1,
      avgPrice: "$2.80/kg",
      trend: "stable",
    },
    {
      crop: "Sweet Potato",
      supply: 70000,
      demand: 65000,
      gap: 5000,
      gapPercentage: 7.7,
      avgPrice: "$1.80/kg",
      trend: "decreasing",
    },
    {
      crop: "Bananas",
      supply: 35000,
      demand: 42000,
      gap: -7000,
      gapPercentage: -16.7,
      avgPrice: "$1.50/kg",
      trend: "increasing",
    },
  ];

  const mockTransactions = [
    {
      id: "1",
      date: "2024-10-03",
      seller: "Green Valley Farms",
      sellerId: "1",
      buyer: "Fresh Market Ltd",
      crop: "Tomatoes",
      quantity: "1,000 kg",
      pricePerUnit: "$2.50/kg",
      totalValue: "$2,500",
      status: "completed" as const,
    },
    {
      id: "2",
      date: "2024-10-03",
      seller: "Sunrise Agricultural Co.",
      sellerId: "2",
      buyer: "Island Grocers",
      crop: "Lettuce",
      quantity: "500 kg",
      pricePerUnit: "$3.20/kg",
      totalValue: "$1,600",
      status: "completed",
    },
    {
      id: "3",
      date: "2024-10-02",
      seller: "Highland Produce Ltd.",
      sellerId: "3",
      buyer: "Restaurants United",
      crop: "Peppers",
      quantity: "800 kg",
      pricePerUnit: "$2.80/kg",
      totalValue: "$2,240",
      status: "completed",
    },
    {
      id: "4",
      date: "2024-10-02",
      seller: "Coastal Farms Group",
      sellerId: "4",
      buyer: "Export Co.",
      crop: "Sweet Potato",
      quantity: "2,000 kg",
      pricePerUnit: "$1.80/kg",
      totalValue: "$3,600",
      status: "pending",
    },
  ];

  const mockMarketStats = {
    totalTransactions: 234,
    totalValue: 548900,
    averageTransactionValue: 2345,
    topCrop: "Tomatoes",
    supplyDeficit: -10000,
    supplyDeficitCount: 2,
  };

  const mockPriceHistory = [
    {
      crop: "Tomatoes",
      lastMonth: "$2.30/kg",
      current: "$2.50/kg",
      change: "+8.7%",
    },
    {
      crop: "Lettuce",
      lastMonth: "$3.10/kg",
      current: "$3.20/kg",
      change: "+3.2%",
    },
    {
      crop: "Peppers",
      lastMonth: "$2.85/kg",
      current: "$2.80/kg",
      change: "-1.8%",
    },
    {
      crop: "Sweet Potato",
      lastMonth: "$1.90/kg",
      current: "$1.80/kg",
      change: "-5.3%",
    },
  ];

  // Use API data with fallback to mock data
  const displaySupplyDemand =
    supplyDemandData.length > 0 ? supplyDemandData : mockSupplyDemandData;
  const displayTransactions =
    transactions.length > 0 ? transactions : mockTransactions;
  const displayMarketStats = marketStats || mockMarketStats;

  // Loading states
  const isLoading =
    supplyDemandStatus === "loading" ||
    transactionsStatus === "loading" ||
    marketStatsStatus === "loading";

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              Market Intelligence
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
              Monitor supply, demand, pricing trends, and market transactions
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <ArrowPathIcon
                className={`h-5 w-5 text-[color:var(--secondary-muted-edge)] ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </button>

            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(
                  e.target.value as "week" | "month" | "quarter" | "year"
                )
              }
              className="px-4 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBagIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                Transactions
              </div>
            </div>
            <div className="text-2xl font-semibold text-[color:var(--secondary-black)]">
              {displayMarketStats.totalTransactions}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <BanknotesIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                Total Value
              </div>
            </div>
            <div className="text-2xl font-semibold text-[color:var(--secondary-black)]">
              ${((displayMarketStats.totalValue ?? 0) / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <ScaleIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                Avg Transaction
              </div>
            </div>
            <div className="text-2xl font-semibold text-[color:var(--secondary-black)]">
              $
              {(
                displayMarketStats.averageTransactionValue ?? 0
              ).toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Top Crop
            </div>
            <div className="text-2xl font-semibold text-[color:var(--secondary-black)]">
              {displayMarketStats.topCrop}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Supply Deficit
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`text-2xl font-semibold ${
                  displayMarketStats.supplyDeficit < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {displayMarketStats.supplyDeficitCount} crops
              </div>
              {displayMarketStats.supplyDeficit < 0 ? (
                <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
              ) : (
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Supply & Demand */}
          <div className="lg:col-span-2 space-y-6">
            {/* Supply vs Demand */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                      Supply vs Demand Analysis
                    </h2>
                    <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                      Market balance by crop type
                    </p>
                  </div>
                  <Link
                    href="/government/reporting?type=market-requirements"
                    className="text-xs text-[color:var(--primary-accent2)] hover:text-[color:var(--primary-accent3)] font-medium"
                  >
                    Generate Report →
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                {displaySupplyDemand.map((item) => (
                  <div key={item.crop} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[color:var(--secondary-black)]">
                          {item.crop}
                        </h3>
                        <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                          Average Price: {item.avgPrice}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          item.gap < 0
                            ? "bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)]"
                            : item.gap > 5000
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                        }`}
                      >
                        {item.gap < 0 ? (
                          <>
                            <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
                            Shortage
                          </>
                        ) : (
                          <>
                            <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                            Surplus
                          </>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                          Supply
                        </div>
                        <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                          {item.supply.toLocaleString()} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                          Demand
                        </div>
                        <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                          {item.demand.toLocaleString()} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                          Gap
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            item.gap < 0
                              ? "text-[color:var(--primary-accent2)]"
                              : "text-[color:var(--primary-base)]"
                          }`}
                        >
                          {item.gap > 0 ? "+" : ""}
                          {item.gap.toLocaleString()} kg
                        </div>
                      </div>
                    </div>

                    {/* Visual Bar */}
                    <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-[var(--primary-base)]/30"
                        style={{
                          width: `${Math.min(
                            (item.supply / Math.max(item.supply, item.demand)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                      <div
                        className="absolute top-0 left-0 h-full border-2 border-[var(--primary-accent2)]"
                        style={{
                          width: `${Math.min(
                            (item.demand / Math.max(item.supply, item.demand)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-[color:var(--secondary-black)]">
                          {item.gapPercentage > 0 ? "+" : ""}
                          {item.gapPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                  Recent Transactions
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Latest market activity
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-[color:var(--secondary-soft-highlight)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Crop
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                    {displayTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm text-[color:var(--secondary-black)]">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            href={`/government/vendors/${transaction.sellerId}`}
                            className="text-[color:var(--secondary-black)] hover:text-[var(--primary-accent2)]"
                          >
                            {transaction.seller}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-[color:var(--secondary-black)]">
                          {transaction.buyer}
                        </td>
                        <td className="px-6 py-4 text-sm text-[color:var(--secondary-black)]">
                          {transaction.crop}
                        </td>
                        <td className="px-6 py-4 text-sm text-[color:var(--secondary-black)]">
                          {transaction.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[color:var(--primary-base)]">
                          {transaction.totalValue}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Price Trends & Insights */}
          <div className="space-y-6">
            {/* Price Trends */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Price Trends
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Month-over-month comparison
                </p>
              </div>
              <div className="p-4 space-y-4">
                {mockPriceHistory.map((item) => {
                  const isIncrease = item.change.startsWith("+");
                  return (
                    <div
                      key={item.crop}
                      className="p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium text-[color:var(--secondary-black)]">
                          {item.crop}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            isIncrease
                              ? "text-[color:var(--primary-base)]"
                              : "text-[color:var(--primary-accent2)]"
                          }`}
                        >
                          {isIncrease ? (
                            <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
                          )}
                          {item.change}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <div className="text-[color:var(--secondary-muted-edge)]">
                            Last Month
                          </div>
                          <div className="font-medium text-[color:var(--secondary-black)] mt-0.5">
                            {item.lastMonth}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[color:var(--secondary-muted-edge)]">
                            Current
                          </div>
                          <div className="font-medium text-[color:var(--secondary-black)] mt-0.5">
                            {item.current}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market Insights */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h3 className="text-base font-semibold text-[color:var(--secondary-black)] mb-4">
                Market Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[var(--primary-accent2)]/5 border border-[color:var(--secondary-soft-highlight)]">
                  <div className="flex items-start gap-2">
                    <ArrowTrendingDownIcon className="h-5 w-5 text-[color:var(--primary-accent2)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                        Tomato Shortage Alert
                      </div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                        Demand exceeds supply by 6.3%. Consider incentive
                        programs for increased production.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--primary-base)]/5 border border-[color:var(--secondary-soft-highlight)]">
                  <div className="flex items-start gap-2">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-[color:var(--primary-base)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                        Sweet Potato Surplus
                      </div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                        Supply exceeds demand. Explore export opportunities or
                        processing initiatives.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h3 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Quick Actions
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href="/government/reporting?type=market-requirements"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  <ChartBarIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                  Market Requirements Report
                </Link>
                <Link
                  href="/government/reporting?type=quarterly-sales"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  <ChartBarIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                  Quarterly Sales Report
                </Link>
                <Link
                  href="/government/data"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  <ChartBarIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                  Export Market Data
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
