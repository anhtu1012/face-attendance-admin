"use client";

import { useNotificationApi } from "./useNotification";

const NotificationHolder = () => {
  const { contextHolder } = useNotificationApi();

  return <>{contextHolder}</>;
};

export default NotificationHolder;
