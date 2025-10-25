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

export default function CompliancePage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

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
          color: "text-[color:var(--primary-base)]",
        },
        {
          label: "Pending Reviews",
          value: stats.pendingReviews?.toString() || "0",
          trend: "neutral",
          color: "text-yellow-600",
        },
        {
          label: "Active Alerts",
          value: stats.activeAlerts?.toString() || "0",
          trend: "down",
          color: "text-[color:var(--secondary-highlight2)]",
        },
        {
          label: "Inspections Due",
          value: stats.inspectionsDue?.toString() || "0",
          trend: "up",
          color: "text-orange-600",
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
        color: "text-[color:var(--primary-base)]",
      },
      {
        label: "Pending Reviews",
        value: "23",
        trend: "neutral",
        color: "text-yellow-600",
      },
      {
        label: "Active Alerts",
        value: "7",
        trend: "down",
        color: "text-[color:var(--secondary-highlight2)]",
      },
      {
        label: "Inspections Due",
        value: "12",
        trend: "up",
        color: "text-orange-600",
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "compliant":
        return {
          label: "Compliant",
          color: "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]",
          icon: CheckCircleIcon,
        };
      case "warning":
        return {
          label: "Warning",
          color: "bg-yellow-100 text-yellow-800",
          icon: ExclamationTriangleIcon,
        };
      case "alert":
        return {
          label: "Alert",
          color:
            "bg-[var(--secondary-highlight2)]/10 text-[color:var(--secondary-highlight2)]",
          icon: ExclamationTriangleIcon,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: ClockIcon,
        };
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          color:
            "bg-[var(--secondary-highlight2)]/10 text-[color:var(--secondary-highlight2)]",
          icon: ExclamationTriangleIcon,
        };
      case "medium":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: ExclamationTriangleIcon,
        };
      case "low":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: CheckCircleIcon,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: ClockIcon,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              Compliance Monitoring
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
              Track vendor compliance status, inspections, and regulatory
              requirements
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={recordsStatus === "loading" || alertsStatus === "loading"}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <ArrowPathIcon
              className={`h-5 w-5 text-gray-600 ${
                recordsStatus === "loading" || alertsStatus === "loading"
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {complianceStatsData.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                  {stat.label}
                </div>
                <ShieldCheckIcon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-semibold ${stat.color}`}>
                {stat.value}
              </div>
              {stat.percentage && (
                <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                  {stat.percentage} of total vendors
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vendor Compliance List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] transition-all duration-200 shadow-sm focus:shadow-md bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="compliant">Compliant</option>
                  <option value="warning">Warning</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
            </div>

            {/* Vendor Compliance Cards */}
            <div className="space-y-4">
              {filteredVendors.map((vendor) => {
                const statusConfig = getStatusConfig(vendor.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={vendor.id}
                    className={`rounded-2xl border bg-white p-6 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                      vendor.status === "alert"
                        ? "border-[var(--secondary-highlight2)]/30"
                        : "border-[color:var(--secondary-soft-highlight)]"
                    }`}
                    onClick={() => setSelectedVendor(vendor.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/government/vendors/${vendor.id}`}
                            className="text-lg font-semibold text-[color:var(--secondary-black)] hover:text-[var(--secondary-highlight2)] transition-colors duration-200"
                          >
                            {vendor.name}
                          </Link>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusConfig.label}
                          </span>
                        </div>
                        {vendor.issues > 0 && (
                          <div className="text-sm text-[color:var(--secondary-highlight2)] mt-1">
                            {vendor.issues} outstanding{" "}
                            {vendor.issues === 1 ? "issue" : "issues"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                          Last Inspection
                        </div>
                        <div className="text-sm text-[color:var(--secondary-black)]">
                          {new Date(vendor.lastInspection).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-1">
                          Next Inspection
                        </div>
                        <div className="text-sm text-[color:var(--secondary-black)]">
                          {new Date(vendor.nextInspection).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[color:var(--secondary-soft-highlight)]">
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-2">
                        Document Status
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(vendor.documents).map(
                          ([key, status]) => (
                            <span
                              key={key}
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${
                                status === "up-to-date"
                                  ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                                  : status === "expiring-soon"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-[var(--secondary-highlight2)]/10 text-[color:var(--secondary-highlight2)]"
                              }`}
                            >
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .replace(/^./, (str) => str.toUpperCase())}
                              :{" "}
                              {status === "up-to-date"
                                ? "✓"
                                : status === "expiring-soon"
                                ? "⚠"
                                : "✗"}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Recent Alerts & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Recent Alerts
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Latest compliance notifications
                </p>
              </div>
              <div className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                {recentAlerts.map((alert) => {
                  const severityConfig = getSeverityConfig(alert.severity);
                  const SeverityIcon = severityConfig.icon;

                  return (
                    <div
                      key={alert.id}
                      className="p-4 hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <SeverityIcon
                          className={`h-5 w-5 mt-0.5 ${
                            alert.severity === "high"
                              ? "text-[color:var(--secondary-highlight2)]"
                              : alert.severity === "medium"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                              {alert.type}
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityConfig.color}`}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                            {alert.vendor}
                          </div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                            {alert.description}
                          </div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-2">
                            {new Date(alert.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Quick Actions
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href="/government/reporting?type=chemical-usage"
                  className="flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium shadow-sm hover:shadow-md"
                >
                  <DocumentTextIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  Generate Compliance Report
                </Link>
                <button className="w-full flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium text-left shadow-sm hover:shadow-md">
                  <ClockIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  Schedule Inspections
                </button>
                <button className="w-full flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium text-left shadow-sm hover:shadow-md">
                  <ExclamationTriangleIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  Send Compliance Reminder
                </button>
                <Link
                  href="/government/vendors"
                  className="flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium shadow-sm hover:shadow-md"
                >
                  <ShieldCheckIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  View All Vendors
                </Link>
              </div>
            </div>

            {/* Compliance Checklist Template */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Compliance Checklist
                </h2>
              </div>
              <div className="p-4 space-y-3">
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
                    className="flex items-center gap-2 text-sm text-[color:var(--secondary-black)]"
                  >
                    <CheckCircleIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
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
