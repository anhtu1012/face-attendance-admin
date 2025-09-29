import { z } from "zod";
import { TuyenDungItemSchema } from "./tuyen-dung.dto";

/**
 * Schema and type for creating a recruitment candidate
 */
export const CreateTuyenDungSchema = z.object({
  firstName: z.string().min(1, "Tên là bắt buộc"),
  lastName: z.string().min(1, "Họ là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  birthDay: z.string(), // ISO date string
  file: z.string().optional(), // URL to the CV file
  address: z.string(),
  gender: z.enum(["Male", "Female"]),
  status: z.string().optional(),
});

export type CreateTuyenDungRequest = z.infer<typeof CreateTuyenDungSchema>;

/**
 * Schema and type for updating a recruitment candidate
 */
export const UpdateTuyenDungSchema = TuyenDungItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UpdateTuyenDungRequest = z.infer<typeof UpdateTuyenDungSchema>;
