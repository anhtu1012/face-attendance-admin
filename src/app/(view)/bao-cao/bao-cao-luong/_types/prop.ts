import { Dayjs } from "dayjs";

export interface SalaryReportData {
  userId: string;
  fullNameUser: string;
  fullNameManager: string;
  positionName: string;
  departmentName: string;
  date: string;
  totalSalary: number;
  workSalary: number;
  otSalary: number;
  hasOT: number;
  totalFine: number;
  isHoliday: number;
}

export interface FormValues {
  month?: Dayjs;
  departmentId?: string;
  positionId?: string;
}

export interface FilterRef {
  getFormValues: () => Partial<FormValues>;
}

export interface FilterProps {
  onSubmit: () => void;
}

export interface TableSalaryRef {
  refetch: () => void;
}

export interface TableSalaryProps {
  filterRef: React.RefObject<FilterRef | null>;
}
