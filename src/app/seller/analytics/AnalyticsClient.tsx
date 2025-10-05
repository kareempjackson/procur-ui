"use client";

import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchDashboardMetrics,
  fetchSalesAnalytics,
  AnalyticsPeriod,
  selectDashboardMetrics,
  selectSalesAnalytics,
  selectAnalyticsStatus,
  selectAnalyticsError,
} from "@/store/slices/sellerAnalyticsSlice";
import ProcurLoader from "@/components/ProcurLoader";

export default function AnalyticsClient() {
  const dispatch = useAppDispatch();
  const dashboardMetrics = useAppSelector(selectDashboardMetrics);
  const salesAnalytics = useAppSelector(selectSalesAnalytics);
  const status = useAppSelector(selectAnalyticsStatus);
  const error = useAppSelector(selectAnalyticsError);

  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(
    AnalyticsPeriod.LAST_30_DAYS
  );

  // Period mapping for display
  const periodOptions = [
    { key: AnalyticsPeriod.LAST_7_DAYS, label: "7 Days" },
    { key: AnalyticsPeriod.LAST_30_DAYS, label: "30 Days" },
    { key: AnalyticsPeriod.LAST_90_DAYS, label: "90 Days" },
    { key: AnalyticsPeriod.THIS_YEAR, label: "This Year" },
  ];

  // Fetch analytics when component mounts or period changes
  useEffect(() => {
    dispatch(fetchDashboardMetrics({ period: selectedPeriod }));
    dispatch(fetchSalesAnalytics({ period: selectedPeriod, group_by: "day" }));
  }, [dispatch, selectedPeriod]);

  const handlePeriodChange = (period: AnalyticsPeriod) => {
    setSelectedPeriod(period);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Prepare stats from dashboard metrics
  const stats = dashboardMetrics
    ? [
        {
          label: "Total Revenue",
          value: formatCurrency(
            dashboardMetrics.total_revenue,
            dashboardMetrics.currency
          ),
          change: formatPercentage(dashboardMetrics.revenue_growth),
          trend: dashboardMetrics.revenue_growth >= 0 ? "up" : "down",
          icon: CurrencyDollarIcon,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          label: "Total Orders",
          value: dashboardMetrics.total_orders.toString(),
          change: formatPercentage(dashboardMetrics.orders_growth),
          trend: dashboardMetrics.orders_growth >= 0 ? "up" : "down",
          icon: ShoppingBagIcon,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          label: "Pending Orders",
          value: dashboardMetrics.pending_orders.toString(),
          change: "",
          trend: "neutral",
          icon: TruckIcon,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        },
        {
          label: "Avg Order Value",
          value: formatCurrency(
            dashboardMetrics.average_order_value,
            dashboardMetrics.currency
          ),
          change: "",
          trend: "neutral",
          icon: ChartBarIcon,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
      ]
    : [];

  // Additional stats for products
  const productStats = dashboardMetrics
    ? [
        {
          label: "Active Products",
          value: dashboardMetrics.active_products,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          label: "Low Stock",
          value: dashboardMetrics.low_stock_products,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        },
        {
          label: "Out of Stock",
          value: dashboardMetrics.out_of_stock_products,
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
      ]
    : [];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <ProcurLoader />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
            Failed to Load Analytics
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">{error}</p>
          <button
            onClick={() =>
              dispatch(fetchDashboardMetrics({ period: selectedPeriod }))
            }
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main>
        {/* Header */}
        <section className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
          <div className="max-w-[1400px] mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[var(--secondary-black)] mb-1">
                  Analytics
                </h1>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  Track your sales performance and business metrics
                </p>
              </div>

              {/* Period Selector */}
              <div className="flex items-center gap-2">
                {periodOptions.map((period) => (
                  <button
                    key={period.key}
                    onClick={() => handlePeriodChange(period.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedPeriod === period.key
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "bg-[var(--primary-background)] text-[var(--secondary-black)] hover:bg-white border border-[var(--secondary-soft-highlight)]/30"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.change && (
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === "up"
                          ? "text-green-600"
                          : stat.trend === "down"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                      ) : stat.trend === "down" ? (
                        <ArrowTrendingDownIcon className="h-4 w-4" />
                      ) : null}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-[var(--secondary-black)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--secondary-muted-edge)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Product Stats & Top Selling Product */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Product Inventory Stats */}
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Product Inventory
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {productStats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`p-4 rounded-xl ${stat.bgColor}`}
                  >
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-[var(--secondary-muted-edge)]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Product */}
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Top Selling Product
              </h3>
              {dashboardMetrics?.top_selling_product ? (
                <div className="p-4 bg-[var(--primary-background)] rounded-xl">
                  <div className="font-semibold text-[var(--secondary-black)] mb-2">
                    {dashboardMetrics.top_selling_product.name}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-[var(--secondary-muted-edge)]">
                        Quantity Sold
                      </div>
                      <div className="font-medium text-[var(--secondary-black)]">
                        {dashboardMetrics.top_selling_product.quantity_sold}
                      </div>
                    </div>
                    <div>
                      <div className="text-[var(--secondary-muted-edge)]">
                        Revenue
                      </div>
                      <div className="font-medium text-[var(--secondary-black)]">
                        {formatCurrency(
                          dashboardMetrics.top_selling_product.revenue,
                          dashboardMetrics.currency
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--secondary-muted-edge)]">
                  No sales data available
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Over Time Chart */}
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Revenue Over Time
              </h3>
              {salesAnalytics?.sales_data &&
              salesAnalytics.sales_data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesAnalytics.sales_data}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#407178"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#407178"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value: any) => `$${value.toLocaleString()}`}
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#407178"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center bg-[var(--primary-background)] rounded-xl">
                  <svg
                    className="w-16 h-16 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-[var(--secondary-muted-edge)] text-sm font-medium">
                    No revenue data available
                  </p>
                  <p className="text-[var(--secondary-muted-edge)] text-xs mt-1">
                    Start making sales to see your revenue trends
                  </p>
                </div>
              )}
            </div>

            {/* Orders Over Time Chart */}
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Orders Over Time
              </h3>
              {salesAnalytics?.sales_data &&
              salesAnalytics.sales_data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesAnalytics.sales_data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="orders"
                      fill="#407178"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center bg-[var(--primary-background)] rounded-xl">
                  <svg
                    className="w-16 h-16 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="text-[var(--secondary-muted-edge)] text-sm font-medium">
                    No order data available
                  </p>
                  <p className="text-[var(--secondary-muted-edge)] text-xs mt-1">
                    Your order history will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="mt-6 bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
              Top Products by Revenue
            </h3>
            {salesAnalytics?.top_products &&
            salesAnalytics.top_products.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={salesAnalytics.top_products.slice(0, 10)}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    width={90}
                  />
                  <Tooltip
                    formatter={(value: any) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#407178" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center bg-[var(--primary-background)] rounded-xl">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-[var(--secondary-muted-edge)] text-sm font-medium">
                  No product data available
                </p>
                <p className="text-[var(--secondary-muted-edge)] text-xs mt-1">
                  Your top selling products will appear here
                </p>
              </div>
            )}
          </div>

          {/* Period Info */}
          {dashboardMetrics && (
            <div className="mt-6 text-center text-sm text-[var(--secondary-muted-edge)]">
              Data from{" "}
              {new Date(dashboardMetrics.period_start).toLocaleDateString()} to{" "}
              {new Date(dashboardMetrics.period_end).toLocaleDateString()}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
