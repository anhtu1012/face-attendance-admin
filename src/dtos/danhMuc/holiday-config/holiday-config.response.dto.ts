import { z } from "zod";
import { HolidayDtoSchema, StatisticSchema } from "./holiday-config.dto";

export const HolidayResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(HolidayDtoSchema),
  statistic: StatisticSchema,
});

export type HolidayResponseGetItem = z.infer<typeof HolidayResponseGetSchema>;
