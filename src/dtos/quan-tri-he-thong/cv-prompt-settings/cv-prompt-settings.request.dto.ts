import { z } from "zod";
import { CvPromptSettingsSchema } from "@/types/CvPromptSettings";

// Create CV Prompt Settings Request
export const CreateCvPromptSettingsRequestSchema = CvPromptSettingsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export type CreateCvPromptSettingsRequest = z.infer<
  typeof CreateCvPromptSettingsRequestSchema
>;

// Update CV Prompt Settings Request
export const UpdateCvPromptSettingsRequestSchema = CvPromptSettingsSchema.omit({
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
}).partial();

export type UpdateCvPromptSettingsRequest = z.infer<
  typeof UpdateCvPromptSettingsRequestSchema
>;

// Get CV Prompt Settings Request (query params)
export const GetCvPromptSettingsRequestSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export type GetCvPromptSettingsRequest = z.infer<
  typeof GetCvPromptSettingsRequestSchema
>;

