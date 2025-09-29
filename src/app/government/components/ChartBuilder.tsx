"use client";

import { useState } from "react";
import {
  ChartBarIcon,
  ChartPieIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  PlayIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  MapIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

interface Chart {
  id: string;
  name: string;
  description: string;
  chartType:
    | "line"
    | "bar"
    | "pie"
    | "area"
    | "scatter"
    | "table"
    | "metric"
    | "map";
  tableId?: string;
  tableName?: string;
  config: any;
  dataConfig: any;
  width: number;
  height: number;
  position: { x: number; y: number };
  isActive: boolean;
  lastModified: string;
  createdBy: string;
}

interface ChartTemplate {
  type:
    | "line"
    | "bar"
    | "pie"
    | "area"
    | "scatter"
    | "table"
    | "metric"
    | "map";
  name: string;
  description: string;
  icon: any;
  color: string;
  defaultConfig: any;
  defaultDataConfig: any;
}

export default function ChartBuilder() {
  const [charts, setCharts] = useState<Chart[]>([
    {
      id: "1",
      name: "Farmer Registration Trends",
      description: "Monthly farmer registration trends over the past year",
      chartType: "line",
      tableId: "1",
      tableName: "Farmer Registry",
      config: {
        colors: ["#10B981"],
        showLegend: true,
        showGrid: true,
        strokeWidth: 2,
      },
      dataConfig: {
        xAxis: "created_at",
        yAxis: "count",
        groupBy: "month",
        filters: {},
      },
      width: 6,
      height: 4,
      position: { x: 0, y: 0 },
      isActive: true,
      lastModified: "2 hours ago",
      createdBy: "John Admin",
    },
    {
      id: "2",
      name: "Vendor Performance Distribution",
      description: "Distribution of vendor performance scores",
      chartType: "pie",
      tableId: "2",
      tableName: "Vendor Performance",
      config: {
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
        showLegend: true,
        showLabels: true,
      },
      dataConfig: {
        valueField: "count",
        labelField: "performance_category",
        filters: {},
      },
      width: 4,
      height: 4,
      position: { x: 6, y: 0 },
      isActive: true,
      lastModified: "1 day ago",
      createdBy: "Sarah Manager",
    },
    {
      id: "3",
      name: "Total Active Farmers",
      description: "Key metric showing total number of active farmers",
      chartType: "metric",
      tableId: "1",
      tableName: "Farmer Registry",
      config: {
        color: "#10B981",
        showTrend: true,
        format: "number",
      },
      dataConfig: {
        metric: "count",
        filters: { status: "active" },
        comparison: "previous_month",
      },
      width: 2,
      height: 2,
      position: { x: 10, y: 0 },
      isActive: true,
      lastModified: "3 hours ago",
      createdBy: "Mike Inspector",
    },
  ]);

  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChartEditor, setShowChartEditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "line" | "bar" | "pie" | "metric"
  >("all");

  const chartTemplates: ChartTemplate[] = [
    {
      type: "line",
      name: "Line Chart",
      description: "Show trends and changes over time",
      icon: ChartBarIcon,
      color: "#3B82F6",
      defaultConfig: {
        colors: ["#3B82F6"],
        showLegend: true,
        showGrid: true,
        strokeWidth: 2,
      },
      defaultDataConfig: {
        xAxis: "date",
        yAxis: "value",
        groupBy: "day",
      },
    },
    {
      type: "bar",
      name: "Bar Chart",
      description: "Compare values across different categories",
      icon: ChartBarIcon,
      color: "#10B981",
      defaultConfig: {
        colors: ["#10B981"],
        showLegend: true,
        showGrid: true,
        orientation: "vertical",
      },
      defaultDataConfig: {
        xAxis: "category",
        yAxis: "value",
      },
    },
    {
      type: "pie",
      name: "Pie Chart",
      description: "Show proportions and percentages",
      icon: ChartPieIcon,
      color: "#8B5CF6",
      defaultConfig: {
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
        showLegend: true,
        showLabels: true,
      },
      defaultDataConfig: {
        valueField: "value",
        labelField: "label",
      },
    },
    {
      type: "area",
      name: "Area Chart",
      description: "Visualize cumulative totals over time",
      icon: ArrowTrendingUpIcon,
      color: "#F59E0B",
      defaultConfig: {
        colors: ["#F59E0B"],
        showLegend: true,
        showGrid: true,
        fillOpacity: 0.3,
      },
      defaultDataConfig: {
        xAxis: "date",
        yAxis: "value",
        groupBy: "day",
      },
    },
    {
      type: "metric",
      name: "Key Metric",
      description: "Highlight important numbers and KPIs",
      icon: ChartBarIcon,
      color: "#EF4444",
      defaultConfig: {
        color: "#EF4444",
        showTrend: true,
        format: "number",
      },
      defaultDataConfig: {
        metric: "count",
        comparison: "previous_period",
      },
    },
    {
      type: "table",
      name: "Data Table",
      description: "Display data in a structured table format",
      icon: TableCellsIcon,
      color: "#6B7280",
      defaultConfig: {
        pagination: true,
        sortable: true,
        searchable: true,
      },
      defaultDataConfig: {
        columns: [],
        limit: 10,
      },
    },
  ];

  const filteredCharts = charts.filter((chart) => {
    const matchesSearch =
      chart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chart.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || chart.chartType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateChart = (template?: ChartTemplate) => {
    if (template) {
      setSelectedChart(null);
      setShowChartEditor(true);
    } else {
      setShowCreateModal(true);
    }
  };

  const handleEditChart = (chartId: string) => {
    setSelectedChart(chartId);
    setShowChartEditor(true);
  };

  const handleDeleteChart = (chartId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this chart? This action cannot be undone."
      )
    ) {
      setCharts((prev) => prev.filter((c) => c.id !== chartId));
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case "line":
      case "bar":
        return ChartBarIcon;
      case "pie":
        return ChartPieIcon;
      case "area":
        return ArrowTrendingUpIcon;
      case "table":
        return TableCellsIcon;
      case "map":
        return MapIcon;
      default:
        return ChartBarIcon;
    }
  };

  if (showChartEditor) {
    return (
      <ChartEditor
        chart={
          selectedChart ? charts.find((c) => c.id === selectedChart) : undefined
        }
        onSave={(chart) => {
          if (selectedChart) {
            setCharts((prev) =>
              prev.map((c) => (c.id === selectedChart ? { ...c, ...chart } : c))
            );
          } else {
            setCharts((prev) => [
              ...prev,
              {
                ...chart,
                id: Date.now().toString(),
                name: chart.name || "Untitled Chart",
                description: chart.description || "No description",
                createdBy: chart.createdBy || "Unknown",
                chartType: chart.chartType || "bar",
                config: chart.config || {},
                dataConfig: chart.dataConfig || {},
                width: chart.width || 400,
                height: chart.height || 300,
                position: chart.position || { x: 0, y: 0 },
                isActive: chart.isActive || false,
                lastModified: chart.lastModified || new Date().toISOString(),
              },
            ]);
          }
          setShowChartEditor(false);
          setSelectedChart(null);
        }}
        onCancel={() => {
          setShowChartEditor(false);
          setSelectedChart(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
            Chart Builder
          </h2>
          <p className="text-gray-600 mt-1">
            Create interactive charts and visualizations from your data
          </p>
        </div>
        <button onClick={() => handleCreateChart()} className="btn btn-primary">
          <PlusIcon className="h-4 w-4" />
          Create Chart
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search charts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
          >
            <option value="all">All Charts</option>
            <option value="line">Line Charts</option>
            <option value="bar">Bar Charts</option>
            <option value="pie">Pie Charts</option>
            <option value="metric">Metrics</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      {filteredCharts.length === 0 ? (
        <div className="card text-center py-12">
          <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== "all"
              ? "No charts found"
              : "No charts yet"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Create your first chart to visualize your data with interactive graphs and metrics"}
          </p>
          {!searchTerm && filterType === "all" && (
            <button
              onClick={() => handleCreateChart()}
              className="btn btn-primary"
            >
              Create Your First Chart
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharts.map((chart) => {
            const ChartIcon = getChartIcon(chart.chartType);

            return (
              <div
                key={chart.id}
                className="card hover:shadow-lg transition-all duration-200 group"
              >
                {/* Chart Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ChartIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                        {chart.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{chart.chartType}</span>
                        {chart.tableName && (
                          <>
                            <span>•</span>
                            <span>{chart.tableName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        chart.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {chart.description}
                </p>

                {/* Chart Preview */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center h-24 text-gray-400">
                    <ChartIcon className="h-12 w-12" />
                  </div>
                </div>

                {/* Configuration Info */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">
                    Configuration
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {chart.chartType === "line" || chart.chartType === "bar" ? (
                      <>
                        <span className="px-2 py-1 bg-blue-50 text-xs text-blue-700 rounded-full">
                          X: {chart.dataConfig.xAxis}
                        </span>
                        <span className="px-2 py-1 bg-green-50 text-xs text-green-700 rounded-full">
                          Y: {chart.dataConfig.yAxis}
                        </span>
                      </>
                    ) : chart.chartType === "pie" ? (
                      <>
                        <span className="px-2 py-1 bg-purple-50 text-xs text-purple-700 rounded-full">
                          Value: {chart.dataConfig.valueField}
                        </span>
                        <span className="px-2 py-1 bg-orange-50 text-xs text-orange-700 rounded-full">
                          Label: {chart.dataConfig.labelField}
                        </span>
                      </>
                    ) : chart.chartType === "metric" ? (
                      <span className="px-2 py-1 bg-red-50 text-xs text-red-700 rounded-full">
                        Metric: {chart.dataConfig.metric}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Modified {chart.lastModified}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        /* Preview chart */
                      }}
                      className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                      title="Preview chart"
                    >
                      <PlayIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditChart(chart.id)}
                      className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                      title="Edit chart"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteChart(chart.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete chart"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Chart Modal */}
      {showCreateModal && (
        <CreateChartModal
          templates={chartTemplates}
          onClose={() => setShowCreateModal(false)}
          onCreate={(template) => {
            setShowCreateModal(false);
            handleCreateChart(template);
          }}
        />
      )}
    </div>
  );
}

// Create Chart Modal
function CreateChartModal({
  templates,
  onClose,
  onCreate,
}: {
  templates: ChartTemplate[];
  onClose: () => void;
  onCreate: (template: ChartTemplate) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                Create New Chart
              </h2>
              <p className="text-gray-600 mt-1">
                Choose a chart type to get started
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => onCreate(template)}
                className="p-6 text-left rounded-lg border border-gray-200 hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4"
                    style={{ backgroundColor: template.color }}
                  >
                    <template.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-[var(--secondary-black)] mb-2 group-hover:text-[var(--primary-accent2)] transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Chart Editor Component
function ChartEditor({
  chart,
  onSave,
  onCancel,
}: {
  chart?: Chart;
  onSave: (chart: Partial<Chart>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(chart?.name || "");
  const [description, setDescription] = useState(chart?.description || "");
  const [chartType, setChartType] = useState(chart?.chartType || "line");
  const [activeTab, setActiveTab] = useState<
    "basic" | "data" | "style" | "preview"
  >("basic");

  const handleSave = () => {
    onSave({
      name,
      description,
      chartType,
      // Add other properties as needed
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-[var(--secondary-black)]">
                {chart ? "Edit Chart" : "Create Chart"}
              </h1>
              <p className="text-sm text-gray-600">
                Configure your chart visualization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              <CheckIcon className="h-4 w-4" />
              Save Chart
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex px-4">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "data", label: "Data Source" },
            { id: "style", label: "Styling" },
            { id: "preview", label: "Preview" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--primary-accent2)] text-[var(--primary-accent2)]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "basic" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                placeholder="Enter chart name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                placeholder="Describe what this chart shows"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="area">Area Chart</option>
                <option value="scatter">Scatter Plot</option>
                <option value="table">Data Table</option>
                <option value="metric">Key Metric</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="text-center py-12">
            <Cog6ToothIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Data Configuration
            </h3>
            <p className="text-gray-600">
              Configure data sources and field mappings
            </p>
          </div>
        )}

        {activeTab === "style" && (
          <div className="text-center py-12">
            <PencilIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chart Styling
            </h3>
            <p className="text-gray-600">
              Customize colors, fonts, and appearance
            </p>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="text-center py-12">
            <EyeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chart Preview
            </h3>
            <p className="text-gray-600">Preview your chart with live data</p>
          </div>
        )}
      </div>
    </div>
  );
}
