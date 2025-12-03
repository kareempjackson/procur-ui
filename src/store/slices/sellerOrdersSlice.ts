import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

export type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_sku?: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  product_snapshot?: any;
  created_at: string;
};

export type OrderTimeline = {
  id: string;
  event_type: string;
  title: string;
  description?: string;
  actor_user_id?: string;
  actor_type?: string;
  metadata?: any;
  is_visible_to_buyer: boolean;
  is_visible_to_seller: boolean;
  created_at: string;
};

export type SellerOrder = {
  id: string;
  order_number: string;
  buyer_org_id: string;
  seller_org_id: string;
  buyer_user_id?: string;
  buyer_info?: {
    organization_name?: string;
    business_name?: string;
  };
  status: string;
  payment_status?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  shipping_address?: any;
  billing_address?: any;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  tracking_number?: string;
  shipping_method?: string;
  buyer_notes?: string;
  seller_notes?: string;
  internal_notes?: string;
  accepted_at?: string;
  rejected_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  timeline?: OrderTimeline[];
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
  currentOrder: SellerOrder | null;
  currentOrderStatus: "idle" | "loading" | "succeeded" | "failed";
  timeline: OrderTimeline[];
  timelineStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: OrdersState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  status: "idle",
  error: null,
  lastQuery: null,
  currentOrder: null,
  currentOrderStatus: "idle",
  timeline: [],
  timelineStatus: "idle",
};

function getClient() {
  return getApiClient();
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
    } catch (err: any) {
      const status = err?.response?.status as number | undefined;
      if (status === 403) {
        // Seller must be verified before viewing/managing orders
        return rejectWithValue(
          "You must be verified to use this functionality. Please complete your business details and upload your Farmer ID on the Seller → Business page so your account can be reviewed and approved."
        );
      }

      const fallbackMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch orders";

      return rejectWithValue(fallbackMessage);
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  "sellerOrders/fetchDetail",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get(`/sellers/orders/${orderId}`);
      return data as SellerOrder;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message ||
          "Failed to fetch order details"
      );
    }
  }
);

export const fetchOrderTimeline = createAsyncThunk(
  "sellerOrders/fetchTimeline",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get(`/sellers/orders/${orderId}/timeline`);
      return data as OrderTimeline[];
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message ||
          "Failed to fetch order timeline"
      );
    }
  }
);

export const acceptOrder = createAsyncThunk(
  "sellerOrders/accept",
  async (
    {
      orderId,
      acceptData,
    }: {
      orderId: string;
      acceptData?: {
        seller_notes?: string;
        estimated_delivery_date?: string;
        shipping_method?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const payload = acceptData ?? {};
      const { data } = await client.patch(
        `/sellers/orders/${orderId}/accept`,
        payload
      );
      return data as SellerOrder;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to accept order"
      );
    }
  }
);

export const rejectOrder = createAsyncThunk(
  "sellerOrders/reject",
  async (
    {
      orderId,
      rejectData,
    }: {
      orderId: string;
      rejectData: {
        reason: string;
        seller_notes?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.patch(
        `/sellers/orders/${orderId}/reject`,
        rejectData
      );
      return data as SellerOrder;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to reject order"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "sellerOrders/updateStatus",
  async (
    {
      orderId,
      statusData,
    }: {
      orderId: string;
      statusData: {
        status?: string;
        tracking_number?: string;
        shipping_method?: string;
        estimated_delivery_date?: string;
        seller_notes?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.patch(
        `/sellers/orders/${orderId}/status`,
        statusData
      );
      return data as SellerOrder;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message ||
          "Failed to update order status"
      );
    }
  }
);

const sellerOrdersSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.currentOrderStatus = "idle";
      state.timeline = [];
      state.timelineStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders list
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
      })
      // Fetch order detail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.currentOrderStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchOrderDetail.fulfilled,
        (state, action: PayloadAction<SellerOrder>) => {
          state.currentOrderStatus = "succeeded";
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.currentOrderStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch order details";
      })
      // Fetch order timeline
      .addCase(fetchOrderTimeline.pending, (state) => {
        state.timelineStatus = "loading";
      })
      .addCase(
        fetchOrderTimeline.fulfilled,
        (state, action: PayloadAction<OrderTimeline[]>) => {
          state.timelineStatus = "succeeded";
          state.timeline = action.payload;
        }
      )
      .addCase(fetchOrderTimeline.rejected, (state, action) => {
        state.timelineStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch timeline";
      })
      // Accept order
      .addCase(acceptOrder.pending, (state) => {
        state.currentOrderStatus = "loading";
        state.error = null;
      })
      .addCase(
        acceptOrder.fulfilled,
        (state, action: PayloadAction<SellerOrder>) => {
          state.currentOrderStatus = "succeeded";
          state.currentOrder = action.payload;
          // Update in items list if exists
          const index = state.items.findIndex(
            (o) => o.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      )
      .addCase(acceptOrder.rejected, (state, action) => {
        state.currentOrderStatus = "failed";
        state.error = (action.payload as string) || "Failed to accept order";
      })
      // Reject order
      .addCase(rejectOrder.pending, (state) => {
        state.currentOrderStatus = "loading";
        state.error = null;
      })
      .addCase(
        rejectOrder.fulfilled,
        (state, action: PayloadAction<SellerOrder>) => {
          state.currentOrderStatus = "succeeded";
          state.currentOrder = action.payload;
          // Update in items list if exists
          const index = state.items.findIndex(
            (o) => o.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      )
      .addCase(rejectOrder.rejected, (state, action) => {
        state.currentOrderStatus = "failed";
        state.error = (action.payload as string) || "Failed to reject order";
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.currentOrderStatus = "loading";
        state.error = null;
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<SellerOrder>) => {
          state.currentOrderStatus = "succeeded";
          state.currentOrder = action.payload;
          // Update in items list if exists
          const index = state.items.findIndex(
            (o) => o.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      )
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.currentOrderStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to update order status";
      });
  },
});

export const { clearCurrentOrder } = sellerOrdersSlice.actions;

export default sellerOrdersSlice.reducer;
