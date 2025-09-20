import { z } from "zod";
import { KyNangItemSchema } from "./kyNang.dto";

/**
 * Schema and type for creating a skill
 */
export const CreateKyNangSchema = z.object({
  unitKey: z.string().optional(),
  skillCode: z.string().min(1, "Skill code is required"),
  userSkillCode: z.string(),
  title: z.string().min(1, "Title is required"),
});

export type CreateKyNangRequest = z.infer<typeof CreateKyNangSchema>;

/**
 * Schema and type for updating a skill
 */
export const UpdateKyNangSchema = KyNangItemSchema.omit({
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    id: z.string().optional(),
    unitKey: z.string().optional(),
    skillCode: z.string().min(1, "Skill code is required").optional(),
    userSkillCode: z.string().optional(),
    title: z.string().min(1, "Title is required").optional(),
  });

export type UpdateKyNangRequest = z.infer<typeof UpdateKyNangSchema>;
