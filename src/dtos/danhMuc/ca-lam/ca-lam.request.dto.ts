import { z } from "zod";
import { CaLamItemSchema } from "./ca-lam.dto";

/**
 * Schema and type for creating a shift
 */
export const CreateCaLamSchema = z.object({
  name: z.string().min(1, "Tên ca làm là bắt buộc"),
  startTime: z.string().min(1, "Giờ bắt đầu là bắt buộc"),
  endTime: z.string().min(1, "Giờ kết thúc là bắt buộc"),
  lunchBreak: z.number(),
  workingHours: z.number(),
  isActive: z.boolean(),
});

export type CreateCaLamRequest = z.infer<typeof CreateCaLamSchema>;

/**
 * Schema and type for updating a shift
 */
export const UpdateCaLamSchema = CaLamItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    name: z.string().min(1, "Tên ca làm là bắt buộc").optional(),
    startTime: z.string().min(1, "Giờ bắt đầu là bắt buộc").optional(),
    endTime: z.string().min(1, "Giờ kết thúc là bắt buộc").optional(),
    lunchBreak: z.number().optional(),
    workingHours: z.number().optional(),
    isActive: z.boolean().optional(),
  });

export type UpdateCaLamRequest = z.infer<typeof UpdateCaLamSchema>;
