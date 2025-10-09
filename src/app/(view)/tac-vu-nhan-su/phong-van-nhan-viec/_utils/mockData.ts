import { AppointmentItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";
import { JobOfferItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.dto";
import dayjs from "dayjs";

// Mock Interview Data
export const mockInterviewData: AppointmentItem[] = [
  {
    id: "iv-001",
    candidateId: "cand-001",
    candidateName: "Nguyễn Văn An",
    candidateEmail: "nguyenvanan@email.com",
    candidatePhone: "0901234567",
    jobId: "job-001", // Reference to job from tuyen-dung module
    jobTitle: "Senior Frontend Developer",
    department: "Phòng Phát triển Sản phẩm",
    jobLevel: "Senior",
    interviewDate: dayjs().add(2, "day").toISOString(),
    startTime: "09:00",
    endTime: "10:00",
    interviewType: "offline",
    location: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    interviewer: "Trần Thị Bình",
    interviewerEmail: "tranthibinh@company.com",
    interviewerPhone: "0987654321",
    status: "PENDING",
    notes:
      "Ứng viên có kinh nghiệm 3 năm về React, NextJS. Đã làm nhiều dự án lớn cho các công ty outsourcing. Skills: React, TypeScript, Redux, NextJS",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "iv-002",
    candidateId: "cand-002",
    candidateName: "Lê Thị Cúc",
    candidateEmail: "lethicuc@email.com",
    candidatePhone: "0912345678",
    jobTitle: "Backend Developer (Node.js)",
    department: "Phòng Công nghệ",
    jobLevel: "Middle",
    interviewDate: dayjs().add(3, "day").toISOString(),
    startTime: "14:00",
    endTime: "15:30",
    interviewType: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewer: "Phạm Văn Đức",
    interviewerEmail: "phamvanduc@company.com",
    interviewerPhone: "0976543210",
    status: "ACCEPTED",
    notes:
      "Ứng viên chuyên về Backend Node.js, Express, NestJS. Có kinh nghiệm 4 năm, làm việc tại FPT Software. Đã pass vòng technical test với điểm 9/10",
    createdAt: dayjs().subtract(2, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "iv-003",
    candidateId: "cand-003",
    candidateName: "Hoàng Minh Đức",
    candidateEmail: "hoangminhduc@email.com",
    candidatePhone: "0923456789",
    jobTitle: "Senior DevOps Engineer",
    department: "Phòng Vận hành Hệ thống",
    jobLevel: "Senior",
    interviewDate: dayjs().subtract(1, "day").toISOString(),
    startTime: "10:00",
    endTime: "11:30",
    interviewType: "offline",
    location: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    interviewer: "Nguyễn Văn Em",
    interviewerEmail: "nguyenvanem@company.com",
    interviewerPhone: "0965432109",
    status: "COMPLETED",
    notes:
      "Ứng viên có kinh nghiệm về DevOps, AWS, Docker, Kubernetes. 5 năm kinh nghiệm. Hiện đang làm tại Viettel Solutions",
    result:
      "Ứng viên đạt yêu cầu xuất sắc. Có kinh nghiệm tốt về CI/CD, Docker, Kubernetes và AWS. Giao tiếp tốt, tư duy logic, giải quyết vấn đề hiệu quả. Đề xuất offer: Senior DevOps Engineer",
    createdAt: dayjs().subtract(5, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "iv-004",
    candidateId: "cand-004",
    candidateName: "Vũ Thị Hoa",
    candidateEmail: "vuthihoa@email.com",
    candidatePhone: "0934567890",
    jobTitle: "UI/UX Designer",
    department: "Phòng Thiết kế",
    jobLevel: "Middle",
    interviewDate: dayjs().add(1, "day").toISOString(),
    startTime: "15:00",
    endTime: "16:00",
    interviewType: "online",
    meetingLink: "https://zoom.us/j/123456789",
    interviewer: "Lê Văn Giang",
    interviewerEmail: "levangiang@company.com",
    interviewerPhone: "0954321098",
    status: "REJECTED",
    notes:
      "Ứng viên từ chối do nhận được offer khác với mức lương cao hơn 30%. Cần tìm người phỏng vấn mới và lên lịch lại",
    createdAt: dayjs().subtract(3, "day").toISOString(),
    updatedAt: dayjs().toISOString(),
  },
  {
    id: "iv-005",
    candidateId: "cand-005",
    candidateName: "Đỗ Văn Khoa",
    candidateEmail: "dovankoa@email.com",
    candidatePhone: "0945678901",
    jobTitle: "Mobile Developer (Flutter)",
    department: "Phòng Phát triển Mobile",
    jobLevel: "Middle",
    interviewDate: dayjs().add(5, "day").toISOString(),
    startTime: "13:00",
    endTime: "14:30",
    interviewType: "offline",
    location: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    interviewer: "Trần Văn Hùng",
    interviewerEmail: "tranvanhung@company.com",
    interviewerPhone: "0943210987",
    status: "PENDING",
    notes:
      "Ứng viên chuyên về Mobile Development (Flutter, React Native). 3 năm kinh nghiệm. Đã phát triển nhiều app trên cả iOS và Android",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "iv-006",
    candidateId: "cand-006",
    candidateName: "Phạm Thị Lan",
    candidateEmail: "phamthilan@email.com",
    candidatePhone: "0956789012",
    jobTitle: "Senior UI/UX Designer",
    department: "Phòng Thiết kế Sản phẩm",
    jobLevel: "Senior",
    interviewDate: dayjs().add(4, "day").toISOString(),
    startTime: "09:30",
    endTime: "11:00",
    interviewType: "online",
    meetingLink: "https://meet.google.com/xyz-klmn-opq",
    interviewer: "Nguyễn Thị Mai",
    interviewerEmail: "nguyenthimai@company.com",
    interviewerPhone: "0932109876",
    status: "ACCEPTED",
    notes:
      "Ứng viên có kinh nghiệm về UI/UX Design, Figma, Adobe XD. 4 năm kinh nghiệm. Portfolio rất ấn tượng với nhiều dự án thực tế",
    createdAt: dayjs().subtract(2, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "iv-007",
    candidateId: "cand-007",
    candidateName: "Bùi Văn Nam",
    candidateEmail: "buivannam@email.com",
    candidatePhone: "0967890123",
    jobTitle: "QA/QC Engineer",
    department: "Phòng Kiểm thử",
    jobLevel: "Junior",
    interviewDate: dayjs().subtract(3, "day").toISOString(),
    startTime: "14:00",
    endTime: "15:00",
    interviewType: "offline",
    location: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    interviewer: "Lê Thị Oanh",
    interviewerEmail: "lethioanh@company.com",
    interviewerPhone: "0921098765",
    status: "CANCELLED",
    notes:
      "Ứng viên không đến phỏng vấn, không báo trước. Đã gọi điện 3 lần nhưng không liên lạc được",
    createdAt: dayjs().subtract(7, "day").toISOString(),
    updatedAt: dayjs().subtract(3, "day").toISOString(),
  },
  {
    id: "iv-008",
    candidateId: "cand-008",
    candidateName: "Trần Văn Bình",
    candidateEmail: "tranvanbinh@email.com",
    candidatePhone: "0978901234",
    jobTitle: "Full-stack Developer",
    department: "Phòng Phát triển Sản phẩm",
    jobLevel: "Middle",
    interviewDate: dayjs().add(6, "day").toISOString(),
    startTime: "10:00",
    endTime: "11:30",
    interviewType: "online",
    meetingLink: "https://meet.google.com/abc-xyz-123",
    interviewer: "Hoàng Thị Dung",
    interviewerEmail: "hoangthidung@company.com",
    interviewerPhone: "0910987654",
    status: "PENDING",
    notes:
      "Ứng viên Full-stack Developer, có kinh nghiệm cả FE và BE. Skills: React, Node.js, MongoDB, PostgreSQL. 3 năm kinh nghiệm",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "iv-009",
    candidateId: "cand-009",
    candidateName: "Ngô Thị Mai",
    candidateEmail: "ngothimai@email.com",
    candidatePhone: "0989012345",
    jobTitle: "Business Analyst",
    department: "Phòng Phân tích Kinh doanh",
    jobLevel: "Middle",
    interviewDate: dayjs().add(7, "day").toISOString(),
    startTime: "14:30",
    endTime: "16:00",
    interviewType: "offline",
    location: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    interviewer: "Đinh Văn Cường",
    interviewerEmail: "dinhvancuong@company.com",
    interviewerPhone: "0998765432",
    status: "REJECTED",
    notes:
      "Ứng viên từ chối vì khoảng cách quá xa, ưu tiên làm remote. Cần thương lượng lại điều kiện làm việc",
    createdAt: dayjs().subtract(2, "day").toISOString(),
    updatedAt: dayjs().toISOString(),
  },
  {
    id: "iv-010",
    candidateId: "cand-010",
    candidateName: "Lý Văn Hùng",
    candidateEmail: "lyvanhung@email.com",
    candidatePhone: "0990123456",
    jobTitle: "Data Analyst",
    department: "Phòng Phân tích Dữ liệu",
    jobLevel: "Senior",
    interviewDate: dayjs().subtract(2, "day").toISOString(),
    startTime: "09:00",
    endTime: "10:30",
    interviewType: "online",
    meetingLink: "https://zoom.us/j/987654321",
    interviewer: "Phạm Thị Hương",
    interviewerEmail: "phamthihuong@company.com",
    interviewerPhone: "0987654321",
    status: "COMPLETED",
    notes:
      "Ứng viên QA Engineer, chuyên về automation testing. 5 năm kinh nghiệm với Selenium, Cypress, Jest",
    result:
      "Ứng viên có kiến thức vững về testing, automation. Đã làm nhiều dự án testing cho các công ty lớn. Communication skills tốt. Đề xuất offer: Senior QA Engineer",
    createdAt: dayjs().subtract(6, "day").toISOString(),
    updatedAt: dayjs().subtract(2, "day").toISOString(),
  },
];

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

// Helper function to filter data
export const filterInterviewData = (
  data: AppointmentItem[],
  filters: {
    fromDate?: string;
    toDate?: string;
    status?: string | string[];
    quickSearch?: string;
  }
): AppointmentItem[] => {
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

  // Filter by quick search
  if (filters.quickSearch) {
    const searchLower = filters.quickSearch.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.candidateName.toLowerCase().includes(searchLower) ||
        item.candidateEmail.toLowerCase().includes(searchLower) ||
        item.candidatePhone.includes(searchLower) ||
        item.interviewer.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

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
