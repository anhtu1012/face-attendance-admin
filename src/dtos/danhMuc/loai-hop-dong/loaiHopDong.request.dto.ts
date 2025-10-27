import { z } from "zod";
import { ContractTypeSchema } from "./loaiHopDong.dto";

/**
 * Schema and type for creating a contract type
 */
export const CreateContractTypeSchema = z.object({
  unitKey: z.string(),
  titleContractCode: z.string().min(1, "Title contract code is required"),
  titleContractName: z.string().min(1, "Title contract name is required"),
  note: z.string(),
  status: z.boolean(),
});

export type CreateContractTypeRequest = z.infer<
  typeof CreateContractTypeSchema
>;

/**
 * Schema and type for updating a contract type
 */
export const UpdateContractTypeSchema = ContractTypeSchema.omit({
  id: true,
})
  .partial()
  .extend({
    // All fields are optional, but when provided they must pass validation
    titleContractCode: z
      .string()
      .min(1, "Title contract code is required")
      .optional(),
    titleContractName: z
      .string()
      .min(1, "Title contract name is required")
      .optional(),
    note: z.string().optional(),
    status: z.boolean().optional(),
  });

export type UpdateContractTypeRequest = z.infer<
  typeof UpdateContractTypeSchema
>;
