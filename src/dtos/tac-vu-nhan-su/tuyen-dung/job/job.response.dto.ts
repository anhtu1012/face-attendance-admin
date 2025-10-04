import { z } from "zod";
import { JobItemSchema } from "./job.dto";

export const JobResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(JobItemSchema),
});

export type JobResponseGetItem = z.infer<typeof JobResponseGetSchema>;
