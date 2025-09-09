import { z } from "zod";
import { UserContractItemSchema } from "./contract.dto";

export type UserContractResponseGetItem = z.infer<
  typeof UserContractItemSchema
>;
