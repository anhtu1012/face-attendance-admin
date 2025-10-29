import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p style={{ marginTop: "1rem", color: "white", fontSize: "1.125rem" }}>
      Đang tải hợp đồng...
    </p>
  </div>
);

export default LoadingSpinner;
