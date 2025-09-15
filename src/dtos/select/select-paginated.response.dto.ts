import { z } from "zod";
import { SelectOptionSchema, SelectOptionsArraySchema } from "./select.dto";

/**
 * Schema and type for basic select option response
 */
export const SelectOptionResponseSchema = SelectOptionSchema;
export type SelectOptionResponseItem = z.infer<
  typeof SelectOptionResponseSchema
>;

/**
 * Schema and type for array of select options response
 */
export const SelectOptionsResponseSchema = SelectOptionsArraySchema;
export type SelectOptionsResponseArray = z.infer<
  typeof SelectOptionsResponseSchema
>;

/**
 * Schema and type for grouped select options response
 */
export const GroupedSelectOptionsResponseSchema = z.record(
  SelectOptionsArraySchema
);
export type GroupedSelectOptionsResponse = z.infer<
  typeof GroupedSelectOptionsResponseSchema
>;

/**
 * Schema and type for paginated select options response
 */
export const PaginatedSelectOptionsResponseSchema = z.object({
  count: z.number(),
  limit: z.number().optional(),
  page: z.number().optional(),
  data: SelectOptionsArraySchema,
});

export type PaginatedSelectOptionsResponse = z.infer<
  typeof PaginatedSelectOptionsResponseSchema
>;
