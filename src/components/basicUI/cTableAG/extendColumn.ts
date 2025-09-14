import { ColDef } from "@ag-grid-community/core";
import { ExtendedColDef } from "./agProps";
import dayjs from "dayjs";
import AntdSelectCellEditor from "@/utils/client/CustomTableInput/AntdSelectCellEditor";
import { DatepickerCellEditor } from "@/utils/client/CustomTableInput/EditorDateTable";

// Update the processColumnDefs function to handle Number type
export const processColumnDefs = (columnDefs: ExtendedColDef[]): ColDef[] => {
  return columnDefs.map((colDef) => {
    if (colDef.typeColumn === "Select" && colDef.selectOptions) {
      return {
        ...colDef,
        cellEditor: AntdSelectCellEditor,
        cellEditorParams: {
          values: colDef.selectOptions,
        },
        valueFormatter: (params) => {
          const found = colDef.selectOptions?.find(
            (item) => item.value === params.value
          );
          return found ? found.label : params.value;
        },
      };
    }

    // Handle Number type columns
    if (colDef.typeColumn === "Number") {
      return {
        ...colDef,
        cellStyle: {
          ...colDef.cellStyle,
          // textAlign: "right", // Căn phải cho số
          display: "flex",
          justifyContent: "flex-end",
        },
        valueFormatter: (params) => {
          // If there's already a valueFormatter, keep it, otherwise format as number
          if (typeof colDef.valueFormatter === "function") {
            return colDef.valueFormatter(params);
          }
          return params.value != null ? params.value.toLocaleString() : "";
        },
      };
    }
    if (colDef.typeColumn === "Date") {
      return {
        ...colDef,
        cellEditor: DatepickerCellEditor, // Custom date editor
        cellEditorParams: {
          format: "DD/MM/YYYY HH:mm:ss", // Default date format
          ...(colDef.cellEditorParams || {}),
        },
        valueFormatter: (params) => {
          const date = dayjs(params.value);
          return date.isValid() ? date.format("DD/MM/YYYY HH:mm:ss") : ""; // Default display format
        },
      };
    }

    return colDef;
  });
};
