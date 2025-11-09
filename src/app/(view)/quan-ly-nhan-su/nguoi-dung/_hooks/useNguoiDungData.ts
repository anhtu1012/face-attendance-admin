/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { showError } from "@/hooks/useNotification";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";

/**
 * Custom hook for Nguoi Dung data fetching and pagination
 * Manages all data-related state and API calls
 */
export function useNguoiDungData() {
  const mes = useTranslations("HandleNotion");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
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

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handleFetchUser(page, size);
  };

  return {
    // State
    currentPage,
    totalItems,
    pageSize,
    loading,
    rowData,
    quickSearchText,
    // Setters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    setRowData,
    // Actions
    handleFetchUser,
    handlePageChange,
  };
}
