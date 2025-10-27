import { z } from "zod";

export const MauHopDongSchema = z.object({
  id: z.string().or(z.bigint()),
  contractTypeId: z.string().optional(),
  templateContract: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
});

export type MauHopDong = z.infer<typeof MauHopDongSchema>;
