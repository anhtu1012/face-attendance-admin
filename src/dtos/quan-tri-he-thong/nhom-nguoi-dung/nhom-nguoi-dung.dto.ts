import { z } from "zod";

// Nhóm người dùng Schema
export const NhomNguoiDungItemSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  unitKey: z.string().optional(),
  roleCode: z.string(),
  roleName: z.string(),
});

export type NhomNguoiDungItem = z.infer<typeof NhomNguoiDungItemSchema>;
