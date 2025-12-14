"use client";
import React, { useRef, useState } from "react";
import { Row, Col } from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  PercentageOutlined,
  WarningOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import Filter from "./_components/Filter/Filter";
import StatCard from "./_components/StatCard/StatCard";
import DepartmentChart from "./_components/DepartmentChart/DepartmentChart";
import TrendChart from "./_components/TrendChart/TrendChart";
import ViolationChart from "./_components/ViolationChart/ViolationChart";
import OvertimeChart from "./_components/OvertimeChart/OvertimeChart";
import SummaryStats from "./_components/SummaryStats";
import {
  mockDashboardStats,
  mockDepartmentStats,
  mockTrendData,
  mockViolationStats,
} from "./_utils/mockData";
import { FilterRef } from "./_types/dashboard.types";
import "./page.scss";

function DashboardPage() {
  const filterRef = useRef<FilterRef>(null);
  const [loading] = useState(false);

  // Mock data - In real app, fetch from API
  const dashboardStats = mockDashboardStats;
  const departmentStats = mockDepartmentStats;
  const trendData = mockTrendData;
  const violationStats = mockViolationStats;

  const handleFilterSubmit = () => {
    const filterValues = filterRef.current?.getFormValues();
    console.log("Filter values:", filterValues);
    // TODO: Call API to fetch dashboard data based on filter
  };

  // Get top 3 departments by attendance rate
  const topPerformers = [...departmentStats]
    .sort((a, b) => b.attendanceRate - a.attendanceRate)
    .slice(0, 3)
    .map((dept) => ({
      name: dept.departmentName,
      department: dept.departmentName,
      rate: dept.attendanceRate,
    }));

  return (
    <div className="dashboard-page">
      <LayoutContent
        layoutType={1}
        option={{
          floatButton: true,
          cardTitle: "Dashboard - Thống kê tổng quan",
        }}
        content1={
          <div className="dashboard-content">
            {/* Page Header */}
            <div className="pageHeader">
              <div className="headerContent">
                <h1 className="pageTitle"> Báo cáo chấm công</h1>
                <p className="dateRange">
                  Tháng 11/2024 • Cập nhật lúc 08:30 - 14/11/2024
                </p>
              </div>
              <div className="totalSummary">
                <div className="summaryLabel">Tỷ lệ chấm công</div>
                <div className="summaryValue">
                  {dashboardStats.attendanceRate}%
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <Filter ref={filterRef} onSubmit={handleFilterSubmit} />

            {/* Statistics Cards Section */}
            <Row gutter={[16, 16]} className="stats-section">
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng số nhân viên"
                  value={dashboardStats.totalEmployees}
                  icon={<TeamOutlined />}
                  color="#1565C0"
                  loading={loading}
                  trend={{ value: 5.2, isPositive: true }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Nhân viên có mặt"
                  value={dashboardStats.totalPresent}
                  icon={<CheckCircleOutlined />}
                  color="#52c41a"
                  loading={loading}
                  trend={{ value: 2.8, isPositive: true }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Nhân viên vắng mặt"
                  value={dashboardStats.totalAbsent}
                  icon={<CloseCircleOutlined />}
                  color="#f5222d"
                  loading={loading}
                  trend={{ value: 1.5, isPositive: false }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Nhân viên đi muộn"
                  value={dashboardStats.totalLate}
                  icon={<ClockCircleOutlined />}
                  color="#faad14"
                  loading={loading}
                  trend={{ value: 0.8, isPositive: false }}
                />
              </Col>
            </Row>

            {/* Secondary Stats Section */}
            <Row gutter={[16, 16]} className="stats-section">
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tỷ lệ chấm công"
                  value={dashboardStats.attendanceRate}
                  suffix="%"
                  icon={<PercentageOutlined />}
                  color="#42A5F5"
                  loading={loading}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tỷ lệ đi muộn"
                  value={dashboardStats.lateRate}
                  suffix="%"
                  icon={<WarningOutlined />}
                  color="#faad14"
                  loading={loading}
                  valueStyle={{ color: "#faad14" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Giờ làm trung bình"
                  value={dashboardStats.averageWorkHours}
                  suffix="h"
                  icon={<FieldTimeOutlined />}
                  color="#1890ff"
                  loading={loading}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng giờ tăng ca"
                  value={dashboardStats.totalOvertimeHours}
                  suffix="h"
                  icon={<HourglassOutlined />}
                  color="#096dd9"
                  loading={loading}
                  trend={{ value: 12.5, isPositive: true }}
                />
              </Col>
            </Row>

            {/* Charts Section - Row 1 */}
            <Row gutter={[16, 16]} className="charts-section">
              <Col xs={24} lg={14}>
                <DepartmentChart data={departmentStats} loading={loading} />
              </Col>
              <Col xs={24} lg={10}>
                <ViolationChart data={violationStats} loading={loading} />
              </Col>
            </Row>

            {/* Charts Section - Row 2 */}
            <Row gutter={[16, 16]} className="charts-section">
              <Col xs={24} xl={14}>
                <TrendChart data={trendData} loading={loading} />
              </Col>
              <Col xs={24} xl={10}>
                <OvertimeChart data={departmentStats} loading={loading} />
              </Col>
            </Row>

            {/* Summary Statistics Card */}
            <div className="container">
              <SummaryStats
                totalEmployees={dashboardStats.totalEmployees}
                presentCount={dashboardStats.totalPresent}
                attendanceRate={dashboardStats.attendanceRate}
                lateCount={dashboardStats.totalLate}
                topPerformers={topPerformers}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default DashboardPage;
