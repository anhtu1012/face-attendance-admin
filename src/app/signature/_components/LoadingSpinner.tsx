import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Processing your document...</p>
  </div>
);

export default LoadingSpinner;
