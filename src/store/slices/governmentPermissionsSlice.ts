import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";
import {
  Role,
  RolePermission,
  AvailablePermission,
  PermissionChangeLog,
  AssignPermissionsRequest,
  RevokePermissionsRequest,
  CreateCustomRoleRequest,
  UpdateCustomRoleRequest,
} from "@/types";

// ==================== STATE INTERFACE ====================

export interface GovernmentPermissionsState {
  // Roles and permissions
  rolesPermissions: RolePermission[];
  rolesStatus: "idle" | "loading" | "succeeded" | "failed";
  rolesError: string | null;

  // Available permissions
  availablePermissions: AvailablePermission[];
  availablePermissionsStatus: "idle" | "loading" | "succeeded" | "failed";
  availablePermissionsError: string | null;

  // Permission change log
  changeLog: PermissionChangeLog[];
  changeLogStatus: "idle" | "loading" | "succeeded" | "failed";
  changeLogError: string | null;

  // Mutation status (create/update/delete/assign/revoke)
  mutationStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationError: string | null;

  // Current role being edited
  currentRole: Role | null;
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentPermissionsState = {
  rolesPermissions: [],
  rolesStatus: "idle",
  rolesError: null,

  availablePermissions: [],
  availablePermissionsStatus: "idle",
  availablePermissionsError: null,

  changeLog: [],
  changeLogStatus: "idle",
  changeLogError: null,

  mutationStatus: "idle",
  mutationError: null,

  currentRole: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all roles and their permissions
 */
export const fetchRolesAndPermissions = createAsyncThunk(
  "governmentPermissions/fetchRolesAndPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getRolesAndPermissions();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch roles and permissions"
      );
    }
  }
);

/**
 * Fetch all available permissions
 */
export const fetchAvailablePermissions = createAsyncThunk(
  "governmentPermissions/fetchAvailablePermissions",
  async (_, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getAvailablePermissions();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch available permissions"
      );
    }
  }
);

/**
 * Fetch permission change log
 */
export const fetchPermissionChangeLog = createAsyncThunk(
  "governmentPermissions/fetchPermissionChangeLog",
  async (_, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getPermissionChangeLog();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch permission change log"
      );
    }
  }
);

/**
 * Assign permissions to a role
 */
export const assignPermissions = createAsyncThunk(
  "governmentPermissions/assignPermissions",
  async (payload: AssignPermissionsRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await governmentApi.assignPermissions(payload);

      // Refresh roles and permissions
      dispatch(fetchRolesAndPermissions());
      dispatch(fetchPermissionChangeLog());

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign permissions"
      );
    }
  }
);

/**
 * Revoke permissions from a role
 */
export const revokePermissions = createAsyncThunk(
  "governmentPermissions/revokePermissions",
  async (payload: RevokePermissionsRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await governmentApi.revokePermissions(payload);

      // Refresh roles and permissions
      dispatch(fetchRolesAndPermissions());
      dispatch(fetchPermissionChangeLog());

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to revoke permissions"
      );
    }
  }
);

/**
 * Create a custom role
 */
export const createCustomRole = createAsyncThunk(
  "governmentPermissions/createCustomRole",
  async (payload: CreateCustomRoleRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await governmentApi.createCustomRole(payload);

      // Refresh roles and permissions
      dispatch(fetchRolesAndPermissions());

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create custom role"
      );
    }
  }
);

/**
 * Update a custom role
 */
export const updateCustomRole = createAsyncThunk(
  "governmentPermissions/updateCustomRole",
  async (
    payload: { roleId: string; data: UpdateCustomRoleRequest },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { roleId, data } = payload;
      const response = await governmentApi.updateCustomRole(roleId, data);

      // Refresh roles and permissions
      dispatch(fetchRolesAndPermissions());

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update custom role"
      );
    }
  }
);

/**
 * Delete a custom role
 */
