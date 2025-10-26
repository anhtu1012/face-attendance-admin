// Lunar Calendar Utilities for Vietnamese Holidays
// Tính toán Tết Âm lịch và các ngày lễ theo âm lịch

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

// Hàm chuyển đổi từ dương lịch sang âm lịch (simplified version)
// Note: Để tính chính xác, nên sử dụng thư viện như 'lunar-calendar' hoặc API
export function solarToLunar(
  solarDay: number,
  solarMonth: number,
  solarYear: number
): LunarDate {
  // Đây là implementation đơn giản
  // Trong thực tế nên dùng thư viện hoặc API để tính chính xác
  // Ví dụ: lunar-javascript, amlich-hnd, etc.

  // Placeholder - trả về giá trị tạm
  return {
    day: solarDay,
    month: solarMonth,
    year: solarYear,
    isLeapMonth: false,
  };
}

// Hàm tính ngày Tết Nguyên Đán (Tết Âm lịch)
export function getTetDate(year: number): Date {
  // Dữ liệu Tết từ 2020-2035
  const tetDates: Record<number, string> = {
    2020: "2020-01-25",
    2021: "2021-02-12",
    2022: "2022-02-01",
    2023: "2023-01-22",
    2024: "2024-02-10",
    2025: "2025-01-29",
    2026: "2026-02-17",
    2027: "2027-02-06",
    2028: "2028-01-26",
    2029: "2029-02-13",
    2030: "2030-02-03",
    2031: "2031-01-23",
    2032: "2032-02-11",
    2033: "2033-01-31",
    2034: "2034-02-19",
    2035: "2035-02-08",
  };

  const dateStr = tetDates[year];
  if (!dateStr) {
    throw new Error(`Tết date not available for year ${year}`);
  }

  return new Date(dateStr);
}

// Các ngày lễ âm lịch quan trọng
export interface LunarHoliday {
  name: string;
  lunarDay: number;
  lunarMonth: number;
  description: string;
}

export const VIETNAMESE_LUNAR_HOLIDAYS: LunarHoliday[] = [
  {
    name: "Tết Nguyên Đán",
    lunarDay: 1,
    lunarMonth: 1,
    description: "Tết Âm lịch - Năm mới Lunar",
  },
  {
    name: "Mùng 2 Tết",
    lunarDay: 2,
    lunarMonth: 1,
    description: "Ngày thứ 2 Tết Nguyên Đán",
  },
  {
    name: "Mùng 3 Tết",
    lunarDay: 3,
    lunarMonth: 1,
    description: "Ngày thứ 3 Tết Nguyên Đán",
  },
  {
    name: "Tết Hàn Thực",
    lunarDay: 3,
    lunarMonth: 3,
    description: "Tết Hàn Thực - Tảo mộ",
  },
  {
    name: "Giỗ Tổ Hùng Vương",
    lunarDay: 10,
    lunarMonth: 3,
    description: "Ngày Giỗ Tổ Hùng Vương",
  },
  {
    name: "Tết Đoan Ngọ",
    lunarDay: 5,
    lunarMonth: 5,
    description: "Tết Đoan Ngọ - Tết Trùng Ngũ",
  },
  {
    name: "Vu Lan",
    lunarDay: 15,
    lunarMonth: 7,
    description: "Lễ Vu Lan - Báo hiếu cha mẹ",
  },
  {
    name: "Tết Trung Thu",
    lunarDay: 15,
    lunarMonth: 8,
    description: "Tết Trung Thu - Tết Thiếu nhi",
  },
  {
    name: "Tết Thanh Minh",
    lunarDay: 3,
    lunarMonth: 3,
    description: "Tết Thanh Minh - Tảo mộ",
  },
];

