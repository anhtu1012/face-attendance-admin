import { useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CustomTooltip } from "../components/CustomTooltip";
import ErrorCellRenderer from "../components/ErrorCellRenderer";

interface UseGridConfigurationProps {
  maxRowsVisible: number;
  headerHeight?: number;
  pagedData: unknown[];
  gridOptions: Record<string, unknown>;
  loading: boolean;
  gridRef?: React.RefObject<{
    api: {
      showLoadingOverlay: () => void;
      hideOverlay: () => void;
      refreshCells: (params: {
        columns: string[];
        force: boolean;
        suppressFlash: boolean;
      }) => void;
    };
  }>;
}

export const useGridConfiguration = ({
  maxRowsVisible,
  headerHeight,
  pagedData,
  gridOptions: baseGridOptions,
  loading,
  gridRef,
}: UseGridConfigurationProps) => {
  const t = useTranslations("AgGridComponent");

  // Row height (synchronized with AgGridReact prop)
  const rowHeight = 40;

  // Calculate grid height based on current displayed data
  const gridHeight = useMemo(() => {
    const dataLen = pagedData.length;

    // Header height (default ~45px with Quartz theme if not specified)
    const headerPx = typeof headerHeight === "number" ? headerHeight : 45;

    if (dataLen === 0) {
      // Header + placeholder body
      return headerPx + rowHeight * 9;
    }

    // Calculate visible rows based on maxRowsVisible
    const visibleRows = Math.min(
      dataLen,
      Math.max(1, Math.floor(maxRowsVisible))
    );

    // Body height (rows)
    const bodyHeight = Math.max(rowHeight, visibleRows * rowHeight);

    // Total height = header + body
    return headerPx + bodyHeight;
  }, [pagedData.length, maxRowsVisible, rowHeight, headerHeight]);

  // Enhanced grid options
  const gridOptions = useMemo(() => {
    const options = {
      ...baseGridOptions,
      components: {
        ...(typeof baseGridOptions.components === "object" &&
        baseGridOptions.components !== null
          ? baseGridOptions.components
          : {}),
        CustomTooltip: CustomTooltip,
        ErrorCellRenderer: ErrorCellRenderer,
      },
      tooltipShowDelay: 0,
      tooltipMouseTrack: true,
      suppressScrollOnNewData: true,
      suppressAnimationFrame: true,
      suppressRowTransform: true,
    };

    return options;
  }, [baseGridOptions]);

  // Loading overlay template
  const overlayLoadingTemplate = useMemo(
    () => `
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.95);
      z-index: 1000;
    ">
      <div style="
        display: flex;
        gap: 4px;
        margin-bottom: 20px;
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        font-size: 32px;
        color: #1890ff;
      ">
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0s;">H</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.1s;">U</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.2s;">M</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.3s;">A</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.4s;">N</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.5s;">&</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.6s;">M</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.7s;">O</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.8s;">N</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 0.9s;">E</span>
        <span style="animation: letter-bounce 1.4s ease-in-out infinite 1s;">Y</span>
      </div>
      <div style="
        font-size: 16px;
        color: #666;
        font-weight: 500;
        font-family: 'Roboto', sans-serif;
      ">Đang tải dữ liệu...</div>
    </div>
    <style>
      @keyframes letter-bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }
    </style>
  `,
    []
  );

  // No rows overlay template
  const overlayNoRowsTemplate = useMemo(
    () => `<span style="font-size: 16px; color: #666;">${t("Nodata")}</span>`,
    [t]
  );

  // Filter changed handler for STT refresh
  const onFilterChanged = useCallback(() => {
    if (gridRef?.current?.api) {
      // Refresh STT column after filter changes
      setTimeout(() => {
        gridRef.current?.api?.refreshCells({
          columns: ["__stt"],
          force: true,
          suppressFlash: true,
        });
      }, 50);
    }
  }, [gridRef]);

  // Handle loading state changes
  useEffect(() => {
    if (gridRef?.current?.api) {
      if (loading) {
        gridRef.current.api.showLoadingOverlay();
      } else {
        gridRef.current.api.hideOverlay();
      }
    }
  }, [loading, gridRef]);

  return {
    gridHeight,
    rowHeight,
    gridOptions,
    overlayLoadingTemplate,
    overlayNoRowsTemplate,
    onFilterChanged,
  };
};
