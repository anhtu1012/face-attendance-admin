import { z } from "zod";

// Thue Item Schema
export const ThueItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  taxCode: z.string(),
  taxName: z.string(),
  taxPercent: z.number(),
});

export type ThueItem = z.infer<typeof ThueItemSchema>;
