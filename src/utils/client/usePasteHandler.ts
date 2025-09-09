/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect } from "react";
import { getItemId } from "@/utils/client/validationHelpers";

/**
 * Custom hook xử lý paste dữ liệu từ clipboard và fill operation
 * @param {Function} getRowData - Hàm lấy dữ liệu hiện tại của bảng
 * @param {Function} setRowData - Hàm cập nhật dữ liệu cho bảng
 * @param {React.RefObject} gridRef - Tham chiếu tới bảng AgGrid
 * @param {Function} onValuesChanged - Hàm callback để nhận danh sách thay đổi
 * @param {Function} onFillChanges - Hàm callback để xử lý fill operation từ cTableAG
 */
const usePasteHandler = (
  getRowData: () => any[],
  setRowData: (newRowData: any[]) => void,
  gridRef: React.RefObject<any>,
  onValuesChanged: (
    changes: { id: string; data: Record<string, any> }[]
  ) => void,
  onFillChanges?: (changes: { id: string; data: Record<string, any> }[]) => void
) => {
  const handlePasteData = useCallback(() => {
    if (gridRef.current?.api.getEditingCells()?.length > 0) {
      return;
    }

    navigator.clipboard.readText().then((data) => {
      const pastedData = data
        .trim()
        .split("\n")
        .map((row) => row.split("\t").map((cell) => cell.trim()));

      const updatedRowData = [...getRowData()];
      const changes: { id: string; data: Record<string, any> }[] = [];

      const focusedCell = gridRef.current?.api.getFocusedCell();
      if (!focusedCell) {
        return;
      }

      const { rowIndex: startRowIndex, column } = focusedCell;
      const currentColumnField = column.getColDef().field;

      if (!currentColumnField) {
        return;
      }

      const columnDefs = gridRef.current?.api.getColumnDefs();
      if (!columnDefs) {
        return;
      }

      const fieldToColDef = new Map<string, any>();
      columnDefs.forEach((colDef: any) => {
        if (colDef?.field) fieldToColDef.set(colDef.field, colDef);
      });

      const buildAgParams = (targetRowIndex: number, colDef: any) => {
        const api = gridRef.current?.api;
        const columnApi = gridRef.current?.columnApi;
        const node = api?.getDisplayedRowAtIndex?.(targetRowIndex);
        return {
          api,
          columnApi,
          node,
          data: node?.data ?? getRowData()[targetRowIndex],
          colDef,
          column: columnApi?.getColumn(colDef.field),
          context: api?.getContext?.(),
        } as any;
      };
      // Xử lý giá trị select
      const getSelectValuesForCol = (
        colDef: any,
        targetRowIndex: number
      ): { values?: any[]; allowAddOption?: boolean } => {
        if (!colDef) return {};
        const paramsDef = colDef.cellEditorParams;
        let paramsObj: any = null;
        if (typeof paramsDef === "function") {
          try {
            paramsObj = paramsDef(buildAgParams(targetRowIndex, colDef));
          } catch {
            paramsObj = null;
          }
        } else if (typeof paramsDef === "object" && paramsDef) {
          paramsObj = paramsDef;
        }
        return paramsObj || {};
      };
      // Xử lý số thập phân có dấu phẩy
      const normalizeNumberString = (input: any): string => {
        const str = String(input ?? "").trim();
        if (str === "") return str;
        if (str.includes(".") && str.includes(",")) {
          const removedThousands = str.replace(/\./g, "");
          return removedThousands.replace(/,/g, ".");
        }
        if (str.includes(",") && /^[0-9,]+$/.test(str)) {
          return str.replace(/,/g, ".");
        }
        return str;
      };
      // Xử lý giá trị select
      const resolveSelectValue = (
        rawValue: any,
        colDef: any,
        targetRowIndex: number
      ): { isSelect: boolean; allowed: boolean; stored: string } => {
        const paramsObj = getSelectValuesForCol(colDef, targetRowIndex);
        const values: any[] | undefined = paramsObj?.values;
        const allowAddOption: boolean | undefined = paramsObj?.allowAddOption;
        if (!values || !Array.isArray(values)) {
          return {
            isSelect: false,
            allowed: true,
            stored: String(rawValue ?? ""),
          };
        }
        const candidate = String(rawValue ?? "").trim();
        for (const option of values) {
          if (option == null) continue;
          if (typeof option === "string" || typeof option === "number") {
            const opt = String(option).trim();
            if (opt === candidate) {
              return { isSelect: true, allowed: true, stored: opt };
            }
          } else if (typeof option === "object") {
            const valueKeys = ["value", "code", "key", "id"] as const;
            const labelKeys = ["label", "name", "text", "value"] as const;
            let optionValue: string | undefined;
            for (const k of valueKeys) {
              if (option[k] != null) {
                optionValue = String(option[k]).trim();
                break;
              }
            }
            const labels: string[] = [];
            for (const k of labelKeys) {
              if (option[k] != null) labels.push(String(option[k]).trim());
            }
            if (optionValue && optionValue === candidate) {
              return { isSelect: true, allowed: true, stored: optionValue };
            }
            if (labels.includes(candidate)) {
              return {
                isSelect: true,
                allowed: true,
                stored: optionValue ?? candidate,
              };
            }
          }
        }
        if (allowAddOption) {
          return { isSelect: true, allowed: true, stored: candidate };
        }
        return { isSelect: true, allowed: false, stored: "" };
      };

      const columnOrder = columnDefs
        .map((colDef: any) => colDef.field)
        .filter((field: string | undefined): field is string => !!field);

      const currentColIndex = columnOrder.indexOf(currentColumnField);
      if (currentColIndex === -1) {
        return;
      }

      pastedData.forEach((row, pastedRowIndex) => {
        const targetRowIndex = startRowIndex + pastedRowIndex;

        if (targetRowIndex < updatedRowData.length) {
          const rowId = getItemId(updatedRowData[targetRowIndex]);

          const changedData: Record<string, any> = {};

          row.forEach((cellValue, pastedColIndex) => {
            const targetColIndex = currentColIndex + pastedColIndex;
            if (targetColIndex < columnOrder.length) {
              const targetField = columnOrder[targetColIndex];
              if (updatedRowData[targetRowIndex].hasOwnProperty(targetField)) {
                const colDef = fieldToColDef.get(targetField);
                const raw = cellValue;
                const isNonEmpty =
                  raw !== undefined &&
                  raw !== null &&
                  String(raw).trim() !== "";
                if (isNonEmpty) {
                  const { isSelect, allowed, stored } = resolveSelectValue(
                    raw,
                    colDef,
                    targetRowIndex
                  );
                  if (isSelect) {
                    if (allowed) {
                      updatedRowData[targetRowIndex][targetField] = stored;
                      changedData[targetField] = stored;
                    } else {
                      updatedRowData[targetRowIndex][targetField] = "";
                      changedData[targetField] = "";
                    }
                  } else {
                    const normalized = normalizeNumberString(raw);
                    updatedRowData[targetRowIndex][targetField] = normalized;
                    changedData[targetField] = normalized;
                  }
                } else {
                  // Nếu người dùng paste rỗng, coi như xóa giá trị
                  updatedRowData[targetRowIndex][targetField] = "";
                  changedData[targetField] = "";
                }
              }
            }
          });

          if (Object.keys(changedData).length > 0) {
            changes.push({ id: rowId, data: changedData });
          }
        }
      });

      setRowData(updatedRowData);

      if (changes.length > 0) {
        onValuesChanged(changes);
      }
    });
  }, [getRowData, setRowData, gridRef, onValuesChanged]);

  // Hàm xử lý fill operation (được gọi từ AgGridComponent)
  const handleFillChanges = useCallback(
    (changes: { id: string; data: Record<string, any> }[]) => {
      const updatedRowData = [...getRowData()];

      changes.forEach(({ id, data }) => {
        const rowIndex = updatedRowData.findIndex(
          (row) => getItemId(row) === id
        );
        if (rowIndex !== -1) {
          Object.keys(data).forEach((field) => {
            updatedRowData[rowIndex][field] = data[field];
          });
        }
      });

      setRowData(updatedRowData);

      // Gọi cả onValuesChanged và onFillChanges nếu có
      onValuesChanged(changes);
      if (onFillChanges) {
        onFillChanges(changes);
      }
    },
    [getRowData, setRowData, onValuesChanged, onFillChanges]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "v") {
        handlePasteData();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePasteData, handleFillChanges]);

  // Return handleFillChanges để có thể sử dụng trực tiếp nếu cần
  return { handleFillChanges };
};

export default usePasteHandler;
