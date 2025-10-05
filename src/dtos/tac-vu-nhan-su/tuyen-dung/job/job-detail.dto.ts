import { z } from "zod";
import { JobItemSchema, JobStatusEnum } from "./job.dto";

// Recruiter information attached to a job posting
export const RecruiterSchema = z.object({
  fullName: z.string().optional(),
  positionName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// Simple statistics object as seen in incoming payloads (often strings)
export const JobStatisticsSchema = z.object({
  views: z.union([z.string(), z.number()]).optional(),
  applicants: z.union([z.string(), z.number()]).optional(),
  shortlisted: z.union([z.string(), z.number()]).optional(),
  applicationRate: z.number().optional(), // tỷ lệ ứng tuyển
  properRatio: z.number().optional(), // tỷ lệ phù hợp
});

// JobDetail extends the base JobItem with extra fields returned by detail APIs
export const JobDetailSchema = JobItemSchema.extend({
  // sometimes the backend uses a separate jobId field
  jobId: z.string().optional(),
  recruiter: RecruiterSchema,
  statistics: JobStatisticsSchema,
  // ensure status remains the same enum but allow optional in some responses
  status: JobStatusEnum,
});

export type JobDetail = z.infer<typeof JobDetailSchema>;
