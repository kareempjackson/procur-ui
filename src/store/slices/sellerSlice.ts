import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export type OrderTab =
  | "All"
  | "New"
  | "Preparing"
  | "In transit"
  | "Delivered"
  | "Issues";
export type AnalyticsTab =
  | "Revenue & Orders"
  | "Category performance"
  | "Fulfillment health";

export type SellerUiState = {
  orderTab: OrderTab;
  analyticsTab: AnalyticsTab;
};

const initialState: SellerUiState = {
  orderTab: "All",
  analyticsTab: "Revenue & Orders",
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setOrderTab(state, action: PayloadAction<OrderTab>) {
      state.orderTab = action.payload;
    },
    setAnalyticsTab(state, action: PayloadAction<AnalyticsTab>) {
      state.analyticsTab = action.payload;
    },
    resetSellerUiState() {
      return initialState;
    },
  },
});

export const { setOrderTab, setAnalyticsTab, resetSellerUiState } =
  sellerSlice.actions;

export const selectOrderTab = (state: RootState) => state.seller.orderTab;
export const selectAnalyticsTab = (state: RootState) =>
  state.seller.analyticsTab;

export default sellerSlice.reducer;
