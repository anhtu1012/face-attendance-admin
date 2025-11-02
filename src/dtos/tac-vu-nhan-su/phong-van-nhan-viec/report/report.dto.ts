import { z } from "zod";

// Schema for interviewer information
const InterviewerInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  roleName: z.string().optional(),
  roleCode: z.string().optional(),
  departmentName: z.string().optional(),
});

export const ReportInterviewSchema = z.object({
  id: z.string(),
  createdAt: z.string().optional(), // ISO datetime
  updatedAt: z.string().optional(), // ISO datetime
  description: z.string().optional(),
  status: z.string().optional(),
  interviewerInfo: InterviewerInfoSchema.optional(),
});

export type ReportInterview = z.infer<typeof ReportInterviewSchema>;
