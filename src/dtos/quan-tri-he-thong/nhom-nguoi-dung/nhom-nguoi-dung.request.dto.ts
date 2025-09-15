import { z } from "zod";
import { NhomNguoiDungItemSchema } from "./nhom-nguoi-dung.dto";

/**
 * Schema and type for creating a role group
 */
export const CreateNhomNguoiDungSchema = z.object({
  roleCode: z.string().min(1, "Mã vai trò là bắt buộc"),
});

export type CreateNhomNguoiDungRequest = z.infer<
  typeof CreateNhomNguoiDungSchema
>;

/**
 * Schema and type for updating a role group
 */
export const UpdateNhomNguoiDungSchema = NhomNguoiDungItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    roleCode: z.string().min(1, "Mã vai trò là bắt buộc").optional(),
  });

export type UpdateNhomNguoiDungRequest = z.infer<
  typeof UpdateNhomNguoiDungSchema
>;
