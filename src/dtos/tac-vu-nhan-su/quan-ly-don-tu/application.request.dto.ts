import { z } from "zod";

export const zCreateApplicationRequest = z.object({
  reason: z.string(),
  formCategoryId: z.string(),
  formCategoryTitle: z.string(),
  submittedBy: z.string(),
  submittedName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  files: z.array(z.string()).optional().default([]),
});

export const zUpdateApplicationRequest = z.object({
  reason: z.string().optional(),
  response: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedName: z.string().optional(),
  approvedTime: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  files: z.array(z.string()).optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
});

export type CreateApplicationRequest = z.infer<
  typeof zCreateApplicationRequest
>;
export type UpdateApplicationRequest = z.infer<
  typeof zUpdateApplicationRequest
>;

export default zCreateApplicationRequest;
