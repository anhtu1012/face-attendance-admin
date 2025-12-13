/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import BaoCaoStaffServices from "@/services/bao-cao/bao-cao-nhan-vien.service";
import { showError } from "@/hooks/useNotification";

interface DepartmentStat {
  name: string;
  count: number;
  color: string;
}

interface PositionStat {
  name: string;
  count: number;
  color: string;
}

// Color palette for departments and positions
const DEPARTMENT_COLORS = [
  "linear-gradient(135deg, #003c97 0%, #0056d6 100%)",
  "linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)",
  "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
  "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
  "linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)",
  "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
  "linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)",
  "linear-gradient(135deg, #2f54eb 0%, #597ef7 100%)",
];

const POSITION_COLORS = [
  "linear-gradient(135deg, #003c97 0%, #0056d6 100%)",
  "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
  "linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)",
  "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
  "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
  "linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)",
  "linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)",
  "linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)",
];

export function useReportStaff() {
  const [totalStaffInDepartment, setTotalStaffInDepartment] = React.useState<
    DepartmentStat[]
  >([]);
  const [totalStaffInPosition, setTotalStaffInPosition] = React.useState<
    PositionStat[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  const fetchTotalStaff = React.useCallback(async () => {
    setLoading(true);
    try {
      // Fetch department stats
      const departmentResponse =
        await BaoCaoStaffServices.getTotalStaffInDepartReport();
      const departmentData = departmentResponse.data || [];
      const departmentWithColors = departmentData.map(
        (dept: { name: string; count: number }, index: number) => ({
          ...dept,
          color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length],
        })
      );
      setTotalStaffInDepartment(departmentWithColors);

      // Fetch position stats
      const positionResponse =
        await BaoCaoStaffServices.getTotalStaffInPosition();
      const positionData = positionResponse.data || [];
      const positionWithColors = positionData.map(
        (pos: { name: string; count: number }, index: number) => ({
          ...pos,
          color: POSITION_COLORS[index % POSITION_COLORS.length],
        })
      );
      setTotalStaffInPosition(positionWithColors);
    } catch (error: any) {
      showError(
        error?.response?.data?.message || "Lỗi khi tải thống kê nhân viên"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTotalStaff();
  }, [fetchTotalStaff]);

  return {
    totalStaffInDepartment,
    totalStaffInPosition,
    loading,
    refetch: fetchTotalStaff,
  };
}
