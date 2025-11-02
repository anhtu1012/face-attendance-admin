import { z } from "zod";

// Job Offer Schema
export const JobOfferItemSchema = z.object({
  id: z.string().optional(),
  candidateId: z.string(),
  candidateName: z.string(),
  candidateEmail: z.string().email(),
  candidatePhone: z.string(),
  // Job reference - link to Tuyển dụng module
  jobId: z.string().optional(), // Reference to JobItem.id from tuyen-dung
  // Job information (can be cached or fetched from jobId)
  jobTitle: z.string().optional(), // Vị trí tuyển dụng
  department: z.string().optional(), // Phòng ban
  jobLevel: z.string().optional(), // Cấp bậc
  // Offer details
  offerDate: z.string(), // ISO date string
  startTime: z.string(),
  endTime: z.string(),
  address: z.string(),
  username: z.string(),
  password: z.string().optional(),
  appDownloadLink: z.string().optional(),
  guidePersonName: z.string(),
  guidePersonPhone: z.string(),
  guidePersonEmail: z.string().email(),
  status: z.enum([
    "PENDING", // Chờ xác nhận
    "ACCEPTED", // Chấp nhận
    "REJECTED", // Từ chối
    "COMPLETED", // Hoàn thành
    "CANCELLED", // Hủy bỏ
  ]),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type JobOfferItem = z.infer<typeof JobOfferItemSchema>;

// For request
export interface CreateJobOfferRequest {
  date: string;
  note?: string;
  hrId?: string;
  jobId?: string;
  userName?: string;
  managedById?: string;
  listParticipantId: string[];
}

export interface UpdateJobOfferRequest {
  id: string;
  offerDate?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  username?: string;
  password?: string;
  appDownloadLink?: string;
  guidePersonName?: string;
  guidePersonPhone?: string;
  guidePersonEmail?: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  notes?: string;
}
