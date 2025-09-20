import { z } from "zod";

export const PositionSchema = z.object({
  id: z.string().or(z.bigint()).optional(), // Support both string and BigInt
  unitKey: z.string().optional(),
  positionName: z.string(),
  roleCode: z.string(),
  description: z.string().optional(),
  overtimeSalary: z.string().or(z.number()).nullable().optional(),
  lateFine: z.string().or(z.number()).nullable().optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type Position = z.infer<typeof PositionSchema>;
