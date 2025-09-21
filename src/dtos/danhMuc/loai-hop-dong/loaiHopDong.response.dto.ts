import { z } from "zod";
import { ContractTypeSchema } from "./loaiHopDong.dto";

export const ContractTypeResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(ContractTypeSchema),
});

export type ContractTypeResponseGetItem = z.infer<
  typeof ContractTypeResponseGetSchema
>;
