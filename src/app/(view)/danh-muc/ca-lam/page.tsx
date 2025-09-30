"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { CaLamItem } from "@/dtos/danhMuc/ca-lam/ca-lam.dto";

import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getItemId,
  useHasItemFieldError,
  useItemErrorCellStyle,
} from "@/utils/client/validationHelpers";
import { useSelector } from "react-redux";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import DanhMucCaLamServices from "@/services/danh-muc/ca-lam/caLam.service";

const defaultPageSize = 20;

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("DanhMucCaLam");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItem, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<CaLamItem[]>([]);
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
        field: "code",
        headerName: t("maCaLam"),
        editable: true,
        width: 180,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "code", params);
        },
      },
      {
        field: "name",
        headerName: t("tenCaLam"),
        editable: true,
        width: 180,
      },
      {
        field: "startTime",
        headerName: t("gioBatDau"),
        editable: true,
        context: {
          typeColumn: "Time",
        },
        width: 180,
      },
      {
        field: "endTime",
        headerName: t("gioKetThuc"),
        editable: true,
        context: {
          typeColumn: "Time",
        },
        width: 180,
      },
      {
        field: "workingHours",
        headerName: t("soGioLam"),
        editable: true,
        width: 180,
        context: {
          typeColumn: "Number",
        },
      },
      {
        field: "isActive",
        headerName: t("isActive"),
        editable: true,
        width: 120,
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
        const response = await DanhMucCaLamServices.getDanhMucCaLam(
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

  const dataGrid = useDataGridOperations<CaLamItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      code: "",
      name: "",
      startTime: "",
      endTime: "",
      workingHours: 0,
      isActive: true,
    }),
    duplicateCheckField: "code",
    mes,
    rowData,
    setRowData,
    requiredFields: [
      { field: "code", label: t("maCaLam") },
      { field: "name", label: t("tenCaLam") },
      { field: "startTime", label: t("gioBatDau") },
      { field: "endTime", label: t("gioKetThuc") },
      { field: "workingHours", label: t("soGioLam") },
    ],
    t,
    // Quicksearch parameters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    fetchData,
    columnDefs,
  });
  useEffect(() => {
    fetchData(1, defaultPageSize, "");
  }, [fetchData]);

  // Create save handler (chờ API service được implement)
  const handleSave = dataGrid.createSaveHandler(
    DanhMucCaLamServices.createDanhMucCaLam,
    DanhMucCaLamServices.updateDanhMucCaLam,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler (chờ API service được implement)
  const handleDelete = dataGrid.createDeleteHandler(
    DanhMucCaLamServices.deleteDanhMucCaLam,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  if (!dataGrid.isClient) {
    return null;
  }

  return (
    <LayoutContent
      layoutType={1}
      content1={
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
      }
    />
  );
}

export default Page;
