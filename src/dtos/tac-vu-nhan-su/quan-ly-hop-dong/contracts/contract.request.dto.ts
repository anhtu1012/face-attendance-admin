import { z } from "zod";
import { 
  CreateContractSchema, 
  UpdateContractSchema,
  CreateContractFormSchema,
  UpdateContractFormSchema
} from "./contract.dto";

export type CreateContractRequest = z.infer<typeof CreateContractSchema>;
export type UpdateContractRequest = z.infer<typeof UpdateContractSchema>;
export type CreateContractFormRequest = z.infer<typeof CreateContractFormSchema>;
export type UpdateContractFormRequest = z.infer<typeof UpdateContractFormSchema>;
