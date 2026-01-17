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
    const msg = (error.response?.data as { message?: string | string[] })
      ?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  if (typeof error === "object" && error !== null) {
    const maybeMsg = (error as { message?: unknown }).message;
    if (typeof maybeMsg === "string") return maybeMsg;
  }
  return fallback;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  category: string;
  subcategory?: string;
  current_price: number;
  base_price: number;
  sale_price?: number;
  currency: string;
  stock_quantity: number;
  unit_of_measurement: string;
  condition: string;
  brand?: string;
  image_url?: string;
  images?: string[];
  tags?: string[];
  is_organic: boolean;
  is_local: boolean;
  is_featured: boolean;
  average_rating?: number;
  review_count: number;
  seller: {
    id: string;
    name: string;
    location?: string;
    logo_url?: string;
    header_image_url?: string;
    average_rating?: number;
    review_count: number;
    product_count: number;
    is_verified: boolean;
  };
  is_favorited?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  description?: string;
  business_type?: string;
  logo_url?: string;
  header_image_url?: string;
  location?: string;
  average_rating?: number;
  review_count: number;
  total_reviews?: number;
  product_count: number;
  years_in_business?: number;
  is_verified: boolean;
  is_favorited?: boolean;
  specialties?: string[];
  created_at?: string;
}

export interface MarketplaceStats {
  total_products: number;
  total_sellers: number;
  total_categories: number;
  featured_products: number;
  new_products_this_week: number;
  popular_categories: {
    name: string;
    product_count: number;
  }[];
}

export interface HarvestUpdate {
  id: string;
  seller_org_id: string;
  farm_name: string;
  farm_avatar?: string;
  location?: string;
  crop: string;
  content?: string;
  expected_harvest_window?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  requests_count: number;
  is_verified: boolean;
  is_liked: boolean;
  created_at: string;
  time_ago?: string;
  next_planting_crop?: string;
  next_planting_date?: string;
  next_planting_area?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  seller_id?: string;
  min_price?: number;
  max_price?: number;
  is_organic?: boolean;
  is_local?: boolean;
  is_featured?: boolean;
  in_stock?: boolean;
  tags?: string[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

interface BuyerMarketplaceState {
  products: Product[];
  currentProduct: Product | null; // Single product detail
  sellers: Seller[];
  currentSeller: Seller | null; // Current seller being viewed
  sellerProducts: Product[]; // Products from current seller
  favoriteSellers: Seller[]; // Favorite sellers
  harvestUpdates: HarvestUpdate[];
  stats: MarketplaceStats | null;
  filters: ProductFilters;
  selectedCategory: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  productDetailStatus: "idle" | "loading" | "succeeded" | "failed"; // Status for single product
  sellerProductsStatus: "idle" | "loading" | "succeeded" | "failed"; // Status for seller products
  favoriteSellersStatus: "idle" | "loading" | "succeeded" | "failed"; // Status for favorite sellers
  error: string | null;
  productDetailError: string | null; // Error for single product
  sellerProductsError: string | null; // Error for seller products
  favoriteSellersError: string | null; // Error for favorite sellers
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: BuyerMarketplaceState = {
  products: [],
  currentProduct: null,
  sellers: [],
  currentSeller: null,
  sellerProducts: [],
  favoriteSellers: [],
  harvestUpdates: [],
  stats: null,
  filters: {
    sort_by: "created_at",
    sort_order: "desc",
  },
  selectedCategory: "All Categories",
  status: "idle",
  productDetailStatus: "idle",
  sellerProductsStatus: "idle",
  favoriteSellersStatus: "idle",
  error: null,
  productDetailError: null,
  sellerProductsError: null,
  favoriteSellersError: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
};

// ==================== ASYNC THUNKS ====================

export const fetchProducts = createAsyncThunk(
  "buyerMarketplace/fetchProducts",
  async (query: ProductFilters, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/buyers/marketplace/products", {
        params: query,
      });
      return {
        products: data.products as Product[],
        total: data.total as number,
        page: data.page as number,
        limit: data.limit as number,
      };
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch products")
      );
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  "buyerMarketplace/fetchProductDetail",
  async (productId: string, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get(
        `/buyers/marketplace/products/${productId}`
      );
      return data as Product;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch product details")
      );
    }
  }
);

