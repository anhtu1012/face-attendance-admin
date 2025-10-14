import { z } from "zod";
import { AppointmentItemSchema } from "./interview.dto";

export const AppointmentResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(AppointmentItemSchema),
});

export type AppointmentResponseGetItem = z.infer<
  typeof AppointmentResponseGetSchema
>;
