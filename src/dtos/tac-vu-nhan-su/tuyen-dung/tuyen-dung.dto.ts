import { z } from "zod";

// Tuyển dụng Schema
export const TuyenDungItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  birthDay: z.string(), // ISO date string
  address: z.string(),
  file: z.string().optional(), // URL to the CV file
  gender: z.enum(["M", "F", ""]),
  status: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TuyenDungItem = z.infer<typeof TuyenDungItemSchema>;
