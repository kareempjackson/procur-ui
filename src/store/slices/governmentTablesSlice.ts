import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { governmentApi } from "@/lib/api/governmentApi";
import { CustomTable, TableData, TableQueryParams, DataSource } from "@/types";

// ==================== STATE INTERFACE ====================

export interface GovernmentTablesState {
  // Tables list
  tables: CustomTable[];
  tablesStatus: "idle" | "loading" | "succeeded" | "failed";
  tablesError: string | null;

  // Current table details
  currentTable: CustomTable | null;
  currentTableData: TableData | null;
  tableDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  tableDetailError: string | null;

  // Data sources
  dataSources: DataSource[];
  dataSourcesStatus: "idle" | "loading" | "succeeded" | "failed";
  dataSourcesError: string | null;

  // Mutation status (create/update/delete)
  mutationStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationError: string | null;

  // Filters
  filters: TableQueryParams;
}

// ==================== INITIAL STATE ====================

const initialState: GovernmentTablesState = {
  tables: [],
  tablesStatus: "idle",
  tablesError: null,

  currentTable: null,
  currentTableData: null,
  tableDetailStatus: "idle",
  tableDetailError: null,

  dataSources: [],
  dataSourcesStatus: "idle",
  dataSourcesError: null,

  mutationStatus: "idle",
  mutationError: null,

  filters: {
    page: 1,
    limit: 20,
  },
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all custom tables
 */
export const fetchTables = createAsyncThunk(
  "governmentTables/fetchTables",
  async (params?: TableQueryParams, { rejectWithValue }) => {
    try {
      const response = await governmentApi.getTables(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tables"
      );
    }
  }
);

/**
 * Fetch a specific table
 */
export const fetchTable = createAsyncThunk(
  "governmentTables/fetchTable",
  async (tableId: string, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getTable(tableId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch table"
      );
    }
  }
);

/**
 * Fetch table data
 */
export const fetchTableData = createAsyncThunk(
  "governmentTables/fetchTableData",
  async (
    payload: { tableId: string; params?: TableQueryParams },
    { rejectWithValue }
  ) => {
    try {
      const { tableId, params } = payload;
      const data = await governmentApi.getTableData(tableId, params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch table data"
      );
    }
  }
);

/**
 * Fetch all data sources
 */
export const fetchDataSources = createAsyncThunk(
  "governmentTables/fetchDataSources",
  async (_, { rejectWithValue }) => {
    try {
      const data = await governmentApi.getDataSources();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch data sources"
      );
    }
  }
);

/**
 * Create a new table
 */
export const createTable = createAsyncThunk(
  "governmentTables/createTable",
  async (tableData: Partial<CustomTable>, { rejectWithValue }) => {
    try {
      const data = await governmentApi.createTable(tableData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create table"
      );
    }
  }
);

/**
 * Update an existing table
 */
export const updateTable = createAsyncThunk(
  "governmentTables/updateTable",
  async (
    payload: { tableId: string; data: Partial<CustomTable> },
    { rejectWithValue }
  ) => {
    try {
      const { tableId, data } = payload;
      const updatedTable = await governmentApi.updateTable(tableId, data);
      return updatedTable;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update table"
      );
    }
  }
);

/**
 * Delete a table
 */
export const deleteTable = createAsyncThunk(
  "governmentTables/deleteTable",
  async (tableId: string, { rejectWithValue }) => {
    try {
      await governmentApi.deleteTable(tableId);
      return tableId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete table"
      );
    }
  }
);

/**
 * Update a record in a table
 */
export const updateTableRecord = createAsyncThunk(
  "governmentTables/updateTableRecord",
  async (
    payload: {
      tableId: string;
      recordId: string;
      data: Record<string, any>;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { tableId, recordId, data } = payload;
      const updatedRecord = await governmentApi.updateTableRecord(
        tableId,
        recordId,
        data
      );

      // Refresh table data after update
      dispatch(fetchTableData({ tableId }));

      return updatedRecord;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update record"
      );
    }
  }
);

