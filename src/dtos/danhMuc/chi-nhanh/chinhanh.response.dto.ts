import { z } from "zod";
import { BranchSchema } from "./chinhanh.dto";

export const DanhMucBranchResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(BranchSchema),
});

export type DanhMucBranchResponseGetItem = z.infer<
  typeof DanhMucBranchResponseGetSchema
>;
