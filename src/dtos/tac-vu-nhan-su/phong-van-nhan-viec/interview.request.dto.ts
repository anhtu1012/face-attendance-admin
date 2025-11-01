import { z } from "zod";

export const CreateInterviewReportSchema = z.object({
  status: z.enum([
    "TO_INTERVIEW_R1",
    "TO_INTERVIEW_R2",
    "TO_INTERVIEW_R3",
    "TO_INTERVIEW_R4",
    "TO_INTERVIEW_R5",
    "INTERVIEW_RESCHEDULED",
    "INTERVIEW_FAILED",
    "NOT_COMING_INTERVIEW",
    "JOB_OFFERED",
  ]),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  intervieweeId: z.string().min(1, "intervieweeId là bắt buộc"),
  userId: z.string(),
});

export type CreateInterviewReportRequest = z.infer<
  typeof CreateInterviewReportSchema
>;

// If you also want an update schema in future, we can add it here.
