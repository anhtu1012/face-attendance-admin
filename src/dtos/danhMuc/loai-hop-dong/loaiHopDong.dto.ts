import { z } from "zod";

export const ContractTypeSchema = z.object({
  id: z.string().or(z.bigint()).optional(),
  unitKey: z.string().optional(),
  contractTypeName: z.string(),
  note: z.string(),
  status: z.boolean(),
});

export type ContractType = z.infer<typeof ContractTypeSchema>;
