/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SalaryReportItem } from "@/dtos/bao-cao/bao-cao-luong/bao-cao-luong.response.dto";
import { DailySalaryDetail } from "@/dtos/bao-cao/bao-cao-luong/daily-salary-detail.dto";
import BaoCaoSalaryServices from "@/services/bao-cao/bao-cao-luong.service";
import { formatCurrency } from "@/utils/client/formatCurrency";
import {
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FallOutlined,
  FireOutlined,
  RiseOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Button, Card, DatePicker, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import { PiPersonSimpleRun } from "react-icons/pi";
import "./UserSalaryTab.scss";

interface UserSalaryTabProps {
  userId: string;
}

function UserSalaryTab({ userId }: UserSalaryTabProps) {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryReportItem[]>([]);
  const [salaryDataReport, setSalaryDataReport] =
    useState<SalaryReportItem | null>(null);
  const [dailyDetails, setDailyDetails] = useState<
    Record<string, DailySalaryDetail[]>
  >({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>(
    {}
  );
  const fetchSalaryData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await BaoCaoSalaryServices.getSalaryReport([], undefined, {
        userId,
        year: selectedMonth.year(),
      });
      const resMonth = await BaoCaoSalaryServices.getSalaryReport(
        [],
        undefined,
        {
          userId,
          year: selectedMonth.year(),
          month: selectedMonth.month() + 1,
        }
      );
      setSalaryDataReport(resMonth.data[0] || null);
      setSalaryData(res.data);
    } catch (error) {
      console.error("Error fetching salary data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, selectedMonth]);

  // Fetch chi tiết lương theo ngày khi expand row
  const fetchDailyDetails = async (
    monthKey: string,
    record: SalaryReportItem
  ) => {
    // Nếu đã có dữ liệu thì không fetch lại
    if (dailyDetails[monthKey]) {
      return;
    }

    setLoadingDetails((prev) => ({ ...prev, [monthKey]: true }));
    try {
      // record.date may come as "MM/YYYY" (e.g. "11/2025").
      // Safely parse month/year and build start/end ISO strings.
      let monthDate = dayjs(record.date);
      const parts = String(record.date).split("/");
      if (parts.length === 2) {
        const m = parseInt(parts[0], 10);
        const y = parseInt(parts[1], 10);
        if (!Number.isNaN(m) && !Number.isNaN(y)) {
          monthDate = dayjs(new Date(y, m - 1, 1));
        }
      }

      const param = {
        userId,
        fromDate: monthDate.startOf("month").toISOString(),
        toDate: monthDate.endOf("month").toISOString(),
      };
      const response = await BaoCaoSalaryServices.getMonthlySalaryDetail(param);
      setDailyDetails((prev) => ({
        ...prev,
        [monthKey]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching daily details:", error);
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [monthKey]: false }));
    }
  };

  const onExpand = async (expanded: boolean, record: SalaryReportItem) => {
    const monthKey = record.date;
    if (expanded) {
      await fetchDailyDetails(monthKey, record);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  const handleExport = () => {
    fetchSalaryData();
  };

  // Render status attendance icon
  const renderStatusIcon = (status: string) => {
    const statusMap: Record<
      string,
      { icon: React.ReactElement; color: string; text: string }
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

    const statusInfo = statusMap[status] || {
      icon: <CalendarOutlined />,
      color: "default",
      text: status,
    };

    return (
      <Tag icon={statusInfo.icon} color={statusInfo.color}>
        {statusInfo.text}
      </Tag>
    );
  };

  // Render hệ số lương
  const renderSalaryCoefficient = (ratio: string, isHoliday: boolean) => {
    const coef = parseFloat(ratio);
    let color = "default";
    let icon = null;

    if (isHoliday || coef >= 3) {
      color = "red";
      icon = <FireOutlined />;
    } else if (coef >= 2) {
      color = "orange";
      icon = <RiseOutlined />;
    } else if (coef > 1) {
      color = "blue";
    }

    return (
      <Tag icon={icon} color={color} style={{ fontWeight: 700 }}>
        x{ratio}
      </Tag>
    );
  };

  // Columns cho bảng chi tiết theo ngày
  const dailyColumns: ColumnsType<DailySalaryDetail> = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date: string, record: DailySalaryDetail) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: "#1565c0" }}>
            {dayjs(date).format("DD/MM")}
          </div>
          {record.isHoliday && (
            <Tag color="red" style={{ fontSize: "10px", marginTop: 4 }}>
              Ngày lễ
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => renderStatusIcon(status),
    },
    {
      title: "Hệ số",
      dataIndex: "ratio",
      key: "ratio",
      width: 90,
      align: "center",
      render: (ratio: string, record: DailySalaryDetail) =>
        renderSalaryCoefficient(ratio, record.isHoliday),
    },
    {
      title: "Giờ vào",
      dataIndex: "checkInTime",
      key: "checkInTime",
      width: 100,
      render: (time?: string) => time || "—",
    },
    {
      title: "Giờ ra",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      width: 100,
      render: (time?: string) => time || "—",
    },

    {
      title: "Lương",
      dataIndex: "workSalary",
      key: "workSalary",
      width: 140,
      align: "right",
      render: (value: number) => (
        <span style={{ fontWeight: 600, color: "#0288d1" }}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      title: "Lương OT",
      dataIndex: "otSalary",
      key: "otSalary",
      width: 140,
      align: "right",
      render: (value: number) =>
        value > 0 ? (
          <span style={{ fontWeight: 600, color: "#722ed1" }}>
            {formatCurrency(value)}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Phạt",
      dataIndex: "fineAmount",
      key: "fineAmount",
      width: 120,
      align: "right",
      render: (value?: number) =>
        value && value > 0 ? (
          <span style={{ fontWeight: 600, color: "#f44336" }}>
            -{formatCurrency(value)}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Tổng",
      dataIndex: "totalSalary",
      key: "totalSalary",
      width: 160,
      fixed: "right",
      align: "right",
      render: (value: number) => (
        <span
          style={{
            fontWeight: 800,
            fontSize: "15px",
            color: "#0d47a1",
          }}
        >
          {formatCurrency(value)}
        </span>
      ),
    },
  ];

  // Render expanded row content
  const expandedRowRender = (record: SalaryReportItem) => {
    const monthKey = record.date;
    const details = dailyDetails[monthKey] || [];
    const isLoading = loadingDetails[monthKey] || false;

    return (
      <div className="expanded-content">
        <Table
          columns={dailyColumns}
          dataSource={details}
          loading={isLoading}
          rowKey="date"
          pagination={false}
          size="small"
          className="daily-details-table"
          scroll={{ x: 1200 }}
        />
      </div>
    );
  };

  const columns: ColumnsType<SalaryReportItem> = [
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 6 }} />
          Kỳ lương
        </span>
      ),
      dataIndex: "date",
      key: "date",
      width: 140,
      fixed: "left",
      render: (date: string, record: SalaryReportItem) => {
        return (
          <Tooltip title={`Kỳ lương tháng ${date}`}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontWeight: 700, color: "#1565c0", fontSize: "15px" }}
              >
                {date}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: `${
                    record.status === "PAID"
                      ? "#0d5802ff"
                      : record.status === "STOP"
                      ? "#be0404ff"
                      : "#c07e04ff"
                  }`,
                  fontWeight: 600,
                }}
              >
                {record.status === "PAID"
                  ? "Đã trả"
                  : record.status === "STOP"
                  ? "Tạm dừng"
                  : "Đang tính"}
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
          <BankOutlined style={{ marginRight: 6 }} />
          Tổng lương
        </span>
      ),
      dataIndex: "workSalary",
      key: "workSalary",
      width: 200,
      render: (value: number, record: SalaryReportItem) => {
        return (
          <Tooltip
            title={
              <div>
                <div>Tổng cộng: {formatCurrency(value)}</div>
                <div>Thực nhận: {formatCurrency(record.totalSalary)}</div>
              </div>
            }
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontWeight: 800, fontSize: "17px", color: "#0d47a1" }}
              >
                {formatCurrency(value)}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "#f44336",
                  fontWeight: 600,
                }}
              >
                Thực nhận: {formatCurrency(record.totalSalary)}
              </div>
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.workSalary - b.workSalary,
    },
    {
      title: (
        <span>
          <DollarOutlined style={{ marginRight: 6 }} />
          Lương CB
        </span>
      ),
      dataIndex: "grossSalary",
      key: "grossSalary",
      width: 170,
      render: (value: number) => (
        <Tooltip title="Lương cơ bản">
          <span style={{ fontWeight: 600, fontSize: "14px", color: "#0288d1" }}>
            {formatCurrency(value)}
          </span>
        </Tooltip>
      ),
      sorter: (a, b) => a.grossSalary - b.grossSalary,
    },
    {
      title: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 6 }} />
          Lương OT
        </span>
      ),
      dataIndex: "otSalary",
      key: "otSalary",
      width: 170,
      render: (value: number) => (
        <Tooltip title="Lương làm thêm giờ">
          <div
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "#722ed1",
              padding: "4px 10px",
              background:
                value > 0
                  ? "linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)"
                  : "transparent",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            {formatCurrency(value)}
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => a.otSalary - b.otSalary,
    },

    {
      title: (
        <span>
          <FallOutlined style={{ marginRight: 6 }} />
          Phạt
        </span>
      ),
      dataIndex: "totalFine",
      key: "totalFine",
      width: 170,
      render: (value: number) =>
        value > 0 ? (
          <Tooltip title={`Tiền phạt: ${formatCurrency(value)}`}>
            <Tag
              icon={<FallOutlined />}
              color="error"
              style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}
            >
              -{formatCurrency(value)}
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        ),
      sorter: (a, b) => a.totalFine - b.totalFine,
    },
    {
      title: (
        <span>
          <TrophyOutlined style={{ marginRight: 6 }} />
          Tổng giờ làm
        </span>
      ),
      dataIndex: "totalWorkHour",
      key: "totalWorkHour",
      width: 170,
      render: (value: number) =>
        value > 0 ? (
          <Tooltip title={`Tổng: ${value} giờ`}>
            <Tag
              icon={<RiseOutlined />}
              color="success"
              style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}
            >
              {value} giờ
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        ),
      sorter: (a, b) => a.totalWorkHour - b.totalWorkHour,
    },
    {
      title: (
        <span>
          <TrophyOutlined style={{ marginRight: 6 }} />
          Tổng ngày làm
        </span>
      ),
      dataIndex: "totalWorkDay",
      key: "totalWorkDay",
      width: 170,
      render: (value: number) =>
        value > 0 ? (
          <Tooltip title={`Tổng: ${value} ngày`}>
            <Tag
              icon={<RiseOutlined />}
              color="success"
              style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}
            >
              {value} ngày
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        ),
      sorter: (a, b) => a.totalWorkDay - b.totalWorkDay,
    },
    {
      title: (
        <span>
          <PiPersonSimpleRun style={{ marginRight: 6 }} />
          Tổng số lần đi trễ
        </span>
      ),
      dataIndex: "lateCount",
      key: "lateCount",
      width: 170,
      render: (value: number) =>
        value > 0 ? (
          <Tooltip title={`Số lần đi trễ: ${value}`}>
            <Tag
              icon={<RiseOutlined />}
              color="error"
              style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}
            >
              {value} lần
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        ),
      sorter: (a, b) => a.lateCount - b.lateCount,
    },
  ];

  return (
    <div className="user-salary-tab">
      {/* Date Range Selector */}
      <div className="date-range-selector">
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

      {/* Summary Card */}
      <Card className="summary-card" loading={loading}>
        <div className="summary-grid">
          <div className="summary-item summary-total">
            <div className="summary-icon">
              <DollarOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Tổng lương</div>
              <div className="value">
                {formatCurrency(salaryDataReport?.totalSalary || 0)}
              </div>
            </div>
            <div className="summary-badge">💰</div>
          </div>
          <div className="summary-item summary-work">
            <div className="summary-icon">
              <DollarOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Lương cơ bản</div>
              <div className="value">
                {formatCurrency(salaryDataReport?.grossSalary || 0)}
              </div>
            </div>
          </div>
          <div className="summary-item summary-ot">
            <div className="summary-icon">
              <DollarOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Lương OT</div>
              <div className="value">
                {formatCurrency(salaryDataReport?.otSalary || 0)}
              </div>
            </div>
          </div>
          <div className="summary-item summary-bonus">
            <div className="summary-icon">
              <TrophyOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Phụ cấp</div>
              <div className="value">
                {formatCurrency(salaryDataReport?.totalAllowance || 0)}
              </div>
            </div>
            <div className="summary-badge">🎁</div>
          </div>
          <div className="summary-item summary-fine">
            <div className="summary-icon">
              <FallOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Tổng phạt</div>
              <div className="value">
                {formatCurrency(salaryDataReport?.totalFine || 0)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Table */}
      <Card
        title={
          <div className="table-header">
            <span className="table-title">💳 Lịch sử lương </span>
            <span className="table-subtitle">{selectedMonth.year()}</span>
          </div>
        }
        className="detail-card"
      >
        <Table
          columns={columns}
          dataSource={salaryData}
          loading={loading}
          rowKey="date"
          expandable={{
            expandedRowRender,
            onExpand,
            expandRowByClick: false,
            expandIcon: ({ expanded, onExpand, record }) => (
              <Button
                type="text"
                size="small"
                icon={expanded ? "▼" : "▶"}
                onClick={(e) => onExpand(record, e)}
                style={{
                  color: "#1565c0",
                  fontWeight: "bold",
                }}
              />
            ),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          scroll={{ x: 1000 }}
          className="modern-table"
        />
      </Card>
    </div>
  );
}

export default UserSalaryTab;
