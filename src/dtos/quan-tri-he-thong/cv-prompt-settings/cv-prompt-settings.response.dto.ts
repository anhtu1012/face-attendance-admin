import { z } from "zod";
import { CvPromptSettingsItemSchema } from "./cv-prompt-settings.dto";

// Single CV Prompt Settings Response
export const CvPromptSettingsResponseItemSchema = CvPromptSettingsItemSchema;

export type CvPromptSettingsResponseItem = z.infer<
  typeof CvPromptSettingsResponseItemSchema
>;

// List CV Prompt Settings Response
export const CvPromptSettingsResponseGetItemSchema = z.object({
  data: z.array(CvPromptSettingsResponseItemSchema),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type CvPromptSettingsResponseGetItem = z.infer<
  typeof CvPromptSettingsResponseGetItemSchema
>;

// Create/Update Response
export const CvPromptSettingsResponseMutationSchema = z.object({
  success: z.boolean(),
  data: CvPromptSettingsResponseItemSchema.optional(),
  message: z.string().optional(),
});

export type CvPromptSettingsResponseMutation = z.infer<
  typeof CvPromptSettingsResponseMutationSchema
>;

