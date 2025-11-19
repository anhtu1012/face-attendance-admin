"use client";

import { useRef } from "react";
import { Modal, Tag, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { AgGridReact } from "@ag-grid-community/react";
import AgGridComponent from "@/components/basicUI/cTableAG";
import { ExtendedColDef } from "@/components/basicUI/cTableAG/interface/agProps";

import dayjs from "dayjs";
import "./TimekeepingDetailModal.scss";
import { TimekeepingDetailItem } from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";

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
      cellRenderer: (params: { data?: TimekeepingDetailItem }) => {
        if (!params.data) return null;
        const dateObj = dayjs(params.data.date);
        return (
          <div style={{ padding: "4px 0" }}>
            <div style={{ fontWeight: 600, fontSize: "13px" }}>
              {dateObj.format("DD/MM/YYYY")} -
              <span style={{ color: "#999", fontSize: "11px" }}>
                {dateObj.format("dddd")}
              </span>
            </div>
          </div>
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
        return params.data.hasOT ? (
          <Tag color="success" style={{ margin: 0 }}>
            Có
          </Tag>
        ) : (
          <Tag color="default" style={{ margin: 0 }}>
            Không
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
        const statusConfig: Record<string, { color: string; text: string }> = {
          PENDING: { color: "processing", text: "Chưa bắt đầu" },
          START_ONTIME: { color: "success", text: "Đã check-in" },
          START_LATE: { color: "warning", text: "Check-in muộn" },
          END_ONTIME: { color: "success", text: "Hoàn thành" },
          END_EARLY: { color: "warning", text: "Về sớm" },
          END_LATE: { color: "warning", text: "Đi trễ" },
          NOT_WORK: { color: "default", text: "Không có chấm công" },
          FORGET_LOG: { color: "error", text: "Quên chấm công" },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return (
          <Tag color={config.color} style={{ margin: 0 }}>
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
      width={1100}
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
        maxRowsVisible={15}
        exportDecorated={true}
        domLayout="autoHeight"
      />
    </Modal>
  );
}
