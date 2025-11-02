import { z } from "zod";
import { ReportInterviewSchema } from "./report.dto";

export const ReportResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(ReportInterviewSchema),
});

export type ReportResponseGetItem = z.infer<typeof ReportResponseGetSchema>;
