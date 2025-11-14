import { z } from "zod";
import zApplicationItem from "./application.dto";

export const QuanlyDonTuResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(zApplicationItem),
});

export type QuanlyDonTuResponseGetItem = z.infer<
  typeof QuanlyDonTuResponseGetSchema
>;
