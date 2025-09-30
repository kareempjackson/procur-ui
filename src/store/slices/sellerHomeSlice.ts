import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

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
};

export type SellerHomeState = {
  data: SellerHomeResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: SellerHomeState = {
  data: null,
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
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to load seller home"
      );
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
      })
      .addCase(
        fetchSellerHome.fulfilled,
        (state, action: PayloadAction<SellerHomeResponse>) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addCase(fetchSellerHome.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to load seller home";
        state.data = null;
      });
  },
});

export default sellerHomeSlice.reducer;
