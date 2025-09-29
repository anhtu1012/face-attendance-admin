import { ColDef } from "@ag-grid-community/core";
import { ExtendedColDef } from "../interface/agProps";
import dayjs from "dayjs";
import {
  DatepickerCellEditor,
  TimeCellEditor,
} from "../components/CustomTableInput/EditorDateTable";
import AntdSelectCellEditor from "../components/CustomTableInput/AntdSelectCellEditor";
import TagCellRenderer from "../components/CustomTableInput/TagCellRenderer";

// Update the processColumnDefs function to handle Number type
export const processColumnDefs = (columnDefs: ExtendedColDef[]): ColDef[] => {
  return columnDefs.map((colDef) => {
    if (
      colDef.context?.typeColumn === "Select" &&
      colDef.context?.selectOptions
    ) {
      return {
        ...colDef,
        cellEditor: AntdSelectCellEditor,
        cellEditorParams: {
          values: colDef.context.selectOptions,
          // Pass API integration props
          onSearchAPI: colDef.context.onSearchAPI,
          apiDebounceTime: colDef.context.apiDebounceTime || 500,
          minSearchLength: colDef.context.minSearchLength || 1,
          loadingInitialOptions: colDef.context.loadingInitialOptions || false,
        },
        valueFormatter: (params) => {
          const found = colDef.context?.selectOptions?.find(
            (item) => item.value === params.value
          );
          return found ? found.label : params.value;
        },
      };
    }

    // Handle Number type columns
    if (colDef.context?.typeColumn === "Number") {
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
    if (colDef.context?.typeColumn === "Date") {
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
    if (colDef.context?.typeColumn === "Time") {
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
    if (colDef.context?.typeColumn === "Tag") {
      const options =
        colDef.context?.selectOptions ||
        Object.keys(colDef.cellRendererParams?.colorMap || {}).map((key) => ({
          value: key,
          label: key,
        }));
      return {
        ...colDef,
        cellRenderer: TagCellRenderer,
        cellRendererParams: {
          ...colDef.cellRendererParams,
          selectOptions: options,
        },
        valueFormatter: (params) => {
          const found = options.find((item) => item.value === params.value);
          return found ? found.label : params.value;
        },
        ...(colDef.editable
          ? {
              cellEditor: AntdSelectCellEditor,
              cellEditorParams: {
                values: options,
              },
            }
          : {}),
      };
    }

    return colDef;
  });
};
