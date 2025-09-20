import { z } from "zod";
import { TroCapItemSchema } from "./troCap.dto";

export const TroCapResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(TroCapItemSchema),
});

export type TroCapResponseGetItem = z.infer<typeof TroCapResponseGetSchema>;
