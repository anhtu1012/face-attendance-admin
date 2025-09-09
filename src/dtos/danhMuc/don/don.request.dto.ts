import { z } from "zod";
import { FormItemSchema } from "./don.dto";

/**
 * Schema and type for creating a form
 */
export const CreateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  roleCode: z.string().min(1, "Role code is required"),
});

export type CreateFormRequest = z.infer<typeof CreateFormSchema>;

/**
 * Schema and type for updating a form
 */
export const UpdateFormSchema = FormItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    // All fields are optional, but when provided they must pass validation
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    roleCode: z.string().min(1, "Role code is required").optional(),
  });

export type UpdateFormRequest = z.infer<typeof UpdateFormSchema>; 