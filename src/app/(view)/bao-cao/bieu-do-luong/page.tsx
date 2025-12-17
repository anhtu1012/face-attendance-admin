"use client";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import BaoCaoSalaryServices from "@/services/bao-cao/bao-cao-luong.service";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FallOutlined,
  RiseOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import StatCard from "../bieu-do-cham-cong/_components/StatCard";
import Filter from "./_components/Filter/Filter";
import SalaryBreakdownChart from "./_components/SalaryBreakdownChart/SalaryBreakdownChart";
import SalaryChart from "./_components/SalaryChart/SalaryChart";
import SalarySummaryStats from "./_components/SalarySummaryStats";
import SalaryTrendChart from "./_components/SalaryTrendChart/SalaryTrendChart";
import { FilterRef } from "./_types/salary.types";
import {
  formatCurrency,
  mockSalaryBreakdown,
  mockSalaryTrendData,
} from "./_utils/mockData";
import "./page.scss";

function SalaryDashboardPage() {
  const filterRef = useRef<FilterRef>(null);
  const [loading, setLoading] = useState(false);
  const [salaryStats, setSalaryStats] = useState({
    totalSalary: 0, // averageSalary from API
    totalNetSalary: 0, // totalActualSalaryFund
    totalDeduction: 0, // totalDeductionFund
    averageSalary: 0, // totalSalaryFund from API
    averageOvertimePay: 0, // totalOtFund
    totalEmployees: 0,
    totalWorkDay: 0, // totalWorkDay
    totalWorkHour: 0, // totalWorkHour
    totalLateCount: 0, // totalLateCount
  });
  const [trendData, setTrendData] = useState({
    totalSalary: { value: 0, isPositive: true },
    totalNetSalary: { value: 0, isPositive: true },
    totalDeduction: { value: 0, isPositive: false },
    averageSalary: { value: 0, isPositive: true },
    averageOvertimePay: { value: 0, isPositive: true },
    totalWorkDay: { value: 0, isPositive: true },
    totalWorkHour: { value: 0, isPositive: true },
    totalLateCount: { value: 0, isPositive: true },
  });

  const [departmentSalary, setDepartmentSalary] = useState<
    Array<{
      departmentName: string;
      averageSalary: number;
      employeeCount: number;
      averageOT: number;
      averageLateFine: number;
    }>
  >([]);

  // Mock data - Keep these for now
  const salaryTrendData = mockSalaryTrendData;
  const salaryBreakdown = mockSalaryBreakdown;

  const fetchSalaryChart = async (
    params?: Record<string, string | number | boolean>
  ) => {
    setLoading(true);
    try {
      const response = await BaoCaoSalaryServices.getSalaryChart(params);

      // Parse current values with correct mapping
      setSalaryStats({
        totalSalary: parseFloat(response.totalSalaryFund.current), // Tổng lương
        totalNetSalary: parseFloat(response.totalActualSalaryFund.current), // Tổng thực nhận
        totalDeduction: parseFloat(response.totalDeductionFund.current), // Tổng khấu trừ
        averageSalary: parseFloat(response.averageSalary.current), // Lương trung bình
        averageOvertimePay: parseFloat(response.totalOtFund.current), // Lương OT trung bình
        totalEmployees: response.totalEmployee,
        totalWorkDay: parseFloat(response.totalWorkDay.current), // Tổng ngày đi làm
        totalWorkHour: parseFloat(response.totalWorkHour.current), // Tổng giờ đi làm
        totalLateCount: parseFloat(response.totalLateCount.current), // Tổng lần đi muộn
      });

      // Parse trend data
      setTrendData({
        totalSalary: {
          value: Math.abs(response.totalSalaryFund.percentChange),
          isPositive: response.totalSalaryFund.isUp,
        },
        totalNetSalary: {
          value: Math.abs(response.totalActualSalaryFund.percentChange),
          isPositive: response.totalActualSalaryFund.isUp,
        },
        totalDeduction: {
          value: Math.abs(response.totalDeductionFund.percentChange),
          isPositive: response.totalDeductionFund.isUp,
        },
        averageSalary: {
          value: Math.abs(response.averageSalary.percentChange),
          isPositive: response.averageSalary.isUp,
        },
        averageOvertimePay: {
          value: Math.abs(response.totalOtFund.percentChange),
          isPositive: response.totalOtFund.isUp,
        },
        totalWorkDay: {
          value: Math.abs(response.totalWorkDay.percentChange),
          isPositive: response.totalWorkDay.isUp,
        },
        totalWorkHour: {
          value: Math.abs(response.totalWorkHour.percentChange),
          isPositive: response.totalWorkHour.isUp,
        },
        totalLateCount: {
          value: Math.abs(response.totalLateCount.percentChange),
          isPositive: response.totalLateCount.isUp,
        },
      });
    } catch (error) {
      console.error("Error fetching salary chart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentSalary = async (
    params?: Record<string, string | number | boolean>
  ) => {
    try {
      const response = await BaoCaoSalaryServices.getSalaryChartDepart(params);

      // Transform API response to match chart format
      const transformedData = response.departments.map(
        (dept: {
          departmentId: string;
          departmentName: string;
          departmentAverageSalary: string;
          departmentAverageOT: string;
          departmentAverageLateFine: string;
        }) => ({
          departmentName: dept.departmentName,
          averageSalary: parseFloat(dept.departmentAverageSalary),
          employeeCount: 0, // API doesn't provide this, you might need to add it
          averageOT: parseFloat(dept.departmentAverageOT),
          averageLateFine: parseFloat(dept.departmentAverageLateFine),
        })
      );

      setDepartmentSalary(transformedData);
    } catch (error) {
      console.error("Error fetching department salary:", error);
    }
  };

  useEffect(() => {
    // Initial fetch with current month/year
    const now = new Date();
    const params = {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
    fetchSalaryChart(params);
    fetchDepartmentSalary(params);
  }, []);

  const handleFilterSubmit = () => {
    const filterValues = filterRef.current?.getFormValues();
    console.log("Filter values:", filterValues);
    // Call API with filter values
    if (filterValues) {
      const params: Record<string, string | number | boolean> = {};

      // Extract month and year from monthYear Dayjs object
      if (filterValues.monthYear) {
        params.month = filterValues.monthYear.month() + 1; // dayjs month is 0-indexed
        params.year = filterValues.monthYear.year();
      }

      if (filterValues.departmentId && filterValues.departmentId !== "all") {
        params.departmentId = filterValues.departmentId;
      }

      fetchSalaryChart(params);
      fetchDepartmentSalary(params);
    }
  };

  // Get top 3 departments by average salary
  const topDepartments = [...departmentSalary]
    .sort((a, b) => b.averageSalary - a.averageSalary)
    .slice(0, 3)
    .map((dept) => ({
      name: dept.departmentName,
      avgSalary: dept.averageSalary,
      count: dept.employeeCount,
    }));

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
            {/* Page Header */}
            <div className="pageHeader">
              <div className="headerContent">
                <h1 className="pageTitle">Báo cáo lương</h1>
                <p className="dateRange">
                  Tháng 11/2024 • Cập nhật lúc 08:30 - 14/11/2024
                </p>
              </div>
              <div className="totalSummary">
                <div className="summaryLabel">Tổng quỹ lương</div>
                <div className="summaryValue">
                  {formatCurrency(salaryStats.totalSalary)}
                </div>
              </div>
            </div>

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
                  trend={trendData.totalSalary}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Lương theo công"
                  value={formatCurrency(salaryStats.totalNetSalary)}
                  icon={<WalletOutlined />}
                  color="#52c41a"
                  loading={loading}
                  trend={trendData.totalNetSalary}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng khấu trừ"
                  value={formatCurrency(salaryStats.totalDeduction)}
                  icon={<FallOutlined />}
                  color="#f5222d"
                  loading={loading}
                  trend={trendData.totalDeduction}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng giờ đi làm"
                  value={salaryStats.totalWorkHour}
                  icon={<ClockCircleOutlined />}
                  color="#722ed1"
                  loading={loading}
                  trend={trendData.totalWorkHour}
                  valueStyle={{ fontSize: "20px" }}
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
                  trend={trendData.averageSalary}
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
                  title="Lương OT"
                  value={formatCurrency(salaryStats.averageOvertimePay)}
                  icon={<ClockCircleOutlined />}
                  color="#096dd9"
                  loading={loading}
                  trend={trendData.averageOvertimePay}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Tổng ngày đi làm"
                  value={salaryStats.totalWorkDay}
                  icon={<CheckCircleOutlined />}
                  color="#52c41a"
                  loading={loading}
                  trend={trendData.totalWorkDay}
                />
              </Col>
            </Row>

            {/* Charts Section - Row 1 */}
            <Row gutter={[16, 16]} className="charts-section">
              <Col xs={24} lg={24}>
                <SalaryChart data={departmentSalary} loading={loading} />
              </Col>
              {/* <Col xs={24} lg={10}>
                <SalaryBreakdownChart
                  data={salaryBreakdown}
                  loading={loading}
                />
              </Col> */}
            </Row>

            {/* Charts Section - Row 2 */}
            <Row gutter={[16, 16]} className="charts-section">
              <Col xs={24}>
                <SalaryTrendChart data={salaryTrendData} loading={loading} />
              </Col>
            </Row>

            {/* Summary Statistics Card */}
            {/* <div className="container">
              <SalarySummaryStats
                totalSalary={salaryStats.totalSalary}
                totalEmployees={salaryStats.totalEmployees}
                averageSalary={salaryStats.averageSalary}
                totalNetSalary={salaryStats.totalNetSalary}
                formatCurrency={formatCurrency}
                topDepartments={topDepartments}
              />
            </div> */}
          </div>
        }
      />
    </div>
  );
}

export default SalaryDashboardPage;
