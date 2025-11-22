/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  Col,
  DatePicker,
  Row,
  Statistic,
  Table,
  Tag,
  Button,
  Tooltip,
} from "antd";
import {
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FireOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import "./UserTimekeepingTab.scss";

interface UserTimekeepingTabProps {
  userId: string;
}

interface TimekeepingSummary {
  actualTimekeeping: number;
  monthStandardTimekeeping: number;
  actualHour: number;
  monthStandardHour: number;
  lateNumber: number;
  earlyNumber: number;
  offWorkNumber: number;
  forgetLogNumber: number;
  normalOtTimekeeping: number;
  normalOtHour: number;
  offDayOtTimekeeping: number;
  offDayOtHour: number;
  holidayOtTimekeeping: number;
  holidayOtHour: number;
  lateFine: string;
  forgetLogFine: string;
  userId: string;
  fullNameUser: string;
  fullNameManager: string;
  positionName: string;
  departmentName: string;
}

interface TimekeepingDetail {
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  status: string;
  note: string;
}

function UserTimekeepingTab({ userId }: UserTimekeepingTabProps) {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<TimekeepingSummary | null>(null);
  const [details, setDetails] = useState<TimekeepingDetail[]>([]);

  const fetchTimekeepingData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockSummary: TimekeepingSummary = {
        actualTimekeeping: 3,
        monthStandardTimekeeping: 20,
        actualHour: 24,
        monthStandardHour: 160,
        lateNumber: 1,
        earlyNumber: 1,
        offWorkNumber: 7,
        forgetLogNumber: 0,
        normalOtTimekeeping: 0,
        normalOtHour: 0,
        offDayOtTimekeeping: 2.25,
        offDayOtHour: 9,
        holidayOtTimekeeping: 0,
        holidayOtHour: 0,
        lateFine: "0",
        forgetLogFine: "0",
        userId: userId,
        fullNameUser: "Phạm Hoàng Phúc",
        fullNameManager: "Anh Nhím",
        positionName: "Frontend Developer",
        departmentName: "Phòng Phát triển phần mềm",
      };

      const mockDetails: TimekeepingDetail[] = [
        {
          date: "2024-11-01",
          checkIn: "08:30:00",
          checkOut: "17:30:00",
          workHours: 8,
          status: "Đúng giờ",
          note: "",
        },
        {
          date: "2024-11-02",
          checkIn: "09:15:00",
          checkOut: "17:20:00",
          workHours: 7.5,
          status: "Đi muộn",
          note: "Đi muộn 15 phút",
        },
        {
          date: "2024-11-03",
          checkIn: "08:00:00",
          checkOut: "18:30:00",
          workHours: 9.5,
          status: "Tăng ca",
          note: "Tăng ca 1.5 giờ",
        },
      ];

      setSummary(mockSummary);
      setDetails(mockDetails);
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
    const configs: any = {
      "Đúng giờ": { color: "success", icon: <CheckCircleOutlined /> },
      "Đi muộn": { color: "warning", icon: <ClockCircleOutlined /> },
      "Về sớm": { color: "warning", icon: <ClockCircleOutlined /> },
      Nghỉ: { color: "error", icon: <CloseCircleOutlined /> },
      "Tăng ca": { color: "blue", icon: <FireOutlined /> },
    };
    return (
      configs[status] || { color: "default", icon: <ClockCircleOutlined /> }
    );
  };

  const columns: ColumnsType<TimekeepingDetail> = [
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
      dataIndex: "checkIn",
      key: "checkIn",
      width: 110,
      render: (time: string) => (
        <Tooltip title="Thời gian check-in">
          <span style={{ fontWeight: 600, fontSize: "14px", color: "#0288d1" }}>
            {time}
          </span>
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
      dataIndex: "checkOut",
      key: "checkOut",
      width: 110,
      render: (time: string) => (
        <Tooltip title="Thời gian check-out">
          <span style={{ fontWeight: 600, fontSize: "14px", color: "#f57c00" }}>
            {time}
          </span>
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
      dataIndex: "workHours",
      key: "workHours",
      width: 120,
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
                borderRadius: "8px",
                border: `2px solid ${isFullDay ? "#b7eb8f" : "#ffe58f"}`,
                display: "inline-block",
              }}
            >
              {hours} giờ
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.workHours - b.workHours,
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
            color={config.color}
            icon={config.icon}
            style={{ fontWeight: 600, fontSize: "13px" }}
          >
            {status}
          </Tag>
        );
      },
      filters: [
        { text: "Đúng giờ", value: "Đúng giờ" },
        { text: "Đi muộn", value: "Đi muộn" },
        { text: "Về sớm", value: "Về sớm" },
        { text: "Nghỉ", value: "Nghỉ" },
        { text: "Tăng ca", value: "Tăng ca" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "📝 Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: { showTitle: false },
      render: (note: string) => (
        <Tooltip title={note || "Không có ghi chú"}>
          <span
            style={{ color: note ? "#475569" : "#cbd5e1", fontWeight: 500 }}
          >
            {note || "—"}
          </span>
        </Tooltip>
      ),
    },
  ];

  const handleExport = () => {
    // Export logic here
    console.log("Exporting data...");
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
          icon={<DownloadOutlined />}
          size="large"
          onClick={handleExport}
          className="export-button"
        >
          Xuất Excel
        </Button>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <Card className="summary-card" loading={loading}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} md={8} lg={6}>
              <div className="stat-item stat-success">
                <div className="stat-icon">✓</div>
                <div className="stat-content">
                  <div className="stat-label">Công thực tế</div>
                  <div className="stat-value">
                    {summary.actualTimekeeping}
                    <span className="stat-suffix">
                      / {summary.monthStandardTimekeeping}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={8} lg={6}>
              <div className="stat-item stat-info">
                <div className="stat-icon">⏱</div>
                <div className="stat-content">
                  <div className="stat-label">Giờ công</div>
                  <div className="stat-value">
                    {summary.actualHour}
                    <span className="stat-suffix">
                      / {summary.monthStandardHour}h
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={8} lg={6}>
              <div className="stat-item stat-warning">
                <div className="stat-icon">⚠</div>
                <div className="stat-content">
                  <div className="stat-label">Đi muộn</div>
                  <div className="stat-value">
                    {summary.lateNumber}
                    <span className="stat-suffix">lần</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={8} lg={6}>
              <div className="stat-item stat-warning">
                <div className="stat-icon">⏰</div>
                <div className="stat-content">
                  <div className="stat-label">Về sớm</div>
                  <div className="stat-value">
                    {summary.earlyNumber}
                    <span className="stat-suffix">lần</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={8} lg={6}>
              <div className="stat-item stat-error">
                <div className="stat-icon">✗</div>
                <div className="stat-content">
                  <div className="stat-label">Nghỉ phép</div>
                  <div className="stat-value">
                    {summary.offWorkNumber}
                    <span className="stat-suffix">ngày</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={8} lg={6}>
              <div className="stat-item stat-error">
                <div className="stat-icon">?</div>
                <div className="stat-content">
                  <div className="stat-label">Quên chấm</div>
                  <div className="stat-value">
                    {summary.forgetLogNumber}
                    <span className="stat-suffix">lần</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={8} lg={6}>
              <div className="stat-item stat-purple">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <div className="stat-label">OT ngày thường</div>
                  <div className="stat-value">
                    {summary.normalOtHour}
                    <span className="stat-suffix">giờ</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={8} lg={6}>
              <div className="stat-item stat-purple">
                <div className="stat-icon">🌙</div>
                <div className="stat-content">
                  <div className="stat-label">OT ngày nghỉ</div>
                  <div className="stat-value">
                    {summary.offDayOtHour}
                    <span className="stat-suffix">giờ</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
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
