/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// Lazy imports for better code splitting
import usePasteHandler from "@/utils/client/usePasteHandler";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Pagination } from "antd";
import Dropdown from "antd/es/dropdown/dropdown";
import { Tooltip } from "antd/lib";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import React, { lazy, useCallback, useEffect, useRef, useState } from "react";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { CustomTooltip } from "./components/CustomTooltip";
import FilterArrayModal from "./components/FilterArrayModal";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { useClipboard } from "./hooks/useClipboard";
import { useColumnDefinitions } from "./hooks/useColumnDefinitions";
import { useFillHandle } from "./hooks/useFillHandle";
import { useGridConfiguration } from "./hooks/useGridConfiguration";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useMouseHandlers } from "./hooks/useMouseHandlers";
import { usePagination } from "./hooks/usePagination";
import { useTableFilter } from "./hooks/useTableFilter";
import "./index.scss";
import { AgGridComponentProps } from "./interface/agProps";
import { useExcelExport } from "./utils/excelExport";

// Lazy load heavy components
const ActionButtons = lazy(() => import("@/components/action-button"));
const ErrorCellRenderer = lazy(
  () => import("@/components/basicUI/cTableAG/components/ErrorCellRenderer")
);
const InputSearch = lazy(() => import("@/components/basicUI/InputSearch"));

// Dynamic import for AG-Grid Enterprise modules (only load when needed)
const loadEnterpriseModules = async () => {
  const [{ ColumnsToolPanelModule }, { MenuModule }] = await Promise.all([
    import("@ag-grid-enterprise/column-tool-panel"),
    import("@ag-grid-enterprise/menu"),
  ]);
  return { ColumnsToolPanelModule, MenuModule };
};

// Register base module immediately
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Load and register enterprise modules dynamically
let enterpriseModulesLoaded = false;
const loadEnterpriseModulesIfNeeded = async () => {
  if (!enterpriseModulesLoaded) {
    const { ColumnsToolPanelModule, MenuModule } =
      await loadEnterpriseModules();
    ModuleRegistry.registerModules([ColumnsToolPanelModule, MenuModule]);
    enterpriseModulesLoaded = true;
  }
};

