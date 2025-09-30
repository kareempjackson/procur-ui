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
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
