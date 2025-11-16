import { Dayjs } from "dayjs";

export interface SalaryStats {
  totalSalary: number;
  totalBonus: number;
  totalDeduction: number;
  totalOvertimePay: number;
  totalNetSalary: number;
  averageSalary: number;
  totalEmployees: number;
}

export interface DepartmentSalary {
  departmentName: string;
  totalSalary: number;
  averageSalary: number;
  totalBonus: number;
  totalDeduction: number;
  overtimePay: number;
  employeeCount: number;
}

export interface SalaryTrendData {
  month: string;
  totalSalary: number;
  totalBonus: number;
  totalDeduction: number;
  overtimePay: number;
  netSalary: number;
}

export interface EmployeeSalary {
  employeeId: string;
  employeeName: string;
  departmentName: string;
  positionName: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  overtimePay: number;
  netSalary: number;
}

export interface SalaryBreakdown {
  baseSalaryTotal: number;
  bonusTotal: number;
  deductionTotal: number;
  overtimeTotal: number;
  socialInsuranceTotal: number;
  taxTotal: number;
}

export interface SalaryFilterValues {
  dateRange?: [Dayjs, Dayjs];
  departmentId?: string;
  monthYear?: Dayjs;
}

export interface FilterRef {
  getFormValues: () => Partial<SalaryFilterValues>;
  resetForm: () => void;
}

export interface FilterProps {
  onSubmit: () => void;
}

