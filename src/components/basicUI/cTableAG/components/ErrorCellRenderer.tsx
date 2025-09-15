import { ICellRendererParams } from "@ag-grid-community/core";
import React from "react";
// import { ICellRendererParams } from "ag-grid-community";
import { IoWarningOutline } from "react-icons/io5";

export const ErrorCellRenderer = (props: ICellRendererParams) => {
  if (props.data?.isError) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <IoWarningOutline
          style={{ color: "red", marginRight: "4px" }}
          fontSize="medium"
        />
        {props.value}
      </div>
    );
  }

  return <div>{props.value}</div>;
};

export default ErrorCellRenderer;
