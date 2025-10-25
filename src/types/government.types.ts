// ==================== VENDOR TYPES ====================

export interface Vendor {
  id: string;
  name: string;
  contact_person: string;
  email?: string;
  phone?: string;
  location: string;
  gps_coordinates?: {
    lat: number;
    lng: number;
  };
  total_acreage: number;
  utilized_acreage: number;
  available_acreage: number;
  crops: string[];
  compliance_status: "compliant" | "warning" | "alert";
  programs_enrolled: number;
  last_update: string;
  created_at: string;
  updated_at: string;
}

export interface VendorProduct {
  id: string;
  vendor_id: string;
  name: string;
  category: string;
  variety?: string;
  quantity_available: number;
  unit_of_measurement: string;
  price_per_unit?: number;
  harvest_date?: string;
  expected_harvest_date?: string;
  quality_grade?: string;
  organic_certified: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== PROGRAM TYPES ====================

export interface Program {
  id: string;
  name: string;
  description: string;
  status: "active" | "planning" | "completed" | "suspended";
  category: string;
  budget: number;
  budget_used: number;
  budget_percentage: number;
  participants: number;
  target_participants: number;
  start_date: string;
  end_date: string;
  benefits: string[];
  eligibility: string[];
  performance: "excellent" | "good" | "fair" | "poor" | "pending";
  created_at: string;
  updated_at: string;
}

export interface ProgramEnrollment {
  id: string;
  program_id: string;
  vendor_id: string;
  enrollment_date: string;
  status: "active" | "completed" | "withdrawn";
  performance_score?: number;
}

// ==================== REPORT TYPES ====================

export interface Report {
  id: string;
  title: string;
  type:
    | "market-requirements"
    | "quarterly-sales"
    | "available-acreage"
    | "vendor-performance"
    | "program-participation"
    | "chemical-usage"
    | "infrastructure"
    | "custom";
  description?: string;
  status: "pending" | "generating" | "completed" | "failed";
  created_by: string;
  created_at: string;
  generated_at?: string;
  file_url?: string;
  file_format?: "pdf" | "excel" | "csv" | "json";
  parameters: ReportParameters;
  error_message?: string;
}

export interface ReportParameters {
  date_range?: {
    start_date: string;
    end_date: string;
  };
  filters?: {
    location?: string;
    crop_type?: string;
    compliance_status?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface GenerateReportResponse {
  report_id: string;
  status: string;
  message: string;
  estimated_completion?: string;
}

// ==================== TABLE TYPES ====================

export interface CustomTable {
  id: string;
  name: string;
  description?: string;
  data_source: string;
  data_source_config: Record<string, any>;
  columns: TableColumn[];
  filters?: Record<string, any>;
  sort_config?: {
    column: string;
    direction: "asc" | "desc";
  };
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "boolean" | "currency" | "percentage";
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  format?: string;
  alignment?: "left" | "center" | "right";
}

export interface TableData {
  columns: TableColumn[];
  rows: Record<string, any>[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  summary?: Record<string, any>;
}

export interface TableQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  search?: string;
  filters?: Record<string, any>;
}

// ==================== CHART TYPES ====================

export interface Chart {
  id: string;
  name: string;
  description?: string;
  chart_type: "line" | "bar" | "pie" | "area" | "scatter" | "donut" | "radar";
  data_source: string;
  data_source_config: Record<string, any>;
  chart_config: ChartConfig;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface ChartConfig {
  x_axis?: {
    label: string;
    field: string;
    type?: "category" | "time" | "value";
  };
  y_axis?: {
    label: string;
    field: string;
    format?: string;
  };
  series?: {
    name: string;
    field: string;
    color?: string;
  }[];
  colors?: string[];
  legend?: {
    show: boolean;
    position: "top" | "bottom" | "left" | "right";
  };
  title?: string;
  subtitle?: string;
  [key: string]: any;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    [key: string]: any;
  }[];
  metadata?: Record<string, any>;
}

export interface ChartQueryParams {
  date_range?: {
    start_date: string;
    end_date: string;
  };
  filters?: Record<string, any>;
  aggregation?: "sum" | "avg" | "count" | "min" | "max";
}

// ==================== PERMISSION TYPES ====================

export interface Role {
  id: string;
  name: string;
  description?: string;
  is_custom: boolean;
  is_default: boolean;
  organization_id: string;
  permissions: Permission[];
  user_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  is_system: boolean;
}

export interface RolePermission {
  role: Role;
  permissions: Permission[];
}

export interface AvailablePermission {
  category: string;
  permissions: Permission[];
}

export interface PermissionChangeLog {
  id: string;
  action: "assign" | "revoke";
  role_id: string;
  role_name: string;
  permission_ids: string[];
  permission_names: string[];
  changed_by: string;
  changed_by_name: string;
  changed_at: string;
  reason?: string;
}

export interface AssignPermissionsRequest {
  role_id: string;
  permission_ids: string[];
  reason?: string;
}

export interface RevokePermissionsRequest {
  role_id: string;
  permission_ids: string[];
  reason?: string;
}

export interface CreateCustomRoleRequest {
  name: string;
  description?: string;
  permission_ids: string[];
}

export interface UpdateCustomRoleRequest {
  name?: string;
  description?: string;
  permission_ids?: string[];
}

// ==================== DATA SOURCE TYPES ====================

export interface DataSource {
  id: string;
  name: string;
  description: string;
  source_type: "database" | "api" | "file" | "manual";
  category: string;
  record_count: number;
  last_updated: string;
  refresh_frequency?: string;
  available_fields: DataField[];
  metadata?: Record<string, any>;
}

export interface DataField {
  name: string;
  label: string;
  type: "string" | "number" | "date" | "boolean";
  description?: string;
  is_filterable: boolean;
  is_sortable: boolean;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardKPI {
  label: string;
  value: string | number;
  subtext?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: string;
  urgent?: boolean;
}

export interface ActivityItem {
  id: string;
  type: "vendor" | "harvest" | "compliance" | "program" | "market";
  message: string;
  time: string;
  timestamp: string;
  urgent?: boolean;
  metadata?: Record<string, any>;
}

export interface ProgramStat {
  program_id: string;
  name: string;
  participants: number;
  budget_percentage: number;
  status: "active" | "planning" | "completed";
}

// ==================== COMPLIANCE TYPES ====================

export interface ComplianceAlert {
  id: string;
  vendor_id: string;
  vendor_name: string;
  type: "chemical_usage" | "certification" | "reporting" | "inspection";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  due_date?: string;
  created_at: string;
  resolved_at?: string;
  status: "open" | "in_progress" | "resolved" | "dismissed";
}

export interface ComplianceRecord {
  id: string;
  vendor_id: string;
  record_type: string;
  title: string;
  description?: string;
  status: "compliant" | "warning" | "non_compliant";
  recorded_at: string;
  verified_by?: string;
  documents?: ComplianceDocument[];
}

export interface ComplianceDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploaded_at: string;
}

// ==================== MARKET INSIGHTS TYPES ====================

export interface MarketTrend {
  crop: string;
  current_price: number;
  price_change: number;
  price_change_percentage: number;
  supply_level: "low" | "medium" | "high";
  demand_level: "low" | "medium" | "high";
  forecast: "increasing" | "stable" | "decreasing";
}

export interface SupplyDemandData {
  date: string;
  supply: number;
  demand: number;
  gap: number;
}

// ==================== PRODUCTION TYPES ====================

export interface ProductionCycle {
  id: string;
  vendor_id: string;
  crop: string;
  variety?: string;
  acreage: number;
  planting_date: string;
  expected_harvest_date: string;
  actual_harvest_date?: string;
  expected_yield: number;
  actual_yield?: number;
  status: "planned" | "planted" | "growing" | "harvesting" | "harvested";
  created_at: string;
  updated_at: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

// ==================== QUERY PARAMETER TYPES ====================

export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export interface VendorQueryParams extends BaseQueryParams {
  location?: string;
  compliance_status?: "compliant" | "warning" | "alert";
  crop_type?: string;
  min_acreage?: number;
  max_acreage?: number;
}

export interface ProgramQueryParams extends BaseQueryParams {
  status?: "active" | "planning" | "completed";
  category?: string;
}

export interface ReportQueryParams extends BaseQueryParams {
  type?: string;
  status?: "pending" | "generating" | "completed" | "failed";
  date_from?: string;
  date_to?: string;
}
