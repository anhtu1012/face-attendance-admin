import {
  useCallback,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { ColDef } from "@ag-grid-community/core";
import { getItemId } from "@/utils/client/validationHelpers";

interface CellEvent {
  rowIndex: number;
  colDef: { field: string };
  event?: Event & { target?: HTMLElement; clientX?: number; clientY?: number };
  data?: Record<string, unknown>;
}

interface FillSourceCell {
  rowIndex: number;
  colField: string;
  value: unknown;
}

interface FillSourceCellInfo {
  rowIndex: number;
  colField: string;
  cellElement: HTMLElement | null;
}

interface MultiSelectionBounds {
  startRow: number;
  endRow: number;
  startColIndex: number;
  endColIndex: number;
}

interface UseFillHandleProps {
  selectedCells: Set<string>;
  setSelectedCells: (value: Set<string>) => void;
  gridWrapperRef: React.RefObject<HTMLDivElement>;
  gridRef: React.RefObject<{
    api: { refreshCells: (params: unknown) => void };
  }>;
  rowData: unknown[];
  filteredData: unknown[];
  isFiltered: boolean;
  setFilteredData: (value: unknown[]) => void;
  columnDefs: ColDef[];
  multiSelectionBounds: MultiSelectionBounds | null;
  multiSelectionPattern: unknown[][] | null;
  setMultiSelectionPattern: (value: unknown[][] | null) => void;
  isDraggingFill: boolean;
  setIsDraggingFill: (value: boolean) => void;
  isDraggingFillRef: React.RefObject<boolean>;
  isSelecting: boolean;
  setIsSelecting: (value: boolean) => void;
  isSelectingRef: React.RefObject<boolean>;
  setStartCell: (value: { rowIndex: number; colField: string } | null) => void;

  pasteHandlerFillChanges: (
    changes: { id: string; data: Record<string, unknown> }[]
  ) => void;
  stopAutoScroll: () => void;
  handleAutoScrollByMousePosition: (mouseX: number, mouseY: number) => void;
  getColumnOrder: () => string[];
}

export const useFillHandle = ({
  selectedCells,
  setSelectedCells,
  gridWrapperRef,
  gridRef,
  rowData,
  filteredData,
  isFiltered,
  setFilteredData,
  columnDefs,
  multiSelectionBounds,
  multiSelectionPattern,
  setMultiSelectionPattern,
  isDraggingFill,
  setIsDraggingFill,
  isDraggingFillRef,
  isSelecting,
  setIsSelecting,
  isSelectingRef,
  setStartCell,
  pasteHandlerFillChanges,
  stopAutoScroll,
  handleAutoScrollByMousePosition,
  getColumnOrder,
}: UseFillHandleProps) => {
  const [fillHandleVisible, setFillHandleVisible] = useState(false);
  const [fillHandlePosition, setFillHandlePosition] = useState<{
    top: number | undefined;
    left: number | undefined;
  }>({
    top: undefined,
    left: undefined,
  });

  const [fillSourceCell, setFillSourceCell] = useState<FillSourceCell | null>(
    null
  );
  const [fillSourceCellInfo, setFillSourceCellInfo] =
    useState<FillSourceCellInfo | null>(null);
  const [fillTargetCells, setFillTargetCells] = useState<Set<string>>(
    new Set()
  );

  const lastCalculateTime = useRef(0);

  // Hàm hiển thị fill handle khi có ô được chọn
  const showFillHandle = useCallback(
    (event: CellEvent) => {
      // Kiểm tra nếu đang trong trạng thái drag fill thì không xử lý
      if (isDraggingFill || isDraggingFillRef.current) {
        return;
      }

      if (event.rowIndex != null && event.colDef?.field) {
        const cellElement = event.event?.target?.closest?.(".ag-cell");

        if (cellElement && gridWrapperRef.current) {
          const rect = cellElement.getBoundingClientRect();
          const gridRect = gridWrapperRef.current.getBoundingClientRect();

          // Cập nhật vị trí và các thông tin
          const newPosition = {
            top: rect.bottom - gridRect.top - 5,
            left: rect.right - gridRect.left - 5,
          };

          setFillHandlePosition(newPosition);
          setFillSourceCell({
            rowIndex: event.rowIndex,
            colField: event.colDef.field,
            value: event.data?.[event.colDef.field],
          });
          setFillSourceCellInfo({
            rowIndex: event.rowIndex,
            colField: event.colDef.field,
            cellElement: cellElement as HTMLElement,
          });

          // Hiển thị fill handle với delay nhỏ để tránh bị ẩn ngay lập tức
          setTimeout(() => {
            setFillHandleVisible(true);
          }, 10);

          // Đảm bảo ô được thêm vào selectedCells nếu chưa có
          const cellId = `${event.rowIndex}-${event.colDef.field}`;
          if (!selectedCells.has(cellId)) {
            setSelectedCells(new Set([...Array.from(selectedCells), cellId]));
          }
        }
      }
    },
    [
      isDraggingFill,
      isDraggingFillRef,
      selectedCells,
      gridWrapperRef,
      setSelectedCells,
    ]
  );

  // Hàm xử lý khi bắt đầu drag fill handle
  const handleFillMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Đảm bảo fill handle vẫn hiển thị khi bắt đầu drag
      if (!fillHandleVisible) {
        setFillHandleVisible(true);
      }

      // Set drag state
      setIsDraggingFill(true);
      isDraggingFillRef.current = true;
      setFillTargetCells(new Set());

      // Đảm bảo không bị conflict với selection state
      if (isSelecting) {
        setTimeout(() => {
          setIsSelecting(false);
          isSelectingRef.current = false;
        }, 50);
      }

      // Set attribute để interval có thể check
      if (gridWrapperRef.current) {
        gridWrapperRef.current.setAttribute("data-dragging", "true");
      }

      // Nếu đang chọn nhiều ô, chuẩn bị pattern để fill
      if (selectedCells.size > 1 && multiSelectionBounds) {
        const dataSource = isFiltered ? filteredData : rowData;
        const columnOrder = getColumnOrder();
        const pattern: unknown[][] = [];
        for (
          let r = multiSelectionBounds.startRow;
          r <= multiSelectionBounds.endRow;
          r++
        ) {
          const rowArr: unknown[] = [];
          for (
            let c = multiSelectionBounds.startColIndex;
            c <= multiSelectionBounds.endColIndex;
            c++
          ) {
            const field = columnOrder[c];
            rowArr.push((dataSource?.[r] as Record<string, unknown>)?.[field]);
          }
          pattern.push(rowArr);
        }
        setMultiSelectionPattern(pattern);
      }
    },
    [
      fillHandleVisible,
      setIsDraggingFill,
      isDraggingFillRef,
      setFillTargetCells,
      isSelecting,
      setIsSelecting,
      isSelectingRef,
      gridWrapperRef,
      selectedCells.size,
      multiSelectionBounds,
      isFiltered,
      filteredData,
      rowData,
      getColumnOrder,
      setMultiSelectionPattern,
    ]
  );

  // Hàm tính toán fill target cells dựa trên vị trí chuột
  const calculateFillTargetCells = useCallback(
    (mouseX: number, mouseY: number) => {
      console.log("calculateFillTargetCells called", {
        mouseX,
        mouseY,
        isDraggingFill,
      });
      if (!isDraggingFill || !gridWrapperRef.current) return;

      // Throttle để tránh tính toán quá nhiều lần
      const now = Date.now();
      if (now - lastCalculateTime.current < 8) return; // ~120fps
      lastCalculateTime.current = now;

      // Tìm cell element tại vị trí chuột
      // Tạm thời disable pointer events của fill-handle để tránh che khuất
      const fillHandleElement = document.querySelector(
        ".fill-handle"
      ) as HTMLElement;
      const originalPointerEvents = fillHandleElement?.style.pointerEvents;
      if (fillHandleElement) {
        fillHandleElement.style.pointerEvents = "none";
      }

      const elementAtPoint = document.elementFromPoint(mouseX, mouseY);
      console.log("elementAtPoint found", !!elementAtPoint);

      // Khôi phục pointer events của fill-handle
      if (fillHandleElement) {
        fillHandleElement.style.pointerEvents = originalPointerEvents || "";
      }

      let targetRowIndex: number;
      let targetColField: string;

      if (elementAtPoint) {
        // Tìm cell element gần nhất
        const cellElement = elementAtPoint.closest(".ag-cell");
        console.log("cellElement found", !!cellElement);
        if (cellElement) {
          // Lấy thông tin row và column từ cell element
          const rowElement = cellElement.closest("[row-index]");
          if (rowElement) {
            targetRowIndex = parseInt(
              rowElement.getAttribute("row-index") || "0",
              10
            );
            const colId = cellElement.getAttribute("col-id");
            if (colId !== null) {
              targetColField = colId;
            } else {
              return;
            }
          } else {
            return;
          }
        } else {
          return;
        }
      } else {
        // Fallback: tính toán dựa trên vị trí fill-handle
        if (!gridWrapperRef.current) return;

        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        const relativeX = mouseX - gridRect.left;
        const relativeY = mouseY - gridRect.top;

        // Ước tính row và column dựa trên vị trí
        const rowHeight = 40; // Chiều cao mỗi row
        const headerHeight = 45; // Chiều cao header

        targetRowIndex = Math.max(
          0,
          Math.floor((relativeY - headerHeight) / rowHeight)
        );

        // Tìm column dựa trên vị trí X
        const columnOrder = getColumnOrder();
        if (columnOrder.length === 0) return;

        // Ước tính column index
        const estimatedColIndex = Math.min(
          columnOrder.length - 1,
          Math.max(0, Math.floor(relativeX / 100))
        );
        targetColField = columnOrder[estimatedColIndex];
      }

      // Tính toán fill cells trực tiếp
      const columnOrder = getColumnOrder();
      const targetColIndex = columnOrder.indexOf(targetColField);

      const fillCells = new Set<string>();
      console.log("Starting fill cells calculation", {
        targetRowIndex,
        targetColField,
        targetColIndex,
        selectedCellsSize: selectedCells.size,
      });

      // Trường hợp chọn nhiều ô: kéo để fill cả block theo pattern
      if (
        selectedCells.size > 1 &&
        multiSelectionBounds &&
        multiSelectionPattern
      ) {
        const startRow = Math.min(
          multiSelectionBounds.startRow,
          targetRowIndex
        );
        const endRow = Math.max(multiSelectionBounds.endRow, targetRowIndex);
        const startCol = Math.min(
          multiSelectionBounds.startColIndex,
          targetColIndex
        );
        const endCol = Math.max(
          multiSelectionBounds.endColIndex,
          targetColIndex
        );

        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            if (c >= 0 && c < columnOrder.length) {
              fillCells.add(`${r}-${columnOrder[c]}`);
            }
          }
        }
      } else if (fillSourceCell) {
        // Trường hợp 1 ô như cũ
        const sourceRowIndex = fillSourceCell.rowIndex;
        const sourceColField = fillSourceCell.colField;
        const sourceColIndex = columnOrder.indexOf(sourceColField);

        if (sourceColIndex !== -1 && targetColIndex !== -1) {
          const startRow = Math.min(sourceRowIndex, targetRowIndex);
          const endRow = Math.max(sourceRowIndex, targetRowIndex);
          const startCol = Math.min(sourceColIndex, targetColIndex);
          const endCol = Math.max(sourceColIndex, targetColIndex);
          for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
            for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
              fillCells.add(`${rowIndex}-${columnOrder[colIndex]}`);
            }
          }
        }
      }

      setFillTargetCells(fillCells);
      setSelectedCells(fillCells);
      console.log("Fill cells calculated", {
        fillCellsSize: fillCells.size,
        fillCells: Array.from(fillCells),
      });

      // Cập nhật vị trí fill handle đến ô cuối cùng trong vùng fill
      if (fillCells.size > 0) {
        // Tìm ô cuối cùng dựa trên row và column index
        let maxRowIndex = -1;
        let maxColIndex = -1;
        let lastCellId = "";

        fillCells.forEach((cellId) => {
          const [rowIndex, colField] = cellId.split("-");
          const rowIdx = parseInt(rowIndex, 10);
          const colIdx = columnOrder.indexOf(colField);

          if (
            rowIdx > maxRowIndex ||
            (rowIdx === maxRowIndex && colIdx > maxColIndex)
          ) {
            maxRowIndex = rowIdx;
            maxColIndex = colIdx;
            lastCellId = cellId;
          }
        });

        if (lastCellId) {
          const [lastRowIndex, lastColField] = lastCellId.split("-");

          // Tìm cell element của ô cuối cùng
          const lastCellElement = gridWrapperRef.current?.querySelector(
            `[row-index="${lastRowIndex}"] .ag-cell[col-id="${lastColField}"]`
          );

          if (lastCellElement && gridWrapperRef.current) {
            const rect = lastCellElement.getBoundingClientRect();
            const gridRect = gridWrapperRef.current.getBoundingClientRect();

            const newPosition = {
              top: rect.bottom - gridRect.top - 5,
              left: rect.right - gridRect.left - 5,
            };

            setFillHandlePosition(newPosition);
          }
        }
      }
    },
    [
      isDraggingFill,
      selectedCells,
      multiSelectionBounds,
      multiSelectionPattern,
      fillSourceCell,
      getColumnOrder,
      gridWrapperRef,
      setFillTargetCells,
      setSelectedCells,
    ]
  );

  // Hàm xử lý khi drag fill handle qua các cell
  const handleFillDrag = useCallback(
    (event: CellEvent) => {
      console.log("handleFillDrag called", {
        rowIndex: event.rowIndex,
        colField: event.colDef?.field,
      });
      if (!isDraggingFill) return;

      // Xử lý auto-scroll dựa trên vị trí chuột
      const mouseX = event.event?.clientX || 0;
      const mouseY = event.event?.clientY || 0;
      handleAutoScrollByMousePosition(mouseX, mouseY);

      if (event.rowIndex != null && event.colDef?.field) {
        const targetRowIndex = event.rowIndex;
        const targetColField = event.colDef.field;
        const columnOrder = getColumnOrder();
        const targetColIndex = columnOrder.indexOf(targetColField);

        const fillCells = new Set<string>();

        // Trường hợp chọn nhiều ô: kéo để fill cả block theo pattern
        if (
          selectedCells.size > 1 &&
          multiSelectionBounds &&
          multiSelectionPattern
        ) {
          const startRow = Math.min(
            multiSelectionBounds.startRow,
            targetRowIndex
          );
          const endRow = Math.max(multiSelectionBounds.endRow, targetRowIndex);
          const startCol = Math.min(
            multiSelectionBounds.startColIndex,
            targetColIndex
          );
          const endCol = Math.max(
            multiSelectionBounds.endColIndex,
            targetColIndex
          );

          for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
              if (c >= 0 && c < columnOrder.length) {
                fillCells.add(`${r}-${columnOrder[c]}`);
              }
            }
          }
        } else if (fillSourceCell) {
          // Trường hợp 1 ô như cũ
          const sourceRowIndex = fillSourceCell.rowIndex;
          const sourceColField = fillSourceCell.colField;
          const sourceColIndex = columnOrder.indexOf(sourceColField);

          if (sourceColIndex !== -1 && targetColIndex !== -1) {
            const startRow = Math.min(sourceRowIndex, targetRowIndex);
            const endRow = Math.max(sourceRowIndex, targetRowIndex);
            const startCol = Math.min(sourceColIndex, targetColIndex);
            const endCol = Math.max(sourceColIndex, targetColIndex);
            for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
              for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
                fillCells.add(`${rowIndex}-${columnOrder[colIndex]}`);
              }
            }
          }
        }

        setFillTargetCells(fillCells);
        setSelectedCells(fillCells);
        console.log("handleFillDrag completed", {
          fillCellsSize: fillCells.size,
        });
      }
    },
    [
      isDraggingFill,
      handleAutoScrollByMousePosition,
      getColumnOrder,
      selectedCells.size,
      multiSelectionBounds,
      multiSelectionPattern,
      fillSourceCell,
      setFillTargetCells,
      setSelectedCells,
    ]
  );

  // Hàm xử lý khi kết thúc drag fill handle
  const handleFillMouseUp = useCallback(async () => {
    // Dừng auto-scroll khi kết thúc drag
    stopAutoScroll();

    if (isDraggingFill && fillTargetCells.size > 0) {
      const newRowData = [...(isFiltered ? filteredData : rowData)] as Record<
        string,
        unknown
      >[];
      const changes: { id: string; data: Record<string, unknown> }[] = [];
      const columnOrder = getColumnOrder();

      if (
        selectedCells.size > 1 &&
        multiSelectionBounds &&
        multiSelectionPattern
      ) {
        // Tính bounds của vùng đích từ fillTargetCells
        let minRow = Number.POSITIVE_INFINITY;
        let maxRow = Number.NEGATIVE_INFINITY;
        let minColIdx = Number.POSITIVE_INFINITY;
        let maxColIdx = Number.NEGATIVE_INFINITY;

        fillTargetCells.forEach((cellId) => {
          const [rowStr, field] = cellId.split("-");
          const r = parseInt(rowStr, 10);
          const c = columnOrder.indexOf(field);
          if (!isNaN(r) && c !== -1) {
            minRow = Math.min(minRow, r);
            maxRow = Math.max(maxRow, r);
            minColIdx = Math.min(minColIdx, c);
            maxColIdx = Math.max(maxColIdx, c);
          }
        });

        const patternH = multiSelectionPattern.length;
        const patternW = multiSelectionPattern[0]?.length || 0;

        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minColIdx; c <= maxColIdx; c++) {
            const field = columnOrder[c];
            if (!field) continue;
            const relRow =
              (((r - multiSelectionBounds.startRow) % patternH) + patternH) %
              patternH;
            const relCol =
              (((c - multiSelectionBounds.startColIndex) % patternW) +
                patternW) %
              patternW;
            const newValue = multiSelectionPattern[relRow]?.[relCol];
            if (
              r === fillSourceCell?.rowIndex &&
              field === fillSourceCell?.colField
            ) {
              continue;
            }

            // Kiểm tra nếu cột là select thì chỉ set nếu hợp lệ
            const colDef = columnDefs.find((col) => col.field === field);
            let isValid = true;
            if (
              colDef &&
              colDef.cellEditorParams &&
              Array.isArray(
                (colDef.cellEditorParams as { values?: unknown[] }).values
              )
            ) {
              const options = (colDef.cellEditorParams as { values: unknown[] })
                .values;
              // Nếu là select mà options rỗng thì không cho fill
              if (options.length === 0) {
                isValid = false;
              } else {
                isValid = options.some(
                  (opt: unknown) =>
                    (typeof opt === "object" && opt !== null && "value" in opt
                      ? (opt as { value: unknown }).value
                      : opt) === newValue
                );
              }
            }

            if (isValid && r < newRowData.length && newRowData[r]) {
              const oldValue = newRowData[r][field];
              if (oldValue !== newValue) {
                newRowData[r][field] = newValue;
                const rowId = getItemId(newRowData[r]);
                if (rowId) {
                  const existing = changes.find((ch) => ch.id === rowId);
                  if (existing) {
                    existing.data[field] = newValue;
                  } else {
                    changes.push({ id: rowId, data: { [field]: newValue } });
                  }
                }
              }
            }
          }
        }
      } else if (fillSourceCell && fillTargetCells.size > 1) {
        // Trường hợp 1 ô nguồn: giữ nguyên hành vi cũ
        fillTargetCells.forEach((cellId) => {
          const [rowIndexStr, colField] = cellId.split("-");
          const rowIndex = parseInt(rowIndexStr, 10);

          // BỎ QUA Ô GỐC (ô bắt đầu fill)
          if (
            rowIndex === fillSourceCell?.rowIndex &&
            colField === fillSourceCell?.colField
          ) {
            return;
          }

          // Kiểm tra nếu cột là select thì chỉ set nếu hợp lệ
          const colDef = columnDefs.find((col) => col.field === colField);
          let isValid = true;
          if (
            colDef &&
            colDef.cellEditorParams &&
            Array.isArray(
              (colDef.cellEditorParams as { values?: unknown[] }).values
            )
          ) {
            const options = (colDef.cellEditorParams as { values: unknown[] })
              .values;
            isValid = options.some(
              (opt: unknown) =>
                (typeof opt === "object" && opt !== null && "value" in opt
                  ? (opt as { value: unknown }).value
                  : opt) === fillSourceCell.value
            );
          }
          if (isValid && rowIndex < newRowData.length && newRowData[rowIndex]) {
            const oldValue = newRowData[rowIndex][colField];
            const newValue = fillSourceCell.value;
            if (oldValue !== newValue) {
              newRowData[rowIndex][colField] = newValue;
              const rowId = getItemId(newRowData[rowIndex]);
              if (rowId) {
                const existing = changes.find((ch) => ch.id === rowId);
                if (existing) {
                  existing.data[colField] = newValue;
                } else {
                  changes.push({ id: rowId, data: { [colField]: newValue } });
                }
              }
            }
          }
        });
      }

      // Xử lý logic đặc biệt cho localSztp và isoSztp
      let isoSztpSource: unknown = null;
      if (fillSourceCell) {
        const sourceRow = newRowData[fillSourceCell.rowIndex];
        if (sourceRow) {
          isoSztpSource = (sourceRow as Record<string, unknown>).isoSztp;
        }
      }

      // Sau khi fill localSztp, dán luôn isoSztp của ô gốc cho các ô đang fill localSztp
      const localSztpField = columnDefs.find(
        (col) => col.field === "localSztp"
      );
      if (localSztpField && isoSztpSource !== undefined) {
        const filledLocalSztpCells = Array.from(fillTargetCells).filter(
          (cellId) => {
            const [, colField] = cellId.split("-");
            return colField === "localSztp";
          }
        );

        for (const cellId of filledLocalSztpCells) {
          const [rowIndexStr] = cellId.split("-");
          const rowIndex = parseInt(rowIndexStr, 10);
          const row = newRowData[rowIndex] as Record<string, unknown>;
          if (!row) continue;
          // BỎ QUA nếu chưa có hãng khai thác (oprCd hoặc oprCD)
          if (!row.oprCd && !row.oprCD) continue;
          // Dán isoSztp của ô gốc
          if (row.isoSztp !== isoSztpSource) {
            row.isoSztp = isoSztpSource;
            const rowId = getItemId(row);
            if (rowId) {
              const existing = changes.find((ch) => ch.id === rowId);
              if (existing) {
                existing.data["isoSztp"] = isoSztpSource;
              } else {
                changes.push({ id: rowId, data: { isoSztp: isoSztpSource } });
              }
            }
          }
        }
      }

      if (isFiltered) {
        setFilteredData(newRowData);
      }

      if (changes.length > 0) {
        // Sử dụng pasteHandlerFillChanges để xử lý fill changes
        pasteHandlerFillChanges(changes);
      }

      if (gridRef.current?.api) {
        gridRef.current.api.refreshCells({ force: true });
      }
    }

    setIsDraggingFill(false);
    isDraggingFillRef.current = false;
    setFillTargetCells(new Set());
    setFillSourceCell(null);
    setMultiSelectionPattern(null);

    // Delay reset isSelecting state để tránh conflict
    setTimeout(() => {
      setIsSelecting(false);
      isSelectingRef.current = false;

      // Clear attributes để interval dừng
      if (gridWrapperRef.current) {
        gridWrapperRef.current.removeAttribute("data-dragging");
        gridWrapperRef.current.removeAttribute("data-selecting");
      }

      // Xóa thông tin về ô bắt đầu
      setStartCell(null);
    }, 100);
  }, [
    stopAutoScroll,
    isDraggingFill,
    fillTargetCells,
    isFiltered,
    filteredData,
    rowData,
    getColumnOrder,
    selectedCells.size,
    multiSelectionBounds,
    multiSelectionPattern,
    fillSourceCell,
    columnDefs,
    setFilteredData,
    pasteHandlerFillChanges,
    gridRef,
    setIsDraggingFill,
    isDraggingFillRef,
    setFillTargetCells,
    setFillSourceCell,
    setMultiSelectionPattern,
    setIsSelecting,
    isSelectingRef,
    gridWrapperRef,
    setStartCell,
  ]);

  // Update fill handle position when scrolling
  useEffect(() => {
    if (!fillHandleVisible || !fillSourceCellInfo || !gridWrapperRef.current)
      return;

    const updateFillHandlePosition = () => {
      // Không cập nhật vị trí khi đang drag fill handle
      if (isDraggingFill || isDraggingFillRef.current) return;

      const cellElement = fillSourceCellInfo.cellElement;
      if (!cellElement || !gridWrapperRef.current) return;

      const rect = cellElement.getBoundingClientRect();
      const gridRect = gridWrapperRef.current.getBoundingClientRect();

      const newPosition = {
        top: rect.bottom - gridRect.top - 5,
        left: rect.right - gridRect.left - 5,
      };

      setFillHandlePosition(newPosition);
    };

    // Lắng nghe scroll event trên cả grid container, viewport và window
    const gridViewport =
      gridWrapperRef.current.querySelector(".ag-body-viewport");
    const gridContainer = gridWrapperRef.current;

    if (gridViewport) {
      gridViewport.addEventListener("scroll", updateFillHandlePosition);
    }
    if (gridContainer) {
      gridContainer.addEventListener("scroll", updateFillHandlePosition);
    }
    window.addEventListener("scroll", updateFillHandlePosition);

    return () => {
      if (gridViewport) {
        gridViewport.removeEventListener("scroll", updateFillHandlePosition);
      }
      if (gridContainer) {
        gridContainer.removeEventListener("scroll", updateFillHandlePosition);
      }
      window.removeEventListener("scroll", updateFillHandlePosition);
    };
  }, [
    fillHandleVisible,
    fillSourceCellInfo,
    isDraggingFill,
    isDraggingFillRef,
    gridWrapperRef,
  ]);

  // Update fill handle position when grid data changes or re-renders
  useEffect(() => {
    if (!fillHandleVisible || !fillSourceCellInfo || !gridWrapperRef.current)
      return;

    const updatePosition = () => {
      // Không cập nhật vị trí khi đang drag fill handle
      if (isDraggingFill || isDraggingFillRef.current) return;

      const cellElement = fillSourceCellInfo.cellElement;
      if (!cellElement || !gridWrapperRef.current) return;

      const rect = cellElement.getBoundingClientRect();
      const gridRect = gridWrapperRef.current.getBoundingClientRect();

      setFillHandlePosition({
        top: rect.bottom - gridRect.top - 5,
        left: rect.right - gridRect.left - 5,
      });
    };

    // Cập nhật vị trí sau khi grid render xong
    const timeoutId = setTimeout(updatePosition, 50);
    return () => clearTimeout(timeoutId);
  }, [
    rowData,
    filteredData,
    fillHandleVisible,
    fillSourceCellInfo,
    isDraggingFill,
    isDraggingFillRef,
    gridWrapperRef,
  ]);

  // Đảm bảo fill handle được hiển thị khi có selectedCells
  useEffect(() => {
    if (selectedCells.size > 0 && !fillHandleVisible && fillSourceCell) {
      setFillHandleVisible(true);
    }
  }, [selectedCells, fillHandleVisible, fillSourceCell]);

  // Sử dụng useLayoutEffect để cập nhật vị trí trước khi render
  useLayoutEffect(() => {
    if (
      fillHandleVisible &&
      fillSourceCellInfo?.cellElement &&
      gridWrapperRef.current
    ) {
      // Không cập nhật vị trí khi đang drag fill handle
      if (isDraggingFill || isDraggingFillRef.current) return;

      const cellElement = fillSourceCellInfo.cellElement;
      const rect = cellElement.getBoundingClientRect();
      const gridRect = gridWrapperRef.current.getBoundingClientRect();

      const newPosition = {
        top: rect.bottom - gridRect.top - 5,
        left: rect.right - gridRect.left - 5,
      };

      setFillHandlePosition(newPosition);
    }
  }, [
    fillHandleVisible,
    fillSourceCellInfo,
    isDraggingFill,
    isDraggingFillRef,
    gridWrapperRef,
  ]);

  return {
    fillHandleVisible,
    fillHandlePosition,
    fillSourceCell,
    fillSourceCellInfo,
    fillTargetCells,
    showFillHandle,
    handleFillMouseDown,
    handleFillDrag,
    handleFillMouseUp,
    calculateFillTargetCells,
    setFillHandleVisible,
    setFillSourceCell,
    setFillSourceCellInfo,
  };
};