/**
 * Fetch seller products (for supplier detail page)
 */
export const fetchSellerProducts = createAsyncThunk(
  "buyerMarketplace/fetchSellerProducts",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get(
        `/buyers/marketplace/sellers/${sellerId}/products`,
        {
          params: {
            page: 1,
            limit: 50,
          },
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch seller products")
      );
    }
  }
);

export const fetchSellers = createAsyncThunk(
  "buyerMarketplace/fetchSellers",
  async (
    query: { page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.get("/buyers/marketplace/sellers", {
        params: query,
      });
      return {
        sellers: data.sellers as Seller[],
        total: data.total as number,
      };
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch sellers")
      );
    }
  }
);

export const fetchHarvestUpdates = createAsyncThunk(
  "buyerMarketplace/fetchHarvestUpdates",
  async (
    query: { page?: number; limit?: number; seller_org_id?: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.get("/buyers/harvest-updates", {
        params: query,
      });
      return {
        updates: data.updates as HarvestUpdate[],
        total: data.total as number,
        page: data.page as number,
        limit: data.limit as number,
      };
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch harvest updates")
      );
    }
  }
);

export const fetchMarketplaceStats = createAsyncThunk(
  "buyerMarketplace/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/buyers/marketplace/stats");
      return data as MarketplaceStats;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to fetch stats"));
    }
  }
);

export const toggleProductFavoriteAsync = createAsyncThunk(
  "buyerMarketplace/toggleFavorite",
  async (
    { productId, isFavorited }: { productId: string; isFavorited: boolean },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      if (isFavorited) {
        await client.delete(`/buyers/favorites/products/${productId}`);
      } else {
        await client.post(`/buyers/favorites/products/${productId}`);
      }
      return { productId, newState: !isFavorited };
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to toggle favorite")
      );
    }
  }
);

/**
 * Fetch favorite sellers
 */
export const fetchFavoriteSellers = createAsyncThunk(
  "buyerMarketplace/fetchFavoriteSellers",
  async (_, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/buyers/favorites/sellers");
      return data;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch favorite sellers")
      );
    }
  }
);

/**
 * Toggle seller favorite
 */
export const toggleSellerFavoriteAsync = createAsyncThunk(
  "buyerMarketplace/toggleSellerFavorite",
  async (
    { sellerId, isFavorited }: { sellerId: string; isFavorited: boolean },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      if (isFavorited) {
        await client.delete(`/buyers/favorites/sellers/${sellerId}`);
      } else {
        await client.post(`/buyers/favorites/sellers/${sellerId}`);
      }
      return { sellerId, newState: !isFavorited };
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to toggle seller favorite")
      );
    }
  }
);

export const toggleHarvestLikeAsync = createAsyncThunk(
  "buyerMarketplace/toggleHarvestLike",
  async (
    { harvestId, isLiked }: { harvestId: string; isLiked: boolean },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      await client.post(`/buyers/harvest-updates/${harvestId}/like`, {
        is_like: !isLiked,
      });
      return { harvestId, newState: !isLiked };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to toggle like"));
    }
  }
);

export const addHarvestComment = createAsyncThunk(
  "buyerMarketplace/addComment",
  async (
    { harvestId, content }: { harvestId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      await client.post(`/buyers/harvest-updates/${harvestId}/comments`, {
        content,
      });
      return harvestId;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to add comment"));
    }
  }
);

