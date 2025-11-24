import { z } from "zod";

// Người dùng Schema
export const UserCreateContractItemSchema = z.object({
  unitKey: z.string().optional(),
  id: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  fullName: z.string(),
  userName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").optional(),
  birthDay: z.string().datetime(),
  citizenIdentityCard: z.string(),
  issueDate: z.string().datetime(),
  issueAt: z.string().optional(),
  currentAddress: z.string().max(255),
  nationality: z.string(),
  fullNameManager: z.string().optional(),
  departmentId: z.string().optional(),
  departmentName: z.string().optional(),
  positionId: z.string().optional(),
  isActive: z.boolean().optional(),
  status: z.string().nullable().optional(),
});

export type UserCreateContractItem = z.infer<
  typeof UserCreateContractItemSchema
>;
