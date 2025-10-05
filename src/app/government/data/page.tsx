"use client";

import { useState } from "react";
import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  TableCellsIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function DataPage() {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "json">(
    "csv"
  );

  const datasets = [
    {
      id: "vendor-data",
      name: "Vendor Information",
      description:
        "Complete vendor profiles including contact and farm details",
      recordCount: "1,234",
      lastUpdated: "2024-10-04",
      category: "Vendors",
    },
    {
      id: "production-data",
      name: "Production Records",
      description:
        "Planting dates, crop types, expected harvests, and actual yields",
      recordCount: "5,678",
      lastUpdated: "2024-10-04",
      category: "Production",
    },
    {
      id: "acreage-data",
      name: "Land Acreage Data",
      description: "Total, utilized, and available acreage per vendor",
      recordCount: "1,234",
      lastUpdated: "2024-10-04",
      category: "Land",
    },
    {
      id: "chemical-usage",
      name: "Chemical Usage Records",
      description:
        "Agricultural chemicals used, dosages, and application dates",
      recordCount: "3,456",
      lastUpdated: "2024-10-03",
      category: "Compliance",
    },
    {
      id: "market-transactions",
      name: "Market Transactions",
      description: "Sales data, quantities, and transaction values",
      recordCount: "8,901",
      lastUpdated: "2024-10-04",
      category: "Market",
    },
    {
      id: "infrastructure",
      name: "Infrastructure Inventory",
      description: "Irrigation systems, greenhouses, storage facilities",
      recordCount: "1,234",
      lastUpdated: "2024-10-02",
      category: "Infrastructure",
    },
    {
      id: "program-participation",
      name: "Program Participation",
      description: "Government program enrollment and performance metrics",
      recordCount: "2,345",
      lastUpdated: "2024-10-01",
      category: "Programs",
    },
    {
      id: "compliance-records",
      name: "Compliance Records",
      description: "Inspection reports, certifications, and compliance status",
      recordCount: "4,567",
      lastUpdated: "2024-10-04",
      category: "Compliance",
    },
  ];

  const visualizations = [
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

  const handleExport = (datasetId: string) => {
    console.log(`Exporting ${datasetId} as ${exportFormat}`);
    // TODO: Implement actual export functionality
  };

  const categories = [...new Set(datasets.map((dataset) => dataset.category))];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
            Data & Analytics
          </h1>
          <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
            Access, visualize, and export agricultural data across all vendors
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Total Datasets
            </div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--secondary-black)]">
              {datasets.length}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Total Records
            </div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--secondary-black)]">
              27.9K
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Last Updated
            </div>
            <div className="mt-2 text-xl font-semibold text-[color:var(--secondary-black)]">
              Today
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Visualizations
            </div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--secondary-black)]">
              {visualizations.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Export Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Export Configuration */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                Export Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) =>
                      setExportFormat(
                        e.target.value as "csv" | "excel" | "json"
                      )
                    }
                    className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md bg-white"
                  >
                    <option value="csv">CSV</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Available Datasets */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                  Available Datasets
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Select a dataset to export or analyze
                </p>
              </div>

              {/* Datasets by Category */}
              <div className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                {categories.map((category) => (
                  <div key={category} className="p-4">
                    <div className="text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-3">
                      {category}
                    </div>
                    <div className="space-y-3">
                      {datasets
                        .filter((dataset) => dataset.category === category)
                        .map((dataset) => (
                          <div
                            key={dataset.id}
                            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                              selectedDataset === dataset.id
                                ? "border-[var(--secondary-highlight2)] bg-[var(--primary-accent1)]/10 shadow-md"
                                : "border-[color:var(--secondary-soft-highlight)] hover:border-[var(--secondary-highlight2)]/50 hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedDataset(dataset.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <TableCellsIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                                  <h3 className="font-medium text-sm text-[color:var(--secondary-black)]">
                                    {dataset.name}
                                  </h3>
                                </div>
                                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                                  {dataset.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-[color:var(--secondary-muted-edge)]">
                                  <span>{dataset.recordCount} records</span>
                                  <span>•</span>
                                  <span>
                                    Updated{" "}
                                    {new Date(
                                      dataset.lastUpdated
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExport(dataset.id);
                                }}
                                className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--secondary-highlight2)] text-white text-xs font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 shadow-lg hover:shadow-xl"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                Export
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visualizations */}
          <div className="space-y-6">
            {/* Data Visualizations */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Data Visualizations
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Interactive charts and graphs
                </p>
              </div>
              <div className="p-4 space-y-3">
                {visualizations.map((viz) => (
                  <button
                    key={viz.id}
                    className="w-full p-4 rounded-2xl border border-[color:var(--secondary-soft-highlight)] hover:border-[var(--secondary-highlight2)] hover:bg-gray-50 transition-all duration-200 text-left shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <ChartBarIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)] mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-[color:var(--secondary-black)]">
                          {viz.name}
                        </div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                          {viz.description}
                        </div>
                        <div className="inline-flex items-center rounded-full bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)] px-2 py-0.5 text-xs mt-2">
                          {viz.type}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Export */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Quick Export
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium text-left shadow-sm hover:shadow-md">
                  <DocumentArrowDownIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  Export All Vendor Data
                </button>
                <button className="w-full flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium text-left shadow-sm hover:shadow-md">
                  <DocumentArrowDownIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  Export Production Records
                </button>
                <button className="w-full flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium text-left shadow-sm hover:shadow-md">
                  <DocumentArrowDownIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  Export Market Data
                </button>
                <button className="w-full flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-50 transition-all duration-200 text-sm text-[color:var(--secondary-black)] font-medium text-left shadow-sm hover:shadow-md">
                  <FunnelIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  Custom Data Query
                </button>
              </div>
            </div>

            {/* Data Summary */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-[var(--primary-accent1)]/10 p-6">
              <h3 className="text-sm font-semibold text-[color:var(--secondary-black)] mb-3">
                Data Coverage
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[color:var(--secondary-muted-edge)]">
                    Vendors
                  </span>
                  <span className="font-medium text-[color:var(--secondary-black)]">
                    1,234
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--secondary-muted-edge)]">
                    Production Cycles
                  </span>
                  <span className="font-medium text-[color:var(--secondary-black)]">
                    5,678
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--secondary-muted-edge)]">
                    Transactions
                  </span>
                  <span className="font-medium text-[color:var(--secondary-black)]">
                    8,901
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--secondary-muted-edge)]">
                    Total Acreage
                  </span>
                  <span className="font-medium text-[color:var(--secondary-black)]">
                    45,678
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
