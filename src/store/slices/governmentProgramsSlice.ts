import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";
import { Program, ProgramQueryParams } from "@/types";

// ==================== STATE INTERFACE ====================

export interface GovernmentProgramsState {
  // Programs list
  programs: Program[];
  programsStatus: "idle" | "loading" | "succeeded" | "failed";
  programsError: string | null;

  // Current program details
  currentProgram: Program | null;
  programDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  programDetailError: string | null;

  // Create/Update status
  mutationStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationError: string | null;

  // Filters
  filters: ProgramQueryParams;

  // Stats
  stats: {
    total: number;
    active: number;
    planning: number;
    completed: number;
    totalBudget: number;
    totalSpent: number;
    totalEnrollments: number;
  } | null;
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentProgramsState = {
  programs: [],
  programsStatus: "idle",
  programsError: null,

  currentProgram: null,
  programDetailStatus: "idle",
  programDetailError: null,

  mutationStatus: "idle",
  mutationError: null,

  filters: {
    page: 1,
    limit: 20,
  },

  stats: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all programs
 */
export const fetchPrograms = createAsyncThunk(
  "governmentPrograms/fetchPrograms",
  async (params?: ProgramQueryParams, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getPrograms(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch programs"
      );
    }
  }
);

/**
 * Fetch a specific program
 */
export const fetchProgram = createAsyncThunk(
  "governmentPrograms/fetchProgram",
  async (programId: string, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getProgram(programId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch program"
      );
    }
  }
);

/**
 * Create a new program
 */
export const createProgram = createAsyncThunk(
  "governmentPrograms/createProgram",
  async (programData: Partial<Program>, { rejectWithValue }) => {
    try {
      const data = await governmentApi.createProgram(programData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create program"
      );
    }
  }
);

/**
 * Update an existing program
 */
export const updateProgram = createAsyncThunk(
  "governmentPrograms/updateProgram",
  async (
    payload: { programId: string; data: Partial<Program> },
    { rejectWithValue }
  ) => {
    try {
      const { programId, data } = payload;
      const updatedProgram = await governmentApi.updateProgram(programId, data);
      return updatedProgram;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update program"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentProgramsSlice = createSlice({
  name: "governmentPrograms",
  initialState,
  reducers: {
    // Set current program
    setCurrentProgram: (state, action: PayloadAction<Program | null>) => {
      state.currentProgram = action.payload;
    },

    // Clear current program
    clearCurrentProgram: (state) => {
      state.currentProgram = null;
      state.programDetailStatus = "idle";
      state.programDetailError = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<ProgramQueryParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
      };
    },

    // Calculate stats from programs
    calculateStats: (state) => {
      const programs = state.programs;
      state.stats = {
        total: programs.length,
        active: programs.filter((p) => p.status === "active").length,
        planning: programs.filter((p) => p.status === "planning").length,
        completed: programs.filter((p) => p.status === "completed").length,
        totalBudget: programs.reduce((sum, p) => sum + p.budget, 0),
        totalSpent: programs.reduce((sum, p) => sum + p.budget_used, 0),
        totalEnrollments: programs.reduce((sum, p) => sum + p.participants, 0),
      };
    },

    // Reset mutation status
    resetMutationStatus: (state) => {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },

    // Reset state
    resetProgramsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch programs
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.programsStatus = "loading";
        state.programsError = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.programsStatus = "succeeded";
        state.programs = action.payload;
        // Auto-calculate stats
        governmentProgramsSlice.caseReducers.calculateStats(state);
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.programsStatus = "failed";
        state.programsError = action.payload as string;
      });

    // Fetch program detail
    builder
      .addCase(fetchProgram.pending, (state) => {
        state.programDetailStatus = "loading";
        state.programDetailError = null;
      })
      .addCase(fetchProgram.fulfilled, (state, action) => {
        state.programDetailStatus = "succeeded";
        state.currentProgram = action.payload;
      })
      .addCase(fetchProgram.rejected, (state, action) => {
        state.programDetailStatus = "failed";
        state.programDetailError = action.payload as string;
      });

    // Create program
    builder
      .addCase(createProgram.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.programs.unshift(action.payload); // Add to beginning of list
        governmentProgramsSlice.caseReducers.calculateStats(state);
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Update program
    builder
      .addCase(updateProgram.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        // Update in list
        const index = state.programs.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.programs[index] = action.payload;
        }
        // Update current program if it's the same
        if (state.currentProgram?.id === action.payload.id) {
          state.currentProgram = action.payload;
        }
        governmentProgramsSlice.caseReducers.calculateStats(state);
      })
      .addCase(updateProgram.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });
  },
});

// ==================== EXPORTS ====================

export const {
  setCurrentProgram,
  clearCurrentProgram,
  setFilters,
  clearFilters,
  calculateStats,
  resetMutationStatus,
  resetProgramsState,
} = governmentProgramsSlice.actions;

export default governmentProgramsSlice.reducer;

// ==================== SELECTORS ====================

export const selectPrograms = (state: {
  governmentPrograms: GovernmentProgramsState;
}) => state.governmentPrograms.programs;

export const selectProgramsStatus = (state: {
  governmentPrograms: GovernmentProgramsState;
}) => state.governmentPrograms.programsStatus;

export const selectCurrentProgram = (state: {
  governmentPrograms: GovernmentProgramsState;
}) => state.governmentPrograms.currentProgram;

export const selectProgramDetailStatus = (state: {
  governmentPrograms: GovernmentProgramsState;
}) => state.governmentPrograms.programDetailStatus;

export const selectProgramStats = (state: {
  governmentPrograms: GovernmentProgramsState;
}) => state.governmentPrograms.stats;

export const selectMutationStatus = (state: {
  governmentPrograms: GovernmentProgramsState;
}) => state.governmentPrograms.mutationStatus;
