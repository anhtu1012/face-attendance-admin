import { z } from "zod";

// Người dùng Schema
export const CauHinhMenuItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  resourceCode: z.string(),
  resourceName: z.string(),
  parentName: z.string(),
  scopes: z.array(z.string()),
  sort: z.string().optional(),
});

export type CauHinhMenuItem = z.infer<typeof CauHinhMenuItemSchema>;
