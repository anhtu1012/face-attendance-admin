import { z } from "zod";
import { UserCreateContractItemSchema } from "./user-create-contract.dto";

export const UserCreateContractResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(UserCreateContractItemSchema),
});

export type UserCreateContractResponseGetItem = z.infer<
  typeof UserCreateContractResponseGetSchema
>;
