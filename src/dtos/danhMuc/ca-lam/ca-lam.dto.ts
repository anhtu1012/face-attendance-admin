import { z } from "zod";

// CaLam Item Schema
export const CaLamItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  code: z.string(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  workingHours: z.number(),
  delayTime: z.string(),
});

export type CaLamItem = z.infer<typeof CaLamItemSchema>; 