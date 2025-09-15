import { z } from "zod";

// Nhóm người dùng Schema
export const NhomNguoiDungItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  roleCode: z.string(),
  roleName: z.string(),
});

export type NhomNguoiDungItem = z.infer<typeof NhomNguoiDungItemSchema>; 