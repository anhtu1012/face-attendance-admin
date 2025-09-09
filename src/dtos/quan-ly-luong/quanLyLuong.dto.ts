import { z } from "zod";

// Working Schedule Status Enum
export const QuanLyLuongStatusEnum = z.enum([
  "NOTPAID",
  "CONFIRM",
  "ACCEPT",
  "STOP",
]);

export type QuanLyLuongStatus = z.infer<typeof QuanLyLuongStatusEnum>;

// Base Working Schedule Schema
export const QuanLyLuongSchema = z.object({
  id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  code: z.string(),
  fullName: z.string(),
  userCode: z.string(),
  month: z.string(),
  baseSalary: z.number(),
  actualSalary: z.number(),
  deductionFee: z.number().nullable(),
  workDay: z.number(),
  allowance: z.number(),
  overtimeSalary: z.number(),
  lateFine: z.number(),
  otherFee: z.number().nullable(),
  totalWorkHour: z.number(),
  status: QuanLyLuongStatusEnum,
  paidDate: z.string().or(z.date()).nullable(),
  lateTimeCount: z.number(),
  totalSalary: z.number(),
  overTimeSalaryPosition: z.number(),
});

export type QuanLyLuongItem = z.infer<typeof QuanLyLuongSchema>;
