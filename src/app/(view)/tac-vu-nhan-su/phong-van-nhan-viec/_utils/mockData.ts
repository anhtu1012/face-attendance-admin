import { AppointmentItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";
import { JobOfferItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.dto";
import dayjs from "dayjs";

// Mock Interview Data
export const mockInterviewData: AppointmentItem[] = [];
// Mock Job Offer Data
export const mockJobOfferData: JobOfferItem[] = [
  {
    id: "jo-001",
    candidateId: "cand-011",
    candidateName: "Trương Văn Phong",
    candidateEmail: "truongvanphong@email.com",
    candidatePhone: "0978901234",
    offerDate: dayjs().add(7, "day").toISOString(),
    startTime: "08:00",
    endTime: "09:00",
    address: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    username: "truongvanphong",
    password: "Temp@123456",
    appDownloadLink: "https://play.google.com/store/apps/details?id=com.faceai",
    guidePersonName: "Nguyễn Thị Quỳnh",
    guidePersonPhone: "0989012345",
    guidePersonEmail: "nguyenthiquynh@company.com",
    status: "PENDING",
    notes: "Nhân viên mới vị trí Frontend Developer",
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
  },
  {
    id: "jo-002",
    candidateId: "cand-012",
    candidateName: "Lý Thị Hương",
    candidateEmail: "lythihuong@email.com",
    candidatePhone: "0990123456",
    offerDate: dayjs().add(10, "day").toISOString(),
    startTime: "08:30",
    endTime: "09:30",
    address: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    username: "lythihuong",
    password: "Temp@789012",
    appDownloadLink: "https://play.google.com/store/apps/details?id=com.faceai",
    guidePersonName: "Trần Văn Sơn",
    guidePersonPhone: "0901234567",
    guidePersonEmail: "tranvanson@company.com",
    status: "ACCEPTED",
    notes: "Nhân viên mới vị trí Backend Developer",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    updatedAt: dayjs().toISOString(),
  },
  {
    id: "jo-003",
    candidateId: "cand-013",
    candidateName: "Đinh Văn Tú",
    candidateEmail: "dinhvantu@email.com",
    candidatePhone: "0912345670",
    offerDate: dayjs().add(3, "day").toISOString(),
    startTime: "09:00",
    endTime: "10:00",
    address: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    username: "dinhvantu",
    password: "Temp@345678",
    appDownloadLink: "https://play.google.com/store/apps/details?id=com.faceai",
    guidePersonName: "Phạm Thị Uyên",
    guidePersonPhone: "0923456781",
    guidePersonEmail: "phamthiuyen@company.com",
    status: "REJECTED",
    notes: "Ứng viên từ chối do lý do cá nhân",
    createdAt: dayjs().subtract(2, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "jo-004",
    candidateId: "cand-014",
    candidateName: "Võ Thị Vân",
    candidateEmail: "vothivan@email.com",
    candidatePhone: "0934567892",
    offerDate: dayjs().subtract(5, "day").toISOString(),
    startTime: "08:00",
    endTime: "09:00",
    address: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    username: "vothivan",
    password: "Temp@901234",
    appDownloadLink: "https://play.google.com/store/apps/details?id=com.faceai",
    guidePersonName: "Lê Văn Xuân",
    guidePersonPhone: "0945678903",
    guidePersonEmail: "levanxuan@company.com",
    status: "COMPLETED",
    notes: "Nhân viên đã hoàn thành onboarding",
    createdAt: dayjs().subtract(10, "day").toISOString(),
    updatedAt: dayjs().subtract(5, "day").toISOString(),
  },
  {
    id: "jo-005",
    candidateId: "cand-015",
    candidateName: "Mai Văn Yến",
    candidateEmail: "maivanyen@email.com",
    candidatePhone: "0956789014",
    offerDate: dayjs().add(14, "day").toISOString(),
    startTime: "08:30",
    endTime: "09:30",
    address: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    username: "maivanyen",
    password: "Temp@567890",
    appDownloadLink: "https://play.google.com/store/apps/details?id=com.faceai",
    guidePersonName: "Nguyễn Văn Anh",
    guidePersonPhone: "0967890125",
    guidePersonEmail: "nguyenvananh@company.com",
    status: "PENDING",
    notes: "Nhân viên mới vị trí QA Tester",
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
  },
  {
    id: "jo-006",
    candidateId: "cand-016",
    candidateName: "Phan Thị Hồng",
    candidateEmail: "phanthihong@email.com",
    candidatePhone: "0978901236",
    offerDate: dayjs().add(12, "day").toISOString(),
    startTime: "09:00",
    endTime: "10:00",
    address: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    username: "phanthihong",
    password: "Temp@123890",
    appDownloadLink: "https://play.google.com/store/apps/details?id=com.faceai",
    guidePersonName: "Trần Thị Bích",
    guidePersonPhone: "0989012347",
    guidePersonEmail: "tranthibich@company.com",
    status: "ACCEPTED",
    notes: "Nhân viên mới vị trí Product Manager",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    updatedAt: dayjs().toISOString(),
  },
];

// Export schedule templates derived from mockInterviewData
export const mockScheduleTemplates = mockInterviewData.map((item) => {
  const baseDate = dayjs(item.interviewDate);
  const [sh, sm] = item.startTime.split(":").map((s) => Number(s));
  const [eh, em] = item.endTime.split(":").map((s) => Number(s));

  const startTime = baseDate.hour(sh).minute(sm).second(0);
  const endTime = baseDate.hour(eh).minute(em).second(0);

  return {
    id: `tpl-${item.id}`,
    label: `${baseDate.format("DD/MM/YYYY")} ${item.startTime}-${
      item.endTime
    } - ${item.interviewer}`,
    date: startTime,
    startTime,
    endTime,
    interviewType: item.interviewType,
    meetingLink: item.meetingLink,
  };
});

// Helper function to filter job offer data
export const filterJobOfferData = (
  data: JobOfferItem[],
  filters: {
    fromDate?: string;
    toDate?: string;
    status?: string | string[];
    quickSearch?: string;
  }
): JobOfferItem[] => {
  let filtered = [...data];

  // Filter by date range
  if (filters.fromDate) {
    filtered = filtered.filter(
      (item) =>
        dayjs(item.offerDate).isAfter(dayjs(filters.fromDate)) ||
        dayjs(item.offerDate).isSame(dayjs(filters.fromDate), "day")
    );
  }

  if (filters.toDate) {
    filtered = filtered.filter(
      (item) =>
        dayjs(item.offerDate).isBefore(dayjs(filters.toDate)) ||
        dayjs(item.offerDate).isSame(dayjs(filters.toDate), "day")
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

  // Filter by quick search
  if (filters.quickSearch) {
    const searchLower = filters.quickSearch.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.candidateName.toLowerCase().includes(searchLower) ||
        item.candidateEmail.toLowerCase().includes(searchLower) ||
        item.candidatePhone.includes(searchLower) ||
        item.guidePersonName.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};
