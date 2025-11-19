import { z } from "zod";

// Form Item Schema
export const FormItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string(),
  description: z.string(),
  roleId: z.string(),
});

export type FormItem = z.infer<typeof FormItemSchema>;
