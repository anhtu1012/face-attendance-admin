import { z } from "zod";
import { AppendixDetailSchema } from "./appendix.dto";

export const QuanlyPhuLucResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(AppendixDetailSchema),
});

export type QuanlyPhuLucResponseGetItem = z.infer<
  typeof QuanlyPhuLucResponseGetSchema
>;
