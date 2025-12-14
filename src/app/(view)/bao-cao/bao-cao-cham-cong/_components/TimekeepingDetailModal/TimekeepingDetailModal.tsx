"use client";

import { TimekeepingDetailItem } from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Modal, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
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
  const getStatusConfig = (status: string) => {
    const configs: Record<
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

    return (
      configs[status] || {
        color: "default",
        icon: <ClockCircleOutlined />,
        text: status || "Không xác định",
      }
    );
  };

  const columns: ColumnsType<TimekeepingDetailItem> = [
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 6 }} />
          Ngày
        </span>
      ),
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (date: string) => {
        const dayOfWeek = dayjs(date).format("dddd");
        return (
          <Tooltip title={`${dayOfWeek}, ${dayjs(date).format("DD/MM/YYYY")}`}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontWeight: 700, color: "#1565c0", fontSize: "15px" }}
              >
                {dayjs(date).format("DD/MM")}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {dayjs(date).format("ddd")}
              </div>
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: "descend",
    },
    {
      title: (
        <span>
          <FieldTimeOutlined style={{ marginRight: 6 }} />
          Giờ vào
        </span>
      ),
      dataIndex: "checkinTime",
      key: "checkinTime",
      width: 140,
      render: (time: string) => (
        <Tooltip
          title={time ? `Thời gian check-in: ${time}` : "Chưa có thời gian"}
        >
          <div className="time-cell">
            <div className={`time-badge checkin ${time ? "active" : "empty"}`}>
              {time ? (
                <CheckCircleOutlined style={{ color: "#fff", fontSize: 14 }} />
              ) : (
                <CloseCircleOutlined
                  style={{ color: "#94a3b8", fontSize: 14 }}
                />
              )}
              <span className="time-text">{time ?? "—"}</span>
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <span>
          <FieldTimeOutlined style={{ marginRight: 6 }} />
          Giờ ra
        </span>
      ),
      dataIndex: "checkoutTime",
      key: "checkoutTime",
      width: 140,
      render: (time: string) => (
        <Tooltip
          title={time ? `Thời gian check-out: ${time}` : "Chưa có thời gian"}
        >
          <div className="time-cell">
            <div className={`time-badge checkout ${time ? "active" : "empty"}`}>
              {time ? (
                <ClockCircleOutlined style={{ color: "#fff", fontSize: 14 }} />
              ) : (
                <CloseCircleOutlined
                  style={{ color: "#94a3b8", fontSize: 14 }}
                />
              )}
              <span className="time-text">{time ?? "—"}</span>
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 6 }} />
          Giờ công
        </span>
      ),
      dataIndex: "totalWorkHour",
      key: "totalWorkHour",
      width: 150,
      render: (hours: number) => {
        const isFullDay = hours >= 8;
        return (
          <Tooltip title={isFullDay ? "Đủ giờ công" : "Chưa đủ giờ công"}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: isFullDay ? "#52c41a" : "#faad14",
                padding: "4px 12px",
                background: isFullDay ? "#f6ffed" : "#fffbe6",
                borderRadius: "20px",
                border: `2px solid ${isFullDay ? "#b7eb8f" : "#ffe58f"}`,
                display: "inline-block",
              }}
            >
              {hours.toFixed(2)} giờ
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.totalWorkHour - b.totalWorkHour,
    },
    {
      title: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 6 }} />
          Trạng thái
        </span>
      ),
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const config = getStatusConfig(status);
        return (
          <Tag
            className="status-tag"
            color={config.color}
            icon={config.icon}
            style={{
              fontWeight: 700,
              fontSize: "15px",
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            {config.text ?? status}
          </Tag>
        );
      },
      onFilter: (value, record) => record.status === value,
    },
    {
      title: (
        <span>
          <FireOutlined style={{ marginRight: 6 }} />
          Tăng ca
        </span>
      ),
      dataIndex: "hasOT",
      key: "hasOT",
      width: 150,
      render: (hasOT: boolean) => {
        return (
          <Tag
            className="ot-tag"
            color={hasOT ? "purple" : "default"}
            icon={hasOT ? <FireOutlined /> : <CloseCircleOutlined />}
            style={{
              fontWeight: 700,
              fontSize: "15px",
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            {hasOT ? "Có OT" : "Không OT"}
          </Tag>
        );
      },
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ClockCircleOutlined style={{ color: "#262626" }} />
          <Text strong style={{ color: "#262626", fontSize: 20 }}>
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
      <Table
        columns={columns}
        dataSource={data}
        rowKey="date"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          pageSizeOptions: ["10", "20", "50"],
        }}
        scroll={{ x: 800 }}
        className="modern-table"
      />
    </Modal>
  );
}
