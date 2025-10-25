import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";
import { Vendor, VendorProduct, VendorQueryParams } from "@/types";

// ==================== STATE INTERFACE ====================

export interface GovernmentVendorsState {
  // Vendors list
  vendors: Vendor[];
  vendorsStatus: "idle" | "loading" | "succeeded" | "failed";
  vendorsError: string | null;

  // Current vendor details
  currentVendor: Vendor | null;
  currentVendorProducts: VendorProduct[];
  vendorDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  vendorDetailError: string | null;

  // All products across all vendors
  allProducts: VendorProduct[];
  allProductsStatus: "idle" | "loading" | "succeeded" | "failed";
  allProductsError: string | null;

  // Update status
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;

  // Filters
  filters: VendorQueryParams;

  // Stats
  stats: {
    total: number;
    compliant: number;
    warning: number;
    alert: number;
    totalAcreage: number;
    utilizedAcreage: number;
  } | null;
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentVendorsState = {
  vendors: [],
  vendorsStatus: "idle",
  vendorsError: null,

  currentVendor: null,
  currentVendorProducts: [],
  vendorDetailStatus: "idle",
  vendorDetailError: null,

  allProducts: [],
  allProductsStatus: "idle",
  allProductsError: null,

  updateStatus: "idle",
  updateError: null,

  filters: {
    page: 1,
    limit: 20,
  },

  stats: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all vendors/farmers
 */
export const fetchVendors = createAsyncThunk(
  "governmentVendors/fetchVendors",
  async (params: VendorQueryParams | undefined, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getFarmers(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendors"
      );
    }
  }
);

/**
 * Fetch products for a specific vendor
 */
export const fetchVendorProducts = createAsyncThunk(
  "governmentVendors/fetchVendorProducts",
  async (vendorId: string, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getFarmerProducts(vendorId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor products"
      );
    }
  }
);

/**
 * Fetch all products across all vendors
 */
export const fetchAllProducts = createAsyncThunk(
  "governmentVendors/fetchAllProducts",
  async (
    params: {
      page?: number;
      limit?: number;
      status?: string;
      vendor_id?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await governmentApi.getAllProducts(params);
      return response.data || response; // Handle both response formats
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

/**
 * Update a vendor's product
 */
export const updateVendorProduct = createAsyncThunk(
  "governmentVendors/updateVendorProduct",
  async (
    payload: {
      vendorId: string;
      productId: string;
      data: Partial<VendorProduct>;
    },
    { rejectWithValue }
  ) => {
    try {
      const { vendorId, productId, data } = payload;
      const updatedProduct = await governmentApi.updateFarmerProduct(
        vendorId,
        productId,
        data
      );
      return updatedProduct;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentVendorsSlice = createSlice({
  name: "governmentVendors",
  initialState,
  reducers: {
    // Set current vendor
    setCurrentVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.currentVendor = action.payload;
    },

    // Clear current vendor
    clearCurrentVendor: (state) => {
      state.currentVendor = null;
      state.currentVendorProducts = [];
      state.vendorDetailStatus = "idle";
      state.vendorDetailError = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<VendorQueryParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
      };
    },

    // Calculate stats from vendors
    calculateStats: (state) => {
      const vendors = state.vendors;
      state.stats = {
        total: vendors.length,
        compliant: vendors.filter((v) => v.compliance_status === "compliant")
          .length,
        warning: vendors.filter((v) => v.compliance_status === "warning")
          .length,
        alert: vendors.filter((v) => v.compliance_status === "alert").length,
        totalAcreage: vendors.reduce((sum, v) => sum + v.total_acreage, 0),
        utilizedAcreage: vendors.reduce(
          (sum, v) => sum + v.utilized_acreage,
          0
        ),
      };
    },

    // Reset state
    resetVendorsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch vendors
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.vendorsStatus = "loading";
        state.vendorsError = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.vendorsStatus = "succeeded";
        state.vendors = action.payload;
        // Auto-calculate stats
        governmentVendorsSlice.caseReducers.calculateStats(state);
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.vendorsStatus = "failed";
        state.vendorsError = action.payload as string;
      });

    // Fetch vendor products
    builder
      .addCase(fetchVendorProducts.pending, (state) => {
        state.vendorDetailStatus = "loading";
        state.vendorDetailError = null;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.vendorDetailStatus = "succeeded";
        state.currentVendorProducts = action.payload;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.vendorDetailStatus = "failed";
        state.vendorDetailError = action.payload as string;
      });

    // Update vendor product
    builder
      .addCase(updateVendorProduct.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateVendorProduct.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        // Update the product in the current vendor products list
        const index = state.currentVendorProducts.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.currentVendorProducts[index] = action.payload;
        }
      })
      .addCase(updateVendorProduct.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload as string;
      });

    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.allProductsStatus = "loading";
        state.allProductsError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProductsStatus = "succeeded";
        state.allProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.allProductsStatus = "failed";
        state.allProductsError = action.payload as string;
      });
  },
});

// ==================== EXPORTS ====================

export const {
  setCurrentVendor,
  clearCurrentVendor,
  setFilters,
  clearFilters,
  calculateStats,
  resetVendorsState,
} = governmentVendorsSlice.actions;

export default governmentVendorsSlice.reducer;

// ==================== SELECTORS ====================

export const selectVendors = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.vendors;

export const selectVendorsStatus = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.vendorsStatus;

export const selectVendorsError = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.vendorsError;

export const selectCurrentVendor = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.currentVendor;

export const selectCurrentVendorProducts = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.currentVendorProducts;

export const selectVendorStats = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.stats;

export const selectVendorFilters = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.filters;

export const selectAllProducts = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.allProducts;

export const selectAllProductsStatus = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.allProductsStatus;

export const selectAllProductsError = (state: {
  governmentVendors: GovernmentVendorsState;
}) => state.governmentVendors.allProductsError;
