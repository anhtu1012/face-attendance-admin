/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { BoPhan } from "@/dtos/danhMuc/bo-phan/bophan.dto";

import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import DanhMucBoPhanServices from "@/services/danh-muc/bo-phan/bophan.service";

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
  const t = useTranslations("DanhMucBoPhan");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItem, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<BoPhan[]>([]);
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
        field: "departmentName",
        headerClass: "required-header",
        headerName: t("departmentName"),
        editable: true,
        width: 200,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "departmentName", params);
        },
      },
      {
        field: "description",
        headerClass: "required-header",
        headerName: t("description"),
        editable: true,
        width: 700,
      },
      {
        field: "shiftStartTime",
        headerClass: "required-header",
        headerName: t("shiftStartTime"),
        editable: true,
        width: 200,
        context: {
          typeColumn: "Time",
        },
      },
      {
        field: "shiftEndTime",
        headerClass: "required-header",
        headerName: t("shiftEndTime"),
        editable: true,
        context: {
          typeColumn: "Time",
        },
        width: 150,
      },
      {
        field: "lunchBreak",
        headerName: t("lunchBreak"),
        editable: true,
        width: 150,
        valueFormatter: (params) => {
          if (!params.value) return "00:00";
          const value = String(params.value);

          // Nếu đã là format HH:mm
          if (/^\d{1,2}:\d{2}$/.test(value)) {
            const [hours, minutes] = value.split(":");
            return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
          }

          // Nếu chỉ là số (giờ) - ví dụ: "1" => "01:00"
          const hours = parseInt(value, 10);
          if (!isNaN(hours)) {
            return `${String(hours).padStart(2, "0")}:00`;
          }

          return value;
        },
        valueSetter: (params) => {
          if (!params.newValue) {
            params.data.lunchBreak = "00:00";
            return true;
          }

          const value = String(params.newValue).trim();

          // Nếu đã là format HH:mm
          if (/^\d{1,2}:\d{2}$/.test(value)) {
            const [hours, minutes] = value.split(":");
            params.data.lunchBreak = `${hours.padStart(
              2,
              "0"
            )}:${minutes.padStart(2, "0")}`;
            return true;
          }

          // Nếu chỉ là số (giờ) - ví dụ: "1" => "01:00"
          const hours = parseInt(value, 10);
          if (!isNaN(hours) && hours >= 0 && hours <= 23) {
            params.data.lunchBreak = `${String(hours).padStart(2, "0")}:00`;
            return true;
          }

          // Nếu không hợp lệ, giữ nguyên giá trị cũ
          return false;
        },
      },
      {
        field: "totalWorkHour",
        headerName: t("totalWorkHour"),
        editable: false,
        context: {
          typeColumn: "Number",
        },
        width: 150,
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
        const response = await DanhMucBoPhanServices.getDanhMucBoPhan(
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

  const dataGrid = useDataGridOperations<BoPhan>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      departmentName: "",
      description: "",
      shiftStartTime: "2025-10-26T02:00:00.000Z",
      shiftEndTime: "2025-10-26T11:00:00.000Z",
      lunchBreak: "01:00",
    }),
    duplicateCheckField: "departmentName",
    mes,
    rowData,
    setRowData,
    requiredFields: [{ field: "departmentName", label: t("departmentName") }],
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
    DanhMucBoPhanServices.createDanhMucBoPhan,
    DanhMucBoPhanServices.updateDanhMucBoPhan,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler
  const handleDelete = dataGrid.createDeleteHandler(
    DanhMucBoPhanServices.deleteDanhMucBoPhan,
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
            columnFlex={0}
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
