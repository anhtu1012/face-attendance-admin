import { z } from "zod";

// Người dùng Schema
export const NguoiDungItemSchema = z.object({
  unitKey: z.string().optional(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  positionName: z.string().optional(),
  userCode: z.string().optional(),
  userName: z.string(),
  password: z.string(),
  roleId: z.string(),
  fullName: z.string(),
  email: z.string(),
  faceImg: z.string().optional(),
  birthDay: z.date(),
  gender: z.enum(["M", "F", ""]),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().max(255, "Địa chỉ không hợp lệ").optional(),
  isActive: z.boolean(),
});

export type NguoiDungItem = z.infer<typeof NguoiDungItemSchema>;
