import { z } from "zod";

export const CreateBranchSchema = z.object({
  branchName: z.string().min(2, "Branch name must be at least 2 characters"),
  addressLine: z.string().or(z.number()),
  placeId: z.string().or(z.number()),
  city: z.string().or(z.number()),
  district: z.string().or(z.number()),
  lat: z.string().or(z.number()),
  long: z.string().or(z.number()),
});

export type CreateBranchRequest = z.infer<typeof CreateBranchSchema>;

/**
 * Schema and type for updating a branch
 */
export const UpdateBranchSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  branchName: z
    .string()
    .min(2, "Branch name must be at least 2 characters")
    .optional(),
  addressLine: z.string().or(z.number()).optional(),
  placeId: z.string().or(z.number()).optional(),
  city: z.string().or(z.number()).optional(),
  district: z.string().or(z.number()).optional(),
  lat: z.string().or(z.number()).optional(),
  long: z.string().or(z.number()).optional(),
});

export type UpdateBranchRequest = z.infer<typeof UpdateBranchSchema>;
