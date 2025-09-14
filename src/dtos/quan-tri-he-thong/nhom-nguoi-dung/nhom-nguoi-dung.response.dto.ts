import { z } from "zod";
import { NhomNguoiDungItemSchema } from "./nhom-nguoi-dung.dto";

export const NhomNguoiDungResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(NhomNguoiDungItemSchema),
});

export type NhomNguoiDungResponseGetItem = z.infer<
  typeof NhomNguoiDungResponseGetSchema
>;
