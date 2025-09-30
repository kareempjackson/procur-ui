import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

export type SellerOrder = {
  id: string;
  order_number: string;
  status: string;
  payment_status?: string;
  total_amount: number;
  currency: string;
  items?: Array<{
    id: string;
    product_name?: string;
    quantity?: number;
    unit_price?: number;
  }>;
  created_at: string;
};

export type OrdersQuery = {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: string;
  payment_status?: string;
  order_number?: string;
  from_date?: string;
  to_date?: string;
};

export type OrdersState = {
  items: SellerOrder[];
  total: number;
  page: number;
  limit: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastQuery: OrdersQuery | null;
};

const initialState: OrdersState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  status: "idle",
  error: null,
  lastQuery: null,
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

export const fetchSellerOrders = createAsyncThunk(
  "sellerOrders/fetch",
  async (query: OrdersQuery, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/orders", { params: query });
      return {
        items: (data.orders as SellerOrder[]) ?? [],
        total: (data.total as number) ?? 0,
        page: (data.page as number) ?? query.page ?? 1,
        limit: (data.limit as number) ?? query.limit ?? 20,
        query,
      };
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch orders"
      );
    }
  }
);

const sellerOrdersSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSellerOrders.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: SellerOrder[];
            total: number;
            page: number;
            limit: number;
            query: OrdersQuery;
          }>
        ) => {
          state.status = "succeeded";
          state.items = action.payload.items;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.lastQuery = action.payload.query;
        }
      )
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch orders";
        state.items = [];
        state.total = 0;
      });
  },
});

export default sellerOrdersSlice.reducer;
