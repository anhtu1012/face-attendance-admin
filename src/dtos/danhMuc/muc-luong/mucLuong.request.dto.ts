/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { MucLuongSchema } from "./mucLuong.dto";

const BaseCreateMucLuongSchema = (MucLuongSchema as any).pick({
  levelName: true,
  startSalary: true,
  endSalary: true,
  description: true,
});

export const CreateMucLuongSchema = BaseCreateMucLuongSchema.refine(
  (data: z.infer<typeof BaseCreateMucLuongSchema>) =>
    data.endSalary >= data.startSalary,
  {
    message: "End salary must be greater than or equal to start salary",
    path: ["endSalary"],
  }
);
export type CreateMucLuongRequest = z.infer<typeof CreateMucLuongSchema>;

export const UpdateMucLuongSchema = (MucLuongSchema as any).extend({
  id: z.string().optional(),
});
export type UpdateMucLuongRequest = z.infer<typeof UpdateMucLuongSchema>;
