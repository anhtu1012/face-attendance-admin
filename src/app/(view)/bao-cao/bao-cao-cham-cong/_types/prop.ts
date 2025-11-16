import { Dayjs } from "dayjs";

export interface TimekeepingDetailItem {
  timekeepingId: string;
  date: string;
  totalWorkHour: number;
  checkinTime: string;
  checkoutTime: string;
  hasOT: boolean;
  status: string;
}

export interface TimekeepingReportData {
  actualTimekeeping: number;
  monthStandardTimekeeping: number;
  actualHour: number;
  monthStandardHour: number;
  lateNumber: number;
  earlyNumber: number;
  offWorkNumber: number;
  forgetLogNumber: number;
  normalOtTimekeeping: number;
  normalOtHour: number;
  offDayOtTimekeeping: number;
  offDayOtHour: number;
  holidayOtTimekeeping: number;
  holidayOtHour: number;
  lateFine: string;
  forgetLogFine: string;
  userId: string;
  fullNameUser: string;
  fullNameManager: string;
  positionName: string;
  departmentName: string;
  timekeepingDetails?: TimekeepingDetailItem[];
}

export interface FormValues {
  month?: Dayjs;
  departmentId?: string;
  positionId?: string;
  status?: string;
}

export interface FilterRef {
  getFormValues: () => Partial<FormValues>;
}

export interface FilterProps {
  onSubmit: () => void;
}

export interface TableTimekeepingRef {
  refetch: () => void;
}

export interface TableTimekeepingProps {
  filterRef: React.RefObject<FilterRef | null>;
}

export interface TimekeepingTableProps {
  data: TimekeepingReportData[];
}
