import dayjs from "dayjs";

// Múi giờ Việt Nam (UTC+7)
export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";
export const VIETNAM_TIMEZONE_OFFSET = 7; // UTC+7

// Chuyển đổi UTC thành giờ Việt Nam
export const utcToVietnamTime = (utcTimeString: string): Date => {
  if (!utcTimeString) return new Date();

  try {
    // Tạo date từ UTC string
    const utcDate = new Date(utcTimeString);

    // Chuyển đổi sang múi giờ Việt Nam
    const vietnamTime = new Date(
      utcDate.toLocaleString("en-US", {
        timeZone: VIETNAM_TIMEZONE,
      })
    );

    return vietnamTime;
  } catch (error) {
    console.error("Error converting UTC to Vietnam time:", error);
    return new Date();
  }
};

// Chuyển đổi giờ Việt Nam thành UTC
export const vietnamTimeToUtc = (vietnamTimeString: string): Date => {
  if (!vietnamTimeString) return new Date();

  try {
    const vietnamDate = new Date(vietnamTimeString);

    // Chuyển đổi sang UTC
    const utcTime = new Date(
      vietnamDate.getTime() - VIETNAM_TIMEZONE_OFFSET * 60 * 60 * 1000
    );

    return utcTime;
  } catch (error) {
    console.error("Error converting Vietnam time to UTC:", error);
    return new Date();
  }
};

// Helper function để parse thời gian mà giữ nguyên giá trị đã truyền vào
const parseTimeString = (timeString: string): Date => {
  try {
    // Parse thành các thành phần thời gian
    const dateMatch = timeString.match(/(\d{4})-(\d{2})-(\d{2})/);
    const timeMatch = timeString.match(/(\d{2}):(\d{2}):(\d{2})/);

    if (dateMatch && timeMatch) {
      const year = parseInt(dateMatch[1]);
      const month = parseInt(dateMatch[2]) - 1; // Month is 0-indexed
      const day = parseInt(dateMatch[3]);
      const hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);
      const second = parseInt(timeMatch[3]);

      // Tạo Date object với giá trị chính xác, không bị chuyển đổi múi giờ
      return new Date(year, month, day, hour, minute, second);
    }

    // Fallback: sử dụng cách cũ nếu không parse được
    return new Date(timeString);
  } catch (error) {
    console.error("Error parsing time string:", error);
    return new Date(timeString);
  }
};

// Format thời gian hiển thị (mặc định sử dụng thời gian truyền vào, nếu vn: true thì chuyển sang giờ VN)
export const formatDateTime = (
  timeString: string,
  vn: boolean = false
): string => {
  if (!timeString) return "";
  try {
    let dateToFormat: Date;

    if (vn) {
      // Chuyển đổi từ UTC sang giờ Việt Nam
      dateToFormat = utcToVietnamTime(timeString);
    } else {
      // Sử dụng helper function để parse thời gian chính xác
      dateToFormat = parseTimeString(timeString);
    }
    console.log("Formatted Date:", dateToFormat);

    return dateToFormat.toLocaleTimeString(vn ? "vi-VN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: vn ? VIETNAM_TIMEZONE : undefined,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};

// Format ngày tháng hiển thị (mặc định sử dụng thời gian truyền vào, nếu vn: true thì chuyển sang giờ VN)
export const formatDate = (dateString: string, vn: boolean = false): string => {
  if (!dateString) return "";
  console.log("Input Date String:", dateString, "VN Mode:", vn);

  try {
    let dateToFormat: Date;

    if (vn) {
      dateToFormat = utcToVietnamTime(dateString);
    } else {
      dateToFormat = parseTimeString(dateString);
    }

    return dateToFormat.toLocaleDateString(vn ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: vn ? VIETNAM_TIMEZONE : undefined,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

// Format ngày và giờ đầy đủ (mặc định sử dụng thời gian truyền vào, nếu vn: true thì chuyển sang giờ VN)
export const formatFullDateTime = (
  dateTimeString: string,
  vn: boolean = false
): string => {
  if (!dateTimeString) return "";

  try {
    let dateToFormat: Date;

    if (vn) {
      dateToFormat = utcToVietnamTime(dateTimeString);
    } else {
      dateToFormat = parseTimeString(dateTimeString);
    }

    return dateToFormat.toLocaleString(vn ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: vn ? VIETNAM_TIMEZONE : undefined,
    });
  } catch (error) {
    console.error("Error formatting full date time:", error);
    return "";
  }
};

// Lấy thời gian hiện tại ở múi giờ Việt Nam
export const getCurrentVietnamTime = (): Date => {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: VIETNAM_TIMEZONE,
    })
  );
};

// Lấy thời gian hiện tại UTC
export const getCurrentUtcTime = (): Date => {
  return new Date();
};

// Chuyển đổi Date thành UTC string
export const dateToUtcString = (date: Date): string => {
  return date.toISOString();
};

// Chuyển đổi Date thành Vietnam time string
export const dateToVietnamString = (date: Date): string => {
  return date.toLocaleString("vi-VN", {
    timeZone: VIETNAM_TIMEZONE,
  });
};

// forrmatDateTime
export const formatDateTimeMain = (date: string): string => {
  const dateTime = dayjs(date).format("HH:mm");
  return dateTime;
};
