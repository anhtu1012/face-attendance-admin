import { z } from "zod";
import { JobItemSchema } from "./job.dto";

export const CreateJobSchema = z.object({
  jobTitle: z.string().optional(),
  jobDescription: z.string().optional(),
  jobOverview: z.string().optional(),
  jobResponsibility: z.string().optional(),
  jobBenefit: z.string().optional(),
  trialPeriod: z.string().optional(),
  fromSalary: z.string().optional(),
  toSalary: z.string().optional(),
  requireExperience: z.string().optional(),
  expirationDate: z.string().optional(),
  address: z.string().optional(),
  supervisorId: z.string().optional(),
  positionId: z.string().optional(),
  requireSkill: z.array(z.string()).optional(),
  departmentId: z.string().optional(),
});

export type CreateJobRequest = z.infer<typeof CreateJobSchema>;

export const UpdateJobSchema = JobItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UpdateJobRequest = z.infer<typeof UpdateJobSchema>;
