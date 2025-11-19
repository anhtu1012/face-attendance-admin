import { z } from "zod";

// Candidate (participant) schema
export const CandidateSchema = z.object({
  candidateId: z.string(),
  candidateName: z.string(),
  candidateEmail: z.string().email().optional(),
  candidatePhone: z.string().optional(),
});

// Interviewer Schema
export const InterviewerSchema = z.object({
  interviewerId: z.string().optional(),
  interviewerName: z.string(),
  interviewerEmail: z.string().email().optional(),
  interviewerPhone: z.string().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
});

// Recruiter nested in jobInfor
export const RecruiterSchema = z.object({
  fullName: z.string().optional(),
  recruiterPositionName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// Statistics nested in jobInfor
export const StatisticsSchema = z.object({
  applicants: z.string().optional(),
  shortlisted: z.string().optional(),
  properRatio: z.string().optional(),
});

// Position Info Schema for job offers
export const PositionInfoSchema = z.object({
  code: z.string().optional(),
  positionName: z.string().optional(),
  description: z.string().optional(),
});

// HR Info Schema for job offers
export const HRInfoSchema = z.object({
  recruiterPositionName: z.string().optional(),
  hrName: z.string().optional(),
  hrEmail: z.string().optional(),
  hrPhone: z.string().optional(),
  status: z.string().optional(),
});

// Job info nested object used in API responses
export const JobInfoSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string().optional(),
  jobOverview: z.string().optional(),
  jobResponsibility: z.string().optional(),
  jobCode: z.string().optional(),
  positionName: z.string().optional(),
  jobBenefit: z.string().optional(),
  address: z.string().optional(),
  requireExperience: z.string().optional(),
  listSkills: z.array(z.string()).optional(),
  expirationDate: z.string().optional(),
  round: z.union([z.string(), z.number()]).optional(),
  isActive: z.boolean().optional(),
  trialPeriod: z.string().optional(),
  fromSalary: z.string().optional(),
  toSalary: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  recruiter: RecruiterSchema.optional(),
  statistics: StatisticsSchema.optional(),
});

export const AppointmentListWithInterviewSchema = z.object({
  id: z.string(),
  appointmentId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  // Interview
  interviewDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  typeAppointment: z.enum(["Online", "Offline", "online"]).optional(),
  interviewType: z.enum(["Online", "Offline", "online"]).optional(),
  interviewerCount: z.union([z.string(), z.number()]).optional(),
  meetingLink: z.string().nullable().optional(),
  address: z.string().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED", "ACTIVE"]),
  notes: z.string().nullable().optional(),
  listParticipants: z.array(CandidateSchema).optional(),
  listInterviewers: z.array(InterviewerSchema).optional(),
  jobInfor: JobInfoSchema.optional(),
  candidateId: z.string().optional(),
  candidateName: z.string().optional(),
  candidateEmail: z.string().email().optional(),
  candidatePhone: z.string().optional(),
  result: z.string().optional(),
  // Job offer
  receiveJobId: z.string().optional(),
  date: z.string().optional(),
  note: z.string().optional(),
  positionInfor: PositionInfoSchema.optional(),
  hrInfor: HRInfoSchema.optional(),
});

export type Candidate = z.infer<typeof CandidateSchema>;
export type Interviewer = z.infer<typeof InterviewerSchema>;
export type Recruiter = z.infer<typeof RecruiterSchema>;
export type Statistics = z.infer<typeof StatisticsSchema>;
export type PositionInfo = z.infer<typeof PositionInfoSchema>;
export type HRInfo = z.infer<typeof HRInfoSchema>;
export type JobInfo = z.infer<typeof JobInfoSchema>;
export type AppointmentListWithInterview = z.infer<
  typeof AppointmentListWithInterviewSchema
>;
