import { z } from "zod";
import { PhanQuyenItemSchema } from "./phan-quyen.dto";

export const PhanQuyenResponseGetSchema = z.array(PhanQuyenItemSchema);

export type PhanQuyenResponseGetItem = z.infer<
  typeof PhanQuyenResponseGetSchema
>;
