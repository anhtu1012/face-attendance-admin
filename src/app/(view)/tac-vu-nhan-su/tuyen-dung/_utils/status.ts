const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "active";
    case "closed":
      return "closed";
    default:
      return "";
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "Đang tuyển";
    case "closed":
      return "Đã đóng";
    default:
      return status;
  }
};

export { getStatusClass, getStatusText };
