import React from "react";

interface AgGridLoadingProps {
  message?: string;
  className?: string;
}

const AgGridLoading: React.FC<AgGridLoadingProps> = ({
  message = "Đang tải bảng dữ liệu...",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-96 bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
    >
      {/* Loading spinner với animation tương tự AgGrid */}
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 font-medium">{message}</p>
        <div className="flex items-center justify-center mt-2 space-x-1">
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
          <div
            className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AgGridLoading;
