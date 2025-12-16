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
  DownOutlined,
  FieldTimeOutlined,
  FireOutlined,
  RightOutlined,
  RiseOutlined,
  SyncOutlined,
  TrophyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Badge, Button, DatePicker, Progress, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
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
      width: 100,
      fixed: "left",
      render: (date: string, record: DailySalaryDetail) => (
        <div className="date-cell">
          <span className="day-number">{dayjs(date).format("DD")}</span>
          <span className="day-name">{dayjs(date).format("ddd")}</span>
          {record.isHoliday && (
            <Badge status="error" text="Lễ" className="holiday-badge" />
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => renderStatusIcon(status),
    },
    {
      title: "Hệ số",
      dataIndex: "ratio",
      key: "ratio",
      width: 80,
      align: "center",
      render: (ratio: string, record: DailySalaryDetail) =>
        renderSalaryCoefficient(ratio, record.isHoliday),
    },
    {
      title: "Check-in",
      dataIndex: "checkInTime",
      key: "checkInTime",
      width: 100,
      align: "center",
      render: (time?: string) => (
        <span className={`time-cell ${time ? "active" : "inactive"}`}>
          {time || "—"}
        </span>
      ),
    },
    {
      title: "Check-out",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      width: 100,
      align: "center",
      render: (time?: string) => (
        <span className={`time-cell ${time ? "active" : "inactive"}`}>
          {time || "—"}
        </span>
      ),
    },
    {
      title: "Lương ngày",
      dataIndex: "workSalary",
      key: "workSalary",
      width: 130,
      align: "right",
      render: (value: number) => (
        <span className="salary-value primary">{formatCurrency(value)}</span>
      ),
    },
    {
      title: "Lương OT",
      dataIndex: "otSalary",
      key: "otSalary",
      width: 130,
      align: "right",
      render: (value: number) =>
        value > 0 ? (
          <span className="salary-value purple">{formatCurrency(value)}</span>
        ) : (
          <span className="empty-value">—</span>
        ),
    },
    {
      title: "Phạt",
      dataIndex: "totalFine",
      key: "totalFine",
      width: 120,
      align: "right",
      render: (value?: number) =>
        value && value > 0 ? (
          <span className="salary-value danger">-{formatCurrency(value)}</span>
        ) : (
          <span className="empty-value">—</span>
        ),
    },
    {
      title: "Tổng",
      dataIndex: "totalSalary",
      key: "totalSalary",
      width: 140,
      fixed: "right",
      align: "right",
      render: (value: number) => (
        <span className="salary-value total">{formatCurrency(value)}</span>
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
        <div className="expanded-header">
          <FieldTimeOutlined />
          <span>Chi tiết lương theo ngày - Tháng {record.date}</span>
        </div>
        <Table
          columns={dailyColumns}
          dataSource={details}
          loading={isLoading}
          rowKey="date"
          pagination={false}
          size="small"
          className="daily-details-table"
          scroll={{ x: 1100 }}
        />
      </div>
    );
  };

  const columns: ColumnsType<SalaryReportItem> = [
    {
      title: "Kỳ lương",
      dataIndex: "date",
      key: "date",
      width: 100,
      fixed: "left",
      render: (date: string) => {
        return (
          <div className="period-cell">
            <CalendarOutlined className="period-icon" />
            <span className="period-date">{date}</span>
          </div>
        );
      },
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: "descend",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      render: (_: string, record: SalaryReportItem) => {
        const statusConfig = {
          PAID: { color: "#10b981", bg: "#d1fae5", text: "Đã gửi bảng lương" },
          STOP: { color: "#ef4444", bg: "#fee2e2", text: "Tạm dừng" },
          DEFAULT: {
            color: "#f59e0b",
            bg: "#fef3c7",
            text: "Đang trong tháng",
          },
        };
        const status =
          statusConfig[record.status as keyof typeof statusConfig] ||
          statusConfig.DEFAULT;

        return (
          <span
            className="period-status"
            style={{ color: status.color, backgroundColor: status.bg }}
          >
            {status.text}
          </span>
        );
      },
    },
    {
      title: "Lương cơ bản",
      dataIndex: "grossSalary",
      key: "grossSalary",
      width: 140,
      align: "right",
      render: (value: number) => (
        <div className="money-cell">
          <span className="money-value">{formatCurrency(value)}</span>
        </div>
      ),
      sorter: (a, b) => a.grossSalary - b.grossSalary,
    },
    {
      title: "Lương công",
      dataIndex: "workSalary",
      key: "workSalary",
      width: 140,
      align: "right",
      render: (value: number) => (
        <div className="money-cell">
          <span className="money-value primary">{formatCurrency(value)}</span>
        </div>
      ),
      sorter: (a, b) => a.workSalary - b.workSalary,
    },
    {
      title: "Lương OT",
      dataIndex: "otSalary",
      key: "otSalary",
      width: 130,
      align: "right",
      render: (value: number) => (
        <div className="money-cell">
          {value > 0 ? (
            <span className="money-value purple">{formatCurrency(value)}</span>
          ) : (
            <span className="empty-value">—</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.otSalary - b.otSalary,
    },
    {
      title: "Phụ cấp",
      dataIndex: "totalAllowance",
      key: "totalAllowance",
      width: 130,
      align: "right",
      render: (value: number) => (
        <div className="money-cell">
          {value > 0 ? (
            <span className="money-value success">{formatCurrency(value)}</span>
          ) : (
            <span className="empty-value">—</span>
          )}
        </div>
      ),
    },
    {
      title: "Khấu trừ",
      dataIndex: "totalFine",
      key: "totalFine",
      width: 130,
      align: "right",
      render: (value: number) => (
        <div className="money-cell">
          {value > 0 ? (
            <span className="money-value danger">-{formatCurrency(value)}</span>
          ) : (
            <span className="empty-value">—</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.totalFine - b.totalFine,
    },
    {
      title: "Ngày công",
      dataIndex: "totalWorkDay",
      key: "totalWorkDay",
      width: 100,
      align: "center",
      render: (value: number) => (
        <div className="stat-cell">
          <span className="stat-value">{value}</span>
          <span className="stat-unit">ngày</span>
        </div>
      ),
      sorter: (a, b) => a.totalWorkDay - b.totalWorkDay,
    },
    {
      title: "Giờ công",
      dataIndex: "totalWorkHour",
      key: "totalWorkHour",
      width: 100,
      align: "center",
      render: (value: number) => (
        <div className="stat-cell">
          <span className="stat-value">{value}</span>
          <span className="stat-unit">giờ</span>
        </div>
      ),
      sorter: (a, b) => a.totalWorkHour - b.totalWorkHour,
    },
    {
      title: "Đi trễ",
      dataIndex: "lateCount",
      key: "lateCount",
      width: 90,
      align: "center",
      render: (value: number) => (
        <div className="stat-cell">
          {value > 0 ? (
            <>
              <span className="stat-value warning">{value}</span>
              <span className="stat-unit">lần</span>
            </>
          ) : (
            <span className="empty-value">—</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.lateCount - b.lateCount,
    },
    {
      title: "Tổng lương",
      dataIndex: "totalSalary",
      key: "totalSalary",
      width: 160,
      fixed: "right",
      align: "right",
      render: (value: number) => (
        <div className="total-cell">
          <BankOutlined className="total-icon" />
          <span className="total-value">{formatCurrency(value)}</span>
        </div>
      ),
      sorter: (a, b) => a.totalSalary - b.totalSalary,
    },
  ];

  // Tính % lương OT so với tổng lương
  const otPercentage = salaryDataReport?.totalSalary
    ? Math.round(
        (salaryDataReport.otSalary / salaryDataReport.totalSalary) * 100
      )
    : 0;

  return (
    <div className="user-salary-tab-v2">
      {/* Salary Overview Dashboard */}
      <div className="salary-overview-dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <RiseOutlined className="header-icon" />
            <div>
              <h3>Tổng quan lương năm {selectedMonth.year()}</h3>
              <p>Thống kê tổng hợp thu nhập và công việc</p>
            </div>
          </div>
        </div>

        <div className="overview-stats-grid">
          {/* Total Salary Card */}
          <div className="overview-stat-card total-salary-card">
            <div className="card-icon">
              <BankOutlined />
            </div>
            <div className="card-content">
              <div className="card-label">Tổng thu nhập năm</div>
              <div className="card-value">
                {formatCurrency(
                  salaryData.reduce((sum, item) => sum + item.totalSalary, 0)
                )}
              </div>
              <div className="card-footer">
                <span className="footer-text">
                  {salaryData.length} tháng đã tính lương
                </span>
              </div>
            </div>
            <div className="card-decoration">💰</div>
          </div>

          {/* Work Salary Card */}
          <div className="overview-stat-card work-salary-card">
            <div className="card-icon">
              <DollarOutlined />
            </div>
            <div className="card-content">
              <div className="card-label">Lương cơ bản</div>
              <div className="card-value">
                {formatCurrency(
                  salaryData.reduce((sum, item) => sum + item.workSalary, 0)
                )}
              </div>
              <div className="card-footer">
                <span className="footer-text">
                  {salaryData.reduce((sum, item) => sum + item.totalWorkDay, 0)}{" "}
                  ngày công
                </span>
              </div>
            </div>
          </div>

          {/* OT Salary Card */}
          <div className="overview-stat-card ot-salary-card">
            <div className="card-icon">
              <FireOutlined />
            </div>
            <div className="card-content">
              <div className="card-label">Lương tăng ca</div>
              <div className="card-value">
                {formatCurrency(
                  salaryData.reduce((sum, item) => sum + item.otSalary, 0)
                )}
              </div>
              <div className="card-footer">
                <span className="footer-text">
                  {salaryData.reduce(
                    (sum, item) => sum + item.totalWorkHour,
                    0
                  )}{" "}
                  giờ OT
                </span>
              </div>
            </div>
          </div>

          {/* Allowance Card */}
          <div className="overview-stat-card allowance-card">
            <div className="card-icon">
              <TrophyOutlined />
            </div>
            <div className="card-content">
              <div className="card-label">Tổng phụ cấp</div>
              <div className="card-value">
                {formatCurrency(
                  salaryData.reduce((sum, item) => sum + item.totalAllowance, 0)
                )}
              </div>
              <div className="card-footer">
                <span className="footer-text">Các khoản phụ cấp</span>
              </div>
            </div>
          </div>

          {/* Fine Card */}
          <div className="overview-stat-card fine-card">
            <div className="card-icon">
              <WarningOutlined />
            </div>
            <div className="card-content">
              <div className="card-label">Tổng khấu trừ</div>
              <div className="card-value danger">
                {formatCurrency(
                  salaryData.reduce((sum, item) => sum + item.totalFine, 0)
                )}
              </div>
              <div className="card-footer">
                <span className="footer-text">
                  {salaryData.reduce((sum, item) => sum + item.lateCount, 0)}{" "}
                  lần đi trễ
                </span>
              </div>
            </div>
          </div>

          {/* Work Hours Card */}
          <div className="overview-stat-card hours-card">
            <div className="card-icon">
              <ClockCircleOutlined />
            </div>
            <div className="card-content">
              <div className="card-label">Tổng giờ làm việc</div>
              <div className="card-value">
                {salaryData.reduce((sum, item) => sum + item.totalWorkHour, 0)}
                <span className="value-unit">giờ</span>
              </div>
              <div className="card-footer">
                <span className="footer-text">
                  TB:{" "}
                  {salaryData.length > 0
                    ? Math.round(
                        salaryData.reduce(
                          (sum, item) => sum + item.totalWorkHour,
                          0
                        ) / salaryData.length
                      )
                    : 0}{" "}
                  giờ/tháng
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="salary-header">
        <div className="header-left">
          <h2 className="header-title">
            <DollarOutlined />
            Tổng quan lương tháng {selectedMonth.format("MM/YYYY")}
          </h2>
        </div>
        <div className="header-actions">
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
            icon={<SyncOutlined spin={loading} />}
            size="large"
            onClick={handleExport}
            className="refresh-button"
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="salary-stats-container">
        <div className="salary-stats-card">
          {/* <div className="stats-header">
            <BankOutlined className="stats-icon" />
            <h3 className="stats-title">
              Tổng quan lương tháng {selectedMonth.format("MM/YYYY")}
            </h3>
          </div> */}

          {/* Tổng thực nhận - Full Width Highlight */}
          <div className="stat-item-highlight">
            <div className="highlight-icon">
              <BankOutlined />
            </div>
            <div className="highlight-content">
              <span className="highlight-label">Tổng thực nhận</span>
              <span className="highlight-value">
                {formatCurrency(salaryDataReport?.totalSalary || 0)}
              </span>
            </div>
            <div className="highlight-decoration">💰</div>
          </div>

          {/* Row 1: Lương cơ bản & Lương OT */}
          <div className="stat-row">
            <div className="stat-item">
              <div className="stat-label-wrapper">
                <DollarOutlined className="stat-icon" />
                <span className="stat-label">Lương cơ bản</span>
              </div>
              <span className="stat-value">
                {formatCurrency(salaryDataReport?.grossSalary || 0)}
              </span>
            </div>

            <div className="stat-item">
              <div className="stat-label-wrapper">
                <ClockCircleOutlined className="stat-icon" />
                <span className="stat-label">Lương OT</span>
              </div>
              <div className="stat-value-wrapper">
                <span className="stat-value">
                  {formatCurrency(salaryDataReport?.otSalary || 0)}
                </span>
                {otPercentage > 0 && (
                  <Progress
                    percent={otPercentage}
                    size="small"
                    strokeColor="#003c97"
                    trailColor="rgba(0, 60, 151, 0.15)"
                    format={(percent) => `${percent}%`}
                    style={{ width: "80px", marginLeft: "8px" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Phụ cấp & Khấu trừ */}
          <div className="stat-row">
            <div className="stat-item">
              <div className="stat-label-wrapper">
                <TrophyOutlined className="stat-icon" />
                <span className="stat-label">Phụ cấp</span>
              </div>
              <span className="stat-value">
                {formatCurrency(salaryDataReport?.totalAllowance || 0)}
              </span>
            </div>

            <div className="stat-item">
              <div className="stat-label-wrapper">
                <WarningOutlined className="stat-icon" />
                <span className="stat-label">Khấu trừ</span>
              </div>
              <span className="stat-value danger">
                {formatCurrency(salaryDataReport?.totalFine || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <div className="table-header">
          <div className="table-title">
            <CalendarOutlined />
            <span>Lịch sử lương năm {selectedMonth.year()}</span>
          </div>
          <div className="table-info">
            <Tag color="blue">{salaryData.length} kỳ lương</Tag>
          </div>
        </div>

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
                icon={expanded ? <DownOutlined /> : <RightOutlined />}
                onClick={(e) => onExpand(record, e)}
                className="expand-btn"
              />
            ),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          scroll={{ x: 1400 }}
          className="modern-salary-table"
        />
      </div>
    </div>
  );
}

export default UserSalaryTab;
