"use client";

import {
  TimekeepingDetailItem,
  TimekeepingReportData,
} from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";
import BaoCaoChamCongServices from "@/services/bao-cao/bao-cao-cham-cong.service";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  FireOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Card, DatePicker, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import "./UserTimekeepingTab.scss";

interface UserTimekeepingTabProps {
  userId: string;
}

function UserTimekeepingTab({ userId }: UserTimekeepingTabProps) {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<TimekeepingReportData | null>(null);
  const [details, setDetails] = useState<TimekeepingDetailItem[]>([]);

  const fetchTimekeepingData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await BaoCaoChamCongServices.getTimekeepingReportByUser(
        [],
        undefined,
        {
          userId: userId,
          month: selectedMonth.format("MM"),
        }
      );
      const resDetail = await BaoCaoChamCongServices.getTimekeepingReportDetail(
        [],
        undefined,
        {
          userId: userId,
          startTime: selectedMonth.startOf("month").toISOString(),
          endTime: selectedMonth.endOf("month").toISOString(),
        }
      );

      setSummary(res);
      setDetails(resDetail.data);
    } catch (error) {
      console.error("Error fetching timekeeping data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, selectedMonth]);

  useEffect(() => {
    fetchTimekeepingData();
  }, [fetchTimekeepingData]);

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
              {hours} giờ
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

  const handleExport = () => {
    fetchTimekeepingData();
  };

  return (
    <div className="user-timekeeping-tab">
      {/* Month Selector */}
      <div className="month-selector-wrapper">
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={(date) => date && setSelectedMonth(date)}
          format="MM/YYYY"
          placeholder="Chọn tháng"
          size="large"
          className="month-picker"
        />
        <Button
          type="primary"
          icon={<BiReset />}
          size="large"
          onClick={handleExport}
          className="export-button"
        >
          Làm mới
        </Button>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <div className="salary-stats-container">
          <div className="salary-stats-card">
            <div className="stats-header">
              <CheckCircleOutlined className="stats-icon" />
              <h3 className="stats-title">Tổng quan chấm công</h3>
            </div>

            {/* Highlight Card - Công thực tế */}
            <div className="stat-item-highlight">
              <div className="highlight-icon">
                <CheckCircleOutlined />
              </div>
              <div className="highlight-content">
                <div className="highlight-label">Công thực tế</div>
                <div className="highlight-value">
                  {summary.actualTimekeeping} /{" "}
                  {summary.monthStandardTimekeeping}
                </div>
              </div>
              <CheckCircleOutlined className="highlight-decoration" />
            </div>

            {/* Row 1: Giờ công & Đi muộn */}
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-label-wrapper">
                  <ClockCircleOutlined className="stat-icon" />
                  <span className="stat-label">Giờ công</span>
                </div>
                <div className="stat-value-wrapper">
                  <span className="stat-value">{summary.actualHour}</span>
                  <span className="stat-suffix">
                    / {summary.monthStandardHour}h
                  </span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label-wrapper">
                  <WarningOutlined className="stat-icon" />
                  <span className="stat-label">Đi muộn</span>
                </div>
                <div className="stat-value-wrapper">
                  <span className="stat-value">{summary.lateNumber}</span>
                  <span className="stat-suffix">lần</span>
                </div>
              </div>
            </div>

            {/* Row 2: Về sớm & Nghỉ phép */}
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-label-wrapper">
                  <FieldTimeOutlined className="stat-icon" />
                  <span className="stat-label">Về sớm</span>
                </div>
                <div className="stat-value-wrapper">
                  <span className="stat-value">{summary.earlyNumber}</span>
                  <span className="stat-suffix">lần</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label-wrapper">
                  <CloseCircleOutlined className="stat-icon" />
                  <span className="stat-label">Nghỉ phép</span>
                </div>
                <div className="stat-value-wrapper">
                  <span className="stat-value danger">
                    {summary.offWorkNumber}
                  </span>
                  <span className="stat-suffix">ngày</span>
                </div>
              </div>
            </div>

            {/* Row 3: Quên chấm & OT ngày thường */}
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-label-wrapper">
                  <QuestionCircleOutlined className="stat-icon" />
                  <span className="stat-label">Quên chấm</span>
                </div>
                <div className="stat-value-wrapper">
                  <span className="stat-value danger">
                    {summary.forgetLogNumber}
                  </span>
                  <span className="stat-suffix">lần</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label-wrapper">
                  <FireOutlined className="stat-icon" />
                  <span className="stat-label">OT ngày thường</span>
                </div>
                <div className="stat-value-wrapper">
                  <span className="stat-value">{summary.normalOtHour}</span>
                  <span className="stat-suffix">giờ</span>
                </div>
              </div>
            </div>

            {/* Row 4: OT ngày nghỉ */}
            {/* <div className="stat-row">
              <div className="stat-item">
                <div className="stat-label-wrapper">
                  <FireOutlined className="stat-icon" />
                  <span className="stat-label">OT ngày nghỉ</span>
                </div>
                <div className="stat-value-wrapper">
                  <span className="stat-value">{summary.offDayOtHour}</span>
                  <span className="stat-suffix">giờ</span>
                </div>
              </div>
              <div className="stat-item" style={{ visibility: "hidden" }}>
              
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* Detailed Table */}
      <Card
        title={
          <div className="table-header">
            <span className="table-title">📋 Chi tiết chấm công</span>
            <span className="table-subtitle">
              Tháng {selectedMonth.format("MM/YYYY")}
            </span>
          </div>
        }
        className="detail-card"
      >
        <Table
          columns={columns}
          dataSource={details}
          loading={loading}
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
      </Card>
    </div>
  );
}

export default UserTimekeepingTab;
