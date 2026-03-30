"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchComplianceAlerts,
  fetchComplianceRecords,
  fetchComplianceStats,
  resolveAlert,
  updateComplianceStatus,
  selectAlerts,
  selectAlertsStatus,
  selectComplianceRecords,
  selectRecordsStatus,
  selectComplianceStats,
  selectStatsStatus,
  setFilters,
} from "@/store/slices/governmentComplianceSlice";
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

export default function CompliancePage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Redux state
  const alerts = useAppSelector(selectAlerts);
  const alertsStatus = useAppSelector(selectAlertsStatus);
  const records = useAppSelector(selectComplianceRecords);
  const recordsStatus = useAppSelector(selectRecordsStatus);
  const stats = useAppSelector(selectComplianceStats);
  const statsStatus = useAppSelector(selectStatsStatus);

  // Fetch data on mount
  useEffect(() => {
    if (alertsStatus === "idle") {
      dispatch(fetchComplianceAlerts());
    }
    if (recordsStatus === "idle") {
      dispatch(fetchComplianceRecords({ page: 1, limit: 100 }));
    }
    if (statsStatus === "idle") {
      dispatch(fetchComplianceStats());
    }
  }, [alertsStatus, recordsStatus, statsStatus, dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchComplianceAlerts());
    dispatch(fetchComplianceRecords({ page: 1, limit: 100 }));
    dispatch(fetchComplianceStats());
  };

  // Update filters
  useEffect(() => {
    if (filterStatus !== "all") {
      dispatch(setFilters({ status: filterStatus }));
    }
  }, [filterStatus, dispatch]);

  // Handle resolve alert
  const handleResolveAlert = async (alertId: string) => {
    try {
      await dispatch(resolveAlert({ alertId })).unwrap();
      dispatch(fetchComplianceAlerts());
      dispatch(fetchComplianceStats());
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    }
  };

  // Compliance stats with fallback to mock data
  const complianceStatsData = useMemo(() => {
    if (stats) {
      return [
        {
          label: "Compliant Vendors",
          value: stats.compliantVendors?.toString() || "0",
          percentage: `${Math.round(stats.complianceRate || 0)}%`,
          trend: "up",
          color: GOV.success,
        },
        {
          label: "Pending Reviews",
          value: stats.pendingReviews?.toString() || "0",
          trend: "neutral",
          color: GOV.warning,
        },
        {
          label: "Active Alerts",
          value: stats.activeAlerts?.toString() || "0",
          trend: "down",
          color: GOV.danger,
        },
        {
          label: "Inspections Due",
          value: stats.inspectionsDue?.toString() || "0",
          trend: "up",
          color: GOV.accent,
        },
      ];
    }
    // Mock compliance data (fallback)
    return [
      {
        label: "Compliant Vendors",
        value: "1,156",
        percentage: "94%",
        trend: "up",
        color: GOV.success,
      },
      {
        label: "Pending Reviews",
        value: "23",
        trend: "neutral",
        color: GOV.warning,
      },
      {
        label: "Active Alerts",
        value: "7",
        trend: "down",
        color: GOV.danger,
      },
      {
        label: "Inspections Due",
        value: "12",
        trend: "up",
        color: GOV.accent,
      },
    ];
  }, [stats]);

  // Vendors from compliance records with search and filter
  const vendors = useMemo(() => {
    let filteredRecords = records || [];

    // Apply status filter
    if (filterStatus !== "all") {
      filteredRecords = filteredRecords.filter(
        (r) => r.status === filterStatus
      );
    }

    // Apply search
    if (searchQuery) {
      filteredRecords = filteredRecords.filter((r) =>
        r.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredRecords.map((record) => ({
      id: record.id,
      name: record.vendor_name,
      status: record.status,
      lastInspection: record.last_inspection || "N/A",
      nextInspection: record.next_inspection || "N/A",
      issues: record.status === "non_compliant" ? 1 : 0,
      documents: {
        chemicalReports: "up-to-date",
        certifications: "up-to-date",
        inspectionReports: "up-to-date",
      },
    }));
  }, [records, filterStatus, searchQuery]);

  // Mock vendors as fallback (used when no real data)
  const mockVendors = [
    {
      id: "1",
      name: "Green Valley Farms",
      status: "compliant",
      lastInspection: "2024-09-15",
      nextInspection: "2024-12-15",
      issues: 0,
      documents: {
        chemicalReports: "up-to-date",
        certifications: "up-to-date",
        inspectionReports: "up-to-date",
      },
    },
    {
      id: "2",
      name: "Sunrise Agricultural Co.",
      status: "compliant",
      lastInspection: "2024-08-20",
      nextInspection: "2024-11-20",
      issues: 0,
      documents: {
        chemicalReports: "up-to-date",
        certifications: "up-to-date",
        inspectionReports: "up-to-date",
      },
    },
    {
      id: "3",
      name: "Highland Produce Ltd.",
      status: "warning",
      lastInspection: "2024-07-10",
      nextInspection: "2024-10-10",
      issues: 2,
      documents: {
        chemicalReports: "overdue",
        certifications: "up-to-date",
        inspectionReports: "up-to-date",
      },
    },
    {
      id: "4",
      name: "Coastal Farms Group",
      status: "compliant",
      lastInspection: "2024-09-05",
      nextInspection: "2024-12-05",
      issues: 0,
      documents: {
        chemicalReports: "up-to-date",
        certifications: "up-to-date",
        inspectionReports: "up-to-date",
      },
    },
    {
      id: "5",
      name: "Mountain Fresh Produce",
      status: "alert",
      lastInspection: "2024-06-15",
      nextInspection: "2024-09-15",
      issues: 3,
      documents: {
        chemicalReports: "overdue",
        certifications: "expiring-soon",
        inspectionReports: "overdue",
      },
    },
  ];

  // Use real vendors or fall back to mock
  const displayVendors = vendors.length > 0 ? vendors : mockVendors;

  // Format alerts for display
  const recentAlerts = useMemo(() => {
    if (alerts && alerts.length > 0) {
      return alerts.slice(0, 10).map((alert) => ({
        id: alert.id,
        vendor: alert.vendor_name,
        type: alert.title,
        severity: alert.severity,
        date: alert.created_at,
        description: alert.description,
        status: alert.status,
      }));
    }
    // Mock alerts as fallback
    return [
      {
        id: "1",
        vendor: "Mountain Fresh Produce",
        type: "Chemical Report Overdue",
        severity: "high",
        date: "2024-10-01",
        description: "Quarterly chemical usage report not submitted",
      },
      {
        id: "2",
        vendor: "Highland Produce Ltd.",
        type: "Certification Expiring",
        severity: "medium",
        date: "2024-10-02",
        description: "Organic certification expires in 30 days",
      },
      {
        id: "3",
        vendor: "Green Valley Farms",
        type: "Inspection Scheduled",
        severity: "low",
        date: "2024-10-04",
        description: "Routine inspection scheduled for next week",
      },
    ];
  }, [alerts]);

  const filteredVendors = displayVendors.filter((vendor) => {
    const matchesSearch =
      searchQuery === "" ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || vendor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getDocStatusStyle = (
    status: string
  ): { bg: string; color: string; symbol: string } => {
    switch (status) {
      case "up-to-date":
        return { bg: GOV.successBg, color: GOV.success, symbol: "\u2713" };
      case "expiring-soon":
        return { bg: GOV.warningBg, color: GOV.warning, symbol: "\u26A0" };
      case "overdue":
        return { bg: GOV.dangerBg, color: GOV.danger, symbol: "\u2717" };
      default:
        return { bg: "#f5f1ea", color: GOV.muted, symbol: "?" };
    }
  };

  const getSeverityIconColor = (severity: string): string => {
    switch (severity) {
      case "high":
        return GOV.danger;
      case "medium":
        return GOV.warning;
      case "low":
        return GOV.info;
      default:
        return GOV.muted;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 style={govPageTitle}>Compliance Monitoring</h1>
            <p style={govPageSubtitle}>
              Track vendor compliance status, inspections, and regulatory
              requirements
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={recordsStatus === "loading" || alertsStatus === "loading"}
            style={{
              ...govPillButton,
              padding: 10,
              opacity:
                recordsStatus === "loading" || alertsStatus === "loading"
                  ? 0.5
                  : 1,
            }}
            title="Refresh data"
          >
            <ArrowPathIcon
              style={{
                width: 18,
                height: 18,
                color: GOV.muted,
                animation:
                  recordsStatus === "loading" || alertsStatus === "loading"
                    ? "spin 1s linear infinite"
                    : "none",
              }}
            />
          </button>
        </div>

        {/* Stats Overview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {complianceStatsData.map((stat) => (
            <div key={stat.label} style={govCardPadded}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={govKpiLabel}>{stat.label}</div>
                <ShieldCheckIcon
                  style={{ width: 20, height: 20, color: stat.color }}
                />
              </div>
              <div style={{ ...govKpiValue, color: stat.color }}>
                {stat.value}
              </div>
              {stat.percentage && (
                <div style={govKpiSub}>{stat.percentage} of total vendors</div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
          }}
        >
          {/* Left Column - Vendor Compliance List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Search and Filter */}
            <div style={govCardPadded}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1, position: "relative" }}>
                  <MagnifyingGlassIcon
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 16,
                      height: 16,
                      color: GOV.muted,
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      paddingLeft: 38,
                      paddingRight: 16,
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderRadius: 999,
                      border: `1px solid ${GOV.border}`,
                      fontSize: 13,
                      fontWeight: 500,
                      color: GOV.text,
                      background: GOV.bg,
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${GOV.border}`,
                    padding: "10px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: GOV.text,
                    background: GOV.cardBg,
                    outline: "none",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="compliant">Compliant</option>
                  <option value="warning">Warning</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
            </div>

            {/* Vendor Compliance Cards */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {filteredVendors.map((vendor) => {
                const isHovered = hoveredCard === vendor.id;
                const isAlert = vendor.status === "alert";

                return (
                  <div
                    key={vendor.id}
                    style={{
                      ...govCard,
                      padding: "18px 20px",
                      cursor: "pointer",
                      transition: "background .15s",
                      background: isHovered ? govHoverBg : GOV.cardBg,
                      borderColor: isAlert
                        ? "rgba(153,27,27,.2)"
                        : GOV.border,
                    }}
                    onMouseEnter={() => setHoveredCard(vendor.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => setSelectedVendor(vendor.id)}
                  >
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
                            href={`/government/vendors/${vendor.id}`}
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: GOV.text,
                              textDecoration: "none",
                            }}
                          >
                            {vendor.name}
                          </Link>
                          <span style={govStatusPillStyle(vendor.status)}>
                            {govStatusLabel(vendor.status)}
                          </span>
                        </div>
                        {vendor.issues > 0 && (
                          <div
                            style={{
                              fontSize: 12,
                              color: GOV.danger,
                              fontWeight: 600,
                              marginTop: 4,
                            }}
                          >
                            {vendor.issues} outstanding{" "}
                            {vendor.issues === 1 ? "issue" : "issues"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                      }}
                    >
                      <div>
                        <div style={govKpiLabel}>Last Inspection</div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: GOV.text,
                            marginTop: 3,
                          }}
                        >
                          {new Date(vendor.lastInspection).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div style={govKpiLabel}>Next Inspection</div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: GOV.text,
                            marginTop: 3,
                          }}
                        >
                          {new Date(vendor.nextInspection).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: `1px solid ${GOV.border}`,
                      }}
                    >
                      <div style={{ ...govKpiLabel, marginBottom: 8 }}>
                        Document Status
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {Object.entries(vendor.documents).map(
                          ([key, status]) => {
                            const ds = getDocStatusStyle(status);
                            return (
                              <span
                                key={key}
                                style={{
                                  display: "inline-block",
                                  padding: "3px 10px",
                                  borderRadius: 99,
                                  fontSize: 10.5,
                                  fontWeight: 600,
                                  background: ds.bg,
                                  color: ds.color,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
                                  .replace(/^./, (str) => str.toUpperCase())}
                                : {ds.symbol}
                              </span>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Recent Alerts & Quick Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Recent Alerts */}
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
                  <h2 style={govSectionHeader}>Recent Alerts</h2>
                  <p
                    style={{
                      fontSize: 11,
                      color: GOV.muted,
                      marginTop: 2,
                      fontWeight: 500,
                    }}
                  >
                    Latest compliance notifications
                  </p>
                </div>
                <span style={govViewAllLink}>View all</span>
              </div>
              <div>
                {recentAlerts.map((alert, idx) => (
                  <div
                    key={alert.id}
                    style={{
                      padding: "14px 20px",
                      borderBottom:
                        idx < recentAlerts.length - 1
                          ? `1px solid ${GOV.border}`
                          : "none",
                      background:
                        alert.severity === "high"
                          ? "rgba(212,120,60,.04)"
                          : "transparent",
                      transition: "background .15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      {alert.severity === "high" ? (
                        <ExclamationTriangleIcon
                          style={{
                            width: 17,
                            height: 17,
                            marginTop: 1,
                            color: getSeverityIconColor(alert.severity),
                            flexShrink: 0,
                          }}
                        />
                      ) : alert.severity === "medium" ? (
                        <ExclamationTriangleIcon
                          style={{
                            width: 17,
                            height: 17,
                            marginTop: 1,
                            color: getSeverityIconColor(alert.severity),
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <CheckCircleIcon
                          style={{
                            width: 17,
                            height: 17,
                            marginTop: 1,
                            color: getSeverityIconColor(alert.severity),
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 3,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: GOV.text,
                            }}
                          >
                            {alert.type}
                          </span>
                          <span style={govStatusPillStyle(alert.severity)}>
                            {govStatusLabel(alert.severity)}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: GOV.muted,
                            fontWeight: 600,
                          }}
                        >
                          {alert.vendor}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: GOV.lightMuted,
                            marginTop: 3,
                            fontWeight: 500,
                          }}
                        >
                          {alert.description}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10.5,
                              color: GOV.lightMuted,
                              fontWeight: 500,
                            }}
                          >
                            {new Date(alert.date).toLocaleDateString()}
                          </span>
                          {alert.severity === "high" && (
                            <button
                              onClick={() => handleResolveAlert(alert.id)}
                              style={{
                                ...govPrimaryButton,
                                padding: "4px 12px",
                                fontSize: 11,
                              }}
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <h2 style={govSectionHeader}>Quick Actions</h2>
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <Link
                  href="/government/reporting?type=chemical-usage"
                  style={{
                    ...govPillButton,
                    width: "100%",
                    textDecoration: "none",
                    background:
                      hoveredAction === "report" ? govHoverBg : GOV.cardBg,
                    transition: "background .15s",
                  }}
                  onMouseEnter={() => setHoveredAction("report")}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <DocumentTextIcon
                    style={{ width: 17, height: 17, color: GOV.muted }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                    Generate Compliance Report
                  </span>
                </Link>
                <button
                  style={{
                    ...govPillButton,
                    width: "100%",
                    textAlign: "left" as const,
                    background:
                      hoveredAction === "schedule" ? govHoverBg : GOV.cardBg,
                    transition: "background .15s",
                  }}
                  onMouseEnter={() => setHoveredAction("schedule")}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <ClockIcon
                    style={{ width: 17, height: 17, color: GOV.muted }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                    Schedule Inspections
                  </span>
                </button>
                <button
                  style={{
                    ...govPillButton,
                    width: "100%",
                    textAlign: "left" as const,
                    background:
                      hoveredAction === "remind" ? govHoverBg : GOV.cardBg,
                    transition: "background .15s",
                  }}
                  onMouseEnter={() => setHoveredAction("remind")}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <ExclamationTriangleIcon
                    style={{ width: 17, height: 17, color: GOV.muted }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                    Send Compliance Reminder
                  </span>
                </button>
                <Link
                  href="/government/vendors"
                  style={{
                    ...govPillButton,
                    width: "100%",
                    textDecoration: "none",
                    background:
                      hoveredAction === "vendors" ? govHoverBg : GOV.cardBg,
                    transition: "background .15s",
                  }}
                  onMouseEnter={() => setHoveredAction("vendors")}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <ShieldCheckIcon
                    style={{ width: 17, height: 17, color: GOV.muted }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                    View All Vendors
                  </span>
                </Link>
              </div>
            </div>

            {/* Compliance Checklist Template */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h2 style={govSectionHeader}>Compliance Checklist</h2>
              </div>
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  "Chemical usage reports",
                  "Organic certifications",
                  "Water quality tests",
                  "Soil analysis reports",
                  "Safety protocols",
                  "Storage inspections",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      color: GOV.text,
                    }}
                  >
                    <CheckCircleIcon
                      style={{
                        width: 16,
                        height: 16,
                        color: GOV.muted,
                        flexShrink: 0,
                      }}
                    />
                    {item}
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
