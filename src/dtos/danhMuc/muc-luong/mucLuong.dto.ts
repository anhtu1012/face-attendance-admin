import { z } from "zod";

export const MucLuongSchema = z
  .object({
    id: z.string().optional(),
    levelName: z.string().min(1, "Level name is required"),
    startSalary: z
      .number()
      .min(0, "Start salary must be greater than or equal to 0"),
    endSalary: z
      .number()
      .min(0, "End salary must be greater than or equal to 0"),
    description: z.string().optional(),
    unitKey: z.string().optional(),
  })
  .refine((data) => data.endSalary >= data.startSalary, {
    message: "End salary must be greater than or equal to start salary",
    path: ["endSalary"],
  });

export type MucLuong = z.infer<typeof MucLuongSchema>;
