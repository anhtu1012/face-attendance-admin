import { z } from "zod";

// Appointment Schema
export const AppointmentItemSchema = z.object({
  id: z.string().optional(),
  candidateId: z.string(),
  candidateName: z.string(),
  candidateEmail: z.string().email(),
  candidatePhone: z.string(),
  // Job reference - link to Tuyển dụng module
  jobId: z.string().optional(), // Reference to JobItem.id from tuyen-dung
  // Job information (can be cached or fetched from jobId)
  jobTitle: z.string(), // Vị trí tuyển dụng
  department: z.string(), // Phòng ban
  jobLevel: z.string().optional(), // Cấp bậc: Junior, Senior, Manager, etc.
  // Appointment details
  interviewDate: z.string(), // ISO date string
  startTime: z.string(),
  endTime: z.string(),
  interviewType: z.enum(["online", "offline"]),
  meetingLink: z.string().optional(),
  location: z.string().optional(),
  interviewer: z.string(),
  interviewerEmail: z.string().email(),
  interviewerPhone: z.string().optional(),
  status: z.enum([
    "PENDING", // Chờ xác nhận
    "ACCEPTED", // Chấp nhận
    "REJECTED", // Từ chối
    "COMPLETED", // Hoàn thành
    "CANCELLED", // Hủy bỏ
  ]),
  notes: z.string().optional(),
  result: z.string().optional(), // Kết quả phỏng vấn
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type AppointmentItem = z.infer<typeof AppointmentItemSchema>;

// For request
export interface CreateAppointmentRequest {
  candidateId: string;
  interviewDate: string;
  startTime: string;
  endTime: string;
  interviewType: "online" | "offline";
  meetingLink?: string;
  location?: string;
  interviewer: string;
  interviewerEmail: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  id: string;
  interviewDate?: string;
  startTime?: string;
  endTime?: string;
  interviewType?: "online" | "offline";
  meetingLink?: string;
  location?: string;
  interviewer?: string;
  interviewerEmail?: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  result?: string;
}
