"use client";

import React, { useState } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  ArrowPathIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

export default function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock Analytics Data - In production, this would come from API
  const overviewStats = {
    totalSpent: 127543.89,
    totalSpentChange: 12.5,
    orderCount: 248,
    orderCountChange: -3.2,
    avgOrderValue: 514.29,
    avgOrderValueChange: 15.8,
    activeSuppliers: 34,
    activeSuppliersChange: 8.5,
  };

  // Spending over time (last 12 months)
  const spendingTrend = [
    { month: "Jan", amount: 8234 },
    { month: "Feb", amount: 9456 },
    { month: "Mar", amount: 11234 },
    { month: "Apr", amount: 10567 },
    { month: "May", amount: 12890 },
    { month: "Jun", amount: 11234 },
    { month: "Jul", amount: 13456 },
    { month: "Aug", amount: 10234 },
    { month: "Sep", amount: 14567 },
    { month: "Oct", amount: 12890 },
    { month: "Nov", amount: 11234 },
    { month: "Dec", amount: 11547 },
  ];

  // Category breakdown
  const categoryBreakdown = [
    { category: "Vegetables", amount: 45234, percentage: 35, color: "#407178" },
    { category: "Fruits", amount: 32145, percentage: 25, color: "#CB5927" },
    { category: "Herbs", amount: 19234, percentage: 15, color: "#6C715D" },
    { category: "Root Crops", amount: 16345, percentage: 13, color: "#8B7355" },
    { category: "Grains", amount: 12345, percentage: 10, color: "#5A6C57" },
    { category: "Other", amount: 2240, percentage: 2, color: "#9CA3AF" },
  ];

  // Top suppliers by spend
  const topSuppliers = [
    {
      name: "Caribbean Farms Co.",
      amount: 23456,
      orders: 45,
      avgDeliveryTime: "2.3 days",
      rating: 4.8,
    },
    {
      name: "Tropical Harvest Ltd",
      amount: 19234,
      orders: 38,
      avgDeliveryTime: "1.8 days",
      rating: 4.9,
    },
    {
      name: "Island Fresh Produce",
      amount: 16345,
      orders: 32,
      avgDeliveryTime: "3.1 days",
      rating: 4.7,
    },
    {
      name: "Green Valley Cooperative",
      amount: 12890,
      orders: 28,
      avgDeliveryTime: "2.7 days",
      rating: 4.6,
    },
    {
      name: "Spice Island Farms",
      amount: 11234,
      orders: 24,
      avgDeliveryTime: "2.2 days",
      rating: 4.9,
    },
  ];

  // Team member activity
  const teamActivity = [
    {
      name: "Sarah Johnson",
      role: "Procurement Manager",
      orders: 87,
      amount: 45234,
      avgOrderValue: 520,
    },
    {
      name: "Michael Chen",
      role: "Kitchen Manager",
      orders: 64,
      amount: 32145,
      avgOrderValue: 502,
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Lead",
      orders: 52,
      amount: 28456,
      avgOrderValue: 547,
    },
    {
      name: "James Wilson",
      role: "Assistant Manager",
      orders: 45,
      amount: 21708,
      avgOrderValue: 482,
    },
  ];

  // Spending by location
  const locationSpending = [
    { location: "Kingston, Jamaica", amount: 38456, percentage: 30 },
    { location: "Santo Domingo, DR", amount: 32145, percentage: 25 },
    { location: "Port of Spain, Trinidad", amount: 25678, percentage: 20 },
    { location: "Bridgetown, Barbados", amount: 19234, percentage: 15 },
    { location: "Other Locations", amount: 12030, percentage: 10 },
  ];

  // Order timing analysis
  const orderTiming = [
    { day: "Monday", count: 42, avgValue: 532 },
    { day: "Tuesday", count: 38, avgValue: 498 },
    { day: "Wednesday", count: 35, avgValue: 521 },
    { day: "Thursday", count: 39, avgValue: 545 },
    { day: "Friday", count: 44, avgValue: 502 },
    { day: "Saturday", count: 28, avgValue: 478 },
    { day: "Sunday", count: 22, avgValue: 456 },
  ];

  const maxSpending = Math.max(...spendingTrend.map((d) => d.amount));
  const maxOrderCount = Math.max(...orderTiming.map((d) => d.count));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--secondary-black)]">
                Procurement Analytics
              </h1>
              <p className="text-[var(--secondary-muted-edge)] mt-1">
                Gain insights into your purchasing patterns and make data-driven
                business decisions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[var(--secondary-black)] focus:outline-none focus:border-[var(--primary-accent2)]"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-lg font-medium">
                <ArrowPathIcon className="h-5 w-5" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Spent */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  overviewStats.totalSpentChange > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {overviewStats.totalSpentChange > 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {formatPercentage(overviewStats.totalSpentChange)}
              </div>
            </div>
            <div className="text-2xl font-semibold text-[var(--secondary-black)] mb-1">
              {formatCurrency(overviewStats.totalSpent)}
            </div>
            <div className="text-sm text-[var(--secondary-muted-edge)]">
              Total Spent
            </div>
          </div>

          {/* Order Count */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  overviewStats.orderCountChange > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {overviewStats.orderCountChange > 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {formatPercentage(overviewStats.orderCountChange)}
              </div>
            </div>
            <div className="text-2xl font-semibold text-[var(--secondary-black)] mb-1">
              {overviewStats.orderCount}
            </div>
            <div className="text-sm text-[var(--secondary-muted-edge)]">
              Total Orders
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-[var(--primary-accent2)]/10 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  overviewStats.avgOrderValueChange > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {overviewStats.avgOrderValueChange > 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {formatPercentage(overviewStats.avgOrderValueChange)}
              </div>
            </div>
            <div className="text-2xl font-semibold text-[var(--secondary-black)] mb-1">
              {formatCurrency(overviewStats.avgOrderValue)}
            </div>
            <div className="text-sm text-[var(--secondary-muted-edge)]">
              Avg. Order Value
            </div>
          </div>

          {/* Active Suppliers */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-purple-50 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  overviewStats.activeSuppliersChange > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {overviewStats.activeSuppliersChange > 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {formatPercentage(overviewStats.activeSuppliersChange)}
              </div>
            </div>
            <div className="text-2xl font-semibold text-[var(--secondary-black)] mb-1">
              {overviewStats.activeSuppliers}
            </div>
            <div className="text-sm text-[var(--secondary-muted-edge)]">
              Active Suppliers
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spending Trend Chart */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                    Spending Trend
                  </h2>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                    Monthly spending over the last year
                  </p>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[var(--secondary-black)] focus:outline-none focus:border-[var(--primary-accent2)]"
                >
                  <option value="all">All Categories</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="herbs">Herbs</option>
                </select>
              </div>

              {/* Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-2">
                {spendingTrend.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full flex flex-col items-center">
                      <div className="relative group w-full">
                        <div
                          className="bg-[var(--primary-accent2)] rounded-t"
                          style={{
                            height: `${(data.amount / maxSpending) * 200}px`,
                            minHeight: "20px",
                          }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap">
                            <div className="font-semibold">
                              {formatCurrency(data.amount)}
                            </div>
                            <div className="text-gray-300 mt-0.5">
                              {data.month}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[var(--secondary-muted-edge)] mt-2">
                      {data.month}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                Spending by Category
              </h2>

              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-[var(--secondary-black)]">
                          {category.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-[var(--secondary-black)]">
                          {formatCurrency(category.amount)}
                        </span>
                        <span className="text-sm text-[var(--secondary-muted-edge)] w-12 text-right">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Suppliers */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                Top Suppliers by Spend
              </h2>

              <div className="space-y-3">
                {topSuppliers.map((supplier, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary-accent2)] text-white font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--secondary-black)]">
                          {supplier.name}
                        </div>
                        <div className="text-sm text-[var(--secondary-muted-edge)] flex items-center gap-3 mt-1">
                          <span>{supplier.orders} orders</span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {supplier.avgDeliveryTime}
                          </span>
                          <span className="text-yellow-600">
                            ★ {supplier.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[var(--secondary-black)]">
                        {formatCurrency(supplier.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Team Activity */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                Team Activity
              </h2>

              <div className="space-y-4">
                {teamActivity.map((member, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--primary-accent2)] flex items-center justify-center text-white font-semibold text-sm">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-[var(--secondary-black)]">
                          {member.name}
                        </div>
                        <div className="text-xs text-[var(--secondary-muted-edge)] mt-0.5">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2.5 rounded-lg">
                        <div className="text-[var(--secondary-muted-edge)] mb-1">
                          Orders
                        </div>
                        <div className="font-semibold text-sm text-[var(--secondary-black)]">
                          {member.orders}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-lg">
                        <div className="text-[var(--secondary-muted-edge)] mb-1">
                          Spent
                        </div>
                        <div className="font-semibold text-sm text-[var(--secondary-black)]">
                          {formatCurrency(member.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Spending */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                Spending by Location
              </h2>

              <div className="space-y-3">
                {locationSpending.map((location, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                        <span className="text-sm font-medium text-[var(--secondary-black)]">
                          {location.location}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--secondary-black)]">
                        {formatCurrency(location.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-[var(--primary-accent2)]"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timing */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                Order Timing Insights
              </h2>

              <div className="space-y-3">
                {orderTiming.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-[var(--secondary-black)] w-20">
                        {day.day}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[var(--primary-accent2)]"
                          style={{
                            width: `${(day.count / maxOrderCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[var(--secondary-black)] ml-3">
                      {day.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200">
                <div className="text-sm text-[var(--secondary-muted-edge)]">
                  <strong className="text-[var(--secondary-black)]">
                    Peak Days:
                  </strong>{" "}
                  Most orders placed on Mondays and Fridays
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[var(--primary-accent2)] rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full py-2.5 bg-white/20 rounded-lg text-sm font-medium">
                  Export Report (PDF)
                </button>
                <button className="w-full py-2.5 bg-white/20 rounded-lg text-sm font-medium">
                  Download Data (CSV)
                </button>
                <button className="w-full py-2.5 bg-white/20 rounded-lg text-sm font-medium">
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
