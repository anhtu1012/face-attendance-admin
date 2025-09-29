import { z } from "zod";
import { TuyenDungItemSchema } from "./tuyen-dung.dto";

export const TuyenDungResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(TuyenDungItemSchema),
});

export type TuyenDungResponseGetItem = z.infer<
  typeof TuyenDungResponseGetSchema
>;
