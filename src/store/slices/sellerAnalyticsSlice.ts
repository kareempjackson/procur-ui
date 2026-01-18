import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import type { RootState } from "../index";

export enum AnalyticsPeriod {
  TODAY = "today",
  LAST_7_DAYS = "last_7_days",
  LAST_30_DAYS = "last_30_days",
  LAST_90_DAYS = "last_90_days",
  THIS_WEEK = "this_week",
  THIS_MONTH = "this_month",
  LAST_MONTH = "last_month",
  THIS_YEAR = "this_year",
  CUSTOM = "custom",
}

export type DashboardMetrics = {
  total_revenue: number;
  total_orders: number;
  total_products_sold: number;
  average_order_value: number;
  pending_orders: number;
  active_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  revenue_growth: number;
  orders_growth: number;
  top_selling_product: {
    id: string;
    name: string;
    quantity_sold: number;
    revenue: number;
  } | null;
  currency: string;
  period_start: string;
  period_end: string;
};

export type SalesAnalytics = {
  period_start: string;
  period_end: string;
  total_revenue: number;
  sales_data: {
    date: string;
    revenue: number;
    orders_count: number;
    products_sold: number;
  }[];
  sales_by_category: {
    category: string;
    revenue: number;
    orders_count: number;
    percentage: number;
  }[];
  top_products: {
    product_id: string;
    product_name: string;
    quantity_sold: number;
    revenue: number;
    percentage: number;
  }[];
  order_status_distribution: {
    pending: number;
    accepted: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    disputed: number;
  };
  avg_processing_time: number;
  customer_data: {
    new_customers: number;
    returning_customers: number;
    customer_retention_rate: number;
  };
  currency: string;
};

export type ProductAnalytics = {
  period_start: string;
  period_end: string;
  product_performance: Array<{
    product_id: string;
    product_name: string;
    views: number;
    orders: number;
    revenue: number;
    conversion_rate: number;
    stock_level: number;
    status: string;
  }>;
  category_performance: Array<{
    category: string;
    products_count: number;
    total_revenue: number;
    avg_price: number;
    total_orders: number;
  }>;
  inventory_alerts: {
    low_stock: Array<{
      product_id: string;
      product_name: string;
      current_stock: number;
      min_stock_level: number;
    }>;
    out_of_stock: Array<{
      product_id: string;
      product_name: string;
      last_stock_date: string;
    }>;
  };
  price_analysis: {
    avg_product_price: number;
    price_ranges: Array<{
      range: string;
      products_count: number;
      percentage: number;
    }>;
  };
  product_lifecycle: {
    new_products: number;
    active_products: number;
    discontinued_products: number;
    draft_products: number;
  };
};

type AnalyticsState = {
  dashboardMetrics: DashboardMetrics | null;
  salesAnalytics: SalesAnalytics | null;
  productAnalytics: ProductAnalytics | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  salesStatus: "idle" | "loading" | "succeeded" | "failed";
  productsStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPeriod: AnalyticsPeriod;
};

const initialState: AnalyticsState = {
  dashboardMetrics: null,
  salesAnalytics: null,
  productAnalytics: null,
  status: "idle",
  salesStatus: "idle",
  productsStatus: "idle",
  error: null,
  currentPeriod: AnalyticsPeriod.LAST_30_DAYS,
};

export const fetchDashboardMetrics = createAsyncThunk(
  "sellerAnalytics/fetchDashboardMetrics",
  async (
    params: {
      period?: AnalyticsPeriod;
      start_date?: string;
      end_date?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const queryParams = new URLSearchParams();

      if (params.period) {
        queryParams.append("period", params.period);
      }
      if (params.start_date) {
        queryParams.append("start_date", params.start_date);
      }
      if (params.end_date) {
        queryParams.append("end_date", params.end_date);
      }

      const response = await apiClient.get(
        `/sellers/analytics/dashboard?${queryParams.toString()}`
      );
      return response.data as DashboardMetrics;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard metrics"
      );
    }
  }
);

export const fetchSalesAnalytics = createAsyncThunk(
  "sellerAnalytics/fetchSalesAnalytics",
  async (
    params: {
      period?: AnalyticsPeriod;
      start_date?: string;
      end_date?: string;
      group_by?: "day" | "week" | "month";
    },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const queryParams = new URLSearchParams();

      if (params.period) {
        queryParams.append("period", params.period);
      }
      if (params.start_date) {
        queryParams.append("start_date", params.start_date);
      }
      if (params.end_date) {
        queryParams.append("end_date", params.end_date);
      }
      if (params.group_by) {
        queryParams.append("group_by", params.group_by);
      }

      const response = await apiClient.get(
        `/sellers/analytics/sales?${queryParams.toString()}`
      );
      return response.data as SalesAnalytics;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales analytics"
      );
    }
  }
);

export const fetchProductAnalytics = createAsyncThunk(
  "sellerAnalytics/fetchProductAnalytics",
  async (
    params: {
      period?: AnalyticsPeriod;
      start_date?: string;
      end_date?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const apiClient = getApiClient();
      const queryParams = new URLSearchParams();

      if (params.period) {
        queryParams.append("period", params.period);
      }
      if (params.start_date) {
        queryParams.append("start_date", params.start_date);
      }
      if (params.end_date) {
        queryParams.append("end_date", params.end_date);
      }

      const response = await apiClient.get(
        `/sellers/analytics/products?${queryParams.toString()}`
      );
      return response.data as ProductAnalytics;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product analytics"
      );
    }
  }
);

const sellerAnalyticsSlice = createSlice({
  name: "sellerAnalytics",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.currentPeriod = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Metrics
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardMetrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Sales Analytics
      .addCase(fetchSalesAnalytics.pending, (state) => {
        state.salesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchSalesAnalytics.fulfilled, (state, action) => {
        state.salesStatus = "succeeded";
        state.salesAnalytics = action.payload;
      })
      .addCase(fetchSalesAnalytics.rejected, (state, action) => {
        state.salesStatus = "failed";
        state.error = action.payload as string;
      })
      // Product Analytics
      .addCase(fetchProductAnalytics.pending, (state) => {
        state.productsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProductAnalytics.fulfilled, (state, action) => {
        state.productsStatus = "succeeded";
        state.productAnalytics = action.payload;
      })
      .addCase(fetchProductAnalytics.rejected, (state, action) => {
        state.productsStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setPeriod, clearError } = sellerAnalyticsSlice.actions;

export const selectDashboardMetrics = (state: RootState) =>
  state.sellerAnalytics.dashboardMetrics;
export const selectSalesAnalytics = (state: RootState) =>
  state.sellerAnalytics.salesAnalytics;
export const selectProductAnalytics = (state: RootState) =>
  state.sellerAnalytics.productAnalytics;
export const selectAnalyticsStatus = (state: RootState) =>
  state.sellerAnalytics.status;
export const selectAnalyticsError = (state: RootState) =>
  state.sellerAnalytics.error;
export const selectCurrentPeriod = (state: RootState) =>
  state.sellerAnalytics.currentPeriod;

export default sellerAnalyticsSlice.reducer;
