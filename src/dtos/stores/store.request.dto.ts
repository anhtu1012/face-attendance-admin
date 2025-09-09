import { z } from "zod";
import { StoresSchema } from "./store.dto";

export const StoresRequestCreateSchema = StoresSchema.omit({
  id: true,
})
  .partial()
  .extend({
    price: z.number().max(25).optional(),
  });

export type StoresRequestCreateItem = z.infer<typeof StoresRequestCreateSchema>;
