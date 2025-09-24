/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { showError } from "@/hooks/useNotification";
import { useSelectData } from "@/hooks/useSelectData";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";
import {
  getItemId,
  useHasItemFieldError,
  useItemErrorCellStyle,
} from "@/utils/client/validationHelpers";
import { CellStyle, ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("NguoiDung");
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<NguoiDungItem[]>([]);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );
  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);
  const { selectRole, selectGender } = useSelectData({ fetchRole: true });
  const handleFetchUser = useCallback(
    async (page = currentPage, limit = pageSize, quickSearch?: string) => {
      setLoading(true);
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];
        const response = await NguoiDungServices.getNguoiDung(
          searchFilter,
          quickSearch
        );
        setRowData(response.data);
        setTotalItems(response.count);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [currentPage, mes, pageSize]
  );

  useEffect(() => {
    handleFetchUser(currentPage, pageSize);
  }, [currentPage, handleFetchUser, pageSize]);

  const centerStyle: CellStyle = useMemo(
    () => ({ paddingLeft: 0, display: "flex", justifyContent: "center" }),
    []
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "roleCode",
        headerName: t("roleCode"),
        editable: true,
        width: 180,
        context: {
          typeColumn: "Select",
          selectOptions: selectRole,
        },
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "roleCode", params);
        },
      },
      {
        field: "userName",
        headerName: t("userName"),
        editable: true,
        width: 180,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "userName", params);
        },
      },
      {
        field: "lastName",
        headerName: t("lastName"),
        editable: true,
        width: 150,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "lastName", params);
        },
      },
      {
        field: "firstName",
        headerName: t("firstName"),
        editable: true,
        width: 150,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "firstName", params);
        },
      },
      {
        field: "password",
        headerName: t("password"),
        valueFormatter: () => "*****",
        editable: false,
        width: 150,
      },
      {
        field: "email",
        headerName: "Email",
        editable: true,
        width: 180,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "email", params);
        },
      },
      {
        field: "faceImg",
        headerName: t("faceImg"),
        editable: true,
        width: 150,
      },
      {
        field: "birthday",
        headerName: t("birthDay"),
        editable: true,
        width: 190,
        context: {
          typeColumn: "Date",
        },
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "birthday", params);
        },
      },
      {
        field: "gender",
        headerName: t("gender"),
        editable: true,
        width: 150,
        context: {
          typeColumn: "Select",
          selectOptions: selectGender,
        },
      },
      {
        field: "phone",
        headerName: t("phone"),
        editable: true,
        width: 170,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "phone", params);
        },
      },
      {
        field: "address",
        headerName: t("address"),
        editable: true,
        width: 150,
      },
      {
        field: "isActive",
        headerName: t("isActive"),
        editable: true,
        width: 150,
        cellStyle: centerStyle,
      },
    ],
    [t, selectRole, selectGender, centerStyle, itemErrorCellStyle]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handleFetchUser(page, size);
  };

  const dataGrid = useDataGridOperations<NguoiDungItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      userName: "",
      password: "123",
      roleCode: "",
      firstName: "",
      lastName: "",
      email: "",
      birthDay: new Date(),
      gender: "",
      phone: "",
      isActive: true,
      address: "",
      faceImg: "",
    }),
    duplicateCheckField: "userName",
    mes,
    rowData,
    setRowData,
    requiredFields: [
      { field: "userName", label: t("userName") },
      { field: "password", label: t("password") },
      { field: "roleCode", label: t("roleCode") },
      { field: "firstName", label: t("firstName") },
      { field: "lastName", label: t("lastName") },
      { field: "email", label: "Email" },
      { field: "birthDay", label: t("birthDay") },
      { field: "gender", label: t("gender") },
      { field: "phone", label: t("phone") },
      { field: "isActive", label: t("isActive") },
    ],
    t,
    // Quicksearch parameters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    fetchData: handleFetchUser,
    columnDefs,
  });

  // Create save handler (chờ API service được implement)
  const handleSave = dataGrid.createSaveHandler(
    NguoiDungServices.createNguoiDung,
    NguoiDungServices.updateNguoiDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler (chờ API service được implement)
  const handleDelete = dataGrid.createDeleteHandler(
    NguoiDungServices.deleteNguoiDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
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
            rowData={rowData}
            loading={loading}
            columnDefs={columnDefs}
            gridRef={gridRef}
            total={totalItems}
            paginationPageSize={pageSize}
            rowSelection={{
              mode: "singleRow",
              enableClickSelection: true,
              checkboxes: false,
            }}
            onCellValueChanged={dataGrid.onCellValueChanged}
            paginationCurrentPage={currentPage}
            pagination={true}
            maxRowsVisible={10}
            onChangePage={handlePageChange}
            onQuicksearch={dataGrid.handleQuicksearch}
            columnFlex={0}
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
