"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ChartBarIcon,
  BeakerIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type ViewMode = "calendar" | "analytics";

export default function ProductionPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedCrop, setSelectedCrop] = useState<string>("all");

  // Mock production data
  const productionCycles = [
    {
      id: "1",
      vendor: "Green Valley Farms",
      vendorId: "1",
      crop: "Tomatoes",
      variety: "Roma",
      acreage: 60,
      datePlanted: "2024-08-15",
      expectedHarvest: "2024-11-15",
      actualHarvest: null,
      expectedAmount: "15,000 kg",
      actualAmount: null,
      status: "growing",
      progress: 65,
    },
    {
      id: "2",
      vendor: "Sunrise Agricultural Co.",
      vendorId: "2",
      crop: "Lettuce",
      variety: "Iceberg",
      acreage: 40,
      datePlanted: "2024-09-01",
      expectedHarvest: "2024-10-30",
      actualHarvest: null,
      expectedAmount: "8,000 kg",
      actualAmount: null,
      status: "growing",
      progress: 45,
    },
    {
      id: "3",
      vendor: "Highland Produce Ltd.",
      vendorId: "3",
      crop: "Peppers",
      variety: "Bell Pepper",
      acreage: 80,
      datePlanted: "2024-07-20",
      expectedHarvest: "2024-10-20",
      actualHarvest: "2024-10-18",
      expectedAmount: "20,000 kg",
      actualAmount: "19,500 kg",
      status: "harvested",
      progress: 100,
    },
    {
      id: "4",
      vendor: "Coastal Farms Group",
      vendorId: "4",
      crop: "Sweet Potato",
      variety: "Orange",
      acreage: 120,
      datePlanted: "2024-06-10",
      expectedHarvest: "2024-10-10",
      actualHarvest: "2024-10-12",
      expectedAmount: "30,000 kg",
      actualAmount: "31,200 kg",
      status: "harvested",
      progress: 100,
    },
    {
      id: "5",
      vendor: "Mountain Fresh Produce",
      vendorId: "5",
      crop: "Bananas",
      variety: "Cavendish",
      acreage: 70,
      datePlanted: "2024-05-01",
      expectedHarvest: "2024-11-01",
      actualHarvest: null,
      expectedAmount: "25,000 kg",
      actualAmount: null,
      status: "growing",
      progress: 80,
    },
  ];

  const cropAnalytics = [
    {
      crop: "Tomatoes",
      totalAcreage: 180,
      vendors: 8,
      expectedYield: "45,000 kg",
      actualYield: "43,200 kg",
      efficiency: 96,
      avgGrowthPeriod: "90 days",
    },
    {
      crop: "Lettuce",
      totalAcreage: 120,
      vendors: 6,
      expectedYield: "24,000 kg",
      actualYield: "23,500 kg",
      efficiency: 98,
      avgGrowthPeriod: "60 days",
    },
    {
      crop: "Peppers",
      totalAcreage: 200,
      vendors: 10,
      expectedYield: "50,000 kg",
      actualYield: "48,900 kg",
      efficiency: 98,
      avgGrowthPeriod: "85 days",
    },
    {
      crop: "Sweet Potato",
      totalAcreage: 280,
      vendors: 12,
      expectedYield: "70,000 kg",
      actualYield: "72,100 kg",
      efficiency: 103,
      avgGrowthPeriod: "120 days",
    },
  ];

  const chemicalUsage = [
    {
      chemical: "NPK Fertilizer",
      totalUsage: "2,500 kg",
      farms: 45,
      avgDose: "50 kg/acre",
      compliance: "100%",
    },
    {
      chemical: "Organic Pesticide",
      totalUsage: "800 L",
      farms: 32,
      avgDose: "2 L/acre",
      compliance: "100%",
    },
    {
      chemical: "Fungicide",
      totalUsage: "450 L",
      farms: 28,
      avgDose: "1.5 L/acre",
      compliance: "96%",
    },
  ];

  const filteredProduction = productionCycles.filter(
    (cycle) => selectedCrop === "all" || cycle.crop === selectedCrop
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "growing":
        return {
          label: "Growing",
          color:
            "bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)]",
        };
      case "harvested":
        return {
          label: "Harvested",
          color: "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]",
        };
      case "processing":
        return {
          label: "Processing",
          color: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const nextMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1)
    );
  };

  const prevMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1)
    );
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              Production Tracking
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
              Monitor planting schedules, harvest dates, and crop analytics
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-full border border-[color:var(--secondary-soft-highlight)] bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                viewMode === "calendar"
                  ? "bg-[var(--secondary-highlight2)] text-white shadow-md"
                  : "text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] hover:bg-gray-50"
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode("analytics")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                viewMode === "analytics"
                  ? "bg-[var(--secondary-highlight2)] text-white shadow-md"
                  : "text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] hover:bg-gray-50"
              }`}
            >
              <ChartBarIcon className="h-4 w-4" />
              Analytics
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="space-y-6">
            {/* Month Navigation */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                </button>
                <h2 className="text-xl font-semibold text-[color:var(--secondary-black)]">
                  {monthNames[selectedMonth.getMonth()]}{" "}
                  {selectedMonth.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronRightIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-[color:var(--secondary-black)]">
                  Filter by Crop:
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="px-5 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md bg-white"
                >
                  <option value="all">All Crops</option>
                  {[
                    ...new Set(productionCycles.map((cycle) => cycle.crop)),
                  ].map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Production Timeline */}
            <div className="space-y-4">
              {filteredProduction.map((cycle) => {
                const statusConfig = getStatusConfig(cycle.status);
                return (
                  <div
                    key={cycle.id}
                    className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/government/vendors/${cycle.vendorId}`}
                            className="text-lg font-semibold text-[color:var(--secondary-black)] hover:text-[var(--secondary-highlight2)] transition-colors duration-200"
                          >
                            {cycle.vendor}
                          </Link>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                          {cycle.crop} - {cycle.variety} · {cycle.acreage} acres
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                          Date Planted
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[color:var(--secondary-black)]">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(cycle.datePlanted).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                          Expected Harvest
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[color:var(--secondary-black)]">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(cycle.expectedHarvest).toLocaleDateString()}
                        </div>
                      </div>
                      {cycle.actualHarvest && (
                        <div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                            Actual Harvest
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[color:var(--primary-base)]">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(cycle.actualHarvest).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {cycle.status === "growing" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[color:var(--secondary-muted-edge)]">
                            Growth Progress
                          </span>
                          <span className="text-xs font-medium text-[color:var(--secondary-black)]">
                            {cycle.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--primary-base)] rounded-full transition-all"
                            style={{ width: `${cycle.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Yield Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[color:var(--secondary-soft-highlight)]">
                      <div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                          Expected Amount
                        </div>
                        <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                          {cycle.expectedAmount}
                        </div>
                      </div>
                      {cycle.actualAmount && (
                        <div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                            Actual Amount
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-[color:var(--primary-base)]">
                              {cycle.actualAmount}
                            </div>
                            {parseFloat(cycle.actualAmount) >
                              parseFloat(cycle.expectedAmount) && (
                              <ArrowTrendingUpIcon className="h-4 w-4 text-[color:var(--primary-base)]" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {viewMode === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Crop Analytics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Crop Performance */}
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
                <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                  <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                    Crop Performance Analytics
                  </h2>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                    Efficiency and yield analysis by crop type
                  </p>
                </div>
                <div className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                  {cropAnalytics.map((crop) => (
                    <div key={crop.crop} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                            {crop.crop}
                          </h3>
                          <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                            {crop.vendors} vendors · {crop.totalAcreage} acres
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            crop.efficiency >= 100
                              ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                              : crop.efficiency >= 95
                              ? "bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)]"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {crop.efficiency}% Efficiency
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                            Expected Yield
                          </div>
                          <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                            {crop.expectedYield}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                            Actual Yield
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              crop.efficiency >= 100
                                ? "text-[color:var(--primary-base)]"
                                : "text-[color:var(--secondary-black)]"
                            }`}
                          >
                            {crop.actualYield}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                            Avg Growth Period
                          </div>
                          <div className="text-sm text-[color:var(--secondary-black)]">
                            {crop.avgGrowthPeriod}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chemical Usage Summary */}
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
                <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                        Chemical Usage Summary
                      </h2>
                      <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                        Agricultural inputs and compliance
                      </p>
                    </div>
                    <Link
                      href="/government/reporting?type=chemical-usage"
                      className="text-xs text-[color:var(--secondary-highlight2)] hover:text-[color:var(--primary-accent3)] font-medium transition-colors duration-200"
                    >
                      View Full Report →
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-[color:var(--secondary-soft-highlight)]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                          Chemical
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                          Total Usage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                          Farms
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                          Avg Dose
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                          Compliance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                      {chemicalUsage.map((chem) => (
                        <tr
                          key={chem.chemical}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-[color:var(--secondary-black)]">
                            <div className="flex items-center gap-2">
                              <BeakerIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                              {chem.chemical}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[color:var(--secondary-black)]">
                            {chem.totalUsage}
                          </td>
                          <td className="px-6 py-4 text-sm text-[color:var(--secondary-black)]">
                            {chem.farms}
                          </td>
                          <td className="px-6 py-4 text-sm text-[color:var(--secondary-black)]">
                            {chem.avgDose}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                chem.compliance === "100%"
                                  ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {chem.compliance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Summary Stats */}
            <div className="space-y-6">
              {/* Production Summary */}
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
                <h3 className="text-base font-semibold text-[color:var(--secondary-black)] mb-4">
                  Production Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                      Active Cycles
                    </div>
                    <div className="text-2xl font-semibold text-[color:var(--secondary-black)]">
                      {
                        productionCycles.filter((c) => c.status === "growing")
                          .length
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                      Completed This Month
                    </div>
                    <div className="text-2xl font-semibold text-[color:var(--primary-base)]">
                      {
                        productionCycles.filter((c) => c.status === "harvested")
                          .length
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                      Total Acreage in Production
                    </div>
                    <div className="text-2xl font-semibold text-[color:var(--secondary-black)]">
                      {cropAnalytics
                        .reduce((sum, crop) => sum + crop.totalAcreage, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
                <h3 className="text-base font-semibold text-[color:var(--secondary-black)] mb-4">
                  Regional Distribution
                </h3>
                <div className="space-y-3">
                  {[
                    { region: "Kingston", count: 15, color: "bg-blue-500" },
                    {
                      region: "Mandeville",
                      count: 12,
                      color: "bg-green-500",
                    },
                    {
                      region: "St. Elizabeth",
                      count: 18,
                      color: "bg-purple-500",
                    },
                    { region: "Portland", count: 8, color: "bg-orange-500" },
                  ].map((item) => (
                    <div key={item.region}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                          <span className="text-sm text-[color:var(--secondary-black)]">
                            {item.region}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${(item.count / 53) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
                <h3 className="text-base font-semibold text-[color:var(--secondary-black)] mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/government/reporting?type=quarterly-sales"
                    className="block px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium shadow-sm hover:shadow-md"
                  >
                    Generate Production Report
                  </Link>
                  <Link
                    href="/government/vendors"
                    className="block px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium shadow-sm hover:shadow-md"
                  >
                    View All Vendors
                  </Link>
                  <Link
                    href="/government/data"
                    className="block px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium shadow-sm hover:shadow-md"
                  >
                    Export Production Data
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
