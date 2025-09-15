import { z } from "zod";
import { ThueItemSchema } from "./thue.dto";

export const ThueResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(ThueItemSchema),
});

export type ThueResponseGetItem = z.infer<typeof ThueResponseGetSchema>;
