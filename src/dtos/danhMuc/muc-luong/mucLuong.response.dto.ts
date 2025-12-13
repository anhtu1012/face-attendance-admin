import { z } from "zod";
import { MucLuongSchema } from "./mucLuong.dto";

export const DanhMucMucLuongResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(MucLuongSchema),
});

export type DanhMucMucLuongResponseGetItem = z.infer<
  typeof DanhMucMucLuongResponseGetSchema
>;
