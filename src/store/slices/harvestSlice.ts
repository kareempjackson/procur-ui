import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

export type HarvestPayload = {
  product_id?: string;
  crop: string;
  expected_harvest_window?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  next_planting_crop?: string;
  next_planting_date?: string;
  next_planting_area?: string;
};

export type HarvestState = {
  status: "idle" | "submitting" | "succeeded" | "failed";
  error: string | null;
  message: string | null;
};

const initialState: HarvestState = {
  status: "idle",
  error: null,
  message: null,
};

function getClient() {
  return getApiClient(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      return (JSON.parse(raw) as { accessToken?: string }).accessToken ?? null;
    } catch {
      return null;
    }
  });
}

export const postHarvestUpdate = createAsyncThunk(
  "harvest/post",
  async (payload: HarvestPayload, { rejectWithValue }) => {
    try {
      const client = getClient();
      await client.post("/sellers/harvest-request", payload);
      return { message: "Harvest update posted." };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to post harvest update.";
      return rejectWithValue(msg);
    }
  }
);

const harvestSlice = createSlice({
  name: "harvest",
  initialState,
  reducers: {
    resetHarvestState(state) {
      state.status = "idle";
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postHarvestUpdate.pending, (state) => {
        state.status = "submitting";
        state.error = null;
        state.message = null;
      })
      .addCase(
        postHarvestUpdate.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.status = "succeeded";
          state.message = action.payload.message;
        }
      )
      .addCase(postHarvestUpdate.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to post harvest update.";
      });
  },
});

export const { resetHarvestState } = harvestSlice.actions;
export default harvestSlice.reducer;
