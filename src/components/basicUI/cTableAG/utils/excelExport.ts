import { ColDef } from "@ag-grid-community/core";
import { excelUtils } from "@/utils/client/importExport/excelUtils";

interface ExportExcelOptions {
  gridRef?: React.RefObject<{ api: unknown }>;
  columnDefs: ColDef[];
  rowData: unknown[];
  filteredData: unknown[];
  isFiltered: boolean;
  exportFileName: string;
  exportDecorated: boolean;
}

// Function to handle Excel export
export const handleExcelExport = ({
  gridRef,
  columnDefs,
  rowData,
  filteredData,
  isFiltered,
  exportFileName,
  exportDecorated,
}: ExportExcelOptions) => {
  if (!gridRef?.current) {
    return;
  }

  // Get the current visible data from the grid
  const dataToExport = isFiltered ? filteredData : rowData;

  // Create a properly formatted column structure that preserves display names and other important attributes
  const columnsForExport = columnDefs.map((col) => ({
    field: col.field,
    headerName: col.headerName || col.field || "",
    headerClass: col.headerClass, // Include headerClass for preserving required field indicators
    valueFormatter: col.valueFormatter, // Include valueFormatter for proper data display
  }));

  // Use the excelUtils to export the data
  excelUtils.exportToExcelSimple({
    columns: columnsForExport,
    data: dataToExport,
    fileName: `${exportFileName}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`,
    decorated: exportDecorated,
  });
};

// Create a hook for easier usage in components
export const useExcelExport = (
  options: Omit<ExportExcelOptions, "gridRef">
) => {
  const exportExcel = (gridRef?: React.RefObject<{ api: unknown }>) => {
    return handleExcelExport({
      ...options,
      gridRef,
    });
  };

  return { exportExcel };
};
