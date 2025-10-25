import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";

// ==================== STATE INTERFACE ====================

export interface ProductionStat {
  crop: string;
  totalProduction: number;
  activeVendors: number;
  avgYield: number;
  unit: string;
  trend: "up" | "down" | "stable";
  percentageChange: number;
}

export interface VendorProduction {
  vendor_id: string;
  vendor_name: string;
  totalProduction: number;
  crops: {
    crop: string;
    quantity: number;
    unit: string;
  }[];
  lastHarvest?: string;
  nextHarvest?: string;
}

export interface HarvestSchedule {
  id: string;
  vendor_id: string;
  vendor_name: string;
  crop: string;
  estimated_quantity: number;
  harvest_date: string;
  status: "scheduled" | "in_progress" | "completed" | "delayed";
}

export interface ProductionSummary {
  totalProduction: number;
  totalVendors: number;
  totalCrops: number;
  avgProductionPerVendor: number;
  topCrop: string;
  topCropProduction: number;
}

export interface GovernmentProductionState {
  // Production stats
  stats: ProductionStat[];
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
  statsError: string | null;

  // Vendor production
  vendorProduction: VendorProduction[];
  vendorProductionStatus: "idle" | "loading" | "succeeded" | "failed";
  vendorProductionError: string | null;

  // Harvest schedule
  harvestSchedule: HarvestSchedule[];
  harvestScheduleStatus: "idle" | "loading" | "succeeded" | "failed";
  harvestScheduleError: string | null;

  // Production summary
  summary: ProductionSummary | null;
  summaryStatus: "idle" | "loading" | "succeeded" | "failed";
  summaryError: string | null;

  // Filters
  selectedPeriod: "week" | "month" | "quarter" | "year";
  selectedCrop: string | null;
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentProductionState = {
  stats: [],
  statsStatus: "idle",
  statsError: null,

  vendorProduction: [],
  vendorProductionStatus: "idle",
  vendorProductionError: null,

  harvestSchedule: [],
  harvestScheduleStatus: "idle",
  harvestScheduleError: null,

  summary: null,
  summaryStatus: "idle",
  summaryError: null,

  selectedPeriod: "month",
  selectedCrop: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch production statistics
 */
export const fetchProductionStats = createAsyncThunk(
  "governmentProduction/fetchStats",
  async (
    params?: {
      period?: "week" | "month" | "quarter" | "year";
      crop?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getProductionStats(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch production stats"
      );
    }
  }
);

/**
 * Fetch production by vendor
 */
export const fetchVendorProduction = createAsyncThunk(
  "governmentProduction/fetchVendorProduction",
  async (
    params?: {
      page?: number;
      limit?: number;
      crop?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getProductionByVendor(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor production"
      );
    }
  }
);

/**
 * Fetch harvest schedule
 */
export const fetchHarvestSchedule = createAsyncThunk(
  "governmentProduction/fetchHarvestSchedule",
  async (
    params?: {
      start_date?: string;
      end_date?: string;
      status?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getHarvestSchedule(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch harvest schedule"
      );
    }
  }
);

/**
 * Fetch production summary
 */
export const fetchProductionSummary = createAsyncThunk(
  "governmentProduction/fetchSummary",
  async (
    params?: {
      period?: "week" | "month" | "quarter" | "year";
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getProductionSummary(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch production summary"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentProductionSlice = createSlice({
  name: "governmentProduction",
  initialState,
  reducers: {
    // Set selected period
    setSelectedPeriod: (
      state,
      action: PayloadAction<"week" | "month" | "quarter" | "year">
    ) => {
      state.selectedPeriod = action.payload;
    },

    // Set selected crop
    setSelectedCrop: (state, action: PayloadAction<string | null>) => {
      state.selectedCrop = action.payload;
    },

    // Reset state
    resetProductionState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch production stats
    builder
      .addCase(fetchProductionStats.pending, (state) => {
        state.statsStatus = "loading";
        state.statsError = null;
      })
      .addCase(fetchProductionStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchProductionStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload as string;
      });

    // Fetch vendor production
    builder
      .addCase(fetchVendorProduction.pending, (state) => {
        state.vendorProductionStatus = "loading";
        state.vendorProductionError = null;
      })
      .addCase(fetchVendorProduction.fulfilled, (state, action) => {
        state.vendorProductionStatus = "succeeded";
        state.vendorProduction = action.payload;
      })
      .addCase(fetchVendorProduction.rejected, (state, action) => {
        state.vendorProductionStatus = "failed";
        state.vendorProductionError = action.payload as string;
      });

    // Fetch harvest schedule
    builder
      .addCase(fetchHarvestSchedule.pending, (state) => {
        state.harvestScheduleStatus = "loading";
        state.harvestScheduleError = null;
      })
      .addCase(fetchHarvestSchedule.fulfilled, (state, action) => {
        state.harvestScheduleStatus = "succeeded";
        state.harvestSchedule = action.payload;
      })
      .addCase(fetchHarvestSchedule.rejected, (state, action) => {
        state.harvestScheduleStatus = "failed";
        state.harvestScheduleError = action.payload as string;
      });

    // Fetch production summary
    builder
      .addCase(fetchProductionSummary.pending, (state) => {
        state.summaryStatus = "loading";
        state.summaryError = null;
      })
      .addCase(fetchProductionSummary.fulfilled, (state, action) => {
        state.summaryStatus = "succeeded";
        state.summary = action.payload;
      })
      .addCase(fetchProductionSummary.rejected, (state, action) => {
        state.summaryStatus = "failed";
        state.summaryError = action.payload as string;
      });
  },
});

// ==================== EXPORTS ====================

export const { setSelectedPeriod, setSelectedCrop, resetProductionState } =
  governmentProductionSlice.actions;

export default governmentProductionSlice.reducer;

// ==================== SELECTORS ====================

export const selectProductionStats = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.stats;

export const selectStatsStatus = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.statsStatus;

export const selectVendorProduction = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.vendorProduction;

export const selectVendorProductionStatus = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.vendorProductionStatus;

export const selectHarvestSchedule = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.harvestSchedule;

export const selectHarvestScheduleStatus = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.harvestScheduleStatus;

export const selectProductionSummary = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.summary;

export const selectSummaryStatus = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.summaryStatus;

export const selectSelectedPeriod = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.selectedPeriod;

export const selectSelectedCrop = (state: {
  governmentProduction: GovernmentProductionState;
}) => state.governmentProduction.selectedCrop;
