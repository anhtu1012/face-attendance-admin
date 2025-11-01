import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";
import dayjs from "dayjs";

// Helper function to filter data
export const filterInterviewData = (
  data: AppointmentListWithInterview[],
  filters: {
    fromDate?: string;
    toDate?: string;
    status?: string | string[];
    quickSearch?: string;
  }
): AppointmentListWithInterview[] => {
  let filtered = [...data];

  // Filter by date range
  if (filters.fromDate) {
    filtered = filtered.filter(
      (item) =>
        dayjs(item.interviewDate).isAfter(dayjs(filters.fromDate)) ||
        dayjs(item.interviewDate).isSame(dayjs(filters.fromDate), "day")
    );
  }

  if (filters.toDate) {
    filtered = filtered.filter(
      (item) =>
        dayjs(item.interviewDate).isBefore(dayjs(filters.toDate)) ||
        dayjs(item.interviewDate).isSame(dayjs(filters.toDate), "day")
    );
  }

  // Filter by status (support single or multiple statuses)
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      const set = new Set(filters.status);
      filtered = filtered.filter((item) => set.has(item.status));
    } else {
      filtered = filtered.filter((item) => item.status === filters.status);
    }
  }

  return filtered;
};
