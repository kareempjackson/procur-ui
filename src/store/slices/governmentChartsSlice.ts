import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";
import { Chart, ChartData, ChartQueryParams, TableQueryParams } from "@/types";

// ==================== STATE INTERFACE ====================

export interface GovernmentChartsState {
  // Charts list
  charts: Chart[];
  chartsStatus: "idle" | "loading" | "succeeded" | "failed";
  chartsError: string | null;

  // Current chart details
  currentChart: Chart | null;
  currentChartData: ChartData | null;
  chartDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  chartDetailError: string | null;

  // Mutation status (create/update/delete)
  mutationStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationError: string | null;

  // Filters
  filters: TableQueryParams;
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentChartsState = {
  charts: [],
  chartsStatus: "idle",
  chartsError: null,

  currentChart: null,
  currentChartData: null,
  chartDetailStatus: "idle",
  chartDetailError: null,

  mutationStatus: "idle",
  mutationError: null,

  filters: {
    page: 1,
    limit: 20,
  },
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all charts
 */
export const fetchCharts = createAsyncThunk(
  "governmentCharts/fetchCharts",
  async (params?: TableQueryParams, { rejectWithValue }) => {
    try {
      const response = await governmentApi.getCharts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch charts"
      );
    }
  }
);

/**
 * Fetch a specific chart
 */
export const fetchChart = createAsyncThunk(
  "governmentCharts/fetchChart",
  async (chartId: string, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getChart(chartId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chart"
      );
    }
  }
);

/**
 * Fetch chart data
 */
export const fetchChartData = createAsyncThunk(
  "governmentCharts/fetchChartData",
  async (
    payload: { chartId: string; params?: ChartQueryParams },
    { rejectWithValue }
  ) => {
    try {
      const { chartId, params } = payload;
      const data = await governmentApi.getChartData(chartId, params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chart data"
      );
    }
  }
);

/**
 * Create a new chart
 */
export const createChart = createAsyncThunk(
  "governmentCharts/createChart",
  async (chartData: Partial<Chart>, { rejectWithValue }) => {
    try {
      const data = await governmentApi.createChart(chartData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create chart"
      );
    }
  }
);

/**
 * Update an existing chart
 */
export const updateChart = createAsyncThunk(
  "governmentCharts/updateChart",
  async (
    payload: { chartId: string; data: Partial<Chart> },
    { rejectWithValue }
  ) => {
    try {
      const { chartId, data } = payload;
      const updatedChart = await governmentApi.updateChart(chartId, data);
      return updatedChart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update chart"
      );
    }
  }
);

/**
 * Delete a chart
 */
export const deleteChart = createAsyncThunk(
  "governmentCharts/deleteChart",
  async (chartId: string, { rejectWithValue }) => {
    try {
      await governmentApi.deleteChart(chartId);
      return chartId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete chart"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentChartsSlice = createSlice({
  name: "governmentCharts",
  initialState,
  reducers: {
    // Set current chart
    setCurrentChart: (state, action: PayloadAction<Chart | null>) => {
      state.currentChart = action.payload;
    },

    // Clear current chart
    clearCurrentChart: (state) => {
      state.currentChart = null;
      state.currentChartData = null;
      state.chartDetailStatus = "idle";
      state.chartDetailError = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<TableQueryParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
      };
    },

    // Reset mutation status
    resetMutationStatus: (state) => {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },

    // Reset state
    resetChartsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch charts
    builder
      .addCase(fetchCharts.pending, (state) => {
        state.chartsStatus = "loading";
        state.chartsError = null;
      })
      .addCase(fetchCharts.fulfilled, (state, action) => {
        state.chartsStatus = "succeeded";
        state.charts = action.payload;
      })
      .addCase(fetchCharts.rejected, (state, action) => {
        state.chartsStatus = "failed";
        state.chartsError = action.payload as string;
      });

    // Fetch chart detail
    builder
      .addCase(fetchChart.pending, (state) => {
        state.chartDetailStatus = "loading";
        state.chartDetailError = null;
      })
      .addCase(fetchChart.fulfilled, (state, action) => {
        state.chartDetailStatus = "succeeded";
        state.currentChart = action.payload;
      })
      .addCase(fetchChart.rejected, (state, action) => {
        state.chartDetailStatus = "failed";
        state.chartDetailError = action.payload as string;
      });

    // Fetch chart data
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.chartDetailStatus = "loading";
        state.chartDetailError = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartDetailStatus = "succeeded";
        state.currentChartData = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.chartDetailStatus = "failed";
        state.chartDetailError = action.payload as string;
      });

    // Create chart
    builder
      .addCase(createChart.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createChart.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.charts.unshift(action.payload);
      })
      .addCase(createChart.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Update chart
    builder
      .addCase(updateChart.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateChart.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const index = state.charts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.charts[index] = action.payload;
        }
        if (state.currentChart?.id === action.payload.id) {
          state.currentChart = action.payload;
        }
      })
      .addCase(updateChart.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Delete chart
    builder
      .addCase(deleteChart.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteChart.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.charts = state.charts.filter((c) => c.id !== action.payload);
        if (state.currentChart?.id === action.payload) {
          state.currentChart = null;
          state.currentChartData = null;
        }
      })
      .addCase(deleteChart.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });
  },
});

// ==================== EXPORTS ====================

export const {
  setCurrentChart,
  clearCurrentChart,
  setFilters,
  clearFilters,
  resetMutationStatus,
  resetChartsState,
} = governmentChartsSlice.actions;

export default governmentChartsSlice.reducer;

// ==================== SELECTORS ====================

export const selectCharts = (state: {
  governmentCharts: GovernmentChartsState;
}) => state.governmentCharts.charts;

export const selectChartsStatus = (state: {
  governmentCharts: GovernmentChartsState;
}) => state.governmentCharts.chartsStatus;

export const selectCurrentChart = (state: {
  governmentCharts: GovernmentChartsState;
}) => state.governmentCharts.currentChart;

export const selectCurrentChartData = (state: {
  governmentCharts: GovernmentChartsState;
}) => state.governmentCharts.currentChartData;
