/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { NhomNguoiDungItem } from "@/dtos/quan-tri-he-thong/nhom-nguoi-dung/nhom-nguoi-dung.dto";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { showError } from "@/hooks/useNotification";
import NhomNguoiDungServices from "@/services/admin/quan-tri-he-thong/nhom-nguoi-dung.service";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { useTranslations } from "next-intl";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import {
  getItemId,
  useHasItemFieldError,
  useItemErrorCellStyle,
} from "@/utils/client/validationHelpers";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("NhomNguoiDung");
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<NhomNguoiDungItem[]>([]);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );

  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);

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
        const params: any = {};
        if (quickSearchText && quickSearchText.trim() !== "") {
          params.quickSearch = quickSearchText;
        }
        const response = await NhomNguoiDungServices.getNhomNguoiDung(
          searchFilter,
          params
        );
        setRowData(response.data);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setRowData, mes]
  );

  useEffect(() => {
    fetchData(1, 10, "");
  }, [fetchData]);

  const dataGrid = useDataGridOperations<NhomNguoiDungItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      roleCode: "",
      roleName: "",
    }),
    duplicateCheckField: "roleCode",
    mes,
    rowData,
    setRowData,
    requiredFields: [
      { field: "roleCode", label: t("roleCode") },
      { field: "roleName", label: t("roleName") },
    ],
    t,
    // Quicksearch parameters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    fetchData,
  });

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "roleCode",
        headerName: t("roleCode"),
        editable: false,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "roleCode", params);
        },
      },
      {
        field: "roleName",
        headerName: t("roleName"),
        editable: false,
      },
    ],
    [t, itemErrorCellStyle]
  );

  // Create save handler (chờ API service được implement)
  const handleSave = dataGrid.createSaveHandler(
    NhomNguoiDungServices.createNhomNguoiDung,
    NhomNguoiDungServices.updateNhomNguoiDung,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler (chờ API service được implement)
  const handleDelete = dataGrid.createDeleteHandler(
    NhomNguoiDungServices.deleteNhomNguoiDung,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  if (!dataGrid.isClient) {
    return null;
  }

  return (
    <div>
      <LayoutContent
        layoutType={1}
        content1={
          <AgGridComponentWrapper
            showSearch={true}
            rowData={dataGrid.rowData}
            loading={loading}
            columnDefs={columnDefs}
            gridRef={gridRef}
            onCellValueChanged={dataGrid.onCellValueChanged}
            onSelectionChanged={dataGrid.onSelectionChanged}
            pagination={true}
            paginationPageSize={pageSize}
            paginationCurrentPage={currentPage}
            maxRowsVisible={10}
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
    </div>
  );
}

export default Page;
