"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import React, { useMemo, useRef } from "react";

function Page() {
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const rowData = [{ TEST: "Data 1" }];
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "TEST",
        headerName: " Test",
        editable: false,
        width: 150,
      },
    ],
    []
  );
  return (
    <div>
      <AgGridComponent
        rowData={rowData}
        columnDefs={columnDefs}
        gridRef={gridRef}
        maxRowsVisible={16}
        showSearch={true}
        showActionButtons={true}
        columnFlex={0}
      />
    </div>
  );
}

export default Page;
