/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorCellRenderer from "@/components/basicUI/cTableAG/ErrorCellRenderer";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  CellClassParams,
  CellEditingStartedEvent,
  CellStyle,
  CellValueChangedEvent,
  ColDef,
  ModuleRegistry,
  RowDoubleClickedEvent,
} from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./index.scss";
import ActionButtons, { ActionButtonsProps } from "@/components/action-button";
import InputSearch, {
  InputSearchProps,
} from "@/components/basicUI/InputSearch";
import { excelUtils } from "@/utils/client/importExport/excelUtils";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { Pagination } from "antd";
import Dropdown from "antd/es/dropdown/dropdown";
import { Tooltip } from "antd/lib";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import FilterArrayModal from "./FilterArrayModal";
import { getItemId } from "@/utils/client/validationHelpers";
import usePasteHandler from "@/utils/client/usePasteHandler";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
]);

// Import ActionButtonsProps type for prop spreading
interface AgGridComponentProps {
  rowData: any[];
  columnDefs: ColDef[];
  onCellValueChanged?: (event: CellValueChangedEvent) => void; //Edit table
  onCellEditingStarted?: (event: CellEditingStartedEvent) => void; //Edit table
  onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void;
  onSelectionChanged?: () => void; // Add onSelectionChanged prop
  gridRef: React.RefObject<AgGridReact<any> | null>;
  maxRowsVisible?: number; // Prop to limit the number of visible rows
  columnFlex?: number; // New prop to allow users to define flex
  rowSelection?: "single" | "multiple";
  rownumber?: boolean;
  gridOptions?: any;
  pinnedBottomRowData?: any[];
  getRowStyle?: any;
  headerHeight?: any;
  sideBar?: any;
  onGridReady?: (params: any) => void; // Thêm prop onGridReady
  loading?: boolean; // Prop để quản lý trạng thái loading
  enableFilter?: boolean;
  showSTT?: boolean; // Add new prop to control STT visibility
  pivotMode?: boolean;
  defaultColDef?: ColDef;
  onRowSelected?: (event: any) => void;
  onColumnHeaderClicked?: (event: any) => void;
  domLayout?: string;
  onRowClicked?: (event: any) => void;
  getRowClass?: (params: any) => string;
  // Search feature controls
  showSearch?: boolean;
  // Instead of listing individual props, use InputSearchProps for search component
  inputSearchProps?: Partial<InputSearchProps>;

  // Action buttons controls and props
  showActionButtons?: boolean;
  actionButtonsProps?: Partial<ActionButtonsProps>;

  // Export Excel properties
  showExportExcel?: boolean;
  exportFileName?: string;
  exportDecorated?: boolean;
  importComponent?: React.ReactNode;
  pagination?: boolean;
  paginationPageSize?: number;
  paginationCurrentPage?: number;
  onChangePage?: (page: number, pageSize: number) => void;
  onQuicksearch?: (
    searchText: string,
    showFilterModal: any[],
    filterValues: string,
    pageSize: number
  ) => void; // Thêm prop onQuicksearch để xử lý tìm kiếm nhanh
  total?: number; // Thêm prop total để custom tổng số dòng
  onFillChanges?: (
    changes: { id: string; data: Record<string, any> }[]
  ) => void; // Prop để xử lý fill operation
  // Infinite scroll props
  enableInfiniteScroll?: boolean; // Bật tính năng infinite scroll
  onLoadMore?: (currentPage: number, pageSize: number) => void; // Callback khi cần load thêm dữ liệu
  hasMore?: boolean; // Có còn dữ liệu để load thêm hay không
  infiniteScrollThreshold?: number; // Khoảng cách từ cuối để trigger load more (default: 100px)
}

