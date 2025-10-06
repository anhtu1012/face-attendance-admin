import { z } from "zod";

export const JobStatusEnum = z.enum(["OPEN", "CLOSED"]);
export type JobStatus = z.infer<typeof JobStatusEnum>;
// Job (Vị trí tuyển dụng) schema
export const JobItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  jobTitle: z.string(),
  jobDescription: z.string().optional(),
  jobOverview: z.string().optional(),
  jobResponsibility: z.string().optional(),
  jobBenefit: z.string().optional(),
  trialPeriod: z.string().optional(),
  fromSalary: z.string().optional(),
  toSalary: z.string().optional(),
  requireExperience: z.string().optional(),
  expirationDate: z.string().optional(), // ISO date string
  address: z.string().optional(),
  supervisorId: z.string().optional(),
  positionId: z.string().optional(),
  positionName: z.string().optional(),
  requireSkill: z.array(z.string()),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  status: JobStatusEnum, // e.g., "ACTIVE": open, "CLOSED": closed
  jobCode: z.string().optional(), // Mã công việc
});

export type JobItem = z.infer<typeof JobItemSchema>;
