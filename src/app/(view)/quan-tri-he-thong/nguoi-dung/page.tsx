/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { showError } from "@/hooks/useNotification";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";
import { buildQuicksearchParams } from "@/utils/client/buildQuicksearchParams/buildQuicksearchParams";
import { validateField } from "@/utils/client/validateTable/validateField ";
import { getItemId } from "@/utils/client/validationHelpers";
import { formatFullDateTime } from "@/utils/dateTime";
import { CellStyle, ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("NguoiDung");
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<NguoiDungItem[]>([]);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );

  const handleFetchUser = useCallback(
    async (page = currentPage, limit = pageSize, quickSearch?: string) => {
      setLoading(true);
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];
        const params: any = {};
        if (quickSearch && quickSearch.trim() !== "") {
          params.quickSearch = quickSearch;
        }
        const response = await NguoiDungServices.getNguoiDung(
          searchFilter,
          params
        );
        setRowData(response.data);
        setTotalItems(response.count);
        setLoading(false);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
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
      },
      {
        field: "userName",
        headerName: t("userName"),
        editable: true,
        width: 180,
      },
      {
        field: "lastName",
        headerName: t("lastName"),
        editable: true,
        width: 150,
      },
      {
        field: "firstName",
        headerName: t("firstName"),
        editable: true,
        width: 150,
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
        valueFormatter: (params) => {
          const date = formatFullDateTime(params.value, true);
          return date ? date : "";
        },
      },
      {
        field: "gender",
        headerName: t("gender"),
        editable: true,
        width: 150,
        valueGetter: (params) =>
          params.data.gender === "M" ? "Male" : "Female",
      },
      {
        field: "phone",
        headerName: t("phone"),
        editable: true,
        width: 170,
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
    [centerStyle, t]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handleFetchUser(page, size);
  };

  //#region VALIDATE ROW DATA
  const validateRowData = useCallback(
    (data: NguoiDungItem): boolean => {
      let isValid = true;
      const itemId = getItemId(data);
      // const errorMessages: string[] = [];

      const requiredFields: Array<{
        field: keyof NguoiDungItem;
        label: string;
      }> = [
        { field: "userName", label: t("userName") },
        { field: "password", label: t("password") },
        { field: "roleCode", label: t("roleCode") },
        { field: "firstName", label: t("firstName") },
        { field: "lastName", label: t("lastName") },
        { field: "email", label: t("email") },
        { field: "birthDay", label: t("birthDay") },
        { field: "gender", label: t("gender") },
        { field: "phone", label: t("phone") },
        { field: "isActive", label: t("isActive") },
      ];

      requiredFields.forEach(({ field, label }) => {
        if (
          !validateField(label, data[field], true, field, "string", itemId, mes)
        ) {
          isValid = false;
        }
      });
      return isValid;
    },
    [mes, t]
  );
  //#endregion

  const dataGrid = useDataGridOperations<NguoiDungItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      userName: "",
      password: "",
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
  });

  // Create save handler (chờ API service được implement)
  const handleSave = dataGrid.createSaveHandler(
    validateRowData,
    NguoiDungServices.createNguoiDung,
    NguoiDungServices.updateNguoiDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler (chờ API service được implement)
  const handleDelete = dataGrid.createDeleteHandler(
    NguoiDungServices.deleteNguoiDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
  );

  const handleQuicksearch = useCallback(
    (
      searchText: string | "",
      selectedFilterColumns: any[],
      filterValues: string | "",
      paginationSize: number
    ) => {
      setCurrentPage(1);
      setPageSize(paginationSize);

      if (!searchText && !filterValues) {
        setQuickSearchText(undefined);
        handleFetchUser(1, paginationSize, undefined);
        return;
      }
      const params = buildQuicksearchParams(
        searchText,
        selectedFilterColumns,
        filterValues,
        columnDefs
      );
      setQuickSearchText(params);
      handleFetchUser(1, paginationSize, params);
    },
    [columnDefs, handleFetchUser]
  );

  return (
    <div>
      <LayoutContent
        layoutType={1}
        content1={
          <AgGridComponent
            showSearch={true}
            loading={loading}
            rowData={rowData}
            columnDefs={columnDefs}
            onCellValueChanged={dataGrid.onCellValueChanged}
            onSelectionChanged={dataGrid.onSelectionChanged}
            gridRef={gridRef}
            total={totalItems}
            paginationPageSize={pageSize}
            paginationCurrentPage={currentPage}
            pagination={true}
            maxRowsVisible={10}
            onChangePage={handlePageChange}
            onQuicksearch={handleQuicksearch}
            columnFlex={0}
            showActionButtons={true}
            actionButtonsProps={{
              onSave: handleSave,
              onDelete: handleDelete,
              rowSelected: dataGrid.rowSelected,
              showAddRowsModal: true,
              modalInitialCount: 1,
              onModalOk: dataGrid.handleModalOk,
            }}
          />
        }
      />
    </div>
  );
}

export default Page;
