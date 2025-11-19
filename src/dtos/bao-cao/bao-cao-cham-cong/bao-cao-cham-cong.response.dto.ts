import { z } from "zod";
import {
  TimekeepingDetailItemSchema,
  TimekeepingReportDataSchema,
} from "./bao-cao-cham-cong.dto";

export const TimekeepingReportResponseSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(TimekeepingReportDataSchema),
});

export type TimekeepingReportResponse = z.infer<
  typeof TimekeepingReportResponseSchema
>;

export const TimekeepingDetailReportResponseSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(TimekeepingDetailItemSchema),
});

export type TimekeepingDetailReportResponse = z.infer<
  typeof TimekeepingDetailReportResponseSchema
>;
