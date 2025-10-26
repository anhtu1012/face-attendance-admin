import { z } from "zod";

// SystemSetting Item Schema
export const SystemSettingItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string(),
  description: z.string(),
  value: z.string(),
  isActive: z.boolean(),
});

export type SystemSettingItem = z.infer<typeof SystemSettingItemSchema>;
