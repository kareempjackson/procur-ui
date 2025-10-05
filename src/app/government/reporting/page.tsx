"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

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
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get("type") as ReportType | null;

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

  const handleGenerateReport = () => {
    // Mock report generation
    const mockData = generateMockReport(selectedReport!);
    setGeneratedReport(mockData);
  };

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    console.log(`Exporting report as ${format}`);
    // TODO: Implement export functionality
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

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
            Reporting & Analytics
          </h1>
          <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
            Generate comprehensive reports on vendors, production, and market
            activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Report Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                Select Report Type
              </h2>
              <div className="space-y-2">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <button
                      key={report.id}
                      onClick={() => {
                        setSelectedReport(report.id);
                        setGeneratedReport(null);
                      }}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedReport === report.id
                          ? "border-[var(--primary-accent2)] bg-[var(--primary-accent1)]/10"
                          : "border-[color:var(--secondary-soft-highlight)] hover:border-[var(--primary-accent2)]/50 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          className={`h-5 w-5 mt-0.5 ${
                            selectedReport === report.id
                              ? "text-[var(--primary-accent2)]"
                              : "text-[color:var(--secondary-muted-edge)]"
                          }`}
                        />
                        <div className="flex-1">
                          <div
                            className={`text-sm font-medium ${
                              selectedReport === report.id
                                ? "text-[var(--primary-accent2)]"
                                : "text-[color:var(--secondary-black)]"
                            }`}
                          >
                            {report.name}
                          </div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                            {report.description}
                          </div>
                        </div>
                        {selectedReport === report.id && (
                          <CheckCircleIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Report Parameters */}
            {selectedReport && (
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Report Parameters
                </h2>
                <div className="space-y-4">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                      Date Range
                    </label>
                    <div className="space-y-2">
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
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                        />
                      </div>
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
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                      <FunnelIcon className="h-4 w-4" />
                      Filters
                    </label>
                    <div className="space-y-2">
                      <select
                        value={filters.location}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                      >
                        <option value="all">All Locations</option>
                        <option value="st-georges">St. George's</option>
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
                        className="w-full px-3 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
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
                    className="w-full px-4 py-2.5 rounded-full bg-[var(--primary-accent2)] text-white text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Report Preview */}
          <div className="lg:col-span-2">
            {!generatedReport ? (
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-12">
                <div className="text-center">
                  <DocumentTextIcon className="h-16 w-16 mx-auto text-[color:var(--secondary-muted-edge)] mb-4" />
                  <h3 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-2">
                    No Report Generated
                  </h3>
                  <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                    Select a report type and configure parameters to generate a
                    report
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
                {/* Report Header */}
                <div className="p-6 border-b border-[color:var(--secondary-soft-highlight)] bg-gray-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[color:var(--secondary-black)]">
                        {generatedReport.title}
                      </h2>
                      <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                        Generated on {new Date().toLocaleDateString()} at{" "}
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExport("pdf")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] text-sm hover:bg-gray-50 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleExport("excel")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] text-sm hover:bg-gray-50 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Excel
                      </button>
                      <button
                        onClick={() => handleExport("csv")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] text-sm hover:bg-gray-50 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        CSV
                      </button>
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div className="p-6">
                  {selectedReport === "available-acreage" &&
                    generatedReport.summary && (
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-[var(--primary-accent1)]/10 border border-[color:var(--secondary-soft-highlight)]">
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                            Total Acreage
                          </div>
                          <div className="text-2xl font-semibold text-[color:var(--secondary-black)] mt-1">
                            {generatedReport.summary.totalAcreage.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-[var(--primary-base)]/10 border border-[color:var(--secondary-soft-highlight)]">
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                            Utilized
                          </div>
                          <div className="text-2xl font-semibold text-[color:var(--primary-base)] mt-1">
                            {generatedReport.summary.utilizedAcreage.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-[var(--primary-accent2)]/10 border border-[color:var(--secondary-soft-highlight)]">
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                            Available
                          </div>
                          <div className="text-2xl font-semibold text-[color:var(--primary-accent2)] mt-1">
                            {generatedReport.summary.availableAcreage.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-[color:var(--secondary-soft-highlight)]">
                        <tr>
                          {Object.keys(generatedReport.data[0] || {}).map(
                            (key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                        {generatedReport.data.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            {Object.values(row).map(
                              (value: any, cellIdx: number) => (
                                <td
                                  key={cellIdx}
                                  className="px-4 py-3 text-sm text-[color:var(--secondary-black)]"
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
