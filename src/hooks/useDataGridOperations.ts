/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "@/hooks/useNotification";
import {
  selectAllItemErrors,
  addItemError,
  removeItemError,
  clearAllItemErrors,
} from "@/lib/store/slices/validationErrorsSlice";
import { buildQuicksearchParams } from "@/utils/client/buildQuicksearchParams/buildQuicksearchParams";
import { useCollectErrorMessagesForItem } from "@/utils/client/errorMessageHelpers";
import { validateField } from "@/utils/client/validateTable/validateField ";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

interface UseDataGridOperationsConfig<T> {
  gridRef: React.RefObject<any>;
  createNewItem: (index: number) => T;
  mes: any;
  getItemId?: (item: T) => string;
  duplicateCheckField?: keyof T;
  rowData: T[];
  setRowData: React.Dispatch<React.SetStateAction<T[]>>;
  validateRowData?: (data: T) => boolean;
  handleQuicksearch?: (
    searchText: string | "",
    selectedFilterColumns: any[],
    filterValues: string | "",
    paginationSize: number
  ) => void;
  requiredFields?: Array<{ field: keyof T; label: string }>;
  t?: any;
  // New parameters for quicksearch functionality
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  setQuickSearchText?: React.Dispatch<React.SetStateAction<string | undefined>>;
  fetchData?: (
    currentPage: number,
    pageSize: number,
    quickSearchText: string | undefined
  ) => Promise<void>;
  columnDefs?: any[];
}

