import { ApplicationItem } from "../_types/prop";

export const mockApplications: ApplicationItem[] = [
  {
    id: "1",
    createdAt: "2024-11-01T08:00:00.000Z",
    updatedAt: "2024-11-01T08:00:00.000Z",
    reason: "Xin nghỉ phép để về quê thăm gia đình",
    response: "",
    formCategoryId: "1",
    formCategoryTitle: "Đơn xin nghỉ phép",
    submittedBy: "1",
    submittedName: "Nguyễn Văn A",
    approvedBy: "",
    approvedName: "",
    startTime: "2024-11-15T00:00:00.000Z",
    endTime: "2024-11-17T00:00:00.000Z",
    approvedTime: "",
    files: [
      "https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Đơn+xin+nghỉ+phép",
      "https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Giấy+xác+nhận",
    ],
    status: "PENDING",
  },
  {
    id: "2",
    createdAt: "2024-11-02T09:30:00.000Z",
    updatedAt: "2024-11-02T14:20:00.000Z",
    reason: "Xin tăng ca để hoàn thành dự án trước deadline",
    response: "Đã duyệt. Vui lòng báo cáo kết quả công việc sau khi tăng ca",
    formCategoryId: "2",
    formCategoryTitle: "Đơn xin tăng ca",
    submittedBy: "2",
    submittedName: "Trần Thị B",
    approvedBy: "10",
    approvedName: "Nguyễn Văn B",
    startTime: "2024-11-05T18:00:00.000Z",
    endTime: "2024-11-05T22:00:00.000Z",
    approvedTime: "2024-11-02T14:20:00.000Z",
    files: [
      "https://via.placeholder.com/600x400/95E1D3/FFFFFF?text=Đơn+xin+tăng+ca",
    ],
    status: "APPROVED",
  },
  {
    id: "3",
    createdAt: "2024-11-03T10:15:00.000Z",
    updatedAt: "2024-11-03T16:45:00.000Z",
    reason: "Xin nghỉ việc vì có cơ hội phát triển mới",
    response: "Từ chối. Vui lòng hoàn thành dự án hiện tại trước khi nghỉ việc",
    formCategoryId: "3",
    formCategoryTitle: "Đơn xin nghỉ việc",
    submittedBy: "3",
    submittedName: "Lê Văn C",
    approvedBy: "10",
    approvedName: "Nguyễn Văn B",
    startTime: "2024-12-01T00:00:00.000Z",
    endTime: "2024-12-01T00:00:00.000Z",
    approvedTime: "2024-11-03T16:45:00.000Z",
    files: [
      "https://via.placeholder.com/600x400/F38181/FFFFFF?text=Đơn+xin+nghỉ+việc",
      "https://via.placeholder.com/600x400/AA96DA/FFFFFF?text=Cam+kết+bàn+giao",
    ],
    status: "REJECTED",
  },
  {
    id: "4",
    createdAt: "2024-11-04T11:20:00.000Z",
    updatedAt: "2024-11-04T11:20:00.000Z",
    reason: "Xin ứng lương để chi trả học phí cho con",
    response: "",
    formCategoryId: "4",
    formCategoryTitle: "Đơn xin ứng lương",
    submittedBy: "4",
    submittedName: "Phạm Thị D",
    approvedBy: "",
    approvedName: "",
    startTime: "2024-11-10T00:00:00.000Z",
    endTime: "2024-11-10T00:00:00.000Z",
    approvedTime: "",
    files: [
      "https://via.placeholder.com/600x400/FCBAD3/FFFFFF?text=Đơn+ứng+lương",
      "https://via.placeholder.com/600x400/FFFFD2/333333?text=Giấy+báo+học+phí",
    ],
    status: "PENDING",
  },
  {
    id: "5",
    createdAt: "2024-11-05T13:45:00.000Z",
    updatedAt: "2024-11-05T15:30:00.000Z",
    reason: "Xin chuyển sang phòng Marketing để phát huy thế mạnh",
    response: "Đã duyệt. Hiệu lực từ ngày 01/12/2024",
    formCategoryId: "5",
    formCategoryTitle: "Đơn xin chuyển phòng ban",
    submittedBy: "5",
    submittedName: "Hoàng Văn E",
    approvedBy: "10",
    approvedName: "Nguyễn Văn B",
    startTime: "2024-12-01T00:00:00.000Z",
    endTime: "2024-12-01T00:00:00.000Z",
    approvedTime: "2024-11-05T15:30:00.000Z",
    files: [
      "https://via.placeholder.com/600x400/A8D8EA/FFFFFF?text=Đơn+chuyển+phòng",
    ],
    status: "APPROVED",
  },
  {
    id: "6",
    createdAt: "2024-10-28T14:00:00.000Z",
    updatedAt: "2024-10-28T14:00:00.000Z",
    reason: "Xin đi công tác tại chi nhánh Hà Nội",
    response: "",
    formCategoryId: "6",
    formCategoryTitle: "Đơn xin công tác",
    submittedBy: "1",
    submittedName: "Nguyễn Văn A",
    approvedBy: "",
    approvedName: "",
    startTime: "2024-11-20T00:00:00.000Z",
    endTime: "2024-11-25T00:00:00.000Z",
    approvedTime: "",
    files: [
      "https://via.placeholder.com/600x400/FFEAA7/333333?text=Đơn+xin+công+tác",
      "https://via.placeholder.com/600x400/DFE6E9/333333?text=Kế+hoạch+công+tác",
    ],
    status: "PENDING",
  },
  {
    id: "7",
    createdAt: "2024-10-25T09:00:00.000Z",
    updatedAt: "2024-10-25T17:30:00.000Z",
    reason: "Xin nghỉ phép do ốm",
    response: "Đã duyệt. Chúc bạn mau khỏe",
    formCategoryId: "1",
    formCategoryTitle: "Đơn xin nghỉ phép",
    submittedBy: "2",
    submittedName: "Trần Thị B",
    approvedBy: "10",
    approvedName: "Nguyễn Văn B",
    startTime: "2024-10-26T00:00:00.000Z",
    endTime: "2024-10-27T00:00:00.000Z",
    approvedTime: "2024-10-25T17:30:00.000Z",
    files: [
      "https://via.placeholder.com/600x400/74B9FF/FFFFFF?text=Đơn+xin+nghỉ+ốm",
      "https://via.placeholder.com/600x400/A29BFE/FFFFFF?text=Giấy+khám+bệnh",
    ],
    status: "APPROVED",
  },
  {
    id: "8",
    createdAt: "2024-10-20T10:30:00.000Z",
    updatedAt: "2024-10-20T10:30:00.000Z",
    reason: "Xin tăng ca cuối tuần để xử lý sự cố hệ thống",
    response: "",
    formCategoryId: "2",
    formCategoryTitle: "Đơn xin tăng ca",
    submittedBy: "3",
    submittedName: "Lê Văn C",
    approvedBy: "",
    approvedName: "",
    startTime: "2024-10-26T08:00:00.000Z",
    endTime: "2024-10-26T18:00:00.000Z",
    approvedTime: "",
    files: [
      "https://via.placeholder.com/600x400/FD79A8/FFFFFF?text=Đơn+tăng+ca",
    ],
    status: "PENDING",
  },
  {
    id: "9",
    createdAt: "2024-10-18T15:20:00.000Z",
    updatedAt: "2024-10-18T16:00:00.000Z",
    reason: "Xin ứng lương để sửa chữa nhà cửa",
    response: "Đã duyệt. Số tiền sẽ được trừ dần trong 3 tháng tới",
    formCategoryId: "4",
    formCategoryTitle: "Đơn xin ứng lương",
    submittedBy: "4",
    submittedName: "Phạm Thị D",
    approvedBy: "10",
    approvedName: "Nguyễn Văn B",
    startTime: "2024-10-20T00:00:00.000Z",
    endTime: "2024-10-20T00:00:00.000Z",
    approvedTime: "2024-10-18T16:00:00.000Z",
    files: [
      "https://via.placeholder.com/600x400/55EFC4/FFFFFF?text=Đơn+ứng+lương",
    ],
    status: "APPROVED",
  },
  {
    id: "10",
    createdAt: "2024-10-15T08:45:00.000Z",
    updatedAt: "2024-10-15T08:45:00.000Z",
    reason: "Xin nghỉ phép để tham dự đám cưới người thân",
    response: "",
    formCategoryId: "1",
    formCategoryTitle: "Đơn xin nghỉ phép",
    submittedBy: "5",
    submittedName: "Hoàng Văn E",
    approvedBy: "",
    approvedName: "",
    startTime: "2024-11-10T00:00:00.000Z",
    endTime: "2024-11-11T00:00:00.000Z",
    approvedTime: "",
    files: [
      "https://via.placeholder.com/600x400/81ECEC/FFFFFF?text=Đơn+xin+nghỉ+phép",
      "https://via.placeholder.com/600x400/FAB1A0/FFFFFF?text=Thiệp+mời",
    ],
    status: "PENDING",
  },
];

// Filter function to simulate backend filtering
export const filterApplications = (
  applications: ApplicationItem[],
  filters: {
    dateRange?: [string, string];
    status?: string;
    formCategory?: string;
    submittedName?: string;
    quicksearch?: string;
  }
): ApplicationItem[] => {
  let filtered = [...applications];

  // Filter by date range
  if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
    const [startDate, endDate] = filters.dateRange;
    filtered = filtered.filter((app) => {
      const createdDate = new Date(app.createdAt);
      return (
        createdDate >= new Date(startDate) && createdDate <= new Date(endDate)
      );
    });
  }

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((app) => app.status === filters.status);
  }

  // Filter by form category
  if (filters.formCategory) {
    filtered = filtered.filter(
      (app) => app.formCategoryId === filters.formCategory
    );
  }

  // Filter by submitted name
  if (filters.submittedName) {
    filtered = filtered.filter(
      (app) => app.submittedName === filters.submittedName
    );
  }

  // Quick search
  if (filters.quicksearch) {
    const searchTerm = filters.quicksearch.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.submittedName.toLowerCase().includes(searchTerm) ||
        app.formCategoryTitle.toLowerCase().includes(searchTerm) ||
        app.reason.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
};
