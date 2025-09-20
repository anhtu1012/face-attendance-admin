import { useCallback, useRef } from "react";
import { ColDef } from "@ag-grid-community/core";

interface CellEvent {
  rowIndex: number;
  colDef: { field: string };
  event?: Event;
  data?: Record<string, unknown>;
}

interface MultiSelectionBounds {
  startRow: number;
  endRow: number;
  startColIndex: number;
  endColIndex: number;
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

interface UseMouseHandlersProps {
  isSelecting: boolean;
  setIsSelecting: (value: boolean) => void;
  isDraggingFill: boolean;
  isDraggingCells: boolean;
  setIsDraggingCells: (value: boolean) => void;
  startCell: { rowIndex: number; colField: string } | null;
  setStartCell: (value: { rowIndex: number; colField: string } | null) => void;
  selectedCells: Set<string>;
  setSelectedCells: (value: Set<string>) => void;
  setMultiSelectionBounds: (value: MultiSelectionBounds | null) => void;
  setMultiSelectionPattern: (value: unknown[][] | null) => void;
  columnDefs: ColDef[];
  gridWrapperRef: React.RefObject<HTMLDivElement>;
  gridRef: React.RefObject<{
    api: { refreshCells: (params: unknown) => void };
  }>;
  showFillHandle: (event: CellEvent) => void;
  handleFillDrag: (event: CellEvent) => void;
  isDraggingFillRef: React.RefObject<boolean>;
  isSelectingRef: React.RefObject<boolean>;
  isLoadingMore?: boolean;
  setFillHandleVisible: (value: boolean) => void;
  setFillSourceCell: (value: FillSourceCell | null) => void;
  setFillSourceCellInfo: (value: FillSourceCellInfo | null) => void;
  stopAutoScroll: () => void;
}

export const useMouseHandlers = ({
  isSelecting,
  setIsSelecting,
  isDraggingFill,
  isDraggingCells,
  setIsDraggingCells,
  startCell,
  setStartCell,
  selectedCells,
  setSelectedCells,
  setMultiSelectionBounds,
  setMultiSelectionPattern,
  columnDefs,
  gridWrapperRef,
  gridRef,
  showFillHandle,
  handleFillDrag,
  isDraggingFillRef,
  isSelectingRef,
  isLoadingMore,
  setFillHandleVisible,
  setFillSourceCell,
  setFillSourceCellInfo,
  stopAutoScroll,
}: UseMouseHandlersProps) => {
  const clickStartTime = useRef<number>(0);

  // Hàm xử lý sự kiện chuột được nhấn xuống trên ô
  const handleMouseDown = useCallback(
    (event: CellEvent) => {
      // Kiểm tra xem sự kiện có chứa thông tin về rowIndex và colField hay không
      if (event.rowIndex != null && event.colDef?.field) {
        // Track click start time
        clickStartTime.current = Date.now();

        // Nếu đang drag fill, không xử lý mouse down
        if (isDraggingFill || isDraggingFillRef.current) {
          return;
        }

        // Tạo một ID duy nhất cho ô được nhấn (dựa trên rowIndex và colField)
        const cellId = `${event.rowIndex}-${event.colDef.field}`;

        // Lưu lại thông tin ô bắt đầu được chọn
        setStartCell({
          rowIndex: event.rowIndex,
          colField: event.colDef.field,
        });

        // Đánh dấu ô đầu tiên là đã chọn
        setSelectedCells(new Set([cellId]));

        // Force refresh cells to update selection styling immediately
        setTimeout(() => {
          if (gridRef?.current?.api) {
            gridRef.current.api.refreshCells({ force: true });
          }
        }, 0);

        // Bật trạng thái đang chọn (isSelecting = true)
        setIsSelecting(true);
        isSelectingRef.current = true;

        // Set attribute để interval có thể check
        if (gridWrapperRef.current) {
          gridWrapperRef.current.setAttribute("data-selecting", "true");
        }

        // Hiển thị fill handle cho cell được chọn ngay lập tức
        showFillHandle(event);

        // Reset multi-fill helpers at new selection start
        setMultiSelectionPattern(null);
        setMultiSelectionBounds(null);
      }
    },
    [
      isDraggingFill,
      isDraggingFillRef,
      setStartCell,
      setSelectedCells,
      setIsSelecting,
      isSelectingRef,
      gridWrapperRef,
      gridRef,
      showFillHandle,
      setMultiSelectionPattern,
      setMultiSelectionBounds,
    ]
  );

  // Hàm xử lý khi chuột di chuyển qua các ô trong khi đang chọn
  const handleMouseOver = useCallback(
    (event: CellEvent) => {
      // Nếu đang drag fill handle - xử lý fill drag
      if (isDraggingFill) {
        handleFillDrag(event);
        return; // Return sớm khi đang drag fill để tránh conflict
      }

      // Chỉ xử lý khi có startCell (đã mousedown) và event hợp lệ
      if (startCell && event.rowIndex != null && event.colDef?.field) {
        const currentCellId = `${event.rowIndex}-${event.colDef.field}`;
        const startCellId = `${startCell.rowIndex}-${startCell.colField}`;

        // Nếu di chuyển đến cell khác từ cell ban đầu, bắt đầu cell dragging mode
        if (currentCellId !== startCellId && !isDraggingCells) {
          setIsDraggingCells(true);
        }

        // Nếu đang drag cells hoặc vừa bắt đầu drag
        if (isDraggingCells || currentCellId !== startCellId) {
          // Lấy thông tin về ô bắt đầu và ô hiện tại
          const startRowIndex = startCell.rowIndex;
          const endRowIndex = event.rowIndex;
          const startColField = startCell.colField;
          const endColField = event.colDef.field;

          // Lấy danh sách các cột từ columnDefs để xác định thứ tự
          const columnOrder = columnDefs
            .map((col) => col.field) // Lấy `field` từ cột
            .filter((field): field is string => !!field); // Bỏ qua các cột không hợp lệ

          // Xác định vị trí của các cột bắt đầu và kết thúc
          const startColIndex = columnOrder.indexOf(startColField);
          const endColIndex = columnOrder.indexOf(endColField);

          // Nếu không tìm thấy cột, thoát khỏi hàm
          if (startColIndex === -1 || endColIndex === -1) return;

          // Tạo tập hợp các ô đã chọn
          const selectedCellsSet = new Set<string>();

          // Duyệt qua tất cả các hàng và cột nằm trong vùng được chọn
          for (
            let rowIndex = Math.min(startRowIndex, endRowIndex);
            rowIndex <= Math.max(startRowIndex, endRowIndex);
            rowIndex++
          ) {
            for (
              let colIndex = Math.min(startColIndex, endColIndex);
              colIndex <= Math.max(startColIndex, endColIndex);
              colIndex++
            ) {
              const colField = columnOrder[colIndex]; // Tên cột hiện tại
              selectedCellsSet.add(`${rowIndex}-${colField}`); // Thêm ID ô vào tập hợp
            }
          }

          // Cập nhật danh sách các ô đã chọn
          setSelectedCells(selectedCellsSet);

          // Cập nhật bounds cho multi-selection để hỗ trợ drag-fill nhiều ô
          const minRow = Math.min(startRowIndex, endRowIndex);
          const maxRow = Math.max(startRowIndex, endRowIndex);
          const minCol = Math.min(startColIndex, endColIndex);
          const maxCol = Math.max(startColIndex, endColIndex);
          setMultiSelectionBounds({
            startRow: minRow,
            endRow: maxRow,
            startColIndex: minCol,
            endColIndex: maxCol,
          });

          // Hiển thị fill handle cả khi chọn nhiều ô (đặt theo vị trí ô hiện tại)
          showFillHandle(event);
        }
      }
    },
    [
      isDraggingFill,
      handleFillDrag,
      startCell,
      isDraggingCells,
      setIsDraggingCells,
      columnDefs,
      setSelectedCells,
      setMultiSelectionBounds,
      showFillHandle,
    ]
  );

  const handleMouseUp = useCallback(() => {
    const clickDuration = Date.now() - clickStartTime.current;
    const isQuickClick = clickDuration < 200 && !isDraggingCells; // Quick click under 200ms without dragging

    // Reset cell dragging state
    if (isDraggingCells) {
      setIsDraggingCells(false);
    }

    // Reset selection state nếu đang active
    if (isSelecting) {
      stopAutoScroll();

      // LUÔN LUÔN delay việc reset isSelecting để không interrupt row selection
      const delay = isQuickClick ? 100 : 50; // Tăng delay cho quick click
      setTimeout(() => {
        setIsSelecting(false);
        isSelectingRef.current = false;

        // Clear attributes
        if (gridWrapperRef.current) {
          gridWrapperRef.current.removeAttribute("data-selecting");
        }
      }, delay);
    }

    // Delay việc clear startCell để preserve fill handle hiển thị
    if (startCell) {
      if (selectedCells.size > 1) {
        // Multi-cell selection - delay clear để preserve fill handle
        setTimeout(() => {
          setStartCell(null);
        }, 100);
      } else {
        // Single cell selection - delay ngắn hoặc ngay nếu là quick click
        const delay = isQuickClick ? 10 : 50;
        setTimeout(() => {
          setStartCell(null);
        }, delay);
      }
    }
  }, [
    isDraggingCells,
    setIsDraggingCells,
    isSelecting,
    stopAutoScroll,
    setIsSelecting,
    isSelectingRef,
    gridWrapperRef,
    startCell,
    selectedCells.size,
    setStartCell,
  ]);

  // Hàm xử lý khi người dùng click ra ngoài bảng
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      // THÊM: Không reset selection states khi đang loading more data
      if (isLoadingMore) {
        return;
      }

      // Cải thiện detection: kiểm tra tất cả các AG Grid elements
      const clickTarget = event.target as HTMLElement;
      const isInsideGrid =
        gridWrapperRef.current?.contains(clickTarget) ||
        clickTarget?.closest?.(".ag-grid") ||
        clickTarget?.closest?.(".ag-root-wrapper") ||
        clickTarget?.closest?.(".ag-body-viewport") ||
        clickTarget?.closest?.(".ag-row");

      // Nếu click không nằm trong vùng bảng
      if (gridWrapperRef.current && !isInsideGrid) {
        // Reset chỉ CELL selection states, KHÔNG ảnh hưởng row selection
        setFillHandleVisible(false);
        setFillSourceCell(null);
        setFillSourceCellInfo(null);
        setIsSelecting(false);
        isSelectingRef.current = false;
        setIsDraggingCells(false);
        setStartCell(null);

        // Clear attributes
        if (gridWrapperRef.current) {
          gridWrapperRef.current.removeAttribute("data-selecting");
          gridWrapperRef.current.removeAttribute("data-dragging");
        }
      }
    },
    [
      isLoadingMore,
      gridWrapperRef,
      setFillHandleVisible,
      setFillSourceCell,
      setFillSourceCellInfo,
      setIsSelecting,
      isSelectingRef,
      setIsDraggingCells,
      setStartCell,
    ]
  );

  return {
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    handleClickOutside,
  };
};
