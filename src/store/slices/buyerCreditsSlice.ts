import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "..";

export type BuyerCreditTransaction = {
  id: string;
  amount_cents: number;
  amount: number;
  balance_after_cents: number;
  balance_after: number;
  type: string;
  reason: string;
  note: string | null;
  order_id: string | null;
  created_at: string;
};

export type BuyerCreditsState = {
  creditAmountCents: number;
  creditAmount: number;
  currency: string;
  balanceStatus: "idle" | "loading" | "succeeded" | "failed";

  transactions: BuyerCreditTransaction[];
  transactionsTotal: number;
  transactionsStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: BuyerCreditsState = {
  creditAmountCents: 0,
  creditAmount: 0,
  currency: "XCD",
  balanceStatus: "idle",

  transactions: [],
  transactionsTotal: 0,
  transactionsStatus: "idle",
};

export const fetchBuyerCreditBalance = createAsyncThunk(
  "buyerCredits/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const { getApiClient } = await import("@/lib/apiClient");
      const client = getApiClient();
      const { data } = await client.get("/buyers/credits/balance");
      return data as {
        credit_amount_cents: number;
        credit_amount: number;
        currency: string;
      };
    } catch {
      return rejectWithValue("Failed to fetch credit balance");
    }
  }
);

export const fetchBuyerCreditTransactions = createAsyncThunk(
  "buyerCredits/fetchTransactions",
  async (
    args: { page?: number; limit?: number } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const { getApiClient } = await import("@/lib/apiClient");
      const client = getApiClient();
      const { data } = await client.get("/buyers/credits/transactions", {
        params: args,
      });
      return data as {
        transactions: BuyerCreditTransaction[];
        total: number;
        page: number;
        limit: number;
      };
    } catch {
      return rejectWithValue("Failed to fetch credit transactions");
    }
  }
);

const buyerCreditsSlice = createSlice({
  name: "buyerCredits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch balance
      .addCase(fetchBuyerCreditBalance.pending, (state) => {
        state.balanceStatus = "loading";
      })
      .addCase(
        fetchBuyerCreditBalance.fulfilled,
        (
          state,
          action: PayloadAction<{
            credit_amount_cents: number;
            credit_amount: number;
            currency: string;
          }>
        ) => {
          state.balanceStatus = "succeeded";
          state.creditAmountCents = action.payload.credit_amount_cents;
          state.creditAmount = action.payload.credit_amount;
          state.currency = action.payload.currency;
        }
      )
      .addCase(fetchBuyerCreditBalance.rejected, (state) => {
        state.balanceStatus = "failed";
      })
      // Fetch transactions
      .addCase(fetchBuyerCreditTransactions.pending, (state) => {
        state.transactionsStatus = "loading";
      })
      .addCase(
        fetchBuyerCreditTransactions.fulfilled,
        (
          state,
          action: PayloadAction<{
            transactions: BuyerCreditTransaction[];
            total: number;
          }>
        ) => {
          state.transactionsStatus = "succeeded";
          state.transactions = action.payload.transactions;
          state.transactionsTotal = action.payload.total;
        }
      )
      .addCase(fetchBuyerCreditTransactions.rejected, (state) => {
        state.transactionsStatus = "failed";
      });
  },
});

export const selectBuyerCredits = (state: RootState) => state.buyerCredits;

export default buyerCreditsSlice.reducer;

