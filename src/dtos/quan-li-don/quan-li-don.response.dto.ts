import { z } from "zod";
import { FormItemSchema } from "./quan-li-don";

export const FormResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(FormItemSchema),
});

export type FormResponseGetItem = z.infer<
  typeof FormResponseGetSchema
>; 