/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import "./notification.scss";
import { useTranslations } from "next-intl";

let notificationApi: NotificationInstance;
let translations: ((key: string) => string) | null = null;

export const useNotificationApi = () => {
  const [api, contextHolder] = notification.useNotification();
  const mes = useTranslations("HandleNotion");

  // Set the global notification API instance
  notificationApi = api;
  // Set the global translations instance
  translations = mes;

  return { api, contextHolder };
};
const safeString = (value: unknown): string =>
  typeof value === "string" ? value : "";
export const getNotificationApi = (): NotificationInstance => {
  if (!notificationApi) {
    throw new Error(
      "Notification API not initialized. Make sure to call useNotificationApi() in your app layout."
    );
  }
  return notificationApi;
};

// Convenience methods for common notification types
export const showSuccess = (
  description: unknown,
  message: string = translations?.("succes") || "Thành công",
  placement: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" = "topRight",
  duration: number = 3
) => {
  getNotificationApi().success({
    message,
    description: safeString(description),
    placement,
    duration,
    className: "custom-notification",
  });
};

export const showError = (
  description: unknown,
  message: string = translations?.("errorr") || "Lỗi",
  placement: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" = "topRight",
  duration: number = 3
) => {
  getNotificationApi().error({
    message,
    description: safeString(description),
    placement,
    duration,
    className: "custom-notification",
  });
};

export const showWarning = (
  description: unknown,
  message: string = translations?.("warningg") || "Cảnh báo",
  placement: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" = "topRight",
  duration: number = 3
) => {
  getNotificationApi().warning({
    message,
    description: safeString(description),
    placement,
    duration,
    className: "custom-notification",
  });
};

export const showInfo = (
  description: unknown,
  message: string = translations?.("infoo") || "Thông tin",
  placement: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" = "topRight",
  duration: number = 3
) => {
  getNotificationApi().info({
    message,
    description: safeString(description),
    placement,
    duration,
    className: "custom-notification",
  });
};
