import { ColDef } from "@ag-grid-community/core";
import { ExtendedColDef } from "../interface/agProps";
import dayjs from "dayjs";
import {
  DatepickerCellEditor,
  TimeCellEditor,
} from "../components/CustomTableInput/EditorDateTable";
import AntdSelectCellEditor from "../components/CustomTableInput/AntdSelectCellEditor";

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

    // Handle Time type columns - chỉ chọn giờ phút
    if (colDef.typeColumn === "Time") {
      return {
        ...colDef,
        cellEditor: TimeCellEditor, // Custom time editor
        cellEditorParams: {
          ...(colDef.cellEditorParams || {}),
        },
        valueFormatter: (params) => {
          // Hiển thị format HH:mm
          return params.value || "";
        },
      };
    }

    return colDef;
  });
};
