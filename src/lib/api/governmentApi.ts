import { getApiClient } from "../apiClient";
import {
  Vendor,
  VendorProduct,
  Program,
  Report,
  GenerateReportResponse,
  CustomTable,
  TableData,
  TableQueryParams,
  Chart,
  ChartData,
  ChartQueryParams,
  DataSource,
  Role,
  RolePermission,
  AvailablePermission,
  PermissionChangeLog,
  AssignPermissionsRequest,
  RevokePermissionsRequest,
  CreateCustomRoleRequest,
  UpdateCustomRoleRequest,
  PaginatedResponse,
  ApiResponse,
  VendorQueryParams,
  ProgramQueryParams,
  ReportQueryParams,
} from "@/types/government.types";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

// ==================== GOVERNMENT API CLIENT ====================

export const governmentApi = {
  // ==================== VENDORS & OPERATIONS ====================

  /**
   * Get all farmers/vendors in the government's jurisdiction
   */
  getFarmers: async (params?: VendorQueryParams): Promise<Vendor[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/farmers", { params });
    return response.data;
  },

  /**
   * Get products for a specific farmer/vendor
   */
  getFarmerProducts: async (farmerId: string): Promise<VendorProduct[]> => {
    const api = getApiClient(getToken);
    const response = await api.get(`/government/farmers/${farmerId}/products`);
    return response.data;
  },

  // Get all products across all farmers
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    vendor_id?: string;
  }): Promise<ApiResponse<VendorProduct[]>> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/products", { params });
    return response.data;
  },

  /**
   * Create a new vendor/farmer
   */
  createVendor: async (data: any): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.post("/government/farmers", data);
    return response.data;
  },

  /**
   * Create a product for a specific farmer/vendor (government upload)
   */
  createFarmerProduct: async (
    farmerId: string,
    data: any
  ): Promise<VendorProduct> => {
    const api = getApiClient(getToken);
    const response = await api.post(
      `/government/farmers/${farmerId}/products`,
      data
    );
    return response.data;
  },

  /**
   * Update a farmer's product (government can edit for data corrections)
   */
  updateFarmerProduct: async (
    farmerId: string,
    productId: string,
    data: Partial<VendorProduct>
  ): Promise<VendorProduct> => {
    const api = getApiClient(getToken);
    const response = await api.put(
      `/government/farmers/${farmerId}/products/${productId}`,
      data
    );
    return response.data;
  },

  // ==================== TABLES MANAGEMENT ====================

  /**
   * Get all custom tables
   */
  getTables: async (
    params?: TableQueryParams
  ): Promise<PaginatedResponse<CustomTable>> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/tables", { params });
    return response.data;
  },

  /**
   * Get a specific table by ID
   */
  getTable: async (tableId: string): Promise<CustomTable> => {
    const api = getApiClient(getToken);
    const response = await api.get(`/government/tables/${tableId}`);
    return response.data;
  },

  /**
   * Create a new custom table
   */
  createTable: async (data: Partial<CustomTable>): Promise<CustomTable> => {
    const api = getApiClient(getToken);
    const response = await api.post("/government/tables", data);
    return response.data;
  },

  /**
   * Update an existing table
   */
  updateTable: async (
    tableId: string,
    data: Partial<CustomTable>
  ): Promise<CustomTable> => {
    const api = getApiClient(getToken);
    const response = await api.put(`/government/tables/${tableId}`, data);
    return response.data;
  },

  /**
   * Delete a table
   */
  deleteTable: async (
    tableId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const api = getApiClient(getToken);
    const response = await api.delete(`/government/tables/${tableId}`);
    return response.data;
  },

  /**
   * Get data for a specific table
   */
  getTableData: async (
    tableId: string,
    params?: TableQueryParams
  ): Promise<TableData> => {
    const api = getApiClient(getToken);
    const response = await api.get(`/government/tables/${tableId}/data`, {
      params,
    });
    return response.data;
  },

  /**
   * Update a record in a table
   */
  updateTableRecord: async (
    tableId: string,
    recordId: string,
    data: Record<string, any>
  ): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.put(
      `/government/tables/${tableId}/data/${recordId}`,
      data
    );
    return response.data;
  },

  // ==================== CHARTS ====================

  /**
   * Get all charts
   */
  getCharts: async (
    params?: TableQueryParams
  ): Promise<PaginatedResponse<Chart>> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/charts", { params });
    return response.data;
  },

  /**
   * Get a specific chart by ID
   */
  getChart: async (chartId: string): Promise<Chart> => {
    const api = getApiClient(getToken);
    const response = await api.get(`/government/charts/${chartId}`);
    return response.data;
  },

  /**
   * Create a new chart
   */
  createChart: async (data: Partial<Chart>): Promise<Chart> => {
    const api = getApiClient(getToken);
    const response = await api.post("/government/charts", data);
    return response.data;
  },

  /**
   * Update an existing chart
   */
  updateChart: async (
    chartId: string,
    data: Partial<Chart>
  ): Promise<Chart> => {
    const api = getApiClient(getToken);
    const response = await api.put(`/government/charts/${chartId}`, data);
    return response.data;
  },

  /**
   * Delete a chart
   */
  deleteChart: async (
    chartId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const api = getApiClient(getToken);
    const response = await api.delete(`/government/charts/${chartId}`);
    return response.data;
  },

  /**
   * Get data for a specific chart
   */
  getChartData: async (
    chartId: string,
    params?: ChartQueryParams
  ): Promise<ChartData> => {
    const api = getApiClient(getToken);
    const response = await api.get(`/government/charts/${chartId}/data`, {
      params,
    });
    return response.data;
  },

  // ==================== REPORTS ====================

  /**
   * Get all reports
   */
  getReports: async (
    params?: ReportQueryParams
  ): Promise<PaginatedResponse<Report>> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/reports", { params });
    return response.data;
  },

  /**
   * Get a specific report by ID
   */
  getReport: async (reportId: string): Promise<Report> => {
    const api = getApiClient(getToken);
    const response = await api.get(`/government/reports/${reportId}`);
    return response.data;
  },

  /**
   * Create and generate a new report
   */
  createReport: async (
    data: Partial<Report>
  ): Promise<GenerateReportResponse> => {
    const api = getApiClient(getToken);
    const response = await api.post("/government/reports", data);
    return response.data;
  },

  /**
   * Update report configuration
   */
  updateReport: async (
    reportId: string,
    data: Partial<Report>
  ): Promise<Report> => {
    const api = getApiClient(getToken);
    const response = await api.put(`/government/reports/${reportId}`, data);
    return response.data;
  },

  /**
   * Delete a report
   */
  deleteReport: async (
    reportId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const api = getApiClient(getToken);
    const response = await api.delete(`/government/reports/${reportId}`);
    return response.data;
  },

  /**
   * Generate/regenerate a report
   */
  generateReport: async (reportId: string): Promise<GenerateReportResponse> => {
    const api = getApiClient(getToken);
    const response = await api.post(`/government/reports/${reportId}/generate`);
    return response.data;
  },

  // ==================== DATA SOURCES ====================

  /**
   * Get all available data sources
   */
  getDataSources: async (): Promise<DataSource[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/data-sources");
    return response.data;
  },

  // ==================== PERMISSIONS ====================

  /**
   * Get all roles and their permissions
   */
  getRolesAndPermissions: async (): Promise<RolePermission[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/roles");
    return response.data;
  },

  /**
   * Get all available permissions
   */
  getAvailablePermissions: async (): Promise<AvailablePermission[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/permissions/available");
    return response.data;
  },

  /**
   * Assign permissions to a role
   */
  assignPermissions: async (
    data: AssignPermissionsRequest
  ): Promise<ApiResponse<{ assignedPermissions: string[] }>> => {
    const api = getApiClient(getToken);
    const response = await api.post("/government/permissions/assign", data);
    return response.data;
  },

  /**
   * Revoke permissions from a role
   */
  revokePermissions: async (
    data: RevokePermissionsRequest
  ): Promise<ApiResponse<{ revokedPermissions: string[] }>> => {
    const api = getApiClient(getToken);
    const response = await api.post("/government/permissions/revoke", data);
    return response.data;
  },

  /**
   * Get permission change log
   */
  getPermissionChangeLog: async (): Promise<PermissionChangeLog[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/permissions/changelog");
    return response.data;
  },

  /**
   * Create a custom role
   */
  createCustomRole: async (
    data: CreateCustomRoleRequest
  ): Promise<ApiResponse<{ roleId: string }>> => {
    const api = getApiClient(getToken);
    const response = await api.post("/government/roles/custom", data);
    return response.data;
  },

  /**
   * Update a custom role
   */
  updateCustomRole: async (
    roleId: string,
    data: UpdateCustomRoleRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const api = getApiClient(getToken);
    const response = await api.put(`/government/roles/${roleId}`, data);
    return response.data;
  },

  /**
   * Delete a custom role
   */
  deleteCustomRole: async (
    roleId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const api = getApiClient(getToken);
    const response = await api.delete(`/government/roles/${roleId}`);
    return response.data;
  },

  // ==================== PROGRAMS (To be implemented on backend) ====================

  /**
   * Get all programs
   * NOTE: This endpoint doesn't exist yet on the backend
   */
  getPrograms: async (params?: ProgramQueryParams): Promise<Program[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/programs", { params });
    return response.data;
  },

  /**
   * Get a specific program
   * NOTE: This endpoint doesn't exist yet on the backend
   */
  getProgram: async (programId: string): Promise<Program> => {
    const api = getApiClient(getToken);
    const response = await api.get(`/government/programs/${programId}`);
    return response.data;
  },

  /**
   * Create a new program
   * NOTE: This endpoint doesn't exist yet on the backend
   */
  createProgram: async (data: Partial<Program>): Promise<Program> => {
    const api = getApiClient(getToken);
    const response = await api.post("/government/programs", data);
    return response.data;
  },

  /**
   * Update a program
   * NOTE: This endpoint doesn't exist yet on the backend
   */
  updateProgram: async (
    programId: string,
    data: Partial<Program>
  ): Promise<Program> => {
    const api = getApiClient(getToken);
    const response = await api.put(`/government/programs/${programId}`, data);
    return response.data;
  },

  // ==================== COMPLIANCE ====================

  /**
   * Get compliance alerts
   */
  getComplianceAlerts: async (params?: {
    status?: string;
    severity?: string;
    type?: string;
  }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/compliance/alerts", { params });
    return response.data;
  },

  /**
   * Get compliance records
   */
  getComplianceRecords: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/compliance/records", {
      params,
    });
    return response.data;
  },

  /**
   * Get compliance statistics
   */
  getComplianceStats: async (): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/compliance/stats");
    return response.data;
  },

  /**
   * Get vendor compliance details
   */
  getVendorCompliance: async (vendorId: string): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.get(
      `/government/compliance/vendors/${vendorId}`
    );
    return response.data;
  },

  /**
   * Resolve a compliance alert
   */
  resolveComplianceAlert: async (
    alertId: string,
    notes?: string
  ): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.put(
      `/government/compliance/alerts/${alertId}/resolve`,
      { notes }
    );
    return response.data;
  },

  /**
   * Update compliance status
   */
  updateComplianceStatus: async (
    recordId: string,
    status: string,
    notes?: string
  ): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.put(
      `/government/compliance/records/${recordId}/status`,
      { status, notes }
    );
    return response.data;
  },

  // ==================== PRODUCTION TRACKING ====================

  /**
   * Get production statistics
   */
  getProductionStats: async (params?: {
    period?: "week" | "month" | "quarter" | "year";
    crop?: string;
  }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/production/stats", { params });
    return response.data;
  },

  /**
   * Get production by vendor
   */
  getProductionByVendor: async (params?: {
    page?: number;
    limit?: number;
    crop?: string;
  }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/production/by-vendor", {
      params,
    });
    return response.data;
  },

  /**
   * Get harvest schedule
   */
  getHarvestSchedule: async (params?: {
    start_date?: string;
    end_date?: string;
    status?: string;
  }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/production/harvest-schedule", {
      params,
    });
    return response.data;
  },

  /**
   * Get production summary
   */
  getProductionSummary: async (params?: {
    period?: "week" | "month" | "quarter" | "year";
  }): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/production/summary", {
      params,
    });
    return response.data;
  },

  // ==================== DASHBOARD ====================

  /**
   * Get dashboard statistics (optimized single call)
   */
  getDashboardStats: async (): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/dashboard/stats");
    return response.data;
  },

  /**
   * Get recent activity
   */
  getRecentActivity: async (params?: { limit?: number }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/activity", { params });
    return response.data;
  },

  // ==================== MARKET DATA ====================

  /**
   * Get supply and demand analysis
   */
  getSupplyDemand: async (params?: {
    period?: "week" | "month" | "quarter" | "year";
    crop?: string;
  }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/market/supply-demand", {
      params,
    });
    return response.data;
  },

  /**
   * Get market transactions
   */
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<any>> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/market/transactions", {
      params,
    });
    return response.data;
  },

  /**
   * Get market statistics
   */
  getMarketStats: async (params?: {
    period?: "week" | "month" | "quarter" | "year";
  }): Promise<any> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/market/stats", { params });
    return response.data;
  },

  /**
   * Get price trends
   */
  getPriceTrends: async (params?: {
    crop?: string;
    period?: "week" | "month" | "quarter" | "year";
  }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/market/price-trends", {
      params,
    });
    return response.data;
  },

  // ==================== DASHBOARD / OVERVIEW ====================

  /**
   * Get dashboard KPIs
   * NOTE: This will likely need a dedicated endpoint
   */
  getDashboardStats: async (): Promise<any> => {
    const api = getApiClient(getToken);
    // This might be a combination of multiple endpoints
    // For now, we'll create a placeholder
    const response = await api.get("/government/dashboard/stats");
    return response.data;
  },

  /**
   * Get recent activity feed
   * NOTE: This endpoint doesn't exist yet on the backend
   */
  getRecentActivity: async (params?: { limit?: number }): Promise<any[]> => {
    const api = getApiClient(getToken);
    const response = await api.get("/government/activity", { params });
    return response.data;
  },
};

export default governmentApi;
