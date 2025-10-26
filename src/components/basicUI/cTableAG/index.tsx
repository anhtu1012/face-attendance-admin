/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// Imports for AG Grid modules
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
// Enterprise modules removed to avoid license warnings
// import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
// import { MenuModule } from "@ag-grid-enterprise/menu";
// import { SideBarModule } from "@ag-grid-enterprise/side-bar";
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
import { SelectionInfoBar } from "./components/SelectionInfoBar/SelectionInfoBar";
import { useColumnDefinitions } from "./hooks/useColumnDefinitions";
import { useGridConfiguration } from "./hooks/useGridConfiguration";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
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

// Register only Community modules to avoid Enterprise license warnings
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  // Enterprise modules removed:
  // ColumnsToolPanelModule,
  // MenuModule,
  // SideBarModule,
]);

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
  rowSelection = {
    mode: "multiRow",
    enableClickSelection: true,
    checkboxes: false,
  },
  gridOptions = {},
  pinnedBottomRowData = [],
  headerHeight,
  // sideBar = {}, // Disabled - requires Enterprise license
  loading = false,
  enableFilter = true,
  showSTT = true,
  showToolColumn = false,
  toolColumnRenderer,
  toolColumnWidth = 80,
  toolColumnHeaderName = "",
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
  enableInfiniteScroll = false,
  onLoadMore,
  hasMore = false,
  infiniteScrollThreshold = 100,
  showSelectionInfoBar = false,
  selectionActionButtons,
}) => {
  const t = useTranslations("AgGridComponent");
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const {
    showFilterModal,
    selectedFilterColumns,
    filterValues,
    originalRowData,
    setOriginalRowData,
    filteredData,
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

  // Normalize rowSelection to object format
  const normalizedRowSelection = React.useMemo(() => {
    if (typeof rowSelection === "object") {
      return rowSelection;
    }
    // Fallback for old string format
    const mode = rowSelection === "single" ? "singleRow" : "multiRow";
    return { mode, enableClickSelection: true, checkboxes: true };
  }, [rowSelection]);

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

  // Load AG-Grid styles when needed
  useEffect(() => {
    // Dynamically load AG-Grid CSS
    import("@/styles/ag-grid-styles");
  }, []);

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
  ]);
  const isSelectingRef = useRef(false);

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

  const handleImportClick = () => {
    // Close the dropdown after a short delay to allow the click event to complete
    setTimeout(() => {
      setImportDropdownOpen(false);
    }, 300);
  };
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
      }, 5000);
    }

    return () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, [isSelecting]);

  // Refresh AG Grid cells when selectedCells changes to update CSS classes
  useEffect(() => {
    if (gridRef.current?.api && !gridRef.current.api.isDestroyed?.()) {
      // Force refresh all cells to update selection styling
      gridRef.current.api.refreshCells({ force: true });
    }
  }, [gridRef]);

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
    columnFlex,
    enableFilter,
    theme,
    showSTT,
    showToolColumn,
    toolColumnRenderer,
    toolColumnWidth,
    toolColumnHeaderName,
    currentPage,
    pageSize,
    onChangePage,
    isFiltered,
    selectedCells: new Set<string>(), // Add appropriate value or state for selectedCells
    fillTargetCells: new Set<string>(), // Add appropriate value or state for fillTargetCells
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
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (gridRef.current?.api && !gridRef.current.api.isDestroyed?.()) {
      if (loading) {
        gridRef.current.api.setGridOption("loading", true);
        // Set timeout to force hide loading after 10 seconds
        loadingTimeoutRef.current = setTimeout(() => {
          if (gridRef.current?.api && !gridRef.current.api.isDestroyed?.()) {
            gridRef.current.api.setGridOption("loading", false);
            console.warn(
              "Loading timeout reached in AgGridComponent, forcing hide loading overlay"
            );
          }
        }, 10000);
      } else {
        gridRef.current.api.setGridOption("loading", false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      }
    }
  }, [loading, gridRef]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

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

  // Handle search parameters change
  useEffect(() => {
    firstQuicksearchRef.current += 1;
    if (firstQuicksearchRef.current <= 2) {
      return;
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

  // Handle page reset when search parameters change (separate effect to avoid loops)
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
  }, [selectedFilterColumns, searchText, filterValues]);

  // Wrapper function để debug row clicks
  const handleRowClickWithDebug = useCallback(
    (event: any) => {
      if (onRowClicked) {
        onRowClicked(event);
      }
    },
    [onRowClicked, enableInfiniteScroll, isSelecting]
  );

  // Handle selection changed event
  const handleSelectionChanged = useCallback(() => {
    if (gridRef.current?.api) {
      try {
        // Update selected rows count and data
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRowsCount(selectedNodes.length);
        setSelectedRows(selectedData);

        // Call the callback (without parameters as per interface)
        if (onSelectionChanged) {
          onSelectionChanged();
        }
      } catch (error) {
        console.error("Error in handleSelectionChanged:", error);
        // Still call the callback even if there's an error
        if (onSelectionChanged) {
          onSelectionChanged();
        }
      }
    }
  }, [onSelectionChanged, gridRef]);

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.deselectAll();
      setSelectedRowsCount(0);
      setSelectedRows([]);
    }
  }, [gridRef]);

  // Create action buttons with selected rows injected
  const actionButtonsWithData = React.useMemo(() => {
    if (!selectionActionButtons) return undefined;

    return selectionActionButtons.map((button) => ({
      ...button,
      onClick: () => {
        // Pass selected rows to the onClick handler
        return button.onClick();
      },
    }));
  }, [selectionActionButtons, selectedRows]);

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

      {/* Selection Info Bar */}
      {showSelectionInfoBar &&
        normalizedRowSelection.mode === "multiRow" &&
        normalizedRowSelection.checkboxes && (
          <SelectionInfoBar
            selectedCount={selectedRowsCount}
            loading={loading}
            actionButtons={actionButtonsWithData}
            onClearSelection={handleClearSelection}
          />
        )}

      <div
        ref={gridWrapperRef}
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
          onSelectionChanged={handleSelectionChanged}
          columnDefs={extendedColumnDefs}
          defaultColDef={defaultColDef}
          editType={"fullRow"}
          pivotMode={pivotMode}
          onRowDoubleClicked={onRowDoubleClicked}
          onCellValueChanged={onCellValueChanged}
          onCellEditingStarted={onCellEditingStarted}
          getRowStyle={getRowStyle}
          rowSelection={normalizedRowSelection as any}
          domLayout={domLayout as "normal" | "autoHeight" | "print"}
          rowHeight={40}
          headerHeight={headerHeight}
          stopEditingWhenCellsLoseFocus={true}
          suppressCellFocus={false} // Cho phép focus để hiển thị fill handle
          singleClickEdit={false} // Ngăn single click mở cell editor
          gridOptions={gridOptions}
          tooltipShowDelay={0}
          pinnedBottomRowData={pinnedBottomRowData}
          animateRows={true}
          onFilterChanged={onFilterChanged}
          getRowClass={getRowClass}
          onRowClicked={handleRowClickWithDebug}
          // sideBar={sideBar} // Disabled - requires Enterprise license
          onColumnHeaderClicked={onColumnHeaderClicked}
          onGridReady={(params) => {
            // Configure tooltip parameters directly on the API for immediate effect
            params.api.setGridOption("tooltipShowDelay", 0);

            // Apply loading overlay immediately if needed
            if (loading) {
              // Small delay to ensure grid is ready
              setTimeout(() => {
                params.api.setGridOption("loading", true);
              }, 50);
            } else {
              params.api.setGridOption("loading", false);
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
              popupRender={() => (
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
