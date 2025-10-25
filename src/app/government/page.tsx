"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  UserGroupIcon,
  MapIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchVendors,
  selectVendors,
  selectVendorsStatus,
  selectVendorStats,
} from "@/store/slices/governmentVendorsSlice";
import {
  fetchPrograms,
  selectPrograms,
  selectProgramsStatus,
  selectProgramStats,
} from "@/store/slices/governmentProgramsSlice";

export default function GovernmentPage() {
  const dispatch = useAppDispatch();

  // Redux state
  const vendors = useAppSelector(selectVendors);
  const vendorsStatus = useAppSelector(selectVendorsStatus);
  const vendorStats = useAppSelector(selectVendorStats);

  const programs = useAppSelector(selectPrograms);
  const programsStatus = useAppSelector(selectProgramsStatus);
  const programStats = useAppSelector(selectProgramStats);

  // Fetch data on mount
  useEffect(() => {
    if (vendorsStatus === "idle") {
      dispatch(fetchVendors({ page: 1, limit: 100 }));
    }
  }, [vendorsStatus, dispatch]);

  useEffect(() => {
    if (programsStatus === "idle") {
      dispatch(fetchPrograms({ page: 1, limit: 20 }));
    }
  }, [programsStatus, dispatch]);

  // Calculate active crops from vendor data
  const activeCrops = useMemo(() => {
    if (vendors.length === 0) return 0;
    const uniqueCrops = new Set<string>();
    vendors.forEach((vendor) => {
      // Safety check: ensure crops exists and is an array
      if (vendor.crops && Array.isArray(vendor.crops)) {
        vendor.crops.forEach((crop) => uniqueCrops.add(crop));
      }
    });
    return uniqueCrops.size;
  }, [vendors]);

  // Calculate available acreage
  const availableAcreage = useMemo(() => {
    if (!vendorStats) return 0;
    return vendorStats.totalAcreage - vendorStats.utilizedAcreage;
  }, [vendorStats]);

  // Build KPIs from real data
  const kpis = useMemo(
    () => [
      {
        label: "Registered Vendors",
        value:
          vendorsStatus === "loading"
            ? "..."
            : (vendorStats?.total || 0).toString(),
        change: "+12%",
        trend: "up" as const,
        icon: UserGroupIcon,
      },
      {
        label: "Total Acreage",
        value:
          vendorsStatus === "loading"
            ? "..."
            : (vendorStats?.totalAcreage || 0).toLocaleString(),
        subtext: "acres under cultivation",
        change: "+5%",
        trend: "up" as const,
        icon: MapIcon,
      },
      {
        label: "Available Acreage",
        value:
          vendorsStatus === "loading"
            ? "..."
            : availableAcreage.toLocaleString(),
        subtext: "acres not planted",
        change: availableAcreage > 0 ? "-3%" : "0%",
        trend: "down" as const,
        icon: MapIcon,
      },
      {
        label: "Active Crops",
        value: vendorsStatus === "loading" ? "..." : activeCrops.toString(),
        subtext: "varieties in season",
        icon: ShoppingBagIcon,
      },
      {
        label: "Active Programs",
        value:
          programsStatus === "loading"
            ? "..."
            : (programStats?.active || 0).toString(),
        subtext: `${programStats?.total || 0} total`,
        change: "+18%",
        trend: "up" as const,
        icon: ChartBarIcon,
      },
      {
        label: "Compliance Alerts",
        value:
          vendorsStatus === "loading"
            ? "..."
            : (
                (vendorStats?.warning || 0) + (vendorStats?.alert || 0)
              ).toString(),
        subtext: "requires attention",
        urgent: (vendorStats?.warning || 0) + (vendorStats?.alert || 0) > 0,
        icon: ExclamationTriangleIcon,
      },
    ],
    [
      vendorsStatus,
      vendorStats,
      programsStatus,
      programStats,
      activeCrops,
      availableAcreage,
    ]
  );

  const quickActions = [
    {
      label: "Register New Vendor",
      href: "/government/vendors/new",
      primary: true,
    },
    {
      label: "Upload Product",
      href: "/government/products/upload",
      primary: false,
    },
    { label: "Generate Report", href: "/government/reporting", primary: false },
    {
      label: "View Compliance",
      href: "/government/compliance",
      primary: false,
    },
  ];

  const recentActivity = [
    {
      type: "vendor",
      message: "New vendor registered: Green Valley Farms",
      time: "2 hours ago",
    },
    {
      type: "harvest",
      message: "Harvest completed: 500kg Tomatoes - Sunrise Farm",
      time: "5 hours ago",
    },
    {
      type: "compliance",
      message: "Compliance alert: Chemical usage report overdue",
      time: "1 day ago",
      urgent: true,
    },
    {
      type: "program",
      message: "15 vendors enrolled in Irrigation Support Program",
      time: "2 days ago",
    },
    {
      type: "market",
      message: "Market demand spike: Organic Lettuce",
      time: "3 days ago",
    },
  ];

  // Get top 3 programs by participants
  const topPrograms = useMemo(() => {
    if (programs.length === 0) {
      // Fallback mock data
      return [
        {
          name: "Irrigation Support Program",
          participants: 234,
          budget: "85%",
          status: "active",
        },
        {
          name: "Organic Certification",
          participants: 156,
          budget: "62%",
          status: "active",
        },
        {
          name: "Youth Farmer Initiative",
          participants: 89,
          budget: "45%",
          status: "active",
        },
      ];
    }

    return programs
      .filter((p) => p.status === "active")
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 3)
      .map((p) => ({
        name: p.name,
        participants: p.participants,
        budget: `${p.budget_percentage}%`,
        status: p.status,
      }));
  }, [programs]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchVendors({ page: 1, limit: 100 }));
    dispatch(fetchPrograms({ page: 1, limit: 20 }));
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Hero Section */}
        <section className="rounded-3xl bg-[var(--primary-accent1)]/14 border border-[color:var(--secondary-soft-highlight)] px-6 sm:px-10 py-10 sm:py-14">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-3">
                Government Portal
                {(vendorsStatus === "loading" ||
                  programsStatus === "loading") &&
                  " • Loading..."}
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
                Agricultural Oversight Dashboard
              </h1>
              <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)] max-w-prose">
                Monitor agricultural data, track compliance, and access
                reporting tools.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={
                vendorsStatus === "loading" || programsStatus === "loading"
              }
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-white border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${
                  vendorsStatus === "loading" || programsStatus === "loading"
                    ? "animate-spin"
                    : ""
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2 ${
                  action.primary
                    ? "bg-[var(--secondary-highlight2)] text-white hover:bg-[var(--secondary-muted-edge)]"
                    : "border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-black)] hover:bg-white/50"
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </section>

        {/* KPI Cards Grid */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`rounded-2xl border bg-white p-6 hover:shadow-sm transition-shadow ${
                kpi.urgent
                  ? "border-[var(--secondary-highlight2)]/30 bg-[var(--secondary-highlight2)]/5"
                  : "border-[color:var(--secondary-soft-highlight)]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                    {kpi.label}
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-[color:var(--secondary-black)]">
                    {kpi.value}
                  </div>
                  {kpi.subtext && (
                    <div className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
                      {kpi.subtext}
                    </div>
                  )}
                  {kpi.change && (
                    <div className="mt-2 flex items-center gap-1">
                      {kpi.trend === "up" ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-[color:var(--primary-base)]" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-[color:var(--secondary-highlight2)]" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          kpi.trend === "up"
                            ? "text-[color:var(--primary-base)]"
                            : "text-[color:var(--secondary-highlight2)]"
                        }`}
                      >
                        {kpi.change}
                      </span>
                      <span className="text-xs text-[color:var(--secondary-muted-edge)]">
                        vs last period
                      </span>
                    </div>
                  )}
                </div>
                <kpi.icon
                  className={`h-8 w-8 ${
                    kpi.urgent
                      ? "text-[var(--secondary-highlight2)]"
                      : "text-[color:var(--secondary-muted-edge)]"
                  }`}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Recent Activity
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Latest updates across the platform
                </p>
              </div>
              <div className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                {recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className={`p-4 hover:bg-gray-50/50 transition-colors ${
                      activity.urgent
                        ? "bg-[var(--secondary-highlight2)]/5"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-2 w-2 rounded-full mt-2 ${
                          activity.urgent
                            ? "bg-[var(--secondary-highlight2)]"
                            : "bg-[var(--primary-base)]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[color:var(--secondary-black)]">
                          {activity.message}
                        </p>
                        <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[color:var(--secondary-soft-highlight)]">
                <Link
                  href="/government/activity"
                  className="text-sm text-[color:var(--secondary-highlight2)] hover:text-[color:var(--secondary-muted-edge)] font-medium"
                >
                  View all activity →
                </Link>
              </div>
            </section>

            {/* Supply vs Demand Chart */}
            <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                    Supply vs Demand
                  </h2>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                    Market balance overview (kg per week)
                  </p>
                </div>
                <Link
                  href="/government/market"
                  className="text-xs text-[color:var(--secondary-highlight2)] hover:text-[color:var(--secondary-muted-edge)] font-medium"
                >
                  View details →
                </Link>
              </div>
              <div className="flex items-center justify-end gap-4 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[var(--primary-base)]"></div>
                  <span className="text-[color:var(--secondary-muted-edge)]">
                    Supply
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[var(--secondary-highlight2)]"></div>
                  <span className="text-[color:var(--secondary-muted-edge)]">
                    Demand
                  </span>
                </div>
              </div>
              <div className="h-80 relative">
                <svg viewBox="0 0 800 300" className="w-full h-full">
                  {/* Grid lines */}
                  <line
                    x1="60"
                    y1="0"
                    x2="60"
                    y2="240"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <line
                    x1="60"
                    y1="240"
                    x2="780"
                    y2="240"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />

                  {/* Horizontal grid lines */}
                  <line
                    x1="60"
                    y1="0"
                    x2="780"
                    y2="0"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <line
                    x1="60"
                    y1="60"
                    x2="780"
                    y2="60"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <line
                    x1="60"
                    y1="120"
                    x2="780"
                    y2="120"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <line
                    x1="60"
                    y1="180"
                    x2="780"
                    y2="180"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />

                  {/* Y-axis labels */}
                  <text
                    x="50"
                    y="245"
                    textAnchor="end"
                    className="text-[10px] fill-[var(--secondary-muted-edge)]"
                  >
                    0
                  </text>
                  <text
                    x="50"
                    y="185"
                    textAnchor="end"
                    className="text-[10px] fill-[var(--secondary-muted-edge)]"
                  >
                    2,500
                  </text>
                  <text
                    x="50"
                    y="125"
                    textAnchor="end"
                    className="text-[10px] fill-[var(--secondary-muted-edge)]"
                  >
                    5,000
                  </text>
                  <text
                    x="50"
                    y="65"
                    textAnchor="end"
                    className="text-[10px] fill-[var(--secondary-muted-edge)]"
                  >
                    7,500
                  </text>
                  <text
                    x="50"
                    y="5"
                    textAnchor="end"
                    className="text-[10px] fill-[var(--secondary-muted-edge)]"
                  >
                    10,000
                  </text>

                  {/* Tomatoes */}
                  <rect
                    x="80"
                    y="72"
                    width="35"
                    height="168"
                    fill="#2D7A3E"
                    rx="4"
                  />
                  <rect
                    x="120"
                    y="96"
                    width="35"
                    height="144"
                    fill="#DC2626"
                    rx="4"
                  />
                  <text
                    x="117.5"
                    y="270"
                    textAnchor="middle"
                    className="text-[11px] fill-[var(--secondary-black)]"
                  >
                    Tomatoes
                  </text>

                  {/* Lettuce */}
                  <rect
                    x="200"
                    y="120"
                    width="35"
                    height="120"
                    fill="#2D7A3E"
                    rx="4"
                  />
                  <rect
                    x="240"
                    y="144"
                    width="35"
                    height="96"
                    fill="#DC2626"
                    rx="4"
                  />
                  <text
                    x="237.5"
                    y="270"
                    textAnchor="middle"
                    className="text-[11px] fill-[var(--secondary-black)]"
                  >
                    Lettuce
                  </text>

                  {/* Carrots */}
                  <rect
                    x="320"
                    y="144"
                    width="35"
                    height="96"
                    fill="#2D7A3E"
                    rx="4"
                  />
                  <rect
                    x="360"
                    y="120"
                    width="35"
                    height="120"
                    fill="#DC2626"
                    rx="4"
                  />
                  <text
                    x="357.5"
                    y="270"
                    textAnchor="middle"
                    className="text-[11px] fill-[var(--secondary-black)]"
                  >
                    Carrots
                  </text>

                  {/* Peppers */}
                  <rect
                    x="440"
                    y="168"
                    width="35"
                    height="72"
                    fill="#2D7A3E"
                    rx="4"
                  />
                  <rect
                    x="480"
                    y="192"
                    width="35"
                    height="48"
                    fill="#DC2626"
                    rx="4"
                  />
                  <text
                    x="477.5"
                    y="270"
                    textAnchor="middle"
                    className="text-[11px] fill-[var(--secondary-black)]"
                  >
                    Peppers
                  </text>

                  {/* Cucumbers */}
                  <rect
                    x="560"
                    y="96"
                    width="35"
                    height="144"
                    fill="#2D7A3E"
                    rx="4"
                  />
                  <rect
                    x="600"
                    y="108"
                    width="35"
                    height="132"
                    fill="#DC2626"
                    rx="4"
                  />
                  <text
                    x="597.5"
                    y="270"
                    textAnchor="middle"
                    className="text-[11px] fill-[var(--secondary-black)]"
                  >
                    Cucumbers
                  </text>

                  {/* Cabbage */}
                  <rect
                    x="680"
                    y="180"
                    width="35"
                    height="60"
                    fill="#2D7A3E"
                    rx="4"
                  />
                  <rect
                    x="720"
                    y="204"
                    width="35"
                    height="36"
                    fill="#DC2626"
                    rx="4"
                  />
                  <text
                    x="717.5"
                    y="270"
                    textAnchor="middle"
                    className="text-[11px] fill-[var(--secondary-black)]"
                  >
                    Cabbage
                  </text>

                  {/* Value labels */}
                  <text
                    x="97.5"
                    y="67"
                    textAnchor="middle"
                    className="text-[10px] fill-[var(--secondary-black)] font-medium"
                  >
                    7,000
                  </text>
                  <text
                    x="137.5"
                    y="91"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    6,000
                  </text>
                  <text
                    x="217.5"
                    y="115"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    5,000
                  </text>
                  <text
                    x="257.5"
                    y="139"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    4,000
                  </text>
                  <text
                    x="337.5"
                    y="139"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    4,000
                  </text>
                  <text
                    x="377.5"
                    y="115"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    5,000
                  </text>
                  <text
                    x="457.5"
                    y="163"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    3,000
                  </text>
                  <text
                    x="497.5"
                    y="187"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    2,000
                  </text>
                  <text
                    x="577.5"
                    y="91"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    6,000
                  </text>
                  <text
                    x="617.5"
                    y="103"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    5,500
                  </text>
                  <text
                    x="697.5"
                    y="175"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    2,500
                  </text>
                  <text
                    x="737.5"
                    y="199"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    1,500
                  </text>
                </svg>
              </div>
              <div className="mt-4 pt-4 border-t border-[color:var(--secondary-soft-highlight)] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-[color:var(--secondary-muted-edge)]">
                    Highest Supply
                  </div>
                  <div className="font-medium text-[color:var(--secondary-black)] mt-1">
                    Tomatoes (7,000 kg)
                  </div>
                </div>
                <div>
                  <div className="text-[color:var(--secondary-muted-edge)]">
                    Highest Demand
                  </div>
                  <div className="font-medium text-[color:var(--secondary-black)] mt-1">
                    Tomatoes (6,000 kg)
                  </div>
                </div>
                <div>
                  <div className="text-[color:var(--secondary-muted-edge)]">
                    Supply Gap
                  </div>
                  <div className="font-medium text-[color:var(--primary-base)] mt-1">
                    +1,000 kg surplus
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Programs & Quick Links */}
          <div className="space-y-8">
            {/* Government Programs */}
            <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                      Active Programs
                    </h2>
                    <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                      Government incentive programs
                    </p>
                  </div>
                  {programsStatus === "loading" && (
                    <span className="text-xs text-[color:var(--secondary-muted-edge)]">
                      Loading...
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-4">
                {topPrograms.map((program) => (
                  <div
                    key={program.name}
                    className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-4 bg-gray-50/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-[color:var(--secondary-black)]">
                        {program.name}
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-[var(--primary-base)]/10 text-[color:var(--primary-base)] px-2 py-0.5 text-[10px] font-medium">
                        {program.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[color:var(--secondary-muted-edge)]">
                      <span>{program.participants} participants</span>
                      <span>{program.budget} budget used</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[color:var(--secondary-soft-highlight)]">
                <Link
                  href="/government/programs"
                  className="text-sm text-[color:var(--secondary-highlight2)] hover:text-[color:var(--secondary-muted-edge)] font-medium"
                >
                  Manage programs →
                </Link>
              </div>
            </section>

            {/* Quick Reports */}
            <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Quick Reports
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href="/government/reporting?type=market-requirements"
                  className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                    Market Requirements
                  </div>
                </Link>
                <Link
                  href="/government/reporting?type=quarterly-sales"
                  className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                    Quarterly Sales Report
                  </div>
                </Link>
                <Link
                  href="/government/reporting?type=available-acreage"
                  className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                    Available Acreage
                  </div>
                </Link>
                <Link
                  href="/government/reporting?type=vendor-performance"
                  className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                    Vendor Performance
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
