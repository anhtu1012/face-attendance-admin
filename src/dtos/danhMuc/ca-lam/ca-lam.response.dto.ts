import { z } from "zod";
import { CaLamItemSchema } from "./ca-lam.dto";

export const CaLamResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(CaLamItemSchema),
});

export type CaLamResponseGetItem = z.infer<
  typeof CaLamResponseGetSchema
>; 