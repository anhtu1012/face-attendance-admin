import { z } from "zod";
import { NguoiDungItemSchema } from "./nguoi-dung.dto";

export const NguoiDungResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(NguoiDungItemSchema),
});

export type NguoiDungResponseGetItem = z.infer<
  typeof NguoiDungResponseGetSchema
>;
