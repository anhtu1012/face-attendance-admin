import { z } from "zod";
import { AppointmentItemSchema } from "./interview.dto";
import { AppointmentListWithInterviewSchema } from "./appointment.dto";

export const AppointmentResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(AppointmentItemSchema),
});

export type AppointmentResponseGetItem = z.infer<
  typeof AppointmentResponseGetSchema
>;

export const AppointmentListWithInterviewResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(AppointmentListWithInterviewSchema),
});

export type AppointmentListWithInterviewGetItem = z.infer<
  typeof AppointmentListWithInterviewResponseGetSchema
>;
