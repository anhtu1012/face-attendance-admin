import { z } from "zod";

/**
 * Schema and type for select option
 */
export const SelectOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type SelectOption = z.infer<typeof SelectOptionSchema>;

/**
 * Schema for an array of select options
 */
export const SelectOptionsArraySchema = z.array(SelectOptionSchema);

export type SelectOptionsArray = z.infer<typeof SelectOptionsArraySchema>;
