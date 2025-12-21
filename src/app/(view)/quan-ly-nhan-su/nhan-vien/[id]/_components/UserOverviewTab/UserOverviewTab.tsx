"use client";

import {
  AuditOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  FireOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Descriptions, Progress, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import "./UserOverviewTab.scss";
import BaoCaoChamCongServices from "@/services/bao-cao/bao-cao-cham-cong.service";
import { TimekeepingReportData } from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";
import BaoCaoSalaryServices from "@/services/bao-cao/bao-cao-luong.service";

interface SalaryStats {
  totalWorkHour: number;
  totalWorkDay: number;
  totalSalary: number;
  workSalary: number;
  otSalary: number;
  lateCount: number;
  totalFine: number;
  grossSalary: number;
  totalAllowance: number;
}

interface UserOverviewTabProps {
  userId: string;
}

function UserOverviewTab({ userId }: UserOverviewTabProps) {
  const [loading, setLoading] = useState(false);
  const [attendanceStats, setAttendanceStats] =
    useState<TimekeepingReportData | null>(null);
  const [salaryStats, setSalaryStats] = useState<SalaryStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API calls
        const attendance =
          await BaoCaoChamCongServices.getTimekeepingReportByUserAll(
            [],
            undefined,
            {
              userId: userId,
            }
          );

        const salaryData = await BaoCaoSalaryServices.getSalaryReportByUserAll(
          [],
          undefined,
          {
            userId: userId,
          }
        );

        setAttendanceStats(attendance);
        setSalaryStats(salaryData.data[0]);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const formatCurrency = (value: number | string) => {
    const num =
      typeof value === "string"
        ? parseFloat(value.replace(/[^\d.-]/g, "")) || 0
        : value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const calculateAttendanceRate = () => {
    if (!attendanceStats) return 0;
    return Math.round(
      (attendanceStats.actualTimekeeping /
        attendanceStats.monthStandardTimekeeping) *
        100
    );
  };

  const calculateHourRate = () => {
    if (!attendanceStats) return 0;
    return Math.round(
      (attendanceStats.actualHour / attendanceStats.monthStandardHour) * 100
    );
  };

  const getTotalOtHours = () => {
    if (!attendanceStats) return 0;
    return (
      attendanceStats.normalOtHour +
      attendanceStats.offDayOtHour +
      attendanceStats.holidayOtHour
    );
  };

  const getTotalFines = () => {
    if (!attendanceStats) return 0;
    return attendanceStats.lateFine + attendanceStats.forgetLogNumber * 20000;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="user-overview-tab">
      {/* Dashboard Overview Cards */}
      <Row gutter={[24, 24]} className="overview-cards">
        {/* Attendance Overview Card */}
        {attendanceStats && (
          <Col xs={24} lg={12}>
            <div className="overview-card attendance-card">
              <div className="overview-header">
                <div className="header-left">
                  <CheckCircleOutlined className="header-icon" />
                  <div className="header-text">
                    <h3 className="header-title">Chấm công</h3>
                    <p className="header-subtitle">Tổng tất cả</p>
                  </div>
                </div>
                <div className="completion-badge">
                  <span className="badge-value">
                    {calculateAttendanceRate()}%
                  </span>
                  <span className="badge-label">Hoàn thành</span>
                </div>
              </div>

              <div className="overview-main-stats">
                <div className="main-stat">
                  <div className="stat-number">
                    {attendanceStats.actualTimekeeping}
                  </div>
                  <div className="stat-description">
                    <span className="stat-label">Công thực tế</span>
                    <span className="stat-target">
                      / {attendanceStats.monthStandardTimekeeping} công
                    </span>
                  </div>
                  <Progress
                    percent={calculateAttendanceRate()}
                    strokeColor="#003c97"
                    trailColor="#e8f4f8"
                    showInfo={false}
                    strokeWidth={8}
                  />
                </div>

                <div className="main-stat">
                  <div className="stat-number">
                    {attendanceStats.actualHour}
                  </div>
                  <div className="stat-description">
                    <span className="stat-label">Giờ làm việc</span>
                    <span className="stat-target">
                      / {attendanceStats.monthStandardHour}h
                    </span>
                  </div>
                  <Progress
                    percent={calculateHourRate()}
                    strokeColor="#0056d6"
                    trailColor="#e8f4f8"
                    showInfo={false}
                    strokeWidth={8}
                  />
                </div>
              </div>

              <div className="overview-quick-stats">
                <div className="quick-stat">
                  <WarningOutlined className="quick-stat-icon warning" />
                  <div className="quick-stat-value">
                    {attendanceStats.lateNumber}
                  </div>
                  <div className="quick-stat-label">Đi muộn</div>
                </div>
                <div className="quick-stat">
                  <FieldTimeOutlined className="quick-stat-icon" />
                  <div className="quick-stat-value">
                    {attendanceStats.earlyNumber}
                  </div>
                  <div className="quick-stat-label">Về sớm</div>
                </div>
                <div className="quick-stat">
                  <CloseCircleOutlined className="quick-stat-icon danger" />
                  <div className="quick-stat-value">
                    {attendanceStats.offWorkNumber}
                  </div>
                  <div className="quick-stat-label">Nghỉ phép</div>
                </div>
                <div className="quick-stat">
                  <QuestionCircleOutlined className="quick-stat-icon danger" />
                  <div className="quick-stat-value">
                    {attendanceStats.forgetLogNumber}
                  </div>
                  <div className="quick-stat-label">Quên chấm</div>
                </div>
              </div>

              {/* OT Information Section */}
              <div className="overview-section-divider">
                <FireOutlined /> Thông tin tăng ca
              </div>
              <div className="overview-info-grid">
                <div className="info-item">
                  <span className="info-label">OT ngày thường</span>
                  <span className="info-value">
                    {attendanceStats.normalOtTimekeeping} công (
                    {attendanceStats.normalOtHour}h)
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">OT ngày nghỉ</span>
                  <span className="info-value">
                    {attendanceStats.offDayOtTimekeeping} công (
                    {attendanceStats.offDayOtHour}h)
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">OT ngày lễ</span>
                  <span className="info-value">
                    {attendanceStats.holidayOtTimekeeping} công (
                    {attendanceStats.holidayOtHour}h)
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tổng OT</span>
                  <span className="info-value success">
                    {getTotalOtHours()} giờ
                  </span>
                </div>
              </div>

              {/* Fines Section */}
              <div className="overview-section-divider">
                <WarningOutlined /> Phạt & Vi phạm
              </div>
              <div className="overview-info-grid">
                <div className="info-item">
                  <span className="info-label">Phạt đi muộn</span>
                  <span className="info-value danger">
                    {formatCurrency(attendanceStats.lateFine)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phạt quên chấm</span>
                  <span className="info-value danger">
                    {formatCurrency(attendanceStats.forgetLogNumber * 20000)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tổng phạt</span>
                  <span className="info-value danger bold">
                    {formatCurrency(getTotalFines())}
                  </span>
                </div>
              </div>
            </div>
          </Col>
        )}

        {/* Salary Overview Card */}
        {salaryStats && (
          <Col xs={24} lg={12}>
            <div className="overview-card salary-card">
              <div className="overview-header">
                <div className="header-left">
                  <DollarOutlined className="header-icon" />
                  <div className="header-text">
                    <h3 className="header-title">Lương theo công</h3>
                    <p className="header-subtitle">Tổng tất cả</p>
                  </div>
                </div>
                <div className="completion-badge salary-badge">
                  <TrophyOutlined className="badge-icon" />
                </div>
              </div>

              <div className="overview-main-stats salary-main">
                <div className="salary-highlight">
                  <div className="salary-label">TỔNG LƯƠNG THEO CÔNG</div>
                  <div className="salary-amount">
                    {formatCurrency(salaryStats.totalSalary)}
                  </div>
                </div>

                <div className="salary-breakdown">
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <ClockCircleOutlined /> Lương công
                    </div>
                    <div className="breakdown-value">
                      {formatCurrency(salaryStats.workSalary)}
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <FireOutlined /> Lương OT
                    </div>
                    <div className="breakdown-value success">
                      +{formatCurrency(salaryStats.otSalary)}
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <TrophyOutlined /> Phụ cấp
                    </div>
                    <div className="breakdown-value success">
                      +{formatCurrency(salaryStats.totalAllowance)}
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <CloseCircleOutlined /> Phạt
                    </div>
                    <div className="breakdown-value danger">
                      -{formatCurrency(salaryStats.totalFine)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-quick-stats">
                <div className="quick-stat">
                  <CalendarOutlined className="quick-stat-icon" />
                  <div className="quick-stat-value">
                    {salaryStats.totalWorkDay}
                  </div>
                  <div className="quick-stat-label">Ngày công</div>
                </div>
                <div className="quick-stat">
                  <ClockCircleOutlined className="quick-stat-icon" />
                  <div className="quick-stat-value">
                    {salaryStats.totalWorkHour}
                  </div>
                  <div className="quick-stat-label">Giờ làm</div>
                </div>
                <div className="quick-stat">
                  <AuditOutlined className="quick-stat-icon" />
                  <div className="quick-stat-value">
                    {formatCurrency(salaryStats.grossSalary)
                      .replace(/₫|VND/, "")
                      .trim()
                      .slice(0, -4)}
                    K
                  </div>
                  <div className="quick-stat-label">Gross</div>
                </div>
                <div className="quick-stat">
                  <WarningOutlined className="quick-stat-icon warning" />
                  <div className="quick-stat-value">
                    {salaryStats.lateCount}
                  </div>
                  <div className="quick-stat-label">Vi phạm</div>
                </div>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default UserOverviewTab;
