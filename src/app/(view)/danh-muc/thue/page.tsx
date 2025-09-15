"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import React, { useMemo, useRef } from "react";

function Page() {
  const t = useTranslations("TAX");
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "taxCode",
        headerName: t("taxCode"),
        editable: true,
        width: 180,
      },
      {
        field: "taxName",
        headerName: t("taxName"),
        editable: true,
        width: 180,
      },
      {
        field: "taxPercent",
        headerName: t("taxPercent"),
        editable: true,
        width: 180,
      },
    ],
    [t]
  );
  return (
    <LayoutContent
      layoutType={1}
      content1={
        <>
          {" "}
          <AgGridComponent
            showSearch={true}
            rowData={[]}
            columnDefs={columnDefs}
            gridRef={gridRef}
            pagination={true}
            maxRowsVisible={5}
            columnFlex={0}
            showActionButtons={true}
          />
        </>
      }
    />
  );
}

export default Page;
