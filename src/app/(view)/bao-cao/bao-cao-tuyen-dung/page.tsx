/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, message } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  RiseOutlined,
  PercentageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import StatisticCard from "./_components/StatisticCard";
import RecruitmentTrendChart from "./_components/RecruitmentTrendChart";
import CandidateStatusChart from "./_components/CandidateStatusChart";
import DepartmentRecruitmentChart from "./_components/DepartmentRecruitmentChart";
import TopCandidatesTable from "./_components/TopCandidatesTable";
import FilterPanel from "./_components/FilterPanel";
import BaoCaoTuyenDungServices from "@/services/bao-cao/bao-cao-tuyen-dung.service";
import {
  RecruitmentStatistics,
  RecruitmentTrendData,
  DepartmentRecruitmentStatistics,
  TopCandidateData,
  RecruitmentReportFilterRequest,
} from "@/dtos/bao-cao/bao-cao-tuyen-dung/bao-cao-tuyen-dung.dto";
import { useSelectData } from "@/hooks/useSelectData";
import "./page.scss";

// Mock data cho development
const mockStatistics: RecruitmentStatistics = {
  totalJobs: 45,
  totalJobsThisMonth: 12,
  activeJobs: 28,
  closedJobs: 17,
  totalCandidates: 1234,
  newCandidatesThisMonth: 156,
  newCandidatesToday: 8,
  toContactCount: 45,
  toInterviewCount: 32,
  scheduledInterviewCount: 28,
  passedInterviewCount: 65,
  failedInterviewCount: 23,
  toJobOfferCount: 18,
  jobOfferedCount: 42,
  toContractCount: 15,
  completedCount: 89,
  rejectedCount: 34,
  conversionRate: 12.5,
  successRate: 7.2,
  interviewPassRate: 73.9,
  offerAcceptanceRate: 85.4,
  averageTimeToInterview: 5.2,
  averageTimeToHire: 21.5,
  averageInterviewRounds: 2.3,
};

const mockTrendData: RecruitmentTrendData[] = [
  {
    date: "2024-01",
    month: "T1/2024",
    newCandidates: 98,
    interviewed: 72,
    offered: 35,
    hired: 28,
  },
  {
    date: "2024-02",
    month: "T2/2024",
    newCandidates: 112,
    interviewed: 85,
    offered: 42,
    hired: 35,
  },
  {
    date: "2024-03",
    month: "T3/2024",
    newCandidates: 125,
    interviewed: 95,
    offered: 48,
    hired: 38,
  },
  {
    date: "2024-04",
    month: "T4/2024",
    newCandidates: 134,
    interviewed: 102,
    offered: 52,
    hired: 42,
  },
  {
    date: "2024-05",
    month: "T5/2024",
    newCandidates: 145,
    interviewed: 118,
    offered: 58,
    hired: 45,
  },
  {
    date: "2024-06",
    month: "T6/2024",
    newCandidates: 156,
    interviewed: 128,
    offered: 65,
    hired: 52,
  },
];

const mockStatusData = [
  { name: "Chờ liên hệ", value: 45, color: "#1890ff" },
  { name: "Chờ phỏng vấn", value: 32, color: "#722ed1" },
  { name: "Đã hẹn PV", value: 28, color: "#13c2c2" },
  { name: "Đậu PV", value: 65, color: "#52c41a" },
  { name: "Thất bại PV", value: 23, color: "#ff4d4f" },
  { name: "Đã offer", value: 42, color: "#faad14" },
  { name: "Chờ ký HĐ", value: 15, color: "#eb2f96" },
  { name: "Hoàn thành", value: 89, color: "#52c41a" },
];

const mockDepartmentData: DepartmentRecruitmentStatistics[] = [
  {
    departmentName: "IT",
    departmentId: "1",
    totalJobs: 15,
    totalCandidates: 285,
    hired: 42,
    pending: 65,
    successRate: 14.7,
  },
  {
    departmentName: "Marketing",
    departmentId: "2",
    totalJobs: 8,
    totalCandidates: 156,
    hired: 28,
    pending: 38,
    successRate: 17.9,
  },
  {
    departmentName: "Sales",
    departmentId: "3",
    totalJobs: 12,
    totalCandidates: 234,
    hired: 35,
    pending: 52,
    successRate: 15.0,
  },
  {
    departmentName: "HR",
    departmentId: "4",
    totalJobs: 5,
    totalCandidates: 98,
    hired: 18,
    pending: 25,
    successRate: 18.4,
  },
  {
    departmentName: "Finance",
    departmentId: "5",
    totalJobs: 5,
    totalCandidates: 112,
    hired: 22,
    pending: 28,
    successRate: 19.6,
  },
];

