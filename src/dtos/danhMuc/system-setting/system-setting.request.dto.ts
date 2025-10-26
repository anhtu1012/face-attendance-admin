import { z } from "zod";
import { SystemSettingItemSchema } from "./system-setting.dto";

/**
 * Schema and type for creating a system setting
 */
export const CreateSystemSettingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  value: z.string().min(1, "Value is required"),
  isActive: z.boolean(),
});

export type CreateSystemSettingRequest = z.infer<
  typeof CreateSystemSettingSchema
>;

/**
 * Schema and type for updating a system setting
 */
export const UpdateSystemSettingSchema = SystemSettingItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    // All fields are optional, but when provided they must pass validation
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    value: z.string().min(1, "Value is required").optional(),
    isActive: z.boolean().optional(),
  });

export type UpdateSystemSettingRequest = z.infer<
  typeof UpdateSystemSettingSchema
>;
