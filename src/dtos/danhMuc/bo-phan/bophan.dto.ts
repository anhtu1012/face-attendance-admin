import { z } from "zod";

export const BoPhanSchema = z.object({
  id: z.string().optional(),
  departmentName: z.string().min(1, "Department name is required"),
  description: z.string().optional(),
  shiftEndTime: z.string().optional(),
  shiftStartTime: z.string().optional(),
  lunchBreak: z.string().optional(),
  totalWorkHour: z.number().optional(),
  unitKey: z.string().optional(),
});

export type BoPhan = z.infer<typeof BoPhanSchema>;
