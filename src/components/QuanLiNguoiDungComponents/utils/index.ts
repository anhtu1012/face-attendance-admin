// Get status color for contract status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "EXPIRED":
      return "red";
    case "INACTIVE":
      return "orange";
    default:
      return "default";
  }
};

// Get status text in Vietnamese
export const getStatusText = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "Đang hiệu lực";
    case "EXPIRED":
      return "Hết hạn";
    case "INACTIVE":
      return "Chấm dứt";
    default:
      return status;
  }
};

// Get position name by code (utility function)
export const getPositionName = (
  positionCode: string,
  positions: { label: string; value: string }[] = []
): string => {
  const position = positions.find((pos) => pos.value === positionCode);
  return position ? position.label : positionCode || "Chưa xác định";
};
