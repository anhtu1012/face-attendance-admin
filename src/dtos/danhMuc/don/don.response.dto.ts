import { z } from "zod";
import { FormItemSchema } from "./don.dto";

export const DanhMucDonResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(FormItemSchema),
});

export type FormResponseGetItem = z.infer<
  typeof DanhMucDonResponseGetSchema
>; 