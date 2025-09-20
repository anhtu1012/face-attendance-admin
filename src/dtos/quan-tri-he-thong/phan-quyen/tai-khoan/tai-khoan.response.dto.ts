import { z } from "zod";
import { TaiKhoanNhomVaiTroItemSchema } from "./tai-khoan.dto";

export const TaiKhoanNhomVaiTroResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(TaiKhoanNhomVaiTroItemSchema),
});

export type TaiKhoanNhomVaiTroResponseGetItem = z.infer<
  typeof TaiKhoanNhomVaiTroResponseGetSchema
>;