export function useDataGridOperations<T extends Record<string, any>>({
  gridRef,
  createNewItem,
  mes,
  getItemId = (item) => item.id || item.unitKey || "",
  duplicateCheckField,
  rowData,
  setRowData,
  handleQuicksearch: configHandleQuicksearch,
  requiredFields,
  t,
  // New parameters for quicksearch functionality
  setCurrentPage,
  setPageSize,
  setQuickSearchText,
  fetchData,
  columnDefs,
}: UseDataGridOperationsConfig<T>) {
  // Basic state
  const [isClient, setIsClient] = useState(false);
  const [editedRows, setEditedRows] = useState<T[]>([]);
  const [rowSelected, setRowSelected] = useState<number>(0);
  const [duplicateIDs, setDuplicateIDs] = useState<string[]>([]);
  const [changedValues, setChangedValues] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const dispatch = useDispatch();

  // Add a function to collect all error messages for a specific item
  const collectErrorMessagesForItem =
    useCollectErrorMessagesForItem(itemErrorsFromRedux);

  useEffect(() => {
    // Update the rowData to include error messages for tooltips
    // Only update if there are actual changes to avoid infinite loops
    setRowData((prevRowData) => {
      let hasChanges = false;
      let hasErrors = false;
      const newRowData = prevRowData.map((row) => {
        const itemId = getItemId(row);
        const errorMessages = collectErrorMessagesForItem(itemId);
        const currentErrorMessages = (row as any).errorMessages || "";

        if (errorMessages !== currentErrorMessages) {
          hasChanges = true;
          if (errorMessages) {
            // Có lỗi thì thêm isError và isSaved
            hasErrors = true;
            return {
              ...row,
              isError: true,
              isSaved: false,
              errorMessages: errorMessages,
            };
          } else {
            // Không có lỗi thì bỏ isError và isSaved
            const rowWithoutErrorFlags = Object.keys(row).reduce((acc, key) => {
              if (key !== "isError" && key !== "isSaved") {
                acc[key] = row[key];
              }
              return acc;
            }, {} as any);
            return {
              ...rowWithoutErrorFlags,
              errorMessages: errorMessages,
            };
          }
        }
        // Check if existing row has error
        if ((row as any).isError) {
          hasErrors = true;
        }
        return row;
      });

      // Update hasValidationErrors
      setHasValidationErrors(hasErrors);

      // Only return new array if there are actual changes
      return hasChanges ? newRowData : prevRowData;
    });
  }, [itemErrorsFromRedux, collectErrorMessagesForItem, setRowData, getItemId]);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate validateRowData if requiredFields is provided
  const generatedValidateRowData = useCallback(
    (data: T): boolean => {
      if (!requiredFields || !t || !mes) return true; // if not provided, assume valid
      let isValid = true;
      const itemId = getItemId(data);

      requiredFields.forEach(({ field, label }) => {
        if (
          !validateField(
            label,
            data[field],
            true,
            String(field),
            "string",
            itemId,
            (key, params) => {
              try {
                return mes(key, params);
              } catch {
                return `${label} không được để trống`;
              }
            }
          )
        ) {
          isValid = false;
        }
      });
      return isValid;
    },
    [requiredFields, t, mes, getItemId]
  );

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
        showSuccess(mes("rowsAdded", { count }));
      } else {
        showError(mes("invalidRowCount"));
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

      // Set editing state
      setIsEditing(true);

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
          const duplicateSet = new Set(duplicates);
          console.log("Duplicate IDs found:", Array.from(duplicateSet));

          // Clear previous duplicate errors
          rowData.forEach((row) => {
            const itemId = getItemId(row);
            dispatch(
              removeItemError({
                itemId,
                field: String(duplicateCheckField),
              })
            );
          });

          // Add errors for duplicates
          rowData.forEach((row) => {
            const value = row[duplicateCheckField];
            console.log("Checking value for duplicates:", value);
            console.log("duplicateCheckField:", duplicateCheckField);

            if (value && duplicateSet.has(value)) {
              const itemId = getItemId(row);
              const errorMessage = mes("duplicateIDs");
              dispatch(
                addItemError({
                  itemId,
                  error: {
                    field: String(duplicateCheckField),
                    message: errorMessage,
                  },
                })
              );
            }
          });

          setDuplicateIDs(Array.from(new Set(duplicates)));
        }

        // Immediate required field validation
        if (requiredFields && t && mes) {
          const updatedData = { ...data, [fieldName]: newValue };

          requiredFields.forEach(({ field, label }) => {
            const fieldValue = updatedData[field];
            const isValid = validateField(
              label,
              fieldValue,
              true,
              String(field),
              "string",
              itemId,
              (key, params) => {
                try {
                  return mes(key, params);
                } catch {
                  return `${label} không được để trống`;
                }
              }
            );

            if (!isValid) {
              // Add error for invalid required field
              dispatch(
                addItemError({
                  itemId,
                  error: {
                    field: String(field),
                    message: `${label} không được để trống`,
                  },
                })
              );
            } else {
              // Remove error if field is now valid
              dispatch(
                removeItemError({
                  itemId,
                  field: String(field),
                })
              );
            }
          });
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
    [
      rowData,
      duplicateCheckField,
      getItemId,
      gridRef,
      dispatch,
      mes,
      setIsEditing,
      requiredFields,
      t,
    ]
  );
  console.log("duplicateIDs", duplicateIDs);

  // Save function - generic
  const createSaveHandler = useCallback(
    (
      addAPI?: (item: any) => Promise<any>,
      updateAPI?: (item: any) => Promise<any>,
      fetchData?: () => Promise<void>
    ) => {
      const actualValidate = generatedValidateRowData;

      if (!actualValidate) {
        throw new Error("validateRowData is required");
      }
      return async () => {
        console.log("editedRows", editedRows);
        console.log("changedValues", changedValues);

        // Check for duplicates before saving
        if (duplicateIDs.length > 0) {
          showError(mes("duplicateIDs"));
          return;
        }

        if (editedRows.length > 0) {
          const newRows = editedRows.filter(
            (row) => !row.id && row.unitKey !== undefined
          );
          const updatedRows = editedRows.filter((row) => row.id);

          try {
            // Validate all rows
            const allRowsToValidate = [...newRows, ...updatedRows];
            const invalidRows = allRowsToValidate.filter(
              (row) => !actualValidate(row)
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
              await addAPI(newRows);
              dispatch(clearAllItemErrors());
              showSuccess(mes("rowsAdded", { count: newRows.length }));
            }

            // Update existing rows
            if (changedValues.length > 0 && updateAPI) {
              const updateData = changedValues.map((row: any) => ({
                id: row.id,
                ...row.data,
              }));
              try {
                await updateAPI(updateData);
                showSuccess(
                  mes("customersUpdated", { count: changedValues.length })
                );
                dispatch(clearAllItemErrors());
              } catch (updateError) {
                throw updateError;
              }
            } else {
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
            setIsEditing(false);
            if (fetchData) {
              fetchData();
            }
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || error.message || "Unknown error";
            showError(`Lỗi khi xử lý: ${errorMessage}`);
          }
        } else {
          showInfo(mes("noChanges"));
        }
      };
    },
    [
      editedRows,
      changedValues,
      rowData,
      mes,
      getItemId,
      gridRef,
      setRowData,
      generatedValidateRowData,
      dispatch,
      setIsEditing,
      duplicateIDs,
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
            showSuccess(mes("rowsDeleted"));
          } catch (error: any) {
            showError(`Lỗi khi xóa: ${error.response?.data?.message}`);
          }
        } else {
          showWarning(mes("noRowsSelected"));
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

  // Quicksearch handler
  const handleQuicksearch = useCallback(
    (
      searchText: string | "",
      selectedFilterColumns: any[],
      filterValues: string | "",
      paginationSize: number
    ) => {
      // Skip fetch if currently editing to avoid overwriting changes
      if (isEditing) return;

      if (setCurrentPage) setCurrentPage(1);
      if (setPageSize) setPageSize(paginationSize);

      if (!searchText && !filterValues) {
        if (setQuickSearchText) setQuickSearchText(undefined);
        if (fetchData) fetchData(1, paginationSize, undefined);
        return;
      }

      if (columnDefs) {
        const params = buildQuicksearchParams(
          searchText,
          selectedFilterColumns,
          filterValues,
          columnDefs
        );
        if (setQuickSearchText) setQuickSearchText(params);
        if (fetchData) fetchData(1, paginationSize, params);
      }
    },
    [
      isEditing,
      setCurrentPage,
      setPageSize,
      setQuickSearchText,
      columnDefs,
      fetchData,
    ]
  );

  return {
    // State
    isClient,
    rowData,
    editedRows,
    rowSelected,
    duplicateIDs,
    changedValues,
    isEditing,
    hasValidationErrors,

    // State setters
    setRowData,
    setEditedRows,
    setRowSelected,
    setDuplicateIDs,
    setChangedValues,
    setIsEditing,

    // Event handlers
    onSelectionChanged,
    handleModalOk,
    onCellValueChanged,

    // Factory functions
    createSaveHandler,
    createDeleteHandler,
    createPasteHandler,

    // Additional functions
    handleQuicksearch: configHandleQuicksearch || handleQuicksearch,
  };
}
