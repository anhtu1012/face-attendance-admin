import {
  DashboardStats,
  DepartmentStats,
  TrendData,
  ViolationStats,
  SalaryStats,
} from "../_types/dashboard.types";

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 156,
  totalPresent: 142,
  totalAbsent: 8,
  totalLate: 6,
  averageWorkHours: 7.8,
  totalOvertimeHours: 245,
  attendanceRate: 91.03,
  lateRate: 3.85,
};

export const mockDepartmentStats: DepartmentStats[] = [
  {
    departmentName: "Kỹ thuật",
    totalEmployees: 45,
    presentCount: 42,
    absentCount: 2,
    lateCount: 1,
    attendanceRate: 93.33,
    averageWorkHours: 8.2,
    overtimeHours: 98,
  },
  {
    departmentName: "Kinh doanh",
    totalEmployees: 32,
    presentCount: 29,
    absentCount: 2,
    lateCount: 1,
    attendanceRate: 90.63,
    averageWorkHours: 7.9,
    overtimeHours: 45,
  },
  {
    departmentName: "Marketing",
    totalEmployees: 28,
    presentCount: 25,
    absentCount: 2,
    lateCount: 1,
    attendanceRate: 89.29,
    averageWorkHours: 7.6,
    overtimeHours: 32,
  },
  {
    departmentName: "Nhân sự",
    totalEmployees: 18,
    presentCount: 17,
    absentCount: 1,
    lateCount: 0,
    attendanceRate: 94.44,
    averageWorkHours: 8.0,
    overtimeHours: 15,
  },
  {
    departmentName: "Tài chính",
    totalEmployees: 22,
    presentCount: 20,
    absentCount: 1,
    lateCount: 1,
    attendanceRate: 90.91,
    averageWorkHours: 8.1,
    overtimeHours: 28,
  },
  {
    departmentName: "Hành chính",
    totalEmployees: 11,
    presentCount: 9,
    absentCount: 0,
    lateCount: 2,
    attendanceRate: 81.82,
    averageWorkHours: 7.4,
    overtimeHours: 12,
  },
];

export const mockTrendData: TrendData[] = [
  { date: "01/11", present: 145, absent: 7, late: 4, overtime: 32 },
  { date: "02/11", present: 148, absent: 5, late: 3, overtime: 28 },
  { date: "03/11", present: 142, absent: 9, late: 5, overtime: 35 },
  { date: "04/11", present: 146, absent: 6, late: 4, overtime: 30 },
  { date: "05/11", present: 143, absent: 8, late: 5, overtime: 33 },
  { date: "06/11", present: 150, absent: 4, late: 2, overtime: 25 },
  { date: "07/11", present: 147, absent: 6, late: 3, overtime: 29 },
  { date: "08/11", present: 144, absent: 7, late: 5, overtime: 31 },
  { date: "09/11", present: 149, absent: 5, late: 2, overtime: 27 },
  { date: "10/11", present: 142, absent: 8, late: 6, overtime: 34 },
  { date: "11/11", present: 146, absent: 6, late: 4, overtime: 30 },
  { date: "12/11", present: 148, absent: 5, late: 3, overtime: 28 },
  { date: "13/11", present: 145, absent: 7, late: 4, overtime: 32 },
  { date: "14/11", present: 143, absent: 8, late: 5, overtime: 33 },
  { date: "15/11", present: 147, absent: 6, late: 3, overtime: 29 },
];

export const mockViolationStats: ViolationStats = {
  lateCount: 89,
  earlyLeaveCount: 45,
  forgetCheckInCount: 23,
  absentCount: 67,
};

export const mockSalaryStats: SalaryStats = {
  totalSalary: 2850000000, // 2.85 tỷ
  totalBonus: 185000000, // 185 triệu
  totalDeduction: 42000000, // 42 triệu
  totalOvertimePay: 95000000, // 95 triệu
  averageSalary: 18269231, // ~18.3 triệu
};

// Helper function to format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Helper function to format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

