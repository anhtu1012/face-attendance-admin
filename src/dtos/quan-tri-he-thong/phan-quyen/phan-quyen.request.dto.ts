import { z } from "zod";
import { PhanQuyenItemSchema } from "./phan-quyen.dto";

/**
 * Schema and type for creating a user
 */
export const CreatePhanQuyenSchema = z.object({
  groupCode: z.string().min(2, "Mã vai trò là bắt buộc"),
  resourceCode: z.string().min(2, "Mã màn hình là bắt buộc"),
  resourceName: z.string().min(2, "Tên màn hình là bắt buộc"),
  parentName: z.string().min(2, "Tên danh mục là bắt buộc"),
  scopes: z.array(z.string()).min(1, "Thao tác là bắt buộc"),
  sort: z.string().optional(),
});

export type CreatePhanQuyenRequest = z.infer<typeof CreatePhanQuyenSchema>;

/**
 * Schema and type for updating a user
 */
export const UpdatePhanQuyenSchema = PhanQuyenItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    groupCode: z.string().min(2, "Mã vai trò là bắt buộc").optional(),
  });

export type UpdatePhanQuyenRequest = z.infer<typeof UpdatePhanQuyenSchema>;
