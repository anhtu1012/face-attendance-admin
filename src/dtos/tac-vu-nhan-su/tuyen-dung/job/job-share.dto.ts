import { z } from "zod";

export const HRUserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type HRUser = z.infer<typeof HRUserSchema>;

export const ShareJobRequestSchema = z.object({
  jobId: z.string(),
  assignedHrId: z.string(),
  hrId: z.string().optional(),
});
export type ShareJobRequest = z.infer<typeof ShareJobRequestSchema>;

export const ShareJobResponseSchema = z.object({
  id: z.string(),
  jobCode: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  message: z.string().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "INACTIVE"]),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});
export type ShareJobResponse = z.infer<typeof ShareJobResponseSchema>;

export const JobShareRequestSchema = z.object({
  id: z.string(),
  jobCode: z.string(),
  jobTitle: z.string(),
  fromUser: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    avatar: z.string().optional(),
  }),
  toUser: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    avatar: z.string().optional(),
  }),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "INACTIVE"]),
  createdAt: z.string(),
  message: z.string().optional(),
});
export type JobShareRequest = z.infer<typeof JobShareRequestSchema>;

export const AcceptShareRequestSchema = z.object({
  requestId: z.string(),
});
export type AcceptShareRequest = z.infer<typeof AcceptShareRequestSchema>;

export const RejectShareRequestSchema = z.object({
  requestId: z.string(),
  reason: z.string().optional(),
});
export type RejectShareRequest = z.infer<typeof RejectShareRequestSchema>;
