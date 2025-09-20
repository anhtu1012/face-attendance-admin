import { z } from "zod";
import { PositionSchema } from "./chucVu.dto";

export const DanhMucChucVuResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(PositionSchema),
});

export type DanhMucChucVuResponseGetItem = z.infer<
  typeof DanhMucChucVuResponseGetSchema
>;
