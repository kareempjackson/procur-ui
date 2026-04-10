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
  address: string | null;
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

export type PackingRecord = {
  id: string;
  harvest_log_id: string;
  seller_org_id: string;
  packing_date: string;
  packing_facility_name: string;
  packing_facility_address: string | null;
  packing_facility_country: string;
  quantity_packed: number | null;
  unit: string | null;
  ship_to_country: string | null;
  transport_mode: string | null;
  carrier_name: string | null;
  bill_of_lading: string | null;
  expected_ship_date: string | null;
  notes: string | null;
  responsible_party: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePackingPayload = {
  packing_date: string;
  packing_facility_name: string;
  packing_facility_address?: string;
  packing_facility_country?: string;
  quantity_packed?: number;
  unit?: string;
  ship_to_country?: string;
  transport_mode?: string;
  carrier_name?: string;
  bill_of_lading?: string;
  expected_ship_date?: string;
  notes?: string;
};

export type FarmInput = {
  id: string;
  org_id: string;
  plot_id: string | null;
  plot_name?: string | null;
  input_type: string;
  product_name: string;
  brand: string | null;
  active_ingredient: string | null;
  application_date: string;
  quantity: number | null;
  unit: string | null;
  withdrawal_period_days: number;
  safe_to_harvest_after: string;
  is_within_withdrawal: boolean;
  applied_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateFarmInputPayload = {
  input_type: string;
  product_name: string;
  application_date: string;
  brand?: string;
  active_ingredient?: string;
  quantity?: number;
  unit?: string;
  withdrawal_period_days?: number;
  plot_id?: string;
  notes?: string;
};

export type CropSeason = {
  id: string;
  org_id: string;
  crop: string;
  variety: string | null;
  plant_month_start: number | null;
  plant_month_end: number | null;
  harvest_month_start: number;
  harvest_month_end: number;
  typical_yield_kg_per_acre: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateCropSeasonPayload = {
  crop: string;
  variety?: string;
  plant_month_start?: number;
  plant_month_end?: number;
  harvest_month_start: number;
  harvest_month_end: number;
  typical_yield_kg_per_acre?: number;
  notes?: string;
};

export type ComplianceDashboard = {
  fsma: {
    total_harvest_logs: number;
    harvest_logs_with_packing: number;
    shipped_orders: number;
    shipped_with_lot_code: number;
    lot_code_coverage_pct: number;
    delivered_orders: number;
    receiving_confirmations: number;
    receiving_coverage_pct: number;
  };
  certifications: { total: number; expiring_soon: number; expired: number };
  inputs: { total: number; active_withdrawal_warnings: number };
  reliability: {
    acceptance_rate: number;
    on_time_rate: number;
    avg_quality_score: number | null;
    completion_rate: number;
    total_orders: number;
    reliability_score: number;
    badge: string;
  };
  compliance_score: number;
};

export type PriceBenchmarkItem = {
  crop: string;
  your_avg_price: number | null;
  market_avg: number | null;
  market_min: number | null;
  market_max: number | null;
  position: string;
  sample_size: number;
};

export type ChainOfCustody = {
  lot_code: string;
  harvest: Record<string, unknown>;
  packing: PackingRecord[];
  shipping: Array<{
    event: string;
    order_item_id: string;
    order_id: string;
    order_number: string;
    status: string;
    shipped_at: string | null;
    tracking_number: string | null;
    shipping_method: string | null;
    quantity: number;
    buyer_name: string | null;
  }>;
  receiving: Record<string, unknown> | null;
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
  packingRecords: PackingRecord[];
  chain: ChainOfCustody | null;
  // Phase 3
  farmInputs: FarmInput[];
  cropSeasons: CropSeason[];
  complianceDashboard: ComplianceDashboard | null;
  priceBenchmark: PriceBenchmarkItem[];
  loading: {
    profile: boolean;
    plots: boolean;
    harvestLogs: boolean;
    currentLog: boolean;
    creating: boolean;
    packing: boolean;
    chain: boolean;
    inputs: boolean;
    seasons: boolean;
    compliance: boolean;
  };
  error: string | null;
};

const initialState: FarmState = {
  profile: null,
  plots: [],
  harvestLogs: [],
  harvestLogTotal: 0,
  currentLog: null,
  packingRecords: [],
  chain: null,
  farmInputs: [],
  cropSeasons: [],
  complianceDashboard: null,
  priceBenchmark: [],
  loading: {
    profile: false,
    plots: false,
    harvestLogs: false,
    currentLog: false,
    creating: false,
    packing: false,
    chain: false,
    inputs: false,
    seasons: false,
    compliance: false,
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

export const fetchPackingRecords = createAsyncThunk(
  "farm/fetchPackingRecords",
  async (
    { accessToken, logId }: { accessToken: string; logId: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get(`/sellers/farm/harvest-logs/${logId}/packing`);
      return res.data as PackingRecord[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load packing records");
    }
  }
);

export const createPackingRecord = createAsyncThunk(
  "farm/createPackingRecord",
  async (
    { accessToken, logId, payload }: { accessToken: string; logId: string; payload: CreatePackingPayload },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.post(`/sellers/farm/harvest-logs/${logId}/packing`, payload);
      return res.data as PackingRecord;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to log packing event");
    }
  }
);

export const fetchChainOfCustody = createAsyncThunk(
  "farm/fetchChain",
  async (
    { accessToken, logId }: { accessToken: string; logId: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get(`/sellers/farm/harvest-logs/${logId}/chain`);
      return res.data as ChainOfCustody;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load chain of custody");
    }
  }
);

// ─── Phase 3 Thunks ───────────────────────────────────────────────────────────

export const fetchFarmInputs = createAsyncThunk(
  "farm/fetchInputs",
  async ({ accessToken, plotId }: { accessToken: string; plotId?: string }, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get("/sellers/farm/inputs", { params: plotId ? { plot_id: plotId } : undefined });
      return res.data as FarmInput[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load inputs");
    }
  }
);

export const createFarmInput = createAsyncThunk(
  "farm/createInput",
  async ({ accessToken, payload }: { accessToken: string; payload: CreateFarmInputPayload }, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.post("/sellers/farm/inputs", payload);
      return res.data as FarmInput;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to log input");
    }
  }
);

export const deleteFarmInput = createAsyncThunk(
  "farm/deleteInput",
  async ({ accessToken, inputId }: { accessToken: string; inputId: string }, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      await client.delete(`/sellers/farm/inputs/${inputId}`);
      return inputId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to delete input");
    }
  }
);

export const fetchCropSeasons = createAsyncThunk(
  "farm/fetchSeasons",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get("/sellers/farm/seasons");
      return res.data as CropSeason[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load seasons");
    }
  }
);

export const upsertCropSeason = createAsyncThunk(
  "farm/upsertSeason",
  async ({ accessToken, payload }: { accessToken: string; payload: CreateCropSeasonPayload }, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.post("/sellers/farm/seasons", payload);
      return res.data as CropSeason;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to save season");
    }
  }
);

export const deleteCropSeason = createAsyncThunk(
  "farm/deleteSeason",
  async ({ accessToken, seasonId }: { accessToken: string; seasonId: string }, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      await client.delete(`/sellers/farm/seasons/${seasonId}`);
      return seasonId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to delete season");
    }
  }
);

