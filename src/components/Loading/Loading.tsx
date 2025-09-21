import React from "react";
import "./Loading.scss";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="running">
        <div className="outer">
          <div className="body">
            <div className="arm behind"></div>
            <div className="arm front"></div>
            <div className="leg behind"></div>
            <div className="leg front"></div>
          </div>
        </div>
      </div>
      <span className="loading-text">Đợi chút xíu nha...</span>
    </div>
  );
};

export default Loading;
