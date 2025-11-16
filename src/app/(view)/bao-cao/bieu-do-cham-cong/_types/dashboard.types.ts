import { Dayjs } from "dayjs";

export interface DashboardStats {
  totalEmployees: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  averageWorkHours: number;
  totalOvertimeHours: number;
  attendanceRate: number;
  lateRate: number;
}

export interface DepartmentStats {
  departmentName: string;
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  averageWorkHours: number;
  overtimeHours: number;
}

export interface TrendData {
  date: string;
  present: number;
  absent: number;
  late: number;
  overtime: number;
}

export interface ViolationStats {
  lateCount: number;
  earlyLeaveCount: number;
  forgetCheckInCount: number;
  absentCount: number;
}

export interface SalaryStats {
  totalSalary: number;
  totalBonus: number;
  totalDeduction: number;
  totalOvertimePay: number;
  averageSalary: number;
}

export interface DashboardFilterValues {
  dateRange?: [Dayjs, Dayjs];
  departmentId?: string;
  monthYear?: Dayjs;
}

export interface FilterRef {
  getFormValues: () => Partial<DashboardFilterValues>;
  resetForm: () => void;
}

export interface FilterProps {
  onSubmit: () => void;
}

