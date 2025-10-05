import { getApiClient } from "../apiClient";

// Types
export interface MarketplaceProductQuery {
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

export interface MarketplaceSellerQuery {
  page?: number;
  limit?: number;
  search?: string;
  business_type?: string;
  location?: string;
  is_verified?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface HarvestUpdatesQuery {
  page?: number;
  limit?: number;
  crop?: string;
  seller_org_id?: string;
  category?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface AddToCartDto {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CreateHarvestCommentDto {
  content: string;
}

export interface ToggleHarvestLikeDto {
  is_like: boolean;
}

// Get token function
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

// API Client Functions
export const buyerApi = {
  // ==================== MARKETPLACE ====================
  getProducts: async (params?: MarketplaceProductQuery) => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/marketplace/products", { params });
    return response.data;
  },

  getProductDetail: async (productId: string) => {
    const api = getApiClient(getToken);
    const response = await api.get(`/buyers/marketplace/products/${productId}`);
    return response.data;
  },

  getSellers: async (params?: MarketplaceSellerQuery) => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/marketplace/sellers", { params });
    return response.data;
  },

  getSellerDetail: async (sellerId: string) => {
    const api = getApiClient(getToken);
    const response = await api.get(`/buyers/marketplace/sellers/${sellerId}`);
    return response.data;
  },

  getSellerProducts: async (sellerId: string, params?: MarketplaceProductQuery) => {
    const api = getApiClient(getToken);
    const response = await api.get(`/buyers/marketplace/sellers/${sellerId}/products`, {
      params,
    });
    return response.data;
  },

  getMarketplaceStats: async () => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/marketplace/stats");
    return response.data;
  },

  // ==================== HARVEST UPDATES ====================
  getHarvestUpdates: async (params?: HarvestUpdatesQuery) => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/harvest-updates", { params });
    return response.data;
  },

  getHarvestUpdateDetail: async (harvestId: string) => {
    const api = getApiClient(getToken);
    const response = await api.get(`/buyers/harvest-updates/${harvestId}`);
    return response.data;
  },

  toggleHarvestLike: async (harvestId: string, isLike: boolean) => {
    const api = getApiClient(getToken);
    await api.post(`/buyers/harvest-updates/${harvestId}/like`, {
      is_like: isLike,
    } as ToggleHarvestLikeDto);
  },

  getHarvestComments: async (harvestId: string) => {
    const api = getApiClient(getToken);
    const response = await api.get(`/buyers/harvest-updates/${harvestId}/comments`);
    return response.data;
  },

  createHarvestComment: async (harvestId: string, content: string) => {
    const api = getApiClient(getToken);
    const response = await api.post(
      `/buyers/harvest-updates/${harvestId}/comments`,
      { content } as CreateHarvestCommentDto
    );
    return response.data;
  },

  // ==================== CART ====================
  getCart: async () => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/cart");
    return response.data;
  },

  addToCart: async (data: AddToCartDto) => {
    const api = getApiClient(getToken);
    await api.post("/buyers/cart/items", data);
  },

  updateCartItem: async (itemId: string, data: UpdateCartItemDto) => {
    const api = getApiClient(getToken);
    await api.patch(`/buyers/cart/items/${itemId}`, data);
  },

  removeFromCart: async (itemId: string) => {
    const api = getApiClient(getToken);
    await api.delete(`/buyers/cart/items/${itemId}`);
  },

  clearCart: async () => {
    const api = getApiClient(getToken);
    await api.delete("/buyers/cart");
  },

  getCartSummary: async () => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/cart/summary");
    return response.data;
  },

  // ==================== FAVORITES ====================
  getFavoriteProducts: async () => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/favorites/products");
    return response.data;
  },

  addProductToFavorites: async (productId: string) => {
    const api = getApiClient(getToken);
    await api.post(`/buyers/favorites/products/${productId}`);
  },

  removeProductFromFavorites: async (productId: string) => {
    const api = getApiClient(getToken);
    await api.delete(`/buyers/favorites/products/${productId}`);
  },

  getFavoriteSellers: async () => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/favorites/sellers");
    return response.data;
  },

  addSellerToFavorites: async (sellerId: string) => {
    const api = getApiClient(getToken);
    await api.post(`/buyers/favorites/sellers/${sellerId}`);
  },

  removeSellerFromFavorites: async (sellerId: string) => {
    const api = getApiClient(getToken);
    await api.delete(`/buyers/favorites/sellers/${sellerId}`);
  },

  // ==================== PROFILE ====================
  getBuyerProfile: async () => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/profile");
    return response.data;
  },

  getAddresses: async () => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/addresses");
    return response.data;
  },

  createAddress: async (data: any) => {
    const api = getApiClient(getToken);
    const response = await api.post("/buyers/addresses", data);
    return response.data;
  },

  // ==================== ORDERS ====================
  getOrders: async (params?: any) => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/orders", { params });
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const api = getApiClient(getToken);
    const response = await api.get(`/buyers/orders/${orderId}`);
    return response.data;
  },

  // ==================== TRANSACTIONS ====================
  getTransactions: async (params?: any) => {
    const api = getApiClient(getToken);
    const response = await api.get("/buyers/transactions", { params });
    return response.data;
  },
};

