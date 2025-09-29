/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { ColDef, CellStyle, CellClassParams } from "@ag-grid-community/core";
import { processColumnDefs } from "../utils/extendColumn";
import ErrorCellRenderer from "../components/ErrorCellRenderer";

interface UseColumnDefinitionsProps {
  columnDefs: ColDef[];
  showSTT: boolean;
  showToolColumn?: boolean;
  toolColumnRenderer?: (params: any) => React.ReactNode;
  toolColumnWidth?: number;
  toolColumnHeaderName?: string;
  currentPage: number;
  pageSize: number;
  onChangePage?: (page: number, pageSize: number) => void;
  isFiltered: boolean;
  selectedCells: Set<string>;
  fillTargetCells: Set<string>;
  columnFlex: number;
  enableFilter: boolean;
  theme?: string;
}

export const useColumnDefinitions = ({
  columnDefs,
  showSTT,
  showToolColumn = false,
  toolColumnRenderer,
  toolColumnWidth = 80,
  toolColumnHeaderName = "",
  currentPage,
  pageSize,
  onChangePage,
  isFiltered,
  selectedCells,
  fillTargetCells,
  columnFlex,
  enableFilter,
  theme,
}: UseColumnDefinitionsProps) => {
  // Default column definition
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: columnFlex,
      editable: true,
      resizable: true,
      sortable: true,
      filter: enableFilter,
      suppressPaste: false,
      cellStyle: (params: unknown): CellStyle => {
        const typedParams = params as {
          rowIndex: number;
          colDef: { field: string };
        };
        const cellId = `${typedParams.rowIndex}-${typedParams.colDef.field}`;
        // Nếu ô được chọn, trả về style đặc biệt
        if (selectedCells.has(cellId)) {
          return {
            backgroundColor: "#d3ebf5",
            border: "2px solid #0078d7",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center", // Ensures vertical centering
          };
        }
        // Nếu ô là target của fill operation
        if (fillTargetCells.has(cellId)) {
          return {
            backgroundColor: "rgba(0, 120, 215, 0.2)",
            border: "1px dashed #0078d7",
            fontWeight: "normal",
            display: "flex",
            alignItems: "center",
          };
        }
        // Style mặc định
        return {
          backgroundColor:
            theme === "dark" ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.8)",
          border: "1px solid #b9e7f8",
          fontWeight: "normal",
          display: "flex",
          alignItems: "center", // Ensures vertical centering
        };
      },
      cellClass: (params: unknown) => {
        const typedParams = params as {
          rowIndex: number;
          colDef: { field: string };
        };
        const cellId = `${typedParams.rowIndex}-${typedParams.colDef.field}`;
        if (selectedCells.has(cellId)) return "selected-cell";
        if (fillTargetCells.has(cellId)) return "fill-target";
        return "";
      },
    }),
    [selectedCells, fillTargetCells, columnFlex, enableFilter, theme]
  );

  // Extended column definitions with STT column and Tool column
  const extendedColumnDefs: ColDef[] = useMemo(() => {
    const processedColumnDefs = processColumnDefs(columnDefs);
    let result = processedColumnDefs;

    // Add Tool column if enabled
    if (showToolColumn && toolColumnRenderer) {
      const toolColumn: ColDef = {
        headerName: toolColumnHeaderName,
        field: "__tool",
        cellRenderer: toolColumnRenderer,
        width: toolColumnWidth,
        pinned: "right",
        lockPosition: true,
        editable: false,
        filter: false,
        suppressHeaderMenuButton: true,
        resizable: false,
        cellStyle: {
          backgroundColor: "#e6f7ff",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      };
      result = [toolColumn, ...result];
    }

    // Add STT column if enabled
    if (showSTT) {
      const sttColumn: ColDef = {
        headerName: "",
        field: "__stt",
        cellRenderer: (params: unknown) => {
          const typedParams = params as {
            data?: { isError?: boolean };
            api?: {
              forEachNodeAfterFilterAndSort: (
                callback: (node: unknown, index: number) => void
              ) => void;
            };
            node?: unknown;
          };

          if (typedParams.data?.isError) {
            return ErrorCellRenderer(
              params as Parameters<typeof ErrorCellRenderer>[0]
            );
          }

          // Tính STT dựa trên trang hiện tại và pageSize
          if (typedParams.api && typedParams.node) {
            let sttValue = 1;

            typedParams.api.forEachNodeAfterFilterAndSort(
              (node: unknown, index: number) => {
                if (node === typedParams.node) {
                  // Nếu có server-side pagination (có onChangePage), tính STT từ trang hiện tại
                  if (onChangePage && !isFiltered) {
                    sttValue = (currentPage - 1) * pageSize + index + 1;
                  } else {
                    // Client-side pagination hoặc filtered data
                    sttValue = index + 1;
                  }
                  return; // break
                }
              }
            );

            return sttValue;
          }

          return "";
        },
        width: 70,
        pinned: "left",
        lockPosition: true,
        editable: false,
        filter: false,
        suppressHeaderMenuButton: true,
        resizable: false,
        cellStyle: (params: CellClassParams<unknown>): CellStyle => {
          const data = params.data as { isSaved?: boolean; isError?: boolean };
          if (data?.isSaved) {
            return {
              backgroundColor: "#8bd8f4",
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            };
          } else if (data?.isError) {
            return {
              backgroundColor: "#efb008",
              textAlign: "center",
              cursor: "pointer",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            };
          }
          return {
            backgroundColor: "#e6f7ff",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          };
        },
        tooltipValueGetter: (params) => {
          const data = (params as { data?: { errorMessages?: string } }).data;
          if (data?.errorMessages) {
            const formattedMessage = data.errorMessages
              .split("\n")
              .map((line: string) => {
                if (line.trim().startsWith("-")) {
                  return line.trim().replace(/^-/, "• ");
                }
                return line.trim();
              })
              .join("\n");
            return formattedMessage;
          }
          return "";
        },
        tooltipComponent: "CustomTooltip",
        getQuickFilterText: () => "",
      };

      result = [sttColumn, ...result];
    }

    return result;
  }, [
    columnDefs,
    showSTT,
    showToolColumn,
    toolColumnRenderer,
    toolColumnWidth,
    toolColumnHeaderName,
    currentPage,
    pageSize,
    onChangePage,
    isFiltered,
  ]);

  return {
    defaultColDef,
    extendedColumnDefs,
  };
};