export const deleteCustomRole = createAsyncThunk(
  "governmentPermissions/deleteCustomRole",
  async (roleId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await governmentApi.deleteCustomRole(roleId);

      // Refresh roles and permissions
      dispatch(fetchRolesAndPermissions());

      return roleId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete custom role"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentPermissionsSlice = createSlice({
  name: "governmentPermissions",
  initialState,
  reducers: {
    // Set current role
    setCurrentRole: (state, action: PayloadAction<Role | null>) => {
      state.currentRole = action.payload;
    },

    // Clear current role
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },

    // Reset mutation status
    resetMutationStatus: (state) => {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },

    // Reset state
    resetPermissionsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch roles and permissions
    builder
      .addCase(fetchRolesAndPermissions.pending, (state) => {
        state.rolesStatus = "loading";
        state.rolesError = null;
      })
      .addCase(fetchRolesAndPermissions.fulfilled, (state, action) => {
        state.rolesStatus = "succeeded";
        state.rolesPermissions = action.payload;
      })
      .addCase(fetchRolesAndPermissions.rejected, (state, action) => {
        state.rolesStatus = "failed";
        state.rolesError = action.payload as string;
      });

    // Fetch available permissions
    builder
      .addCase(fetchAvailablePermissions.pending, (state) => {
        state.availablePermissionsStatus = "loading";
        state.availablePermissionsError = null;
      })
      .addCase(fetchAvailablePermissions.fulfilled, (state, action) => {
        state.availablePermissionsStatus = "succeeded";
        state.availablePermissions = action.payload;
      })
      .addCase(fetchAvailablePermissions.rejected, (state, action) => {
        state.availablePermissionsStatus = "failed";
        state.availablePermissionsError = action.payload as string;
      });

    // Fetch permission change log
    builder
      .addCase(fetchPermissionChangeLog.pending, (state) => {
        state.changeLogStatus = "loading";
        state.changeLogError = null;
      })
      .addCase(fetchPermissionChangeLog.fulfilled, (state, action) => {
        state.changeLogStatus = "succeeded";
        state.changeLog = action.payload;
      })
      .addCase(fetchPermissionChangeLog.rejected, (state, action) => {
        state.changeLogStatus = "failed";
        state.changeLogError = action.payload as string;
      });

    // Assign permissions
    builder
      .addCase(assignPermissions.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(assignPermissions.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(assignPermissions.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Revoke permissions
    builder
      .addCase(revokePermissions.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(revokePermissions.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(revokePermissions.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Create custom role
    builder
      .addCase(createCustomRole.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createCustomRole.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(createCustomRole.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Update custom role
    builder
      .addCase(updateCustomRole.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateCustomRole.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(updateCustomRole.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Delete custom role
    builder
      .addCase(deleteCustomRole.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteCustomRole.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(deleteCustomRole.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });
  },
});

// ==================== EXPORTS ====================

export const {
  setCurrentRole,
  clearCurrentRole,
  resetMutationStatus,
  resetPermissionsState,
} = governmentPermissionsSlice.actions;

export default governmentPermissionsSlice.reducer;

// ==================== SELECTORS ====================

export const selectRolesPermissions = (state: {
  governmentPermissions: GovernmentPermissionsState;
}) => state.governmentPermissions.rolesPermissions;

export const selectRolesStatus = (state: {
  governmentPermissions: GovernmentPermissionsState;
}) => state.governmentPermissions.rolesStatus;

export const selectAvailablePermissions = (state: {
  governmentPermissions: GovernmentPermissionsState;
}) => state.governmentPermissions.availablePermissions;

export const selectPermissionChangeLog = (state: {
  governmentPermissions: GovernmentPermissionsState;
}) => state.governmentPermissions.changeLog;

export const selectCurrentRole = (state: {
  governmentPermissions: GovernmentPermissionsState;
}) => state.governmentPermissions.currentRole;

export const selectMutationStatus = (state: {
  governmentPermissions: GovernmentPermissionsState;
}) => state.governmentPermissions.mutationStatus;
