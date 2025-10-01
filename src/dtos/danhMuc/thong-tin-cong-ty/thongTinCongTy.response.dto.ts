import { z } from "zod";
import { CompanyInfoSchema } from "./thongTinCongTy.dto";

export const CompanyInfoResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(CompanyInfoSchema),
});

export type CompanyInfoResponseGetItem = z.infer<
  typeof CompanyInfoResponseGetSchema
>;

export const CompanyInfoSingleResponseSchema = z.object({
  data: CompanyInfoSchema,
});

export type CompanyInfoSingleResponse = z.infer<
  typeof CompanyInfoSingleResponseSchema
>;
