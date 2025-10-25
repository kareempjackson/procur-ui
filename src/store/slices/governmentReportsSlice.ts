import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";
import { Report, ReportQueryParams } from "@/types";

// ==================== STATE INTERFACE ====================

export interface GovernmentReportsState {
  // Reports list
  reports: Report[];
  reportsStatus: "idle" | "loading" | "succeeded" | "failed";
  reportsError: string | null;

  // Current report details
  currentReport: Report | null;
  reportDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  reportDetailError: string | null;

  // Generate report status
  generateStatus: "idle" | "generating" | "succeeded" | "failed";
  generateError: string | null;
  generatedReportId: string | null;

  // Filters
  filters: ReportQueryParams;
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentReportsState = {
  reports: [],
  reportsStatus: "idle",
  reportsError: null,

  currentReport: null,
  reportDetailStatus: "idle",
  reportDetailError: null,

  generateStatus: "idle",
  generateError: null,
  generatedReportId: null,

  filters: {
    page: 1,
    limit: 20,
  },
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all reports
 */
export const fetchReports = createAsyncThunk(
  "governmentReports/fetchReports",
  async (params: ReportQueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await governmentApi.getReports(params);
      return response.data; // Extract data from PaginatedResponse
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

/**
 * Fetch a specific report
 */
export const fetchReport = createAsyncThunk(
  "governmentReports/fetchReport",
  async (reportId: string, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getReport(reportId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch report"
      );
    }
  }
);

/**
 * Create and generate a new report
 */
export const createAndGenerateReport = createAsyncThunk(
  "governmentReports/createAndGenerateReport",
  async (reportData: Partial<Report>, { rejectWithValue, dispatch }) => {
    try {
      const response = await governmentApi.createReport(reportData);

      // After successful creation, fetch the report details
      if (response.report_id) {
        // Poll for report completion (optional)
        setTimeout(() => {
          dispatch(fetchReport(response.report_id));
        }, 2000);
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate report"
      );
    }
  }
);

/**
 * Regenerate an existing report
 */
export const regenerateReport = createAsyncThunk(
  "governmentReports/regenerateReport",
  async (reportId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await governmentApi.generateReport(reportId);

      // Poll for report completion
      setTimeout(() => {
        dispatch(fetchReport(reportId));
      }, 2000);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to regenerate report"
      );
    }
  }
);

/**
 * Update report configuration
 */
export const updateReport = createAsyncThunk(
  "governmentReports/updateReport",
  async (
    payload: { reportId: string; data: Partial<Report> },
    { rejectWithValue }
  ) => {
    try {
      const { reportId, data } = payload;
      const updatedReport = await governmentApi.updateReport(reportId, data);
      return updatedReport;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update report"
      );
    }
  }
);

/**
 * Delete a report
 */
export const deleteReport = createAsyncThunk(
  "governmentReports/deleteReport",
  async (reportId: string, { rejectWithValue }) => {
    try {
      await governmentApi.deleteReport(reportId);
      return reportId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete report"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentReportsSlice = createSlice({
  name: "governmentReports",
  initialState,
  reducers: {
    // Set current report
    setCurrentReport: (state, action: PayloadAction<Report | null>) => {
      state.currentReport = action.payload;
    },

    // Clear current report
    clearCurrentReport: (state) => {
      state.currentReport = null;
      state.reportDetailStatus = "idle";
      state.reportDetailError = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<ReportQueryParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
      };
    },

    // Reset generate status
    resetGenerateStatus: (state) => {
      state.generateStatus = "idle";
      state.generateError = null;
      state.generatedReportId = null;
    },

    // Reset state
    resetReportsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch reports
    builder
      .addCase(fetchReports.pending, (state) => {
        state.reportsStatus = "loading";
        state.reportsError = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reportsStatus = "succeeded";
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.reportsStatus = "failed";
        state.reportsError = action.payload as string;
      });

    // Fetch report detail
    builder
      .addCase(fetchReport.pending, (state) => {
        state.reportDetailStatus = "loading";
        state.reportDetailError = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.reportDetailStatus = "succeeded";
        state.currentReport = action.payload;

        // Also update in the list if it exists
        const index = state.reports.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.reportDetailStatus = "failed";
        state.reportDetailError = action.payload as string;
      });

    // Create and generate report
    builder
      .addCase(createAndGenerateReport.pending, (state) => {
        state.generateStatus = "generating";
        state.generateError = null;
        state.generatedReportId = null;
      })
      .addCase(createAndGenerateReport.fulfilled, (state, action) => {
        state.generateStatus = "succeeded";
        state.generatedReportId = action.payload.report_id;
      })
      .addCase(createAndGenerateReport.rejected, (state, action) => {
        state.generateStatus = "failed";
        state.generateError = action.payload as string;
      });

    // Regenerate report
    builder
      .addCase(regenerateReport.pending, (state) => {
        state.generateStatus = "generating";
        state.generateError = null;
      })
      .addCase(regenerateReport.fulfilled, (state) => {
        state.generateStatus = "succeeded";
      })
      .addCase(regenerateReport.rejected, (state, action) => {
        state.generateStatus = "failed";
        state.generateError = action.payload as string;
      });

    // Update report
    builder.addCase(updateReport.fulfilled, (state, action) => {
      // Update in list
      const index = state.reports.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
      // Update current report if it's the same
      if (state.currentReport?.id === action.payload.id) {
        state.currentReport = action.payload;
      }
    });

    // Delete report
    builder.addCase(deleteReport.fulfilled, (state, action) => {
      // Remove from list
      state.reports = state.reports.filter((r) => r.id !== action.payload);
      // Clear current report if it was deleted
      if (state.currentReport?.id === action.payload) {
        state.currentReport = null;
      }
    });
  },
});

// ==================== EXPORTS ====================

export const {
  setCurrentReport,
  clearCurrentReport,
  setFilters,
  clearFilters,
  resetGenerateStatus,
  resetReportsState,
} = governmentReportsSlice.actions;

export default governmentReportsSlice.reducer;

// ==================== SELECTORS ====================

export const selectReports = (state: {
  governmentReports: GovernmentReportsState;
}) => state.governmentReports.reports;

export const selectReportsStatus = (state: {
  governmentReports: GovernmentReportsState;
}) => state.governmentReports.reportsStatus;

export const selectCurrentReport = (state: {
  governmentReports: GovernmentReportsState;
}) => state.governmentReports.currentReport;

export const selectGenerateStatus = (state: {
  governmentReports: GovernmentReportsState;
}) => state.governmentReports.generateStatus;

export const selectGenerateError = (state: {
  governmentReports: GovernmentReportsState;
}) => state.governmentReports.generateError;

export const selectGeneratedReportId = (state: {
  governmentReports: GovernmentReportsState;
}) => state.governmentReports.generatedReportId;
