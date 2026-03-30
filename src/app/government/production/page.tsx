"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ChartBarIcon,
  BeakerIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProductionStats,
  fetchVendorProduction,
  fetchHarvestSchedule,
  fetchProductionSummary,
  selectProductionStats,
  selectStatsStatus,
  selectVendorProduction,
  selectVendorProductionStatus,
  selectHarvestSchedule,
  selectHarvestScheduleStatus,
  selectProductionSummary,
  selectSummaryStatus,
  selectSelectedPeriod,
  selectSelectedCrop,
  setSelectedPeriod,
  setSelectedCrop,
} from "@/store/slices/governmentProductionSlice";
import {
  GOV,
  govCard,
  govCardPadded,
  govSectionHeader,
  govViewAllLink,
  govKpiLabel,
  govKpiValue,
  govKpiSub,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govStatusPillStyle,
  govStatusLabel,
  govHoverBg,
} from "../styles";

type ViewMode = "calendar" | "analytics";

/* ── Production-specific status pill (growing / harvested / processing) ──── */
const productionStatusPill = (
  status: string
): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    growing: { bg: GOV.warningBg, color: GOV.warning },
    harvested: { bg: GOV.successBg, color: GOV.success },
    processing: { bg: GOV.infoBg, color: GOV.info },
  };
  const s = map[status] ?? { bg: "#f5f1ea", color: GOV.muted };
  return {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 99,
    fontSize: 10.5,
    fontWeight: 700,
    background: s.bg,
    color: s.color,
    whiteSpace: "nowrap",
    textTransform: "capitalize",
  };
};

const productionStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    growing: "Growing",
    harvested: "Harvested",
    processing: "Processing",
  };
  return labels[status] ?? status ?? "Unknown";
};

/* ── Efficiency badge ────────────────────────────────────────────────────── */
const efficiencyPill = (eff: number): React.CSSProperties => {
  let bg: string = GOV.warningBg;
  let color: string = GOV.warning;
  if (eff >= 100) {
    bg = GOV.successBg;
    color = GOV.success;
  } else if (eff >= 95) {
    bg = GOV.warningBg;
    color = GOV.warning;
  }
  return {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 99,
    fontSize: 10.5,
    fontWeight: 700,
    background: bg,
    color,
    whiteSpace: "nowrap",
  };
};

/* ── Compliance badge ────────────────────────────────────────────────────── */
const compliancePill = (compliance: string): React.CSSProperties => {
  const full = compliance === "100%";
  return {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 99,
    fontSize: 10.5,
    fontWeight: 700,
    background: full ? GOV.successBg : GOV.warningBg,
    color: full ? GOV.success : GOV.warning,
    whiteSpace: "nowrap",
  };
};

/* ── Region bar colors ───────────────────────────────────────────────────── */
const regionColors: Record<string, string> = {
  Kingston: "#2d4a3e",
  Mandeville: "#d4783c",
  "St. Elizabeth": "#6a7f73",
  Portland: "#b86230",
};

