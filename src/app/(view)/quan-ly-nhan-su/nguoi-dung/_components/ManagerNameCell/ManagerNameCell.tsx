/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "./ManagerNameCell.scss";

interface ManagerNameCellProps {
  value: string | null;
  data: any;
  onUpdateManager?: (data: any) => void;
}

export function ManagerNameCell({
  value,
  data,
  onUpdateManager,
}: ManagerNameCellProps) {
  if (!value) {
    return (
      <button
        className="update-manager-btn"
        onClick={() => onUpdateManager?.(data)}
      >
        Cập nhật người QL
      </button>
    );
  }

  return <span>{value}</span>;
}
