import { z } from "zod";

// Key Nang Item Schema
export const KyNangItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  title: z.string(),
});

export type KyNangItem = z.infer<typeof KyNangItemSchema>;
