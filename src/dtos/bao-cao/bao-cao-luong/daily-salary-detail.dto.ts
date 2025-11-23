import { z } from "zod";

// Chi tiết lương theo ngày
export const DailySalaryDetailSchema = z.object({
  date: z.string(),
  totalSalary: z.number(),
  workSalary: z.number(),
  otSalary: z.number(),
  totalFine: z.number(),
  hasOT: z.boolean(),
  isHoliday: z.boolean(),
  status: z.string(), // END_ONTIME, END_LATE, NOT_CHECKIN, etc.
  ratio: z.string(), // Hệ số lương (1, 1.5, 2, 3, 4)
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
});

export type DailySalaryDetail = z.infer<typeof DailySalaryDetailSchema>;

// Response cho API lấy chi tiết lương theo tháng
export const MonthlySalaryDetailResponseSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(DailySalaryDetailSchema),
});

export type MonthlySalaryDetailResponse = z.infer<
  typeof MonthlySalaryDetailResponseSchema
>;
