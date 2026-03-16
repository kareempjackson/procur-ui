import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Certification = {
  type: string;
  certifier?: string;
  number?: string;
  issued?: string;
  expires?: string;
  document_url?: string;
};

export type FarmProfile = {
  id: string;
  org_id: string;
  gps_lat: number | null;
  gps_lng: number | null;
  parish: string | null;
  country: string;
  total_acreage: number | null;
  primary_crops: string[] | null;
  certifications: Certification[];
  created_at: string;
  updated_at: string;
};

export type FarmPlot = {
  id: string;
  farm_profile_id: string;
  org_id: string;
  name: string;
  description: string | null;
  area_acreage: number | null;
  gps_lat: number | null;
  gps_lng: number | null;
  created_at: string;
};

export type HarvestLog = {
  id: string;
  seller_org_id: string;
  plot_id: string | null;
  plot: { id: string; name: string } | null;
  crop: string;
  variety: string | null;
  harvest_date: string;
  quantity_harvested: number | null;
  unit: string | null;
  quality_notes: string | null;
  lot_code: string;
  responsible_party: string | null;
  created_at: string;
  updated_at: string;
};

export type HarvestLogQuery = {
  page?: number;
  limit?: number;
  crop?: string;
  plot_id?: string;
  from?: string;
  to?: string;
};

export type UpsertFarmProfilePayload = Partial<
  Omit<FarmProfile, "id" | "org_id" | "created_at" | "updated_at">
>;

export type CreatePlotPayload = {
  name: string;
  description?: string;
  area_acreage?: number;
  gps_lat?: number;
  gps_lng?: number;
};

export type CreateHarvestLogPayload = {
  crop: string;
  harvest_date: string;
  quantity_harvested?: number;
  unit?: string;
  variety?: string;
  quality_notes?: string;
  plot_id?: string;
};

// ─── State ────────────────────────────────────────────────────────────────────

type FarmState = {
  profile: FarmProfile | null;
  plots: FarmPlot[];
  harvestLogs: HarvestLog[];
  harvestLogTotal: number;
  currentLog: HarvestLog | null;
  loading: {
    profile: boolean;
    plots: boolean;
    harvestLogs: boolean;
    currentLog: boolean;
    creating: boolean;
  };
  error: string | null;
};

const initialState: FarmState = {
  profile: null,
  plots: [],
  harvestLogs: [],
  harvestLogTotal: 0,
  currentLog: null,
  loading: {
    profile: false,
    plots: false,
    harvestLogs: false,
    currentLog: false,
    creating: false,
  },
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchFarmProfile = createAsyncThunk(
  "farm/fetchProfile",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get("/sellers/farm/profile");
      return res.data as FarmProfile | null;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load farm profile");
    }
  }
);

export const upsertFarmProfile = createAsyncThunk(
  "farm/upsertProfile",
  async (
    { accessToken, payload }: { accessToken: string; payload: UpsertFarmProfilePayload },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.post("/sellers/farm/profile", payload);
      return res.data as FarmProfile;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to save farm profile");
    }
  }
);

export const fetchPlots = createAsyncThunk(
  "farm/fetchPlots",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get("/sellers/farm/plots");
      return res.data as FarmPlot[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load plots");
    }
  }
);

export const createPlot = createAsyncThunk(
  "farm/createPlot",
  async (
    { accessToken, payload }: { accessToken: string; payload: CreatePlotPayload },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.post("/sellers/farm/plots", payload);
      return res.data as FarmPlot;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to create plot");
    }
  }
);

export const updatePlot = createAsyncThunk(
  "farm/updatePlot",
  async (
    {
      accessToken,
      plotId,
      payload,
    }: { accessToken: string; plotId: string; payload: Partial<CreatePlotPayload> },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.patch(`/sellers/farm/plots/${plotId}`, payload);
      return res.data as FarmPlot;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to update plot");
    }
  }
);

export const deletePlot = createAsyncThunk(
  "farm/deletePlot",
  async (
    { accessToken, plotId }: { accessToken: string; plotId: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      await client.delete(`/sellers/farm/plots/${plotId}`);
      return plotId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to delete plot");
    }
  }
);

export const fetchHarvestLogs = createAsyncThunk(
  "farm/fetchHarvestLogs",
  async (
    { accessToken, query }: { accessToken: string; query?: HarvestLogQuery },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get("/sellers/farm/harvest-logs", { params: query });
      return res.data as { data: HarvestLog[]; total: number };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load harvest logs");
    }
  }
);

export const fetchHarvestLogDetail = createAsyncThunk(
  "farm/fetchHarvestLogDetail",
  async (
    { accessToken, logId }: { accessToken: string; logId: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get(`/sellers/farm/harvest-logs/${logId}`);
      return res.data as HarvestLog;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load harvest log");
    }
  }
);

export const createHarvestLog = createAsyncThunk(
  "farm/createHarvestLog",
  async (
    { accessToken, payload }: { accessToken: string; payload: CreateHarvestLogPayload },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.post("/sellers/farm/harvest-logs", payload);
      return res.data as HarvestLog;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to log harvest");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const farmSlice = createSlice({
  name: "farm",
  initialState,
  reducers: {
    clearCurrentLog(state) {
      state.currentLog = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Farm Profile
    builder
      .addCase(fetchFarmProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(fetchFarmProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchFarmProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(upsertFarmProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(upsertFarmProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(upsertFarmProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload as string;
      });

    // Plots
    builder
      .addCase(fetchPlots.pending, (state) => {
        state.loading.plots = true;
      })
      .addCase(fetchPlots.fulfilled, (state, action) => {
        state.loading.plots = false;
        state.plots = action.payload;
      })
      .addCase(fetchPlots.rejected, (state, action) => {
        state.loading.plots = false;
        state.error = action.payload as string;
      });

    builder.addCase(createPlot.fulfilled, (state, action) => {
      state.plots.push(action.payload);
    });

    builder.addCase(updatePlot.fulfilled, (state, action) => {
      const idx = state.plots.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.plots[idx] = action.payload;
    });

    builder.addCase(deletePlot.fulfilled, (state, action) => {
      state.plots = state.plots.filter((p) => p.id !== action.payload);
    });

    // Harvest Logs
    builder
      .addCase(fetchHarvestLogs.pending, (state) => {
        state.loading.harvestLogs = true;
      })
      .addCase(fetchHarvestLogs.fulfilled, (state, action) => {
        state.loading.harvestLogs = false;
        state.harvestLogs = action.payload.data;
        state.harvestLogTotal = action.payload.total;
      })
      .addCase(fetchHarvestLogs.rejected, (state, action) => {
        state.loading.harvestLogs = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchHarvestLogDetail.pending, (state) => {
        state.loading.currentLog = true;
      })
      .addCase(fetchHarvestLogDetail.fulfilled, (state, action) => {
        state.loading.currentLog = false;
        state.currentLog = action.payload;
      })
      .addCase(fetchHarvestLogDetail.rejected, (state, action) => {
        state.loading.currentLog = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createHarvestLog.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
      })
      .addCase(createHarvestLog.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.harvestLogs.unshift(action.payload);
        state.harvestLogTotal += 1;
        state.currentLog = action.payload;
      })
      .addCase(createHarvestLog.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentLog, clearError } = farmSlice.actions;
export default farmSlice.reducer;
