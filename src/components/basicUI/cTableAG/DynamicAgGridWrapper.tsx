import React from "react";
import {
  createDynamicAgGrid,
  DynamicAgGridOptions,
} from "@/hooks/useDynamicAgGrid";
import type { AgGridComponentProps } from "./interface/agProps";

interface DynamicAgGridWrapperProps extends AgGridComponentProps {
  dynamicOptions?: DynamicAgGridOptions;
}

/**
 * Wrapper component để sử dụng Dynamic AgGrid một cách dễ dàng
 * Tự động tạo dynamic component với options được truyền vào
 */
const DynamicAgGridWrapper: React.FC<DynamicAgGridWrapperProps> = ({
  dynamicOptions,
  ...agGridProps
}) => {
  // Tạo dynamic component với options
  const AgGridComponent = React.useMemo(
    () => createDynamicAgGrid(dynamicOptions),
    [dynamicOptions]
  );

  return <AgGridComponent {...agGridProps} />;
};

export default DynamicAgGridWrapper;
