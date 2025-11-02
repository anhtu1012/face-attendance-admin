import { z } from "zod";

export const RecruiterSchema = z.object({
  fullName: z.string().optional(),
  recruiterPositionName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const inFoHrSchema = z.object({
  fullName: z.string().optional(),
  inFoHrPositionName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const StatisticsSchema = z.object({
  applicants: z.string().optional(),
  shortlisted: z.string().optional(),
  properRatio: z.string().optional(),
});

export const JobInfoSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string().optional(),
  jobOverview: z.string().optional(),
  jobResponsibility: z.string().optional(),
  jobCode: z.string().optional(),
  positionName: z.string().optional(),
  jobBenefit: z.string().optional(),
  address: z.string().optional(),
  requireExperience: z.string().optional(),
  listSkills: z.array(z.string()).optional(),
  expirationDate: z.string().optional(),
  round: z.union([z.string(), z.number()]).optional(),
  isActive: z.boolean().optional(),
  trialPeriod: z.string().optional(),
  fromSalary: z.string().optional(),
  toSalary: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  recruiter: RecruiterSchema.optional(),
  statistics: StatisticsSchema.optional(),
});

export const JobOfferSchema = z.object({
  id: z.string(),
  jobOfferId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  date: z.string(),
  address: z.string().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"]),
  notes: z.string().nullable().optional(),
  jobInfor: JobInfoSchema.optional(),
  inFoHr: inFoHrSchema,
});

export type Recruiter = z.infer<typeof RecruiterSchema>;
export type Statistics = z.infer<typeof StatisticsSchema>;
export type JobInfo = z.infer<typeof JobInfoSchema>;
export type JobOfferItem = z.infer<typeof JobOfferSchema>;

// For request
export interface CreateJobOfferRequest {
  date: string;
  note?: string;
  hrId?: string;
  jobId?: string;
  userName?: string;
  listParticipantId: string[];
}
