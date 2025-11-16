"use client";
import React, { useRef, useState } from "react";
import { Row, Col } from "antd";
import {
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import Filter from "./_components/Filter/Filter";
import SalaryChart from "./_components/SalaryChart/SalaryChart";
import SalaryTrendChart from "./_components/SalaryTrendChart/SalaryTrendChart";
import SalaryBreakdownChart from "./_components/SalaryBreakdownChart/SalaryBreakdownChart";
import {
  mockSalaryStats,
  mockDepartmentSalary,
  mockSalaryTrendData,
  mockSalaryBreakdown,
  formatCurrency,
} from "./_utils/mockData";
import { FilterRef } from "./_types/salary.types";
import "./page.scss";
import StatCard from "../bieu-do-cham-cong/_components/StatCard";

function SalaryDashboardPage() {
  const filterRef = useRef<FilterRef>(null);
  const [loading] = useState(false);

  // Mock data - In real app, fetch from API
  const salaryStats = mockSalaryStats;
  const departmentSalary = mockDepartmentSalary;
  const salaryTrendData = mockSalaryTrendData;
  const salaryBreakdown = mockSalaryBreakdown;

  const handleFilterSubmit = () => {
    const filterValues = filterRef.current?.getFormValues();
    console.log("Filter values:", filterValues);
    // TODO: Call API to fetch salary dashboard data based on filter
  };

  return (
    <div className="salary-dashboard-page">
      <LayoutContent
        layoutType={1}
        option={{
          floatButton: true,
          cardTitle: "Dashboard - Thống kê lương",
        }}
        content1={
          <div className="salary-dashboard-content">
            {/* Filter Section */}
            <Filter ref={filterRef} onSubmit={handleFilterSubmit} />

            {/* Statistics Cards Section - Row 1 */}
            <Row gutter={[16, 16]} className="stats-section">
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng quỹ lương"
                  value={formatCurrency(salaryStats.totalSalary)}
                  icon={<DollarOutlined />}
                  color="#1565C0"
                  loading={loading}
                  trend={{ value: 3.5, isPositive: true }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Lương thực nhận"
                  value={formatCurrency(salaryStats.totalNetSalary)}
                  icon={<WalletOutlined />}
                  color="#52c41a"
                  loading={loading}
                  trend={{ value: 4.2, isPositive: true }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng thưởng"
                  value={formatCurrency(salaryStats.totalBonus)}
                  icon={<GiftOutlined />}
                  color="#faad14"
                  loading={loading}
                  trend={{ value: 8.5, isPositive: true }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng khấu trừ"
                  value={formatCurrency(salaryStats.totalDeduction)}
                  icon={<FallOutlined />}
                  color="#f5222d"
                  loading={loading}
                  trend={{ value: 2.1, isPositive: false }}
                />
              </Col>
            </Row>

            {/* Statistics Cards Section - Row 2 */}
            <Row gutter={[16, 16]} className="stats-section">
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Lương trung bình"
                  value={formatCurrency(salaryStats.averageSalary)}
                  icon={<RiseOutlined />}
                  color="#42A5F5"
                  loading={loading}
                  valueStyle={{ fontSize: "20px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng số nhân viên"
                  value={salaryStats.totalEmployees}
                  icon={<TeamOutlined />}
                  color="#1890ff"
                  loading={loading}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Lương tăng ca"
                  value={formatCurrency(salaryStats.totalOvertimePay)}
                  icon={<ClockCircleOutlined />}
                  color="#096dd9"
                  loading={loading}
                  trend={{ value: 15.8, isPositive: true }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Đã thanh toán"
                  value={formatCurrency(salaryStats.totalNetSalary)}
                  icon={<CheckCircleOutlined />}
                  color="#52c41a"
                  loading={loading}
                  valueStyle={{ fontSize: "20px" }}
                />
              </Col>
            </Row>

            {/* Charts Section - Row 1 */}
            <Row gutter={[16, 16]} className="charts-section">
              <Col xs={24} lg={14}>
                <SalaryChart data={departmentSalary} loading={loading} />
              </Col>
              <Col xs={24} lg={10}>
                <SalaryBreakdownChart
                  data={salaryBreakdown}
                  loading={loading}
                />
              </Col>
            </Row>

            {/* Charts Section - Row 2 */}
            <Row gutter={[16, 16]} className="charts-section">
              <Col xs={24}>
                <SalaryTrendChart data={salaryTrendData} loading={loading} />
              </Col>
            </Row>
          </div>
        }
      />
    </div>
  );
}

export default SalaryDashboardPage;
