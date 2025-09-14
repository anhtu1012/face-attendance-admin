import { useCallback, useEffect } from "react";

interface UseInfiniteScrollProps {
  enableInfiniteScroll: boolean;
  gridRef?: React.RefObject<{ api: unknown }>;
  gridWrapperRef: React.RefObject<HTMLDivElement | null>;
  onLoadMore?: (page: number, pageSize: number) => void;
  hasMore: boolean;
  infiniteScrollThreshold: number;
  total?: number;
  pageSize: number;
  isSelecting: boolean;
  isDraggingCells: boolean;
  isDraggingFill: boolean;
  // Additional state management props
  isLoadingMore: boolean;
  setIsLoadingMore: (value: boolean) => void;
  maxReachedPage: number;
  setMaxReachedPage: (value: number) => void;
  infiniteScrollDebounceTimer: NodeJS.Timeout | null;
  setInfiniteScrollDebounceTimer: (value: NodeJS.Timeout | null) => void;
}

export const useInfiniteScroll = ({
  enableInfiniteScroll,
  gridRef,
  gridWrapperRef,
  onLoadMore,
  hasMore,
  infiniteScrollThreshold,
  total,
  pageSize,
  isSelecting,
  isDraggingCells,
  isDraggingFill,
  isLoadingMore,
  setIsLoadingMore,
  maxReachedPage,
  setMaxReachedPage,
  infiniteScrollDebounceTimer,
  setInfiniteScrollDebounceTimer,
}: UseInfiniteScrollProps) => {
  // States are now managed by parent component and passed as props

  // Reset infinite scroll when enableInfiniteScroll changes
  useEffect(() => {
    if (enableInfiniteScroll) {
      setMaxReachedPage(1);
      setIsLoadingMore(false);

      // Reset các selection states khi thực sự cần thiết (không phải do load more)
      if (!isLoadingMore && !isSelecting) {
        // Chỉ reset khi không phải đang load more và không đang selecting
      }
    }
  }, [
    enableInfiniteScroll,
    isLoadingMore,
    isSelecting,
    setIsLoadingMore,
    setMaxReachedPage,
  ]);

  // Hàm xử lý infinite scroll
  const handleInfiniteScroll = useCallback(() => {
    if (
      !enableInfiniteScroll ||
      !gridRef?.current ||
      !onLoadMore ||
      !hasMore ||
      isLoadingMore
    ) {
      return;
    }

    // Không trigger infinite scroll khi đang trong cell/row selection operations
    if (isSelecting || isDraggingCells || isDraggingFill) {
      return;
    }

    // Debounce để tránh trigger quá nhiều lần
    if (infiniteScrollDebounceTimer) {
      clearTimeout(infiniteScrollDebounceTimer);
    }

    const timer = setTimeout(() => {
      // Lấy viewport của grid
      const gridViewport =
        gridWrapperRef.current?.querySelector(".ag-body-viewport");
      if (!gridViewport) return;

      const { scrollTop, scrollHeight, clientHeight } = gridViewport;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Kiểm tra xem có gần cuối không (dựa trên threshold)
      if (distanceFromBottom <= infiniteScrollThreshold) {
        // Tính trang tiếp theo dựa trên total
        const totalPages = total ? Math.ceil(total / pageSize) : 1;
        const nextPage = maxReachedPage + 1;

        if (nextPage <= totalPages) {
          setIsLoadingMore(true);
          setMaxReachedPage(nextPage);
          onLoadMore(nextPage, pageSize);

          // Reset loading state sau 1 giây (có thể tùy chỉnh)
          setTimeout(() => {
            setIsLoadingMore(false);
          }, 1000);
        }
      }
      setInfiniteScrollDebounceTimer(null);
    }, 150); // Debounce 150ms

    setInfiniteScrollDebounceTimer(timer);
  }, [
    enableInfiniteScroll,
    onLoadMore,
    hasMore,
    isLoadingMore,
    infiniteScrollThreshold,
    total,
    pageSize,
    maxReachedPage,
    gridRef,
    isSelecting,
    isDraggingCells,
    isDraggingFill,
    infiniteScrollDebounceTimer,
    gridWrapperRef,
    setInfiniteScrollDebounceTimer,
    setIsLoadingMore,
    setMaxReachedPage,
  ]);

  // useEffect cho infinite scroll
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const gridViewport =
      gridWrapperRef.current?.querySelector(".ag-body-viewport");
    if (!gridViewport) return;

    gridViewport.addEventListener("scroll", handleInfiniteScroll);

    return () => {
      gridViewport.removeEventListener("scroll", handleInfiniteScroll);
      // Cleanup debounce timer khi component unmount
      if (infiniteScrollDebounceTimer) {
        clearTimeout(infiniteScrollDebounceTimer);
        setInfiniteScrollDebounceTimer(null);
      }
    };
  }, [
    enableInfiniteScroll,
    handleInfiniteScroll,
    infiniteScrollDebounceTimer,
    gridWrapperRef,
    setInfiniteScrollDebounceTimer,
  ]);

  // Update maxReachedPage when it changes externally
  const updateMaxReachedPage = useCallback(
    (page: number) => {
      setMaxReachedPage(Math.max(maxReachedPage, page));
    },
    [maxReachedPage, setMaxReachedPage]
  );

  return {
    isLoadingMore,
    maxReachedPage,
    infiniteScrollDebounceTimer,
    handleInfiniteScroll,
    setIsLoadingMore,
    setMaxReachedPage,
    updateMaxReachedPage,
  };
};
