"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPinIcon,
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
import {
  GOV,
  govCard,
  govCardPadded,
  govSectionHeader,
  govKpiLabel,
  govKpiValue,
  govKpiSub,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govHoverBg,
} from "../styles";

/* ── utilization-rate colour helpers ─────────────────────────────────────── */

const utilizationPill = (
  rate: number
): { bg: string; color: string } => {
  if (rate >= 80) return { bg: GOV.successBg, color: GOV.success };
  if (rate >= 60) return { bg: GOV.warningBg, color: GOV.warning };
  return { bg: "#fef9c3", color: "#854d0e" };
};

/* ── page ────────────────────────────────────────────────────────────────── */

export default function LandManagementPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterUtilization, setFilterUtilization] = useState<string>("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

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

  /* ── shared inline fragments ──────────────────────────────────────────── */

  const selectStyle: React.CSSProperties = {
    flex: 1,
    padding: "9px 14px",
    borderRadius: 8,
    border: `1px solid ${GOV.border}`,
    fontSize: 13,
    fontWeight: 500,
    color: GOV.text,
    background: GOV.cardBg,
    outline: "none",
    fontFamily: "inherit",
  };

  const progressTrack: React.CSSProperties = {
    height: 6,
    background: GOV.border,
    borderRadius: 99,
    overflow: "hidden",
  };

  const progressFill = (pct: number): React.CSSProperties => ({
    height: "100%",
    width: `${pct}%`,
    background: GOV.brand,
    borderRadius: 99,
    transition: "width .3s ease",
  });

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={govPageTitle}>Land Management</h1>
            <p style={govPageSubtitle}>
              Monitor land utilization, availability, and geographic distribution
              {vendorsStatus === "loading" && " \u00b7 Loading..."}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={vendorsStatus === "loading"}
            style={{
              ...govPillButton,
              opacity: vendorsStatus === "loading" ? 0.5 : 1,
              cursor:
                vendorsStatus === "loading" ? "not-allowed" : "pointer",
            }}
          >
            <ArrowPathIcon
              style={{
                width: 18,
                height: 18,
                animation:
                  vendorsStatus === "loading"
                    ? "spin 1s linear infinite"
                    : "none",
              }}
            />
            Refresh
          </button>
        </div>

        {/* ── KPI row ────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {/* Total Acreage */}
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Acreage</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>
              {vendorsStatus === "loading"
                ? "..."
                : overallStats.totalAcreage.toLocaleString()}
            </div>
            <div style={govKpiSub}>across all vendors</div>
          </div>

          {/* Utilized */}
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Utilized</div>
            <div style={{ ...govKpiValue, marginTop: 6, color: GOV.brand }}>
              {vendorsStatus === "loading"
                ? "..."
                : overallStats.totalUtilized.toLocaleString()}
            </div>
            <div style={govKpiSub}>
              {vendorsStatus === "loading"
                ? "..."
                : `${overallStats.avgUtilization.toFixed(1)}% of total`}
            </div>
          </div>

          {/* Available */}
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Available</div>
            <div style={{ ...govKpiValue, marginTop: 6, color: GOV.accent }}>
              {vendorsStatus === "loading"
                ? "..."
                : overallStats.totalAvailable.toLocaleString()}
            </div>
            <div style={govKpiSub}>ready for cultivation</div>
          </div>

          {/* Avg Utilization */}
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Avg Utilization</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
              }}
            >
              <span style={govKpiValue}>
                {overallStats.avgUtilization.toFixed(1)}%
              </span>
              <ArrowTrendingUpIcon
                style={{ width: 22, height: 22, color: GOV.brand }}
              />
            </div>
          </div>
        </div>

        {/* ── Main grid: 2-col left + sidebar right ─────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
          }}
        >
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Map */}
            <div style={{ ...govCard, padding: 20 }}>
              <h2 style={{ ...govSectionHeader, marginBottom: 14 }}>
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
            <div style={{ ...govCard, padding: "14px 20px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <FunnelIcon
                  style={{ width: 18, height: 18, color: GOV.muted }}
                />
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  style={selectStyle}
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
                  style={selectStyle}
                >
                  <option value="all">All Utilization Rates</option>
                  <option value="high">High (80%+)</option>
                  <option value="medium">Medium (60-80%)</option>
                  <option value="low">Low (&lt;60%)</option>
                </select>
              </div>
            </div>

            {/* Vendor Land Cards */}
            {filteredLandData.map((item) => {
              const pill = utilizationPill(item.utilization_rate);
              const isHovered = hoveredCard === item.vendorId;

              return (
                <div
                  key={item.vendorId}
                  style={{
                    ...govCard,
                    padding: 20,
                    background: isHovered ? govHoverBg : GOV.cardBg,
                    transition: "background .15s ease",
                  }}
                  onMouseEnter={() => setHoveredCard(item.vendorId)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* top row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Link
                        href={`/government/vendors/${item.vendorId}`}
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: GOV.text,
                          textDecoration: "none",
                        }}
                      >
                        {item.vendor}
                      </Link>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: GOV.muted,
                          marginTop: 4,
                        }}
                      >
                        <MapPinIcon style={{ width: 14, height: 14 }} />
                        {item.region} &middot; {item.gps.lat}, {item.gps.lng}
                      </div>
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 700,
                        background: pill.bg,
                        color: pill.color,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.utilization_rate}% utilized
                    </span>
                  </div>

                  {/* 3-col stats */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div style={govKpiLabel}>Total</div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: GOV.text,
                          marginTop: 2,
                        }}
                      >
                        {item.total_acreage}
                      </div>
                      <div style={{ fontSize: 11, color: GOV.lightMuted }}>
                        acres
                      </div>
                    </div>
                    <div>
                      <div style={govKpiLabel}>Utilized</div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: GOV.brand,
                          marginTop: 2,
                        }}
                      >
                        {item.utilized_acreage}
                      </div>
                      <div style={{ fontSize: 11, color: GOV.lightMuted }}>
                        acres
                      </div>
                    </div>
                    <div>
                      <div style={govKpiLabel}>Available</div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: GOV.accent,
                          marginTop: 2,
                        }}
                      >
                        {item.available_acreage}
                      </div>
                      <div style={{ fontSize: 11, color: GOV.lightMuted }}>
                        acres
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={progressTrack}>
                      <div style={progressFill(item.utilization_rate)} />
                    </div>
                  </div>

                  {/* Crop tags */}
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                  >
                    {item.crops.map((crop) => (
                      <span
                        key={crop}
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 600,
                          background: GOV.brandLight,
                          color: GOV.brand,
                        }}
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right Column ─────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Regional Summary */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h2 style={govSectionHeader}>Regional Summary</h2>
                <p
                  style={{
                    fontSize: 11.5,
                    color: GOV.muted,
                    marginTop: 2,
                    fontWeight: 500,
                  }}
                >
                  Land distribution by region
                </p>
              </div>
              <div
                style={{
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {regionalSummary.map((region) => {
                  const isHovered = hoveredRegion === region.region;
                  return (
                    <div
                      key={region.region}
                      style={{
                        padding: 14,
                        borderRadius: 8,
                        border: `1px solid ${GOV.border}`,
                        background: isHovered ? govHoverBg : "transparent",
                        transition: "background .15s ease",
                      }}
                      onMouseEnter={() => setHoveredRegion(region.region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: GOV.text,
                              margin: 0,
                            }}
                          >
                            {region.region}
                          </h3>
                          <div
                            style={{
                              fontSize: 11,
                              color: GOV.muted,
                              marginTop: 2,
                            }}
                          >
                            {region.vendors} vendors
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: GOV.brand,
                          }}
                        >
                          {region.utilization_rate}%
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 8,
                          fontSize: 11,
                          marginBottom: 10,
                        }}
                      >
                        <div>
                          <div style={{ color: GOV.muted }}>Total</div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: GOV.text,
                              marginTop: 1,
                            }}
                          >
                            {region.total_acreage.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: GOV.muted }}>Used</div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: GOV.brand,
                              marginTop: 1,
                            }}
                          >
                            {region.utilized.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: GOV.muted }}>Free</div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: GOV.accent,
                              marginTop: 1,
                            }}
                          >
                            {region.available.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div style={progressTrack}>
                        <div style={progressFill(region.utilization_rate)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Land Use Efficiency */}
            <div style={{ ...govCard, padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <ChartPieIcon
                  style={{ width: 18, height: 18, color: GOV.muted }}
                />
                <h3 style={govSectionHeader}>Land Use Efficiency</h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 500, color: GOV.text }}
                  >
                    High Efficiency (&gt;80%)
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: GOV.success,
                    }}
                  >
                    {
                      displayLandData.filter(
                        (item) => item.utilization_rate >= 80
                      ).length
                    }{" "}
                    vendors
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 500, color: GOV.text }}
                  >
                    Medium Efficiency (60-80%)
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: GOV.warning,
                    }}
                  >
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 500, color: GOV.text }}
                  >
                    Low Efficiency (&lt;60%)
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#854d0e",
                    }}
                  >
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
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h3 style={govSectionHeader}>Quick Actions</h3>
              </div>
              <div
                style={{
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {[
                  {
                    href: "/government/reporting?type=available-acreage",
                    label: "Generate Acreage Report",
                    key: "report",
                  },
                  {
                    href: "/government/vendors",
                    label: "View All Vendors",
                    key: "vendors",
                  },
                  {
                    href: "/government/data",
                    label: "Export Land Data",
                    key: "export",
                  },
                ].map((action) => (
                  <Link
                    key={action.key}
                    href={action.href}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: GOV.text,
                      textDecoration: "none",
                      background:
                        hoveredAction === action.key
                          ? govHoverBg
                          : "transparent",
                      transition: "background .15s ease",
                    }}
                    onMouseEnter={() => setHoveredAction(action.key)}
                    onMouseLeave={() => setHoveredAction(null)}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
