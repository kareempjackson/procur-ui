import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

export type SellerInsight = {
  id: string;
  title: string;
  sub?: string | null;
  cta?: string | null;
  urgent?: boolean;
  actionId?: string | null;
  actionUrl?: string | null;
};

type State = {
  items: SellerInsight[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: State = {
  items: [],
  status: "idle",
  error: null,
};

function getClient() {
  return getApiClient();
}

export const fetchSellerInsights = createAsyncThunk(
  "sellerInsights/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/insights");
      return (
        Array.isArray(data) ? data : (data?.data ?? [])
      ) as SellerInsight[];
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message || "Failed to load insights"; // eslint-disable-line @typescript-eslint/no-explicit-any
      return rejectWithValue(message);
    }
  }
);

export const executeSellerInsight = createAsyncThunk(
  "sellerInsights/execute",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post(
        `/sellers/insights/${payload.id}/execute`
      );
      return { id: payload.id, result: data } as {
        id: string;
        result: unknown;
      };
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message || "Failed to execute action"; // eslint-disable-line @typescript-eslint/no-explicit-any
      return rejectWithValue(message);
    }
  }
);

const sellerInsightsSlice = createSlice({
  name: "sellerInsights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerInsights.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSellerInsights.fulfilled,
        (state, action: PayloadAction<SellerInsight[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchSellerInsights.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || state.error;
      })
      .addCase(executeSellerInsight.fulfilled, (state, action) => {
        // Optionally mark an insight as handled/removed
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items.splice(idx, 1);
      });
  },
});

export default sellerInsightsSlice.reducer;
