import { z } from "zod";
import { CauHinhMenuItemSchema } from "./cau-hinh-menu.dto";

export const CauHinhMenuResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(CauHinhMenuItemSchema),
});

export type CauHinhMenuResponseGetItem = z.infer<
  typeof CauHinhMenuResponseGetSchema
>;
