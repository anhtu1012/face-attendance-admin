import { z } from "zod";

// Interviewer Schema
export const InterviewerSchema = z.object({
  interviewerName: z.string(),
  interviewerEmail: z.string().email(),
  interviewerPhone: z.string(),
});

// Appointment Schema
export const AppointmentItemSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  jobTitle: z.string(),
  department: z.string(),
  jobLevel: z.string(),
  jobDescription: z.string(),
  jobResponsibility: z.string(),
  jobBenefit: z.string(),
  requireExperience: z.string(),
  fromSalary: z.string(),
  toSalary: z.string(),
  requireSkill: z.array(z.string()),
  interviewDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  interviewType: z.enum(["online", "offline"]),
  meetingLink: z.string().optional(),
  location: z.string().optional(),
  interviewer: z.array(InterviewerSchema),
  status: z.enum([
    "PENDING", // Chờ xác nhận
    "ACCEPTED", // Chấp nhận
    "REJECTED", // Từ chối
    "COMPLETED", // Hoàn thành
    "CANCELLED", // Hủy bỏ
  ]),
  notes: z.string().optional(),
  // Legacy fields for backward compatibility
  candidateId: z.string().optional(),
  candidateName: z.string().optional(),
  candidateEmail: z.string().email().optional(),
  candidatePhone: z.string().optional(),
  result: z.string().optional(), // Kết quả phỏng vấn
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Interviewer = z.infer<typeof InterviewerSchema>;
export type AppointmentItem = z.infer<typeof AppointmentItemSchema>;

// For request
export interface CreateAppointmentRequest {
  address: string;
  date: string; // ISO date string
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  jobId: string;
  listIntervieweeId: string[];
  interviewerId: string[];
  typeAppointment: "online" | "offline";
  linkMeet?: string;
  interviewerCount: number;
  note?: string;
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
