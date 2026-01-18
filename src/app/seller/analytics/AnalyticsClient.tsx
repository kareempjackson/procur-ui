"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

  const ui = useMemo(() => {
    const surface =
      "bg-white border border-[var(--secondary-soft-highlight)]/28 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)]";
    const surfacePadding = "p-4";
    const chartSurfacePadding = "p-5";
    const surfaceHover =
      "hover:shadow-[0_6px_18px_rgba(0,0,0,0.04)] hover:border-[var(--secondary-soft-highlight)]/45 transition-shadow transition-colors";

    const muted = "text-[var(--secondary-muted-edge)]";
    const text = "text-[var(--secondary-black)]";
    const subtle = "text-[var(--primary-base)]";

    return {
      surface,
      surfacePadding,
      chartSurfacePadding,
      surfaceHover,
      muted,
      text,
      subtle,
    };
  }, []);

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
          iconColor: "text-[var(--primary-accent2)]",
        },
        {
          label: "Total Orders",
          value: dashboardMetrics.total_orders.toString(),
          change: formatPercentage(dashboardMetrics.orders_growth),
          trend: dashboardMetrics.orders_growth >= 0 ? "up" : "down",
          icon: ShoppingBagIcon,
          iconColor: "text-[var(--secondary-muted-edge)]",
        },
        {
          label: "Pending Orders",
          value: dashboardMetrics.pending_orders.toString(),
          change: "",
          trend: "neutral",
          icon: TruckIcon,
          iconColor: "text-[var(--primary-base)]",
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
          iconColor: "text-[var(--secondary-muted-edge)]",
        },
      ]
    : [];

  // Additional stats for products
  const productStats = dashboardMetrics
    ? [
        {
          label: "Active Products",
          value: dashboardMetrics.active_products,
          accent: "bg-[var(--secondary-soft-highlight)]/70",
        },
        {
          label: "Low Stock",
          value: dashboardMetrics.low_stock_products,
          accent: "bg-[var(--primary-accent1)]/40",
        },
        {
          label: "Out of Stock",
          value: dashboardMetrics.out_of_stock_products,
          accent: "bg-[var(--primary-accent2)]/35",
        },
      ]
    : [];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
      <main>
        {/* Header */}
        <section className="bg-white border-b border-[var(--secondary-soft-highlight)]/35">
          <div className="max-w-[1400px] mx-auto px-6 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className={`text-xl font-semibold ${ui.text} mb-0.5`}>
                  Analytics
                </h1>
                <p className={`text-sm ${ui.muted}`}>
                  Track your sales performance and business metrics
                </p>
              </div>

              {/* Period Selector */}
              <div className="inline-flex items-center rounded-full border border-[var(--secondary-soft-highlight)]/35 bg-white p-1">
                {periodOptions.map((period) => (
                  <button
                    key={period.key}
                    onClick={() => handlePeriodChange(period.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedPeriod === period.key
                        ? "bg-[var(--secondary-black)] text-white"
                        : `text-[var(--secondary-black)] hover:bg-[var(--primary-background)]/35`
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
        <section className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`${ui.surface} ${ui.surfacePadding} ${ui.surfaceHover}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-white border border-[var(--secondary-soft-highlight)]/35">
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  {stat.change && (
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        stat.trend === "up"
                          ? "text-[var(--secondary-muted-edge)]"
                          : stat.trend === "down"
                            ? "text-[var(--primary-accent2)]"
                            : "text-[var(--primary-base)]"
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
                <div className={`text-xl font-semibold ${ui.text} mb-1`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${ui.muted}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Product Stats & Top Selling Product */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Product Inventory Stats */}
            <div className={`${ui.surface} ${ui.surfacePadding} ${ui.surfaceHover}`}>
              <h3 className={`text-lg font-semibold ${ui.text} mb-4`}>
                Product Inventory
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {productStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3.5 rounded-xl bg-white border border-[var(--secondary-soft-highlight)]/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className={`text-lg font-semibold ${ui.text} mb-0.5`}>
                          {stat.value}
                        </div>
                        <div className={`text-xs ${ui.muted}`}>{stat.label}</div>
                      </div>
                      <div
                        aria-hidden="true"
                        className={`h-9 w-9 rounded-full border border-[var(--secondary-soft-highlight)]/28 ${stat.accent}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Product */}
            <div className={`${ui.surface} ${ui.surfacePadding} ${ui.surfaceHover}`}>
              <h3 className={`text-lg font-semibold ${ui.text} mb-4`}>
                Top Selling Product
              </h3>
              {dashboardMetrics?.top_selling_product ? (
                <div className="p-4 bg-white border border-[var(--secondary-soft-highlight)]/30 rounded-xl">
                  <div className={`font-semibold ${ui.text} mb-2`}>
                    {dashboardMetrics.top_selling_product.name}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className={`${ui.muted}`}>
                        Quantity Sold
                      </div>
                      <div className={`font-medium ${ui.text}`}>
                        {dashboardMetrics.top_selling_product.quantity_sold}
                      </div>
                    </div>
                    <div>
                      <div className={`${ui.muted}`}>
                        Revenue
                      </div>
                      <div className={`font-medium ${ui.text}`}>
                        {formatCurrency(
                          dashboardMetrics.top_selling_product.revenue,
                          dashboardMetrics.currency
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`text-center py-10 ${ui.muted}`}>
                  No sales data available
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Over Time Chart */}
            <div className={`${ui.surface} ${ui.chartSurfacePadding} ${ui.surfaceHover}`}>
              <h3 className={`text-lg font-semibold ${ui.text} mb-4`}>
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
                        border: "1px solid rgba(192, 209, 199, 0.55)",
                        borderRadius: "12px",
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
                <div className="h-[300px] flex flex-col items-center justify-center rounded-xl bg-white border border-dashed border-[var(--secondary-soft-highlight)]/55">
                  <p className={`text-sm font-medium ${ui.muted}`}>
                    No revenue data yet
                  </p>
                  <p className={`text-xs mt-1 ${ui.subtle}`}>
                    Once you start selling, trends will show here.
                  </p>
                </div>
              )}
            </div>

            {/* Orders Over Time Chart */}
            <div className={`${ui.surface} ${ui.chartSurfacePadding} ${ui.surfaceHover}`}>
              <h3 className={`text-lg font-semibold ${ui.text} mb-4`}>
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
                        border: "1px solid rgba(192, 209, 199, 0.55)",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar
                      dataKey="orders_count"
                      fill="#407178"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center rounded-xl bg-white border border-dashed border-[var(--secondary-soft-highlight)]/55">
                  <p className={`text-sm font-medium ${ui.muted}`}>
                    No orders in this period
                  </p>
                  <p className={`text-xs mt-1 ${ui.subtle}`}>
                    Orders will appear here as they come in.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products Chart */}
          <div className={`mt-6 ${ui.surface} ${ui.chartSurfacePadding} ${ui.surfaceHover}`}>
            <h3 className={`text-lg font-semibold ${ui.text} mb-4`}>
              Top Products by Revenue
            </h3>
            {salesAnalytics?.top_products &&
            salesAnalytics.top_products.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={salesAnalytics.top_products.slice(0, 10).map((p) => ({
                    name: p.product_name,
                    revenue: p.revenue,
                  }))}
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
                      border: "1px solid rgba(192, 209, 199, 0.55)",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#407178" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center rounded-xl bg-white border border-dashed border-[var(--secondary-soft-highlight)]/55">
                <p className={`text-sm font-medium ${ui.muted}`}>
                  No product revenue yet
                </p>
                <p className={`text-xs mt-1 ${ui.subtle}`}>
                  Top products will surface once sales come in.
                </p>
              </div>
            )}
          </div>

          {/* Period Info */}
          {dashboardMetrics && (
            <div className={`mt-6 text-center text-sm ${ui.muted}`}>
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
