import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";

export type ProductImage = {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
};

export type SellerProduct = {
  id: string;
  seller_org_id: string;
  name: string;
  description?: string;
  short_description?: string;
  sku?: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  base_price: number;
  sale_price?: number;
  currency: string;
  stock_quantity: number;
  // Simplified: remove min/max stock levels
  unit_of_measurement: string;
  weight?: number;
  condition: string;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  status: string;
  is_featured: boolean;
  is_organic: boolean;
  is_local?: boolean;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
};

export type ProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  is_featured?: boolean;
  is_organic?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
};

export type ProductsState = {
  items: SellerProduct[];
  total: number;
  page: number;
  limit: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastQuery: ProductsQuery | null;
  deletingIds: Record<string, boolean>;
  updatingIds: Record<string, boolean>;
};

const initialState: ProductsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  status: "idle",
  error: null,
  lastQuery: null,
  deletingIds: {},
  updatingIds: {},
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

export const fetchSellerProducts = createAsyncThunk(
  "sellerProducts/fetch",
  async (query: ProductsQuery, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/products", {
        params: query,
      });
      return {
        items: (data.products as SellerProduct[]) ?? [],
        total: (data.total as number) ?? 0,
        page: (data.page as number) ?? query.page ?? 1,
        limit: (data.limit as number) ?? query.limit ?? 20,
        query,
      };
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch products"
      );
    }
  }
);

export type CreateSellerProductInput = {
  name: string;
  description?: string;
  short_description?: string;
  category: string;
  subcategory?: string;
  base_price: number;
  sale_price?: number;
  currency?: string;
  stock_quantity?: number;
  unit_of_measurement: string;
  weight?: number;
  condition?: string;
  status?: string;
  is_featured?: boolean;
  is_organic?: boolean;
  tags?: string[];
  images?: Array<{
    image_url: string;
    alt_text?: string;
    display_order?: number;
    is_primary?: boolean;
  }>;
};

export const createSellerProduct = createAsyncThunk(
  "sellerProducts/create",
  async (payload: CreateSellerProductInput, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post(`/sellers/products`, payload);
      return data as SellerProduct;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to create product"
      );
    }
  }
);

export const updateSellerProduct = createAsyncThunk(
  "sellerProducts/update",
  async (
    { id, update }: { id: string; update: Partial<SellerProduct> },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.patch(`/sellers/products/${id}`, update);
      return data as SellerProduct;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to update product"
      );
    }
  }
);

export const deleteSellerProduct = createAsyncThunk(
  "sellerProducts/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const client = getClient();
      await client.delete(`/sellers/products/${id}`);
      return id;
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to delete product"
      );
    }
  }
);

const sellerProductsSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSellerProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: SellerProduct[];
            total: number;
            page: number;
            limit: number;
            query: ProductsQuery;
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
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch products";
        state.items = [];
        state.total = 0;
      })
      .addCase(createSellerProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createSellerProduct.fulfilled,
        (state, action: PayloadAction<SellerProduct>) => {
          state.status = "succeeded";
          // Prepend new product to list if current filter likely matches
          state.items = [action.payload, ...state.items];
          state.total = state.total + 1;
        }
      )
      .addCase(createSellerProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to create product";
      })
      .addCase(updateSellerProduct.pending, (state, action) => {
        const id = (action.meta.arg as { id: string }).id;
        state.updatingIds[id] = true;
      })
      .addCase(
        updateSellerProduct.fulfilled,
        (state, action: PayloadAction<SellerProduct>) => {
          const updated = action.payload;
          state.updatingIds[updated.id] = false;
          const idx = state.items.findIndex((p) => p.id === updated.id);
          if (idx >= 0) state.items[idx] = updated;
        }
      )
      .addCase(updateSellerProduct.rejected, (state, action) => {
        const id = (action.meta.arg as { id: string }).id;
        state.updatingIds[id] = false;
        state.error = (action.payload as string) || "Failed to update product";
      })
      .addCase(deleteSellerProduct.pending, (state, action) => {
        const id = action.meta.arg as string;
        state.deletingIds[id] = true;
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        const id = action.payload as string;
        delete state.deletingIds[id];
        state.items = state.items.filter((p) => p.id !== id);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        const id = action.meta.arg as string;
        delete state.deletingIds[id];
        state.error = (action.payload as string) || "Failed to delete product";
      });
  },
});

export default sellerProductsSlice.reducer;
