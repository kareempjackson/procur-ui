import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";

// ==================== STATE INTERFACE ====================

export interface SupplyDemandItem {
  crop: string;
  supply: number;
  demand: number;
  gap: number;
  gapPercentage: number;
  avgPrice: string;
  trend: "increasing" | "decreasing" | "stable";
}

export interface Transaction {
  id: string;
  date: string;
  seller: string;
  sellerId: string;
  buyer: string;
  crop: string;
  quantity: string;
  pricePerUnit: string;
  totalValue: string;
  status: "completed" | "pending" | "cancelled";
}

export interface MarketStats {
  totalTransactions: number;
  totalValue: number;
  averageTransactionValue: number;
  topCrop: string;
  supplyDeficit: number;
  supplyDeficitCount: number;
}

export interface PriceTrend {
  date: string;
  crop: string;
  price: number;
  change: number;
}

export interface GovernmentMarketState {
  // Supply and demand
  supplyDemand: SupplyDemandItem[];
  supplyDemandStatus: "idle" | "loading" | "succeeded" | "failed";
  supplyDemandError: string | null;

  // Transactions
  transactions: Transaction[];
  transactionsStatus: "idle" | "loading" | "succeeded" | "failed";
  transactionsError: string | null;
  transactionsPagination: {
    page: number;
    limit: number;
    total: number;
  };

  // Market stats
  stats: MarketStats | null;
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
  statsError: string | null;

  // Price trends
  priceTrends: PriceTrend[];
  priceTrendsStatus: "idle" | "loading" | "succeeded" | "failed";
  priceTrendsError: string | null;

  // Filters
  selectedPeriod: "week" | "month" | "quarter" | "year";
  selectedCrop: string | null;
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentMarketState = {
  supplyDemand: [],
  supplyDemandStatus: "idle",
  supplyDemandError: null,

  transactions: [],
  transactionsStatus: "idle",
  transactionsError: null,
  transactionsPagination: {
    page: 1,
    limit: 20,
    total: 0,
  },

  stats: null,
  statsStatus: "idle",
  statsError: null,

  priceTrends: [],
  priceTrendsStatus: "idle",
  priceTrendsError: null,

  selectedPeriod: "month",
  selectedCrop: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch supply and demand analysis
 */
export const fetchSupplyDemand = createAsyncThunk(
  "governmentMarket/fetchSupplyDemand",
  async (
    params:
      | {
          period?: "week" | "month" | "quarter" | "year";
          crop?: string;
        }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getSupplyDemand(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch supply and demand data"
      );
    }
  }
);

/**
 * Fetch market transactions
 */
export const fetchTransactions = createAsyncThunk(
  "governmentMarket/fetchTransactions",
  async (
    params:
      | {
          page?: number;
          limit?: number;
          status?: string;
          start_date?: string;
          end_date?: string;
        }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await governmentApi.getTransactions(params);
      return {
        data: response.data || response,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: (response as any).total || 0,
        },
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

/**
 * Fetch market statistics
 */
export const fetchMarketStats = createAsyncThunk(
  "governmentMarket/fetchMarketStats",
  async (
    params:
      | {
          period?: "week" | "month" | "quarter" | "year";
        }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getMarketStats(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch market stats"
      );
    }
  }
);

/**
 * Fetch price trends
 */
export const fetchPriceTrends = createAsyncThunk(
  "governmentMarket/fetchPriceTrends",
  async (
    params:
      | {
          crop?: string;
          period?: "week" | "month" | "quarter" | "year";
        }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const data = await governmentApi.getPriceTrends(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch price trends"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentMarketSlice = createSlice({
  name: "governmentMarket",
  initialState,
  reducers: {
    // Set selected period
    setSelectedPeriod: (
      state,
      action: PayloadAction<"week" | "month" | "quarter" | "year">
    ) => {
      state.selectedPeriod = action.payload;
    },

    // Set selected crop
    setSelectedCrop: (state, action: PayloadAction<string | null>) => {
      state.selectedCrop = action.payload;
    },

    // Reset state
    resetMarketState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch supply and demand
    builder
      .addCase(fetchSupplyDemand.pending, (state) => {
        state.supplyDemandStatus = "loading";
        state.supplyDemandError = null;
      })
      .addCase(fetchSupplyDemand.fulfilled, (state, action) => {
        state.supplyDemandStatus = "succeeded";
        state.supplyDemand = action.payload;
      })
      .addCase(fetchSupplyDemand.rejected, (state, action) => {
        state.supplyDemandStatus = "failed";
        state.supplyDemandError = action.payload as string;
      });

    // Fetch transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsStatus = "loading";
        state.transactionsError = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactionsStatus = "succeeded";
        state.transactions = action.payload.data;
        state.transactionsPagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionsStatus = "failed";
        state.transactionsError = action.payload as string;
      });

    // Fetch market stats
    builder
      .addCase(fetchMarketStats.pending, (state) => {
        state.statsStatus = "loading";
        state.statsError = null;
      })
      .addCase(fetchMarketStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchMarketStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload as string;
      });

    // Fetch price trends
    builder
      .addCase(fetchPriceTrends.pending, (state) => {
        state.priceTrendsStatus = "loading";
        state.priceTrendsError = null;
      })
      .addCase(fetchPriceTrends.fulfilled, (state, action) => {
        state.priceTrendsStatus = "succeeded";
        state.priceTrends = action.payload;
      })
      .addCase(fetchPriceTrends.rejected, (state, action) => {
        state.priceTrendsStatus = "failed";
        state.priceTrendsError = action.payload as string;
      });
  },
});

// ==================== EXPORTS ====================

export const { setSelectedPeriod, setSelectedCrop, resetMarketState } =
  governmentMarketSlice.actions;

export default governmentMarketSlice.reducer;

// ==================== SELECTORS ====================

export const selectSupplyDemand = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.supplyDemand;

export const selectSupplyDemandStatus = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.supplyDemandStatus;

export const selectTransactions = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.transactions;

export const selectTransactionsStatus = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.transactionsStatus;

export const selectTransactionsPagination = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.transactionsPagination;

export const selectMarketStats = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.stats;

export const selectMarketStatsStatus = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.statsStatus;

export const selectPriceTrends = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.priceTrends;

export const selectPriceTrendsStatus = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.priceTrendsStatus;

export const selectSelectedPeriod = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.selectedPeriod;

export const selectSelectedCrop = (state: {
  governmentMarket: GovernmentMarketState;
}) => state.governmentMarket.selectedCrop;
