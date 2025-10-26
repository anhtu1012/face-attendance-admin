import { z } from "zod";

export const HolidayDtoSchema = z.object({
  id: z.string(),
  date: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["public", "custom", "lunar"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type HolidayDtoType = z.infer<typeof HolidayDtoSchema>;

export const CreateHolidayDtoSchema = z.object({
  unitKey: z.string(),
  date: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["public", "custom", "lunar"]),
});

export type CreateHolidayDtoType = z.infer<typeof CreateHolidayDtoSchema>;

// Simple statistics schema used in responses
export const StatisticSchema = z.object({
  typePublic: z.number().int().nonnegative(),
  typeCustom: z.number().int().nonnegative(),
  typeLunar: z.number().int().nonnegative(),
  totalOffMonth: z.number().int().nonnegative(),
  totalOffYear: z.number().int().nonnegative(),
});

export type StatisticType = z.infer<typeof StatisticSchema>;
