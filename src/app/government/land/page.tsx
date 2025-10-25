"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPinIcon,
  MapIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchVendors,
  selectVendors,
  selectVendorsStatus,
} from "@/store/slices/governmentVendorsSlice";
import { safeNumber, safeArray, safePercentage } from "@/lib/utils/dataHelpers";
import LandMap from "@/components/maps/LandMap";

export default function LandManagementPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterUtilization, setFilterUtilization] = useState<string>("all");

  // Redux state
  const vendors = useAppSelector(selectVendors);
  const vendorsStatus = useAppSelector(selectVendorsStatus);

  // Fetch vendors on mount
  useEffect(() => {
    if (vendorsStatus === "idle") {
      dispatch(fetchVendors({ page: 1, limit: 100 }));
    }
  }, [vendorsStatus, dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchVendors({ page: 1, limit: 100 }));
  };

  // Mock land data for fallback
  const mockLandData = [
    {
      vendor: "Green Valley Farms",
      vendorId: "1",
      region: "St. George's",
      gps: { lat: 12.0561, lng: -61.7516 },
      total_acreage: 250,
      utilized_acreage: 180,
      available_acreage: 70,
      utilization_rate: 72,
      crops: ["Tomatoes", "Lettuce", "Peppers"],
    },
    {
      vendor: "Sunrise Agricultural Co.",
      vendorId: "2",
      region: "Grenville",
      gps: { lat: 12.1167, lng: -61.6167 },
      total_acreage: 420,
      utilized_acreage: 350,
      available_acreage: 70,
      utilization_rate: 83,
      crops: ["Coffee", "Plantains", "Yams"],
    },
    {
      vendor: "Highland Produce Ltd.",
      vendorId: "3",
      region: "Gouyave",
      gps: { lat: 12.1667, lng: -61.7333 },
      total_acreage: 180,
      utilized_acreage: 180,
      available_acreage: 0,
      utilization_rate: 100,
      crops: ["Carrots", "Cabbage", "Scallions"],
    },
    {
      vendor: "Coastal Farms Group",
      vendorId: "4",
      region: "Sauteurs",
      gps: { lat: 12.2167, lng: -61.6333 },
      total_acreage: 520,
      utilized_acreage: 380,
      available_acreage: 140,
      utilization_rate: 73,
      crops: ["Sweet Potato", "Pumpkin", "Watermelon"],
    },
    {
      vendor: "Mountain Fresh Produce",
      vendorId: "5",
      region: "Victoria",
      gps: { lat: 12.1833, lng: -61.7 },
      total_acreage: 95,
      utilized_acreage: 70,
      available_acreage: 25,
      utilization_rate: 74,
      crops: ["Bananas", "Breadfruit", "Nutmeg"],
    },
  ];

  // Convert vendors to land data format with safe number handling
  const landDataFromVendors = useMemo(() => {
    return vendors.map((vendor) => {
      const totalAcreage = safeNumber(vendor.total_acreage);
      const utilizedAcreage = safeNumber(vendor.utilized_acreage);
      const availableAcreage = safeNumber(vendor.available_acreage);

      return {
        vendor: vendor.name || "Unknown Vendor",
        vendorId: vendor.id,
        region: vendor.location?.split(",")[0]?.trim() || "Unknown",
        gps: vendor.gps_coordinates || { lat: 0, lng: 0 },
        total_acreage: totalAcreage,
        utilized_acreage: utilizedAcreage,
        available_acreage: availableAcreage,
        utilization_rate: safePercentage(utilizedAcreage, totalAcreage),
        crops: safeArray<string>(vendor.crops),
      };
    });
  }, [vendors]);

  // Use real data or fallback to mock
  const displayLandData =
    landDataFromVendors.length > 0 ? landDataFromVendors : mockLandData;

  // Calculate regional summary from displayLandData
  const regionalSummary = useMemo(() => {
    const regionMap = new Map();

    displayLandData.forEach((item) => {
      const region = item.region;
      if (!regionMap.has(region)) {
        regionMap.set(region, {
          region,
          total_acreage: 0,
          utilized: 0,
          available: 0,
          vendors: 0,
        });
      }

      const summary = regionMap.get(region);
      summary.total_acreage += safeNumber(item.total_acreage);
      summary.utilized += safeNumber(item.utilized_acreage);
      summary.available += safeNumber(item.available_acreage);
      summary.vendors += 1;
    });

    return Array.from(regionMap.values()).map((summary) => ({
      ...summary,
      utilization_rate: safePercentage(summary.utilized, summary.total_acreage),
    }));
  }, [displayLandData]);

  const overallStats = useMemo(() => {
    const totalAcreage = displayLandData.reduce(
      (sum, item) => sum + safeNumber(item.total_acreage),
      0
    );
    const totalUtilized = displayLandData.reduce(
      (sum, item) => sum + safeNumber(item.utilized_acreage),
      0
    );
    const totalAvailable = displayLandData.reduce(
      (sum, item) => sum + safeNumber(item.available_acreage),
      0
    );

    return {
      totalAcreage,
      totalUtilized,
      totalAvailable,
      avgUtilization: safePercentage(totalUtilized, totalAcreage),
    };
  }, [displayLandData]);

  const filteredLandData = useMemo(() => {
    return displayLandData.filter((item) => {
      const matchesRegion =
        filterRegion === "all" || item.region.includes(filterRegion);
      const matchesUtilization =
        filterUtilization === "all" ||
        (filterUtilization === "high" && item.utilization_rate >= 80) ||
        (filterUtilization === "medium" &&
          item.utilization_rate >= 60 &&
          item.utilization_rate < 80) ||
        (filterUtilization === "low" && item.utilization_rate < 60);
      return matchesRegion && matchesUtilization;
    });
  }, [displayLandData, filterRegion, filterUtilization]);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              Land Management
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
              Monitor land utilization, availability, and geographic
              distribution
              {vendorsStatus === "loading" && " • Loading..."}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={vendorsStatus === "loading"}
            className="inline-flex items-center gap-2 rounded-full bg-white border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${
                vendorsStatus === "loading" ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Total Acreage
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {vendorsStatus === "loading"
                ? "..."
                : overallStats.totalAcreage.toLocaleString()}
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
              {vendorsStatus === "loading"
                ? "..."
                : overallStats.totalUtilized.toLocaleString()}
            </div>
            <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
              {vendorsStatus === "loading"
                ? "..."
                : `${overallStats.avgUtilization.toFixed(1)}% of total`}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Available
            </div>
            <div className="text-3xl font-semibold text-[color:var(--primary-accent2)]">
              {vendorsStatus === "loading"
                ? "..."
                : overallStats.totalAvailable.toLocaleString()}
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
            {/* Interactive Map */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                Geographic Distribution
              </h2>
              <LandMap
                vendors={filteredLandData}
                onVendorClick={(vendorId) =>
                  router.push(`/government/vendors/${vendorId}`)
                }
              />
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
                  {[...new Set(displayLandData.map((item) => item.region))].map(
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
                        item.utilization_rate >= 80
                          ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                          : item.utilization_rate >= 60
                          ? "bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)]"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.utilization_rate}% utilized
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                        Total
                      </div>
                      <div className="text-xl font-semibold text-[color:var(--secondary-black)]">
                        {item.total_acreage}
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
                        {item.utilized_acreage}
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
                        {item.available_acreage}
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
                        style={{ width: `${item.utilization_rate}%` }}
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
                        {region.utilization_rate}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      <div>
                        <div className="text-[color:var(--secondary-muted-edge)]">
                          Total
                        </div>
                        <div className="font-medium text-[color:var(--secondary-black)]">
                          {region.total_acreage.toLocaleString()}
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
                        style={{ width: `${region.utilization_rate}%` }}
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
                      displayLandData.filter(
                        (item) => item.utilization_rate >= 80
                      ).length
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
                      displayLandData.filter(
                        (item) =>
                          item.utilization_rate >= 60 &&
                          item.utilization_rate < 80
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
                      displayLandData.filter(
                        (item) => item.utilization_rate < 60
                      ).length
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
