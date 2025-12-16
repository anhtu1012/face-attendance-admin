// Convert duration stored in minutes to a readable years/months/days label
export const getDurationYMDLabel = (duration: string | number | undefined) => {
  if (duration == null || duration === "") return "N/A";
  const minutes = Number(duration);
  if (isNaN(minutes) || minutes <= 0) return "N/A";

  // Convert minutes -> total days (floor)
  let daysTotal = Math.floor(minutes / 60 / 24);

  const years = Math.floor(daysTotal / 365);
  daysTotal -= years * 365;

  const months = Math.floor(daysTotal / 30); // approximate month = 30 days
  daysTotal -= months * 30;

  const days = daysTotal;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} năm`);
  if (months > 0) parts.push(`${months} tháng`);
  if (days > 0) parts.push(`${days} ngày`);

  if (parts.length === 0) return "0 ngày";
  return parts.join(" ");
};
