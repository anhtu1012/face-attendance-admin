/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";

interface NguoiDungTableProps {
  rowData: NguoiDungItem[];
  loading: boolean;
  columnDefs: ColDef[];
  actionCellRenderer?: (params: any) => React.ReactNode;
  gridRef: RefObject<AgGridReact>;
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onCellValueChanged: (event: any) => void;
  onChangePage: (page: number, size: number) => void;
  onQuicksearch: (
    searchText: string,
    selectedFilterColumns: any[],
    filterValues: string,
    paginationSize: number
  ) => void;
  onSave: () => void;
  onDelete: () => void;
  rowSelected: any;
  hasDuplicates: boolean;
  hasErrors: boolean;
  onModalOk: (count: number) => void;
}

/**
 * NguoiDungTable Component
 * Renders the AgGrid table with all configured props
 */
export function NguoiDungTable({
  rowData,
  loading,
  columnDefs,
  actionCellRenderer,
  gridRef,
  totalItems,
  pageSize,
  currentPage,
  onCellValueChanged,
  onChangePage,
  onQuicksearch,
  onSave,
  onDelete,
  rowSelected,
  hasDuplicates,
  hasErrors,
  onModalOk,
}: NguoiDungTableProps) {
  return (
    <AgGridComponentWrapper
      showSearch={true}
      rowData={rowData}
      loading={loading}
      columnDefs={columnDefs}
      showToolColumn={!!actionCellRenderer}
      toolColumnRenderer={actionCellRenderer}
      toolColumnWidth={80}
      toolColumnHeaderName=""
      gridRef={gridRef}
      total={totalItems}
      paginationPageSize={pageSize}
      rowSelection={{
        mode: "singleRow",
        enableClickSelection: true,
        checkboxes: false,
      }}
      onCellValueChanged={onCellValueChanged}
      paginationCurrentPage={currentPage}
      pagination={true}
      maxRowsVisible={13}
      onChangePage={onChangePage}
      onQuicksearch={onQuicksearch}
      columnFlex={0}
      showActionButtons={true}
      actionButtonsProps={{
        onSave,
        onDelete,
        hideDelete: true,
        hideDivider: true,
        rowSelected,
        showAddRowsModal: true,
        modalInitialCount: 1,
        onModalOk,
        hasDuplicates,
        hasErrors,
      }}
    />
  );
}
