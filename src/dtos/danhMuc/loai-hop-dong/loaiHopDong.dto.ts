import { z } from "zod";

export const ContractTypeSchema = z.object({
  id: z.string().or(z.bigint()).optional(),
  unitKey: z.string().optional(),
  titleContractCode: z.string(),
  titleContractName: z.string(),
  note: z.string(),
  status: z.boolean(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export type ContractType = z.infer<typeof ContractTypeSchema>;
