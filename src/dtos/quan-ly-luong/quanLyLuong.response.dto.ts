import { z } from "zod";
import { QuanLyLuongSchema } from "./quanLyLuong.dto";

/**
 * Schema and type for single working schedule response
 */
export const QuanLyLuongResponseSchema = QuanLyLuongSchema;
export type QuanLyLuongResponseItem = z.infer<typeof QuanLyLuongResponseSchema>;

/**
 * Schema and type for paginated working schedules response
 */
export const PaginatedQuanLyLuongResponseSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(QuanLyLuongSchema),
});

export type PaginatedQuanLyLuongResponse = z.infer<
  typeof PaginatedQuanLyLuongResponseSchema
>;
