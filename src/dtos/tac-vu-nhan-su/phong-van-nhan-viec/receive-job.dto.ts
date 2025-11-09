import { z } from "zod";
import { AnalysisResultSchema } from "../tuyen-dung/analysis-result.schema";
import { TuyenDungItemSchema } from "../tuyen-dung/tuyen-dung.dto";

export const CandidateWithAnalysisSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  birthday: z.string().optional(),
  fileCV: z.string().url().optional(),
  status: z.string().optional(),
  isExisted: z.boolean().optional(),
  reason: z.string().optional(),
  analysisResult: AnalysisResultSchema.optional(),
});

export const ReceiveJobSchema = z.object({
  id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  receiveJobId: z.string().optional(),
  date: z.string(),
  note: z.string().optional(),
  hrId: z.string().optional(),
  jobId: z.string().optional(),
  status: z.string().optional(),
  listCandidates: z.array(TuyenDungItemSchema).optional(),
});

export type CandidateWithAnalysis = z.infer<typeof CandidateWithAnalysisSchema>;
export type ReceiveJobItem = z.infer<typeof ReceiveJobSchema>;

// Request interfaces
export interface CreateReceiveJobRequest {
  date: string;
  note?: string;
  hrId?: string;
  jobId?: string;
  listCandidateIds?: string[]; // optional list of candidate ids
}

export interface ReceiveJobListResponse {
  data: ReceiveJobItem[];
  total?: number;
  page?: number;
  pageSize?: number;
}
