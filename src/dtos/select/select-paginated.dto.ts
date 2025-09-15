import { z } from "zod";

/**
 * Schema and type for select option
 */
export const SelectPaginatedOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type SelectOption = z.infer<typeof SelectPaginatedOptionSchema>;

/**
 * Schema for an array of select options
 */
export const SelectOptionsArraySchema = z.array(SelectPaginatedOptionSchema);

export type SelectOptionsArray = z.infer<typeof SelectOptionsArraySchema>;