// ==================== SLICE ====================

const governmentTablesSlice = createSlice({
  name: "governmentTables",
  initialState,
  reducers: {
    // Set current table
    setCurrentTable: (state, action: PayloadAction<CustomTable | null>) => {
      state.currentTable = action.payload;
    },

    // Clear current table
    clearCurrentTable: (state) => {
      state.currentTable = null;
      state.currentTableData = null;
      state.tableDetailStatus = "idle";
      state.tableDetailError = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<TableQueryParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
      };
    },

    // Reset mutation status
    resetMutationStatus: (state) => {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },

    // Reset state
    resetTablesState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch tables
    builder
      .addCase(fetchTables.pending, (state) => {
        state.tablesStatus = "loading";
        state.tablesError = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.tablesStatus = "succeeded";
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.tablesStatus = "failed";
        state.tablesError = action.payload as string;
      });

    // Fetch table detail
    builder
      .addCase(fetchTable.pending, (state) => {
        state.tableDetailStatus = "loading";
        state.tableDetailError = null;
      })
      .addCase(fetchTable.fulfilled, (state, action) => {
        state.tableDetailStatus = "succeeded";
        state.currentTable = action.payload;
      })
      .addCase(fetchTable.rejected, (state, action) => {
        state.tableDetailStatus = "failed";
        state.tableDetailError = action.payload as string;
      });

    // Fetch table data
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.tableDetailStatus = "loading";
        state.tableDetailError = null;
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.tableDetailStatus = "succeeded";
        state.currentTableData = action.payload;
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.tableDetailStatus = "failed";
        state.tableDetailError = action.payload as string;
      });

    // Fetch data sources
    builder
      .addCase(fetchDataSources.pending, (state) => {
        state.dataSourcesStatus = "loading";
        state.dataSourcesError = null;
      })
      .addCase(fetchDataSources.fulfilled, (state, action) => {
        state.dataSourcesStatus = "succeeded";
        state.dataSources = action.payload;
      })
      .addCase(fetchDataSources.rejected, (state, action) => {
        state.dataSourcesStatus = "failed";
        state.dataSourcesError = action.payload as string;
      });

    // Create table
    builder
      .addCase(createTable.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.tables.unshift(action.payload);
      })
      .addCase(createTable.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Update table
    builder
      .addCase(updateTable.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const index = state.tables.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        if (state.currentTable?.id === action.payload.id) {
          state.currentTable = action.payload;
        }
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Delete table
    builder
      .addCase(deleteTable.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.tables = state.tables.filter((t) => t.id !== action.payload);
        if (state.currentTable?.id === action.payload) {
          state.currentTable = null;
          state.currentTableData = null;
        }
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });

    // Update table record
    builder
      .addCase(updateTableRecord.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateTableRecord.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(updateTableRecord.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload as string;
      });
  },
});

// ==================== EXPORTS ====================

export const {
  setCurrentTable,
  clearCurrentTable,
  setFilters,
  clearFilters,
  resetMutationStatus,
  resetTablesState,
} = governmentTablesSlice.actions;

export default governmentTablesSlice.reducer;

// ==================== SELECTORS ====================

export const selectTables = (state: {
  governmentTables: GovernmentTablesState;
}) => state.governmentTables.tables;

export const selectTablesStatus = (state: {
  governmentTables: GovernmentTablesState;
}) => state.governmentTables.tablesStatus;

export const selectCurrentTable = (state: {
  governmentTables: GovernmentTablesState;
}) => state.governmentTables.currentTable;

export const selectCurrentTableData = (state: {
  governmentTables: GovernmentTablesState;
}) => state.governmentTables.currentTableData;

export const selectDataSources = (state: {
  governmentTables: GovernmentTablesState;
}) => state.governmentTables.dataSources;

export const selectDataSourcesStatus = (state: {
  governmentTables: GovernmentTablesState;
}) => state.governmentTables.dataSourcesStatus;
