"use client";

import { useState } from "react";
import {
  TableCellsIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

interface DataTable {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  dataSources: DataSource[];
  fields: TableField[];
  views: TableView[];
  isPublic: boolean;
  recordCount: number;
  lastModified: string;
  createdBy: string;
}

interface DataSource {
  id: string;
  name: string;
  table: string;
  filters?: Record<string, any>;
}

interface TableField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "boolean" | "select" | "email" | "phone";
  required: boolean;
  visible: boolean;
  width?: number;
  config?: any;
}

interface TableView {
  id: string;
  name: string;
  type: "table" | "kanban" | "calendar" | "gallery";
  filters?: any;
  sorts?: any;
  grouping?: any;
}

export default function TableManager() {
  const [tables, setTables] = useState<DataTable[]>([
    {
      id: "1",
      name: "Farmer Registry",
      description:
        "Complete database of registered farmers in our jurisdiction",
      icon: "🌾",
      color: "#10B981",
      dataSources: [{ id: "farmers", name: "Farmers", table: "organizations" }],
      fields: [
        {
          id: "name",
          name: "Farm Name",
          type: "text",
          required: true,
          visible: true,
        },
        {
          id: "owner",
          name: "Owner",
          type: "text",
          required: true,
          visible: true,
        },
        {
          id: "size",
          name: "Farm Size (acres)",
          type: "number",
          required: false,
          visible: true,
        },
        {
          id: "location",
          name: "Location",
          type: "text",
          required: true,
          visible: true,
        },
        {
          id: "phone",
          name: "Phone",
          type: "phone",
          required: false,
          visible: true,
        },
        {
          id: "email",
          name: "Email",
          type: "email",
          required: false,
          visible: true,
        },
      ],
      views: [
        { id: "all", name: "All Farmers", type: "table" },
        {
          id: "large",
          name: "Large Farms",
          type: "table",
          filters: { size: { gte: 100 } },
        },
      ],
      isPublic: true,
      recordCount: 1247,
      lastModified: "2 hours ago",
      createdBy: "John Admin",
    },
    {
      id: "2",
      name: "Vendor Performance",
      description: "Track vendor performance metrics and compliance scores",
      icon: "📊",
      color: "#3B82F6",
      dataSources: [{ id: "vendors", name: "Vendors", table: "organizations" }],
      fields: [
        {
          id: "name",
          name: "Vendor Name",
          type: "text",
          required: true,
          visible: true,
        },
        {
          id: "score",
          name: "Performance Score",
          type: "number",
          required: false,
          visible: true,
        },
        {
          id: "compliance",
          name: "Compliance Status",
          type: "select",
          required: false,
          visible: true,
        },
        {
          id: "lastReview",
          name: "Last Review",
          type: "date",
          required: false,
          visible: true,
        },
      ],
      views: [
        { id: "all", name: "All Vendors", type: "table" },
        {
          id: "top",
          name: "Top Performers",
          type: "table",
          sorts: { score: "desc" },
        },
      ],
      isPublic: false,
      recordCount: 89,
      lastModified: "1 day ago",
      createdBy: "Sarah Manager",
    },
  ]);

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTableBuilder, setShowTableBuilder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "private">(
    "all"
  );

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "public" && table.isPublic) ||
      (filterType === "private" && !table.isPublic);
    return matchesSearch && matchesFilter;
  });

  const handleCreateTable = () => {
    setShowCreateModal(true);
  };

  const handleEditTable = (tableId: string) => {
    setSelectedTable(tableId);
    setShowTableBuilder(true);
  };

  const handleDeleteTable = (tableId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this table? This action cannot be undone."
      )
    ) {
      setTables((prev) => prev.filter((t) => t.id !== tableId));
    }
  };

  if (showTableBuilder) {
    return (
      <TableBuilder
        table={
          selectedTable ? tables.find((t) => t.id === selectedTable) : undefined
        }
        onSave={(table) => {
          if (selectedTable) {
            setTables((prev) =>
              prev.map((t) => (t.id === selectedTable ? { ...t, ...table } : t))
            );
          } else {
            setTables((prev) => [
              ...prev,
              {
                ...table,
                id: Date.now().toString(),
                name: table.name || "Untitled Table",
                description: table.description || "No description",
                icon: table.icon || "TableCellsIcon",
                color: table.color || "blue",
                dataSources: table.dataSources || [],
                fields: table.fields || [],
                views: table.views || [],
                isPublic: table.isPublic || false,
                recordCount: table.recordCount || 0,
                lastModified: table.lastModified || new Date().toISOString(),
                createdBy: table.createdBy || "Unknown",
              },
            ]);
          }
          setShowTableBuilder(false);
          setSelectedTable(null);
        }}
        onCancel={() => {
          setShowTableBuilder(false);
          setSelectedTable(null);
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
            Data Tables
          </h2>
          <p className="text-gray-600 mt-1">
            Create and manage custom data tables for your organization
          </p>
        </div>
        <button onClick={handleCreateTable} className="btn btn-primary">
          <PlusIcon className="h-4 w-4" />
          Create Table
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tables..."
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
            <option value="all">All Tables</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Tables Grid */}
      {filteredTables.length === 0 ? (
        <div className="card text-center py-12">
          <TableCellsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== "all"
              ? "No tables found"
              : "No tables yet"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Create your first data table to organize and display information from various sources"}
          </p>
          {!searchTerm && filterType === "all" && (
            <button onClick={handleCreateTable} className="btn btn-primary">
              Create Your First Table
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              {/* Table Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: `${table.color}20`,
                      color: table.color,
                    }}
                  >
                    {table.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                      {table.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{table.recordCount.toLocaleString()} records</span>
                      {table.isPublic && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <EyeIcon className="h-3 w-3" />
                            Public
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {table.description}
              </p>

              {/* Data Sources */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Data Sources</div>
                <div className="flex flex-wrap gap-1">
                  {table.dataSources.map((source) => (
                    <span
                      key={source.id}
                      className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full"
                    >
                      {source.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fields Preview */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">
                  Fields ({table.fields.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {table.fields.slice(0, 3).map((field) => (
                    <span
                      key={field.id}
                      className="px-2 py-1 bg-blue-50 text-xs text-blue-700 rounded-full"
                    >
                      {field.name}
                    </span>
                  ))}
                  {table.fields.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-xs text-gray-500 rounded-full">
                      +{table.fields.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Modified {table.lastModified}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditTable(table.id)}
                    className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                    title="Edit table"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      /* View table data */
                    }}
                    className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                    title="View data"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete table"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Table Modal */}
      {showCreateModal && (
        <CreateTableModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => {
            setShowCreateModal(false);
            setShowTableBuilder(true);
          }}
        />
      )}
    </div>
  );
}

// Create Table Modal
function CreateTableModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: () => void;
}) {
  const templates = [
    {
      name: "Farmer Registry",
      description: "Track farmers and agricultural businesses",
      icon: "🌾",
      color: "#10B981",
      fields: ["Farm Name", "Owner", "Size", "Location", "Contact Info"],
    },
    {
      name: "Vendor Database",
      description: "Manage vendor information and performance",
      icon: "🏢",
      color: "#3B82F6",
      fields: [
        "Company Name",
        "Contact Person",
        "Services",
        "Performance Score",
      ],
    },
    {
      name: "Product Catalog",
      description: "Track products and inventory",
      icon: "📦",
      color: "#8B5CF6",
      fields: ["Product Name", "Category", "Price", "Stock", "Supplier"],
    },
    {
      name: "Custom Table",
      description: "Start from scratch with a blank table",
      icon: "📋",
      color: "#6B7280",
      fields: ["Fully customizable fields"],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                Create New Table
              </h2>
              <p className="text-gray-600 mt-1">
                Choose a template or start from scratch
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
                onClick={onCreate}
                className="p-6 text-left rounded-lg border border-gray-200 hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                    style={{
                      backgroundColor: `${template.color}20`,
                      color: template.color,
                    }}
                  >
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--secondary-black)] mb-2 group-hover:text-[var(--primary-accent2)] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      Includes: {template.fields.join(", ")}
                    </div>
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

// Table Builder Component
function TableBuilder({
  table,
  onSave,
  onCancel,
}: {
  table?: DataTable;
  onSave: (table: Partial<DataTable>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(table?.name || "");
  const [description, setDescription] = useState(table?.description || "");
  const [icon, setIcon] = useState(table?.icon || "📋");
  const [color, setColor] = useState(table?.color || "#6B7280");
  const [fields, setFields] = useState<TableField[]>(table?.fields || []);
  const [activeTab, setActiveTab] = useState<
    "basic" | "fields" | "sources" | "views"
  >("basic");

  const addField = () => {
    const newField: TableField = {
      id: `field-${Date.now()}`,
      name: "New Field",
      type: "text",
      required: false,
      visible: true,
    };
    setFields((prev) => [...prev, newField]);
  };

  const updateField = (index: number, updates: Partial<TableField>) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, ...updates } : field))
    );
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      icon,
      color,
      fields,
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
                {table ? "Edit Table" : "Create Table"}
              </h1>
              <p className="text-sm text-gray-600">Configure your data table</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              <CheckIcon className="h-4 w-4" />
              Save Table
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex px-4">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "fields", label: "Fields" },
            { id: "sources", label: "Data Sources" },
            { id: "views", label: "Views" },
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
                Table Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                placeholder="Enter table name"
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
                placeholder="Describe what this table is for"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  placeholder="📋"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "fields" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[var(--secondary-black)]">
                  Table Fields
                </h3>
                <p className="text-sm text-gray-600">
                  Define the columns for your table
                </p>
              </div>
              <button onClick={addField} className="btn btn-primary">
                <PlusIcon className="h-4 w-4" />
                Add Field
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="card">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          updateField(index, { name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) =>
                          updateField(index, { type: e.target.value as any })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="boolean">Boolean</option>
                        <option value="select">Select</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            updateField(index, { required: e.target.checked })
                          }
                          className="rounded border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                        />
                        <span className="text-sm text-gray-700">Required</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.visible}
                          onChange={(e) =>
                            updateField(index, { visible: e.target.checked })
                          }
                          className="rounded border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                        />
                        <span className="text-sm text-gray-700">Visible</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-end pt-6">
                      <button
                        onClick={() => removeField(index)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <TableCellsIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>No fields defined yet</p>
                  <button onClick={addField} className="btn btn-primary mt-4">
                    Add Your First Field
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sources" && (
          <div className="text-center py-12">
            <Cog6ToothIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Data Sources
            </h3>
            <p className="text-gray-600">
              Configure where your table data comes from
            </p>
          </div>
        )}

        {activeTab === "views" && (
          <div className="text-center py-12">
            <EyeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Table Views
            </h3>
            <p className="text-gray-600">Create different views of your data</p>
          </div>
        )}
      </div>
    </div>
  );
}
