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

export const NguoiPhongVanResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      email: z.string(),
    })
  ),
});
export type NguoiPhongVanResponseGetItem = z.infer<
  typeof NguoiPhongVanResponseGetSchema
>;
