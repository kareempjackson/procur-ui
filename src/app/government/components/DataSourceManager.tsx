"use client";

import { useState } from "react";
import {
  CircleStackIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  CloudIcon,
  ServerIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

interface DataSource {
  id: string;
  name: string;
  description: string;
  type: "database" | "api" | "file" | "external";
  status: "connected" | "disconnected" | "error";
  connectionString?: string;
  lastSync: string;
  recordCount: number;
  tables: string[];
  createdBy: string;
  createdAt: string;
}

interface DataSourceTemplate {
  type: "database" | "api" | "file" | "external";
  name: string;
  description: string;
  icon: any;
  color: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "password" | "number" | "select";
    required: boolean;
    options?: string[];
  }>;
}

export default function DataSourceManager() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Farmers Database",
      description: "Main database containing farmer registration data",
      type: "database",
      status: "connected",
      connectionString: "postgresql://localhost:5432/farmers",
      lastSync: "2 minutes ago",
      recordCount: 1247,
      tables: ["organizations", "products", "certifications"],
      createdBy: "System Admin",
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Vendor API",
      description: "External API for vendor performance data",
      type: "api",
      status: "connected",
      connectionString: "https://api.vendors.gov/v1",
      lastSync: "1 hour ago",
      recordCount: 89,
      tables: ["vendor_scores", "compliance_records"],
      createdBy: "John Admin",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "3",
      name: "Legacy CSV Import",
      description: "Historical data from legacy systems",
      type: "file",
      status: "error",
      lastSync: "3 days ago",
      recordCount: 0,
      tables: [],
      createdBy: "Sarah Manager",
      createdAt: "2024-02-01T14:20:00Z",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const dataSourceTemplates: DataSourceTemplate[] = [
    {
      type: "database",
      name: "Database Connection",
      description: "Connect to PostgreSQL, MySQL, or other databases",
      icon: ServerIcon,
      color: "#3B82F6",
      fields: [
        { name: "host", label: "Host", type: "text", required: true },
        { name: "port", label: "Port", type: "number", required: true },
        {
          name: "database",
          label: "Database Name",
          type: "text",
          required: true,
        },
        { name: "username", label: "Username", type: "text", required: true },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
        },
      ],
    },
    {
      type: "api",
      name: "REST API",
      description: "Connect to external REST APIs",
      icon: CloudIcon,
      color: "#10B981",
      fields: [
        { name: "url", label: "API URL", type: "text", required: true },
        {
          name: "method",
          label: "HTTP Method",
          type: "select",
          required: true,
          options: ["GET", "POST"],
        },
        {
          name: "headers",
          label: "Headers (JSON)",
          type: "text",
          required: false,
        },
        {
          name: "auth_token",
          label: "Auth Token",
          type: "password",
          required: false,
        },
      ],
    },
    {
      type: "file",
      name: "File Upload",
      description: "Upload CSV, Excel, or JSON files",
      icon: TableCellsIcon,
      color: "#8B5CF6",
      fields: [
        {
          name: "file_type",
          label: "File Type",
          type: "select",
          required: true,
          options: ["CSV", "Excel", "JSON"],
        },
        {
          name: "delimiter",
          label: "Delimiter (for CSV)",
          type: "text",
          required: false,
        },
        {
          name: "has_header",
          label: "Has Header Row",
          type: "select",
          required: true,
          options: ["Yes", "No"],
        },
      ],
    },
    {
      type: "external",
      name: "External Service",
      description: "Connect to government or third-party services",
      icon: CircleStackIcon,
      color: "#F59E0B",
      fields: [
        {
          name: "service_url",
          label: "Service URL",
          type: "text",
          required: true,
        },
        { name: "api_key", label: "API Key", type: "password", required: true },
        {
          name: "service_type",
          label: "Service Type",
          type: "select",
          required: true,
          options: ["Government API", "Third Party", "Other"],
        },
      ],
    },
  ];

  const filteredDataSources = dataSources.filter(
    (ds) =>
      ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "disconnected":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <CircleStackIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "database":
        return ServerIcon;
      case "api":
        return CloudIcon;
      case "file":
        return TableCellsIcon;
      case "external":
        return CircleStackIcon;
      default:
        return CircleStackIcon;
    }
  };

  const handleCreateDataSource = () => {
    setSelectedDataSource(null);
    setShowCreateModal(true);
  };

  const handleEditDataSource = (id: string) => {
    setSelectedDataSource(id);
    setShowCreateModal(true);
  };

  const handleDeleteDataSource = (id: string) => {
    const dataSource = dataSources.find((ds) => ds.id === id);
    if (!dataSource) return;

    if (
      confirm(
        `Are you sure you want to delete "${dataSource.name}"? This will affect any tables or charts using this data source.`
      )
    ) {
      setDataSources((prev) => prev.filter((ds) => ds.id !== id));
    }
  };

  const handleTestConnection = (id: string) => {
    // Simulate testing connection
    alert(
      "Testing connection... This would validate the data source configuration."
    );
  };

  const handleSyncData = (id: string) => {
    // Simulate syncing data
    setDataSources((prev) =>
      prev.map((ds) =>
        ds.id === id
          ? { ...ds, lastSync: "Just now", status: "connected" as const }
          : ds
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
            Data Sources
          </h2>
          <p className="text-gray-600 mt-1">
            Manage connections to databases, APIs, and external services
          </p>
        </div>
        <button onClick={handleCreateDataSource} className="btn btn-primary">
          <PlusIcon className="h-4 w-4" />
          Add Data Source
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search data sources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
        />
      </div>

      {/* Data Sources Grid */}
      {filteredDataSources.length === 0 ? (
        <div className="card text-center py-12">
          <CircleStackIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm
              ? "No data sources found"
              : "No data sources configured"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Connect to databases, APIs, and external services to power your dashboards and reports"}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateDataSource}
              className="btn btn-primary"
            >
              Add Your First Data Source
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDataSources.map((dataSource) => {
            const TypeIcon = getTypeIcon(dataSource.type);

            return (
              <div
                key={dataSource.id}
                className="card hover:shadow-lg transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--secondary-black)]">
                        {dataSource.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{dataSource.type}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(dataSource.status)}
                          <span className="capitalize">
                            {dataSource.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {dataSource.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-[var(--secondary-black)]">
                      {dataSource.recordCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Records</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-[var(--secondary-black)]">
                      {dataSource.tables.length}
                    </div>
                    <div className="text-xs text-gray-600">Tables</div>
                  </div>
                </div>

                {/* Tables */}
                {dataSource.tables.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">
                      Available Tables
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dataSource.tables.slice(0, 2).map((table) => (
                        <span
                          key={table}
                          className="px-2 py-1 bg-blue-50 text-xs text-blue-700 rounded-full"
                        >
                          {table}
                        </span>
                      ))}
                      {dataSource.tables.length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-xs text-gray-500 rounded-full">
                          +{dataSource.tables.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Synced {dataSource.lastSync}
                  </div>
                  <div className="flex items-center gap-1">
                    {dataSource.status === "connected" && (
                      <button
                        onClick={() => handleSyncData(dataSource.id)}
                        className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                        title="Sync data"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleTestConnection(dataSource.id)}
                      className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                      title="Test connection"
                    >
                      <CircleStackIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditDataSource(dataSource.id)}
                      className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                      title="Edit data source"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDataSource(dataSource.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete data source"
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

      {/* Create Data Source Modal */}
      {showCreateModal && (
        <CreateDataSourceModal
          dataSource={
            selectedDataSource
              ? dataSources.find((ds) => ds.id === selectedDataSource)
              : undefined
          }
          templates={dataSourceTemplates}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedDataSource(null);
          }}
          onSave={(dataSourceData) => {
            if (selectedDataSource) {
              setDataSources((prev) =>
                prev.map((ds) =>
                  ds.id === selectedDataSource
                    ? { ...ds, ...dataSourceData }
                    : ds
                )
              );
            } else {
              setDataSources((prev) => [
                ...prev,
                {
                  ...dataSourceData,
                  id: Date.now().toString(),
                  name: dataSourceData.name || "Untitled Data Source",
                  description: dataSourceData.description || "No description",
                  type: dataSourceData.type || "database",
                  createdBy: dataSourceData.createdBy || "Unknown",
                  status: "disconnected" as const,
                  lastSync: "Never",
                  recordCount: 0,
                  tables: [],
                  createdAt: new Date().toISOString(),
                },
              ]);
            }
            setShowCreateModal(false);
            setSelectedDataSource(null);
          }}
        />
      )}
    </div>
  );
}

// Create Data Source Modal
function CreateDataSourceModal({
  dataSource,
  templates,
  onClose,
  onSave,
}: {
  dataSource?: DataSource;
  templates: DataSourceTemplate[];
  onClose: () => void;
  onSave: (dataSource: Partial<DataSource>) => void;
}) {
  const [step, setStep] = useState<"template" | "configure">("template");
  const [selectedTemplate, setSelectedTemplate] =
    useState<DataSourceTemplate | null>(null);
  const [name, setName] = useState(dataSource?.name || "");
  const [description, setDescription] = useState(dataSource?.description || "");
  const [config, setConfig] = useState<Record<string, any>>({});

  const handleTemplateSelect = (template: DataSourceTemplate) => {
    setSelectedTemplate(template);
    setStep("configure");
  };

  const handleSave = () => {
    if (!name || !selectedTemplate) {
      alert("Please fill in all required fields");
      return;
    }

    onSave({
      name,
      description,
      type: selectedTemplate.type,
      createdBy: "Current User", // This would come from auth context
    });
  };

  if (step === "template" && !dataSource) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Add Data Source
                </h2>
                <p className="text-gray-600 mt-1">
                  Choose a data source type to get started
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-6 text-left rounded-lg border border-gray-200 hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: template.color }}
                    >
                      <template.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--secondary-black)] mb-2 group-hover:text-[var(--primary-accent2)] transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                {dataSource ? "Edit Data Source" : "Configure Data Source"}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedTemplate
                  ? `Configure your ${selectedTemplate.name.toLowerCase()}`
                  : "Update data source settings"}
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

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                placeholder="Enter data source name"
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
                placeholder="Describe this data source"
              />
            </div>
          </div>

          {/* Configuration Fields */}
          {selectedTemplate && (
            <div>
              <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                Connection Settings
              </h3>
              <div className="space-y-4">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && "*"}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={config[field.name] || ""}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            [field.name]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={config[field.name] || ""}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            [field.name]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <CheckIcon className="h-4 w-4" />
            {dataSource ? "Update Data Source" : "Create Data Source"}
          </button>
        </div>
      </div>
    </div>
  );
}
