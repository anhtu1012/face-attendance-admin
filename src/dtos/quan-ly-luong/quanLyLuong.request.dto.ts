import { z } from "zod";
import { QuanLyLuongStatusEnum } from "./quanLyLuong.dto";
/**
 * Schema and type for updating a working schedule
 */
export const UpdateQuanLyLuongSchema = z.object({
  status: QuanLyLuongStatusEnum,
});

export type UpdateQuanLyLuongRequest = z.infer<typeof UpdateQuanLyLuongSchema>;
