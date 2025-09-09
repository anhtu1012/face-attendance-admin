/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

interface InfiniteScrollOptions<T, BroadcastMessage> {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  pageSize?: number;
  threshold?: number;
  debounceTime?: number;
  offsetRef: React.MutableRefObject<number>;
  getData: (offset: number, searchTerm?: string) => Promise<T[]>;
  updateData: (prevData: T[], newData: T[]) => void;
  resetData?: () => void;
  broadcastChannel?: {
    message?: BroadcastMessage;
    searchTermExtractor?: (message: BroadcastMessage) => string | undefined;
  };
}

/**
 * Enhanced hook for implementing infinite scrolling with broadcast channel support
 * @param options Configuration options for infinite scrolling
 * @returns Object containing the scroll handler and load more function
 */
export function useInfiniteScroll<T, BroadcastMessage = any>(
  options: InfiniteScrollOptions<T, BroadcastMessage>
) {
  const {
    isLoading,
    setIsLoading,
    pageSize = 15,
    threshold = 9,
    debounceTime = 300,
    offsetRef,
    getData,
    updateData,
    resetData,
    broadcastChannel,
  } = options;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevSearchTermRef = useRef<string | undefined>(undefined);

  const loadMore = useCallback(
    async (searchTerm?: string) => {
      if (isLoading) return;

      try {
        setIsLoading(true);
        const offset = offsetRef.current;

        const data = await getData(offset, searchTerm);
        if (data.length > 0) {
          updateData(data, data);
          offsetRef.current = offset + pageSize;
        } else {
          // When data is empty, pass empty arrays to updateData
          // This ensures data is cleared properly
          updateData([], [{ label: "Không có dữ liệu", value: "" }] as T[]); // Pass empty data to updateData
          offsetRef.current = 0; // Reset offset if no more items
        }
      } catch (error) {
        console.error("Error loading more data:", error);
        // In case of error, still clear data to avoid showing stale results
        updateData([], []);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, offsetRef, getData, updateData, setIsLoading, pageSize]
  );

  const handleScroll = useCallback(
    (itemIndex: number, totalItems: number) => {
      if (totalItems && itemIndex === totalItems - threshold && !isLoading) {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          // Extract search term from broadcast channel if available
          let searchTerm: string | undefined;
          if (
            broadcastChannel?.message &&
            broadcastChannel.searchTermExtractor
          ) {
            searchTerm = broadcastChannel.searchTermExtractor(
              broadcastChannel.message
            );
          }

          loadMore(searchTerm);
          timerRef.current = null;
        }, debounceTime);
      }
    },
    [loadMore, isLoading, threshold, debounceTime, broadcastChannel]
  );

  // Handle broadcast channel search term changes
  useEffect(() => {
    if (broadcastChannel?.message && broadcastChannel.searchTermExtractor) {
      const searchTerm = broadcastChannel.searchTermExtractor(
        broadcastChannel.message
      );
      const trimmedSearchTerm = searchTerm ? searchTerm.trim() : "";
      const prevTrimmedSearchTerm = prevSearchTermRef.current
        ? prevSearchTermRef.current.trim()
        : "";

      if (trimmedSearchTerm !== prevTrimmedSearchTerm) {
        prevSearchTermRef.current = searchTerm;

        if (resetData) {
          resetData();
        }

        offsetRef.current = 0; // Reset offset for new search
        loadMore(searchTerm);
      }
    }
  }, [broadcastChannel?.message, loadMore, offsetRef, resetData]);

  return { handleScroll, loadMore };
}

/**
 * Helper hook that combines search functionality with infinite scrolling
 */
export function useSearchWithInfiniteScroll<
  T,
  BroadcastMessage = any
>(options: {
  getData: (offset: number, searchTerm?: string) => Promise<T[]>;
  initialPageSize?: number;
  broadcastChannel?: {
    message?: BroadcastMessage;
    searchTermExtractor?: (message: BroadcastMessage) => string | undefined;
  };
}) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const offsetRef = useRef(0);

  const resetData = useCallback(() => {
    setData([]);
  }, []);

  const updateData = useCallback((_: any, newData: T[]) => {
    // If newData is empty, reset data to empty array
    if (newData.length === 0) {
      setData([]);
    } else {
      // Otherwise append the new data
      setData((prev) => [...prev, ...newData]);
    }
  }, []);

  const infiniteScroll = useInfiniteScroll<T, BroadcastMessage>({
    isLoading,
    setIsLoading,
    offsetRef,
    getData: options.getData,
    updateData,
    resetData,
    pageSize: options.initialPageSize || 15,
    broadcastChannel: options.broadcastChannel,
  });

  return {
    data,
    isLoading,
    handleScroll: infiniteScroll.handleScroll,
    loadMore: infiniteScroll.loadMore,
    resetData,
  };
}
