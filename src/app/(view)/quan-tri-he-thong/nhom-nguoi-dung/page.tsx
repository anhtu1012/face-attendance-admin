/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import { NhomNguoiDungItem } from "@/dtos/quan-tri-he-thong/nhom-nguoi-dung/nhom-nguoi-dung.dto";
import { showError } from "@/hooks/useNotification";
import NhomNguoiDungServices from "@/services/admin/quan-tri-he-thong/nhom-nguoi-dung.service";
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
  const notiMessage = useTranslations("message");
  const t = useTranslations("NhomNguoiDung");
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<NhomNguoiDungItem[]>([]);

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
        showError(error.response?.data?.message || notiMessage("fetchError"));
      }
    },
    [currentPage, pageSize, notiMessage]
  );

  useEffect(() => {
    handleFetchUser(currentPage, pageSize);
  }, [currentPage, handleFetchUser, pageSize]);

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

  return (
    <div>
      <AgGridComponent
        showSearch={true}
        loading={loading}
        rowData={rowData}
        columnDefs={columnDefs}
        gridRef={gridRef}
        total={totalItems}
        pagination={true}
        maxRowsVisible={5}
        onChangePage={handlePageChange}
        columnFlex={1}
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
