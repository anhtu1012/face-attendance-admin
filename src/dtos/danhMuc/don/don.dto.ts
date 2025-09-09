import { z } from "zod";

// Form Item Schema
export const FormItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string(),
  description: z.string(),
  roleCode: z.string(),
});

export type FormItem = z.infer<typeof FormItemSchema>;

// Create Form Schema
export const CreateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  roleCode: z.string().min(1, "Role code is required"),
});

export type CreateFormRequest = z.infer<typeof CreateFormSchema>;

// Update Form Schema (similar to create but all fields are optional)
export const UpdateFormSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  roleCode: z.string().min(1, "Role code is required").optional(),
});

export type UpdateFormRequest = z.infer<typeof UpdateFormSchema>; 