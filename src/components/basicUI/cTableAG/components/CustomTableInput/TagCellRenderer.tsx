import { ICellRendererParams } from "@ag-grid-community/core";
import { Tag } from "antd";

interface ExtendedICellRendererParams extends ICellRendererParams {
  colorMap?: Record<string, string>;
  selectOptions?: Array<{ value: string; label: string }>;
}

// Define TagCellRenderer component
const TagCellRenderer = (params: ICellRendererParams) => {
  const colorMap = (params as ExtendedICellRendererParams).colorMap || {};
  const selectOptions =
    (params as ExtendedICellRendererParams).selectOptions || [];
  const color = colorMap[params.value] || "#fff";
  const found = selectOptions.find((item) => item.value === params.value);
  const label = found ? found.label : params.value;
  return <Tag color={color}>{label}</Tag>;
};

export default TagCellRenderer;
