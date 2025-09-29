"use client";

import { useState, useRef, useCallback } from "react";
import {
  ChartBarIcon,
  ChartPieIcon,
  TableCellsIcon,
  PlusIcon,
  XMarkIcon,
  Cog6ToothIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface DashboardComponent {
  id: string;
  type: "chart" | "table" | "metric" | "text";
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
  data?: any;
}

interface ComponentTemplate {
  type: "chart" | "table" | "metric" | "text";
  title: string;
  icon: any;
  description: string;
  defaultSize: { width: number; height: number };
  defaultConfig: any;
}

export default function DashboardBuilder() {
  const [components, setComponents] = useState<DashboardComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showComponentPanel, setShowComponentPanel] = useState(true);
  const [dashboardTitle, setDashboardTitle] = useState("New Dashboard");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const componentTemplates: ComponentTemplate[] = [
    {
      type: "chart",
      title: "Line Chart",
      icon: ChartBarIcon,
      description: "Display trends over time",
      defaultSize: { width: 400, height: 300 },
      defaultConfig: { chartType: "line", xAxis: "date", yAxis: "value" },
    },
    {
      type: "chart",
      title: "Bar Chart",
      icon: ChartBarIcon,
      description: "Compare values across categories",
      defaultSize: { width: 400, height: 300 },
      defaultConfig: { chartType: "bar", xAxis: "category", yAxis: "value" },
    },
    {
      type: "chart",
      title: "Pie Chart",
      icon: ChartPieIcon,
      description: "Show proportions and percentages",
      defaultSize: { width: 350, height: 350 },
      defaultConfig: {
        chartType: "pie",
        valueField: "value",
        labelField: "label",
      },
    },
    {
      type: "table",
      title: "Data Table",
      icon: TableCellsIcon,
      description: "Display structured data in rows and columns",
      defaultSize: { width: 500, height: 400 },
      defaultConfig: { columns: [], pagination: true, sortable: true },
    },
    {
      type: "metric",
      title: "Key Metric",
      icon: ChartBarIcon,
      description: "Highlight important numbers and KPIs",
      defaultSize: { width: 200, height: 150 },
      defaultConfig: { metric: "Total", value: "0", trend: "neutral" },
    },
    {
      type: "text",
      title: "Text Block",
      icon: PencilIcon,
      description: "Add descriptions and context",
      defaultSize: { width: 300, height: 100 },
      defaultConfig: { content: "Enter your text here...", fontSize: 14 },
    },
  ];

  const addComponent = useCallback((template: ComponentTemplate) => {
    const newComponent: DashboardComponent = {
      id: `component-${Date.now()}`,
      type: template.type,
      title: template.title,
      position: { x: 50, y: 50 },
      size: template.defaultSize,
      config: template.defaultConfig,
    };

    setComponents((prev) => [...prev, newComponent]);
    setSelectedComponent(newComponent.id);
  }, []);

  const updateComponent = useCallback(
    (id: string, updates: Partial<DashboardComponent>) => {
      setComponents((prev) =>
        prev.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp))
      );
    },
    []
  );

  const deleteComponent = useCallback(
    (id: string) => {
      setComponents((prev) => prev.filter((comp) => comp.id !== id));
      if (selectedComponent === id) {
        setSelectedComponent(null);
      }
    },
    [selectedComponent]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string) => {
      if (isPreviewMode) return;

      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
      setSelectedComponent(componentId);
    },
    [components, isPreviewMode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !selectedComponent || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      updateComponent(selectedComponent, {
        position: { x: Math.max(0, newX), y: Math.max(0, newY) },
      });
    },
    [isDragging, selectedComponent, dragOffset, updateComponent]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const renderComponent = (component: DashboardComponent) => {
    const isSelected = selectedComponent === component.id;

    return (
      <div
        key={component.id}
        className={`absolute border-2 rounded-lg bg-white shadow-sm transition-all ${
          isSelected
            ? "border-[var(--primary-accent2)] shadow-lg"
            : "border-gray-200 hover:border-gray-300"
        } ${!isPreviewMode ? "cursor-move" : ""}`}
        style={{
          left: component.position.x,
          top: component.position.y,
          width: component.size.width,
          height: component.size.height,
        }}
        onMouseDown={(e) => handleMouseDown(e, component.id)}
      >
        {/* Component Header */}
        {!isPreviewMode && (
          <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <span className="text-sm font-medium text-gray-700">
              {component.title}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Open config panel
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Cog6ToothIcon className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Component Content */}
        <div
          className={`p-4 ${
            !isPreviewMode ? "pt-2" : ""
          } h-full flex items-center justify-center`}
        >
          {component.type === "chart" && (
            <div className="text-center text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">{component.config.chartType} Chart</p>
              <p className="text-xs text-gray-400">Configure data source</p>
            </div>
          )}

          {component.type === "table" && (
            <div className="text-center text-gray-500">
              <TableCellsIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Data Table</p>
              <p className="text-xs text-gray-400">Configure columns</p>
            </div>
          )}

          {component.type === "metric" && (
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--secondary-black)] mb-1">
                {component.config.value}
              </div>
              <div className="text-sm text-gray-600">
                {component.config.metric}
              </div>
            </div>
          )}

          {component.type === "text" && (
            <div className="w-full h-full">
              <div className="text-sm text-gray-700 leading-relaxed">
                {component.config.content}
              </div>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        {!isPreviewMode && isSelected && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-[var(--primary-accent2)] rounded-tl-lg cursor-se-resize opacity-75 hover:opacity-100 transition-opacity" />
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Component Panel */}
      {showComponentPanel && !isPreviewMode && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                Components
              </h3>
              <button
                onClick={() => setShowComponentPanel(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Drag components onto the canvas to build your dashboard
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {componentTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => addComponent(template)}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[var(--primary-accent2)]/10 transition-colors">
                      <template.icon className="h-5 w-5 text-gray-600 group-hover:text-[var(--primary-accent2)] transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--secondary-black)] mb-1">
                        {template.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!showComponentPanel && !isPreviewMode && (
                <button
                  onClick={() => setShowComponentPanel(true)}
                  className="btn btn-ghost"
                >
                  <PlusIcon className="h-4 w-4" />
                  Components
                </button>
              )}

              <input
                type="text"
                value={dashboardTitle}
                onChange={(e) => setDashboardTitle(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none outline-none text-[var(--secondary-black)] min-w-0"
                placeholder="Dashboard Title"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`btn ${isPreviewMode ? "btn-primary" : "btn-ghost"}`}
              >
                <EyeIcon className="h-4 w-4" />
                {isPreviewMode ? "Exit Preview" : "Preview"}
              </button>

              <button className="btn btn-ghost">
                <DocumentArrowDownIcon className="h-4 w-4" />
                Export
              </button>

              <button className="btn btn-primary">Save Dashboard</button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <div
            ref={canvasRef}
            className="relative min-h-full min-w-full bg-white m-4 rounded-lg shadow-sm border border-gray-200"
            style={{ minHeight: "800px", minWidth: "1200px" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {components.length === 0 && !isPreviewMode && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ChartBarIcon className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Start Building Your Dashboard
                  </h3>
                  <p className="text-sm mb-4">
                    Add components from the panel to get started
                  </p>
                  {!showComponentPanel && (
                    <button
                      onClick={() => setShowComponentPanel(true)}
                      className="btn btn-primary"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Components
                    </button>
                  )}
                </div>
              </div>
            )}

            {components.map(renderComponent)}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedComponent && !isPreviewMode && (
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
              Properties
            </h3>
          </div>
          <div className="p-4">
            <ComponentProperties
              component={components.find((c) => c.id === selectedComponent)!}
              onUpdate={(updates) =>
                updateComponent(selectedComponent, updates)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Component Properties Panel
function ComponentProperties({
  component,
  onUpdate,
}: {
  component: DashboardComponent;
  onUpdate: (updates: Partial<DashboardComponent>) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Basic Properties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={component.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
        />
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">X</label>
            <input
              type="number"
              value={component.position.x}
              onChange={(e) =>
                onUpdate({
                  position: {
                    ...component.position,
                    x: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[var(--primary-accent2)]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Y</label>
            <input
              type="number"
              value={component.position.y}
              onChange={(e) =>
                onUpdate({
                  position: {
                    ...component.position,
                    y: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[var(--primary-accent2)]"
            />
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <input
              type="number"
              value={component.size.width}
              onChange={(e) =>
                onUpdate({
                  size: {
                    ...component.size,
                    width: parseInt(e.target.value) || 100,
                  },
                })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[var(--primary-accent2)]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Height</label>
            <input
              type="number"
              value={component.size.height}
              onChange={(e) =>
                onUpdate({
                  size: {
                    ...component.size,
                    height: parseInt(e.target.value) || 100,
                  },
                })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[var(--primary-accent2)]"
            />
          </div>
        </div>
      </div>

      {/* Component-specific properties */}
      {component.type === "chart" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Type
          </label>
          <select
            value={component.config.chartType}
            onChange={(e) =>
              onUpdate({
                config: { ...component.config, chartType: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
      )}

      {component.type === "metric" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metric Label
            </label>
            <input
              type="text"
              value={component.config.metric}
              onChange={(e) =>
                onUpdate({
                  config: { ...component.config, metric: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="text"
              value={component.config.value}
              onChange={(e) =>
                onUpdate({
                  config: { ...component.config, value: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
            />
          </div>
        </>
      )}

      {component.type === "text" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={component.config.content}
            onChange={(e) =>
              onUpdate({
                config: { ...component.config, content: e.target.value },
              })
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
}
