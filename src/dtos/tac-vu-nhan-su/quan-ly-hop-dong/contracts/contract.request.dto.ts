import { z } from "zod";
import {
  UpdateContractSchema,
  CreateContractFormSchema,
  UpdateContractFormSchema,
  CreateContractRequestSchema,
} from "./contract.dto";

export type CreateContractRequest = z.infer<typeof CreateContractRequestSchema>;
export type UpdateContractRequest = z.infer<typeof UpdateContractSchema>;
export type CreateContractFormRequest = z.infer<
  typeof CreateContractFormSchema
>;
export type UpdateContractFormRequest = z.infer<
  typeof UpdateContractFormSchema
>;