const buyerMarketplaceSlice = createSlice({
  name: "buyerMarketplace",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        sort_by: "created_at",
        sort_order: "desc",
      };
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.filters.category =
        action.payload !== "All Categories" ? action.payload : undefined;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<typeof initialState.pagination>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // If we're requesting a subsequent page, append; otherwise replace.
        if (action.payload.page > 1) {
          const existingIds = new Set(state.products.map((p) => p.id));
          const next = action.payload.products.filter((p) => !existingIds.has(p.id));
          state.products = state.products.concat(next);
        } else {
          state.products = action.payload.products;
        }
        state.pagination.totalItems = action.payload.total;
        state.pagination.currentPage = action.payload.page;
        state.pagination.itemsPerPage = action.payload.limit;
        state.pagination.totalPages = Math.ceil(
          action.payload.total / action.payload.limit
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch Product Detail
      .addCase(fetchProductDetail.pending, (state) => {
        state.productDetailStatus = "loading";
        state.productDetailError = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.productDetailStatus = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.productDetailStatus = "failed";
        state.productDetailError = action.payload as string;
      })

      // Fetch Seller Products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.sellerProductsStatus = "loading";
        state.sellerProductsError = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.sellerProductsStatus = "succeeded";
        state.sellerProducts = action.payload.products;
        // Extract seller info from first product if available
        if (action.payload.products && action.payload.products.length > 0) {
          state.currentSeller = action.payload.products[0].seller;
        }
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.sellerProductsStatus = "failed";
        state.sellerProductsError = action.payload as string;
      })

      // Fetch Sellers
      .addCase(fetchSellers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sellers = action.payload.sellers;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch Harvest Updates
      .addCase(fetchHarvestUpdates.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHarvestUpdates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.harvestUpdates = action.payload.updates;
      })
      .addCase(fetchHarvestUpdates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch Stats
      .addCase(fetchMarketplaceStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Toggle Product Favorite
      .addCase(toggleProductFavoriteAsync.fulfilled, (state, action) => {
        const product = state.products.find(
          (p) => p.id === action.payload.productId
        );
        if (product) {
          product.is_favorited = action.payload.newState;
        }
      })

      // Fetch Favorite Sellers
      .addCase(fetchFavoriteSellers.pending, (state) => {
        state.favoriteSellersStatus = "loading";
        state.favoriteSellersError = null;
      })
      .addCase(fetchFavoriteSellers.fulfilled, (state, action) => {
        state.favoriteSellersStatus = "succeeded";
        state.favoriteSellers = action.payload.map((fav: any) => ({
          id: fav.seller_org_id,
          name: fav.seller_name,
          logo_url: fav.logo_url,
          location: fav.description || "",
          average_rating: fav.average_rating,
          total_reviews: 0,
          product_count: fav.product_count,
          is_verified: true,
          created_at: fav.created_at,
        }));
      })
      .addCase(fetchFavoriteSellers.rejected, (state, action) => {
        state.favoriteSellersStatus = "failed";
        state.favoriteSellersError = action.payload as string;
      })

      // Toggle Seller Favorite
      .addCase(toggleSellerFavoriteAsync.fulfilled, (state, action) => {
        const seller = state.sellers.find(
          (s) => s.id === action.payload.sellerId
        );
        if (seller) {
          seller.is_favorited = action.payload.newState;
        }
        // Update favorite sellers list
        if (action.payload.newState) {
          // Would need to fetch the full seller data, or optimistically add
        } else {
          state.favoriteSellers = state.favoriteSellers.filter(
            (s) => s.id !== action.payload.sellerId
          );
        }
      })

      // Toggle Harvest Like
      .addCase(toggleHarvestLikeAsync.fulfilled, (state, action) => {
        const update = state.harvestUpdates.find(
          (h) => h.id === action.payload.harvestId
        );
        if (update) {
          update.is_liked = action.payload.newState;
          update.likes_count += action.payload.newState ? 1 : -1;
        }
      })

      // Add Harvest Comment
      .addCase(addHarvestComment.fulfilled, (state, action) => {
        const update = state.harvestUpdates.find(
          (h) => h.id === action.payload
        );
        if (update) {
          update.comments_count += 1;
        }
      });
  },
});

export const { setFilters, clearFilters, setSelectedCategory, setPagination } =
  buyerMarketplaceSlice.actions;

export default buyerMarketplaceSlice.reducer;
