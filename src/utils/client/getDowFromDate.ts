import dayjs from "dayjs";

// Helper: convert ISO date -> VN short weekday (T2..T7, CN) using dayjs
export const getDowFromDate = (isoDate?: string | null) => {
  try {
    const d = isoDate ? dayjs(isoDate) : dayjs();
    const day = d.day(); // 0 (Sun) - 6 (Sat)
    const map: Record<number, string> = {
      0: "CN",
      1: "T2",
      2: "T3",
      3: "T4",
      4: "T5",
      5: "T6",
      6: "T7",
    };
    return map[day] || "";
  } catch {
    return "";
  }
};
