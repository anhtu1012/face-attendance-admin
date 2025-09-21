import { z } from "zod";
import { TroCapItemSchema } from "./troCap.dto";

/**
 * Schema and type for creating an allowance
 */
export const CreateTroCapSchema = z.object({
  unitKey: z.string().optional(),
  allowanceCode: z.string().min(1, "Allowance code is required"),
  allowanceName: z.string().min(1, "Allowance name is required"),
  allowanceAmount: z.number().min(0, "Allowance amount must be non-negative"),
  note: z.string(),
});

export type CreateTroCapRequest = z.infer<typeof CreateTroCapSchema>;

/**
 * Schema and type for updating an allowance
 */
export const UpdateTroCapSchema = TroCapItemSchema.omit({
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    id: z.string().optional(),
    unitKey: z.string().optional(),
    allowanceCode: z.string().min(1, "Allowance code is required").optional(),
    allowanceName: z.string().min(1, "Allowance name is required").optional(),
    allowanceAmount: z
      .number()
      .min(0, "Allowance amount must be non-negative")
      .optional(),
    note: z.string().optional(),
  });

export type UpdateTroCapRequest = z.infer<typeof UpdateTroCapSchema>;
