"use client";

import AgGridComponent from "@/components/basicUI/cTableAG";
import { ExtendedColDef } from "@/components/basicUI/cTableAG/interface/agProps";
import { AgGridReact } from "@ag-grid-community/react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Modal, Tag, Tooltip, Typography } from "antd";
import { useRef } from "react";

import { TimekeepingDetailItem } from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";
import dayjs from "dayjs";
import "./TimekeepingDetailModal.scss";

const { Text } = Typography;

interface TimekeepingDetailModalProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  data: TimekeepingDetailItem[];
}

export default function TimekeepingDetailModal({
  open,
  onClose,
  userName,
  data = [],
}: TimekeepingDetailModalProps) {
  const gridRef = useRef<AgGridReact<TimekeepingDetailItem>>(null);

  const columnDefs: ExtendedColDef[] = [
    {
      headerName: "Ngày",
      field: "date",
      width: 180,
      editable: false,
      pinned: "left",
      autoHeight: true,
      cellStyle: {
        whiteSpace: "normal",
        lineHeight: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      cellRenderer: (params: { data?: TimekeepingDetailItem }) => {
        if (!params.data) return null;
        const dateObj = dayjs(params.data.date);
        const dayOfWeek = dayjs(dateObj).format("dddd");
        return (
          <Tooltip
            title={`${dayOfWeek}, ${dayjs(dateObj).format("DD/MM/YYYY")}`}
          >
            <div style={{ textAlign: "center", padding: "10px" }}>
              <div
                style={{ fontWeight: 700, color: "#1565c0", fontSize: "15px" }}
              >
                {dayjs(dateObj).format("DD/MM/YYYY")}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {dayjs(dateObj).format("ddd")}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      headerName: "Giờ vào",
      field: "checkinTime",
      width: 90,
      editable: false,
      cellRenderer: (params: { data?: TimekeepingDetailItem }) => {
        if (!params.data) return null;
        const time = params.data.checkinTime;
        return (
          <div
            style={{
              fontWeight: 600,
              fontSize: "13px",
              color: time ? "#015c92" : "#999",
            }}
          >
            {time || "-"}
          </div>
        );
      },
    },
    {
      headerName: "Giờ ra",
      field: "checkoutTime",
      width: 90,
      editable: false,
      cellRenderer: (params: { data?: TimekeepingDetailItem }) => {
        if (!params.data) return null;
        const time = params.data.checkoutTime;
        return (
          <div
            style={{
              fontWeight: 600,
              fontSize: "13px",
              color: time ? "#52c41a" : "#999",
            }}
          >
            {time || "-"}
          </div>
        );
      },
    },
    {
      headerName: "Giờ làm",
      field: "totalWorkHour",
      width: 90,
      editable: false,
      cellRenderer: (params: { data?: TimekeepingDetailItem }) => {
        if (!params.data) return null;
        const hours = params.data.totalWorkHour;
        const color =
          hours >= 8 ? "#52c41a" : hours > 0 ? "#faad14" : "#ff4d4f";
        return (
          <div style={{ fontWeight: 600, fontSize: "13px", color }}>
            {hours}h
          </div>
        );
      },
    },
    {
      headerName: "Tăng ca",
      field: "hasOT",
      width: 90,
      editable: false,
      cellRenderer: (params: { data?: TimekeepingDetailItem }) => {
        if (!params.data) return null;
        return (
          <Tag
            className="ot-tag"
            color={params.data.hasOT ? "purple" : "default"}
            icon={
              params.data.hasOT ? <FireOutlined /> : <CloseCircleOutlined />
            }
            style={{
              fontWeight: 700,
              fontSize: "15px",
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            {params.data.hasOT ? "Có" : "Không"}
          </Tag>
        );
      },
    },
    {
      headerName: "Trạng thái",
      field: "status",
      width: 150,
      editable: false,
      pinned: "right",
      cellRenderer: (params: { data?: TimekeepingDetailItem }) => {
        if (!params.data) return null;
        const status = params.data.status;
        const statusConfig: Record<
          string,
          { color: string; icon: React.ReactNode; text: string }
        > = {
          PENDING: {
            color: "processing",
            icon: <CheckCircleOutlined />,
            text: "Chưa bắt đầu",
          },
          START_ONTIME: {
            color: "success",
            icon: <CheckCircleOutlined />,
            text: "Đã check-in",
          },
          START_LATE: {
            color: "warning",
            icon: <CheckCircleOutlined />,
            text: "Check-in muộn",
          },
          END_ONTIME: {
            color: "success",
            icon: <CheckCircleOutlined />,
            text: "Hoàn thành",
          },
          END_EARLY: {
            color: "warning",
            icon: <CheckCircleOutlined />,
            text: "Về sớm",
          },
          END_LATE: {
            color: "warning",
            icon: <CheckCircleOutlined />,
            text: "Đi trễ",
          },
          NOT_WORK: {
            color: "default",
            icon: <CheckCircleOutlined />,
            text: "Không có chấm công",
          },
          FORGET_LOG: {
            color: "error",
            icon: <CheckCircleOutlined />,
            text: "Quên chấm công",
          },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return (
          <Tag
            color={config.color}
            icon={config.icon}
            style={{
              fontWeight: 700,
              fontSize: "15px",
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            {config.text}
          </Tag>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ClockCircleOutlined style={{ color: "#ffffffff" }} />
          <Text strong style={{ color: "#ffffffff", fontSize: 20 }}>
            Chi tiết chấm công - {userName}
          </Text>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      className="timekeeping-detail-modal"
    >
      <AgGridComponent
        gridRef={gridRef as React.RefObject<AgGridReact>}
        rowData={data}
        columnDefs={columnDefs}
        showSTT={true}
        showExportExcel={true}
        exportFileName={`ChamCong_${userName}_${
          new Date().toISOString().split("T")[0]
        }`}
        rowSelection={{
          mode: "singleRow",
          enableClickSelection: false,
          checkboxes: false,
        }}
        columnFlex={1}
        maxRowsVisible={10}
        exportDecorated={true}
      />
    </Modal>
  );
}
