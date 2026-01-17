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

export interface Transaction {
  id: string;
  transaction_number: string;
  order_id?: string;
  order_number?: string;
  seller_org_id: string;
  seller_name: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  payment_method?: string;
  payment_reference?: string;
  platform_fee: number;
  payment_processing_fee: number;
  net_amount: number;
  description?: string;
  metadata?: any;
  processed_at?: string;
  settled_at?: string;
  created_at: string;
  updated_at: string;
  can_dispute?: boolean;
}

export interface TransactionSummary {
  total_transactions: number;
  total_spent: number;
  total_refunds: number;
  total_fees: number;
  net_spent: number;
  currency: string;
  transactions_by_status: Record<string, number>;
  transactions_by_type: Record<string, number>;
  monthly_spending: {
    month: string;
    amount: number;
    transaction_count: number;
  }[];
  top_sellers: {
    seller_id: string;
    seller_name: string;
    total_amount: number;
    transaction_count: number;
  }[];
  average_transaction_amount: number;
  largest_transaction: number;
  most_recent_transaction: string;
}

export interface TransactionsFilters {
  type?: string;
  status?: string;
  seller_id?: string;
  order_id?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface BuyerTransactionsState {
  transactions: Transaction[];
  summary: TransactionSummary | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  filters: TransactionsFilters;
}

const initialState: BuyerTransactionsState = {
  transactions: [],
  summary: null,
  status: "idle",
  error: null,
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
 * Fetch transactions list
 */
export const fetchTransactions = createAsyncThunk(
  "buyerTransactions/fetchTransactions",
  async (filters: TransactionsFilters = {}, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      const params = new URLSearchParams();

      if (filters.type) params.append("type", filters.type);
      if (filters.status) params.append("status", filters.status);
      if (filters.seller_id) params.append("seller_id", filters.seller_id);
      if (filters.order_id) params.append("order_id", filters.order_id);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.min_amount)
        params.append("min_amount", String(filters.min_amount));
      if (filters.max_amount)
        params.append("max_amount", String(filters.max_amount));
      if (filters.search) params.append("search", filters.search);
      params.append("page", String(filters.page || 1));
      params.append("limit", String(filters.limit || 20));
      params.append("sort_by", filters.sort_by || "created_at");
      params.append("sort_order", filters.sort_order || "desc");

      const response = await apiClient.get(
        `/buyers/transactions?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

/**
 * Fetch single transaction detail
 */
export const fetchTransactionDetail = createAsyncThunk(
  "buyerTransactions/fetchTransactionDetail",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.get(
        `/buyers/transactions/${transactionId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// ==================== SLICE ====================

const buyerTransactionsSlice = createSlice({
  name: "buyerTransactions",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TransactionsFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        const requestedPage = action.meta.arg?.page || 1;
        const incoming: Transaction[] = action.payload.transactions || [];

        // If we're fetching a subsequent page, append (deduping by id).
        // Otherwise, replace the list (fresh query / filter change).
        if (requestedPage > 1) {
          const existingIds = new Set(state.transactions.map((t) => t.id));
          const dedupedIncoming = incoming.filter((t) => !existingIds.has(t.id));
          state.transactions = [...state.transactions, ...dedupedIncoming];
        } else {
          state.transactions = incoming;
        }

        state.summary = action.payload.summary || null;

        // Handle pagination
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          totalPages: Math.ceil(
            (action.payload.total || 0) / (action.payload.limit || 20)
          ),
          totalItems: action.payload.total || 0,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = buyerTransactionsSlice.actions;

export default buyerTransactionsSlice.reducer;
