import { z } from "zod";

/**
 * Schema and type for permision auth keycloack
 */
export const UserInforSchema = z.object({
  id: z.string().or(z.bigint()), // Support both string and BigInt representations
  code: z.string(),
  userName: z.string(),
  password: z.string().optional(), // Optional as it may not be returned in responses
  roleCode: z.string(),
  role: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string().optional(),
  faceImg: z.string(),
  email: z.string(),
  dob: z.string().or(z.date()), // Support both string and Date representations
  address: z.string(),
  phone: z.string(),
  contract: z.string(),
  branchCode: z.string(),
  managedBy: z.string(),
  branchName: z.string(),
  createdAt: z.string().or(z.date()).optional(),
  createdBy: z.string(),
  updatedAt: z.string().or(z.date()).optional(),
  updatedBy: z.string().optional(),
  isActive: z.boolean().optional(),
  note: z.string().optional(),
});

export type UserInfor = z.infer<typeof UserInforSchema>;
