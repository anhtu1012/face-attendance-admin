/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { NhomNguoiDungItem } from "@/dtos/quan-tri-he-thong/nhom-nguoi-dung/nhom-nguoi-dung.dto";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { showError } from "@/hooks/useNotification";
import NhomNguoiDungServices from "@/services/admin/quan-tri-he-thong/nhom-nguoi-dung.service";
import { buildQuicksearchParams } from "@/utils/client/buildQuicksearchParams/buildQuicksearchParams";
import { validateField } from "@/utils/client/validateTable/validateField ";
import { getItemId } from "@/utils/client/validationHelpers";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("NhomNguoiDung");
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<NhomNguoiDungItem[]>([]);
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
        const response = await NhomNguoiDungServices.getNhomNguoiDung(
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
    [currentPage, pageSize, mes]
  );

  useEffect(() => {
    handleFetchUser(currentPage, pageSize);
  }, [currentPage, handleFetchUser, pageSize]);

  //#region VALIDATE ROW DATA
  const validateRowData = useCallback(
    (data: NhomNguoiDungItem): boolean => {
      let isValid = true;
      const itemId = getItemId(data);
      // const errorMessages: string[] = [];

      const requiredFields: Array<{
        field: keyof NhomNguoiDungItem;
        label: string;
      }> = [{ field: "roleCode", label: t("roleCode") }];

      requiredFields.forEach(({ field, label }) => {
        if (
          !validateField(label, data[field], true, field, "string", itemId, mes)
        ) {
          isValid = false;
        }
      });
      return isValid;
    },
    [t]
  );
  //#endregion

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
  });

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "roleCode",
        headerName: t("roleCode"),
        editable: false,
      },
      {
        field: "roleName",
        headerName: t("roleName"),
        editable: false,
      },
    ],
    [t]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handleFetchUser(page, size);
  };

  // Create save handler (chờ API service được implement)
  const handleSave = dataGrid.createSaveHandler(
    validateRowData,
    NhomNguoiDungServices.createNhomNguoiDung,
    NhomNguoiDungServices.updateNhomNguoiDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler (chờ API service được implement)
  const handleDelete = dataGrid.createDeleteHandler(
    NhomNguoiDungServices.deleteNhomNguoiDung,
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
    [columnDefs]
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
            columnFlex={1}
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
