import { JobDetail } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-detail.dto";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";

/**
 * Fetch job information by jobCode
 * Used by Interview and Job Offer modules to get complete job details
 */
export async function fetchJobInfo(jobCode: string): Promise<JobDetail | null> {
  try {
    const response = await JobServices.getDetailJob(jobCode);
    return response || null;
  } catch (error) {
    console.error("Error fetching job info:", error);
    return null;
  }
}

/**
 * Extract job information from Interview or JobOffer item
 * Falls back to cached job data if available
 */
export function getJobInfo(item: {
  jobId?: string;
  jobTitle?: string;
  department?: string;
  jobLevel?: string;
}) {
  return {
    jobId: item.jobId,
    jobTitle: item.jobTitle || "Chưa cập nhật",
    department: item.department || "Chưa cập nhật",
    jobLevel: item.jobLevel || undefined,
  };
}
