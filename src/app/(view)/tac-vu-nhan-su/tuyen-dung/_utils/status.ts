import { JobStatus } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.dto";

const getStatusClass = (status: JobStatus) => {
  switch (status.toLowerCase()) {
    case "open":
      return "active";
    case "closed":
      return "closed";
    default:
      return "";
  }
};

const getStatusColor = (status: JobStatus) => {
  switch (status.toLowerCase()) {
    case "open":
      return "#52c41a";
    case "closed":
      return "#f5222d";
    default:
      return "#d9d9d9";
  }
};

const getStatusText = (status: JobStatus) => {
  switch (status.toLowerCase()) {
    case "open":
      return "Đang tuyển";
    case "closed":
      return "Đã đóng";
    default:
      return status;
  }
};

export { getStatusClass, getStatusText, getStatusColor };
