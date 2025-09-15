import dynamic from "next/dynamic";
import React from "react";

export interface DynamicAgGridOptions {
  loadingMessage?: string;
  enableSSR?: boolean;
  className?: string;
}

/**
 * Optimized utility function để tạo dynamic AgGridComponent với tối ưu hóa performance
 * Sử dụng function thay vì hook để có thể gọi ở top level
 */
export const createDynamicAgGrid = (options: DynamicAgGridOptions = {}) => {
  const {
    loadingMessage = "Đang tải bảng dữ liệu...",
    enableSSR = false,
    className = "",
  } = options;

  return dynamic(() => 
    import("../components/basicUI/cTableAG").then(mod => ({
      default: mod.default
    })), 
    {
      loading: () => 
        React.createElement('div', {
          className: `flex items-center justify-center h-64 ${className}`
        }, [
          React.createElement('div', {
            key: 'spinner',
            className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
          }),
          React.createElement('span', {
            key: 'message', 
            className: 'ml-2'
          }, loadingMessage)
        ]),
      ssr: enableSSR,
    }
  );
};

/**
 * Pre-configured optimized dynamic AgGridComponent với default settings
 */
export const DynamicAgGrid = dynamic(
  () => import("../components/basicUI/cTableAG").then(mod => ({
    default: mod.default
  })),
  {
    loading: () => 
      React.createElement('div', {
        className: 'flex items-center justify-center h-64'
      }, [
        React.createElement('div', {
          key: 'spinner',
          className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
        }),
        React.createElement('span', {
          key: 'message',
          className: 'ml-2'
        }, 'Đang tải bảng dữ liệu...')
      ]),
    ssr: false,
  }
);
