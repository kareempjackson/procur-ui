import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

export type SellerPayout = {
  id: string;
  transaction_number: string | null;
  order_id: string | null;
  amount: number;
  amount_cents: number;
  currency: string;
  status: string;
  phase: string | null;
  proof_url: string | null;
  processed_at: string | null;
  paid_at: string | null;
  created_at: string;
};

export type SellerBalance = {
  available_amount: number;
  available_amount_cents: number;
  pending_amount: number;
  pending_amount_cents: number;
  // Credits: positive means seller owes Procur, negative means Procur owes seller
  credit_amount: number;
  credit_amount_cents: number;
  has_credit_balance: boolean;
  credit_type: "owes_procur" | "owed_by_procur" | "none";
  currency: string;
  minimum_payout_amount: number;
  minimum_payout_cents: number;
  can_request_payout: boolean;
};

export type SellerCreditTransaction = {
  id: string;
  amount_cents: number;
  amount: number;
  balance_after_cents: number;
  balance_after: number;
  type: string;
  reason: string;
  note: string | null;
  reference: string | null;
  order_id: string | null;
  created_at: string;
};

export type PayoutSettings = {
  minimum_payout_amount: number;
  minimum_payout_cents: number;
  currency: string;
  payout_frequency_days: number;
  payout_frequency_label: string;
  next_payout_date: string;
};

export type PayoutRequest = {
  id: string;
  amount: number;
  amount_cents: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  requested_at: string;
  processed_at: string | null;
  completed_at: string | null;
  rejection_reason: string | null;
  note: string | null;
  admin_note: string | null;
};

export type SellerPayoutsState = {
  balance: SellerBalance | null;
  balanceStatus: "idle" | "loading" | "succeeded" | "failed";
  settings: PayoutSettings | null;
  settingsStatus: "idle" | "loading" | "succeeded" | "failed";
  payouts: SellerPayout[];
  total: number;
  page: number;
  limit: number;
  payoutsStatus: "idle" | "loading" | "succeeded" | "failed";
  // Payout history (admin-issued)
  payoutRequests: PayoutRequest[];
  payoutRequestsTotal: number;
  payoutRequestsStatus: "idle" | "loading" | "succeeded" | "failed";
  // Credit transactions
  creditTransactions: SellerCreditTransaction[];
  creditTransactionsTotal: number;
  creditTransactionsStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: SellerPayoutsState = {
  balance: null,
  balanceStatus: "idle",
  settings: null,
  settingsStatus: "idle",
  payouts: [],
  total: 0,
  page: 1,
  limit: 20,
  payoutsStatus: "idle",
  payoutRequests: [],
  payoutRequestsTotal: 0,
  payoutRequestsStatus: "idle",
  creditTransactions: [],
  creditTransactionsTotal: 0,
  creditTransactionsStatus: "idle",
  error: null,
};

export const fetchSellerBalance = createAsyncThunk(
  "sellerPayouts/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const { data } = await client.get("/sellers/balance");
      return data as SellerBalance;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch balance"
      );
    }
  }
);

export const fetchPayoutSettings = createAsyncThunk(
  "sellerPayouts/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const { data } = await client.get("/sellers/payouts/settings");
      return data as PayoutSettings;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch payout settings"
      );
    }
  }
);

export const fetchSellerPayouts = createAsyncThunk(
  "sellerPayouts/fetchPayouts",
  async (
    query: { page?: number; limit?: number; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient();
      const { data } = await client.get("/sellers/payouts", { params: query });
      return {
        payouts: data.payouts as SellerPayout[],
        total: data.total as number,
        page: data.page as number,
        limit: data.limit as number,
      };
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch payouts"
      );
    }
  }
);

export const fetchCreditTransactions = createAsyncThunk(
  "sellerPayouts/fetchCreditTransactions",
  async (
    query: { page?: number; limit?: number } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient();
      const { data } = await client.get("/sellers/credits/transactions", {
        params: query,
      });
      return {
        transactions: data.transactions as SellerCreditTransaction[],
        total: data.total as number,
      };
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch credit transactions"
      );
    }
  }
);

export const fetchPayoutRequests = createAsyncThunk(
  "sellerPayouts/fetchPayoutRequests",
  async (
    query: { page?: number; limit?: number; status?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient();
      const { data } = await client.get("/sellers/payouts/requests", {
        params: query,
      });
      return {
        requests: data.requests as PayoutRequest[],
        total: data.total as number,
      };
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch payout requests"
      );
    }
  }
);

const sellerPayoutsSlice = createSlice({
  name: "sellerPayouts",
  initialState,
  reducers: {
    resetPayoutsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Balance
      .addCase(fetchSellerBalance.pending, (state) => {
        state.balanceStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchSellerBalance.fulfilled,
        (state, action: PayloadAction<SellerBalance>) => {
          state.balanceStatus = "succeeded";
          state.balance = action.payload;
        }
      )
      .addCase(fetchSellerBalance.rejected, (state, action) => {
        state.balanceStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch balance";
      })
      // Settings
      .addCase(fetchPayoutSettings.pending, (state) => {
        state.settingsStatus = "loading";
      })
      .addCase(
        fetchPayoutSettings.fulfilled,
        (state, action: PayloadAction<PayoutSettings>) => {
          state.settingsStatus = "succeeded";
          state.settings = action.payload;
        }
      )
      .addCase(fetchPayoutSettings.rejected, (state, action) => {
        state.settingsStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch payout settings";
      })
      // Payouts
      .addCase(fetchSellerPayouts.pending, (state) => {
        state.payoutsStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchSellerPayouts.fulfilled,
        (
          state,
          action: PayloadAction<{
            payouts: SellerPayout[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.payoutsStatus = "succeeded";
          state.payouts = action.payload.payouts;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(fetchSellerPayouts.rejected, (state, action) => {
        state.payoutsStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch payouts";
        state.payouts = [];
        state.total = 0;
      })
      // Credit Transactions
      .addCase(fetchCreditTransactions.pending, (state) => {
        state.creditTransactionsStatus = "loading";
      })
      .addCase(
        fetchCreditTransactions.fulfilled,
        (
          state,
          action: PayloadAction<{
            transactions: SellerCreditTransaction[];
            total: number;
          }>
        ) => {
          state.creditTransactionsStatus = "succeeded";
          state.creditTransactions = action.payload.transactions;
          state.creditTransactionsTotal = action.payload.total;
        }
      )
      .addCase(fetchCreditTransactions.rejected, (state, action) => {
        state.creditTransactionsStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch credit transactions";
        state.creditTransactions = [];
        state.creditTransactionsTotal = 0;
      })
      // Payout Requests
      .addCase(fetchPayoutRequests.pending, (state) => {
        state.payoutRequestsStatus = "loading";
      })
      .addCase(
        fetchPayoutRequests.fulfilled,
        (
          state,
          action: PayloadAction<{
            requests: PayoutRequest[];
            total: number;
          }>
        ) => {
          state.payoutRequestsStatus = "succeeded";
          state.payoutRequests = action.payload.requests;
          state.payoutRequestsTotal = action.payload.total;
        }
      )
      .addCase(fetchPayoutRequests.rejected, (state, action) => {
        state.payoutRequestsStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch payout requests";
        state.payoutRequests = [];
        state.payoutRequestsTotal = 0;
      })
      ;
  },
});

export const { resetPayoutsState } = sellerPayoutsSlice.actions;

export default sellerPayoutsSlice.reducer;

