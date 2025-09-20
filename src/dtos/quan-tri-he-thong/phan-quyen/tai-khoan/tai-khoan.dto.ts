import { z } from "zod";

export const TaiKhoanNhomVaiTroItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userName: z.string(),
  fullName: z.string(),
});

export type TaiKhoanNhomVaiTroItem = z.infer<
  typeof TaiKhoanNhomVaiTroItemSchema
>;
