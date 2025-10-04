"use client";

import React, { useState } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

export default function AnalyticsClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  // Mock analytics data
  const stats = [
    {
      label: "Total Revenue",
      value: "$24,350",
      change: "+12.5%",
      trend: "up",
      icon: CurrencyDollarIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Total Orders",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBagIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Active Customers",
      value: "89",
      change: "+15.3%",
      trend: "up",
      icon: UserGroupIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Avg Order Value",
      value: "$156",
      change: "-2.4%",
      trend: "down",
      icon: ChartBarIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

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
                {[
                  { key: "7d", label: "7 Days" },
                  { key: "30d", label: "30 Days" },
                  { key: "90d", label: "90 Days" },
                  { key: "1y", label: "1 Year" },
                ].map((period) => (
                  <button
                    key={period.key}
                    onClick={() => setSelectedPeriod(period.key)}
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
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
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

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Revenue Over Time
              </h3>
              <div className="h-64 flex items-center justify-center bg-[var(--primary-background)] rounded-xl">
                <p className="text-[var(--secondary-muted-edge)]">
                  Chart coming soon...
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Top Products
              </h3>
              <div className="h-64 flex items-center justify-center bg-[var(--primary-background)] rounded-xl">
                <p className="text-[var(--secondary-muted-edge)]">
                  Chart coming soon...
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
