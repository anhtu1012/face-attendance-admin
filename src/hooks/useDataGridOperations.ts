/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useEffect } from "react";
import {
  showError,
  showSuccess,
  showInfo,
  showWarning,
} from "@/hooks/useNotification";

interface UseDataGridOperationsConfig<T> {
  gridRef: React.RefObject<any>;
  createNewItem: (index: number) => T;
  mes: any;
  getItemId?: (item: T) => string;
  duplicateCheckField?: keyof T;
  rowData: T[];
  setRowData: React.Dispatch<React.SetStateAction<T[]>>;
}

export function useDataGridOperations<T extends Record<string, any>>({
  gridRef,
  createNewItem,
  mes,
  getItemId = (item) => item.id || item.unitKey || "",
  duplicateCheckField,
  rowData,
  setRowData,
}: UseDataGridOperationsConfig<T>) {
  // Basic state
  const [isClient, setIsClient] = useState(false);
  const [editedRows, setEditedRows] = useState<T[]>([]);
  const [rowSelected, setRowSelected] = useState<number>(0);
  const [duplicateIDs, setDuplicateIDs] = useState<string[]>([]);
  const [changedValues, setChangedValues] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle selection changes
  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    setRowSelected(selectedNodes ? selectedNodes.length : 0);
  }, [gridRef]);

  // Handle adding new rows
  const handleModalOk = useCallback(
    (count: number) => {
      if (count > 0) {
        const newItems: T[] = [];
        for (let i = 0; i < count; i++) {
          newItems.push(createNewItem(i));
        }
        setRowData((prev) => [...newItems, ...prev]);
        showSuccess(mes("success.rowsAdded", { count }));
      } else {
        showError(mes("error.invalidRowCount"));
      }
    },
    [createNewItem, mes, setRowData]
  );

  // Handle cell value changes
  const onCellValueChanged = useCallback(
    (event: any) => {
      const { newValue, data, colDef, node } = event;
      const id = data.id;
      const itemId = getItemId(data);
      const fieldName = colDef.field;
      // Update changedValues for existing records (có id)
      if (id) {
        setChangedValues((prevChangedValues) => {
          const existingItemIndex = prevChangedValues.findIndex(
            (item) => item.id === id
          );

          if (existingItemIndex !== -1) {
            const updatedChangedValues = [...prevChangedValues];
            updatedChangedValues[existingItemIndex] = {
              ...updatedChangedValues[existingItemIndex],
              data: {
                ...updatedChangedValues[existingItemIndex].data,
                [fieldName]: newValue,
              },
            };
            return updatedChangedValues;
          } else {
            return [
              ...prevChangedValues,
              { id, data: { [fieldName]: newValue } },
            ];
          }
        });
      }

      // Update edited rows
      setEditedRows((prev) => {
        const updatedRows = prev.filter((row) => getItemId(row) !== itemId);
        updatedRows.push({ ...data, [fieldName]: newValue });

        // Check for duplicates if field is specified
        if (duplicateCheckField) {
          const allIDs = rowData
            .map((row) => row[duplicateCheckField])
            .filter((id) => id && String(id).trim() !== "");
          const duplicates = allIDs.filter(
            (id, index) => allIDs.indexOf(id) !== index
          );
          setDuplicateIDs(Array.from(new Set(duplicates)));
        }

        // Refresh cells
        if (gridRef.current) {
          gridRef.current.api.refreshCells({
            force: true,
            rowNodes: [node],
          });
        }

        return updatedRows;
      });
    },
    [rowData, duplicateCheckField, getItemId, gridRef]
  );

  // Save function - generic
  const createSaveHandler = useCallback(
    (
      validateRowData: (data: T) => boolean,
      addAPI?: (item: any) => Promise<any>,
      updateAPI?: (item: any) => Promise<any>,
      fetchData?: () => Promise<void>
    ) => {
      return async () => {
        if (editedRows.length > 0) {
          if (duplicateIDs.length > 0) {
            showError(mes("error.duplicateIDs"));
            return;
          }

          const newRows = editedRows.filter(
            (row) => !row.id && row.unitKey !== undefined
          );
          const updatedRows = editedRows.filter((row) => row.id);

          try {
            // Validate all rows
            const allRowsToValidate = [...newRows, ...updatedRows];
            const invalidRows = allRowsToValidate.filter(
              (row) => !validateRowData(row)
            );

            if (invalidRows.length > 0) {
              setRowData((prevRowData) =>
                prevRowData.map((row) =>
                  invalidRows.some(
                    (invalidRow) => getItemId(invalidRow) === getItemId(row)
                  )
                    ? { ...row, isError: true, isSaved: false }
                    : row
                )
              );

              // Focus on first invalid row
              if (gridRef.current && invalidRows.length > 0) {
                const firstInvalidRowIndex = rowData.findIndex(
                  (row) => getItemId(row) === getItemId(invalidRows[0])
                );
                if (firstInvalidRowIndex >= 0) {
                  gridRef.current.api.ensureIndexVisible(
                    firstInvalidRowIndex,
                    "middle"
                  );
                }
              }
              return;
            }

            // Add new rows
            if (newRows.length > 0 && addAPI) {
              // const res = await addAPI(newRows);
              console.log("New Rows to add:", newRows);

              showSuccess(mes("success.rowsAdded", { count: newRows.length }));
            }

            // Update existing rows
            if (changedValues.length > 0 && updateAPI) {
              await Promise.all(
                changedValues.map(async (row: any) => {
                  await updateAPI(row.data);
                })
              );
              showSuccess(
                mes("success.customersUpdated", { count: changedValues.length })
              );
            }

            // Reset state
            setRowData((prevRowData) =>
              prevRowData.map((row) =>
                editedRows.some(
                  (editedRow) => getItemId(editedRow) === getItemId(row)
                )
                  ? { ...row, isError: false, isSaved: true }
                  : row
              )
            );

            setEditedRows([]);
            setDuplicateIDs([]);
            setChangedValues([]);

            if (fetchData) {
              fetchData();
            }
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || error.message || "Unknown error";
            showError(mes("error.processingRows", { error: errorMessage }));
          }
        } else {
          showInfo(mes("info.noChanges"));
        }
      };
    },
    [
      editedRows,
      duplicateIDs,
      changedValues,
      rowData,
      mes,
      getItemId,
      gridRef,
      setRowData,
    ]
  );

  // Delete function - generic
  const createDeleteHandler = useCallback(
    (
      deleteAPI?: (id: string) => Promise<any>,
      fetchData?: () => Promise<void>
    ) => {
      return async () => {
        const selectedNodes = gridRef.current?.api.getSelectedNodes();

        if (selectedNodes && selectedNodes.length > 0) {
          const selectedData = selectedNodes.map((node: any) => node.data);
          const remainingRows = [...rowData];

          try {
            for (const data of selectedData) {
              if (data.id && deleteAPI) {
                await deleteAPI(data.id);
                if (fetchData) {
                  fetchData();
                }
              }

              const index = remainingRows.findIndex(
                (row) => getItemId(row) === getItemId(data)
              );
              if (index !== -1) {
                remainingRows.splice(index, 1);
              }

              setEditedRows((prevEditedRows) =>
                prevEditedRows.filter((row) => row.unitKey !== data.unitKey)
              );
            }
            setRowData(remainingRows);
            showSuccess(mes("success.rowsDeleted"));
          } catch (error: any) {
            showError(
              mes("error.deletingRows", {
                error: error.response?.data?.message,
              })
            );
          }
        } else {
          showWarning(mes("warning.noRowsSelected"));
        }
      };
    },
    [rowData, mes, getItemId, gridRef, setRowData]
  );

  function processBooleanFields<T extends Record<string, any>>(
    data: T[],
    booleanFields: string[]
  ): T[] {
    return data.map((item) => {
      const processedItem = { ...item } as any;
      booleanFields.forEach((field) => {
        if (
          processedItem[field] !== undefined &&
          typeof processedItem[field] === "string"
        ) {
          processedItem[field] =
            processedItem[field]?.toString().toLowerCase() === "true" ||
            processedItem[field] === "1";
        }
      });
      return processedItem;
    });
  }

  function useCustomTooltipCss() {
    useEffect(() => {
      const styleElement = document.createElement("style");
      styleElement.textContent = `
      .ag-tooltip {
        background-color: #ffeeee !important;
        color: #d32f2f !important;
        font-weight: bold !important;
        border: 1px solid #d32f2f !important;
        padding: 6px 10px !important;
      }
    `;
      document.head.appendChild(styleElement);
      return () => {
        document.head.removeChild(styleElement);
      };
    }, []);
  }

  useCustomTooltipCss();

  // Paste handler
  const createPasteHandler = useCallback(
    (booleanFields: string[], customProcess?: (newData: T[]) => T[]) => {
      const handleFillChanges = (newData: T[]) => {
        let processedData = processBooleanFields(newData, booleanFields);
        if (customProcess) {
          processedData = customProcess(processedData);
        }
        setRowData(processedData);
        setEditedRows((prevEditedRows) => {
          const updatedEditedRows = [...prevEditedRows];
          processedData.forEach((newItem) => {
            const existingIndex = updatedEditedRows.findIndex(
              (editedItem) => getItemId(editedItem) === getItemId(newItem)
            );
            if (existingIndex !== -1) {
              updatedEditedRows[existingIndex] = {
                ...updatedEditedRows[existingIndex],
                ...newItem,
              };
            } else {
              updatedEditedRows.push(newItem);
            }
          });
          return updatedEditedRows;
        });
      };
      return { handleFillChanges };
    },
    [setRowData, setEditedRows, getItemId]
  );

  return {
    // State
    isClient,
    rowData,
    editedRows,
    rowSelected,
    duplicateIDs,
    changedValues,

    // State setters
    setRowData,
    setEditedRows,
    setRowSelected,
    setDuplicateIDs,
    setChangedValues,

    // Event handlers
    onSelectionChanged,
    handleModalOk,
    onCellValueChanged,

    // Factory functions
    createSaveHandler,
    createDeleteHandler,
    createPasteHandler,
  };
}
