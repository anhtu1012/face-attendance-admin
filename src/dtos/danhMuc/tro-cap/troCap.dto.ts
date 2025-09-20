import { z } from "zod";

// Tro Cap Item Schema
export const TroCapItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  allowanceCode: z.string(),
  allowanceName: z.string(),
  allowanceAmount: z.number(),
  note: z.string(),
});

export type TroCapItem = z.infer<typeof TroCapItemSchema>;
