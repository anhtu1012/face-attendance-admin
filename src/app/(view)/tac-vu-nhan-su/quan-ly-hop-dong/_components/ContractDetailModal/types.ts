export interface AppendixData {
  id: string;
  contractNumber: string;
  contractTypeName: string;
  status: string;
  startDate: string;
  endDate: string;
  grossSalary: string;
  duration: string;
  createdAt: string;
  content: string;
  fileContract: string | null;
}

export const fakeAppendices: AppendixData[] = [
  {
    id: "appendix-1",
    contractNumber: "PL-001-2024",
    contractTypeName: "Phụ lục tăng lương",
    status: "ACTIVE",
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2025-06-01T00:00:00Z",
    grossSalary: "25000000",
    duration: "525600",
    createdAt: "2024-06-01T00:00:00Z",
    content: "Nội dung phụ lục tăng lương từ 20 triệu lên 25 triệu",
    fileContract: null,
  },
  {
    id: "appendix-2",
    contractNumber: "PL-002-2024",
    contractTypeName: "Phụ lục thay đổi chức vụ",
    status: "ACTIVE",
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2025-09-01T00:00:00Z",
    grossSalary: "30000000",
    duration: "525600",
    createdAt: "2024-09-01T00:00:00Z",
    content: "Thay đổi chức vụ từ Nhân viên lên Trưởng phòng",
    fileContract: "https://example.com/contract.pdf",
  },
];
