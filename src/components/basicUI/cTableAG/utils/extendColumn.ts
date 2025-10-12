import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { ExtendedColDef } from "../interface/agProps";
import dayjs from "dayjs";
import {
  DatepickerCellEditor,
  TimeCellEditor,
} from "../components/CustomTableInput/EditorDateTable";
import AntdSelectCellEditor from "../components/CustomTableInput/AntdSelectCellEditor";
import AntdTextCellEditor from "../components/CustomTableInput/AntdTextCellEditor";
import FileUploadCellRenderer from "../components/CustomTableInput/FileUploadCellRenderer";
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
          // allow multiple selection when context.multiple is true
          // context may include a 'multiple' flag; use unknown cast to satisfy lint
          multiple:
            (colDef.context as unknown as { multiple?: boolean })?.multiple ||
            false,
          // Pass API integration props
          onSearchAPI: colDef.context.onSearchAPI,
          apiDebounceTime: colDef.context.apiDebounceTime || 500,
          minSearchLength: colDef.context.minSearchLength || 1,
          loadingInitialOptions: colDef.context.loadingInitialOptions || false,
        },
        // Display joined labels if multiple, and provide a tooltip for full content
        cellRenderer: (params: ICellRendererParams) => {
          const val = params.value as unknown;
          const options = (colDef.context?.selectOptions || []) as Array<{
            value: unknown;
            label: string;
          }>;
          if (Array.isArray(val)) {
            const labels = (val as unknown[])
              .map(
                (v) =>
                  options.find((o) => String(o.value) === String(v))?.label ||
                  String(v)
              )
              .join(", ");
            return `${String(labels)}`;
          }
          const found = options.find(
            (item) => String(item.value) === String(val)
          );
          const text = found ? found.label : String(val ?? "");
          return `${String(text)}`;
        },
      };
    }

    // File / Upload column
    if (colDef.context?.typeColumn === "File") {
      return {
        ...colDef,
        // Preserve editable flag from original column definition (do not forcibly disable)
        editable:
          typeof colDef.editable === "boolean" ? colDef.editable : false,
        cellRenderer: FileUploadCellRenderer,
        cellRendererParams: {
          ...(colDef.cellRendererParams || {}),
        },
        valueFormatter: (params: ValueFormatterParams) => {
          return params?.value || "";
        },
      } as ColDef;
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
      // allow customizing date and time format via context
      const dateFormat =
        (colDef.context as unknown as { dateFormat?: string })?.dateFormat ||
        "DD/MM/YYYY";
      const timeFormat =
        (colDef.context as unknown as { timeFormat?: string })?.timeFormat ||
        "HH:mm:ss";
      const combinedFormat = `${dateFormat} ${timeFormat}`.trim();

      return {
        ...colDef,
        cellEditor: DatepickerCellEditor, // Custom date editor
        cellEditorParams: {
          // pass the combined format to the editor; allow overrides from colDef.cellEditorParams
          format: combinedFormat,
          ...(colDef.cellEditorParams || {}),
        },
        valueFormatter: (params) => {
          const date = dayjs(params.value);
          return date.isValid() ? date.format(combinedFormat) : "";
        },
      };
    }

    // Handle Text type columns (single-line input, can be email)
    if (colDef.context?.typeColumn === "Text") {
      return {
        ...colDef,
        cellEditor: AntdTextCellEditor,
        cellEditorParams: {
          ...(colDef.cellEditorParams || {}),
          maxLength: colDef.context?.maxLength,
          inputType: colDef.context?.inputType || "text",
        },
        valueFormatter: (params) => {
          // If there's already a valueFormatter, keep it
          if (typeof colDef.valueFormatter === "function") {
            return colDef.valueFormatter(params);
          }
          return params.value ?? "";
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
          const val = params.value;
          if (Array.isArray(val)) {
            return (val as unknown[])
              .map(
                (v) =>
                  options.find((item) => String(item.value) === String(v))
                    ?.label || String(v)
              )
              .join(", ");
          }
          const found = options.find((item) => item.value === params.value);
          return found ? found.label : params.value;
        },
        ...(colDef.editable
          ? {
              cellEditor: AntdSelectCellEditor,
              cellEditorParams: {
                values: options,
                // pass multiple flag through for Tag editing
                multiple:
                  (colDef.context as unknown as { multiple?: boolean })
                    ?.multiple || false,
              },
            }
          : {}),
      };
    }

    return colDef;
  });
};
