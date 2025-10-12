import { z } from "zod";
import { BoPhanSchema } from "./bophan.dto";

export const CreateBoPhanSchema = BoPhanSchema.pick({
  departmentName: true,
  description: true,
});
export type CreateBoPhanRequest = z.infer<typeof CreateBoPhanSchema>;

export const UpdateBoPhanSchema = BoPhanSchema.extend({
  id: z.string().optional(),
});
export type UpdateBoPhanRequest = z.infer<typeof UpdateBoPhanSchema>;
