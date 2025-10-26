import { z } from "zod";
import { SystemSettingItemSchema } from "./system-setting.dto";

export const SystemSettingResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(SystemSettingItemSchema),
});

export type SystemSettingResponseGetItem = z.infer<
  typeof SystemSettingResponseGetSchema
>;
