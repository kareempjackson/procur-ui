import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import sellerOrdersReducer from "./slices/sellerOrdersSlice";
import sellerTransactionsReducer from "./slices/sellerTransactionsSlice";
import sellerHomeReducer from "./slices/sellerHomeSlice";
import harvestReducer from "./slices/harvestSlice";
import sellerProductsReducer from "./slices/sellerProductsSlice";
import harvestFeedReducer from "./slices/harvestFeedSlice";
import sellerReducer from "./slices/sellerSlice";
import notificationsReducer from "./slices/notificationsSlice";
import buyerMarketplaceReducer from "./slices/buyerMarketplaceSlice";
import buyerCartReducer from "./slices/buyerCartSlice";
import buyerOrdersReducer from "./slices/buyerOrdersSlice";
import buyerRequestsReducer from "./slices/buyerRequestsSlice";
import buyerTransactionsReducer from "./slices/buyerTransactionsSlice";
import profileReducer from "./slices/profileSlice";
import sellerProductRequestsReducer from "./slices/sellerProductRequestsSlice";
import sellerAnalyticsReducer from "./slices/sellerAnalyticsSlice";
import sellerInsightsReducer from "./slices/sellerInsightsSlice";
import sellerPayoutsReducer from "./slices/sellerPayoutsSlice";
import buyerCreditsReducer from "./slices/buyerCreditsSlice";

// Government slices
import governmentVendorsReducer from "./slices/governmentVendorsSlice";
import governmentProgramsReducer from "./slices/governmentProgramsSlice";
import governmentReportsReducer from "./slices/governmentReportsSlice";
import governmentTablesReducer from "./slices/governmentTablesSlice";
import governmentChartsReducer from "./slices/governmentChartsSlice";
import governmentPermissionsReducer from "./slices/governmentPermissionsSlice";
import governmentMarketReducer from "./slices/governmentMarketSlice";
import governmentComplianceReducer from "./slices/governmentComplianceSlice";
import governmentProductionReducer from "./slices/governmentProductionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sellerOrders: sellerOrdersReducer,
    sellerTransactions: sellerTransactionsReducer,
    sellerHome: sellerHomeReducer,
    harvest: harvestReducer,
    sellerProducts: sellerProductsReducer,
    harvestFeed: harvestFeedReducer,
    seller: sellerReducer,
    notifications: notificationsReducer,
    buyerMarketplace: buyerMarketplaceReducer,
    buyerCart: buyerCartReducer,
    buyerOrders: buyerOrdersReducer,
    buyerRequests: buyerRequestsReducer,
    buyerTransactions: buyerTransactionsReducer,
    profile: profileReducer,
    sellerProductRequests: sellerProductRequestsReducer,
    sellerAnalytics: sellerAnalyticsReducer,
    sellerInsights: sellerInsightsReducer,
    sellerPayouts: sellerPayoutsReducer,
    buyerCredits: buyerCreditsReducer,
    // Government reducers
    governmentVendors: governmentVendorsReducer,
    governmentPrograms: governmentProgramsReducer,
    governmentReports: governmentReportsReducer,
    governmentTables: governmentTablesReducer,
    governmentCharts: governmentChartsReducer,
    governmentPermissions: governmentPermissionsReducer,
    governmentMarket: governmentMarketReducer,
    governmentCompliance: governmentComplianceReducer,
    governmentProduction: governmentProductionReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
