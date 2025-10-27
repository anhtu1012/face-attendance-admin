import { z } from "zod";
import { MauHopDongSchema } from "./mau-hop-dong.dto";

export const MauHopDongResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(MauHopDongSchema),
});

export type MauHopDongResponseGetItem = z.infer<
  typeof MauHopDongResponseGetSchema
>;
