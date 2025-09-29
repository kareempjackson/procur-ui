"use client";

import { useState } from "react";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import {
  ChartBarIcon,
  TableCellsIcon,
  UserGroupIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  BoltIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import DashboardBuilder from "./components/DashboardBuilder";
import TableManager from "./components/TableManager";
import ChartBuilder from "./components/ChartBuilder";
import RoleManager from "./components/RoleManager";

interface DashboardItem {
  id: string;
  name: string;
  description: string;
  type: "dashboard" | "table" | "chart" | "report";
  lastModified: string;
  isPublic: boolean;
  createdBy: string;
}

interface QuickStat {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export default function GovernmentDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "dashboards" | "tables" | "charts" | "reports" | "roles"
  >("overview");

  // Mock data - in real app this would come from API
  const quickStats: QuickStat[] = [
    { label: "Active Dashboards", value: "12", change: "+2", trend: "up" },
    { label: "Data Tables", value: "8", change: "+1", trend: "up" },
    { label: "Charts Created", value: "24", change: "+5", trend: "up" },
    { label: "Reports Generated", value: "156", change: "+12", trend: "up" },
  ];

  const recentDashboards: DashboardItem[] = [
    {
      id: "1",
      name: "Procurement Overview",
      description: "High-level view of procurement activities and spending",
      type: "dashboard",
      lastModified: "2 hours ago",
      isPublic: true,
      createdBy: "John Admin",
    },
    {
      id: "2",
      name: "Vendor Performance",
      description: "Track vendor performance metrics and compliance",
      type: "dashboard",
      lastModified: "1 day ago",
      isPublic: false,
      createdBy: "Sarah Manager",
    },
    {
      id: "3",
      name: "Farmer Registry",
      description: "Complete database of registered farmers",
      type: "table",
      lastModified: "3 days ago",
      isPublic: true,
      createdBy: "Mike Inspector",
    },
  ];

  const features = [
    {
      title: "Custom Dashboards",
      description: "Create flexible dashboards with drag-and-drop components",
      icon: ChartBarIcon,
      href: "#dashboards",
      color: "bg-blue-500",
    },
    {
      title: "Data Tables",
      description: "Build custom tables to organize and display your data",
      icon: TableCellsIcon,
      href: "#tables",
      color: "bg-green-500",
    },
    {
      title: "Charts & Analytics",
      description: "Visualize data with interactive charts and graphs",
      icon: ChartPieIcon,
      href: "#charts",
      color: "bg-purple-500",
    },
    {
      title: "Role Management",
      description: "Manage user roles and permissions across your organization",
      icon: UserGroupIcon,
      href: "#roles",
      color: "bg-orange-500",
    },
    {
      title: "Report Builder",
      description: "Generate comprehensive reports for stakeholders",
      icon: DocumentChartBarIcon,
      href: "#reports",
      color: "bg-red-500",
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings and preferences",
      icon: CogIcon,
      href: "/government/settings",
      color: "bg-gray-500",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BuildingLibraryIcon },
    { id: "dashboards", label: "Dashboards", icon: ChartBarIcon },
    { id: "tables", label: "Tables", icon: TableCellsIcon },
    { id: "charts", label: "Charts", icon: ChartPieIcon },
    { id: "reports", label: "Reports", icon: DocumentChartBarIcon },
    { id: "roles", label: "Roles", icon: UserGroupIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-[var(--secondary-black)]">
                        {stat.value}
                      </p>
                    </div>
                    {stat.change && (
                      <div
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {stat.change}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all">
                  <PlusIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <span className="font-medium">Create Dashboard</span>
                </button>
                <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all">
                  <TableCellsIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <span className="font-medium">New Data Table</span>
                </button>
                <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all">
                  <ChartPieIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <span className="font-medium">Create Chart</span>
                </button>
              </div>
            </div>

            {/* Recent Items */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Recent Items
                </h3>
                <button className="text-sm text-[var(--primary-accent2)] hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentDashboards.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          item.type === "dashboard"
                            ? "bg-blue-100"
                            : item.type === "table"
                            ? "bg-green-100"
                            : item.type === "chart"
                            ? "bg-purple-100"
                            : "bg-red-100"
                        }`}
                      >
                        {item.type === "dashboard" && (
                          <ChartBarIcon className="h-5 w-5 text-blue-600" />
                        )}
                        {item.type === "table" && (
                          <TableCellsIcon className="h-5 w-5 text-green-600" />
                        )}
                        {item.type === "chart" && (
                          <ChartPieIcon className="h-5 w-5 text-purple-600" />
                        )}
                        {item.type === "report" && (
                          <DocumentChartBarIcon className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--secondary-black)]">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Modified {item.lastModified}</span>
                          <span>by {item.createdBy}</span>
                          {item.isPublic && (
                            <span className="flex items-center gap-1">
                              <EyeIcon className="h-3 w-3" />
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "dashboards":
        return <DashboardBuilder />;

      case "tables":
        return <TableManager />;

      case "charts":
        return <ChartBuilder />;

      case "reports":
        return <ReportBuilder />;

      case "roles":
        return <RoleManager />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--secondary-black)]">
              Government Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Create custom dashboards, manage data, and build analytics tools
              for your organization
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/government/reporting" className="btn btn-ghost">
              <DocumentChartBarIcon className="h-4 w-4" />
              Reports
            </Link>
            <Link href="/government/vendors" className="btn btn-ghost">
              <UserGroupIcon className="h-4 w-4" />
              Vendors
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid - Only show on overview */}
      {activeTab === "overview" && (
        <section className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => {
                  if (feature.href.startsWith("#")) {
                    setActiveTab(feature.href.slice(1) as any);
                  }
                }}
                className="card text-left hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2 group-hover:text-[var(--primary-accent2)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-[var(--primary-accent2)] transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--primary-accent2)] text-[var(--primary-accent2)]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>

      <Footer />
    </div>
  );
}

// Report Builder Component
function ReportBuilder() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
          Report Builder
        </h2>
        <button className="btn btn-primary">
          <PlusIcon className="h-4 w-4" />
          Create Report
        </button>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <DocumentChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Generate Comprehensive Reports
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create detailed reports combining data from multiple sources.
            Schedule automatic generation and share with stakeholders.
          </p>
          <button className="btn btn-primary">Create Your First Report</button>
        </div>
      </div>
    </div>
  );
}
