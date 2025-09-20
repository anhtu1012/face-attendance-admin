import { z } from "zod";

export const PhanQuyenSchemaPayload = z.object({
  resourceCode: z.string().min(2, "Mã màn hình là bắt buộc"),
  resourceName: z.string().min(2, "Tên màn hình là bắt buộc"),
  parentName: z.string().min(2, "Tên danh mục là bắt buộc"),
  scopes: z.array(z.string()).min(1, "Thao tác là bắt buộc"),
  sort: z.string().optional(),
});

export const savePhanQuyenSchema = z.object({
  groupCode: z.string().array().min(2, "Mã vai trò là bắt buộc"),
  permissions: z.array(PhanQuyenSchemaPayload),
});

export type savePhanQuyenRequest = z.infer<typeof savePhanQuyenSchema>;