const mockTopCandidates: TopCandidateData[] = [
  {
    id: "1",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    position: "Senior Developer",
    matchScore: 95,
    status: "TO_INTERVIEW_R1",
    appliedDate: "2024-12-01",
    experience: "5 năm",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
  },
  {
    id: "2",
    fullName: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0902345678",
    position: "Marketing Manager",
    matchScore: 92,
    status: "INTERVIEW_SCHEDULED",
    appliedDate: "2024-12-02",
    experience: "7 năm",
    skills: ["Digital Marketing", "SEO", "Content Strategy"],
  },
  {
    id: "3",
    fullName: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0903456789",
    position: "Data Analyst",
    matchScore: 88,
    status: "JOB_OFFERED",
    appliedDate: "2024-12-03",
    experience: "3 năm",
    skills: ["Python", "SQL", "Power BI", "Machine Learning"],
  },
  {
    id: "4",
    fullName: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0904567890",
    position: "UX/UI Designer",
    matchScore: 85,
    status: "TO_INTERVIEW",
    appliedDate: "2024-12-04",
    experience: "4 năm",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
  },
  {
    id: "5",
    fullName: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "0905678901",
    position: "Product Manager",
    matchScore: 82,
    status: "CONTRACT_SIGNING",
    appliedDate: "2024-12-05",
    experience: "6 năm",
    skills: ["Agile", "Scrum", "Product Strategy", "Jira"],
  },
];

