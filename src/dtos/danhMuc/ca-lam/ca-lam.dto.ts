import { z } from "zod";

// CaLam Item Schema
export const CaLamItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  code: z.string(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  workingHours: z.number(),
  isActive: z.boolean(),
});

export type CaLamItem = z.infer<typeof CaLamItemSchema>;
