import { z } from "zod";

export const StoresSchema = z.object({
  id: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  price: z.number(),
  title: z.string(),
});

export type StoresItem = z.infer<typeof StoresSchema>;
