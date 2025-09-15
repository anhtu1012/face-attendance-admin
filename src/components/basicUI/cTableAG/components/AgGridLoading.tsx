import React from "react";
import "./AgGridLoading.scss";

interface AgGridLoadingProps {
  message?: string;
  className?: string;
}

const AgGridLoading: React.FC<AgGridLoadingProps> = ({
  message = "Đang tải bảng dữ liệu...",
  className = "",
}) => {
  return (
    <div className={`aggrid-loading ${className}`}>
      {/* Loading spinner */}
      <div className="spinner">
        <div className="spinner-inner"></div>
      </div>

      {/* Loading text */}
      <div className="loading-text">
        <p>{message}</p>
        <div className="dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default AgGridLoading;
