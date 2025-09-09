import { z } from "zod";

// Form Item Schema
export const FormItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  code: z.string(),
  reason: z.string(),
  status: z.string(),
  file: z.string().nullable(),
  startTime: z.string(),
  endTime: z.string(),
  approvedTime: z.string().nullable(),
  formTitle: z.string(),
  submittedBy: z.string(),
  approvedBy: z.string(),
  response: z.string().nullable(),
  formCode: z.string(),
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

// Update Status Schema
export const UpdateStatusSchema = z.object({
  status: z.string(),
  approvedTime: z.string().nullable(),
  approvedBy: z.string().nullable(),
  response: z.string().nullable(),
});

export type UpdateStatusRequest = z.infer<typeof UpdateStatusSchema>; 