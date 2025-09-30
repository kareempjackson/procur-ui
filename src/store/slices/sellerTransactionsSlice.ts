import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

export type SellerTransaction = {
  id: string;
  transaction_number?: string;
  order_id?: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  platform_fee?: number;
  payment_processing_fee?: number;
  net_amount?: number;
  payment_method?: string;
  created_at: string;
};

export type TransactionsQuery = {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  type?: string;
  status?: string;
  payment_method?: string;
  transaction_number?: string;
  min_amount?: number;
  max_amount?: number;
  from_date?: string;
  to_date?: string;
};

export type TransactionsSummary = {
  total_sales: number;
  total_refunds: number;
  total_fees: number;
  net_earnings: number;
};

export type TransactionsState = {
  items: SellerTransaction[];
  total: number;
  page: number;
  limit: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastQuery: TransactionsQuery | null;
  summary: TransactionsSummary | null;
  summaryStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: TransactionsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  status: "idle",
  error: null,
  lastQuery: null,
  summary: null,
  summaryStatus: "idle",
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

export const fetchSellerTransactions = createAsyncThunk(
  "sellerTransactions/fetch",
  async (query: TransactionsQuery, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/transactions", {
        params: query,
      });
      return {
        items: (data.transactions as SellerTransaction[]) ?? [],
        total: (data.total as number) ?? 0,
        page: (data.page as number) ?? query.page ?? 1,
        limit: (data.limit as number) ?? query.limit ?? 20,
        query,
      };
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch transactions"
      );
    }
  }
);

export const fetchTransactionsSummary = createAsyncThunk(
  "sellerTransactions/summary",
  async (
    query: { period?: string; start_date?: string; end_date?: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/transactions/summary", {
        params: query,
      });
      return {
        total_sales: data.total_sales || 0,
        total_refunds: data.total_refunds || 0,
        total_fees: data.total_fees || 0,
        net_earnings: data.net_earnings || 0,
      } as TransactionsSummary;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message ||
          "Failed to fetch transactions summary"
      );
    }
  }
);

const sellerTransactionsSlice = createSlice({
  name: "sellerTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSellerTransactions.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: SellerTransaction[];
            total: number;
            page: number;
            limit: number;
            query: TransactionsQuery;
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
      .addCase(fetchSellerTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch transactions";
        state.items = [];
        state.total = 0;
      })
      .addCase(fetchTransactionsSummary.pending, (state) => {
        state.summaryStatus = "loading";
      })
      .addCase(
        fetchTransactionsSummary.fulfilled,
        (state, action: PayloadAction<TransactionsSummary>) => {
          state.summaryStatus = "succeeded";
          state.summary = action.payload;
        }
      )
      .addCase(fetchTransactionsSummary.rejected, (state) => {
        state.summaryStatus = "failed";
      });
  },
});

export default sellerTransactionsSlice.reducer;