// Hàm lấy các ngày lễ âm lịch cho một năm dương lịch
export function getVietnameseLunarHolidays(year: number): Array<{
  id: string;
  date: string;
  name: string;
  description: string;
  type: "lunar";
  isRecurring: boolean;
}> {
  const holidays: Array<{
    id: string;
    date: string;
    name: string;
    description: string;
    type: "lunar";
    isRecurring: boolean;
  }> = [];

  try {
    // Tết Nguyên Đán và các ngày Tết
    const tetDate = getTetDate(year);

    holidays.push({
      id: `lunar-tet-${year}`,
      date: tetDate.toISOString().split("T")[0],
      name: "Tết Nguyên Đán",
      description: "Tết Âm lịch - Năm mới Lunar",
      type: "lunar",
      isRecurring: true,
    });

    // Mùng 2 Tết
    const mung2Tet = new Date(tetDate);
    mung2Tet.setDate(mung2Tet.getDate() + 1);
    holidays.push({
      id: `lunar-tet-2-${year}`,
      date: mung2Tet.toISOString().split("T")[0],
      name: "Mùng 2 Tết",
      description: "Ngày thứ 2 Tết Nguyên Đán",
      type: "lunar",
      isRecurring: true,
    });

    // Mùng 3 Tết
    const mung3Tet = new Date(tetDate);
    mung3Tet.setDate(mung3Tet.getDate() + 2);
    holidays.push({
      id: `lunar-tet-3-${year}`,
      date: mung3Tet.toISOString().split("T")[0],
      name: "Mùng 3 Tết",
      description: "Ngày thứ 3 Tết Nguyên Đán",
      type: "lunar",
      isRecurring: true,
    });

    // Mùng 4 Tết (thường nghỉ thêm)
    const mung4Tet = new Date(tetDate);
    mung4Tet.setDate(mung4Tet.getDate() + 3);
    holidays.push({
      id: `lunar-tet-4-${year}`,
      date: mung4Tet.toISOString().split("T")[0],
      name: "Mùng 4 Tết",
      description: "Ngày thứ 4 Tết Nguyên Đán",
      type: "lunar",
      isRecurring: true,
    });

    // Mùng 5 Tết
    const mung5Tet = new Date(tetDate);
    mung5Tet.setDate(mung5Tet.getDate() + 4);
    holidays.push({
      id: `lunar-tet-5-${year}`,
      date: mung5Tet.toISOString().split("T")[0],
      name: "Mùng 5 Tết",
      description: "Ngày thứ 5 Tết Nguyên Đán",
      type: "lunar",
      isRecurring: true,
    });

    // Giỗ Tổ Hùng Vương (10/3 âm lịch)
    // Thường rơi vào khoảng tháng 4 dương lịch
    const hungVuongDates: Record<number, string> = {
      2020: "2020-04-02",
      2021: "2021-04-21",
      2022: "2022-04-10",
      2023: "2023-04-29",
      2024: "2024-04-18",
      2025: "2025-04-07",
      2026: "2026-04-26",
      2027: "2027-04-16",
      2028: "2028-04-04",
      2029: "2029-04-23",
      2030: "2030-04-13",
      2031: "2031-04-02",
      2032: "2032-04-21",
      2033: "2033-04-10",
      2034: "2034-04-29",
      2035: "2035-04-18",
    };

    const hungVuongDateStr = hungVuongDates[year];
    if (hungVuongDateStr) {
      holidays.push({
        id: `lunar-hungvuong-${year}`,
        date: hungVuongDateStr,
        name: "Giỗ Tổ Hùng Vương",
        description: "Ngày Giỗ Tổ Hùng Vương (10/3 Âm lịch)",
        type: "lunar",
        isRecurring: true,
      });
    }
  } catch (error) {
    console.error("Error calculating lunar holidays:", error);
  }

  return holidays;
}

// Format date để hiển thị
export function formatLunarDate(lunarDate: LunarDate): string {
  return `${lunarDate.day}/${lunarDate.month}/${lunarDate.year} (Âm lịch)`;
}

// Kiểm tra một ngày có phải ngày lễ âm lịch không
export function isLunarHoliday(date: Date, year: number): boolean {
  const lunarHolidays = getVietnameseLunarHolidays(year);
  const dateStr = date.toISOString().split("T")[0];

  return lunarHolidays.some((holiday) => holiday.date === dateStr);
}
