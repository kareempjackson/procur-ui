import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import axios from "axios";

// Helper to get authenticated client
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

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const msg = (error.response?.data as any)?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  if (typeof error === "object" && error !== null) {
    const maybeMsg = (error as { message?: unknown }).message;
    if (typeof maybeMsg === "string") return maybeMsg;
  }
  return fallback;
}

export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_sku?: string;
  unit_price: number;
  sale_price?: number;
  quantity: number;
  total_price: number;
  currency: string;
  image_url?: string;
  stock_quantity: number;
  unit_of_measurement: string;
  seller_org_id: string;
  seller_name: string;
  added_at: string;
}

export interface SellerGroup {
  seller_org_id: string;
  seller_name: string;
  items: CartItem[];
  subtotal: number;
  estimated_shipping: number;
  total: number;
}

export interface Cart {
  id: string;
  seller_groups: SellerGroup[];
  total_items: number;
  unique_products: number;
  subtotal: number;
  platform_fee_percent: number;
  platform_fee_amount: number;
  estimated_shipping: number;
  estimated_tax: number;
  total: number;
  currency: string;
  updated_at: string;
}

interface BuyerCartState {
  cart: Cart | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastUpdated: string | null;
}

const initialState: BuyerCartState = {
  cart: null,
  status: "idle",
  error: null,
  lastUpdated: null,
};

// ==================== ASYNC THUNKS ====================

export const fetchCart = createAsyncThunk(
  "buyerCart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/buyers/cart");
      return data as Cart;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to fetch cart"));
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "buyerCart/add",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const client = getClient();
      await client.post("/buyers/cart/items", {
        product_id: productId,
        quantity,
      });
      // Refetch cart to get updated data
      dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to add to cart"));
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  "buyerCart/updateItem",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      await client.patch(`/buyers/cart/items/${itemId}`, { quantity });
      return { itemId, quantity };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to update item"));
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  "buyerCart/removeItem",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const client = getClient();
      await client.delete(`/buyers/cart/items/${itemId}`);
      return itemId;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to remove item"));
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "buyerCart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const client = getClient();
      await client.delete("/buyers/cart");
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to clear cart"));
    }
  }
);

const buyerCartSlice = createSlice({
  name: "buyerCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Add to Cart
      .addCase(addToCartAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state) => {
        state.status = "succeeded";
        // Cart will be refetched automatically
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update Cart Item
      .addCase(updateCartItemAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        if (!state.cart) return;

        state.cart.seller_groups.forEach((group) => {
          const item = group.items.find((i) => i.id === action.payload.itemId);
          if (item) {
            item.quantity = action.payload.quantity;
            item.total_price =
              (item.sale_price || item.unit_price) * action.payload.quantity;

            // Recalculate group totals
            group.subtotal = group.items.reduce(
              (sum, i) => sum + i.total_price,
              0
            );
            group.total = group.subtotal + group.estimated_shipping;
          }
        });

        // Recalculate cart totals
        state.cart.total_items = state.cart.seller_groups.reduce(
          (sum, group) =>
            sum + group.items.reduce((s, item) => s + item.quantity, 0),
          0
        );
        state.cart.subtotal = state.cart.seller_groups.reduce(
          (sum, group) => sum + group.subtotal,
          0
        );
        state.cart.estimated_shipping = state.cart.seller_groups.reduce(
          (sum, group) => sum + group.estimated_shipping,
          0
        );
        state.cart.estimated_tax = 0;
        state.cart.platform_fee_amount = Number(
          (
            (state.cart.subtotal * (state.cart.platform_fee_percent || 0)) /
            100
          ).toFixed(2)
        );
        state.cart.total =
          state.cart.subtotal +
          state.cart.estimated_shipping +
          (state.cart.platform_fee_amount || 0);
        state.lastUpdated = new Date().toISOString();
        state.status = "succeeded";
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Remove Cart Item
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        if (!state.cart) return;

        state.cart.seller_groups = state.cart.seller_groups
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.id !== action.payload),
          }))
          .filter((group) => group.items.length > 0);

        // Recalculate totals
        if (state.cart.seller_groups.length > 0) {
          state.cart.seller_groups.forEach((group) => {
            group.subtotal = group.items.reduce(
              (sum, i) => sum + i.total_price,
              0
            );
            group.total = group.subtotal + group.estimated_shipping;
          });

          state.cart.total_items = state.cart.seller_groups.reduce(
            (sum, group) =>
              sum + group.items.reduce((s, item) => s + item.quantity, 0),
            0
          );
          state.cart.unique_products = state.cart.seller_groups.reduce(
            (sum, group) => sum + group.items.length,
            0
          );
          state.cart.subtotal = state.cart.seller_groups.reduce(
            (sum, group) => sum + group.subtotal,
            0
          );
          state.cart.estimated_shipping = state.cart.seller_groups.reduce(
            (sum, group) => sum + group.estimated_shipping,
            0
          );
          state.cart.estimated_tax = 0;
          state.cart.platform_fee_amount = Number(
            (
              (state.cart.subtotal * (state.cart.platform_fee_percent || 0)) /
              100
            ).toFixed(2)
          );
          state.cart.total =
            state.cart.subtotal +
            state.cart.estimated_shipping +
            (state.cart.platform_fee_amount || 0);
        } else {
          // Empty cart
          state.cart.total_items = 0;
          state.cart.unique_products = 0;
          state.cart.subtotal = 0;
          state.cart.estimated_shipping = 0;
          state.cart.estimated_tax = 0;
          state.cart.platform_fee_amount = 0;
          state.cart.total = 0;
        }

        state.lastUpdated = new Date().toISOString();
      })

      // Clear Cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.cart = null;
        state.lastUpdated = new Date().toISOString();
      });
  },
});

// No synchronous actions exported, all are async thunks
export default buyerCartSlice.reducer;
