import React from "react";
import { TimekeepingReportData } from "../../_types/prop";
import { ExtendedColDef } from "@/components/basicUI/cTableAG/interface/agProps";

export const getTimekeepingTableColumn = (): ExtendedColDef[] => {
  return [
    {
      headerName: "Nhân viên",
      field: "fullNameUser",
      pinned: "left",
      width: 200,
      editable: false,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: "16px" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        return (
          <div style={{ padding: "4px 0" }}>
            <div style={{ fontWeight: 600, fontSize: "13px" }}>
              {params.data.fullNameUser}
            </div>
            <div style={{ color: "#8c8c8c", fontSize: "11px" }}>
              {params.data.departmentName} - {params.data.positionName}
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Ngày công",
      field: "actualTimekeeping",
      width: 130,
      editable: false,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const rate =
          params.data.monthStandardTimekeeping > 0
            ? Math.round(
                (params.data.actualTimekeeping /
                  params.data.monthStandardTimekeeping) *
                  100
              )
            : 0;
        const color =
          rate >= 90 ? "#52c41a" : rate >= 70 ? "#faad14" : "#ff4d4f";
        return (
          <span style={{ fontWeight: 600, fontSize: "13px", color }}>
            {params.data.actualTimekeeping}/
            {params.data.monthStandardTimekeeping}
          </span>
        );
      },
      valueGetter: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return "";
        return `${params.data.actualTimekeeping}/${params.data.monthStandardTimekeeping}`;
      },
    },
    {
      headerName: "Giờ công",
      field: "actualHour",
      width: 130,
      editable: false,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const rate =
          params.data.monthStandardHour > 0
            ? Math.round(
                (params.data.actualHour / params.data.monthStandardHour) * 100
              )
            : 0;
        const color =
          rate >= 90 ? "#52c41a" : rate >= 70 ? "#faad14" : "#ff4d4f";
        return (
          <span style={{ fontWeight: 600, fontSize: "13px", color }}>
            {params.data.actualHour}/{params.data.monthStandardHour}h
          </span>
        );
      },
      valueGetter: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return "";
        return `${params.data.actualHour}/${params.data.monthStandardHour}h`;
      },
    },
    {
      headerName: "Đi muộn",
      field: "lateNumber",
      width: 130,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const color = params.data.lateNumber > 0 ? "#ff4d4f" : "#52c41a";
        return (
          <span style={{ fontWeight: 600, fontSize: "16px", color }}>
            {params.data.lateNumber}
          </span>
        );
      },
    },
    {
      headerName: "Về sớm",
      field: "earlyNumber",
      width: 130,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const color = params.data.earlyNumber > 0 ? "#ff7a45" : "#52c41a";
        return (
          <span style={{ fontWeight: 600, fontSize: "16px", color }}>
            {params.data.earlyNumber}
          </span>
        );
      },
    },
    {
      headerName: "Nghỉ việc",
      field: "offWorkNumber",
      width: 130,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const color = params.data.offWorkNumber > 0 ? "#faad14" : "#52c41a";
        return (
          <span style={{ fontWeight: 600, fontSize: "16px", color }}>
            {params.data.offWorkNumber}
          </span>
        );
      },
    },
    {
      headerName: "Quên chấm",
      field: "forgetLogNumber",
      width: 130,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const color = params.data.forgetLogNumber > 0 ? "#1890ff" : "#52c41a";
        return (
          <span style={{ fontWeight: 600, fontSize: "16px", color }}>
            {params.data.forgetLogNumber}
          </span>
        );
      },
    },
    {
      headerName: "TC thường (h)",
      field: "normalOtHour",
      width: 150,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const color = params.data.normalOtHour > 0 ? "#1890ff" : "#8c8c8c";
        return (
          <span style={{ fontWeight: 600, fontSize: "16px", color }}>
            {params.data.normalOtHour}
          </span>
        );
      },
    },
    {
      headerName: "TC nghỉ (h)",
      field: "offDayOtHour",
      width: 150,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const color = params.data.offDayOtHour > 0 ? "#fa8c16" : "#8c8c8c";
        return (
          <span style={{ fontWeight: 600, fontSize: "16px", color }}>
            {params.data.offDayOtHour}
          </span>
        );
      },
    },
    {
      headerName: "TC lễ (h)",
      field: "holidayOtHour",
      width: 140,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const color = params.data.holidayOtHour > 0 ? "#722ed1" : "#8c8c8c";
        return (
          <span style={{ fontWeight: 600, fontSize: "16px", color }}>
            {params.data.holidayOtHour}
          </span>
        );
      },
    },
    {
      headerName: "Phạt muộn",
      field: "lateFine",
      width: 120,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const amount = parseInt(params.data.lateFine.replace(/,/g, ""));
        const color = amount > 0 ? "#cf1322" : "#52c41a";
        return (
          <span style={{ fontWeight: 600, fontSize: "14px", color }}>
            {amount.toLocaleString()}₫
          </span>
        );
      },
      valueGetter: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return "";
        const amount = parseInt(params.data.lateFine.replace(/,/g, ""));
        return `${amount.toLocaleString()}₫`;
      },
    },
    {
      headerName: "Phạt quên",
      field: "forgetLogFine",
      width: 120,
      editable: false,
      context: { typeColumn: "Number" },
      cellRenderer: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        const amount = parseInt(params.data.forgetLogFine.replace(/,/g, ""));
        const color = amount > 0 ? "#cf1322" : "#52c41a";
        return (
          <span style={{ fontWeight: 600, fontSize: "14px", color }}>
            {amount.toLocaleString()}₫
          </span>
        );
      },
      valueGetter: (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return "";
        const amount = parseInt(params.data.forgetLogFine.replace(/,/g, ""));
        return `${amount.toLocaleString()}₫`;
      },
    },
  ];
};
