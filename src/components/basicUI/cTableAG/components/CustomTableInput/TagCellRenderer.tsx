"use client";

import { ICellRendererParams } from "@ag-grid-community/core";
import { Tag } from "antd";
import React, { memo, useMemo } from "react";
import "./TagCellRenderer.scss";

interface ExtendedICellRendererParams extends ICellRendererParams {
  colorMap?: Record<string, string>;
  selectOptions?: Array<{ value: string; label: string }>;
}

// Define TagCellRenderer component with memo to prevent unnecessary re-renders
const PRESET_COLORS = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

const TagCellRenderer = memo((params: ICellRendererParams) => {
  const colorMap = (params as ExtendedICellRendererParams).colorMap || {};
  const selectOptions =
    (params as ExtendedICellRendererParams).selectOptions || [];
  const providedColor = colorMap[params.value];

  // If no color is provided, map the cell value deterministically to one of the preset colors
  const color = useMemo(() => {
    if (providedColor) return providedColor;
    const key = String(params.value ?? "");
    // simple hash function
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0; // convert to 32bit int
    }
    const idx = Math.abs(hash) % PRESET_COLORS.length;
    return PRESET_COLORS[idx];
  }, [providedColor, params.value]);
  const found = selectOptions.find((item) => item.value === params.value);
  const label = found ? found.label : params.value;

  // Return null for empty values to avoid rendering empty tags
  if (!label && label !== 0) {
    return null;
  }

  return (
    <div className="tag-cell-renderer">
      <Tag color={color} className="custom-tag">
        {label}
      </Tag>
    </div>
  );
});

TagCellRenderer.displayName = "TagCellRenderer";

export default TagCellRenderer;
