import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

// Types
interface ProductRequest {
  id: string;
  request_number: string;
  buyer_org_id: string;
  buyer_name: string;
  product_name: string;
  description?: string;
  category?: string;
  quantity: number;
  unit_of_measurement: string;
  budget_range?: {
    min_price?: number;
    max_price?: number;
    currency: string;
  };
  date_needed?: string;
  delivery_location?: string;
  status: "open" | "closed" | "expired" | "fulfilled";
  expires_at?: string;
  quote_count: number;
  my_quote?: {
    id: string;
    unit_price?: number;
    total_price?: number;
    currency?: string;
    available_quantity?: number;
    delivery_date?: string;
    notes?: string;
    status: string;
    created_at?: string;
  };
  buyer_rating?: number;
  created_at: string;
}

interface ProductRequestDetail extends ProductRequest {
  buyer_country?: string;
  buyer_logo_url?: string;
  specifications?: any;
  certifications_required?: string[];
  my_quote?: {
    id: string;
    unit_price: number;
    total_price: number;
    currency: string;
    available_quantity: number;
    delivery_date?: string;
    notes?: string;
    status: string;
    created_at: string;
  };
}

interface SubmitQuoteDto {
  unit_price: number;
  currency: string;
  available_quantity: number;
  delivery_date?: string;
  notes?: string;
  offered_product_id?: string;
}

interface ProductRequestsFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  category?: string;
}

interface ProductRequestsState {
  requests: ProductRequest[];
  selectedRequest: ProductRequestDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  filters: ProductRequestsFilters;
}

// Initial state
const initialState: ProductRequestsState = {
  requests: [],
  selectedRequest: null,
  status: "idle",
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
  },
  filters: {
    page: 1,
    limit: 20,
  },
};

// Async thunks
export const fetchProductRequests = createAsyncThunk(
  "sellerProductRequests/fetchRequests",
  async (filters: ProductRequestsFilters, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const response = await client.get("/sellers/product-requests", {
        params: filters,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product requests"
      );
    }
  }
);

export const fetchProductRequestDetail = createAsyncThunk(
  "sellerProductRequests/fetchDetail",
  async (requestId: string, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/sellers/product-requests/${requestId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch request details"
      );
    }
  }
);

export const submitQuote = createAsyncThunk(
  "sellerProductRequests/submitQuote",
  async (
    { requestId, quoteData }: { requestId: string; quoteData: SubmitQuoteDto },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/sellers/product-requests/${requestId}/quotes`,
        quoteData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit quote"
      );
    }
  }
);

// Slice
const sellerProductRequestsSlice = createSlice({
  name: "sellerProductRequests",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductRequestsFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch product requests
      .addCase(fetchProductRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload.requests;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchProductRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Fetch request detail
      .addCase(fetchProductRequestDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductRequestDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedRequest = action.payload;
      })
      .addCase(fetchProductRequestDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Submit quote
      .addCase(submitQuote.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitQuote.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Optionally update the selected request to show the new quote
        if (state.selectedRequest) {
          // You might want to refetch the request details here
        }
      })
      .addCase(submitQuote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearSelectedRequest } =
  sellerProductRequestsSlice.actions;

export default sellerProductRequestsSlice.reducer;
