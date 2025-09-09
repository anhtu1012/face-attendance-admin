import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

// Define column preferences structure
export interface ColumnPreference {
  key: string;
  visible: boolean;
  order: number;
  width?: number;
}

export interface TableColumnPreferences {
  [routePath: string]: {
    columns: ColumnPreference[];
    lastUpdated: string;
  };
}

interface ColumnPreferencesState {
  tables: TableColumnPreferences;
}

// Function to load preferences from localStorage
const loadPreferencesFromStorage = (): TableColumnPreferences => {
  if (typeof window === "undefined") return {};

  try {
    const storedPrefs = localStorage.getItem("columnPreferences");
    return storedPrefs ? JSON.parse(storedPrefs) : {};
  } catch (error) {
    console.error("Error loading column preferences:", error);
    return {};
  }
};

// Function to save preferences to localStorage
const savePreferencesToStorage = (tables: TableColumnPreferences) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("columnPreferences", JSON.stringify(tables));
  } catch (error) {
    console.error("Error saving column preferences:", error);
  }
};

const initialState: ColumnPreferencesState = {
  tables: loadPreferencesFromStorage(),
};

const columnPreferencesSlice = createSlice({
  name: "columnPreferences",
  initialState,
  reducers: {
    // Initialize column preferences for a specific path
    initTableColumns: (
      state,
      action: PayloadAction<{
        routePath: string;
        columns: ColumnPreference[];
      }>
    ) => {
      const { routePath, columns } = action.payload;
      if (!state.tables[routePath]) {
        // Create new objects to avoid mutation
        const newTables = {
          ...state.tables,
          [routePath]: {
            columns: columns.map((col) => ({ ...col })), // Deep copy columns
            lastUpdated: new Date().toISOString(),
          },
        };

        state.tables = newTables;
        // Save to localStorage
        savePreferencesToStorage(newTables);
      }
    },

    // Update column order and visibility
    updateColumnPreferences: (
      state,
      action: PayloadAction<{
        routePath: string;
        columns: ColumnPreference[];
      }>
    ) => {
      const { routePath, columns } = action.payload;

      // Create new objects to avoid mutation
      const newTables = {
        ...state.tables,
        [routePath]: {
          columns: columns.map((col) => ({ ...col })), // Deep copy columns
          lastUpdated: new Date().toISOString(),
        },
      };

      state.tables = newTables;
      // Save to localStorage
      savePreferencesToStorage(newTables);
    },

    // Toggle column visibility
    toggleColumnVisibility: (
      state,
      action: PayloadAction<{
        routePath: string;
        columnKey: string;
        visible: boolean;
      }>
    ) => {
      const { routePath, columnKey, visible } = action.payload;

      if (state.tables[routePath]) {
        const columns = state.tables[routePath].columns;

        // Create new arrays and objects to avoid mutation
        const updatedColumns = columns.map((col) =>
          col.key === columnKey ? { ...col, visible } : { ...col }
        );

        // Create new state immutably
        const newTables = {
          ...state.tables,
          [routePath]: {
            columns: updatedColumns,
            lastUpdated: new Date().toISOString(),
          },
        };

        state.tables = newTables;
        // Save to localStorage
        savePreferencesToStorage(newTables);
      }
    },

    // Move column to a new position
    moveColumn: (
      state,
      action: PayloadAction<{
        routePath: string;
        columnKey: string;
        newOrder: number;
      }>
    ) => {
      const { routePath, columnKey, newOrder } = action.payload;

      if (state.tables[routePath]) {
        const columns = state.tables[routePath].columns;
        const column = columns.find((col) => col.key === columnKey);

        if (column) {
          const oldOrder = column.order;

          // Create a completely new array with new objects
          const updatedColumns = columns.map((col) => {
            const newCol = { ...col }; // Create a new object

            if (col.key === columnKey) {
              newCol.order = newOrder;
            } else if (
              oldOrder < newOrder &&
              col.order > oldOrder &&
              col.order <= newOrder
            ) {
              newCol.order = col.order - 1;
            } else if (
              oldOrder > newOrder &&
              col.order >= newOrder &&
              col.order < oldOrder
            ) {
              newCol.order = col.order + 1;
            }

            return newCol;
          });

          // Create new state immutably
          const newTables = {
            ...state.tables,
            [routePath]: {
              columns: updatedColumns,
              lastUpdated: new Date().toISOString(),
            },
          };

          state.tables = newTables;
          // Save to localStorage
          savePreferencesToStorage(newTables);
        }
      }
    },

    // Reset column preferences for a table to default
    resetTableColumns: (
      state,
      action: PayloadAction<{
        routePath: string;
        defaultColumns: ColumnPreference[];
      }>
    ) => {
      const { routePath, defaultColumns } = action.payload;

      // Create new objects immutably
      const newTables = {
        ...state.tables,
        [routePath]: {
          columns: defaultColumns.map((col) => ({ ...col })), // Deep copy columns
          lastUpdated: new Date().toISOString(),
        },
      };

      state.tables = newTables;
      // Save to localStorage
      savePreferencesToStorage(newTables);
    },

    // Clear all column preferences
    clearAllColumnPreferences: (state) => {
      state.tables = {};
      // Save to localStorage
      savePreferencesToStorage({});
    },
  },
});

export const {
  initTableColumns,
  updateColumnPreferences,
  toggleColumnVisibility,
  moveColumn,
  resetTableColumns,
  clearAllColumnPreferences,
} = columnPreferencesSlice.actions;

// Selectors
export const selectColumnPreferences = (state: RootState, routePath: string) =>
  (state.columnPreferences as ColumnPreferencesState)?.tables[routePath]
    ?.columns;

export const selectTableColumnPreferences = (state: RootState) =>
  state.columnPreferences.tables;

export default columnPreferencesSlice.reducer;
