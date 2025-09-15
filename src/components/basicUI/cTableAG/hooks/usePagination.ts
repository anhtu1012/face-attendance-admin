import { useState, useEffect, useMemo } from "react";

interface UsePaginationProps {
  paginationCurrentPage: number;
  paginationPageSize: number;
  rowData: unknown[];
  filteredData: unknown[];
  isFiltered: boolean;
  pagination: boolean;
  enableInfiniteScroll: boolean;
  onLoadMore?: (page: number, pageSize: number) => void;
  onChangePage?: (page: number, pageSize: number) => void;
  maxReachedPage: number;
  total?: number;
}

export const usePagination = ({
  paginationCurrentPage,
  paginationPageSize,
  rowData,
  filteredData,
  isFiltered,
  pagination,
  enableInfiniteScroll,
  onLoadMore,
  onChangePage,
  maxReachedPage,
  total,
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(paginationCurrentPage);
  const [pageSize, setPageSize] = useState(paginationPageSize);

  // Sync internal state with props when they change
  useEffect(() => {
    setCurrentPage(paginationCurrentPage);
  }, [paginationCurrentPage]);

  useEffect(() => {
    setPageSize(paginationPageSize);
  }, [paginationPageSize]);

  // Tính toán dữ liệu hiển thị theo trang
  const pagedData = useMemo(() => {
    const data = isFiltered ? filteredData : rowData;

    // Infinite scroll mode: chỉ khi có onLoadMore callback, hiển thị tất cả dữ liệu từ trang 1 đến maxReachedPage
    // Nếu không có onLoadMore thì hoạt động như pagination bình thường
    if (enableInfiniteScroll && onLoadMore && !onChangePage) {
      const maxItems = maxReachedPage * pageSize;
      return data.slice(0, maxItems);
    }

    // Chỉ slice data khi không có onChangePage callback (client-side pagination)
    // Nếu có onChangePage callback thì server đã xử lý pagination rồi
    if (pagination && !onChangePage) {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return data.slice(start, end);
    }
    return data;
  }, [
    isFiltered,
    filteredData,
    rowData,
    pagination,
    currentPage,
    pageSize,
    onChangePage,
    enableInfiniteScroll,
    onLoadMore,
    maxReachedPage,
  ]);

  // Page size options
  const pageSizeOptions = useMemo(() => {
    const baseOptions = ["20", "50", "100", "500", "1000"];
    const apiTotal = typeof total === "number" ? total : rowData.length;
    if (apiTotal > 1000) {
      const roundedToThousand = Math.ceil(apiTotal / 1000) * 1000;
      return [...baseOptions, String(roundedToThousand)];
    }
    return baseOptions;
  }, [total, rowData.length]);

  // Handle page change
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    // Chỉ gọi onChangePage khi không trong filtered state (server-side pagination)
    if (onChangePage && !isFiltered) {
      onChangePage(page, size);
    }
  };

  // Calculate total for display
  const displayTotal = useMemo(() => {
    return typeof total === "number" && total > 0
      ? total
      : isFiltered
      ? filteredData.length
      : rowData.length;
  }, [total, isFiltered, filteredData.length, rowData.length]);

  return {
    currentPage,
    pageSize,
    pagedData,
    pageSizeOptions,
    displayTotal,
    handlePageChange,
    setCurrentPage,
    setPageSize,
  };
};
