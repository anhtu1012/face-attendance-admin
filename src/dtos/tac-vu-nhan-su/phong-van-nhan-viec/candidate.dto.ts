import { z } from "zod";

// Candidate Schema
export const CandidateSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  position: z.string(),
  department: z.string().optional(),
  experience: z.string().optional(), // e.g., "3 năm"
  skills: z.array(z.string()).optional(),
  education: z.string().optional(),
  status: z.enum([
    "APPLYING", // Đang ứng tuyển
    "INTERVIEWING", // Đang phỏng vấn
    "OFFERED", // Đã nhận offer
    "ONBOARDING", // Đang nhận việc
    "HIRED", // Đã tuyển
    "REJECTED", // Từ chối
  ]),
  appliedDate: z.string(),
  interviewDate: z.string().optional(),
  offerDate: z.string().optional(),
  startDate: z.string().optional(),
  resumeUrl: z.string().optional(),
  notes: z.string().optional(),
  avatar: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Candidate = z.infer<typeof CandidateSchema>;

// For request
export interface CreateCandidateRequest {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department?: string;
  experience?: string;
  skills?: string[];
  education?: string;
  resumeUrl?: string;
  notes?: string;
}

export interface UpdateCandidateRequest {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  experience?: string;
  skills?: string[];
  education?: string;
  status?: Candidate["status"];
  interviewDate?: string;
  offerDate?: string;
  startDate?: string;
  resumeUrl?: string;
  notes?: string;
}

// For response
export interface CandidateListResponse {
  data: Candidate[];
  total: number;
  page: number;
  pageSize: number;
}
