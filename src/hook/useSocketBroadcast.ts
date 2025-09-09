/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

interface NotificationData {
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  category?: string;
  action?: string;
  priority?: "low" | "normal" | "high";
}

interface BroadcastOptions {
  broadcastTo: "all" | "department" | "specific" | "role";
  department?: string;
  targetUsers?: string[];
  targetRoles?: string[];
  excludeSender?: boolean;
}

const useSocketBroadcast = (socket: Socket | null, userProfile: any) => {
  // Gửi thông báo broadcast chung
  const sendBroadcastNotification = useCallback(
    (notificationData: NotificationData, options: BroadcastOptions) => {
      if (!socket) {
        toast.error("Socket chưa kết nối");
        return;
      }

      const payload = {
        ...notificationData,
        from: userProfile?.code,
        fromName: userProfile?.fullName,
        timestamp: new Date().toISOString(),
        ...options,
      };

      socket.emit("noti", payload);
      console.log("Broadcast notification sent:", payload);
      toast.info("Đang gửi thông báo...");
    },
    [socket, userProfile]
  );

  // Gửi thông báo tới tất cả users
  const broadcastToAll = useCallback(
    (notificationData: NotificationData) => {
      sendBroadcastNotification(notificationData, {
        broadcastTo: "all",
        excludeSender: false,
      });
    },
    [sendBroadcastNotification]
  );

  // Gửi thông báo tới department
  const broadcastToDepartment = useCallback(
    (notificationData: NotificationData, department: string) => {
      sendBroadcastNotification(notificationData, {
        broadcastTo: "department",
        department,
        excludeSender: false,
      });
    },
    [sendBroadcastNotification]
  );

  // Gửi thông báo tới users cụ thể
  const broadcastToUsers = useCallback(
    (notificationData: NotificationData, userCodes: string[]) => {
      sendBroadcastNotification(notificationData, {
        broadcastTo: "specific",
        targetUsers: userCodes,
        excludeSender: false,
      });
    },
    [sendBroadcastNotification]
  );

  // Gửi thông báo tới roles cụ thể
  const broadcastToRoles = useCallback(
    (notificationData: NotificationData, roles: string[]) => {
      sendBroadcastNotification(notificationData, {
        broadcastTo: "role",
        targetRoles: roles,
        excludeSender: false,
      });
    },
    [sendBroadcastNotification]
  );

  // Gửi thông báo về lịch làm việc
  const broadcastScheduleUpdate = useCallback(
    (
      scheduleData: any,
      targetType: "all" | "department" | "specific" = "all"
    ) => {
      const notificationData: NotificationData = {
        title: "Cập nhật lịch làm việc",
        message: `Đã có cập nhật lịch làm việc cho ${
          scheduleData.employeeName || "nhân viên"
        } vào ngày ${scheduleData.date}`,
        type: "info",
        category: "schedule_update",
        action: "refresh_schedule",
        priority: "normal",
      };

      if (targetType === "all") {
        broadcastToAll(notificationData);
      } else if (targetType === "department" && scheduleData.department) {
        broadcastToDepartment(notificationData, scheduleData.department);
      } else if (targetType === "specific" && scheduleData.userCode) {
        broadcastToUsers(notificationData, [scheduleData.userCode]);
      }
    },
    [broadcastToAll, broadcastToDepartment, broadcastToUsers]
  );

  // Gửi thông báo về chấm công
  const broadcastAttendanceUpdate = useCallback(
    (attendanceData: any) => {
      const notificationData: NotificationData = {
        title: "Cập nhật chấm công",
        message: `${attendanceData.employeeName} đã ${
          attendanceData.action === "checkin" ? "check-in" : "check-out"
        } lúc ${attendanceData.time}`,
        type: "success",
        category: "attendance_update",
        action: "refresh_schedule",
        priority: "normal",
      };

      // Gửi tới HR và manager
      broadcastToRoles(notificationData, ["HR", "MANAGER"]);
    },
    [broadcastToRoles]
  );

  // Gửi thông báo khẩn cấp
  const broadcastUrgentNotification = useCallback(
    (notificationData: NotificationData) => {
      sendBroadcastNotification(
        {
          ...notificationData,
          type: "error",
          priority: "high",
        },
        {
          broadcastTo: "all",
          excludeSender: false,
        }
      );
    },
    [sendBroadcastNotification]
  );

  // Gửi thông báo hệ thống
  const broadcastSystemNotification = useCallback(
    (
      message: string,
      type: "maintenance" | "update" | "announcement" = "announcement"
    ) => {
      const notificationData: NotificationData = {
        title: "Thông báo hệ thống",
        message,
        type: "warning",
        category: "system",
        action:
          type === "maintenance" ? "prepare_maintenance" : "system_update",
        priority: "high",
      };

      broadcastToAll(notificationData);
    },
    [broadcastToAll]
  );

  return {
    sendBroadcastNotification,
    broadcastToAll,
    broadcastToDepartment,
    broadcastToUsers,
    broadcastToRoles,
    broadcastScheduleUpdate,
    broadcastAttendanceUpdate,
    broadcastUrgentNotification,
    broadcastSystemNotification,
  };
};

export default useSocketBroadcast;
