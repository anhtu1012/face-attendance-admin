import { useTranslations } from "next-intl";
import { Dispatch, RefObject, SetStateAction } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";

interface UseNguoiDungGridParams {
  gridRef: RefObject<AgGridReact>;
  rowData: NguoiDungItem[];
  setRowData: Dispatch<SetStateAction<NguoiDungItem[]>>;
  columnDefs: ColDef[];
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  setQuickSearchText: Dispatch<SetStateAction<string | undefined>>;
  handleFetchUser: (
    page?: number,
    limit?: number,
    quickSearch?: string
  ) => Promise<void>;
  currentPage: number;
  pageSize: number;
  quickSearchText?: string;
}

/**
 * Custom hook for Nguoi Dung grid operations
 * Handles CRUD operations, validation, and grid interactions
 */
export function useNguoiDungGrid({
  gridRef,
  rowData,
  setRowData,
  columnDefs,
  setCurrentPage,
  setPageSize,
  setQuickSearchText,
  handleFetchUser,
  currentPage,
  pageSize,
  quickSearchText,
}: UseNguoiDungGridParams) {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("NguoiDung");

  const dataGrid = useDataGridOperations<NguoiDungItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      userName: "",
      password: "123",
      roleId: "",
      fullName: "",
      email: "",
      birthDay: new Date(),
      departmentId: "",
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
      { field: "roleId", label: t("roleCode") },
      { field: "fullName", label: t("fullName") },
      { field: "email", label: "Email" },
      { field: "birthDay", label: t("birthDay") },
      { field: "gender", label: t("gender") },
      { field: "phone", label: t("phone") },
      { field: "isActive", label: t("isActive") },
    ],
    t,
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    fetchData: handleFetchUser,
    columnDefs,
  });

  const handleSave = dataGrid.createSaveHandler(
    NguoiDungServices.createNguoiDung,
    NguoiDungServices.updateNguoiDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
  );

  const handleDelete = dataGrid.createDeleteHandler(
    NguoiDungServices.deleteNguoiDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
  );

  return {
    dataGrid,
    handleSave,
    handleDelete,
  };
}
