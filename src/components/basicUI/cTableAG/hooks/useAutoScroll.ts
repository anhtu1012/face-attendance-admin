import { useCallback, useState } from "react";

interface UseAutoScrollProps {
  gridWrapperRef: React.RefObject<HTMLDivElement>;
  isDraggingFill: boolean;
  isSelecting: boolean;
  isDraggingFillRef: React.RefObject<boolean>;
  isSelectingRef: React.RefObject<boolean>;
}

export const useAutoScroll = ({
  gridWrapperRef,
  isDraggingFill,
  isSelecting,
  isDraggingFillRef,
  isSelectingRef,
}: UseAutoScrollProps) => {
  // Auto-scroll states for fill handle
  const [autoScrollInterval, setAutoScrollInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Hàm xử lý auto-scroll khi drag fill handle
  const handleAutoScroll = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!gridWrapperRef.current || (!isDraggingFill && !isSelecting)) {
        return;
      }

      // Lấy tất cả các container có thể scroll
      const gridViewport = gridWrapperRef.current.querySelector(
        ".ag-body-viewport"
      ) as HTMLElement;
      const centerViewport = gridWrapperRef.current.querySelector(
        ".ag-center-cols-viewport"
      ) as HTMLElement;

      if (!gridViewport) {
        return;
      }

      const scrollStep = 4; // Bước cuộn mỗi lần (giảm để mượt hơn)
      const scrollInterval = 8; // Thời gian giữa các lần cuộn (ms) - nhanh hơn

      // Dừng interval cũ nếu có
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        setAutoScrollInterval(null);
      }

      const interval = setInterval(() => {
        if (!isDraggingFillRef.current && !isSelectingRef.current) {
          clearInterval(interval);
          setAutoScrollInterval(null);
          return;
        }

        // Kiểm tra xem có thể scroll thêm không
        let canScroll = false;
        switch (direction) {
          case "up":
            canScroll = gridViewport.scrollTop > 0;
            if (canScroll) {
              // Sử dụng DOM manipulation để kiểm soát tốt hơn
              const newScrollTop = Math.max(
                0,
                gridViewport.scrollTop - scrollStep
              );
              gridViewport.scrollTop = newScrollTop;
            }
            break;
          case "down":
            const maxScrollTop =
              gridViewport.scrollHeight - gridViewport.clientHeight;
            canScroll = gridViewport.scrollTop < maxScrollTop;
            if (canScroll) {
              const newScrollTop = Math.min(
                maxScrollTop,
                gridViewport.scrollTop + scrollStep
              );
              gridViewport.scrollTop = newScrollTop;
            }
            break;
          case "left":
            // Scroll ngang trái - ưu tiên centerViewport
            const leftScrollContainer = centerViewport || gridViewport;
            canScroll =
              leftScrollContainer && leftScrollContainer.scrollLeft > 0;

            if (canScroll) {
              const newScrollLeft = Math.max(
                0,
                leftScrollContainer.scrollLeft - scrollStep
              );
              leftScrollContainer.scrollLeft = newScrollLeft;
            }
            break;
          case "right":
            // Scroll ngang phải - ưu tiên centerViewport
            const rightScrollContainer = centerViewport || gridViewport;
            const maxScrollLeft = rightScrollContainer
              ? rightScrollContainer.scrollWidth -
                rightScrollContainer.clientWidth
              : 0;
            canScroll =
              rightScrollContainer &&
              rightScrollContainer.scrollLeft < maxScrollLeft;

            if (canScroll) {
              const newScrollLeft = Math.min(
                maxScrollLeft,
                rightScrollContainer.scrollLeft + scrollStep
              );
              rightScrollContainer.scrollLeft = newScrollLeft;
            }
            break;
        }

        // Nếu không thể scroll thêm, dừng interval
        if (!canScroll) {
          clearInterval(interval);
          setAutoScrollInterval(null);
        }
      }, scrollInterval);

      setAutoScrollInterval(interval);
    },
    [
      isDraggingFill,
      isSelecting,
      autoScrollInterval,
      gridWrapperRef,
      isDraggingFillRef,
      isSelectingRef,
    ]
  );

  // Hàm dừng auto-scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }
  }, [autoScrollInterval]);

  // Hàm xử lý auto-scroll dựa trên vị trí chuột
  const handleAutoScrollByMousePosition = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!gridWrapperRef.current || (!isDraggingFill && !isSelecting)) {
        return;
      }

      const gridRect = gridWrapperRef.current.getBoundingClientRect();
      const scrollThreshold = 50; // Giảm threshold để nhạy hơn

      // Kiểm tra vị trí chuột so với khung grid
      const isNearTop = mouseY - gridRect.top < scrollThreshold;
      const isNearBottom = gridRect.bottom - mouseY < scrollThreshold;
      const isNearLeft = mouseX - gridRect.left < scrollThreshold;
      const isNearRight = gridRect.right - mouseX < scrollThreshold;

      // Dừng auto-scroll nếu chuột không ở gần viền
      if (!isNearTop && !isNearBottom && !isNearLeft && !isNearRight) {
        stopAutoScroll();
      } else {
        // Bắt đầu auto-scroll theo hướng tương ứng (dựa vào vị trí chuột)
        if (isNearTop) {
          handleAutoScroll("up");
        } else if (isNearBottom) {
          handleAutoScroll("down");
        } else if (isNearLeft) {
          handleAutoScroll("left");
        } else if (isNearRight) {
          handleAutoScroll("right");
        }
      }
    },
    [
      isDraggingFill,
      isSelecting,
      handleAutoScroll,
      stopAutoScroll,
      gridWrapperRef,
    ]
  );

  return {
    autoScrollInterval,
    handleAutoScroll,
    stopAutoScroll,
    handleAutoScrollByMousePosition,
  };
};
