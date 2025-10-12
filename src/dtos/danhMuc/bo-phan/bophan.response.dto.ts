import { z } from "zod";
import { BoPhanSchema } from "./bophan.dto";

export const DanhMucBoPhanResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(BoPhanSchema),
});

export type DanhMucBoPhanResponseGetItem = z.infer<
  typeof DanhMucBoPhanResponseGetSchema
>;
