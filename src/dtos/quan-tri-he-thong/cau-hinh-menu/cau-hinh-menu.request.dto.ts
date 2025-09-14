import { z } from "zod";
import { CauHinhMenuItemSchema } from "./cau-hinh-menu.dto";

/**
 * Schema and type for creating a user
 */
export const CreateCauHinhMenuSchema = z.object({
  resourceCode: z.string().min(2, "Mã màn hình là bắt buộc"),
  resourceName: z.string().min(2, "Tên màn hình là bắt buộc"),
  parentName: z.string().min(2, "Tên danh mục là bắt buộc"),
  scopes: z.array(z.string()).min(1, "Thao tác là bắt buộc"),
  sort: z.string().optional(),
});

export type CreateCauHinhMenuRequest = z.infer<typeof CreateCauHinhMenuSchema>;

/**
 * Schema and type for updating a user
 */
export const UpdateCauHinhMenuSchema = CauHinhMenuItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    resourceCode: z.string().min(2, "Mã màn hình là bắt buộc").optional(),
  });

export type UpdateCauHinhMenuRequest = z.infer<typeof UpdateCauHinhMenuSchema>;
