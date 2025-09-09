import { z } from "zod";
import { WorkingScheduleSchema } from "./workingSchedule.dto";

/**
 * Schema and type for single working schedule response
 */
export const WorkingScheduleResponseSchema = WorkingScheduleSchema;
export type WorkingScheduleResponseItem = z.infer<
  typeof WorkingScheduleResponseSchema
>;

/**
 * Schema and type for paginated working schedules response
 */
export const PaginatedWorkingScheduleResponseSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(WorkingScheduleSchema),
});

export type PaginatedWorkingScheduleResponse = z.infer<
  typeof PaginatedWorkingScheduleResponseSchema
>;

/**
 * Schema and type for aggregated working schedule statistics
 */
export const WorkingScheduleStatsResponseSchema = z.object({
  total: z.number(),
  completed: z.number(),
  absent: z.number(),
  late: z.number(),
  upcoming: z.number(),
  onTime: z.number(),
  earlyLeave: z.number(),
  timeframe: z.string(),
});

export type WorkingScheduleStatsResponse = z.infer<
  typeof WorkingScheduleStatsResponseSchema
>;

/**
 * Schema and type for employee schedule summary
 */
export const EmployeeScheduleSummarySchema = z.object({
  userCode: z.string(),
  fullName: z.string(),
  scheduledHours: z.number(),
  workedHours: z.number(),
  completedShifts: z.number(),
  missedShifts: z.number(),
  lateArrivals: z.number(),
  earlyDepartures: z.number(),
  timeframe: z.string(),
});

export type EmployeeScheduleSummaryResponse = z.infer<
  typeof EmployeeScheduleSummarySchema
>;
