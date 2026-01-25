import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import axios from "axios";

// Helper function to extract error messages
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

// ==================== INTERFACES ====================

export interface Address {
  id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  type: "shipping" | "billing" | "both";
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  unit: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  seller_org_id: string;
  seller_name: string;
  seller_location?: string;
  total_items: number;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total_amount: number;
  items: OrderItem[];
  shipping_address?: Address;
  billing_address?: Address;
  buyer_notes?: string;
  preferred_delivery_date?: string;
  estimated_delivery_date?: string;
}

export interface CreateOrderDto {
  items: { product_id: string; quantity: number }[];
  shipping_address_id: string;
  billing_address_id?: string;
  buyer_notes?: string;
  preferred_delivery_date?: string;
  credits_applied_cents?: number;
}

export interface OrdersFilters {
  status?: string;
  seller_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface BuyerOrdersState {
  orders: Order[];
  currentOrder: Order | null;
  addresses: Address[];
  status: "idle" | "loading" | "succeeded" | "failed";
  orderDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  addressesStatus: "idle" | "loading" | "succeeded" | "failed";
  createOrderStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  orderDetailError: string | null;
  addressesError: string | null;
  createOrderError: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  filters: OrdersFilters;
}

const initialState: BuyerOrdersState = {
  orders: [],
  currentOrder: null,
  addresses: [],
  status: "idle",
  orderDetailStatus: "idle",
  addressesStatus: "idle",
  createOrderStatus: "idle",
  error: null,
  orderDetailError: null,
  addressesError: null,
  createOrderError: null,
  pagination: {
    page: 1,
    limit: 20,
    totalPages: 1,
    totalItems: 0,
  },
  filters: {},
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch orders list
 */
export const fetchOrders = createAsyncThunk(
  "buyerOrders/fetchOrders",
  async (filters: OrdersFilters = {}, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.seller_id) params.append("seller_id", filters.seller_id);
      if (filters.from_date) params.append("from_date", filters.from_date);
      if (filters.to_date) params.append("to_date", filters.to_date);
      params.append("page", String(filters.page || 1));
      params.append("limit", String(filters.limit || 20));

      const response = await apiClient.get(
        `/buyers/orders?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Fetch single order detail
 */
export const fetchOrderDetail = createAsyncThunk(
  "buyerOrders/fetchOrderDetail",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      // Try common include parameters to ensure items are returned
      const candidates = [
        `/buyers/orders/${orderId}?include_items=true`,
        `/buyers/orders/${orderId}?include=items`,
        `/buyers/orders/${orderId}?include=order_items`,
        `/buyers/orders/${orderId}?include=line_items`,
        `/buyers/orders/${orderId}`,
      ];

      for (const url of candidates) {
        try {
          const response = await apiClient.get(url);
          if (response?.data) return response.data;
        } catch {
          // try next candidate
        }
      }

      // Final fallback
      const response = await apiClient.get(`/buyers/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Fetch buyer addresses
 */
export const fetchAddresses = createAsyncThunk(
  "buyerOrders/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.get("/buyers/addresses");
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Create a new order
 */
export const createOrder = createAsyncThunk(
  "buyerOrders/createOrder",
  async (orderDto: CreateOrderDto, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post("/buyers/orders", orderDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Cancel an order
 */
export const cancelOrder = createAsyncThunk(
  "buyerOrders/cancelOrder",
  async (
    { orderId, reason }: { orderId: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post(
        `/buyers/orders/${orderId}/cancel`,
        { reason }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Update order items DTO
 */
export interface UpdateOrderItemDto {
  id?: string;
  product_id?: string;
  product_name?: string;
  quantity: number;
  unit_price?: number;
}

export interface UpdateOrderDto {
  items?: UpdateOrderItemDto[];
  buyer_notes?: string;
  preferred_delivery_date?: string;
  update_reason?: string;
}

/**
 * Update an order (add/remove items, change quantities)
 */
export const updateOrder = createAsyncThunk(
  "buyerOrders/updateOrder",
  async (
    { orderId, updateDto }: { orderId: string; updateDto: UpdateOrderDto },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.patch(
        `/buyers/orders/${orderId}`,
        updateDto
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Submit order review
 */
export const submitOrderReview = createAsyncThunk(
  "buyerOrders/submitOrderReview",
  async (
    {
      orderId,
      overall_rating,
      product_quality_rating,
      delivery_rating,
      service_rating,
      title,
      comment,
      is_public,
    }: {
      orderId: string;
      overall_rating: number;
      product_quality_rating?: number;
      delivery_rating?: number;
      service_rating?: number;
      title?: string;
      comment?: string;
      is_public?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post(
        `/buyers/orders/${orderId}/review`,
        {
          overall_rating,
          product_quality_rating,
          delivery_rating,
          service_rating,
          title,
          comment,
          is_public,
        }
      );
      // Backend returns 201 with an empty body (void) on success. Return a safe
      // fallback so reducers don't assume a full Order shape.
      const data = response?.data as unknown;
      if (data && typeof data === "object") return data;
      return { id: orderId, success: true };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// ==================== SLICE ====================

const buyerOrdersSlice = createSlice({
  name: "buyerOrders",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<OrdersFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.orderDetailStatus = "idle";
      state.orderDetailError = null;
    },
    resetCreateOrderStatus: (state) => {
      state.createOrderStatus = "idle";
      state.createOrderError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload as unknown as {
          orders?: unknown;
          data?: unknown;
          pagination?: BuyerOrdersState["pagination"];
          total?: unknown;
          page?: unknown;
          limit?: unknown;
        };
        // API returns { orders, total, page, limit } for buyers
        // Some endpoints may return { data, pagination }
        const orders = payload.orders ?? payload.data ?? [];
        state.orders = Array.isArray(orders) ? (orders as Order[]) : [];

        // Normalize pagination
        if (payload.pagination) {
          state.pagination = payload.pagination;
        } else {
          const total = Number(
            payload.total ?? state.pagination.totalItems ?? 0
          );
          const page = Number(payload.page ?? state.pagination.page ?? 1);
          const limit = Number(payload.limit ?? state.pagination.limit ?? 20);
          state.pagination.page = page;
          state.pagination.limit = limit;
          state.pagination.totalItems = total;
          state.pagination.totalPages = Math.max(1, Math.ceil(total / limit));
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Fetch Order Detail
    builder
      .addCase(fetchOrderDetail.pending, (state) => {
        state.orderDetailStatus = "loading";
        state.orderDetailError = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.orderDetailStatus = "succeeded";
        const payload = action.payload as unknown;
        const asObj =
          payload && typeof payload === "object"
            ? (payload as Record<string, unknown>)
            : null;
        const dataObj =
          asObj?.data && typeof asObj.data === "object"
            ? (asObj.data as Record<string, unknown>)
            : null;
        const dataDataObj =
          dataObj?.data && typeof dataObj.data === "object"
            ? (dataObj.data as Record<string, unknown>)
            : null;

        // Unwrap common shapes: { order }, { data: { order } }, { data: { data } }, { data }, raw object
        const unwrapped =
          (asObj?.order as unknown) ??
          (dataObj?.order as unknown) ??
          (dataDataObj as unknown) ??
          (asObj?.data as unknown) ??
          payload ??
          null;
        state.currentOrder = (unwrapped as Order) ?? null;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.orderDetailStatus = "failed";
        state.orderDetailError = action.payload as string;
      });

    // Fetch Addresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.addressesStatus = "loading";
        state.addressesError = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addressesStatus = "succeeded";
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.addressesStatus = "failed";
        state.addressesError = action.payload as string;
      });

    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.createOrderStatus = "loading";
        state.createOrderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrderStatus = "succeeded";
        // Add new order to the list
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrderStatus = "failed";
        state.createOrderError = action.payload as string;
      });

    // Cancel Order
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      // Update order in the list
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      // Update current order if it's the one being cancelled
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    });

    // Submit Order Review
    builder.addCase(submitOrderReview.fulfilled, (state, action) => {
      const payload = action.payload as unknown;
      if (!payload || typeof payload !== "object") return;
      const maybeId = (payload as { id?: unknown }).id;
      if (typeof maybeId !== "string" || !maybeId) return;

      // Best-effort merge if API returns partial or full updated order.
      const patch = payload as Partial<Order> & { id: string };

      const index = state.orders.findIndex((o) => o.id === maybeId);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...patch } as Order;
      }
      if (state.currentOrder?.id === maybeId) {
        state.currentOrder = { ...state.currentOrder, ...patch } as Order;
      }
    });

    // Update Order
    builder.addCase(updateOrder.fulfilled, (state, action) => {
      const payload = action.payload as unknown;
      if (!payload || typeof payload !== "object") return;
      const maybeId = (payload as { id?: unknown }).id;
      if (typeof maybeId !== "string" || !maybeId) return;

      const updated = payload as Order;

      // Update order in the list
      const index = state.orders.findIndex((o) => o.id === maybeId);
      if (index !== -1) {
        state.orders[index] = updated;
      }
      // Update current order if it's the one being updated
      if (state.currentOrder?.id === maybeId) {
        state.currentOrder = updated;
      }
    });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentOrder,
  resetCreateOrderStatus,
} = buyerOrdersSlice.actions;

export default buyerOrdersSlice.reducer;
