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
  averageSalary: number;
  employeeCount: number;
  averageOT: number;
  averageLateFine: number;
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
  monthYear?: Dayjs;
  departmentId?: string;
}

export interface FilterRef {
  getFormValues: () => Partial<SalaryFilterValues>;
  resetForm: () => void;
}

export interface FilterProps {
  onSubmit: () => void;
}
