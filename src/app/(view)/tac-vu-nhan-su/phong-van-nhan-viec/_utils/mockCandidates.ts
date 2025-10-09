import { Candidate } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/candidate.dto";
import dayjs from "dayjs";

// Mock Candidates Data
export const mockCandidatesData: Candidate[] = [
  {
    id: "cand-001",
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    position: "Frontend Developer",
    department: "Phòng Công nghệ",
    experience: "3 năm",
    skills: ["React", "TypeScript", "Next.js", "Redux", "TailwindCSS"],
    education: "Đại học Bách Khoa Hà Nội - Khoa CNTT",
    status: "INTERVIEWING",
    appliedDate: dayjs().subtract(5, "day").toISOString(),
    interviewDate: dayjs().add(2, "day").toISOString(),
    notes:
      "Ứng viên có kinh nghiệm tốt về React và NextJS. Đã làm việc tại FPT Software 2 năm.",
    avatar: "https://i.pravatar.cc/150?img=1",
    createdAt: dayjs().subtract(5, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "cand-002",
    fullName: "Lê Thị Cúc",
    email: "lethicuc@email.com",
    phone: "0912345678",
    position: "Backend Developer",
    department: "Phòng Công nghệ",
    experience: "4 năm",
    skills: ["Node.js", "Express", "NestJS", "MongoDB", "PostgreSQL", "Docker"],
    education: "Đại học Công nghệ - ĐHQGHN",
    status: "OFFERED",
    appliedDate: dayjs().subtract(10, "day").toISOString(),
    interviewDate: dayjs().subtract(3, "day").toISOString(),
    offerDate: dayjs().subtract(1, "day").toISOString(),
    notes:
      "Ứng viên xuất sắc, có kinh nghiệm về microservices và cloud. Đã pass vòng technical với điểm 9/10.",
    avatar: "https://i.pravatar.cc/150?img=5",
    createdAt: dayjs().subtract(10, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "cand-003",
    fullName: "Hoàng Minh Đức",
    email: "hoangminhduc@email.com",
    phone: "0923456789",
    position: "DevOps Engineer",
    department: "Phòng Công nghệ",
    experience: "5 năm",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "CI/CD"],
    education: "Đại học Bách Khoa TP.HCM",
    status: "HIRED",
    appliedDate: dayjs().subtract(20, "day").toISOString(),
    interviewDate: dayjs().subtract(15, "day").toISOString(),
    offerDate: dayjs().subtract(10, "day").toISOString(),
    startDate: dayjs().subtract(5, "day").toISOString(),
    notes:
      "Senior DevOps Engineer. Có kinh nghiệm triển khai hệ thống lớn trên AWS.",
    avatar: "https://i.pravatar.cc/150?img=12",
    createdAt: dayjs().subtract(20, "day").toISOString(),
    updatedAt: dayjs().subtract(5, "day").toISOString(),
  },
  {
    id: "cand-004",
    fullName: "Vũ Thị Hoa",
    email: "vuthihoa@email.com",
    phone: "0934567890",
    position: "UI/UX Designer",
    department: "Phòng Thiết kế",
    experience: "2 năm",
    skills: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator"],
    education: "Học viện Mỹ thuật Việt Nam",
    status: "REJECTED",
    appliedDate: dayjs().subtract(7, "day").toISOString(),
    interviewDate: dayjs().subtract(2, "day").toISOString(),
    notes: "Ứng viên từ chối do nhận được offer khác với mức lương cao hơn.",
    avatar: "https://i.pravatar.cc/150?img=9",
    createdAt: dayjs().subtract(7, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "cand-005",
    fullName: "Đỗ Văn Khoa",
    email: "dovankhoa@email.com",
    phone: "0945678901",
    position: "Mobile Developer",
    department: "Phòng Công nghệ",
    experience: "3 năm",
    skills: ["Flutter", "React Native", "iOS", "Android", "Firebase"],
    education: "Đại học FPT",
    status: "APPLYING",
    appliedDate: dayjs().subtract(2, "day").toISOString(),
    notes: "Ứng viên có kinh nghiệm phát triển app mobile cho nhiều lĩnh vực.",
    avatar: "https://i.pravatar.cc/150?img=15",
    createdAt: dayjs().subtract(2, "day").toISOString(),
    updatedAt: dayjs().subtract(2, "day").toISOString(),
  },
  {
    id: "cand-006",
    fullName: "Phạm Thị Lan",
    email: "phamthilan@email.com",
    phone: "0956789012",
    position: "Business Analyst",
    department: "Phòng Kinh doanh",
    experience: "4 năm",
    skills: [
      "SQL",
      "Power BI",
      "Excel",
      "Data Analysis",
      "Requirements Gathering",
    ],
    education: "Đại học Kinh tế Quốc dân",
    status: "INTERVIEWING",
    appliedDate: dayjs().subtract(6, "day").toISOString(),
    interviewDate: dayjs().add(1, "day").toISOString(),
    notes: "Ứng viên có kinh nghiệm phân tích nghiệp vụ cho các dự án lớn.",
    avatar: "https://i.pravatar.cc/150?img=20",
    createdAt: dayjs().subtract(6, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "cand-007",
    fullName: "Trần Văn Bình",
    email: "tranvanbinh@email.com",
    phone: "0967890123",
    position: "QA Engineer",
    department: "Phòng Công nghệ",
    experience: "3 năm",
    skills: [
      "Selenium",
      "Jest",
      "Cypress",
      "Manual Testing",
      "Automation Testing",
    ],
    education: "Đại học Sư phạm Kỹ thuật TP.HCM",
    status: "ONBOARDING",
    appliedDate: dayjs().subtract(15, "day").toISOString(),
    interviewDate: dayjs().subtract(10, "day").toISOString(),
    offerDate: dayjs().subtract(5, "day").toISOString(),
    startDate: dayjs().add(2, "day").toISOString(),
    notes: "Ứng viên có kinh nghiệm test automation và manual testing.",
    avatar: "https://i.pravatar.cc/150?img=8",
    createdAt: dayjs().subtract(15, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "cand-008",
    fullName: "Nguyễn Thị Mai",
    email: "nguyenthimai@email.com",
    phone: "0978901234",
    position: "Product Manager",
    department: "Phòng Sản phẩm",
    experience: "5 năm",
    skills: ["Product Management", "Agile", "Scrum", "JIRA", "User Research"],
    education: "Đại học Ngoại thương",
    status: "APPLYING",
    appliedDate: dayjs().subtract(1, "day").toISOString(),
    notes:
      "Ứng viên có kinh nghiệm quản lý sản phẩm cho các startup công nghệ.",
    avatar: "https://i.pravatar.cc/150?img=24",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "cand-009",
    fullName: "Lê Văn Tùng",
    email: "levantung@email.com",
    phone: "0989012345",
    position: "Data Engineer",
    department: "Phòng Công nghệ",
    experience: "4 năm",
    skills: ["Python", "Apache Spark", "Kafka", "Airflow", "BigQuery", "AWS"],
    education: "Đại học Bách Khoa Hà Nội",
    status: "INTERVIEWING",
    appliedDate: dayjs().subtract(8, "day").toISOString(),
    interviewDate: dayjs().add(3, "day").toISOString(),
    notes: "Ứng viên chuyên về xây dựng data pipeline và ETL.",
    avatar: "https://i.pravatar.cc/150?img=33",
    createdAt: dayjs().subtract(8, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "cand-010",
    fullName: "Hoàng Thị Thu",
    email: "hoangthithu@email.com",
    phone: "0990123456",
    position: "Fullstack Developer",
    department: "Phòng Công nghệ",
    experience: "3 năm",
    skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "GraphQL"],
    education: "Đại học Công nghệ TP.HCM",
    status: "OFFERED",
    appliedDate: dayjs().subtract(12, "day").toISOString(),
    interviewDate: dayjs().subtract(7, "day").toISOString(),
    offerDate: dayjs().subtract(2, "day").toISOString(),
    notes: "Ứng viên có khả năng làm việc cả frontend và backend.",
    avatar: "https://i.pravatar.cc/150?img=29",
    createdAt: dayjs().subtract(12, "day").toISOString(),
    updatedAt: dayjs().subtract(2, "day").toISOString(),
  },
];

// Filter function
export const filterCandidates = (
  candidates: Candidate[],
  filters: {
    status?: string;
    position?: string;
    department?: string;
    search?: string;
  }
): Candidate[] => {
  return candidates.filter((candidate) => {
    if (filters.status && candidate.status !== filters.status) return false;
    if (filters.position && candidate.position !== filters.position)
      return false;
    if (filters.department && candidate.department !== filters.department)
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        candidate.fullName.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower) ||
        candidate.phone.includes(searchLower)
      );
    }
    return true;
  });
};
