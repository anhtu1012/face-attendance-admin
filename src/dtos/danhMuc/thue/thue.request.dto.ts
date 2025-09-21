import { z } from "zod";
import { ThueItemSchema } from "./thue.dto";

/**
 * Schema and type for creating a shift
 */
export const CreateThueSchema = z.object({
  unitKey: z.string().optional(),
  taxCode: z.string().min(1, "Tên thuế làm là bắt buộc"),
  taxName: z.string().min(1, "Giờ bắt đầu là bắt buộc"),
  taxPercent: z.number().min(0, "Phần trăm là bắt buộc"),
});

export type CreateThueRequest = z.infer<typeof CreateThueSchema>;

/**
 * Schema and type for updating a shift
 */
export const UpdateThueSchema = ThueItemSchema.omit({
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    id: z.string().optional(),
    unitKey: z.string().optional(),
    taxCode: z.string().min(1, "Tên thuế làm là bắt buộc"),
    taxName: z.string().min(1, "Giờ bắt đầu là bắt buộc"),
    taxPercent: z.number().min(0, "Phần trăm là bắt buộc"),
  });

export type UpdateThueRequest = z.infer<typeof UpdateThueSchema>;
