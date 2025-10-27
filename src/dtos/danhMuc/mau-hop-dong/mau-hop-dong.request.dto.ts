import { z } from "zod";
import { MauHopDongResponseGetSchema } from "./mau-hop-dong.response.dto";
/**
 * Schema and type for creating a contract type
 */
export const CreateMauHopDongeSchema = z.object({
  contractTypeId: z.string().optional(),
  templateContract: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
});

export type CreateMauHopDongeRequest = z.infer<typeof CreateMauHopDongeSchema>;

/**
 * Schema and type for updating a contract type
 */
export const UpdateMauHopDongeSchema = MauHopDongResponseGetSchema.omit({})
  .partial()
  .extend({
    // All fields are optional, but when provided they must pass validation
    templateContract: z
      .string()
      .min(1, "Title contract code is required")
      .optional(),
    content: z.string().min(1, "Title contract name is required").optional(),
    description: z.string().optional(),
  });

export type UpdateMauHopDongeRequest = z.infer<typeof UpdateMauHopDongeSchema>;
