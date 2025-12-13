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
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleFetchUser = useCallback(
    async (
      page = currentPage,
      limit = pageSize,
      quickSearch?: string,
      filterParams?: Record<string, any>
    ) => {
      setLoading(true);
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];

        const params: Record<string, string | number | boolean> = {};
        const currentFilters = filterParams || filters;

        if (currentFilters.departmentId) {
          params.departmentId = currentFilters.departmentId;
        }
        if (currentFilters.positionId) {
          params.positionId = currentFilters.positionId;
        }
        if (currentFilters.levelSalaryId) {
          params.levelSalaryId = currentFilters.levelSalaryId;
        }
        if (currentFilters.gender) {
          params.gender = currentFilters.gender;
        }

        const response = await NguoiDungServices.getNguoiDung(
          searchFilter,
          quickSearch,
          params
        );
        setRowData(response.data);
        setTotalItems(response.count);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [mes, filters]
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
    filters,
    // Setters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    setRowData,
    setFilters,
    // Actions
    handleFetchUser,
    handlePageChange,
  };
}
