import { z } from "zod";
import { KyNangItemSchema } from "./kyNang.dto";

export const KyNangResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(KyNangItemSchema),
});

export type KyNangResponseGetItem = z.infer<typeof KyNangResponseGetSchema>;
