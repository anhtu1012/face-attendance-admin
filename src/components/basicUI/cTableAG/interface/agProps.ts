/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CellEditingStartedEvent,
  CellValueChangedEvent,
  ColDef,
  RowDoubleClickedEvent,
} from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { InputSearchProps } from "../../InputSearch";
import { ActionButtonsProps } from "@/components/action-button";
export interface ExtendedColDef extends ColDef {
  context?: {
    typeColumn?: "Select" | "Text" | "Number" | "Date" | "Time" | "Tag";
    selectOptions?: Array<{ value: any; label: string }>;
    // API integration for Select columns
    onSearchAPI?: (
      searchText: string
    ) => Promise<Array<{ value: any; label: string }>>;
    apiDebounceTime?: number; // Debounce time for API calls (default: 500ms)
    minSearchLength?: number; // Minimum characters to trigger API call (default: 1)
    loadingInitialOptions?: boolean; // Whether to show loading when mounting
    onSelect?: (selectedOption: any) => void; // Callback when an option is selected
  };
}
export interface AgGridComponentProps {
  rowData: any[];
  columnDefs: ExtendedColDef[];
  onCellValueChanged?: (event: CellValueChangedEvent) => void; //Edit table
  onCellEditingStarted?: (event: CellEditingStartedEvent) => void; //Edit table
  onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void;
  onSelectionChanged?: () => void; // Add onSelectionChanged prop
  gridRef: React.RefObject<AgGridReact>;
  maxRowsVisible?: number; // Prop to limit the number of visible rows
  columnFlex?: number; // New prop to allow users to define flex
  rowSelection?: {
    mode: "singleRow" | "multiRow";
    enableClickSelection?: boolean;
    checkboxes?: boolean;
  };
  rownumber?: boolean;
  gridOptions?: any;
  pinnedBottomRowData?: any[];
  getRowStyle?: any;
  headerHeight?: any;
  // sideBar?: any; // Disabled - requires Enterprise license
  onGridReady?: (params: any) => void; // Thêm prop onGridReady
  loading?: boolean; // Prop để quản lý trạng thái loading
  enableFilter?: boolean;
  showSTT?: boolean; // Add new prop to control STT visibility
  showToolColumn?: boolean; // Add new prop to control tool column visibility
  toolColumnRenderer?: (params: any) => React.ReactNode; // Custom renderer for tool column
  toolColumnWidth?: number; // Width of the tool column (default: 80)
  toolColumnHeaderName?: string; // Header name for the tool column (default: "")
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
