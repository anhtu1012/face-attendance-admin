export interface TrendData {
  current: string;
  previous: string;
  diff: string;
  percentChange: number;
  isUp: boolean;
}

export interface SalaryChartResponse {
  totalEmployee: number;
  averageSalary: TrendData;
  totalSalaryFund: TrendData;
  totalActualSalaryFund: TrendData;
  totalOtFund: TrendData;
  totalDeductionFund: TrendData;
  totalWorkDay: TrendData;
  totalWorkHour: TrendData;
  totalLateCount: TrendData;
}
