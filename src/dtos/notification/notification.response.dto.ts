export interface NotificationItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  message: string;
  type: "SUCCESS" | "NOTSUCCESS" | "WARNING" | "INFO";
  isRead: boolean;
  userCode: string;
}

export interface NotificationResponse {
  count: number;
  limit: number;
  page: number;
  data: NotificationItem[];
}

export interface MarkAllReadRequest {
  userCode: string;
}

export interface MarkAllReadResponse {
  success: boolean;
  message?: string;
}
