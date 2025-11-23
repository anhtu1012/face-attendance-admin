import { z } from "zod";

export const SalaryReportItemSchema = z.object({
  date: z.string(),
  totalWorkHour: z.number(),
  totalWorkDay: z.number(),
  totalSalary: z.number(),
  workSalary: z.number(),
  otSalary: z.number(),
  lateCount: z.number(),
  totalFine: z.number(),
  grossSalary: z.number(),
  totalAllowance: z.number(),
  status: z.enum(["CALCULATED", "STOP", "PAID"]),
  userId: z.string(),
  fullNameUser: z.string(),
  departmentName: z.string(),
  positionName: z.string(),
});

export type SalaryReportItem = z.infer<typeof SalaryReportItemSchema>;

export const SalaryReportResponseSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(SalaryReportItemSchema),
});

export type SalaryReportResponse = z.infer<typeof SalaryReportResponseSchema>;
