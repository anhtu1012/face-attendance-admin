import { Dayjs } from "dayjs";

export interface CandidateData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface InterviewScheduleModalProps {
  open: boolean;
  onClose: () => void;
  candidateData?: CandidateData | CandidateData[];
  jobId?: string;
  onSuccess?: () => void;
}

export interface InterviewFormData {
  date: Dayjs | null | string;
  startTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  typeAppointment: "online" | "offline";
  linkMeet?: string;
  interviewerId: string;
  interviewerEmail: string;
  notes?: string;
}

export interface CompanyLocation {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
}

export interface InterviewDetails {
  candidate: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  typeAppointment: "online" | "offline";
  location?: CompanyLocation;
  linkMeet?: string;
  interviewerId: string;
  interviewerEmail: string;
  notes: string;
  fullDateTime: string;
}
