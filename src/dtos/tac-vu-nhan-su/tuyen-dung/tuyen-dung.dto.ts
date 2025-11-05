import { z } from "zod";
import { AnalysisResultSchema } from "./analysis-result.schema";

// Tuyển dụng Schema
export const TuyenDungItemSchema = z.object({
  id: z.string().optional(),
  unitKey: z.string().optional(),
  fullName: z.string(),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  birthday: z.string(), // ISO date string
  skillIds: z.string().array().optional(), // Array of skill IDs
  fileCV: z.string().optional(), // URL to the CV file
  gender: z.enum(["M", "F", ""]),
  status: z.string(),
  isExisted: z.boolean().optional(),
  reason: z.string().optional(),
  analysisResult: AnalysisResultSchema.optional(),
  experience: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TuyenDungItem = z.infer<typeof TuyenDungItemSchema>;
