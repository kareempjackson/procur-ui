"use client";

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
} from "@heroicons/react/24/outline";

export default function GovernmentPage() {
  // Mock data - will be replaced with real data from API
  const kpis = [
    {
      label: "Registered Vendors",
      value: "1,234",
      change: "+12%",
      trend: "up" as const,
      icon: UserGroupIcon,
    },
    {
      label: "Total Acreage",
      value: "45,678",
      subtext: "acres under cultivation",
      change: "+5%",
      trend: "up" as const,
      icon: MapIcon,
    },
    {
      label: "Available Acreage",
      value: "8,432",
      subtext: "acres not planted",
      change: "-3%",
      trend: "down" as const,
      icon: MapIcon,
    },
    {
      label: "Active Crops",
      value: "42",
      subtext: "varieties in season",
      icon: ShoppingBagIcon,
    },
    {
      label: "Market Transactions",
      value: "$2.4M",
      subtext: "this quarter",
      change: "+18%",
      trend: "up" as const,
      icon: ChartBarIcon,
    },
    {
      label: "Compliance Alerts",
      value: "7",
      subtext: "requires attention",
      urgent: true,
      icon: ExclamationTriangleIcon,
    },
  ];

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

  const programStats = [
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

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Hero Section */}
        <section className="rounded-3xl bg-[var(--primary-accent1)]/14 border border-[color:var(--secondary-soft-highlight)] px-6 sm:px-10 py-10 sm:py-14">
          <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-3">
            Government Portal
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
            Agricultural Oversight Dashboard
          </h1>
          <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)] max-w-prose">
            Monitor agricultural data, track compliance, and access reporting
            tools.
          </p>

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

            {/* Supply vs Demand Chart Placeholder */}
            <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                    Supply vs Demand
                  </h2>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                    Market balance overview
                  </p>
                </div>
                <Link
                  href="/government/market"
                  className="text-xs text-[color:var(--secondary-highlight2)] hover:text-[color:var(--secondary-muted-edge)] font-medium"
                >
                  View details →
                </Link>
              </div>
              <div className="h-64 rounded-xl bg-gradient-to-br from-[var(--primary-background)] to-white border border-[color:var(--secondary-soft-highlight)]/50 flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 mx-auto text-[color:var(--secondary-muted-edge)] mb-2" />
                  <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                    Chart visualization
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
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Active Programs
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Government incentive programs
                </p>
              </div>
              <div className="p-4 space-y-4">
                {programStats.map((program) => (
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