// Import ActionButtonsProps type for prop spreading

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
  // Use table filter hook
  const {
    showFilterModal,
    selectedFilterColumns,
    filterValues,
    originalRowData,
    setOriginalRowData,
    filteredData,
    setFilteredData,
    isFiltered,
    searchText,
    setSearchText,
    handleOpenFilterModal,
    handleCloseFilterModal,
    handleApplyFilter,
    handleResetFilters,
  } = useTableFilter({
    columnDefs,
    rowData,
    gridRef: gridRef as React.RefObject<{ api: any }>,
  });

  const [importDropdownOpen, setImportDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(paginationCurrentPage);
  const [pageSize, setPageSize] = useState(paginationPageSize);

  // Infinite scroll states
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [maxReachedPage, setMaxReachedPage] = useState(paginationCurrentPage); // Track highest page reached
  const [infiniteScrollDebounceTimer, setInfiniteScrollDebounceTimer] =
    useState<NodeJS.Timeout | null>(null);

  // Fill handle states - moved here to fix dependency order
  const [isDraggingFill, setIsDraggingFill] = useState(false);
  const [startCell, setStartCell] = useState<{
    rowIndex: number;
    colField: string;
  } | null>(null);

  // Use infinite scroll hook
  const { handleInfiniteScroll } = useInfiniteScroll({
    enableInfiniteScroll,
    gridRef,
    gridWrapperRef: gridWrapperRef as React.RefObject<HTMLDivElement>,
    onLoadMore,
    hasMore,
    infiniteScrollThreshold,
    total,
    pageSize,
    isSelecting,
    isDraggingCells,
    isDraggingFill,
    isLoadingMore,
    setIsLoadingMore,
    maxReachedPage,
    setMaxReachedPage,
    infiniteScrollDebounceTimer,
    setInfiniteScrollDebounceTimer,
  });

  // Use pagination hook for page calculation logic
  const {
    pagedData: paginatedData,
    pageSizeOptions: calculatedPageSizeOptions,
  } = usePagination({
    paginationCurrentPage,
    paginationPageSize,
    isFiltered,
    filteredData,
    rowData,
    pagination,
    onChangePage,
    enableInfiniteScroll,
    onLoadMore,
    maxReachedPage,
    total,
  });

  // Load AG-Grid styles and enterprise modules when needed
  useEffect(() => {
    // Dynamically load AG-Grid CSS
    import("@/styles/ag-grid-styles");

    if (sideBar && Object.keys(sideBar).length > 0) {
      loadEnterpriseModulesIfNeeded();
    }
  }, [sideBar]);

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

  // Refs để track state real-time trong intervals
  const isDraggingFillRef = useRef(false);
  const isSelectingRef = useRef(false);

  // Auto-scroll hook
  const {
    autoScrollInterval,
    stopAutoScroll,
    handleAutoScrollByMousePosition,
  } = useAutoScroll({
    gridWrapperRef: gridWrapperRef as React.RefObject<HTMLDivElement>,
    isDraggingFill,
    isSelecting,
    isDraggingFillRef,
    isSelectingRef,
  });

  // showFillHandle is now handled by the useFillHandle hook

  // handleFillDrag is now handled by fill handle hook

  // Mouse handlers hook - temporarily commented out due to complexity
  // Will apply after resolving dependencies
  // const mouseHandlers = useMouseHandlers({...});

  // Fill handle hook - will be added after dependencies are resolved

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

  // Use fill handle hook
  const {
    fillHandleVisible: hookFillHandleVisible,
    fillHandlePosition: hookFillHandlePosition,
    fillSourceCell: hookFillSourceCell,
    fillSourceCellInfo: hookFillSourceCellInfo,
    fillTargetCells: hookFillTargetCells,
    showFillHandle: hookShowFillHandle,
    handleFillMouseDown: hookHandleFillMouseDown,
    setFillHandleVisible: hookSetFillHandleVisible,
    setFillSourceCell: hookSetFillSourceCell,
    setFillSourceCellInfo: hookSetFillSourceCellInfo,
  } = useFillHandle({
    selectedCells,
    setSelectedCells,
    gridWrapperRef: gridWrapperRef as React.RefObject<HTMLDivElement>,
    gridRef: gridRef as React.RefObject<{
      api: { refreshCells: (params: unknown) => void };
    }>,
    rowData,
    filteredData,
    isFiltered,
    setFilteredData,
    columnDefs: columnDefs, // Will be replaced with extendedColumnDefs later
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
  });

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

  // Fill handle position updates are now handled by the useFillHandle hook

  // Fill handle visibility and positioning are now handled by the useFillHandle hook

  // Filter functions are now handled by useTableFilter hook

  // Use mouse handlers hook
  const {
    handleMouseDown: hookHandleMouseDown,
    handleMouseOver: hookHandleMouseOver,
    handleMouseUp: hookHandleMouseUp,
    handleClickOutside: hookHandleClickOutside,
  } = useMouseHandlers({
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
    columnDefs: columnDefs, // Will be updated with extendedColumnDefs later
    gridWrapperRef: gridWrapperRef as React.RefObject<HTMLDivElement>,
    showFillHandle: (event: any) => {
      if (event.rowIndex !== null && event.colDef?.field) {
        const cellEvent = {
          rowIndex: event.rowIndex,
          colDef: { field: event.colDef.field },
          event: event.event,
          data: event.data,
        };
        hookShowFillHandle(cellEvent);
      }
    }, // Inline wrapper function
    handleFillDrag: () => {}, // Placeholder function - actual drag handled by useFillHandle
    isDraggingFillRef,
    isSelectingRef,
    isLoadingMore,
    setFillHandleVisible: hookSetFillHandleVisible,
    setFillSourceCell: hookSetFillSourceCell,
    setFillSourceCellInfo: hookSetFillSourceCellInfo,
    stopAutoScroll,
  });

  // Mouse event handlers are now handled by useMouseHandlers hook
  // Create wrapper functions to convert AG-Grid events to hook's CellEvent format
  const wrappedHandleMouseDown = useCallback(
    (event: any) => {
      if (event.rowIndex !== null && event.colDef?.field) {
        const cellEvent = {
          rowIndex: event.rowIndex,
          colDef: { field: event.colDef.field },
          event: event.event,
          data: event.data,
        };
        hookHandleMouseDown(cellEvent);
      }
    },
    [hookHandleMouseDown]
  );

  const wrappedHandleMouseOver = useCallback(
    (event: any) => {
      if (event.rowIndex !== null && event.colDef?.field) {
        const cellEvent = {
          rowIndex: event.rowIndex,
          colDef: { field: event.colDef.field },
          event: event.event,
          data: event.data,
        };
        hookHandleMouseOver(cellEvent);
      }
    },
    [hookHandleMouseOver]
  );

  const wrappedShowFillHandle = useCallback(
    (event: any) => {
      if (event.rowIndex !== null && event.colDef?.field) {
        const cellEvent = {
          rowIndex: event.rowIndex,
          colDef: { field: event.colDef.field },
          event: event.event,
          data: event.data,
        };
        hookShowFillHandle(cellEvent);
      }
    },
    [hookShowFillHandle]
  );

  // Fill handle mouse down is now handled by the useFillHandle hook

  // Fill target cells calculation is now handled by the useFillHandle hook

  // Global mouse movement is now handled by the useFillHandle hook

  // Fill drag handling is now managed by the useFillHandle hook

  // Fill mouse up logic is now handled by the useFillHandle hook

  // Use clipboard hook for handling copy operations
  const { handleKeyDown } = useClipboard({
    gridRef,
    selectedCells,
  });
  const handleImportClick = () => {
    // Close the dropdown after a short delay to allow the click event to complete
    setTimeout(() => {
      setImportDropdownOpen(false);
    }, 300);
  };

  // Hàm xử lý khi scroll để cập nhật vị trí fill handle
  const handleScroll = useCallback(() => {
    if (
      hookFillHandleVisible &&
      !isDraggingFill &&
      !isSelecting &&
      selectedCells.size === 0
    ) {
      hookSetFillSourceCell(null);
    }
  }, [hookFillHandleVisible, isDraggingFill, isSelecting, selectedCells.size]);

  // Infinite scroll handling is now managed by useInfiniteScroll hook

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

    document.addEventListener("mousedown", hookHandleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mouseup", hookHandleMouseUp);

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
      document.removeEventListener("mousedown", hookHandleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseup", hookHandleMouseUp);
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
    hookFillSourceCell,
    hookFillTargetCells,
    handleScroll,
    autoScrollInterval,
    enableInfiniteScroll, // THÊM: để check infinite scroll state
  ]);

  // Global mouse move is now handled by the hooks themselves - this useEffect is no longer needed

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

  // Fill handle positioning is now handled entirely by the useFillHandle hook

  const { theme } = useTheme(); // Lấy trạng thái theme từ next-themes

  // Use column definitions hook
  const { defaultColDef, extendedColumnDefs } = useColumnDefinitions({
    columnDefs,
    selectedCells,
    fillTargetCells: hookFillTargetCells,
    columnFlex,
    enableFilter,
    theme,
    showSTT,
    currentPage,
    pageSize,
    onChangePage,
    isFiltered,
  });

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
    if (gridRef.current?.api && !gridRef.current.api.isDestroyed?.()) {
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

    if (gridRef.current?.api && !gridRef.current.api.isDestroyed?.()) {
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
          if (gridRef.current?.api && !gridRef.current.api.isDestroyed?.()) {
            gridRef.current.api.ensureIndexVisible(
              Math.floor(viewport.top / 40),
              "top"
            );
          }
        }, 10);
      }
    }

    if (
      selectedCells.size > 0 &&
      !hookFillHandleVisible &&
      hookFillSourceCellInfo
    ) {
      hookSetFillHandleVisible(true);
    }
  }, [
    onSelectionChanged,
    selectedCells,
    hookFillHandleVisible,
    hookFillSourceCellInfo,
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
        // Check if API is still valid before removing event listeners
        if (api && !api.isDestroyed?.()) {
          api.removeEventListener("modelUpdated", handleAfterRefresh);
          api.removeEventListener("rowDataUpdated", handleAfterRefresh);
        }
      };
    }
  }, [gridRef.current?.api]);

  // Use grid configuration hook
  const { overlayLoadingTemplate, gridHeight: calculatedGridHeight } =
    useGridConfiguration({
      pagedData: paginatedData,
      maxRowsVisible,
      headerHeight,
      gridOptions,
      loading,
      gridRef,
    });

  // Use Excel export hook for handling export functionality
  const { exportExcel } = useExcelExport({
    isFiltered,
    filteredData,
    rowData,
    columnDefs,
    exportFileName,
    exportDecorated,
  });

  // Create handleExportExcel function that uses the hook
  const handleExportExcel = useCallback(() => {
    exportExcel(gridRef);
  }, [exportExcel, gridRef]);

  // Use calculated data from pagination hook
  const pagedData = paginatedData;

  // Use calculated grid height from hook
  const gridHeight = calculatedGridHeight;

  const firstQuicksearchRef = useRef(0); // Thêm dòng này

  // Use calculated page size options from pagination hook
  const pageSizeOptions = calculatedPageSizeOptions;

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
                  gridRef={gridRef}
                  {...inputSearchProps}
                  isFiltered={isFiltered}
                  onFilterClick={handleOpenFilterModal}
                  enableFilterButton={enableFilter}
                  onInputValueChange={(setValue: string) => {
                    setSearchText(setValue);
                  }}
                  onResetFilter={handleResetFilters}
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
        onMouseUp={hookHandleMouseUp}
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
          onCellMouseDown={wrappedHandleMouseDown}
          onCellClicked={wrappedShowFillHandle}
          onCellFocused={(event) => {
            // Chỉ hiển thị fill handle khi focus nếu không đang trong trạng thái selection hoặc drag
            if (!isSelecting && !isDraggingFill) {
              wrappedShowFillHandle(event);
            }
          }}
          onCellMouseOver={wrappedHandleMouseOver}
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
        {hookFillHandleVisible &&
          hookFillHandlePosition.top !== undefined &&
          hookFillHandlePosition.left !== undefined && (
            <div
              key={`${hookFillHandlePosition.top}-${hookFillHandlePosition.left}`} // Force re-render khi vị trí thay đổi
              className={`fill-handle ${
                autoScrollInterval ? "auto-scrolling" : ""
              }`}
              style={{
                position: "absolute",
                top: `${hookFillHandlePosition.top}px`,
                left: `${hookFillHandlePosition.left}px`,
                zIndex: 1001,
                cursor: "crosshair",
                transform: "translate3d(0, 0, 0)",
                willChange: "transform",
              }}
              onMouseDown={hookHandleFillMouseDown}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!hookFillHandleVisible) {
                  hookSetFillHandleVisible(true);
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
    </div>
  );
};

// Wrapper với Suspense để handle lazy loading
const AgGridComponentWrapper: React.FC<AgGridComponentProps> = (props) => {
  return <AgGridComponent {...props} />;
};

export default AgGridComponentWrapper;
