"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPinIcon,
  MapIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

export default function LandManagementPage() {
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterUtilization, setFilterUtilization] = useState<string>("all");

  // Mock land data
  const landData = [
    {
      vendor: "Green Valley Farms",
      vendorId: "1",
      region: "Kingston",
      gps: { lat: 18.0179, lng: -76.8099 },
      totalAcreage: 250,
      utilizedAcreage: 180,
      availableAcreage: 70,
      utilizationRate: 72,
      crops: ["Tomatoes", "Lettuce", "Peppers"],
    },
    {
      vendor: "Sunrise Agricultural Co.",
      vendorId: "2",
      region: "Mandeville",
      gps: { lat: 18.0368, lng: -77.5034 },
      totalAcreage: 420,
      utilizedAcreage: 350,
      availableAcreage: 70,
      utilizationRate: 83,
      crops: ["Coffee", "Plantains", "Yams"],
    },
    {
      vendor: "Highland Produce Ltd.",
      vendorId: "3",
      region: "Christiana",
      gps: { lat: 18.1833, lng: -77.3167 },
      totalAcreage: 180,
      utilizedAcreage: 180,
      availableAcreage: 0,
      utilizationRate: 100,
      crops: ["Carrots", "Cabbage", "Scallions"],
    },
    {
      vendor: "Coastal Farms Group",
      vendorId: "4",
      region: "St. Elizabeth",
      gps: { lat: 18.0333, lng: -77.8667 },
      totalAcreage: 520,
      utilizedAcreage: 380,
      availableAcreage: 140,
      utilizationRate: 73,
      crops: ["Sweet Potato", "Pumpkin", "Watermelon"],
    },
    {
      vendor: "Mountain Fresh Produce",
      vendorId: "5",
      region: "Portland",
      gps: { lat: 18.1, lng: -76.45 },
      totalAcreage: 95,
      utilizedAcreage: 70,
      availableAcreage: 25,
      utilizationRate: 74,
      crops: ["Bananas", "Breadfruit", "Ackee"],
    },
  ];

  const regionalSummary = [
    {
      region: "Kingston",
      totalAcreage: 1250,
      utilized: 920,
      available: 330,
      vendors: 15,
      utilizationRate: 74,
    },
    {
      region: "Mandeville",
      totalAcreage: 2100,
      utilized: 1680,
      available: 420,
      vendors: 22,
      utilizationRate: 80,
    },
    {
      region: "St. Elizabeth",
      totalAcreage: 3200,
      utilized: 2400,
      available: 800,
      vendors: 28,
      utilizationRate: 75,
    },
    {
      region: "Portland",
      totalAcreage: 890,
      utilized: 620,
      available: 270,
      vendors: 12,
      utilizationRate: 70,
    },
    {
      region: "Christiana",
      totalAcreage: 1450,
      utilized: 1200,
      available: 250,
      vendors: 18,
      utilizationRate: 83,
    },
  ];

  const overallStats = {
    totalAcreage: landData.reduce((sum, item) => sum + item.totalAcreage, 0),
    totalUtilized: landData.reduce(
      (sum, item) => sum + item.utilizedAcreage,
      0
    ),
    totalAvailable: landData.reduce(
      (sum, item) => sum + item.availableAcreage,
      0
    ),
    avgUtilization:
      (landData.reduce((sum, item) => sum + item.utilizedAcreage, 0) /
        landData.reduce((sum, item) => sum + item.totalAcreage, 0)) *
      100,
  };

  const filteredLandData = landData.filter((item) => {
    const matchesRegion =
      filterRegion === "all" || item.region === filterRegion;
    const matchesUtilization =
      filterUtilization === "all" ||
      (filterUtilization === "high" && item.utilizationRate >= 80) ||
      (filterUtilization === "medium" &&
        item.utilizationRate >= 60 &&
        item.utilizationRate < 80) ||
      (filterUtilization === "low" && item.utilizationRate < 60);
    return matchesRegion && matchesUtilization;
  });

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
            Land Management
          </h1>
          <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
            Monitor land utilization, availability, and geographic distribution
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Total Acreage
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {overallStats.totalAcreage.toLocaleString()}
            </div>
            <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
              across all vendors
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Utilized
            </div>
            <div className="text-3xl font-semibold text-[color:var(--primary-base)]">
              {overallStats.totalUtilized.toLocaleString()}
            </div>
            <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
              {overallStats.avgUtilization.toFixed(1)}% of total
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Available
            </div>
            <div className="text-3xl font-semibold text-[color:var(--primary-accent2)]">
              {overallStats.totalAvailable.toLocaleString()}
            </div>
            <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
              ready for cultivation
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Avg Utilization
            </div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
                {overallStats.avgUtilization.toFixed(1)}%
              </div>
              <ArrowTrendingUpIcon className="h-6 w-6 text-[color:var(--primary-base)]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map & Vendor List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                Geographic Distribution
              </h2>
              <div className="h-96 rounded-xl bg-gradient-to-br from-[var(--primary-background)] to-white border border-[color:var(--secondary-soft-highlight)] flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="h-16 w-16 mx-auto text-[color:var(--secondary-muted-edge)] mb-3" />
                  <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                    Interactive map visualization
                  </div>
                  <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                    Showing {landData.length} vendor locations
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <div className="flex items-center gap-4">
                <FunnelIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                >
                  <option value="all">All Regions</option>
                  {[...new Set(landData.map((item) => item.region))].map(
                    (region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    )
                  )}
                </select>
                <select
                  value={filterUtilization}
                  onChange={(e) => setFilterUtilization(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                >
                  <option value="all">All Utilization Rates</option>
                  <option value="high">High (80%+)</option>
                  <option value="medium">Medium (60-80%)</option>
                  <option value="low">Low (&lt;60%)</option>
                </select>
              </div>
            </div>

            {/* Vendor Land List */}
            <div className="space-y-4">
              {filteredLandData.map((item) => (
                <div
                  key={item.vendorId}
                  className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link
                        href={`/government/vendors/${item.vendorId}`}
                        className="text-lg font-semibold text-[color:var(--secondary-black)] hover:text-[var(--primary-accent2)]"
                      >
                        {item.vendor}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                        <MapPinIcon className="h-4 w-4" />
                        {item.region} · {item.gps.lat}, {item.gps.lng}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        item.utilizationRate >= 80
                          ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                          : item.utilizationRate >= 60
                          ? "bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)]"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.utilizationRate}% utilized
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                        Total
                      </div>
                      <div className="text-xl font-semibold text-[color:var(--secondary-black)]">
                        {item.totalAcreage}
                      </div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                        acres
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                        Utilized
                      </div>
                      <div className="text-xl font-semibold text-[color:var(--primary-base)]">
                        {item.utilizedAcreage}
                      </div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                        acres
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                        Available
                      </div>
                      <div className="text-xl font-semibold text-[color:var(--primary-accent2)]">
                        {item.availableAcreage}
                      </div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                        acres
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary-base)] rounded-full transition-all"
                        style={{ width: `${item.utilizationRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Crops */}
                  <div className="flex flex-wrap gap-2">
                    {item.crops.map((crop) => (
                      <span
                        key={crop}
                        className="inline-flex items-center rounded-full bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)] px-3 py-1 text-xs"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Regional Summary */}
          <div className="space-y-6">
            {/* Regional Breakdown */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Regional Summary
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Land distribution by region
                </p>
              </div>
              <div className="p-4 space-y-4">
                {regionalSummary.map((region) => (
                  <div
                    key={region.region}
                    className="p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-sm text-[color:var(--secondary-black)]">
                          {region.region}
                        </h3>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                          {region.vendors} vendors
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[color:var(--primary-base)]">
                        {region.utilizationRate}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      <div>
                        <div className="text-[color:var(--secondary-muted-edge)]">
                          Total
                        </div>
                        <div className="font-medium text-[color:var(--secondary-black)]">
                          {region.totalAcreage.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[color:var(--secondary-muted-edge)]">
                          Used
                        </div>
                        <div className="font-medium text-[color:var(--primary-base)]">
                          {region.utilized.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[color:var(--secondary-muted-edge)]">
                          Free
                        </div>
                        <div className="font-medium text-[color:var(--primary-accent2)]">
                          {region.available.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary-base)] rounded-full"
                        style={{ width: `${region.utilizationRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Land Use Efficiency */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <ChartPieIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                <h3 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Land Use Efficiency
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[color:var(--secondary-black)]">
                    High Efficiency (&gt;80%)
                  </span>
                  <span className="text-sm font-medium text-[color:var(--primary-base)]">
                    {
                      landData.filter((item) => item.utilizationRate >= 80)
                        .length
                    }{" "}
                    vendors
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[color:var(--secondary-black)]">
                    Medium Efficiency (60-80%)
                  </span>
                  <span className="text-sm font-medium text-[color:var(--primary-accent3)]">
                    {
                      landData.filter(
                        (item) =>
                          item.utilizationRate >= 60 &&
                          item.utilizationRate < 80
                      ).length
                    }{" "}
                    vendors
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[color:var(--secondary-black)]">
                    Low Efficiency (&lt;60%)
                  </span>
                  <span className="text-sm font-medium text-yellow-600">
                    {
                      landData.filter((item) => item.utilizationRate < 60)
                        .length
                    }{" "}
                    vendors
                  </span>
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
                  href="/government/reporting?type=available-acreage"
                  className="block px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  Generate Acreage Report
                </Link>
                <Link
                  href="/government/vendors"
                  className="block px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  View All Vendors
                </Link>
                <Link
                  href="/government/data"
                  className="block px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  Export Land Data
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