function RecruitmentReportPage() {
  const [loading, setLoading] = useState(false);
  const [statistics] = useState<RecruitmentStatistics>(mockStatistics);
  const [trendData] = useState<RecruitmentTrendData[]>(mockTrendData);
  const [statusData] = useState(mockStatusData);
  const [departmentData] =
    useState<DepartmentRecruitmentStatistics[]>(mockDepartmentData);
  const [topCandidates] = useState<TopCandidateData[]>(mockTopCandidates);
  const [messageApi, contextHolder] = message.useMessage();

  const { selectDepartment, selectRole } = useSelectData({
    fetchDepartment: true,
    fetchRole: true,
  });

  // Fetch data on mount
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async (filter?: RecruitmentReportFilterRequest) => {
    setLoading(true);
    try {
      // TODO: Uncomment khi API đã sẵn sàng
      // const response = await BaoCaoTuyenDungServices.getRecruitmentReport(filter);
      // setStatistics(response.statistics);
      // setTrendData(response.trends);
      // setDepartmentData(response.departments);
      // setTopCandidates(response.topCandidates);

      // Tạm thời sử dụng mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      messageApi.success("Tải dữ liệu báo cáo thành công");
    } catch (error: any) {
      messageApi.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu"
      );
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (values: any) => {
    console.log("Filter values:", values);

    const filter: RecruitmentReportFilterRequest = {
      timeRange: values.timeRange,
      departmentId: values.departmentId,
      roleId: values.roleId,
      status: values.status,
    };

    if (values.dateRange && values.dateRange.length === 2) {
      filter.startDate = values.dateRange[0].format("YYYY-MM-DD");
      filter.endDate = values.dateRange[1].format("YYYY-MM-DD");
    }

    fetchReportData(filter);
  };

  const handleReset = () => {
    fetchReportData();
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      // TODO: Implement export functionality
      // const blob = await BaoCaoTuyenDungServices.exportRecruitmentReport();
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `Bao-cao-tuyen-dung-${new Date().getTime()}.xlsx`;
      // link.click();

      messageApi.success("Xuất báo cáo thành công");
    } catch (error: any) {
      messageApi.error("Có lỗi xảy ra khi xuất báo cáo");
      console.error("Error exporting report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruitment-report-page">
      {contextHolder}
      <LayoutContent
        layoutType={1}
        option={{
          floatButton: true,
          cardTitle: "Báo cáo tuyển dụng",
        }}
        content1={
          <div className="recruitment-report-content">
            {/* Filter Section */}
            <FilterPanel
              onFilter={handleFilter}
              onReset={handleReset}
              onExport={handleExport}
              loading={loading}
              departmentOptions={selectDepartment}
              roleOptions={selectRole}
            />

            {/* Statistics Cards - Row 1: Tổng quan */}
            <div className="stats-section">
              <h3 className="section-title">Thống kê tổng quan</h3>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Tổng số công việc"
                    value={statistics.totalJobs}
                    icon={<FileTextOutlined />}
                    color="#1890ff"
                    loading={loading}
                    description={`${statistics.totalJobsThisMonth} công việc mới tháng này`}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Tổng ứng viên"
                    value={statistics.totalCandidates}
                    icon={<TeamOutlined />}
                    color="#722ed1"
                    loading={loading}
                    trend={{ value: 15.2, isPositive: true }}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Ứng viên mới tháng này"
                    value={statistics.newCandidatesThisMonth}
                    icon={<UserAddOutlined />}
                    color="#52c41a"
                    loading={loading}
                    description={`${statistics.newCandidatesToday} ứng viên mới hôm nay`}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Đã hoàn thành"
                    value={statistics.completedCount}
                    icon={<CheckCircleOutlined />}
                    color="#13c2c2"
                    loading={loading}
                    trend={{ value: 8.5, isPositive: true }}
                  />
                </Col>
              </Row>
            </div>

            {/* Statistics Cards - Row 2: Quy trình tuyển dụng */}
            <div className="stats-section">
              <h3 className="section-title">Trạng thái quy trình</h3>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Chờ liên hệ"
                    value={statistics.toContactCount}
                    icon={<ClockCircleOutlined />}
                    color="#faad14"
                    loading={loading}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Chờ phỏng vấn"
                    value={statistics.toInterviewCount}
                    icon={<CalendarOutlined />}
                    color="#eb2f96"
                    loading={loading}
                    description={`${statistics.scheduledInterviewCount} đã hẹn lịch`}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Đậu phỏng vấn"
                    value={statistics.passedInterviewCount}
                    icon={<CheckCircleOutlined />}
                    color="#52c41a"
                    loading={loading}
                    description={`Tỷ lệ đậu: ${statistics.interviewPassRate}%`}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Chờ ký hợp đồng"
                    value={statistics.toContractCount}
                    icon={<FileTextOutlined />}
                    color="#1890ff"
                    loading={loading}
                  />
                </Col>
              </Row>
            </div>

            {/* Statistics Cards - Row 3: Hiệu suất */}
            <div className="stats-section">
              <h3 className="section-title">Hiệu suất tuyển dụng</h3>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Tỷ lệ chuyển đổi"
                    value={statistics.conversionRate}
                    suffix="%"
                    icon={<PercentageOutlined />}
                    color="#722ed1"
                    loading={loading}
                    trend={{ value: 2.3, isPositive: true }}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="Tỷ lệ thành công"
                    value={statistics.successRate}
                    suffix="%"
                    icon={<RiseOutlined />}
                    color="#52c41a"
                    loading={loading}
                    trend={{ value: 1.8, isPositive: true }}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="TG đến phỏng vấn (TB)"
                    value={statistics.averageTimeToInterview}
                    suffix=" ngày"
                    icon={<CalendarOutlined />}
                    color="#faad14"
                    loading={loading}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatisticCard
                    title="TG tuyển dụng (TB)"
                    value={statistics.averageTimeToHire}
                    suffix=" ngày"
                    icon={<ClockCircleOutlined />}
                    color="#ff4d4f"
                    loading={loading}
                    description={`${statistics.averageInterviewRounds} vòng PV TB`}
                  />
                </Col>
              </Row>
            </div>

            {/* Charts Section - Row 1 */}
            <Row gutter={[16, 16]} className="charts-section">
              <Col xs={24} lg={16}>
                <RecruitmentTrendChart data={trendData} loading={loading} />
              </Col>
              <Col xs={24} lg={8}>
                <CandidateStatusChart data={statusData} loading={loading} />
              </Col>
            </Row>

            {/* Charts Section - Row 2 */}
            <Row gutter={[16, 16]} className="charts-section">
              <Col xs={24}>
                <DepartmentRecruitmentChart
                  data={departmentData}
                  loading={loading}
                />
              </Col>
            </Row>

            {/* Top Candidates Table */}
            <Row gutter={[16, 16]} className="table-section">
              <Col xs={24}>
                <TopCandidatesTable data={topCandidates} loading={loading} />
              </Col>
            </Row>
          </div>
        }
      />
    </div>
  );
}

export default RecruitmentReportPage;
