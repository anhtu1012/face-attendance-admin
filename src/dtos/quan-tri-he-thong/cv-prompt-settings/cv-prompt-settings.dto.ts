import { z } from "zod";
import { CvPromptSettingsSchema } from "@/types/CvPromptSettings";

// Reuse the main schema from types
export const CvPromptSettingsItemSchema = CvPromptSettingsSchema;

export type CvPromptSettingsItem = z.infer<typeof CvPromptSettingsItemSchema>;

