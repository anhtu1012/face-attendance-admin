import { z } from "zod";
import { UserContractItemSchema } from "./contract.dto";

export const QuanlyHopDongResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(UserContractItemSchema),
});

export type QuanlyHopDongResponseGetItem = z.infer<
  typeof QuanlyHopDongResponseGetSchema
>;
