import { useState, useCallback, useRef, useEffect } from "react";
import { ColDef } from "@ag-grid-community/core";

interface GridApi {
  applyTransaction: (params: unknown) => void;
  ensureIndexVisible: (index: number, position: string) => void;
  refreshCells: (params: unknown) => void;
  getVerticalPixelRange?: () => { top: number } | undefined;
}

interface UseTableFilterProps {
  rowData: unknown[];
  columnDefs: ColDef[];
  gridRef?: React.RefObject<{ api: GridApi }>;
}

export const useTableFilter = ({
  rowData,
  columnDefs,
  gridRef,
}: UseTableFilterProps) => {
  // Filter modal states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilterColumns, setSelectedFilterColumns] = useState<string[]>(
    columnDefs.map((col) => col.field || "").filter(Boolean)
  );
  const [filterValues, setFilterValues] = useState<string>("");
  const [originalRowData, setOriginalRowData] = useState<unknown[]>([]);
  const [filteredData, setFilteredData] = useState<unknown[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // Search state
  const [searchText, setSearchText] = useState<string>("");

  // Quick search reference
  const firstQuicksearchRef = useRef(0);

  // Update total rows and store original row data when rowData prop changes
  useEffect(() => {
    // Only update original data if we're not in filtered state or if this is first load
    if (!isFiltered || originalRowData.length === 0) {
      setOriginalRowData([...rowData]);
    }
  }, [rowData, isFiltered, originalRowData.length]);

  // Function to apply filters from the modal (improved)
  const applyFilters = useCallback(
    (selectedColumns: string[], values: string[]) => {
      // If no columns selected or no values provided, reset to original data
      if (selectedColumns.length === 0 || values.length === 0) {
        setFilteredData([]);
        setIsFiltered(false);
        // If grid reference exists, update the grid data
        if (gridRef?.current?.api) {
          gridRef.current.api.applyTransaction({ update: originalRowData });
        }
        return;
      }

      // Filter the data based on selected columns and values
      const newFilteredData = originalRowData.filter((row) => {
        // For each row, check if any of the selected columns contain any of the filter values
        return selectedColumns.some((column) => {
          const rowAsRecord = row as Record<string, unknown>;
          if (rowAsRecord[column] === undefined || rowAsRecord[column] === null)
            return false;

          // Get the cell value - this could be a direct value or something that needs label lookup
          const cellValue = String(rowAsRecord[column]).toLowerCase();
          let cellLabel = cellValue;

          // Check if this is a field with value/label pairs in column definitions
          const colDef = columnDefs.find((col) => col.field === column);
          if (
            colDef &&
            colDef.cellEditorParams &&
            typeof colDef.cellEditorParams === "object"
          ) {
            const params = colDef.cellEditorParams as { values?: unknown[] };
            if (params.values && Array.isArray(params.values)) {
              // Find matching option to get the label
              const option = params.values.find((opt: unknown) => {
                if (typeof opt === "object" && opt !== null && "value" in opt) {
                  return (
                    (opt as { value: unknown }).value === rowAsRecord[column]
                  );
                }
                return opt === rowAsRecord[column];
              });
              if (option) {
                // If the option has a label property, use it for searching
                if (
                  typeof option === "object" &&
                  option !== null &&
                  "label" in option
                ) {
                  cellLabel = String(
                    (option as { label: unknown }).label
                  ).toLowerCase();
                }
              }
            }
          }

          // Check if any filter value is included in the cell value or cell label
          return values.some((value) => {
            const trimmedValue = value.trim().toLowerCase();
            return (
              trimmedValue !== "" &&
              (cellValue.includes(trimmedValue) ||
                cellLabel.includes(trimmedValue))
            );
          });
        });
      });

      // Update the filtered data state
      setFilteredData(newFilteredData);
      setIsFiltered(true);

      // If grid reference exists, update the grid data
      if (gridRef?.current?.api) {
        // Preserve scroll position before applying transaction
        const viewport = gridRef.current.api.getVerticalPixelRange?.();
        const scrollTop = viewport ? viewport.top : 0;

        gridRef.current.api.applyTransaction({ update: newFilteredData });

        // Restore scroll position after transaction
        setTimeout(() => {
          if (gridRef?.current?.api) {
            gridRef.current.api.ensureIndexVisible(
              Math.floor(scrollTop / 40),
              "top"
            );
            gridRef.current.api.refreshCells({
              columns: [""],
              force: true,
            });
          }
        }, 100);
      }
    },
    [originalRowData, columnDefs, gridRef]
  );

  // Function to handle opening the filter modal
  const handleOpenFilterModal = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  // Function to handle closing the filter modal
  const handleCloseFilterModal = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  // Function to handle filter application from the modal
  const handleApplyFilter = useCallback(
    (selectedColumns: string[], filterText: string) => {
      setSelectedFilterColumns(selectedColumns);
      setFilterValues(filterText);

      // Convert multi-line text to array of values, filtering out empty lines
      const values = filterText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      // Apply the filters
      applyFilters(selectedColumns, values);

      // Close the modal
      handleCloseFilterModal();
    },
    [applyFilters, handleCloseFilterModal]
  );

  // Function to reset filters
  const handleResetFilters = useCallback(() => {
    setSelectedFilterColumns([]);
    setFilterValues("");
    setFilteredData([]);
    setIsFiltered(false);

    if (gridRef?.current?.api) {
      // Preserve scroll position before resetting
      const viewport = gridRef.current.api.getVerticalPixelRange?.();
      const scrollTop = viewport ? viewport.top : 0;

      setTimeout(() => {
        if (gridRef?.current?.api) {
          gridRef.current.api.ensureIndexVisible(
            Math.floor(scrollTop / 40),
            "top"
          );
          gridRef.current.api.refreshCells({
            columns: [""],
            force: true,
          });
        }
      }, 100);
    }

    if (gridRef?.current?.api) {
      gridRef.current.api.applyTransaction({ update: originalRowData });
    }
  }, [gridRef, originalRowData]);

  // Update selected filter columns when columnDefs change
  useEffect(() => {
    if (!isFiltered) {
      setSelectedFilterColumns(
        columnDefs.map((col) => col.field || "").filter(Boolean)
      );
    }
  }, [columnDefs, isFiltered]);

  return {
    // Filter states
    showFilterModal,
    selectedFilterColumns,
    filterValues,
    originalRowData,
    filteredData,
    isFiltered,

    // Search states
    searchText,
    setSearchText,
    firstQuicksearchRef,

    // Filter functions
    applyFilters,
    handleOpenFilterModal,
    handleCloseFilterModal,
    handleApplyFilter,
    handleResetFilters,

    // Setters (if needed for external control)
    setShowFilterModal,
    setSelectedFilterColumns,
    setFilterValues,
    setFilteredData,
    setIsFiltered,
    setOriginalRowData,
  };
};
