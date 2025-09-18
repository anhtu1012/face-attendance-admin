import { z } from "zod";
import { NguoiDungItemSchema } from "./nguoi-dung.dto";

/**
 * Schema and type for creating a user
 */
export const CreateNguoiDungSchema = z.object({
  userName: z.string().min(2, "Tên người dùng là bắt buộc"),
  password: z.string().nonempty("Mật khẩu không được để trống"),
  roleCode: z.string().min(1, "Mã vai trò là bắt buộc"),
  firstName: z.string().min(1, "Tên là bắt buộc"),
  lastName: z.string().min(1, "Họ là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  faceImg: z.string().optional(),
  birthDay: z.date(),
  gender: z.enum(["M", "F"]),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().max(255, "Địa chỉ không hợp lệ").optional(),
  isActive: z.boolean().optional(),
});

export type CreateNguoiDungRequest = z.infer<typeof CreateNguoiDungSchema>;

/**
 * Schema and type for updating a user
 */
export const UpdateNguoiDungSchema = NguoiDungItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    unitKey: z.string().min(1, "Mã unitKey là bắt buộc").optional(),
    roleCode: z.string().min(1, "Mã vai trò là bắt buộc").optional(),
  });

export type UpdateNguoiDungRequest = z.infer<typeof UpdateNguoiDungSchema>;
