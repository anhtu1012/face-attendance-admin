import { RoleAdmin } from "@/models/enum";

export const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case RoleAdmin.ADMIN:
      return {
        color: "#991b1b",
        background: "#fee2e2",
        borderColor: "#fecaca",
      };
    case RoleAdmin.HR:
      return {
        color: "#5b21b6",
        background: "#ede9fe",
        borderColor: "#ddd6fe",
      };
    case RoleAdmin.MANAGER:
      return {
        color: "#0369a1",
        background: "#e0f2fe",
        borderColor: "#bae6fd",
      };
    default:
      return {
        color: "#065f46",
        background: "#d1fae5",
        borderColor: "#a7f3d0",
      };
  }
};
