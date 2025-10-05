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

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

export interface ProductRequest {
  id: string;
  request_number: string;
  product_name: string;
  product_type?: string;
  category?: string;
  description?: string;
  quantity: number;
  unit_of_measurement: string;
  date_needed?: string;
  budget_range?: BudgetRange;
  target_seller_id?: string;
  target_seller_name?: string;
  status: "draft" | "active" | "completed" | "cancelled" | "expired";
  response_count: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  request_id: string;
  seller_org_id: string;
  seller_name: string;
  seller_rating?: number;
  seller_verified: boolean;
  price: number;
  price_per_unit?: number;
  delivery_date: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface RequestDetail extends ProductRequest {
  quotes: Quote[];
}

export interface CreateRequestDto {
  product_name: string;
  product_type?: string;
  category?: string;
  description?: string;
  quantity: number;
  unit_of_measurement: string;
  date_needed?: string;
  budget_range?: BudgetRange;
  target_seller_id?: string;
  expires_at?: string;
}

export interface RequestsFilters {
  status?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface BuyerRequestsState {
  requests: ProductRequest[];
  currentRequest: RequestDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  requestDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  createRequestStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  requestDetailError: string | null;
  createRequestError: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  filters: RequestsFilters;
}

const initialState: BuyerRequestsState = {
  requests: [],
  currentRequest: null,
  status: "idle",
  requestDetailStatus: "idle",
  createRequestStatus: "idle",
  error: null,
  requestDetailError: null,
  createRequestError: null,
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
 * Fetch product requests list
 */
export const fetchRequests = createAsyncThunk(
  "buyerRequests/fetchRequests",
  async (filters: RequestsFilters = {}, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.from_date) params.append("from_date", filters.from_date);
      if (filters.to_date) params.append("to_date", filters.to_date);
      params.append("page", String(filters.page || 1));
      params.append("limit", String(filters.limit || 20));

      const response = await apiClient.get(
        `/buyers/requests?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Fetch single request detail with quotes
 */
export const fetchRequestDetail = createAsyncThunk(
  "buyerRequests/fetchRequestDetail",
  async (requestId: string, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.get(`/buyers/requests/${requestId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Create a new product request
 */
export const createRequest = createAsyncThunk(
  "buyerRequests/createRequest",
  async (requestDto: CreateRequestDto, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post("/buyers/requests", requestDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Accept a quote
 */
export const acceptQuote = createAsyncThunk(
  "buyerRequests/acceptQuote",
  async (
    { requestId, quoteId }: { requestId: string; quoteId: string },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post(
        `/buyers/requests/${requestId}/quotes/${quoteId}/accept`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Reject a quote
 */
export const rejectQuote = createAsyncThunk(
  "buyerRequests/rejectQuote",
  async (
    {
      requestId,
      quoteId,
      reason,
    }: { requestId: string; quoteId: string; reason?: string },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post(
        `/buyers/requests/${requestId}/quotes/${quoteId}/reject`,
        { reason }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Cancel a request
 */
export const cancelRequest = createAsyncThunk(
  "buyerRequests/cancelRequest",
  async (
    { requestId, reason }: { requestId: string; reason?: string },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post(
        `/buyers/requests/${requestId}/cancel`,
        { reason }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// ==================== SLICE ====================

const buyerRequestsSlice = createSlice({
  name: "buyerRequests",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<RequestsFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
      state.requestDetailStatus = "idle";
      state.requestDetailError = null;
    },
    resetCreateRequestStatus: (state) => {
      state.createRequestStatus = "idle";
      state.createRequestError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Requests
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests =
          action.payload.requests || action.payload.data || action.payload;

        // Handle pagination from API response
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          totalPages: Math.ceil(
            (action.payload.total || 0) / (action.payload.limit || 20)
          ),
          totalItems: action.payload.total || 0,
        };
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Fetch Request Detail
    builder
      .addCase(fetchRequestDetail.pending, (state) => {
        state.requestDetailStatus = "loading";
        state.requestDetailError = null;
      })
      .addCase(fetchRequestDetail.fulfilled, (state, action) => {
        state.requestDetailStatus = "succeeded";
        state.currentRequest = action.payload;
      })
      .addCase(fetchRequestDetail.rejected, (state, action) => {
        state.requestDetailStatus = "failed";
        state.requestDetailError = action.payload as string;
      });

    // Create Request
    builder
      .addCase(createRequest.pending, (state) => {
        state.createRequestStatus = "loading";
        state.createRequestError = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.createRequestStatus = "succeeded";
        // Add new request to the list
        state.requests.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.createRequestStatus = "failed";
        state.createRequestError = action.payload as string;
      });

    // Accept Quote
    builder.addCase(acceptQuote.fulfilled, (state, action) => {
      // Update request status
      const index = state.requests.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      // Update current request if it's the one being updated
      if (state.currentRequest?.id === action.payload.id) {
        state.currentRequest = action.payload;
      }
    });

    // Reject Quote
    builder.addCase(rejectQuote.fulfilled, (state, action) => {
      // Update current request quotes
      if (state.currentRequest) {
        state.currentRequest = action.payload;
      }
    });

    // Cancel Request
    builder.addCase(cancelRequest.fulfilled, (state, action) => {
      // Update request in the list
      const index = state.requests.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      // Update current request
      if (state.currentRequest?.id === action.payload.id) {
        state.currentRequest = action.payload;
      }
    });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentRequest,
  resetCreateRequestStatus,
} = buyerRequestsSlice.actions;

export default buyerRequestsSlice.reducer;
