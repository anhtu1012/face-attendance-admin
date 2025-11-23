/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FieldTimeOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Row, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import "./UserTimekeepingTab.scss";
import BaoCaoChamCongServices from "@/services/bao-cao/bao-cao-cham-cong.service";
import {
  TimekeepingDetailItem,
  TimekeepingReportData,
} from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";

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
