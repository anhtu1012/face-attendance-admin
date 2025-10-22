/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import { showError } from "@/hooks/useNotification";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./InfoInterviewLeader.scss"; // import SCSS

interface InfoInterviewLeaderProps {
  jobId: string | undefined;
  onSelectedChange?: (selectedUsers: any[]) => void;
}

function InfoInterviewLeader({
  jobId,
  onSelectedChange,
}: InfoInterviewLeaderProps) {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("InfoInterviewLeader");
  const gridRef = useRef<AgGridReact>({} as any);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);

  const handleFetchInterviwer = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const response = await TuyenDungServices.getNguoiPhongVan([], undefined, {
        jobId,
      });
      setRowData(response.data);
      setTotalItems(response.count);
    } catch (error: any) {
      showError(error.response?.data?.message || mes("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [jobId, mes]);

  const columnDefs: ColDef[] = useMemo(
    () => [
      { field: "label", headerName: t("userName") },
      { field: "email", headerName: "Email" },
    ],
    [t]
  );

  useEffect(() => {
    handleFetchInterviwer();
  }, [handleFetchInterviwer]);

  const handleRowSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes() || [];
    const selectedData = selectedNodes.map((node) => node.data);
    onSelectedChange?.(selectedData);
  }, [onSelectedChange]);

  return (
    <div className="info-interview-leader">
      <AgGridComponent
        loading={loading}
        rowSelection={{
          mode: "multiRow",
          enableClickSelection: true,
          checkboxes: true,
        }}
        showSTT={false}
        rowData={rowData}
        columnDefs={columnDefs}
        gridRef={gridRef}
        total={totalItems}
        pagination={false}
        maxRowsVisible={10}
        columnFlex={1}
        showActionButtons={false}
        onSelectionChanged={handleRowSelectionChanged}
      />
    </div>
  );
}

export default InfoInterviewLeader;