export const fetchComplianceDashboard = createAsyncThunk(
  "farm/fetchCompliance",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get("/sellers/farm/compliance-dashboard");
      return res.data as ComplianceDashboard;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load compliance dashboard");
    }
  }
);

export const fetchPriceBenchmark = createAsyncThunk(
  "farm/fetchPriceBenchmark",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => accessToken);
      const res = await client.get("/sellers/farm/price-benchmark");
      return res.data as PriceBenchmarkItem[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to load price benchmark");
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

    // Packing Records
    builder
      .addCase(fetchPackingRecords.pending, (state) => {
        state.loading.packing = true;
      })
      .addCase(fetchPackingRecords.fulfilled, (state, action) => {
        state.loading.packing = false;
        state.packingRecords = action.payload;
      })
      .addCase(fetchPackingRecords.rejected, (state, action) => {
        state.loading.packing = false;
        state.error = action.payload as string;
      });

    builder.addCase(createPackingRecord.fulfilled, (state, action) => {
      state.packingRecords.push(action.payload);
    });

    // Chain of Custody
    builder
      .addCase(fetchChainOfCustody.pending, (state) => {
        state.loading.chain = true;
      })
      .addCase(fetchChainOfCustody.fulfilled, (state, action) => {
        state.loading.chain = false;
        state.chain = action.payload;
      })
      .addCase(fetchChainOfCustody.rejected, (state, action) => {
        state.loading.chain = false;
        state.error = action.payload as string;
      });

    // Farm Inputs
    builder
      .addCase(fetchFarmInputs.pending, (state) => { state.loading.inputs = true; })
      .addCase(fetchFarmInputs.fulfilled, (state, action) => {
        state.loading.inputs = false;
        state.farmInputs = action.payload;
      })
      .addCase(fetchFarmInputs.rejected, (state, action) => {
        state.loading.inputs = false;
        state.error = action.payload as string;
      });

    builder.addCase(createFarmInput.fulfilled, (state, action) => {
      state.farmInputs.unshift(action.payload);
    });

    builder.addCase(deleteFarmInput.fulfilled, (state, action) => {
      state.farmInputs = state.farmInputs.filter((i) => i.id !== action.payload);
    });

    // Crop Seasons
    builder
      .addCase(fetchCropSeasons.pending, (state) => { state.loading.seasons = true; })
      .addCase(fetchCropSeasons.fulfilled, (state, action) => {
        state.loading.seasons = false;
        state.cropSeasons = action.payload;
      })
      .addCase(fetchCropSeasons.rejected, (state, action) => {
        state.loading.seasons = false;
        state.error = action.payload as string;
      });

    builder.addCase(upsertCropSeason.fulfilled, (state, action) => {
      const idx = state.cropSeasons.findIndex(
        (s) => s.crop === action.payload.crop && s.variety === action.payload.variety
      );
      if (idx !== -1) state.cropSeasons[idx] = action.payload;
      else state.cropSeasons.push(action.payload);
    });

    builder.addCase(deleteCropSeason.fulfilled, (state, action) => {
      state.cropSeasons = state.cropSeasons.filter((s) => s.id !== action.payload);
    });

    // Compliance Dashboard
    builder
      .addCase(fetchComplianceDashboard.pending, (state) => { state.loading.compliance = true; })
      .addCase(fetchComplianceDashboard.fulfilled, (state, action) => {
        state.loading.compliance = false;
        state.complianceDashboard = action.payload;
      })
      .addCase(fetchComplianceDashboard.rejected, (state, action) => {
        state.loading.compliance = false;
        state.error = action.payload as string;
      });

    // Price Benchmark
    builder.addCase(fetchPriceBenchmark.fulfilled, (state, action) => {
      state.priceBenchmark = action.payload;
    });
  },
});

export const { clearCurrentLog, clearError } = farmSlice.actions;
export default farmSlice.reducer;
