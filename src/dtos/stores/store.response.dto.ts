import { z } from "zod";
import { StoresSchema } from "./store.dto";

export const StoreResponseCreateSchema = StoresSchema;
export type StoreResponseCreateItem = z.infer<typeof StoreResponseCreateSchema>;
