import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import axios from "axios";

export type SellerHomeMetrics = {
  total_revenue: number;
  total_orders: number;
  active_products: number;
  pending_orders: number;
  average_order_value: number;
};

export type SellerHomeProduct = {
  id: string;
  name: string;
  images?: Array<{ image_url: string; is_primary?: boolean }>;
  base_price?: number;
  sale_price?: number;
  currency?: string;
  sku?: string;
  stock_quantity?: number;
  min_stock_level?: number;
};

export type SellerHomeOrder = {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency?: string;
  buyer_info?: {
    organization_name?: string;
    business_name?: string;
  };
  items?: Array<{ id: string; quantity: number; unit_price: number }>;
  created_at: string;
};

export type SellerBuyerRequest = {
  id: string;
  request_number: string;
  product_name: string;
  quantity: number;
  unit_of_measurement: string;
  buyer_name: string;
  date_needed?: string;
  budget_range_text?: string;
  priority?: "high" | "normal";
};

export type SellerHomeResponse = {
  metrics: SellerHomeMetrics;
  featured_products: SellerHomeProduct[];
  inventory: SellerHomeProduct[];
  recent_orders: SellerHomeOrder[];
  buyer_requests: SellerBuyerRequest[];
  latest_farm_visit_request?: {
    id: string;
    status: string;
    preferred_date: string | null;
    preferred_time_window: string | null;
    notes: string | null;
    scheduled_for: string | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
  } | null;
};

export type SellerHomeState = {
  data: SellerHomeResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  errorStatus: number | null;
};

const initialState: SellerHomeState = {
  data: null,
  status: "idle",
  error: null,
  errorStatus: null,
};

function getClient() {
  return getApiClient();
}

export const fetchSellerHome = createAsyncThunk(
  "sellerHome/fetch",
  async (
    query: { period?: string; start_date?: string; end_date?: string } | void,
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/home", {
        params: query ?? { period: "last_30_days" },
      });
      return data as SellerHomeResponse;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status ?? null;
        const msg = (err.response?.data as { message?: string | string[] })
          ?.message;
        const message = Array.isArray(msg)
          ? msg.join(", ")
          : typeof msg === "string" && msg.trim()
            ? msg
            : err.message || "Failed to load seller home";
        return rejectWithValue({ message, status });
      }
      return rejectWithValue({
        message:
          (err as { message?: string })?.message || "Failed to load seller home",
        status: null,
      });
    }
  }
);

const sellerHomeSlice = createSlice({
  name: "sellerHome",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerHome.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorStatus = null;
      })
      .addCase(
        fetchSellerHome.fulfilled,
        (state, action: PayloadAction<SellerHomeResponse>) => {
          state.status = "succeeded";
          state.data = action.payload;
          state.error = null;
          state.errorStatus = null;
        }
      )
      .addCase(fetchSellerHome.rejected, (state, action) => {
        state.status = "failed";
        const payload = action.payload as unknown as
          | { message?: string; status?: number | null }
          | string
          | undefined;
        if (typeof payload === "string") {
          state.error = payload || "Failed to load seller home";
          state.errorStatus = null;
        } else {
          state.error = payload?.message || "Failed to load seller home";
          state.errorStatus =
            typeof payload?.status === "number" ? payload.status : null;
        }
        state.data = null;
      });
  },
});

export default sellerHomeSlice.reducer;
