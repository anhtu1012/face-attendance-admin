import { z } from "zod";
import { PositionSchema } from "./chucVu.dto";

/**
 * Schema and type for creating a position
 */
export const CreatePositionSchema = z.object({
  unitKey: z.string().optional(),
  positionName: z
    .string()
    .min(2, "Position name must be at least 2 characters"),
  roleId: z.string(),
  description: z.string().optional(),
  overtimeSalary: z.string().or(z.number()).optional(),
  lateFine: z.string().or(z.number()).optional(),
});

export type CreatePositionRequest = z.infer<typeof CreatePositionSchema>;

/**
 * Schema and type for updating a position
 */
export const UpdatePositionSchema = PositionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
})
  .partial()
  .extend({
    // All fields are optional, but when provided they must pass validation
    positionName: z
      .string()
      .min(2, "Position name must be at least 2 characters")
      .optional(),
    roleId: z.string().optional(),
    description: z.string().optional(),
    overtimeSalary: z.string().or(z.number()).nullable().optional(),
    lateFine: z.string().or(z.number()).nullable().optional(),
  });

export type UpdatePositionRequest = z.infer<typeof UpdatePositionSchema>;
