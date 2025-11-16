import React from "react";
import { SalaryReportData } from "../../_types/prop";
import { ExtendedColDef } from "@/components/basicUI/cTableAG/interface/agProps";

export const getSalaryTableColumn = (): ExtendedColDef[] => {
  return [
    {
      headerName: "Nhân viên",
      field: "fullNameUser",
      pinned: "left",
      width: 200,
      editable: false,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: "16px" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
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
      headerName: "Người quản lý",
      field: "fullNameManager",
      width: 180,
      editable: false,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
        if (!params.data) return null;
        return (
          <span style={{ fontWeight: 500, fontSize: "13px" }}>
            {params.data.fullNameManager}
          </span>
        );
      },
    },
    {
      headerName: "Ngày",
      field: "date",
      width: 130,
      editable: false,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
        if (!params.data) return null;
        return (
          <span style={{ fontWeight: 500, fontSize: "13px" }}>
            {params.data.date}
          </span>
        );
      },
    },
    {
      headerName: "Tổng lương",
      field: "totalSalary",
      width: 150,
      editable: false,
      cellStyle: { textAlign: "right", fontWeight: "bold" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
        if (!params.data) return null;
        return (
          <span style={{ fontSize: "14px", color: "#52c41a" }}>
            {params.data.totalSalary.toLocaleString("vi-VN")} ₫
          </span>
        );
      },
      valueGetter: (params: { data?: SalaryReportData }) => {
        if (!params.data) return "";
        return params.data.totalSalary;
      },
    },
    {
      headerName: "Lương công việc",
      field: "workSalary",
      width: 150,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
        if (!params.data) return null;
        return (
          <span style={{ fontSize: "13px", color: "#1890ff" }}>
            {params.data.workSalary.toLocaleString("vi-VN")} ₫
          </span>
        );
      },
      valueGetter: (params: { data?: SalaryReportData }) => {
        if (!params.data) return "";
        return params.data.workSalary;
      },
    },
    {
      headerName: "Lương OT",
      field: "otSalary",
      width: 140,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
        if (!params.data) return null;
        const color = params.data.otSalary > 0 ? "#fa8c16" : "#8c8c8c";
        return (
          <span style={{ fontSize: "13px", color }}>
            {params.data.otSalary.toLocaleString("vi-VN")} ₫
          </span>
        );
      },
      valueGetter: (params: { data?: SalaryReportData }) => {
        if (!params.data) return "";
        return params.data.otSalary;
      },
    },
    {
      headerName: "Có OT",
      field: "hasOT",
      width: 120,
      editable: false,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
        if (!params.data) return null;
        const hasOT = params.data.hasOT > 0;
        return (
          <span
            style={{
              fontSize: "13px",
              color: hasOT ? "#52c41a" : "#8c8c8c",
              fontWeight: 600,
            }}
          >
            {hasOT ? "Có" : "Không"}
          </span>
        );
      },
    },
    {
      headerName: "Tổng phạt",
      field: "totalFine",
      width: 140,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
        if (!params.data) return null;
        const color = params.data.totalFine > 0 ? "#ff4d4f" : "#52c41a";
        return (
          <span style={{ fontSize: "13px", color, fontWeight: 600 }}>
            {params.data.totalFine.toLocaleString("vi-VN")} ₫
          </span>
        );
      },
      valueGetter: (params: { data?: SalaryReportData }) => {
        if (!params.data) return "";
        return params.data.totalFine;
      },
    },
    {
      headerName: "Ngày lễ",
      field: "isHoliday",
      width: 120,
      editable: false,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: { data?: SalaryReportData }) => {
        if (!params.data) return null;
        const isHoliday = params.data.isHoliday > 0;
        return (
          <span
            style={{
              fontSize: "13px",
              color: isHoliday ? "#722ed1" : "#8c8c8c",
              fontWeight: 600,
            }}
          >
            {isHoliday ? "Có" : "Không"}
          </span>
        );
      },
    },
  ];
};
