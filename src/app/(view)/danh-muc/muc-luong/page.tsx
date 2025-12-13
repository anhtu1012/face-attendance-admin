/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { MucLuong } from "@/dtos/danhMuc/muc-luong/mucLuong.dto";

import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import DanhMucMucLuongServices from "@/services/danh-muc/muc-luong/mucLuong.service";

import {
  getItemId,
  useHasItemFieldError,
  useItemErrorCellStyle,
} from "@/utils/client/validationHelpers";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { useTranslations } from "next-intl";

import { useCallback, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

const defaultPageSize = 20;

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("DanhMucMucLuong");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItem, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<MucLuong[]>([]);
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );
  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);

  // Define columnDefs first before dataGrid hook
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "levelName",
        headerClass: "required-header",
        headerName: t("levelName"),
        editable: true,
        width: 300,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "levelName", params);
        },
      },
      {
        field: "startSalary",
        headerClass: "required-header",
        headerName: t("startSalary"),
        editable: true,
        width: 250,
        context: {
          typeColumn: "Number",
        },
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "startSalary", params);
        },
        valueFormatter: (params) => {
          if (!params.value && params.value !== 0) return "";
          return new Intl.NumberFormat("vi-VN").format(params.value);
        },
      },
      {
        field: "endSalary",
        headerClass: "required-header",
        headerName: t("endSalary"),
        editable: true,
        width: 250,
        context: {
          typeColumn: "Number",
        },
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "endSalary", params);
        },
        valueFormatter: (params) => {
          if (!params.value && params.value !== 0) return "";
          return new Intl.NumberFormat("vi-VN").format(params.value);
        },
      },
    ],
    [itemErrorCellStyle, t]
  );

  const fetchData = useCallback(
    async (
      currentPage: number,
      pageSize: number,
      quickSearchText: string | undefined
    ) => {
      setLoading(true);
      try {
        const searchFilter: FilterQueryStringTypeItem[] = [
          { key: "limit", type: FilterOperationType.Eq, value: pageSize },
          {
            key: "offset",
            type: FilterOperationType.Eq,
            value: (currentPage - 1) * pageSize,
          },
        ];
        const response = await DanhMucMucLuongServices.getDanhMucMucLuong(
          searchFilter,
          quickSearchText
        );
        setRowData(response.data);
        setTotalItems(response.count || 0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setRowData, setTotalItems]
  );

  const dataGrid = useDataGridOperations<MucLuong>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      levelName: "",
      startSalary: 0,
      endSalary: 0,
      description: "",
    }),
    duplicateCheckField: "levelName",
    mes,
    rowData,
    setRowData,
    requiredFields: [
      { field: "levelName", label: t("levelName") },
      { field: "startSalary", label: t("startSalary") },
      { field: "endSalary", label: t("endSalary") },
    ],
    t,
    // Quicksearch parameters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    fetchData,
    columnDefs,
  });

  // Create save handler
  const handleSave = dataGrid.createSaveHandler(
    DanhMucMucLuongServices.createDanhMucMucLuong,
    DanhMucMucLuongServices.updateDanhMucMucLuong,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler
  const handleDelete = dataGrid.createDeleteHandler(
    DanhMucMucLuongServices.deleteDanhMucMucLuong,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  if (!dataGrid.isClient) {
    return null;
  }

  return (
    <LayoutContent
      layoutType={1}
      content1={
        <>
          <AgGridComponentWrapper
            showSearch={true}
            rowData={dataGrid.rowData}
            loading={loading}
            columnDefs={columnDefs}
            gridRef={gridRef}
            total={totalItem}
            onCellValueChanged={dataGrid.onCellValueChanged}
            onSelectionChanged={dataGrid.onSelectionChanged}
            pagination={true}
            paginationPageSize={pageSize}
            paginationCurrentPage={currentPage}
            onChangePage={(currentPage, pageSize) => {
              setCurrentPage(currentPage);
              setPageSize(pageSize);
              fetchData(currentPage, pageSize, quickSearchText);
            }}
            rowSelection={{
              mode: "singleRow",
              enableClickSelection: true,
              checkboxes: false,
            }}
            maxRowsVisible={13}
            columnFlex={1}
            onQuicksearch={dataGrid.handleQuicksearch}
            showActionButtons={true}
            actionButtonsProps={{
              onSave: handleSave,
              onDelete: handleDelete,
              rowSelected: dataGrid.rowSelected,
              showAddRowsModal: true,
              modalInitialCount: 1,
              onModalOk: dataGrid.handleModalOk,
              hasDuplicates: dataGrid.duplicateIDs.length > 0,
              hasErrors: dataGrid.hasValidationErrors,
            }}
          />
        </>
      }
    />
  );
}

export default Page;