export default function ProductionPage() {
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [hoveredCycleId, setHoveredCycleId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Redux state
  const stats = useAppSelector(selectProductionStats);
  const statsStatus = useAppSelector(selectStatsStatus);
  const vendorProduction = useAppSelector(selectVendorProduction);
  const vendorProductionStatus = useAppSelector(selectVendorProductionStatus);
  const harvestSchedule = useAppSelector(selectHarvestSchedule);
  const harvestScheduleStatus = useAppSelector(selectHarvestScheduleStatus);
  const summary = useAppSelector(selectProductionSummary);
  const summaryStatus = useAppSelector(selectSummaryStatus);
  const selectedPeriod = useAppSelector(selectSelectedPeriod);
  const selectedCrop = useAppSelector(selectSelectedCrop) || "all";

  // Fetch data on mount
  useEffect(() => {
    if (statsStatus === "idle") {
      dispatch(fetchProductionStats({ period: selectedPeriod }));
    }
    if (vendorProductionStatus === "idle") {
      dispatch(fetchVendorProduction({ page: 1, limit: 50 }));
    }
    if (harvestScheduleStatus === "idle") {
      dispatch(fetchHarvestSchedule());
    }
    if (summaryStatus === "idle") {
      dispatch(fetchProductionSummary({ period: selectedPeriod }));
    }
  }, [
    statsStatus,
    vendorProductionStatus,
    harvestScheduleStatus,
    summaryStatus,
    selectedPeriod,
    dispatch,
  ]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchProductionStats({ period: selectedPeriod }));
    dispatch(fetchVendorProduction({ page: 1, limit: 50 }));
    dispatch(fetchHarvestSchedule());
    dispatch(fetchProductionSummary({ period: selectedPeriod }));
  };

  // Handle period change
  const handlePeriodChange = (
    period: "week" | "month" | "quarter" | "year"
  ) => {
    dispatch(setSelectedPeriod(period));
    dispatch(fetchProductionStats({ period }));
    dispatch(fetchProductionSummary({ period }));
  };

  // Mock production data (fallback)
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

  const isLoading =
    statsStatus === "loading" || vendorProductionStatus === "loading";

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={govPageTitle}>Production Tracking</h1>
            <p style={govPageSubtitle}>
              Monitor planting schedules, harvest dates, and crop analytics
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              style={{
                ...govPillButton,
                padding: "8px 14px",
                opacity: isLoading ? 0.5 : 1,
              }}
              title="Refresh data"
            >
              <ArrowPathIcon
                style={{
                  width: 16,
                  height: 16,
                  color: GOV.muted,
                  animation: isLoading ? "spin 1s linear infinite" : undefined,
                }}
              />
            </button>

            {/* View Mode Toggle */}
            <div
              style={{
                display: "flex",
                background: GOV.cardBg,
                border: `1px solid ${GOV.border}`,
                borderRadius: 999,
                padding: 3,
              }}
            >
              <button
                onClick={() => setViewMode("calendar")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background:
                    viewMode === "calendar" ? GOV.brand : "transparent",
                  color: viewMode === "calendar" ? "#fff" : GOV.muted,
                  transition: "all .15s ease",
                }}
              >
                <CalendarIcon style={{ width: 14, height: 14 }} />
                Calendar
              </button>
              <button
                onClick={() => setViewMode("analytics")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background:
                    viewMode === "analytics" ? GOV.brand : "transparent",
                  color: viewMode === "analytics" ? "#fff" : GOV.muted,
                  transition: "all .15s ease",
                }}
              >
                <ChartBarIcon style={{ width: 14, height: 14 }} />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* ──────────── Calendar View ──────────── */}
        {viewMode === "calendar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Month Navigation */}
            <div style={{ ...govCardPadded, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={prevMonth}
                style={{
                  ...govPillButton,
                  padding: "6px 10px",
                }}
              >
                <ChevronLeftIcon style={{ width: 16, height: 16, color: GOV.muted }} />
              </button>
              <span style={{ fontSize: 16, fontWeight: 700, color: GOV.text }}>
                {monthNames[selectedMonth.getMonth()]}{" "}
                {selectedMonth.getFullYear()}
              </span>
              <button
                onClick={nextMonth}
                style={{
                  ...govPillButton,
                  padding: "6px 10px",
                }}
              >
                <ChevronRightIcon style={{ width: 16, height: 16, color: GOV.muted }} />
              </button>
            </div>

            {/* Filter */}
            <div
              style={{
                ...govCardPadded,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: GOV.text,
                }}
              >
                Filter by Crop:
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => dispatch(setSelectedCrop(e.target.value))}
                style={{
                  padding: "7px 16px",
                  borderRadius: 999,
                  border: `1px solid ${GOV.border}`,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: GOV.text,
                  background: GOV.cardBg,
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
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

            {/* Production Timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredProduction.map((cycle) => (
                <div
                  key={cycle.id}
                  style={{
                    ...govCard,
                    padding: "20px 22px",
                    background:
                      hoveredCycleId === cycle.id ? govHoverBg : GOV.cardBg,
                    transition: "background .15s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={() => setHoveredCycleId(cycle.id)}
                  onMouseLeave={() => setHoveredCycleId(null)}
                >
                  {/* Top row: vendor + status */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Link
                          href={`/government/vendors/${cycle.vendorId}`}
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: GOV.accent,
                            textDecoration: "none",
                          }}
                        >
                          {cycle.vendor}
                        </Link>
                        <span style={productionStatusPill(cycle.status)}>
                          {productionStatusLabel(cycle.status)}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: GOV.muted,
                          marginTop: 3,
                          fontWeight: 500,
                        }}
                      >
                        {cycle.crop} - {cycle.variety} &middot; {cycle.acreage}{" "}
                        acres
                      </div>
                    </div>
                  </div>

                  {/* Timeline dates */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: cycle.actualHarvest
                        ? "1fr 1fr 1fr"
                        : "1fr 1fr",
                      gap: 20,
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div style={govKpiLabel}>Date Planted</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          color: GOV.text,
                          marginTop: 4,
                        }}
                      >
                        <CalendarIcon
                          style={{ width: 14, height: 14, color: GOV.muted }}
                        />
                        {new Date(cycle.datePlanted).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div style={govKpiLabel}>Expected Harvest</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          color: GOV.text,
                          marginTop: 4,
                        }}
                      >
                        <CalendarIcon
                          style={{ width: 14, height: 14, color: GOV.muted }}
                        />
                        {new Date(cycle.expectedHarvest).toLocaleDateString()}
                      </div>
                    </div>
                    {cycle.actualHarvest && (
                      <div>
                        <div style={govKpiLabel}>Actual Harvest</div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            color: GOV.success,
                            marginTop: 4,
                          }}
                        >
                          <CalendarIcon
                            style={{ width: 14, height: 14 }}
                          />
                          {new Date(cycle.actualHarvest).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {cycle.status === "growing" && (
                    <div style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            color: GOV.muted,
                          }}
                        >
                          Growth Progress
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: GOV.text,
                          }}
                        >
                          {cycle.progress}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: GOV.border,
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${cycle.progress}%`,
                            background: GOV.brand,
                            borderRadius: 99,
                            transition: "width .3s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Yield Information */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: cycle.actualAmount
                        ? "1fr 1fr"
                        : "1fr",
                      gap: 16,
                      paddingTop: 14,
                      borderTop: `1px solid ${GOV.border}`,
                    }}
                  >
                    <div>
                      <div style={govKpiLabel}>Expected Amount</div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: GOV.text,
                          marginTop: 3,
                        }}
                      >
                        {cycle.expectedAmount}
                      </div>
                    </div>
                    {cycle.actualAmount && (
                      <div>
                        <div style={govKpiLabel}>Actual Amount</div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 3,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: GOV.success,
                            }}
                          >
                            {cycle.actualAmount}
                          </span>
                          {parseFloat(cycle.actualAmount) >
                            parseFloat(cycle.expectedAmount) && (
                            <ArrowTrendingUpIcon
                              style={{
                                width: 14,
                                height: 14,
                                color: GOV.success,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────── Analytics View ──────────── */}
        {viewMode === "analytics" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 20,
            }}
          >
            {/* Left Column - Crop Analytics */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Crop Performance */}
              <div style={{ ...govCard, overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${GOV.border}`,
                  }}
                >
                  <h2 style={govSectionHeader}>Crop Performance Analytics</h2>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: GOV.muted,
                      fontWeight: 500,
                      marginTop: 2,
                    }}
                  >
                    Efficiency and yield analysis by crop type
                  </p>
                </div>
                <div>
                  {cropAnalytics.map((crop, idx) => (
                    <div
                      key={crop.crop}
                      style={{
                        padding: "18px 20px",
                        borderBottom:
                          idx < cropAnalytics.length - 1
                            ? `1px solid ${GOV.border}`
                            : undefined,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginBottom: 12,
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: GOV.text,
                              margin: 0,
                            }}
                          >
                            {crop.crop}
                          </h3>
                          <div
                            style={{
                              fontSize: 11.5,
                              color: GOV.muted,
                              marginTop: 2,
                              fontWeight: 500,
                            }}
                          >
                            {crop.vendors} vendors &middot; {crop.totalAcreage}{" "}
                            acres
                          </div>
                        </div>
                        <span style={efficiencyPill(crop.efficiency)}>
                          {crop.efficiency}% Efficiency
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 12,
                        }}
                      >
                        <div>
                          <div style={govKpiLabel}>Expected Yield</div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: GOV.text,
                              marginTop: 3,
                            }}
                          >
                            {crop.expectedYield}
                          </div>
                        </div>
                        <div>
                          <div style={govKpiLabel}>Actual Yield</div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color:
                                crop.efficiency >= 100
                                  ? GOV.success
                                  : GOV.text,
                              marginTop: 3,
                            }}
                          >
                            {crop.actualYield}
                          </div>
                        </div>
                        <div>
                          <div style={govKpiLabel}>Avg Growth Period</div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: GOV.text,
                              marginTop: 3,
                            }}
                          >
                            {crop.avgGrowthPeriod}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chemical Usage Summary */}
              <div style={{ ...govCard, overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${GOV.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h2 style={govSectionHeader}>Chemical Usage Summary</h2>
                    <p
                      style={{
                        fontSize: 11.5,
                        color: GOV.muted,
                        fontWeight: 500,
                        marginTop: 2,
                      }}
                    >
                      Agricultural inputs and compliance
                    </p>
                  </div>
                  <Link
                    href="/government/reporting?type=chemical-usage"
                    style={govViewAllLink}
                  >
                    View Full Report →
                  </Link>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 12.5,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: `1px solid ${GOV.border}`,
                          background: GOV.bg,
                        }}
                      >
                        {[
                          "Chemical",
                          "Total Usage",
                          "Farms",
                          "Avg Dose",
                          "Compliance",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              ...govKpiLabel,
                              padding: "10px 20px",
                              textAlign: "left",
                              fontWeight: 700,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {chemicalUsage.map((chem) => (
                        <tr
                          key={chem.chemical}
                          style={{
                            borderBottom: `1px solid ${GOV.border}`,
                            background:
                              hoveredRow === chem.chemical
                                ? govHoverBg
                                : "transparent",
                            transition: "background .12s ease",
                          }}
                          onMouseEnter={() => setHoveredRow(chem.chemical)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td
                            style={{
                              padding: "12px 20px",
                              fontWeight: 600,
                              color: GOV.text,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <BeakerIcon
                                style={{
                                  width: 14,
                                  height: 14,
                                  color: GOV.muted,
                                }}
                              />
                              {chem.chemical}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "12px 20px",
                              color: GOV.text,
                            }}
                          >
                            {chem.totalUsage}
                          </td>
                          <td
                            style={{
                              padding: "12px 20px",
                              color: GOV.text,
                            }}
                          >
                            {chem.farms}
                          </td>
                          <td
                            style={{
                              padding: "12px 20px",
                              color: GOV.text,
                            }}
                          >
                            {chem.avgDose}
                          </td>
                          <td style={{ padding: "12px 20px" }}>
                            <span style={compliancePill(chem.compliance)}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Production Summary */}
              <div style={govCardPadded}>
                <h3 style={{ ...govSectionHeader, marginBottom: 16 }}>
                  Production Summary
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                  }}
                >
                  <div>
                    <div style={govKpiLabel}>Active Cycles</div>
                    <div style={{ ...govKpiValue, marginTop: 4 }}>
                      {
                        productionCycles.filter((c) => c.status === "growing")
                          .length
                      }
                    </div>
                  </div>
                  <div>
                    <div style={govKpiLabel}>Completed This Month</div>
                    <div
                      style={{
                        ...govKpiValue,
                        color: GOV.success,
                        marginTop: 4,
                      }}
                    >
                      {
                        productionCycles.filter((c) => c.status === "harvested")
                          .length
                      }
                    </div>
                  </div>
                  <div>
                    <div style={govKpiLabel}>Total Acreage in Production</div>
                    <div style={{ ...govKpiValue, marginTop: 4 }}>
                      {cropAnalytics
                        .reduce((sum, crop) => sum + crop.totalAcreage, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Distribution */}
              <div style={govCardPadded}>
                <h3 style={{ ...govSectionHeader, marginBottom: 16 }}>
                  Regional Distribution
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {[
                    { region: "Kingston", count: 15 },
                    { region: "Mandeville", count: 12 },
                    { region: "St. Elizabeth", count: 18 },
                    { region: "Portland", count: 8 },
                  ].map((item) => (
                    <div key={item.region}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            color: GOV.text,
                          }}
                        >
                          <MapPinIcon
                            style={{
                              width: 14,
                              height: 14,
                              color: GOV.muted,
                            }}
                          />
                          {item.region}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: GOV.text,
                          }}
                        >
                          {item.count}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: GOV.border,
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(item.count / 53) * 100}%`,
                            background:
                              regionColors[item.region] ?? GOV.brand,
                            borderRadius: 99,
                            transition: "width .3s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={govCardPadded}>
                <h3 style={{ ...govSectionHeader, marginBottom: 14 }}>
                  Quick Actions
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {[
                    {
                      href: "/government/reporting?type=quarterly-sales",
                      label: "Generate Production Report",
                      id: "report",
                    },
                    {
                      href: "/government/vendors",
                      label: "View All Vendors",
                      id: "vendors",
                    },
                    {
                      href: "/government/data",
                      label: "Export Production Data",
                      id: "export",
                    },
                  ].map((action) => (
                    <Link
                      key={action.id}
                      href={action.href}
                      style={{
                        ...govPillButton,
                        display: "block",
                        textAlign: "left" as const,
                        background:
                          hoveredAction === action.id
                            ? govHoverBg
                            : GOV.cardBg,
                        transition: "background .12s ease",
                        textDecoration: "none",
                      }}
                      onMouseEnter={() => setHoveredAction(action.id)}
                      onMouseLeave={() => setHoveredAction(null)}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