const AgGridComponent: React.FC<AgGridComponentProps> = ({
  rowData,
  columnDefs,
  onCellValueChanged,
  onCellEditingStarted,
  onRowDoubleClicked,
  onSelectionChanged,
  onRowSelected,
  gridRef,
  getRowStyle,
  maxRowsVisible = 11,
  columnFlex = 0,
  rowSelection = "multiple",
  gridOptions = {},
  pinnedBottomRowData = [],
  headerHeight,
  sideBar = {},
  loading = false,
  enableFilter = true,
  showSTT = true,
  pivotMode = false,
  onGridReady,
  onColumnHeaderClicked,
  domLayout = "normal" as "normal" | "autoHeight" | "print",
  onRowClicked = () => {},
  getRowClass = () => "",
  // Search props
  showSearch = false,
  inputSearchProps = {},
  // Action button props
  showActionButtons = false,
  actionButtonsProps = {},
  // Excel export props
  showExportExcel = true,
  exportFileName = "Dữ-liệu-bảng",
  exportDecorated = true,
  importComponent,
  pagination = false, // Thêm default value cho pagination
  paginationPageSize = 10,
  paginationCurrentPage = 1,
  onChangePage,
  onQuicksearch,
  total,
  onFillChanges,
  // Infinite scroll props
  enableInfiniteScroll = false,
  onLoadMore,
  hasMore = false,
  infiniteScrollThreshold = 100,
}) => {
  const t = useTranslations("AgGridComponent");
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDraggingCells, setIsDraggingCells] = useState(false); // Thêm state để track cell dragging
  const [clickStartTime, setClickStartTime] = useState<number>(0); // Track click time
  const [infiniteScrollDebounceTimer, setInfiniteScrollDebounceTimer] =
    useState<NodeJS.Timeout | null>(null); // Debounce timer cho infinite scroll
  // Add state for filter modal
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilterColumns, setSelectedFilterColumns] = useState<string[]>(
    columnDefs.map((col) => col.field || "")
  );
  const [filterValues, setFilterValues] = useState<string>("");
  const [originalRowData, setOriginalRowData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [importDropdownOpen, setImportDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(paginationCurrentPage);
  const [pageSize, setPageSize] = useState(paginationPageSize);

  // Infinite scroll states
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [maxReachedPage, setMaxReachedPage] = useState(paginationCurrentPage); // Track highest page reached

  // Sync internal state with props when they change
  useEffect(() => {
    setCurrentPage(paginationCurrentPage);
  }, [paginationCurrentPage]);

  useEffect(() => {
    setPageSize(paginationPageSize);
  }, [paginationPageSize]);

  useEffect(() => {
    setMaxReachedPage(Math.max(maxReachedPage, paginationCurrentPage));
  }, [paginationCurrentPage, maxReachedPage]);

  // Reset infinite scroll when data changes
  useEffect(() => {
    if (enableInfiniteScroll) {
      setMaxReachedPage(1);
      setIsLoadingMore(false);

      // THÊM: Khi data thay đổi do infinite scroll, preserve current selection states
      // chỉ reset các selection states khi thực sự cần thiết (không phải do load more)
      if (!isLoadingMore && !isSelecting) {
        // THÊM: && !isSelecting để tránh interrupt row selection
        // Chỉ reset khi không phải đang load more và không đang selecting
        // console.log(
        //   "Resetting selection states due to data change (not load more)"
        // );
      } else if (isSelecting) {
        // console.log("Skipping selection state reset - currently selecting");
      }
    }
  }, [
    rowData,
    filteredData,
    isFiltered,
    enableInfiniteScroll,
    isLoadingMore,
    isSelecting,
  ]); // THÊM isSelecting dependency

  // Fill handle states
  const [fillHandleVisible, setFillHandleVisible] = useState(false);
  const [fillHandlePosition, setFillHandlePosition] = useState<{
    top: number | undefined;
    left: number | undefined;
  }>({
    top: undefined,
    left: undefined,
  });

  const lastCalculateTime = useRef(0);

  const [fillSourceCell, setFillSourceCell] = useState<{
    rowIndex: number;
    colField: string;
    value: any;
  } | null>(null);
  const [fillSourceCellInfo, setFillSourceCellInfo] = useState<{
    rowIndex: number;
    colField: string;
    cellElement: HTMLElement | null;
  } | null>(null);
  const [isDraggingFill, setIsDraggingFill] = useState(false);
  const [fillTargetCells, setFillTargetCells] = useState<Set<string>>(
    new Set()
  );
  // Multi-selection fill support
  const [multiSelectionBounds, setMultiSelectionBounds] = useState<{
    startRow: number;
    endRow: number;
    startColIndex: number;
    endColIndex: number;
  } | null>(null);
  const [multiSelectionPattern, setMultiSelectionPattern] = useState<
    any[][] | null
  >(null);

  // Auto-scroll states for fill handle
  const [autoScrollInterval, setAutoScrollInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Refs để track state real-time trong intervals
  const isDraggingFillRef = useRef(false);
  const isSelectingRef = useRef(false);

  // Initialize usePasteHandler để xử lý paste và fill operations
  const { handleFillChanges: pasteHandlerFillChanges } = usePasteHandler(
    () => (isFiltered ? filteredData : rowData),
    (newData) => {
      if (isFiltered) {
        setFilteredData(newData);
      }
      // Note: Không cần setRowData vì rowData là prop từ parent
    },
    gridRef,
    () => {}, // onValuesChanged sẽ được xử lý bởi onFillChanges prop
    onFillChanges // Kết nối với onFillChanges prop
  );

  const getColumnOrder = useCallback(() => {
    return columnDefs
      .map((col) => col.field)
      .filter((field): field is string => !!field);
  }, [columnDefs]);

  // Update total rows and store original row data when rowData prop changes
  useEffect(() => {
    // Preserve scroll position before data update
    let scrollPosition = null;
    if (gridRef.current?.api) {
      const viewport = gridRef.current.api.getVerticalPixelRange();
      if (viewport) {
        scrollPosition = viewport.top;
      }
    }

    // Only update original data if we're not in filtered state or if this is first load
    if (!isFiltered || originalRowData.length === 0) {
      setOriginalRowData([...rowData]);
    }

    // Restore scroll position after data update
    if (scrollPosition !== null && gridRef.current?.api) {
      setTimeout(() => {
        if (gridRef.current?.api) {
          gridRef.current.api.ensureIndexVisible(
            Math.floor(scrollPosition / 40),
            "top"
          );
        }
      }, 50);
    }
  }, [rowData, isFiltered, originalRowData.length]);

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
    // Thêm window scroll event để đảm bảo bắt được mọi scroll
    window.addEventListener("scroll", updateFillHandlePosition);

    // Thêm listener cho tất cả các element có thể scroll
    const allScrollableElements = gridContainer?.querySelectorAll(
      '[style*="overflow"], [class*="scroll"]'
    );
    allScrollableElements?.forEach((element) => {
      element.addEventListener("scroll", updateFillHandlePosition);
    });

    // Thêm listener cho các AG Grid specific containers
    const gridBody = gridContainer?.querySelector(".ag-body");
    const gridCenter = gridContainer?.querySelector(
      ".ag-center-cols-container"
    );
    const centerViewport = gridContainer?.querySelector(
      ".ag-center-cols-viewport"
    );
    const gridHeader = gridContainer?.querySelector(".ag-header-viewport");

    if (gridBody) {
      gridBody.addEventListener("scroll", updateFillHandlePosition);
    }
    if (gridCenter) {
      gridCenter.addEventListener("scroll", updateFillHandlePosition);
    }
    if (centerViewport) {
      centerViewport.addEventListener("scroll", updateFillHandlePosition);
    }
    if (gridHeader) {
      gridHeader.addEventListener("scroll", updateFillHandlePosition);
    }

    // Thêm wheel event để bắt scroll ngang
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        updateFillHandlePosition();
      }
    };

    if (gridContainer) {
      gridContainer.addEventListener("wheel", handleWheel, { passive: true });
    }

    // Thêm ResizeObserver để theo dõi thay đổi kích thước
    const resizeObserver = new ResizeObserver(() => {
      updateFillHandlePosition();
    });

    if (gridContainer) {
      resizeObserver.observe(gridContainer);
    }

    // Thêm MutationObserver để theo dõi thay đổi DOM
    const mutationObserver = new MutationObserver(() => {
      updateFillHandlePosition();
    });

    if (gridContainer) {
      mutationObserver.observe(gridContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    // Thêm continuous update loop cho scroll ngang (chỉ khi fill handle visible)
    let animationId: number;
    let lastScrollLeft = 0;
    let lastScrollTop = 0;

    const continuousUpdate = () => {
      if (fillHandleVisible && fillSourceCellInfo) {
        // Kiểm tra scroll position changes trên nhiều container
        const gridViewport =
          gridWrapperRef.current?.querySelector(".ag-body-viewport");
        const centerViewport = gridWrapperRef.current?.querySelector(
          ".ag-center-cols-viewport"
        );
        const gridBody = gridWrapperRef.current?.querySelector(".ag-body");

        const currentScrollLeft =
          centerViewport?.scrollLeft ||
          gridViewport?.scrollLeft ||
          gridBody?.scrollLeft ||
          0;
        const currentScrollTop =
          gridViewport?.scrollTop || gridBody?.scrollTop || 0;

        if (
          currentScrollLeft !== lastScrollLeft ||
          currentScrollTop !== lastScrollTop
        ) {
          updateFillHandlePosition();
          lastScrollLeft = currentScrollLeft;
          lastScrollTop = currentScrollTop;
        }
      }
      animationId = requestAnimationFrame(continuousUpdate);
    };
    animationId = requestAnimationFrame(continuousUpdate);

    return () => {
      if (gridViewport) {
        gridViewport.removeEventListener("scroll", updateFillHandlePosition);
      }
      if (gridContainer) {
        gridContainer.removeEventListener("scroll", updateFillHandlePosition);
        gridContainer.removeEventListener("wheel", handleWheel);

        // Remove listeners từ tất cả scrollable elements
        const allScrollableElements = gridContainer.querySelectorAll(
          '[style*="overflow"], [class*="scroll"]'
        );
        allScrollableElements.forEach((element) => {
          element.removeEventListener("scroll", updateFillHandlePosition);
        });

        // Remove listeners từ AG Grid specific containers
        const gridBody = gridContainer.querySelector(".ag-body");
        const gridCenter = gridContainer.querySelector(
          ".ag-center-cols-container"
        );
        const centerViewport = gridContainer.querySelector(
          ".ag-center-cols-viewport"
        );
        const gridHeader = gridContainer.querySelector(".ag-header-viewport");

        if (gridBody) {
          gridBody.removeEventListener("scroll", updateFillHandlePosition);
        }
        if (gridCenter) {
          gridCenter.removeEventListener("scroll", updateFillHandlePosition);
        }
        if (centerViewport) {
          centerViewport.removeEventListener(
            "scroll",
            updateFillHandlePosition
          );
        }
        if (gridHeader) {
          gridHeader.removeEventListener("scroll", updateFillHandlePosition);
        }
      }
      window.removeEventListener("scroll", updateFillHandlePosition);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [fillHandleVisible, fillSourceCellInfo, isDraggingFill]);

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
  ]);

  // Đảm bảo fill handle được hiển thị khi có selectedCells
  useEffect(() => {
    if (selectedCells.size > 0 && !fillHandleVisible && fillSourceCell) {
      // Nếu có ô được chọn nhưng fill handle không hiển thị, hiển thị lại
      setFillHandleVisible(true);
    }
  }, [selectedCells, fillHandleVisible, fillSourceCell]);

  // Đảm bảo fill handle được hiển thị khi có selectedCells và fillSourceCellInfo
  useEffect(() => {
    if (selectedCells.size > 0 && fillSourceCellInfo && !fillHandleVisible) {
      // Hiển thị fill handle nếu có ô được chọn và thông tin cell
      setFillHandleVisible(true);
    }
  }, [selectedCells, fillSourceCellInfo, fillHandleVisible]);

  // Đảm bảo fill handle được hiển thị khi có selectedCells
  useEffect(() => {
    if (selectedCells.size > 0 && !fillHandleVisible) {
      // Nếu có ô được chọn nhưng fill handle không hiển thị, hiển thị lại
      const lastSelectedCell = Array.from(selectedCells)[0];
      const [rowIndex, colField] = lastSelectedCell.split("-");
      if (
        rowIndex &&
        colField &&
        fillSourceCellInfo?.cellElement &&
        gridWrapperRef.current
      ) {
        const cellElement = fillSourceCellInfo.cellElement;
        const rect = cellElement.getBoundingClientRect();
        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        setFillHandlePosition({
          top: rect.bottom - gridRect.top - 5,
          left: rect.right - gridRect.left - 5,
        });
        setFillHandleVisible(true);
      }
    }
  }, [selectedCells, fillHandleVisible, fillSourceCellInfo]);

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
  }, [fillHandleVisible, fillSourceCellInfo, isDraggingFill]);

  // Quản lý trạng thái loading khi nhận props mới
  const [startCell, setStartCell] = useState<{
    rowIndex: number;
    colField: string;
  } | null>(null);

  // Function to apply filters from the modal (improved)
  const applyFilters = (selectedColumns: string[], values: string[]) => {
    // If no columns selected or no values provided, reset to original data
    if (selectedColumns.length === 0 || values.length === 0) {
      setFilteredData([]);
      setIsFiltered(false);
      // If grid reference exists, update the grid data
      if (gridRef.current?.api) {
        gridRef.current.api.applyTransaction({ update: originalRowData });
      }
      return;
    }

    // Filter the data based on selected columns and values
    const newFilteredData = originalRowData.filter((row) => {
      // For each row, check if any of the selected columns contain any of the filter values
      return selectedColumns.some((column) => {
        if (row[column] === undefined || row[column] === null) return false;

        // Get the cell value - this could be a direct value or something that needs label lookup
        const cellValue = String(row[column]).toLowerCase();
        let cellLabel = cellValue;

        // Check if this is a field with value/label pairs in column definitions
        const colDef = columnDefs.find((col) => col.field === column);
        if (
          colDef &&
          colDef.cellEditorParams &&
          typeof colDef.cellEditorParams === "object"
        ) {
          const params = colDef.cellEditorParams as any;
          if (params.values && Array.isArray(params.values)) {
            // Find matching option to get the label
            const option = params.values.find(
              (opt: any) => opt.value === row[column] || opt === row[column]
            );
            if (option) {
              // If the option has a label property, use it for searching
              if (option.label) {
                cellLabel = option.label.toLowerCase();
              }
            }
          }
        }

        // Check if any filter value is included in the cell value or cell label
        return values.some((value) => {
          const trimmedValue = value.trim().toLowerCase();
          return (
            trimmedValue !== "" &&
            (cellValue.includes(trimmedValue) ||
              cellLabel.includes(trimmedValue))
          );
        });
      });
    });

    // Update the filtered data state
    setFilteredData(newFilteredData);
    setIsFiltered(true);

    // If grid reference exists, update the grid data
    if (gridRef.current?.api) {
      // Preserve scroll position before applying transaction
      const viewport = gridRef.current.api.getVerticalPixelRange();
      const scrollTop = viewport ? viewport.top : 0;

      gridRef.current.api.applyTransaction({ update: newFilteredData });

      // Restore scroll position after transaction
      setTimeout(() => {
        if (gridRef.current?.api) {
          gridRef.current.api.ensureIndexVisible(
            Math.floor(scrollTop / 40),
            "top"
          );
          gridRef.current?.api?.refreshCells({
            columns: [""],
            force: true,
          });
        }
      }, 100);
    }
  };

  // Function to handle opening the filter modal
  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  // Function to handle closing the filter modal
  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  // Function to handle filter application from the modal
  const handleApplyFilter = (selectedColumns: string[], filterText: string) => {
    setSelectedFilterColumns(selectedColumns);
    setFilterValues(filterText);

    // Convert multi-line text to array of values, filtering out empty lines
    const values = filterText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    // Apply the filters
    applyFilters(selectedColumns, values);

    // Close the modal
    handleCloseFilterModal();
  };

  // Function to reset filters
  const handleResetFilters = () => {
    setSelectedFilterColumns([]);
    setFilterValues("");
    setFilteredData([]);
    setIsFiltered(false);

    if (gridRef.current?.api) {
      // Preserve scroll position before resetting
      const viewport = gridRef.current.api.getVerticalPixelRange();
      const scrollTop = viewport ? viewport.top : 0;

      setTimeout(() => {
        if (gridRef.current?.api) {
          gridRef.current.api.ensureIndexVisible(
            Math.floor(scrollTop / 40),
            "top"
          );
          gridRef.current?.api?.refreshCells({
            columns: [""],
            force: true,
          });
        }
      }, 100);
    }

    if (gridRef.current?.api) {
      gridRef.current.api.applyTransaction({ update: originalRowData });
    }
  };

  // Hàm xử lý sự kiện Grid Ready
  // Hàm xử lý sự kiện chuột được nhấn xuống trên ô
  const handleMouseDown = (event: any) => {
    // Kiểm tra xem sự kiện có chứa thông tin về rowIndex và colField hay không
    if (event.rowIndex != null && event.colDef?.field) {
      // Track click start time
      setClickStartTime(Date.now());

      // Debug logging
      // console.log("handleMouseDown triggered", {
      //   rowIndex: event.rowIndex,
      //   field: event.colDef.field,
      //   isDraggingFill: isDraggingFill,
      //   isSelecting: isSelecting,
      // });

      // Nếu đang drag fill, không xử lý mouse down
      if (isDraggingFill || isDraggingFillRef.current) {
        // console.log("Blocked handleMouseDown - currently dragging fill");
        return;
      }

      // Tạo một ID duy nhất cho ô được nhấn (dựa trên rowIndex và colField)
      const cellId = `${event.rowIndex}-${event.colDef.field}`;

      // Lưu lại thông tin ô bắt đầu được chọn
      setStartCell({ rowIndex: event.rowIndex, colField: event.colDef.field });

      // Đánh dấu ô đầu tiên là đã chọn
      setSelectedCells(new Set([cellId]));

      // Bật trạng thái đang chọn (isSelecting = true) - giữ nguyên như yêu cầu
      setIsSelecting(true);
      isSelectingRef.current = true;

      // Set attribute để interval có thể check
      if (gridWrapperRef.current) {
        gridWrapperRef.current.setAttribute("data-selecting", "true");
      }

      // Hiển thị fill handle cho cell được chọn ngay lập tức
      showFillHandle(event);

      // Đảm bảo fill handle được hiển thị ngay lập tức
      setFillHandleVisible(true);

      // Cập nhật vị trí fill handle
      const cellElement = event.event?.target?.closest(".ag-cell");
      if (cellElement && gridWrapperRef.current) {
        const rect = cellElement.getBoundingClientRect();
        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        setFillHandlePosition({
          top: rect.bottom - gridRect.top - 5,
          left: rect.right - gridRect.left - 5,
        });
      }

      // Reset multi-fill helpers at new selection start
      setMultiSelectionPattern(null);
      setMultiSelectionBounds(null);
    }
  };

  // Hàm xử lý khi chuột di chuyển qua các ô trong khi đang chọn
  const handleMouseOver = (event: any) => {
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
        // console.log("Starting cell dragging mode");
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
  };

  const handleMouseUp = () => {
    const clickDuration = Date.now() - clickStartTime;
    const isQuickClick = clickDuration < 200 && !isDraggingCells; // Quick click under 200ms without dragging

    // console.log("handleMouseUp triggered", {
    //   isDraggingFill: isDraggingFill,
    //   isSelecting: isSelecting,
    //   isDraggingCells: isDraggingCells,
    //   hasStartCell: !!startCell,
    //   selectedCellsCount: selectedCells.size,
    //   clickDuration: clickDuration,
    //   isQuickClick: isQuickClick,
    // });

    // Xử lý fill handle mouse up trước
    if (isDraggingFill) {
      // console.log("Processing fill mouse up");
      handleFillMouseUp();
      return; // Return sớm để tránh conflict với selection logic
    }

    // Reset cell dragging state
    if (isDraggingCells) {
      // console.log("Resetting cell dragging state");
      setIsDraggingCells(false);
    }

    // Reset selection state nếu đang active
    if (isSelecting) {
      // console.log("Resetting multi-cell selection state");
      stopAutoScroll();

      // LUÔN LUÔN delay việc reset isSelecting để không interrupt row selection
      // Bất kể quick click hay không, AG Grid cần thời gian để process row selection
      const delay = isQuickClick ? 100 : 50; // Tăng delay cho quick click
      setTimeout(() => {
        // console.log(`Delayed reset isSelecting after ${delay}ms`);
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
          // console.log("Clearing start cell after multi-selection");
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

    // KHÔNG clear selectedCells ở đây - để cho AG Grid quản lý row selection
  };

  // Hàm xử lý khi người dùng click ra ngoài bảng
  const handleClickOutside = (event: MouseEvent) => {
    // THÊM: Không reset selection states khi đang loading more data
    if (isLoadingMore) {
      // console.log(
      //   "Skipping click outside handling during infinite scroll loading"
      // );
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
      // console.log("Click outside detected - resetting states");

      // Reset chỉ CELL selection states, KHÔNG ảnh hưởng row selection
      setFillHandleVisible(false);
      setFillSourceCell(null);
      setFillSourceCellInfo(null);
      setIsSelecting(false);
      isSelectingRef.current = false;
      setIsDraggingFill(false);
      isDraggingFillRef.current = false;
      setIsDraggingCells(false);
      setStartCell(null);

      // QUAN TRỌNG: Không clear selectedCells ở đây để preserve cell selection
      // setSelectedCells(new Set()); // <- COMMENT OUT để không clear AG Grid row selection

      // Clear attributes
      if (gridWrapperRef.current) {
        gridWrapperRef.current.removeAttribute("data-selecting");
        gridWrapperRef.current.removeAttribute("data-dragging");
      }
    }
  };

  // Hàm hiển thị fill handle khi có ô được chọn
  const showFillHandle = useCallback(
    (event: any) => {
      // Kiểm tra nếu đang trong trạng thái drag fill thì không xử lý
      if (isDraggingFill || isDraggingFillRef.current) {
        return;
      }

      if (event.rowIndex != null && event.colDef?.field) {
        const cellElement = event.event?.target?.closest(".ag-cell");

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
            value: event.data[event.colDef.field],
          });
          setFillSourceCellInfo({
            rowIndex: event.rowIndex,
            colField: event.colDef.field,
            cellElement: cellElement,
          });

          // Hiển thị fill handle với delay nhỏ để tránh bị ẩn ngay lập tức
          setTimeout(() => {
            setFillHandleVisible(true);
          }, 10);

          // Đảm bảo ô được thêm vào selectedCells nếu chưa có
          const cellId = `${event.rowIndex}-${event.colDef.field}`;
          if (!selectedCells.has(cellId)) {
            setSelectedCells(
              (prev) => new Set(Array.from(prev).concat(cellId))
            );
          }
        }
      }
    },
    [isDraggingFill, selectedCells]
  );

  // Hàm xử lý khi bắt đầu drag fill handle
  const handleFillMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Đảm bảo fill handle vẫn hiển thị khi bắt đầu drag
    if (!fillHandleVisible) {
      setFillHandleVisible(true);
    }

    // Không cần tính offset vì fill handle không di chuyển theo chuột

    // Set drag state
    setIsDraggingFill(true);
    isDraggingFillRef.current = true;
    setFillTargetCells(new Set());

    // Đảm bảo không bị conflict với selection state - nhưng không tắt ngay lập tức
    if (isSelecting) {
      // Delay việc tắt isSelecting để tránh conflict
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
    if (selectedCells.size > 1) {
      const bounds = multiSelectionBounds;
      if (!bounds) return;
      const dataSource = isFiltered ? filteredData : rowData;
      const columnOrder = getColumnOrder();
      const pattern: any[][] = [];
      for (let r = bounds.startRow; r <= bounds.endRow; r++) {
        const rowArr: any[] = [];
        for (let c = bounds.startColIndex; c <= bounds.endColIndex; c++) {
          const field = columnOrder[c];
          rowArr.push(dataSource?.[r]?.[field]);
        }
        pattern.push(rowArr);
      }
      setMultiSelectionPattern(pattern);
    }
  };

  // Hàm xử lý auto-scroll khi drag fill handle
  const handleAutoScroll = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!gridWrapperRef.current || (!isDraggingFill && !isSelecting)) {
        return;
      }

      // Lấy tất cả các container có thể scroll
      const gridViewport = gridWrapperRef.current.querySelector(
        ".ag-body-viewport"
      ) as HTMLElement;
      const centerViewport = gridWrapperRef.current.querySelector(
        ".ag-center-cols-viewport"
      ) as HTMLElement;

      if (!gridViewport) {
        return;
      }

      const scrollStep = 4; // Bước cuộn mỗi lần (giảm để mượt hơn)
      const scrollInterval = 8; // Thời gian giữa các lần cuộn (ms) - nhanh hơn

      // Dừng interval cũ nếu có
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        setAutoScrollInterval(null);
      }

      const interval = setInterval(() => {
        if (!isDraggingFillRef.current && !isSelectingRef.current) {
          clearInterval(interval);
          setAutoScrollInterval(null);
          return;
        }

        // Kiểm tra xem có thể scroll thêm không
        let canScroll = false;
        switch (direction) {
          case "up":
            canScroll = gridViewport.scrollTop > 0;
            if (canScroll) {
              // Sử dụng DOM manipulation để kiểm soát tốt hơn
              const newScrollTop = Math.max(
                0,
                gridViewport.scrollTop - scrollStep
              );
              gridViewport.scrollTop = newScrollTop;
            }
            break;
          case "down":
            const maxScrollTop =
              gridViewport.scrollHeight - gridViewport.clientHeight;
            canScroll = gridViewport.scrollTop < maxScrollTop;
            if (canScroll) {
              const newScrollTop = Math.min(
                maxScrollTop,
                gridViewport.scrollTop + scrollStep
              );
              gridViewport.scrollTop = newScrollTop;
            }
            break;
          case "left":
            // Scroll ngang trái - ưu tiên centerViewport
            const leftScrollContainer = centerViewport || gridViewport;
            canScroll =
              leftScrollContainer && leftScrollContainer.scrollLeft > 0;

            if (canScroll) {
              const newScrollLeft = Math.max(
                0,
                leftScrollContainer.scrollLeft - scrollStep
              );
              leftScrollContainer.scrollLeft = newScrollLeft;
            }
            break;
          case "right":
            // Scroll ngang phải - ưu tiên centerViewport
            const rightScrollContainer = centerViewport || gridViewport;
            const maxScrollLeft = rightScrollContainer
              ? rightScrollContainer.scrollWidth -
                rightScrollContainer.clientWidth
              : 0;
            canScroll =
              rightScrollContainer &&
              rightScrollContainer.scrollLeft < maxScrollLeft;

            if (canScroll) {
              const newScrollLeft = Math.min(
                maxScrollLeft,
                rightScrollContainer.scrollLeft + scrollStep
              );
              rightScrollContainer.scrollLeft = newScrollLeft;
            }
            break;
        }

        // Nếu không thể scroll thêm, dừng interval
        if (!canScroll) {
          clearInterval(interval);
          setAutoScrollInterval(null);
        }
      }, scrollInterval);

      setAutoScrollInterval(interval);
    },
    [isDraggingFill, isSelecting, autoScrollInterval]
  );

  // Hàm dừng auto-scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }

    // KHÔNG reset refs ở đây vì stopAutoScroll có thể được gọi khi chuột ra khỏi vùng scroll
    // nhưng vẫn đang trong quá trình drag/select
    // Refs chỉ nên được reset khi thực sự kết thúc drag/select operations
  }, [autoScrollInterval]);

  // Hàm xử lý auto-scroll dựa trên vị trí chuột
  const handleAutoScrollByMousePosition = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!gridWrapperRef.current || (!isDraggingFill && !isSelecting)) {
        return;
      }

      const gridRect = gridWrapperRef.current.getBoundingClientRect();
      const scrollThreshold = 50; // Giảm threshold để nhạy hơn

      // Kiểm tra vị trí chuột so với khung grid
      const isNearTop = mouseY - gridRect.top < scrollThreshold;
      const isNearBottom = gridRect.bottom - mouseY < scrollThreshold;
      const isNearLeft = mouseX - gridRect.left < scrollThreshold;
      const isNearRight = gridRect.right - mouseX < scrollThreshold;

      // Dừng auto-scroll nếu chuột không ở gần viền
      if (!isNearTop && !isNearBottom && !isNearLeft && !isNearRight) {
        stopAutoScroll();
      } else {
        // Bắt đầu auto-scroll theo hướng tương ứng (dựa vào vị trí chuột)
        if (isNearTop) {
          handleAutoScroll("up");
        } else if (isNearBottom) {
          handleAutoScroll("down");
        } else if (isNearLeft) {
          handleAutoScroll("left");
        } else if (isNearRight) {
          handleAutoScroll("right");
        }
      }
    },
    [
      isDraggingFill,
      isSelecting,
      handleAutoScroll,
      stopAutoScroll,
      autoScrollInterval,
    ]
  );

  // Hàm tính toán fill target cells dựa trên vị trí chuột
  const calculateFillTargetCells = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!isDraggingFill || !gridWrapperRef.current) return;

      // Throttle để tránh tính toán quá nhiều lần (giảm để mượt hơn)
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

      // Khôi phục pointer events của fill-handle
      if (fillHandleElement) {
        fillHandleElement.style.pointerEvents = originalPointerEvents || "";
      }

      let targetRowIndex: number;
      let targetColField: string;

      if (elementAtPoint) {
        // Tìm cell element gần nhất
        const cellElement = elementAtPoint.closest(".ag-cell");
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

        // Tìm column dựa trên vị trí X (cần cải thiện logic này)
        const columnOrder = getColumnOrder();
        if (columnOrder.length === 0) return;

        // Ước tính column index (có thể cần điều chỉnh)
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
    ]
  );

  // Global mouse move handler cho auto-scroll và fill handle drag
  const handleGlobalMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDraggingFill || isSelecting) {
        handleAutoScrollByMousePosition(event.clientX, event.clientY);

        // Chỉ tính toán fill target cells, KHÔNG di chuyển fill handle
        if (isDraggingFill) {
          calculateFillTargetCells(event.clientX, event.clientY);
        }
      }
    },
    [
      isDraggingFill,
      isSelecting,
      handleAutoScrollByMousePosition,
      calculateFillTargetCells,
    ]
  );

  // Hàm xử lý khi drag fill handle qua các cell
  const handleFillDrag = (event: any) => {
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
    }
  };

  // Hàm xử lý khi kết thúc drag fill handle
  const handleFillMouseUp = async () => {
    // Dừng auto-scroll khi kết thúc drag
    stopAutoScroll();

    if (isDraggingFill && fillTargetCells.size > 0) {
      const newRowData = [...(isFiltered ? filteredData : rowData)];
      const changes: { id: string; data: Record<string, any> }[] = [];
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
              Array.isArray(colDef.cellEditorParams.values)
            ) {
              const options = colDef.cellEditorParams.values;
              // Nếu là select mà options rỗng thì không cho fill
              if (options.length === 0) {
                isValid = false;
              } else {
                isValid = options.some(
                  (opt: any) =>
                    (typeof opt === "object" ? opt.value : opt) === newValue
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

          // BỎ QUA Ô GÓC (ô bắt đầu fill)
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
            Array.isArray(colDef.cellEditorParams.values)
          ) {
            const options = colDef.cellEditorParams.values;
            isValid = options.some(
              (opt: any) =>
                (typeof opt === "object" ? opt.value : opt) ===
                fillSourceCell.value
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
      let isoSztpSource: any = null;
      if (fillSourceCell) {
        const sourceRow = newRowData[fillSourceCell.rowIndex];
        if (sourceRow) {
          isoSztpSource = sourceRow.isoSztp;
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
          const row = newRowData[rowIndex];
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
        // Điều này sẽ gọi cả onValuesChanged và onFillChanges nếu có
        pasteHandlerFillChanges(changes);
      }

      if (gridRef.current?.api) {
        gridRef.current.api.refreshCells({ force: true });
      }
    }

    setIsDraggingFill(false);
    isDraggingFillRef.current = false;
    setFillTargetCells(new Set());

    // Giữ fill handle visible và không reset selection ngay lập tức
    // setFillHandleVisible(false);

    setFillSourceCell(null);
    setMultiSelectionPattern(null);
    setMultiSelectionBounds(null);

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
  };

  // Hàm xử lý sự kiện nhấn phím (Ctrl+C để sao chép các ô đã chọn)
  const handleKeyDown = (event: KeyboardEvent) => {
    // Kiểm tra tổ hợp phím Ctrl+C
    if (
      (event.ctrlKey && event.key === "c") ||
      (event.metaKey && event.key === "c")
    ) {
      const clipboardData: string[] = [];
      const gridApi = gridRef.current?.api;
      if (!gridApi) return;

      try {
        // Lấy danh sách các cột theo thứ tự trong columnDefs
        const columnDefs = gridApi.getColumnDefs();
        if (!columnDefs) {
          // console.error("Column definitions are undefined.");
          return;
        }

        // Lọc và lấy `field` từ các đối tượng ColDef
        const columnOrder = (columnDefs as ColDef[])
          .filter(
            (colDef) =>
              colDef &&
              typeof colDef === "object" &&
              "field" in colDef &&
              !!colDef.field
          )
          .map((colDef) => colDef.field as string);

        if (columnOrder.length === 0) {
          // console.warn("No valid column fields found in columnDefs");
          return;
        }

        // Parse và sắp xếp các ô đã chọn
        const sortedCells = Array.from(selectedCells).sort((a, b) => {
          const [rowA, colFieldA] = a.split("-");
          const [rowB, colFieldB] = b.split("-");

          // Kiểm tra giá trị hợp lệ
          if (!rowA || !rowB || !colFieldA || !colFieldB) return 0;

          const colIndexA = columnOrder.indexOf(colFieldA);
          const colIndexB = columnOrder.indexOf(colFieldB);

          // Xử lý trường hợp không tìm thấy cột
          if (colIndexA === -1 || colIndexB === -1) {
            return colIndexA === -1 ? 1 : -1; // Đẩy cột không tìm thấy xuống cuối
          }

          return rowA === rowB
            ? colIndexA - colIndexB
            : parseInt(rowA, 10) - parseInt(rowB, 10);
        });

        // Tạo cấu trúc dữ liệu clipboard
        const rowDataMap: { [key: number]: { [key: string]: string } } = {};

        sortedCells.forEach((cellId) => {
          const parts = cellId.split("-");
          if (parts.length !== 2) return;

          const [rowIndexString, colField] = parts;
          const rowIndex = parseInt(rowIndexString, 10);

          if (isNaN(rowIndex)) return;

          const rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
          if (!rowNode || !rowNode.data) return;

          if (!rowDataMap[rowIndex]) {
            rowDataMap[rowIndex] = {};
          }

          // Xử lý dữ liệu của ô an toàn
          let cellValue = "";
          try {
            cellValue =
              rowNode.data[colField] !== undefined &&
              rowNode.data[colField] !== null
                ? String(rowNode.data[colField]).replace(/\r/g, "").trim()
                : "";
          } catch (err) {
            console.warn(
              `Error processing cell value at ${rowIndex}-${colField}:`,
              err
            );
          }

          rowDataMap[rowIndex][colField] = cellValue;
        });

        // Chỉ xây dựng dữ liệu cho các ô đã chọn
        const rowKeys = Object.keys(rowDataMap)
          .map(Number)
          .sort((a, b) => a - b);

        rowKeys.forEach((rowKey) => {
          const row = rowDataMap[rowKey];
          const rowValues: string[] = [];

          // Đảm bảo sử dụng đúng thứ tự cột theo bảng hiện tại
          columnOrder.forEach((colField) => {
            if (
              sortedCells.some((cellId) => cellId === `${rowKey}-${colField}`)
            ) {
              rowValues.push(row[colField] || "");
            }
          });

          if (rowValues.length > 0) {
            clipboardData.push(rowValues.join("\t")); // Kết hợp các ô trong hàng bằng tab
          }
        });

        // Ghi dữ liệu vào clipboard
        if (clipboardData.length > 0) {
          navigator.clipboard
            .writeText(clipboardData.join("\n"))
            .then(() => {})
            .catch((err) => console.error("Copy failed!", err));
        }
      } catch (error) {
        console.error("Error processing clipboard data:", error);
      }
    }
  };
  const handleImportClick = () => {
    // Close the dropdown after a short delay to allow the click event to complete
    setTimeout(() => {
      setImportDropdownOpen(false);
    }, 300);
  };

  // Hàm xử lý khi scroll để cập nhật vị trí fill handle
  const handleScroll = useCallback(() => {
    if (
      fillHandleVisible &&
      !isDraggingFill &&
      !isSelecting &&
      selectedCells.size === 0
    ) {
      setFillSourceCell(null);
    }
  }, [fillHandleVisible, isDraggingFill, isSelecting, selectedCells.size]);

  // Hàm xử lý infinite scroll
  const handleInfiniteScroll = useCallback(() => {
    if (
      !enableInfiniteScroll ||
      !gridRef.current?.api ||
      !onLoadMore ||
      !hasMore ||
      isLoadingMore
    ) {
      return;
    }

    // THÊM: Không trigger infinite scroll khi đang trong cell/row selection operations
    if (isSelecting || isDraggingCells || isDraggingFill) {
      // console.log("Skipping infinite scroll during selection operations");
      return;
    }

    // THÊM: Debounce để tránh trigger quá nhiều lần
    if (infiniteScrollDebounceTimer) {
      clearTimeout(infiniteScrollDebounceTimer);
    }

    const timer = setTimeout(() => {
      // Lấy viewport của grid
      const gridViewport =
        gridWrapperRef.current?.querySelector(".ag-body-viewport");
      if (!gridViewport) return;

      const { scrollTop, scrollHeight, clientHeight } = gridViewport;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Kiểm tra xem có gần cuối không (dựa trên threshold)
      if (distanceFromBottom <= infiniteScrollThreshold) {
        // Tính trang tiếp theo dựa trên total
        const totalPages = total ? Math.ceil(total / pageSize) : 1;
        const nextPage = maxReachedPage + 1;

        if (nextPage <= totalPages) {
          // console.log("Triggering infinite scroll load more:", nextPage);
          setIsLoadingMore(true);
          setMaxReachedPage(nextPage);
          onLoadMore(nextPage, pageSize);

          // Reset loading state sau 1 giây (có thể tùy chỉnh)
          setTimeout(() => {
            setIsLoadingMore(false);
          }, 1000);
        }
      }
      setInfiniteScrollDebounceTimer(null);
    }, 150); // Debounce 150ms

    setInfiniteScrollDebounceTimer(timer);
  }, [
    enableInfiniteScroll,
    onLoadMore,
    hasMore,
    isLoadingMore,
    infiniteScrollThreshold,
    total,
    pageSize,
    maxReachedPage,
    gridRef,
    isSelecting, // THÊM: Dependencies để check selection state
    isDraggingCells,
    isDraggingFill,
    infiniteScrollDebounceTimer,
  ]);

  // Auto-reset mechanism để tránh bị stuck trong selection state
  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;

    if (isSelecting) {
      // Nếu isSelecting = true quá lâu (5 giây), tự động reset
      resetTimeout = setTimeout(() => {
        // console.log("Auto-resetting stuck selection state");
        setIsSelecting(false);
        isSelectingRef.current = false;

        if (gridWrapperRef.current) {
          gridWrapperRef.current.removeAttribute("data-selecting");
        }

        setStartCell(null);
      }, 5000);
    }

    return () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, [isSelecting]);

  useEffect(() => {
    const documentMouseUpHandler = (event: MouseEvent) => {
      // console.log("Document mouseup detected", {
      //   isSelecting: isSelectingRef.current,
      //   isDraggingFill: isDraggingFillRef.current,
      // });

      // KHÔNG force reset khi có enableInfiniteScroll để tránh conflict với row selection
      if (enableInfiniteScroll) {
        // console.log(
        //   "Skipping document mouseup reset - infinite scroll enabled"
        // );
        return;
      }

      // Chỉ force reset khi click outside grid và không phải đang drag fill
      const target = event.target as HTMLElement;
      const isInsideGrid =
        gridWrapperRef.current?.contains(target) ||
        target?.closest?.(".ag-grid") ||
        target?.closest?.(".ag-root-wrapper");

      if (
        isSelectingRef.current &&
        !isDraggingFillRef.current &&
        !isInsideGrid
      ) {
        // console.log(
        //   "Force resetting selection state on document mouseup - outside grid"
        // );
        setTimeout(() => {
          setIsSelecting(false);
          isSelectingRef.current = false;

          if (gridWrapperRef.current) {
            gridWrapperRef.current.removeAttribute("data-selecting");
          }

          setStartCell(null);
        }, 50);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Thêm backup mouseup listener
    document.addEventListener("mouseup", documentMouseUpHandler, {
      capture: true,
    });

    // Thêm scroll listener
    const gridElement = gridWrapperRef.current;
    if (gridElement) {
      gridElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseup", documentMouseUpHandler, {
        capture: true,
      });

      if (gridElement) {
        gridElement.removeEventListener("scroll", handleScroll);
      }

      // Cleanup auto-scroll interval khi component unmount
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };
  }, [
    selectedCells,
    handleKeyDown,
    isDraggingFill,
    fillSourceCell,
    fillTargetCells,
    handleScroll,
    autoScrollInterval,
    enableInfiniteScroll, // THÊM: để check infinite scroll state
  ]);

  // Thêm global mouse move listener cho auto-scroll và fill handle drag
  useEffect(() => {
    if (isDraggingFill || isSelecting) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
      };
    }
  }, [isDraggingFill, isSelecting, handleGlobalMouseMove]);

  // useEffect cho infinite scroll
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const gridViewport =
      gridWrapperRef.current?.querySelector(".ag-body-viewport");
    if (!gridViewport) return;

    gridViewport.addEventListener("scroll", handleInfiniteScroll);

    return () => {
      gridViewport.removeEventListener("scroll", handleInfiniteScroll);
      // THÊM: Cleanup debounce timer khi component unmount
      if (infiniteScrollDebounceTimer) {
        clearTimeout(infiniteScrollDebounceTimer);
        setInfiniteScrollDebounceTimer(null);
      }
    };
  }, [enableInfiniteScroll, handleInfiniteScroll, infiniteScrollDebounceTimer]);

  // useEffect để đảm bảo fill handle luôn hiển thị khi có ô được chọn
  useEffect(() => {
    if (selectedCells.size > 0 && !fillHandleVisible && fillSourceCell) {
      // Nếu có ô được chọn nhưng fill handle không hiển thị, hiển thị lại
      const cellElement = gridWrapperRef.current?.querySelector(
        `[row-index="${fillSourceCell.rowIndex}"] .ag-cell[col-id="${fillSourceCell.colField}"]`
      );
      if (cellElement && gridWrapperRef.current) {
        const rect = cellElement.getBoundingClientRect();
        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        setFillHandlePosition({
          top: rect.bottom - gridRect.top - 5,
          left: rect.right - gridRect.left - 5,
        });
        setFillHandleVisible(true);
      }
    }
  }, [selectedCells.size, fillHandleVisible, fillSourceCell]);

  const { theme } = useTheme(); // Lấy trạng thái theme từ next-themes

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: columnFlex,
      editable: true,
      resizable: true,
      sortable: true,
      filter: enableFilter,
      suppressClipboardPaste: false,
      cellStyle: (params: any): CellStyle => {
        const cellId = `${params.rowIndex}-${params.colDef.field}`;
        // Nếu ô được chọn, trả về style đặc biệt
        if (selectedCells.has(cellId)) {
          return {
            backgroundColor: "#d3ebf5",
            border: "2px solid #0078d7",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center", // Ensures vertical centering
          };
        }
        // Nếu ô là target của fill operation
        if (fillTargetCells.has(cellId)) {
          return {
            backgroundColor: "rgba(0, 120, 215, 0.2)",
            border: "1px dashed #0078d7",
            fontWeight: "normal",
            display: "flex",
            alignItems: "center",
          };
        }
        // Style mặc định
        return {
          backgroundColor:
            theme === "dark" ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.8)",
          border: "1px solid #b9e7f8",
          fontWeight: "normal",
          display: "flex",
          alignItems: "center", // Ensures vertical centering
        };
      },
      cellClass: (params: any) => {
        const cellId = `${params.rowIndex}-${params.colDef.field}`;
        if (selectedCells.has(cellId)) return "selected-cell";
        if (fillTargetCells.has(cellId)) return "fill-target";
        return "";
      },
    }),
    [selectedCells, fillTargetCells, columnFlex, enableFilter, theme]
  );

  const extendedColumnDefs: ColDef[] = useMemo(() => {
    if (!showSTT) {
      return columnDefs;
    }

    const sttColumn: ColDef = {
      headerName: "",
      field: "__stt",
      cellRenderer: (params: any) => {
        if (params.data?.isError) {
          return ErrorCellRenderer(params);
        }

        // Tính STT dựa trên trang hiện tại và pageSize
        if (params.api && params.node) {
          let sttValue = 1;

          params.api.forEachNodeAfterFilterAndSort(
            (node: any, index: number) => {
              if (node === params.node) {
                // Nếu có server-side pagination (có onChangePage), tính STT từ trang hiện tại
                if (onChangePage && !isFiltered) {
                  sttValue = (currentPage - 1) * pageSize + index + 1;
                } else {
                  // Client-side pagination hoặc filtered data
                  sttValue = index + 1;
                }
                return; // break
              }
            }
          );

          return sttValue;
        }

        return "";
      },
      width: 70,
      pinned: "left",
      lockPosition: true,
      editable: false,
      filter: false,
      suppressMenu: true,
      resizable: false,
      cellStyle: (params: CellClassParams<any>): CellStyle => {
        if (params.data.isSaved) {
          return {
            backgroundColor: "#8bd8f4",
            textAlign: "center",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          };
        } else if (params.data.isError) {
          return {
            backgroundColor: "#efb008",
            textAlign: "center",
            cursor: "pointer",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          };
        }
        return {
          backgroundColor: "#e6f7ff",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      },
      tooltipValueGetter: (params) => {
        if (params.data?.errorMessages) {
          const formattedMessage = params.data.errorMessages
            .split("\n")
            .map((line: string) => {
              if (line.trim().startsWith("-")) {
                return line.trim().replace(/^-/, "• ");
              }
              return line.trim();
            })
            .join("\n");
          return formattedMessage;
        }
        return "";
      },
      tooltipComponent: "CustomTooltip",
      getQuickFilterText: () => "",
    };

    return [sttColumn, ...columnDefs];
  }, [columnDefs, showSTT, currentPage, pageSize, onChangePage, isFiltered]);

  // Giữ onFilterChanged để refresh STT khi filter thay đổi
  const onFilterChanged = useCallback(() => {
    if (gridRef.current?.api) {
      // Refresh STT column sau khi filter
      setTimeout(() => {
        gridRef.current?.api?.refreshCells({
          columns: ["__stt"],
          force: true,
          suppressFlash: true,
        });
      }, 50);
    }
  }, []);

  // Create a custom tooltip component with better styling
  const CustomTooltip = (props: any) => {
    if (!props.value) return null;

    return (
      <div
        style={{
          padding: "12px",
          backgroundColor: "#ffeeee",
          color: "#d32f2f",
          border: "1px solid #d32f2f",
          maxWidth: "400px",
          whiteSpace: "pre-line", // This preserves line breaks
          fontWeight: "bold",
          fontSize: "14px",
          lineHeight: "2.0", // Increased line height for better spacing
          borderRadius: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {props.value}
      </div>
    );
  };

  // Register the custom components
  gridOptions.components = {
    ...gridOptions.components,
    CustomTooltip: CustomTooltip,
    ErrorCellRenderer: ErrorCellRenderer,
  };

  // Add tooltip configuration to gridOptions to ensure immediate display
  gridOptions.tooltipShowDelay = 0;
  gridOptions.tooltipMouseTrack = true;

  // Add scroll position preservation to prevent jumping to top when selecting checkboxes
  gridOptions.suppressScrollOnNewData = true;
  gridOptions.suppressAnimationFrame = true;
  gridOptions.suppressRowTransform = true;

  // Add useEffect to handle loading state changes
  useEffect(() => {
    if (gridRef.current?.api) {
      if (loading) {
        gridRef.current.api.showLoadingOverlay();
      } else {
        gridRef.current.api.hideOverlay();
      }
    }
  }, [loading, gridRef]);

  // Custom selection changed handler that preserves scroll position
  const handleSelectionChanged = useCallback(() => {
    // console.log("🔵 handleSelectionChanged triggered:", {
    //   isDraggingFill,
    //   isDraggingCells,
    //   isSelecting,
    //   enableInfiniteScroll,
    //   isLoadingMore,
    // });

    // Chỉ block khi đang drag fill hoặc đang actively drag cells
    // Không block khi chỉ có isSelecting = true (single click)
    if (isDraggingFill || isDraggingCells) {
      // console.log("⛔ Blocking selection changed due to drag operation");
      return;
    }

    if (gridRef.current?.api) {
      // const selectedRows = gridRef.current.api.getSelectedRows();
      // console.log("✅ Selection changed - selected rows:", selectedRows.length);

      const viewport = gridRef.current.api.getVerticalPixelRange();

      // Chỉ gọi callback của parent khi không tương tác để tránh refresh data
      // THÊM: KHÔNG gọi parent callback khi enableInfiniteScroll để tránh data refresh conflict
      if (onSelectionChanged && !enableInfiniteScroll) {
        // console.log("🟢 Calling parent onSelectionChanged");

        // Delay callback để AG Grid hoàn thành selection process trước
        setTimeout(() => {
          onSelectionChanged();
        }, 10);
      } else if (enableInfiniteScroll) {
        // console.log(
        //   "🚫 Skipping parent onSelectionChanged - infinite scroll enabled"
        // );
      } // SỬA: Không gọi ensureIndexVisible khi infinite scroll đang hoạt động
      // để tránh conflict giữa selection và infinite loading
      if (viewport && !enableInfiniteScroll && !isLoadingMore) {
        setTimeout(() => {
          if (gridRef.current?.api) {
            gridRef.current.api.ensureIndexVisible(
              Math.floor(viewport.top / 40),
              "top"
            );
          }
        }, 10);
      }
    }

    if (selectedCells.size > 0 && !fillHandleVisible && fillSourceCellInfo) {
      setFillHandleVisible(true);
    }
  }, [
    onSelectionChanged,
    selectedCells,
    fillHandleVisible,
    fillSourceCellInfo,
    isDraggingFill,
    isDraggingCells, // Thêm isDraggingCells vào dependencies
    enableInfiniteScroll, // THÊM: Check infinite scroll state
    isLoadingMore, // THÊM: Check loading state
  ]);

  // Add scroll position preservation for grid updates
  useEffect(() => {
    if (gridRef.current?.api) {
      const api = gridRef.current.api;

      // Store scroll position in a ref to avoid accessing internal properties
      const scrollPositionRef = { current: 0 };

      // Restore scroll position after grid operation
      const restoreScrollPosition = () => {
        if (scrollPositionRef.current > 0) {
          setTimeout(() => {
            api.ensureIndexVisible(
              Math.floor(scrollPositionRef.current / 40),
              "top"
            );
          }, 50);
        }
      };

      // Add event listeners to preserve scroll position
      const handleAfterRefresh = () => {
        restoreScrollPosition();
      };

      // Listen for grid events that might cause scroll jumping
      api.addEventListener("modelUpdated", handleAfterRefresh);
      api.addEventListener("rowDataUpdated", handleAfterRefresh);

      return () => {
        api.removeEventListener("modelUpdated", handleAfterRefresh);
        api.removeEventListener("rowDataUpdated", handleAfterRefresh);
      };
    }
  }, [gridRef.current?.api]);

  const overlayLoadingTemplate = `
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.95);
      z-index: 1000;
    ">
      <div style="
        display: flex;
        gap: 4px;
        margin-bottom: 20px;
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        font-size: 32px;
        color: #1890ff;
      ">
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0s;">H</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.1s;">U</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.2s;">M</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.3s;">A</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.4s;">N</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.5s;">&</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.6s;">M</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.7s;">O</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.8s;">N</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.9s;">E</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 1.0s;">Y</span>
      </div>
      <div style="
        font-size: 16px;
        color: #666;
        font-weight: 500;
        font-family: 'Roboto', sans-serif;
      ">Đang tải dữ liệu...</div>
    </div>
    <style>
      @keyframes letter-bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }
    </style>
  `;

  // Đồng bộ với prop rowHeight của AgGridReact (bên dưới đặt 40)
  const rowHeight = 40;

  // Function to handle Excel export
  const handleExportExcel = () => {
    if (!gridRef.current?.api) {
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

  // Tính toán dữ liệu hiển thị theo trang
  // Debug state display
  // const debugState = useMemo(() => {
  //   return {
  //     isSelecting,
  //     isDraggingFill,
  //     selectedCellsCount: selectedCells.size,
  //     fillHandleVisible,
  //     hasStartCell: !!startCell,
  //   };
  // }, [
  //   isSelecting,
  //   isDraggingFill,
  //   selectedCells.size,
  //   fillHandleVisible,
  //   startCell,
  // ]);

  // Log state changes for debugging
  // useEffect(() => {
  //   // console.log("State changed:", debugState);
  // }, [debugState]);

  const pagedData = useMemo(() => {
    const data = isFiltered ? filteredData : rowData;

    // Infinite scroll mode: chỉ khi có onLoadMore callback, hiển thị tất cả dữ liệu từ trang 1 đến maxReachedPage
    // Nếu không có onLoadMore thì hoạt động như pagination bình thường
    if (enableInfiniteScroll && onLoadMore && !onChangePage) {
      const maxItems = maxReachedPage * pageSize;
      return data.slice(0, maxItems);
    }

    // Chỉ slice data khi không có onChangePage callback (client-side pagination)
    // Nếu có onChangePage callback thì server đã xử lý pagination rồi
    if (pagination && !onChangePage) {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return data.slice(start, end);
    }
    return data;
  }, [
    isFiltered,
    filteredData,
    rowData,
    pagination,
    currentPage,
    pageSize,
    onChangePage,
    enableInfiniteScroll,
    onLoadMore,
    maxReachedPage,
  ]);

  // Tính chiều cao grid dựa trên dữ liệu đang hiển thị (pagedData)
  const gridHeight = useMemo(() => {
    const dataLen = pagedData.length;

    // Chiều cao header (mặc định ~45px với theme Quartz nếu không truyền)
    const headerPx = typeof headerHeight === "number" ? headerHeight : 45;

    if (dataLen === 0) {
      // Header + placeholder body
      return headerPx + rowHeight * 9;
    }

    // Tính số dòng hiển thị dựa trên maxRowsVisible
    const visibleRows = Math.min(
      dataLen,
      Math.max(1, Math.floor(maxRowsVisible))
    );

    // Chiều cao phần body (các dòng)
    const bodyHeight = Math.max(rowHeight, visibleRows * rowHeight);

    // Tổng chiều cao = header + body
    return headerPx + bodyHeight;
  }, [pagedData.length, maxRowsVisible, rowHeight, headerHeight]);

  const firstQuicksearchRef = useRef(0); // Thêm dòng này

  const pageSizeOptions = useMemo(() => {
    const baseOptions = ["20", "50", "100", "500", "1000"];
    const apiTotal = typeof total === "number" ? total : rowData.length;
    if (apiTotal > 1000) {
      const roundedToThousand = Math.ceil(apiTotal / 1000) * 1000;
      return [...baseOptions, String(roundedToThousand)];
    }
    return baseOptions;
  }, [total, rowData.length]);

  useEffect(() => {
    firstQuicksearchRef.current += 1;
    if (firstQuicksearchRef.current <= 2) {
      return;
    }

    // Reset page to 1 when search parameters change
    if (pagination && currentPage !== 1) {
      setCurrentPage(1);
      if (onChangePage) {
        onChangePage(1, pageSize);
      }
    }

    if (onQuicksearch) {
      onQuicksearch(searchText, selectedFilterColumns, filterValues, pageSize);
    }
  }, [
    selectedFilterColumns,
    searchText,
    filterValues,
    onQuicksearch,
    pageSize,
  ]);

  // Wrapper function để debug row clicks
  const handleRowClickWithDebug = useCallback(
    (event: any) => {
      // console.log("🟢 Row clicked:", {
      //   data: event.data,
      //   node: event.node,
      //   rowIndex: event.rowIndex,
      //   enableInfiniteScroll,
      //   isSelecting,
      //   isDraggingCells,
      //   isDraggingFill,
      // });

      if (onRowClicked) {
        onRowClicked(event);
      }
    },
    [
      onRowClicked,
      enableInfiniteScroll,
      isSelecting,
      isDraggingCells,
      isDraggingFill,
    ]
  );

  return (
    <div>
      {showSearch || showActionButtons ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              alignItems: "top",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                gap: "10px",
                marginBottom: `${showActionButtons ? "0px" : "10px"}`,
              }}
            >
              {showSearch && (
                <InputSearch
                  // id="filter-text-box"
                  placeholder={t("search")}
                  {...inputSearchProps}
                  isFiltered={isFiltered}
                  onFilterClick={handleOpenFilterModal}
                  enableFilterButton={enableFilter}
                  onInputValueChange={(setValue: string) => {
                    setSearchText(setValue);
                  }}
                  // onResetFilter={handleResetFilters}
                  filterCount={selectedFilterColumns.length}
                />
              )}
              {isFiltered && filterValues && (
                <div
                  className="filter-summary-container"
                  onClick={handleResetFilters}
                >
                  <Tooltip title={filterValues} placement="bottom">
                    <div className="filter-summary">
                      <strong
                        className="filter-text"
                        style={{ cursor: "pointer" }}
                      >
                        {t("Filteredby")}:{" "}
                      </strong>
                      <strong
                        className="remove-filter"
                        style={{ cursor: "pointer" }}
                      >
                        {t("Removefilter")}
                      </strong>
                      <span>
                        {filterValues.length > 100
                          ? `${filterValues.substring(0, 50)}...`
                          : filterValues}
                      </span>
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>

            {showActionButtons && <ActionButtons {...actionButtonsProps} />}
          </div>
        </div>
      ) : (
        ""
      )}

      <div
        ref={gridWrapperRef}
        onMouseUp={handleMouseUp}
        style={{
          position: "relative",
          height: `${gridHeight}px`,
          minHeight: "260px",
          width: "100%",
          overflowY: pagedData.length > maxRowsVisible ? "auto" : "hidden",
          overflowX: "hidden", // Để AG Grid tự quản lý scroll ngang
          scrollBehavior: "auto", // Prevent smooth scrolling that can cause jumping
        }}
        className={
          theme === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"
        } // Áp dụng theme dựa trên trạng thái
      >
        <AgGridReact
          ref={gridRef}
          rowData={pagedData}
          onRowSelected={onRowSelected}
          columnDefs={extendedColumnDefs}
          defaultColDef={defaultColDef}
          editType={"fullRow"}
          pivotMode={pivotMode}
          onRowDoubleClicked={onRowDoubleClicked}
          onCellValueChanged={onCellValueChanged}
          onCellEditingStarted={onCellEditingStarted}
          onSelectionChanged={handleSelectionChanged}
          onCellMouseDown={handleMouseDown}
          onCellClicked={showFillHandle}
          onCellFocused={(event) => {
            // Chỉ hiển thị fill handle khi focus nếu không đang trong trạng thái selection hoặc drag
            if (!isSelecting && !isDraggingFill) {
              showFillHandle(event);
            }
          }}
          onCellMouseOver={handleMouseOver}
          getRowStyle={getRowStyle}
          suppressRowClickSelection={false}
          rowSelection={rowSelection}
          domLayout={domLayout as "normal" | "autoHeight" | "print"}
          rowHeight={40}
          headerHeight={headerHeight}
          stopEditingWhenCellsLoseFocus={true}
          gridOptions={gridOptions}
          tooltipShowDelay={0}
          pinnedBottomRowData={pinnedBottomRowData}
          animateRows={true}
          onFilterChanged={onFilterChanged}
          getRowClass={getRowClass}
          onRowClicked={handleRowClickWithDebug}
          sideBar={sideBar}
          onColumnHeaderClicked={onColumnHeaderClicked}
          onGridReady={(params) => {
            // Configure tooltip parameters directly on the API for immediate effect
            params.api.setGridOption("tooltipShowDelay", 0);

            // Apply loading overlay immediately if needed
            if (loading) {
              // Small delay to ensure grid is ready
              setTimeout(() => {
                params.api.showLoadingOverlay();
              }, 50);
            } else {
              params.api.hideOverlay();
            }

            // Store original row data for filtering (only if not already in filtered state)
            if (!isFiltered && originalRowData.length === 0) {
              setOriginalRowData([...rowData]);
            }

            // Preserve scroll position when grid is ready
            const viewport = params.api.getVerticalPixelRange();
            if (viewport) {
              params.api.ensureIndexVisible(
                Math.floor(viewport.top / 40),
                "top"
              );
            }

            if (onGridReady) {
              onGridReady(params);
            }
          }}
          overlayLoadingTemplate={overlayLoadingTemplate} // Updated loading template
          overlayNoRowsTemplate={`<span style="font-size: 16px; color: #666;">${t(
            "Nodata"
          )}</span>`} // Thêm nội dung khi không có dữ liệu
          // BỎ các prop liên quan đến pagination của AgGrid
        />

        {/* Infinite Scroll Loading Indicator */}
        {enableInfiniteScroll && isLoadingMore && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "10px 20px",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              fontSize: "14px",
              color: "#666",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid #f3f3f3",
                borderTop: "2px solid #1890ff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            Đang tải thêm dữ liệu...
          </div>
        )}

        {/* Fill Handle */}
        {fillHandleVisible &&
          fillHandlePosition.top !== undefined &&
          fillHandlePosition.left !== undefined && (
            <div
              key={`${fillHandlePosition.top}-${fillHandlePosition.left}`} // Force re-render khi vị trí thay đổi
              className={`fill-handle ${
                autoScrollInterval ? "auto-scrolling" : ""
              }`}
              style={{
                position: "absolute",
                top: `${fillHandlePosition.top}px`,
                left: `${fillHandlePosition.left}px`,
                zIndex: 1001,
                cursor: "crosshair",
                transform: "translate3d(0, 0, 0)",
                willChange: "transform",
              }}
              onMouseDown={handleFillMouseDown}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!fillHandleVisible) {
                  setFillHandleVisible(true);
                }
              }}
            />
          )}
      </div>

      {/* Footer area with export button and row count */}
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {showExportExcel && (
            <Tooltip title="Xuất Excel" placement="top">
              <BsFiletypeXlsx
                onClick={handleExportExcel}
                size={24}
                style={{ cursor: "pointer" }}
              />
            </Tooltip>
          )}
          {importComponent && (
            <Dropdown
              menu={{ items: [] }}
              dropdownRender={() => (
                <div
                  className="dark-dropdown-content"
                  style={{
                    padding: "8px",
                    background: "#fff",
                    borderRadius: "2px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                  onClick={handleImportClick}
                >
                  {importComponent}
                </div>
              )}
              trigger={["click"]}
              open={importDropdownOpen}
              onOpenChange={setImportDropdownOpen}
            >
              <Tooltip title="Nhập dữ liệu">
                <FiUpload
                  size={24}
                  style={{
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </Dropdown>
          )}
        </div>

        {pagination && !enableInfiniteScroll && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={
              typeof total === "number" && total > 0
                ? total
                : isFiltered
                ? filteredData.length
                : rowData.length
            }
            showSizeChanger
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              // Chỉ gọi onChangePage khi không trong filtered state (server-side pagination)
              if (onChangePage && !isFiltered) {
                onChangePage(page, size);
              }
            }}
            locale={{
              items_per_page: t("items_per_page"),
              jump_to: t("jump_to"),
              page: "",
              prev_page: t("prev_page"),
              next_page: t("next_page"),
            }}
            showQuickJumper
            pageSizeOptions={pageSizeOptions}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} / ${total} ${t("totalRow")}`
            }
          />
        )}

        {/* Infinite Scroll Info */}
        {enableInfiniteScroll && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            <div>
              {`Hiển thị: ${pagedData.length}`}
              {total && ` / ${total} tổng`}
              {hasMore && ` (cuộn để tải thêm)`}
            </div>
          </div>
        )}

        {!pagination && !enableInfiniteScroll && (
          <div>
            {(() => {
              const resolvedTotal =
                typeof total === "number" && total > 0
                  ? total
                  : isFiltered
                  ? filteredData.length
                  : rowData.length;
              return (
                <div style={{ fontWeight: "bold" }}>
                  {`${t("totalRow")}: ${resolvedTotal} `}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterArrayModal
        isOpen={showFilterModal}
        onClose={handleCloseFilterModal}
        onApplyFilter={handleApplyFilter}
        columns={columnDefs
          .filter(
            (col) =>
              col.field && col.field !== "id" && typeof col.field === "string"
          )
          .map((col) => ({
            field: col.field as string,
            headerName: col.headerName || (col.field as string),
          }))}
        initialSelectedColumns={selectedFilterColumns}
        initialFilterValues={filterValues}
        theme={theme || "light"}
      />

      {/* Debug Panel - Remove in production
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 10000,
            maxWidth: "250px",
            fontFamily: "monospace"
          }}
        >
          <div>Debug State:</div>
          <div>isSelecting: {isSelecting ? "✅" : "❌"}</div>
          <div>isDraggingFill: {isDraggingFill ? "✅" : "❌"}</div>
          <div>selectedCells: {selectedCells.size}</div>
          <div>fillHandleVisible: {fillHandleVisible ? "✅" : "❌"}</div>
          <div>hasStartCell: {startCell ? "✅" : "❌"}</div>
          <button
            onClick={() => {
              // Force reset all states
              setIsSelecting(false);
              isSelectingRef.current = false;
              setIsDraggingFill(false);
              isDraggingFillRef.current = false;
              setStartCell(null);
              setSelectedCells(new Set());
              setFillHandleVisible(false);
              if (gridWrapperRef.current) {
                gridWrapperRef.current.removeAttribute("data-selecting");
                gridWrapperRef.current.removeAttribute("data-dragging");
              }
              console.log("Force reset all states");
            }}
            style={{
              marginTop: "5px",
              padding: "2px 5px",
              fontSize: "10px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer"
            }}
          >
            Force Reset
          </button>
        </div>
      )} */}
    </div>
  );
};

export default AgGridComponent;
