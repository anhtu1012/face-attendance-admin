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
  preSelectedEmails?: string[]; // Array of emails to pre-select
  disabled?: boolean; // Disable the entire component
  maxSelectable?: number; // Maximum number of rows that can be selected
}

function InfoInterviewLeader({
  jobId,
  onSelectedChange,
  preSelectedEmails = [],
  disabled = false,
  maxSelectable,
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

  // Pre-select interviewers based on emails when data is loaded
  useEffect(() => {
    if (
      rowData.length > 0 &&
      preSelectedEmails.length > 0 &&
      gridRef.current?.api
    ) {
      // Wait a bit for the grid to be fully rendered
      setTimeout(() => {
        const nodesToSelect: any[] = [];

        gridRef.current.api.forEachNode((node: any) => {
          if (preSelectedEmails.includes(node.data.email)) {
            nodesToSelect.push(node);
          }
        });

        // If maxSelectable is provided, limit how many nodes we pre-select
        const limitedNodes =
          typeof maxSelectable === "number" && maxSelectable >= 0
            ? nodesToSelect.slice(0, maxSelectable)
            : nodesToSelect;

        // Select the nodes
        gridRef.current.api.setNodesSelected({
          nodes: limitedNodes,
          newValue: true,
        });

        // Trigger selection change event with the selected data
        const selectedData = limitedNodes.map((node) => node.data);
        // Call callback asynchronously to avoid flushSync errors
        Promise.resolve().then(() => onSelectedChange?.(selectedData));
      }, 100);
    }
  }, [rowData, preSelectedEmails, onSelectedChange, maxSelectable]);

  const handleRowSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes() || [];
    const selectedData = selectedNodes.map((node) => node.data);
    // Call parent callback asynchronously to avoid flushSync issues
    Promise.resolve().then(() => onSelectedChange?.(selectedData));
  }, [onSelectedChange]);

  return (
    <div
      className={`info-interview-leader ${disabled ? "disabled" : ""}`}
      style={{
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <AgGridComponent
        loading={loading}
        rowSelection={{
          mode: "multiRow",
          enableClickSelection: !disabled,
          checkboxes: true,
          isRowSelectable(node) {
            try {
              if (disabled) {
                try {
                  return preSelectedEmails.includes(node.data?.email);
                } catch {
                  return false;
                }
              }
              if (typeof maxSelectable !== "number") return true;
              const api = gridRef.current?.api;
              const selectedNodes = api?.getSelectedNodes?.() || [];
              const isAlreadySelected = selectedNodes.some(
                (n: any) =>
                  n.rowIndex === node.rowIndex ||
                  n.data?.email === node.data?.email
              );
              // Allow deselecting already selected rows
              if (isAlreadySelected) return true;
              // Allow selecting only if under the limit
              return selectedNodes.length < maxSelectable;
            } catch {
              return true;
            }
          },
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
        onSelectionChanged={disabled ? undefined : handleRowSelectionChanged}
      />
    </div>
  );
}

export default InfoInterviewLeader;
