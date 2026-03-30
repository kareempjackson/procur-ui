"use client";

import { useState, useEffect } from "react";
import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  TableCellsIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchTables,
  fetchTableData,
  selectTables,
  selectTablesStatus,
  selectCurrentTableData,
  setCurrentTable,
} from "@/store/slices/governmentTablesSlice";
import {
  fetchCharts,
  selectCharts,
  selectChartsStatus,
} from "@/store/slices/governmentChartsSlice";
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
  govPrimaryButton,
  govStatusPillStyle,
  govStatusLabel,
  govHoverBg,
} from "../styles";

export default function DataPage() {
  const dispatch = useAppDispatch();

  // Redux state - Tables
  const tables = useAppSelector(selectTables);
  const tablesStatus = useAppSelector(selectTablesStatus);
  const currentTableData = useAppSelector(selectCurrentTableData);

  // Redux state - Charts
  const charts = useAppSelector(selectCharts);
  const chartsStatus = useAppSelector(selectChartsStatus);

  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "json">(
    "csv"
  );

  // Hover states
  const [hoveredDataset, setHoveredDataset] = useState<string | null>(null);
  const [hoveredViz, setHoveredViz] = useState<string | null>(null);
  const [hoveredQuickExport, setHoveredQuickExport] = useState<number | null>(null);
  const [hoveredRefresh, setHoveredRefresh] = useState(false);
  const [hoveredExportBtn, setHoveredExportBtn] = useState<string | null>(null);

  // Fetch tables and charts on mount
  useEffect(() => {
    if (tablesStatus === "idle") {
      dispatch(fetchTables({ page: 1, limit: 50 }));
    }
    if (chartsStatus === "idle") {
      dispatch(fetchCharts({ page: 1, limit: 50 }));
    }
  }, [tablesStatus, chartsStatus, dispatch]);

  // Fetch table data when dataset is selected
  useEffect(() => {
    if (selectedDataset && tables.length > 0) {
      const table = tables.find((t) => t.id === selectedDataset);
      if (table) {
        dispatch(setCurrentTable(table));
        dispatch(fetchTableData({ tableId: selectedDataset }));
      }
    }
  }, [selectedDataset, tables, dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchTables({ page: 1, limit: 50 }));
    dispatch(fetchCharts({ page: 1, limit: 50 }));
  };

  // Mock datasets for fallback
  const mockDatasets = [
    {
      id: "vendor-data",
      name: "Vendor Information",
      description:
        "Complete vendor profiles including contact and farm details",
      record_count: 1234,
      last_updated: "2024-10-04",
      category: "Vendors",
    },
    {
      id: "production-data",
      name: "Production Records",
      description:
        "Planting dates, crop types, expected harvests, and actual yields",
      record_count: 5678,
      last_updated: "2024-10-04",
      category: "Production",
    },
    {
      id: "acreage-data",
      name: "Land Acreage Data",
      description: "Total, utilized, and available acreage per vendor",
      record_count: 1234,
      last_updated: "2024-10-04",
      category: "Land",
    },
    {
      id: "chemical-usage",
      name: "Chemical Usage Records",
      description:
        "Agricultural chemicals used, dosages, and application dates",
      record_count: 3456,
      last_updated: "2024-10-03",
      category: "Compliance",
    },
    {
      id: "market-transactions",
      name: "Market Transactions",
      description: "Sales data, quantities, and transaction values",
      record_count: 8901,
      last_updated: "2024-10-04",
      category: "Market",
    },
    {
      id: "infrastructure",
      name: "Infrastructure Inventory",
      description: "Irrigation systems, greenhouses, storage facilities",
      record_count: 1234,
      last_updated: "2024-10-02",
      category: "Infrastructure",
    },
    {
      id: "program-participation",
      name: "Program Participation",
      description: "Government program enrollment and performance metrics",
      record_count: 2345,
      last_updated: "2024-10-01",
      category: "Programs",
    },
    {
      id: "compliance-records",
      name: "Compliance Records",
      description: "Inspection reports, certifications, and compliance status",
      record_count: 4567,
      last_updated: "2024-10-04",
      category: "Compliance",
    },
  ];

  // Use real tables or fallback to mock
  const displayDatasets = tables.length > 0 ? tables : mockDatasets;

  // Mock visualizations for fallback
  const mockVisualizations = [
    {
      id: "crop-distribution",
      name: "Crop Distribution Map",
      description: "Geographic distribution of crop types across regions",
      type: "Map",
    },
    {
      id: "production-trends",
      name: "Production Trends",
      description: "Seasonal production volumes over time",
      type: "Line Chart",
    },
    {
      id: "acreage-utilization",
      name: "Acreage Utilization",
      description: "Land usage efficiency across all vendors",
      type: "Bar Chart",
    },
    {
      id: "market-demand",
      name: "Market Demand Analysis",
      description: "Supply vs demand by crop type",
      type: "Area Chart",
    },
  ];

  // Use real charts or fallback to mock
  const displayVisualizations = charts.length > 0 ? charts : mockVisualizations;

  const handleExport = (datasetId: string) => {
    console.log(`Exporting ${datasetId} as ${exportFormat}`);
    // TODO: Implement actual export functionality with table data
    if (currentTableData) {
      console.log("Exporting table data:", currentTableData);
    }
  };

  const categories = [
    ...new Set(displayDatasets.map((dataset) => (dataset as any).category)),
  ];

  const quickExportItems = [
    { icon: DocumentArrowDownIcon, label: "Export All Vendor Data" },
    { icon: DocumentArrowDownIcon, label: "Export Production Records" },
    { icon: DocumentArrowDownIcon, label: "Export Market Data" },
    { icon: FunnelIcon, label: "Custom Data Query" },
  ];

  const dataCoverage = [
    { label: "Vendors", value: "1,234" },
    { label: "Production Cycles", value: "5,678" },
    { label: "Transactions", value: "8,901" },
    { label: "Total Acreage", value: "45,678" },
  ];

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
            <h1 style={govPageTitle}>Data &amp; Analytics</h1>
            <p style={govPageSubtitle}>
              Access, visualize, and export agricultural data across all vendors
              {tablesStatus === "loading" && " \u2022 Loading datasets..."}
              {chartsStatus === "loading" && " \u2022 Loading visualizations..."}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={tablesStatus === "loading" || chartsStatus === "loading"}
            onMouseEnter={() => setHoveredRefresh(true)}
            onMouseLeave={() => setHoveredRefresh(false)}
            style={{
              ...govPillButton,
              background: hoveredRefresh ? govHoverBg : GOV.cardBg,
              opacity:
                tablesStatus === "loading" || chartsStatus === "loading"
                  ? 0.5
                  : 1,
              cursor:
                tablesStatus === "loading" || chartsStatus === "loading"
                  ? "not-allowed"
                  : "pointer",
              transition: "background .15s",
            }}
          >
            <ArrowPathIcon
              style={{
                width: 18,
                height: 18,
                color: GOV.muted,
                animation:
                  tablesStatus === "loading" || chartsStatus === "loading"
                    ? "spin 1s linear infinite"
                    : "none",
              }}
            />
            Refresh
          </button>
        </div>

        {/* Quick Stats — 4-col KPI grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Datasets</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>
              {tablesStatus === "loading" ? "..." : displayDatasets.length}
            </div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Records</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>27.9K</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Last Updated</div>
            <div style={{ ...govKpiValue, marginTop: 6, fontSize: 20 }}>Today</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Visualizations</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>
              {displayVisualizations.length}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Export Configuration */}
            <div style={govCardPadded}>
              <h2 style={{ ...govSectionHeader, marginBottom: 16 }}>
                Export Configuration
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                }}
              >
                {/* Format select */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: GOV.text,
                      marginBottom: 8,
                    }}
                  >
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) =>
                      setExportFormat(
                        e.target.value as "csv" | "excel" | "json"
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "9px 16px",
                      borderRadius: 999,
                      border: `1px solid ${GOV.border}`,
                      fontSize: 13,
                      color: GOV.text,
                      background: GOV.cardBg,
                      outline: "none",
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <option value="csv">CSV</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: GOV.text,
                      marginBottom: 8,
                    }}
                  >
                    Start Date
                  </label>
                  <div style={{ position: "relative" }}>
                    <CalendarIcon
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 16,
                        height: 16,
                        color: GOV.muted,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "9px 14px 9px 36px",
                        borderRadius: 999,
                        border: `1px solid ${GOV.border}`,
                        fontSize: 13,
                        color: GOV.text,
                        background: GOV.cardBg,
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: GOV.text,
                      marginBottom: 8,
                    }}
                  >
                    End Date
                  </label>
                  <div style={{ position: "relative" }}>
                    <CalendarIcon
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 16,
                        height: 16,
                        color: GOV.muted,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "9px 14px 9px 36px",
                        borderRadius: 999,
                        border: `1px solid ${GOV.border}`,
                        fontSize: 13,
                        color: GOV.text,
                        background: GOV.cardBg,
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Available Datasets */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h2 style={govSectionHeader}>Available Datasets</h2>
                <p style={{ fontSize: 11.5, color: GOV.muted, marginTop: 2, fontWeight: 500 }}>
                  Select a dataset to export or analyze
                </p>
              </div>

              {/* Datasets by Category */}
              <div>
                {categories.map((category, ci) => (
                  <div
                    key={category}
                    style={{
                      padding: "14px 20px",
                      borderTop: ci > 0 ? `1px solid ${GOV.border}` : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: GOV.muted,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        marginBottom: 10,
                      }}
                    >
                      {category}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {displayDatasets
                        .filter(
                          (dataset) => (dataset as any).category === category
                        )
                        .map((dataset) => {
                          const isSelected = selectedDataset === dataset.id;
                          const isHovered = hoveredDataset === dataset.id;
                          return (
                            <div
                              key={dataset.id}
                              onMouseEnter={() => setHoveredDataset(dataset.id)}
                              onMouseLeave={() => setHoveredDataset(null)}
                              onClick={() => setSelectedDataset(dataset.id)}
                              style={{
                                ...govCardPadded,
                                cursor: "pointer",
                                transition: "background .15s, border-color .15s",
                                borderColor: isSelected
                                  ? GOV.accent
                                  : isHovered
                                  ? GOV.lightMuted
                                  : GOV.border,
                                background: isSelected
                                  ? "#fdf5ef"
                                  : isHovered
                                  ? govHoverBg
                                  : GOV.cardBg,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                      marginBottom: 4,
                                    }}
                                  >
                                    <TableCellsIcon
                                      style={{
                                        width: 17,
                                        height: 17,
                                        color: GOV.muted,
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        fontSize: 13,
                                        color: GOV.text,
                                      }}
                                    >
                                      {dataset.name}
                                    </span>
                                  </div>
                                  <p
                                    style={{
                                      fontSize: 11.5,
                                      color: GOV.muted,
                                      margin: "2px 0 0",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {dataset.description}
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                      marginTop: 6,
                                      fontSize: 11,
                                      color: GOV.lightMuted,
                                      fontWeight: 500,
                                    }}
                                  >
                                    <span>
                                      {(dataset as any).record_count || "N/A"}{" "}
                                      records
                                    </span>
                                    <span style={{ color: GOV.border }}>{"\u00B7"}</span>
                                    <span>
                                      Updated{" "}
                                      {(dataset as any).last_updated
                                        ? new Date(
                                            (dataset as any).last_updated
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExport(dataset.id);
                                  }}
                                  onMouseEnter={() =>
                                    setHoveredExportBtn(dataset.id)
                                  }
                                  onMouseLeave={() =>
                                    setHoveredExportBtn(null)
                                  }
                                  style={{
                                    ...govPrimaryButton,
                                    fontSize: 11.5,
                                    padding: "7px 14px",
                                    marginLeft: 12,
                                    flexShrink: 0,
                                    background:
                                      hoveredExportBtn === dataset.id
                                        ? GOV.accentHover
                                        : GOV.accent,
                                    transition: "background .15s",
                                  }}
                                >
                                  <ArrowDownTrayIcon
                                    style={{ width: 14, height: 14 }}
                                  />
                                  Export
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visualizations & Quick Export */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Data Visualizations */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h2 style={govSectionHeader}>Data Visualizations</h2>
                <p style={{ fontSize: 11.5, color: GOV.muted, marginTop: 2, fontWeight: 500 }}>
                  Interactive charts and graphs
                </p>
              </div>
              <div
                style={{
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {displayVisualizations.map((viz) => {
                  const isHovered = hoveredViz === viz.id;
                  return (
                    <button
                      key={viz.id}
                      onMouseEnter={() => setHoveredViz(viz.id)}
                      onMouseLeave={() => setHoveredViz(null)}
                      style={{
                        ...govCardPadded,
                        width: "100%",
                        textAlign: "left" as const,
                        cursor: "pointer",
                        transition: "background .15s, border-color .15s",
                        borderColor: isHovered ? GOV.lightMuted : GOV.border,
                        background: isHovered ? govHoverBg : GOV.cardBg,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <ChartBarIcon
                          style={{
                            width: 17,
                            height: 17,
                            color: GOV.muted,
                            marginTop: 1,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              color: GOV.text,
                            }}
                          >
                            {viz.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11.5,
                              color: GOV.muted,
                              marginTop: 3,
                              fontWeight: 500,
                            }}
                          >
                            {viz.description}
                          </div>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: 6,
                              padding: "2px 8px",
                              borderRadius: 99,
                              fontSize: 10.5,
                              fontWeight: 700,
                              background: GOV.brandLight,
                              color: GOV.brand,
                            }}
                          >
                            {(viz as any).type ||
                              (viz as any).chart_type ||
                              "Chart"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Export */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h2 style={govSectionHeader}>Quick Export</h2>
              </div>
              <div
                style={{
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {quickExportItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isHovered = hoveredQuickExport === idx;
                  return (
                    <button
                      key={idx}
                      onMouseEnter={() => setHoveredQuickExport(idx)}
                      onMouseLeave={() => setHoveredQuickExport(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: 999,
                        border: "none",
                        background: isHovered ? govHoverBg : "transparent",
                        fontSize: 13,
                        fontWeight: 600,
                        color: GOV.text,
                        cursor: "pointer",
                        textAlign: "left" as const,
                        fontFamily: "inherit",
                        transition: "background .15s",
                      }}
                    >
                      <Icon
                        style={{
                          width: 17,
                          height: 17,
                          color: GOV.muted,
                          flexShrink: 0,
                        }}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data Coverage Summary */}
            <div
              style={{
                ...govCardPadded,
                background: GOV.brandLight,
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: GOV.text,
                  margin: "0 0 12px",
                }}
              >
                Data Coverage
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {dataCoverage.map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: GOV.muted, fontWeight: 500 }}>
                      {row.label}
                    </span>
                    <span style={{ fontWeight: 700, color: GOV.text }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
