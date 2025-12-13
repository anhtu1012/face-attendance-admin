/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * DTO cho thống kê tuyển dụng tổng quan
 */
export interface RecruitmentStatistics {
  // Thống kê job
  totalJobs: number; // Tổng số job
  totalJobsThisMonth: number; // Số job trong tháng
  activeJobs: number; // Job đang hoạt động
  closedJobs: number; // Job đã đóng

  // Thống kê ứng viên
  totalCandidates: number; // Tổng số ứng viên
  newCandidatesThisMonth: number; // Ứng viên mới tháng này
  newCandidatesToday: number; // Ứng viên mới hôm nay

  // Thống kê theo trạng thái
  toContactCount: number; // Chờ liên hệ
  toInterviewCount: number; // Chờ phỏng vấn
  scheduledInterviewCount: number; // Đã hẹn phỏng vấn
  passedInterviewCount: number; // Đậu phỏng vấn
  failedInterviewCount: number; // Thất bại phỏng vấn
  toJobOfferCount: number; // Chờ nhận việc
  jobOfferedCount: number; // Đã nhận việc
  toContractCount: number; // Chờ ký hợp đồng
  completedCount: number; // Hoàn thành
  rejectedCount: number; // Từ chối/Không phù hợp

  // Tỷ lệ thành công
  conversionRate: number; // Tỷ lệ chuyển đổi (%)
  successRate: number; // Tỷ lệ thành công (%)
  interviewPassRate: number; // Tỷ lệ đậu phỏng vấn (%)
  offerAcceptanceRate: number; // Tỷ lệ chấp nhận offer (%)

  // Thời gian xử lý trung bình
  averageTimeToInterview: number; // Thời gian từ ứng tuyển đến phỏng vấn (ngày)
  averageTimeToHire: number; // Thời gian từ ứng tuyển đến tuyển dụng (ngày)
  averageInterviewRounds: number; // Số vòng phỏng vấn trung bình
}

/**
 * DTO cho thống kê theo vị trí tuyển dụng
 */
export interface JobPositionStatistics {
  positionName: string; // Tên vị trí
  roleId: string;
  totalCandidates: number; // Tổng số ứng viên
  hired: number; // Đã tuyển
  inProgress: number; // Đang xử lý
  rejected: number; // Đã từ chối
  successRate: number; // Tỷ lệ thành công (%)
  averageTimeToHire: number; // Thời gian tuyển dụng TB (ngày)
}

/**
 * DTO cho thống kê theo phòng ban
 */
export interface DepartmentRecruitmentStatistics {
  departmentName: string; // Tên phòng ban
  departmentId: string;
  totalJobs: number; // Tổng số job
  totalCandidates: number; // Tổng số ứng viên
  hired: number; // Đã tuyển
  pending: number; // Đang chờ
  successRate: number; // Tỷ lệ thành công (%)
}

/**
 * DTO cho thống kê nguồn ứng viên
 */
export interface CandidateSourceStatistics {
  sourceName: string; // Nguồn (Website, LinkedIn, Facebook, Referral, etc.)
  count: number; // Số lượng
  percentage: number; // Tỷ lệ %
  hired: number; // Số người được tuyển
  conversionRate: number; // Tỷ lệ chuyển đổi (%)
}

/**
 * DTO cho xu hướng tuyển dụng theo thời gian
 */
export interface RecruitmentTrendData {
  date: string; // Ngày (YYYY-MM-DD)
  month: string; // Tháng (YYYY-MM)
  newCandidates: number; // Ứng viên mới
  interviewed: number; // Đã phỏng vấn
  offered: number; // Đã offer
  hired: number; // Đã tuyển
}

/**
 * DTO cho top ứng viên
 */
export interface TopCandidateData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  matchScore: number; // Điểm phù hợp (%)
  status: string;
  appliedDate: string;
  experience: string;
  skills: string[];
}

/**
 * DTO cho thống kê theo kỹ năng
 */
export interface SkillDemandStatistics {
  skillName: string;
  skillId: string;
  demandCount: number; // Số lượng job yêu cầu
  candidateCount: number; // Số ứng viên có kỹ năng
  gap: number; // Khoảng cách cung-cầu
}

/**
 * DTO cho phân tích hiệu suất tuyển dụng
 */
export interface RecruiterPerformance {
  recruiterId: string;
  recruiterName: string;
  totalJobsManaged: number; // Tổng job quản lý
  totalCandidatesProcessed: number; // Tổng ứng viên xử lý
  successfulHires: number; // Số người tuyển thành công
  averageTimeToHire: number; // Thời gian tuyển TB (ngày)
  performanceScore: number; // Điểm hiệu suất (%)
}

/**
 * Response DTO cho API báo cáo tuyển dụng
 */
export interface RecruitmentReportResponse {
  statistics: RecruitmentStatistics;
  jobPositions: JobPositionStatistics[];
  departments: DepartmentRecruitmentStatistics[];
  candidateSources: CandidateSourceStatistics[];
  trends: RecruitmentTrendData[];
  topCandidates: TopCandidateData[];
  skillDemand: SkillDemandStatistics[];
  recruiterPerformance: RecruiterPerformance[];
}

/**
 * Request DTO cho filter báo cáo
 */
export interface RecruitmentReportFilterRequest {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  departmentId?: string;
  roleId?: string;
  recruiterId?: string;
  status?: string[];
  timeRange?: "today" | "week" | "month" | "quarter" | "year" | "custom";
}
