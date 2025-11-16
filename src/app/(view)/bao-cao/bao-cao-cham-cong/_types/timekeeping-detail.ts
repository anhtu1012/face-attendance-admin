export interface TimekeepingDetailItem {
  timekeepingId: string;
  date: string;
  totalWorkHour: number;
  checkinTime: string;
  checkoutTime: string;
  hasOT: boolean;
  status: string;
}
