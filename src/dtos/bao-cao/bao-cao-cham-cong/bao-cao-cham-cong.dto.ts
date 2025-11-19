import { z } from "zod";

export const TimekeepingDetailItemSchema = z.object({
  timekeepingId: z.string(),
  date: z.string(),
  totalWorkHour: z.number(),
  checkinTime: z.string(),
  checkoutTime: z.string(),
  hasOT: z.boolean(),
  status: z.string(),
});

export type TimekeepingDetailItem = z.infer<typeof TimekeepingDetailItemSchema>;

export const TimekeepingReportDataSchema = z.object({
  actualTimekeeping: z.number(),
  monthStandardTimekeeping: z.number(),
  actualHour: z.number(),
  monthStandardHour: z.number(),
  lateNumber: z.number(),
  earlyNumber: z.number(),
  offWorkNumber: z.number(),
  forgetLogNumber: z.number(),
  normalOtTimekeeping: z.number(),
  normalOtHour: z.number(),
  offDayOtTimekeeping: z.number(),
  offDayOtHour: z.number(),
  holidayOtTimekeeping: z.number(),
  holidayOtHour: z.number(),
  lateFine: z.string(),
  forgetLogFine: z.string(),
  userId: z.string(),
  fullNameUser: z.string(),
  fullNameManager: z.string(),
  positionName: z.string(),
  departmentName: z.string(),
  timekeepingDetails: z.array(TimekeepingDetailItemSchema).optional(),
});

export type TimekeepingReportData = z.infer<typeof TimekeepingReportDataSchema>;
