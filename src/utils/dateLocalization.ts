// "use client";
import dayjs from "dayjs";

// Function to convert English day names to Vietnamese
export const getDayNameInVietnamese = (date: dayjs.Dayjs) => {
  const dayMap: Record<string, string> = {
    Monday: "Thứ hai",
    Tuesday: "Thứ ba",
    Wednesday: "Thứ tư",
    Thursday: "Thứ năm",
    Friday: "Thứ sáu",
    Saturday: "Thứ bảy",
    Sunday: "Chủ nhật",
  };

  // Get English day name
  const englishDay = date.format("dddd");
  // Return Vietnamese equivalent or the original if not found
  return dayMap[englishDay] || englishDay;
};

// Function to convert English month names to Vietnamese
export const getMonthNameInVietnamese = (month: number) => {
  const monthMap: Record<number, string> = {
    1: "Tháng 1",
    2: "Tháng 2",
    3: "Tháng 3",
    4: "Tháng 4",
    5: "Tháng 5",
    6: "Tháng 6",
    7: "Tháng 7",
    8: "Tháng 8",
    9: "Tháng 9",
    10: "Tháng 10",
    11: "Tháng 11",
    12: "Tháng 12",
  };

  return monthMap[month] || `Tháng ${month}`;
};

// Function to convert abbreviated English day names to Vietnamese
export const getShortDayNameInVietnamese = (date: dayjs.Dayjs) => {
  const shortDayMap: Record<string, string> = {
    Mon: "T2",
    Tue: "T3",
    Wed: "T4",
    Thu: "T5",
    Fri: "T6",
    Sat: "T7",
    Sun: "CN",
  };

  // Get abbreviated English day name
  const englishShortDay = date.format("ddd");
  // Return Vietnamese equivalent or the original if not found
  return shortDayMap[englishShortDay] || englishShortDay;
};
