/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import { showError } from "@/hooks/useNotification";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function Page() {
  const notiMessage = useTranslations("message");
  const t = useTranslations("NguoiDung");
  const gridRef = useRef<AgGridReact>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<NguoiDungItem[]>([]);

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
        showError(error.response?.data?.message || notiMessage("fetchError"));
      }
    },
    [currentPage, pageSize, notiMessage]
  );

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);

  useEffect(() => {
    handleFetchUser(currentPage, pageSize);
  }, [currentPage, handleFetchUser, pageSize]);

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
        field: "firstName",
        headerName: t("firstName"),
        editable: true,
        width: 150,
      },
      {
        field: "lastName",
        headerName: t("lastName"),
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
        width: 170,
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
      },
    ],
    [t]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handleFetchUser(page, size);
  };

  return (
    <div>
      <AgGridComponent
        showSearch={true}
        inputSearchProps={{
          id: "filter-text-box",
          onInput: onFilterTextBoxChanged,
        }}
        loading={loading}
        rowData={rowData}
        columnDefs={columnDefs}
        gridRef={gridRef}
        total={totalItems}
        pagination={true}
        maxRowsVisible={5}
        onChangePage={handlePageChange}
        columnFlex={0}
        showActionButtons={true}
        // actionButtonsProps={{
        //   onDelete: deleteRow,
        //   onSave: onSave,
        //   rowSelected,
        //   showAddRowsModal: true,
        //   modalInitialCount: 1,
        //   onModalOk: handleModalOk,
        // }}
      />
    </div>
  );
}

export default Page;
