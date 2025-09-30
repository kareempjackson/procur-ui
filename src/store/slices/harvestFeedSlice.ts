import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

export type HarvestComment = {
  id: string;
  harvest_id: string;
  buyer_org_id: string;
  buyer_user_id: string;
  content: string;
  created_at: string;
};

export type HarvestBuyerRequest = {
  id: string;
  harvest_id: string;
  seller_org_id: string;
  buyer_org_id: string;
  buyer_user_id: string;
  requested_quantity: number;
  unit: string;
  requested_date?: string | null;
  notes?: string | null;
  status: "pending" | "acknowledged_yes" | "acknowledged_no";
  acknowledged_at?: string | null;
  acknowledged_by?: string | null;
  seller_message?: string | null;
  created_at: string;
};

export type HarvestFeedItem = {
  id: string;
  seller_org_id: string;
  crop: string;
  expected_harvest_window?: string | null;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
  created_at: string;
  comments_count: number;
  requests_count: number;
  comments: HarvestComment[];
  requests: HarvestBuyerRequest[];
};

type State = {
  items: HarvestFeedItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: State = {
  items: [],
  status: "idle",
  error: null,
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

export const fetchHarvestFeed = createAsyncThunk(
  "harvestFeed/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/harvest-feed");
      return data as HarvestFeedItem[];
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to load harvest feed"
      );
    }
  }
);

export const addHarvestComment = createAsyncThunk(
  "harvestFeed/addComment",
  async (
    params: { harvestId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.post(
        `/sellers/harvest/${params.harvestId}/comments`,
        { content: params.content }
      );
      return data as HarvestComment;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to post comment"
      );
    }
  }
);

export const createHarvestBuyerRequest = createAsyncThunk(
  "harvestFeed/createBuyerRequest",
  async (
    params: {
      harvestId: string;
      quantity: number;
      unit: string;
      requested_date?: string;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.post(
        `/sellers/harvest/${params.harvestId}/requests`,
        {
          quantity: params.quantity,
          unit: params.unit,
          requested_date: params.requested_date,
          notes: params.notes,
        }
      );
      return data as HarvestBuyerRequest;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create request"
      );
    }
  }
);

export const acknowledgeHarvestBuyerRequest = createAsyncThunk(
  "harvestFeed/acknowledgeBuyerRequest",
  async (
    params: {
      requestId: string;
      can_fulfill: boolean;
      seller_message?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.patch(
        `/sellers/harvest/requests/${params.requestId}/acknowledge`,
        {
          can_fulfill: params.can_fulfill,
          seller_message: params.seller_message,
        }
      );
      return data as HarvestBuyerRequest;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to acknowledge request"
      );
    }
  }
);

const harvestFeedSlice = createSlice({
  name: "harvestFeed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHarvestFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchHarvestFeed.fulfilled,
        (state, action: PayloadAction<HarvestFeedItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchHarvestFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || state.error;
      })
      .addCase(
        addHarvestComment.fulfilled,
        (state, action: PayloadAction<HarvestComment>) => {
          const comment = action.payload;
          const item = state.items.find((i) => i.id === comment.harvest_id);
          if (item) {
            item.comments.push(comment);
            item.comments_count += 1;
          }
        }
      )
      .addCase(
        createHarvestBuyerRequest.fulfilled,
        (state, action: PayloadAction<HarvestBuyerRequest>) => {
          const req = action.payload;
          const item = state.items.find((i) => i.id === req.harvest_id);
          if (item) {
            item.requests.push(req);
            item.requests_count += 1;
          }
        }
      )
      .addCase(
        acknowledgeHarvestBuyerRequest.fulfilled,
        (state, action: PayloadAction<HarvestBuyerRequest>) => {
          const updated = action.payload;
          const item = state.items.find((i) => i.id === updated.harvest_id);
          if (item) {
            const idx = item.requests.findIndex((r) => r.id === updated.id);
            if (idx !== -1) item.requests[idx] = updated;
          }
        }
      );
  },
});

export default harvestFeedSlice.reducer;
