/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, DatePicker, Table, Button, Tag, Tooltip } from "antd";
import { DownloadOutlined, DollarOutlined, RiseOutlined, FallOutlined, TrophyOutlined, CalendarOutlined, BankOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import "./UserSalaryTab.scss";

interface UserSalaryTabProps {
  userId: string;
}

interface SalaryData {
  date: string;
  totalSalary: number;
  workSalary: number;
  otSalary: number;
  bonus: number;
  totalFine: number;
  isHoliday: boolean;
  userId: string;
  fullNameUser: string;
  fullNameManager: string;
  positionName: string;
  departmentName: string;
  note?: string;
}

const { RangePicker } = DatePicker;

function UserSalaryTab({ userId }: UserSalaryTabProps) {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [loading, setLoading] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);

  const fetchSalaryData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData: SalaryData[] = [
        {
          date: "2024-11-15",
          totalSalary: 15000000,
          workSalary: 12000000,
          otSalary: 3000000,
          bonus: 500000,
          totalFine: 200000,
          isHoliday: false,
          userId: userId,
          fullNameUser: "Phạm Hoàng Phúc",
          fullNameManager: "Anh Nhím",
          positionName: "Frontend Developer",
          departmentName: "Phòng Phát triển phần mềm",
          note: "Lương tháng 11",
        },
        {
          date: "2024-10-15",
          totalSalary: 14500000,
          workSalary: 12000000,
          otSalary: 2500000,
          bonus: 0,
          totalFine: 0,
          isHoliday: false,
          userId: userId,
          fullNameUser: "Phạm Hoàng Phúc",
          fullNameManager: "Anh Nhím",
          positionName: "Frontend Developer",
          departmentName: "Phòng Phát triển phần mềm",
          note: "Lương tháng 10",
        },
        {
          date: "2024-09-15",
          totalSalary: 16000000,
          workSalary: 12000000,
          otSalary: 3000000,
          bonus: 1000000,
          totalFine: 0,
          isHoliday: false,
          userId: userId,
          fullNameUser: "Phạm Hoàng Phúc",
          fullNameManager: "Anh Nhím",
          positionName: "Frontend Developer",
          departmentName: "Phòng Phát triển phần mềm",
          note: "Lương tháng 9 + thưởng dự án",
        },
      ];

      setSalaryData(mockData);
    } catch (error) {
      console.error("Error fetching salary data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, dateRange]);

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleExport = () => {
    // Export logic here
    console.log("Exporting salary data...");
  };

  const columns: ColumnsType<SalaryData> = [
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
      render: (date: string) => {
        const monthYear = dayjs(date).format("MM/YYYY");
        return (
          <Tooltip title={`Kỳ lương tháng ${monthYear}`}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: "#1565c0", fontSize: "15px" }}>
                {dayjs(date).format("DD/MM/YYYY")}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>
                Tháng {dayjs(date).format("MM")}
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
      dataIndex: "totalSalary",
      key: "totalSalary",
      width: 200,
      render: (value: number, record: SalaryData) => {
        const netSalary = value - record.totalFine;
        return (
          <Tooltip title={
            <div>
              <div>Tổng cộng: {formatCurrency(value)}</div>
              <div>Thực nhận: {formatCurrency(netSalary)}</div>
            </div>
          }>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: "17px", color: "#0d47a1" }}>
                {formatCurrency(value)}
              </div>
              {record.totalFine > 0 && (
                <div style={{ fontSize: "11px", color: "#f44336", fontWeight: 600 }}>
                  Thực nhận: {formatCurrency(netSalary)}
                </div>
              )}
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.totalSalary - b.totalSalary,
    },
    {
      title: (
        <span>
          <DollarOutlined style={{ marginRight: 6 }} />
          Lương CB
        </span>
      ),
      dataIndex: "workSalary",
      key: "workSalary",
      width: 170,
      render: (value: number) => (
        <Tooltip title="Lương cơ bản">
          <span style={{ fontWeight: 600, fontSize: "14px", color: "#0288d1" }}>
            {formatCurrency(value)}
          </span>
        </Tooltip>
      ),
      sorter: (a, b) => a.workSalary - b.workSalary,
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
          <div style={{
            fontWeight: 600,
            fontSize: "14px",
            color: "#722ed1",
            padding: "4px 10px",
            background: value > 0 ? "linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)" : "transparent",
            borderRadius: "8px",
            display: "inline-block",
          }}>
            {formatCurrency(value)}
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => a.otSalary - b.otSalary,
    },
    {
      title: (
        <span>
          <TrophyOutlined style={{ marginRight: 6 }} />
          Thưởng
        </span>
      ),
      dataIndex: "bonus",
      key: "bonus",
      width: 170,
      render: (value: number) =>
        value > 0 ? (
          <Tooltip title={`Tiền thưởng: ${formatCurrency(value)}`}>
            <Tag icon={<RiseOutlined />} color="success" style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}>
              +{formatCurrency(value)}
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        ),
      sorter: (a, b) => a.bonus - b.bonus,
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
            <Tag icon={<FallOutlined />} color="error" style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}>
              -{formatCurrency(value)}
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        ),
      sorter: (a, b) => a.totalFine - b.totalFine,
    },
    {
      title: "🎉 Loại ngày",
      dataIndex: "isHoliday",
      key: "isHoliday",
      width: 120,
      render: (value: boolean) =>
        value ? (
          <Tooltip title="Ngày lễ - Hệ số lương cao hơn">
            <Tag color="orange" style={{ fontWeight: 600, fontSize: "13px" }}>
              🎊 Ngày lễ
            </Tag>
          </Tooltip>
        ) : (
          <Tag color="default" style={{ fontWeight: 500, fontSize: "12px" }}>
            Thường
          </Tag>
        ),
      filters: [
        { text: "Ngày lễ", value: true },
        { text: "Ngày thường", value: false },
      ],
      onFilter: (value, record) => record.isHoliday === value,
    },
    {
      title: "📝 Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: { showTitle: false },
      render: (note: string) => (
        <Tooltip title={note || "Không có ghi chú"}>
          <span style={{ color: note ? "#475569" : "#cbd5e1", fontWeight: 500, fontStyle: note ? "normal" : "italic" }}>
            {note || "—"}
          </span>
        </Tooltip>
      ),
    },
  ];

  // Calculate total salary
  const totalSalary = salaryData.reduce(
    (sum, item) => sum + item.totalSalary,
    0
  );
  const totalWorkSalary = salaryData.reduce(
    (sum, item) => sum + item.workSalary,
    0
  );
  const totalOtSalary = salaryData.reduce((sum, item) => sum + item.otSalary, 0);
  const totalBonus = salaryData.reduce((sum, item) => sum + item.bonus, 0);
  const totalFine = salaryData.reduce((sum, item) => sum + item.totalFine, 0);

  return (
    <div className="user-salary-tab">
      {/* Date Range Selector */}
      <div className="date-range-selector">
        <RangePicker
          value={dateRange}
          onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
          format="DD/MM/YYYY"
          placeholder={["Từ ngày", "Đến ngày"]}
          size="large"
          className="date-range-picker"
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

      {/* Summary Card */}
      <Card className="summary-card" loading={loading}>
        <div className="summary-grid">
          <div className="summary-item summary-total">
            <div className="summary-icon">
              <DollarOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Tổng lương</div>
              <div className="value">{formatCurrency(totalSalary)}</div>
            </div>
            <div className="summary-badge">💰</div>
          </div>
          <div className="summary-item summary-work">
            <div className="summary-icon">
              <DollarOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Lương cơ bản</div>
              <div className="value">{formatCurrency(totalWorkSalary)}</div>
            </div>
          </div>
          <div className="summary-item summary-ot">
            <div className="summary-icon">
              <DollarOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Lương OT</div>
              <div className="value">{formatCurrency(totalOtSalary)}</div>
            </div>
          </div>
          <div className="summary-item summary-bonus">
            <div className="summary-icon">
              <TrophyOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Tổng thưởng</div>
              <div className="value">{formatCurrency(totalBonus)}</div>
            </div>
            <div className="summary-badge">🎁</div>
          </div>
          <div className="summary-item summary-fine">
            <div className="summary-icon">
              <FallOutlined />
            </div>
            <div className="summary-content">
              <div className="label">Tổng phạt</div>
              <div className="value">{formatCurrency(totalFine)}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Table */}
      <Card
        title={
          <div className="table-header">
            <span className="table-title">💳 Chi tiết lương</span>
            <span className="table-subtitle">
              {dateRange[0].format("DD/MM/YYYY")} - {dateRange[1].format("DD/MM/YYYY")}
            </span>
          </div>
        }
        className="detail-card"
      >
        <Table
          columns={columns}
          dataSource={salaryData}
          loading={loading}
          rowKey="date"
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

