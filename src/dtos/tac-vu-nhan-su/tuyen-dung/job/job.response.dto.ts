import { z } from "zod";
import { HRUserSchema, JobShareRequestSchema } from "./job-share.dto";
import { JobItemSchema } from "./job.dto";

export const JobResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(JobItemSchema),
});

export type JobResponseGetItem = z.infer<typeof JobResponseGetSchema>;

export const JobResponseGetListHrSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(HRUserSchema),
});

export type JobResponseGetListHrItem = z.infer<
  typeof JobResponseGetListHrSchema
>;

export const JobResponseGetShareJobSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(JobShareRequestSchema),
});

export type JobResponseShareJobItem = z.infer<
  typeof JobResponseGetShareJobSchema
>;
