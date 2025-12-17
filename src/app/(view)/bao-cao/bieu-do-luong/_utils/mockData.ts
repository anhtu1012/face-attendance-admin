import {
  SalaryBreakdown,
  SalaryStats,
  SalaryTrendData,
} from "../_types/salary.types";

export const mockSalaryStats: SalaryStats = {
  totalSalary: 2850000000, // 2.85 tỷ
  totalBonus: 185000000, // 185 triệu
  totalDeduction: 142000000, // 142 triệu
  totalOvertimePay: 95000000, // 95 triệu
  totalNetSalary: 2988000000, // 2.988 tỷ
  averageSalary: 18269231, // ~18.3 triệu
  totalEmployees: 156,
};

export const mockSalaryTrendData: SalaryTrendData[] = [
  {
    month: "Tháng 1",
    totalSalary: 2650000000,
    totalBonus: 145000000,
    totalDeduction: 128000000,
    overtimePay: 78000000,
    netSalary: 2745000000,
  },
  {
    month: "Tháng 2",
    totalSalary: 2680000000,
    totalBonus: 155000000,
    totalDeduction: 132000000,
    overtimePay: 82000000,
    netSalary: 2785000000,
  },
  {
    month: "Tháng 3",
    totalSalary: 2720000000,
    totalBonus: 165000000,
    totalDeduction: 135000000,
    overtimePay: 85000000,
    netSalary: 2835000000,
  },
  {
    month: "Tháng 4",
    totalSalary: 2750000000,
    totalBonus: 170000000,
    totalDeduction: 138000000,
    overtimePay: 88000000,
    netSalary: 2870000000,
  },
  {
    month: "Tháng 5",
    totalSalary: 2780000000,
    totalBonus: 175000000,
    totalDeduction: 140000000,
    overtimePay: 90000000,
    netSalary: 2905000000,
  },
  {
    month: "Tháng 6",
    totalSalary: 2800000000,
    totalBonus: 180000000,
    totalDeduction: 142000000,
    overtimePay: 92000000,
    netSalary: 2930000000,
  },
  {
    month: "Tháng 7",
    totalSalary: 2820000000,
    totalBonus: 182000000,
    totalDeduction: 142000000,
    overtimePay: 93000000,
    netSalary: 2953000000,
  },
  {
    month: "Tháng 8",
    totalSalary: 2830000000,
    totalBonus: 183000000,
    totalDeduction: 141000000,
    overtimePay: 94000000,
    netSalary: 2966000000,
  },
  {
    month: "Tháng 9",
    totalSalary: 2840000000,
    totalBonus: 184000000,
    totalDeduction: 142000000,
    overtimePay: 94000000,
    netSalary: 2976000000,
  },
  {
    month: "Tháng 10",
    totalSalary: 2845000000,
    totalBonus: 184500000,
    totalDeduction: 142000000,
    overtimePay: 94500000,
    netSalary: 2982000000,
  },
  {
    month: "Tháng 11",
    totalSalary: 2850000000,
    totalBonus: 185000000,
    totalDeduction: 142000000,
    overtimePay: 95000000,
    netSalary: 2988000000,
  },
];

export const mockSalaryBreakdown: SalaryBreakdown = {
  baseSalaryTotal: 2850000000,
  bonusTotal: 185000000,
  deductionTotal: 142000000,
  overtimeTotal: 95000000,
  socialInsuranceTotal: 285000000,
  taxTotal: 195000000,
};

// Helper function to format currency
export const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + " tỷ";
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(0) + " triệu";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(0) + " nghìn";
  }
  return value.toLocaleString("vi-VN") + " đ";
};

// Helper function to format full currency
export const formatFullCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
