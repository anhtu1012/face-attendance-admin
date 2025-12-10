import dayjs from "dayjs";

export const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numValue);
};

export const formatDate = (dateString: string) => {
  return dayjs(dateString).format("DD/MM/YYYY");
};

export const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  return dayjs(dateString).format("DD/MM/YYYY HH:mm");
};

export const calculateDuration = (minutes: string | number) => {
  const mins = typeof minutes === "string" ? parseInt(minutes, 10) : minutes;

  if (isNaN(mins)) {
    return "N/A";
  }

  const daysPerMonth = 365.25 / 12;
  const totalDays = Math.floor(mins / (60 * 24));

  if (totalDays >= 1) {
    let months = Math.floor(totalDays / daysPerMonth);
    let days = Math.round(totalDays - months * daysPerMonth);

    const roundedDaysPerMonth = Math.round(daysPerMonth);
    if (days >= roundedDaysPerMonth) {
      months += 1;
      days = 0;
    }

    months = Math.max(0, months);
    days = Math.max(0, days);

    if (months > 0) {
      return `${months} tháng${days > 0 ? ` ${days} ngày` : ""}`;
    }
    return `${totalDays} ngày`;
  }

  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours} giờ${remainingMins > 0 ? ` ${remainingMins} phút` : ""}`;
  }

  return `${mins} phút`;
};

export const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    PENDING: "warning",
    USER_SIGNED: "processing",
    NOT_START: "processing",
    DIRECTOR_SIGNED: "blue",
    INACTIVE: "default",
    ACTIVE_EXTENDED: "success",
    EXPIRED: "error",
    ACTIVE: "success",
  };
  return colorMap[status] || "default";
};

export const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    PENDING: "Chờ xử lý",
    USER_SIGNED: "Nhân viên đang ký",
    DIRECTOR_SIGNED: "Giám đốc đang ký",
    INACTIVE: "Không hoạt động",
    EXPIRED: "Hết hạn",
    ACTIVE_EXTENDED: "Hoạt động+",
    ACTIVE: "Đang hoạt động",
    NOT_START: "Chưa bắt đầu",
  };
  return textMap[status] || status;
};
