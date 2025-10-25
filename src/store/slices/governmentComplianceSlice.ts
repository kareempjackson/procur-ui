import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";

// ==================== STATE INTERFACE ====================

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
  vendor_name: string;
  record_type: string;
  title: string;
  description?: string;
  status: "compliant" | "warning" | "non_compliant";
  last_inspection?: string;
  next_inspection?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceStats {
  totalVendors: number;
  compliantVendors: number;
  warningVendors: number;
  nonCompliantVendors: number;
  complianceRate: number;
  activeAlerts: number;
  pendingReviews: number;
  inspectionsDue: number;
}

export interface GovernmentComplianceState {
  // Alerts
  alerts: ComplianceAlert[];
  alertsStatus: "idle" | "loading" | "succeeded" | "failed";
  alertsError: string | null;

  // Compliance records
  records: ComplianceRecord[];
  recordsStatus: "idle" | "loading" | "succeeded" | "failed";
  recordsError: string | null;

  // Stats
  stats: ComplianceStats | null;
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
  statsError: string | null;

  // Current vendor compliance detail
  currentVendorCompliance: ComplianceRecord | null;

  // Filters
  filters: {
    status?: string;
    severity?: string;
    type?: string;
  };
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentComplianceState = {
  alerts: [],
  alertsStatus: "idle",
  alertsError: null,

  records: [],
  recordsStatus: "idle",
  recordsError: null,

  stats: null,
  statsStatus: "idle",
  statsError: null,

  currentVendorCompliance: null,

  filters: {},
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all compliance alerts
 */
export const fetchComplianceAlerts = createAsyncThunk(
  "governmentCompliance/fetchAlerts",
  async (
    params?: {
      status?: string;
      severity?: string;
      type?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getComplianceAlerts(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch compliance alerts"
      );
    }
  }
);

/**
 * Fetch compliance records
 */
export const fetchComplianceRecords = createAsyncThunk(
  "governmentCompliance/fetchRecords",
  async (
    params?: {
      status?: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getComplianceRecords(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch compliance records"
      );
    }
  }
);

/**
 * Fetch compliance statistics
 */
export const fetchComplianceStats = createAsyncThunk(
  "governmentCompliance/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getComplianceStats();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch compliance stats"
      );
    }
  }
);

/**
 * Fetch vendor compliance details
 */
export const fetchVendorCompliance = createAsyncThunk(
  "governmentCompliance/fetchVendorCompliance",
  async (vendorId: string, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getVendorCompliance(vendorId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor compliance"
      );
    }
  }
);

/**
 * Resolve a compliance alert
 */
export const resolveAlert = createAsyncThunk(
  "governmentCompliance/resolveAlert",
  async (payload: { alertId: string; notes?: string }, { rejectWithValue }) => {
    try {
      const data = await governmentApi.resolveComplianceAlert(
        payload.alertId,
        payload.notes
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resolve alert"
      );
    }
  }
);

/**
 * Update compliance status
 */
export const updateComplianceStatus = createAsyncThunk(
  "governmentCompliance/updateStatus",
  async (
    payload: {
      recordId: string;
      status: "compliant" | "warning" | "non_compliant";
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.updateComplianceStatus(
        payload.recordId,
        payload.status,
        payload.notes
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update compliance status"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentComplianceSlice = createSlice({
  name: "governmentCompliance",
  initialState,
  reducers: {
    // Set filters
    setFilters: (
      state,
      action: PayloadAction<{
        status?: string;
        severity?: string;
        type?: string;
      }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
    },

    // Set current vendor compliance
    setCurrentVendorCompliance: (
      state,
      action: PayloadAction<ComplianceRecord | null>
    ) => {
      state.currentVendorCompliance = action.payload;
    },

    // Reset state
    resetComplianceState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch alerts
    builder
      .addCase(fetchComplianceAlerts.pending, (state) => {
        state.alertsStatus = "loading";
        state.alertsError = null;
      })
      .addCase(fetchComplianceAlerts.fulfilled, (state, action) => {
        state.alertsStatus = "succeeded";
        state.alerts = action.payload;
      })
      .addCase(fetchComplianceAlerts.rejected, (state, action) => {
        state.alertsStatus = "failed";
        state.alertsError = action.payload as string;
      });

    // Fetch records
    builder
      .addCase(fetchComplianceRecords.pending, (state) => {
        state.recordsStatus = "loading";
        state.recordsError = null;
      })
      .addCase(fetchComplianceRecords.fulfilled, (state, action) => {
        state.recordsStatus = "succeeded";
        state.records = action.payload;
      })
      .addCase(fetchComplianceRecords.rejected, (state, action) => {
        state.recordsStatus = "failed";
        state.recordsError = action.payload as string;
      });

    // Fetch stats
    builder
      .addCase(fetchComplianceStats.pending, (state) => {
        state.statsStatus = "loading";
        state.statsError = null;
      })
      .addCase(fetchComplianceStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchComplianceStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload as string;
      });

    // Fetch vendor compliance
    builder
      .addCase(fetchVendorCompliance.pending, (state) => {
        state.recordsStatus = "loading";
      })
      .addCase(fetchVendorCompliance.fulfilled, (state, action) => {
        state.recordsStatus = "succeeded";
        state.currentVendorCompliance = action.payload;
      })
      .addCase(fetchVendorCompliance.rejected, (state, action) => {
        state.recordsStatus = "failed";
        state.recordsError = action.payload as string;
      });

    // Resolve alert
    builder.addCase(resolveAlert.fulfilled, (state, action) => {
      const index = state.alerts.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index] = action.payload;
      }
    });

    // Update compliance status
    builder.addCase(updateComplianceStatus.fulfilled, (state, action) => {
      const index = state.records.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    });
  },
});

// ==================== EXPORTS ====================

export const {
  setFilters,
  clearFilters,
  setCurrentVendorCompliance,
  resetComplianceState,
} = governmentComplianceSlice.actions;

export default governmentComplianceSlice.reducer;

// ==================== SELECTORS ====================

export const selectAlerts = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.alerts;

export const selectAlertsStatus = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.alertsStatus;

export const selectAlertsError = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.alertsError;

export const selectComplianceRecords = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.records;

export const selectRecordsStatus = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.recordsStatus;

export const selectComplianceStats = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.stats;

export const selectStatsStatus = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.statsStatus;

export const selectCurrentVendorCompliance = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.currentVendorCompliance;

export const selectFilters = (state: {
  governmentCompliance: GovernmentComplianceState;
}) => state.governmentCompliance.filters;
