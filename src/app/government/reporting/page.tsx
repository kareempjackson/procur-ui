"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchReports,
  createAndGenerateReport,
  selectReports,
  selectReportsStatus,
  selectGenerateStatus,
  selectGenerateError,
} from "@/store/slices/governmentReportsSlice";
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

type ReportType =
  | "market-requirements"
  | "quarterly-sales"
  | "available-acreage"
  | "vendor-performance"
  | "program-participation"
  | "chemical-usage"
  | "infrastructure"
  | "custom";

export default function ReportingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get("type") as ReportType | null;

  // Redux state
  const reports = useAppSelector(selectReports);
  const reportsStatus = useAppSelector(selectReportsStatus);
  const generateStatus = useAppSelector(selectGenerateStatus);
  const generateError = useAppSelector(selectGenerateError);

  const [selectedReport, setSelectedReport] = useState<ReportType | null>(
    preselectedType
  );
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [filters, setFilters] = useState({
    location: "all",
    cropType: "all",
    complianceStatus: "all",
  });
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [hoveredReportId, setHoveredReportId] = useState<string | null>(null);
  const [hoveredExport, setHoveredExport] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Fetch reports on mount
  useEffect(() => {
    if (reportsStatus === "idle") {
      dispatch(fetchReports({ page: 1, limit: 20 }));
    }
  }, [reportsStatus, dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchReports({ page: 1, limit: 20 }));
  };

  const reportTypes = [
    {
      id: "market-requirements" as ReportType,
      name: "Market Requirements Report",
      description: "Current market demand by quantity and variety",
      icon: DocumentTextIcon,
    },
    {
      id: "quarterly-sales" as ReportType,
      name: "Quarterly Sales Report",
      description: "Quantity of crops sold/bought per crop per quarter",
      icon: DocumentTextIcon,
    },
    {
      id: "available-acreage" as ReportType,
      name: "Available Acreage Report",
      description: "Land available (not planted) across all vendors",
      icon: DocumentTextIcon,
    },
    {
      id: "vendor-performance" as ReportType,
      name: "Vendor Performance Report",
      description: "Comprehensive vendor activity and compliance metrics",
      icon: DocumentTextIcon,
    },
    {
      id: "program-participation" as ReportType,
      name: "Program Participation Report",
      description: "Government program enrollment and performance",
      icon: DocumentTextIcon,
    },
    {
      id: "chemical-usage" as ReportType,
      name: "Chemical Usage Report",
      description: "Agricultural chemical usage and compliance",
      icon: DocumentTextIcon,
    },
    {
      id: "infrastructure" as ReportType,
      name: "Infrastructure Inventory Report",
      description: "Farm infrastructure across all registered vendors",
      icon: DocumentTextIcon,
    },
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) return;

    try {
      const result = await dispatch(
        createAndGenerateReport({
          type: selectedReport,
          parameters: {
            ...(dateRange.startDate || dateRange.endDate
              ? {
                  date_range: {
                    start_date: dateRange.startDate,
                    end_date: dateRange.endDate,
                  },
                }
              : {}),
            ...(filters.location !== "all" ||
            filters.cropType !== "all" ||
            filters.complianceStatus !== "all"
              ? {
                  filters: {
                    ...(filters.location !== "all"
                      ? { location: filters.location }
                      : {}),
                    ...(filters.cropType !== "all"
                      ? { crop_type: filters.cropType }
                      : {}),
                    ...(filters.complianceStatus !== "all"
                      ? { compliance_status: filters.complianceStatus }
                      : {}),
                  },
                }
              : {}),
          },
        })
      ).unwrap();

      // The API returns a report_id, but we need to generate the actual report data
      // Since the backend doesn't return formatted report data yet, use mock data
      const mockData = generateMockReport(selectedReport);
      setGeneratedReport({
        ...mockData,
        report_id: result.report_id,
        generated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to generate report:", error);
      // Fallback to mock data if API fails
      const mockData = generateMockReport(selectedReport);
      setGeneratedReport(mockData);
    }
  };

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    console.log(`Exporting report as ${format}`);
    // TODO: Implement export functionality with actual report data
    if (generatedReport) {
      // Future: Download report in requested format
      console.log("Report data:", generatedReport);
    }
  };

  // Mock data generator
  const generateMockReport = (type: ReportType) => {
    switch (type) {
      case "market-requirements":
        return {
          title: "Market Requirements Report",
          data: [
            {
              crop: "Tomatoes",
              variety: "Roma, Cherry",
              quantity: "5,000 kg",
              frequency: "Weekly",
            },
            {
              crop: "Lettuce",
              variety: "Iceberg, Romaine",
              quantity: "3,000 kg",
              frequency: "Bi-weekly",
            },
            {
              crop: "Peppers",
              variety: "Bell, Scotch Bonnet",
              quantity: "2,500 kg",
              frequency: "Weekly",
            },
          ],
        };
      case "quarterly-sales":
        return {
          title: "Quarterly Sales Report - Q3 2024",
          data: [
            {
              crop: "Tomatoes",
              sold: "45,000 kg",
              bought: "48,000 kg",
              value: "$112,500",
            },
            {
              crop: "Lettuce",
              sold: "28,000 kg",
              bought: "30,000 kg",
              value: "$75,000",
            },
            {
              crop: "Peppers",
              sold: "35,000 kg",
              bought: "36,500 kg",
              value: "$95,250",
            },
          ],
        };
      case "available-acreage":
        return {
          title: "Available Acreage Report",
          data: [
            {
              vendor: "Green Valley Farms",
              totalAcreage: 250,
              utilized: 180,
              available: 70,
            },
            {
              vendor: "Sunrise Agricultural Co.",
              totalAcreage: 420,
              utilized: 350,
              available: 70,
            },
            {
              vendor: "Coastal Farms Group",
              totalAcreage: 520,
              utilized: 380,
              available: 140,
            },
          ],
          summary: {
            totalAcreage: 1465,
            utilizedAcreage: 1065,
            availableAcreage: 400,
          },
        };
      case "vendor-performance":
        return {
          title: "Vendor Performance Report",
          data: [
            {
              vendor: "Green Valley Farms",
              compliance: "Excellent",
              sales: "$125,000",
              programs: 3,
            },
            {
              vendor: "Sunrise Agricultural Co.",
              compliance: "Good",
              sales: "$98,500",
              programs: 2,
            },
            {
              vendor: "Highland Produce Ltd.",
              compliance: "Fair",
              sales: "$67,000",
              programs: 1,
            },
          ],
        };
      default:
        return { title: "Custom Report", data: [] };
    }
  };

  /* ── Shared inline-style fragments ─────────────────────────────────────── */

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px 9px 36px",
    border: `1px solid ${GOV.border}`,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: GOV.text,
    background: GOV.cardBg,
    outline: "none",
    fontFamily: "inherit",
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: `1px solid ${GOV.border}`,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: GOV.text,
    background: GOV.cardBg,
    outline: "none",
    fontFamily: "inherit",
    cursor: "pointer",
  };

  const exportBtnBase: React.CSSProperties = {
    ...govPillButton,
    gap: 5,
    padding: "7px 14px",
    fontSize: 12,
  };

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
            <h1 style={govPageTitle}>Reporting &amp; Analytics</h1>
            <p style={govPageSubtitle}>
              Generate comprehensive reports on vendors, production, and market
              activity
              {reportsStatus === "loading" && " \u2022 Loading..."}
              {generateStatus === "generating" && " \u2022 Generating report..."}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={reportsStatus === "loading"}
            style={{
              ...govPillButton,
              opacity: reportsStatus === "loading" ? 0.5 : 1,
              cursor:
                reportsStatus === "loading" ? "not-allowed" : "pointer",
            }}
          >
            <ArrowPathIcon
              style={{
                width: 18,
                height: 18,
                animation:
                  reportsStatus === "loading"
                    ? "spin 1s linear infinite"
                    : "none",
              }}
            />
            Refresh
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 24,
          }}
        >
          {/* Left Column - Report Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ ...govCard, padding: "20px 20px 24px" }}>
              <h2 style={{ ...govSectionHeader, fontSize: 15, marginBottom: 14 }}>
                Select Report Type
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  const isSelected = selectedReport === report.id;
                  const isHovered = hoveredReportId === report.id;
                  return (
                    <button
                      key={report.id}
                      onClick={() => {
                        setSelectedReport(report.id);
                        setGeneratedReport(null);
                      }}
                      onMouseEnter={() => setHoveredReportId(report.id)}
                      onMouseLeave={() => setHoveredReportId(null)}
                      style={{
                        width: "100%",
                        textAlign: "left" as const,
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: isSelected
                          ? `1.5px solid ${GOV.accent}`
                          : `1px solid ${isHovered ? GOV.accent + "60" : GOV.border}`,
                        background: isSelected
                          ? GOV.accent + "0a"
                          : isHovered
                            ? govHoverBg
                            : GOV.cardBg,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "border-color .15s, background .15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <Icon
                          style={{
                            width: 18,
                            height: 18,
                            marginTop: 1,
                            color: isSelected ? GOV.accent : GOV.muted,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: isSelected ? GOV.accent : GOV.text,
                            }}
                          >
                            {report.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11.5,
                              color: GOV.muted,
                              marginTop: 3,
                              fontWeight: 500,
                            }}
                          >
                            {report.description}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircleIcon
                            style={{
                              width: 18,
                              height: 18,
                              color: GOV.accent,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Report Parameters */}
            {selectedReport && (
              <div style={{ ...govCard, padding: "20px 20px 24px" }}>
                <h2 style={{ ...govSectionHeader, fontSize: 15, marginBottom: 14 }}>
                  Report Parameters
                </h2>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Date Range */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        color: GOV.text,
                        marginBottom: 8,
                      }}
                    >
                      Date Range
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <CalendarIcon
                          style={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 18,
                            height: 18,
                            color: GOV.muted,
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
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ position: "relative" }}>
                        <CalendarIcon
                          style={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 18,
                            height: 18,
                            color: GOV.muted,
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
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        color: GOV.text,
                        marginBottom: 8,
                      }}
                    >
                      <FunnelIcon style={{ width: 14, height: 14 }} />
                      Filters
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <select
                        value={filters.location}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        style={selectStyle}
                      >
                        <option value="all">All Locations</option>
                        <option value="st-georges">St. George&apos;s</option>
                        <option value="grenville">Grenville</option>
                        <option value="gouyave">Gouyave</option>
                        <option value="sauteurs">Sauteurs</option>
                        <option value="victoria">Victoria</option>
                      </select>
                      <select
                        value={filters.cropType}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            cropType: e.target.value,
                          }))
                        }
                        style={selectStyle}
                      >
                        <option value="all">All Crops</option>
                        <option value="tomatoes">Tomatoes</option>
                        <option value="lettuce">Lettuce</option>
                        <option value="peppers">Peppers</option>
                      </select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateReport}
                    disabled={generateStatus === "generating"}
                    style={{
                      ...govPrimaryButton,
                      width: "100%",
                      justifyContent: "center",
                      padding: "11px 18px",
                      opacity: generateStatus === "generating" ? 0.5 : 1,
                      cursor:
                        generateStatus === "generating"
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {generateStatus === "generating" && (
                      <ArrowPathIcon
                        style={{
                          width: 18,
                          height: 18,
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    )}
                    {generateStatus === "generating"
                      ? "Generating..."
                      : "Generate Report"}
                  </button>

                  {/* Generation Error */}
                  {generateError && (
                    <div
                      style={{
                        borderRadius: 8,
                        border: `1px solid ${GOV.dangerBg}`,
                        background: GOV.dangerBg,
                        padding: "10px 14px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          color: GOV.danger,
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        Error: {generateError}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Report Preview */}
          <div>
            {!generatedReport ? (
              <div
                style={{
                  ...govCard,
                  padding: "64px 32px",
                  textAlign: "center" as const,
                }}
              >
                <DocumentTextIcon
                  style={{
                    width: 56,
                    height: 56,
                    margin: "0 auto 16px",
                    color: GOV.lightMuted,
                  }}
                />
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: GOV.text,
                    margin: "0 0 6px",
                  }}
                >
                  No Report Generated
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: GOV.muted,
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  Select a report type and configure parameters to generate a
                  report
                </p>
              </div>
            ) : (
              <div style={{ ...govCard, overflow: "hidden" }}>
                {/* Report Header */}
                <div
                  style={{
                    padding: "18px 22px",
                    borderBottom: `1px solid ${GOV.border}`,
                    background: GOV.bg,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: GOV.text,
                          margin: 0,
                          letterSpacing: "-.3px",
                        }}
                      >
                        {generatedReport.title}
                      </h2>
                      <p
                        style={{
                          fontSize: 12,
                          color: GOV.muted,
                          fontWeight: 500,
                          marginTop: 4,
                        }}
                      >
                        Generated on {new Date().toLocaleDateString()} at{" "}
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(["pdf", "excel", "csv"] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => handleExport(fmt)}
                          onMouseEnter={() => setHoveredExport(fmt)}
                          onMouseLeave={() => setHoveredExport(null)}
                          style={{
                            ...exportBtnBase,
                            background:
                              hoveredExport === fmt ? govHoverBg : GOV.cardBg,
                          }}
                        >
                          <ArrowDownTrayIcon
                            style={{ width: 14, height: 14 }}
                          />
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div style={{ padding: "22px 22px 28px" }}>
                  {selectedReport === "available-acreage" &&
                    generatedReport.summary && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 12,
                          marginBottom: 22,
                        }}
                      >
                        <div style={govCardPadded}>
                          <div style={govKpiLabel}>Total Acreage</div>
                          <div style={{ ...govKpiValue, marginTop: 6 }}>
                            {generatedReport.summary.totalAcreage.toLocaleString()}
                          </div>
                          <div style={govKpiSub}>across all vendors</div>
                        </div>
                        <div style={govCardPadded}>
                          <div style={govKpiLabel}>Utilized</div>
                          <div
                            style={{
                              ...govKpiValue,
                              marginTop: 6,
                              color: GOV.brand,
                            }}
                          >
                            {generatedReport.summary.utilizedAcreage.toLocaleString()}
                          </div>
                          <div style={govKpiSub}>currently planted</div>
                        </div>
                        <div style={govCardPadded}>
                          <div style={govKpiLabel}>Available</div>
                          <div
                            style={{
                              ...govKpiValue,
                              marginTop: 6,
                              color: GOV.accent,
                            }}
                          >
                            {generatedReport.summary.availableAcreage.toLocaleString()}
                          </div>
                          <div style={govKpiSub}>ready for planting</div>
                        </div>
                      </div>
                    )}

                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: `1.5px solid ${GOV.border}`,
                          }}
                        >
                          {Object.keys(generatedReport.data[0] || {}).map(
                            (key) => (
                              <th
                                key={key}
                                style={{
                                  ...govKpiLabel,
                                  padding: "10px 14px",
                                  textAlign: "left" as const,
                                }}
                              >
                                {key}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {generatedReport.data.map((row: any, idx: number) => (
                          <tr
                            key={idx}
                            onMouseEnter={() => setHoveredRow(idx)}
                            onMouseLeave={() => setHoveredRow(null)}
                            style={{
                              borderBottom:
                                idx < generatedReport.data.length - 1
                                  ? `1px solid ${GOV.border}40`
                                  : "none",
                              background:
                                hoveredRow === idx ? govHoverBg : "transparent",
                              transition: "background .12s",
                            }}
                          >
                            {Object.values(row).map(
                              (value: any, cellIdx: number) => (
                                <td
                                  key={cellIdx}
                                  style={{
                                    padding: "11px 14px",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: GOV.text,
                                  }}
                                >
                                  {value}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
