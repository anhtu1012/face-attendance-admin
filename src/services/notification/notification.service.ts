/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  NotificationResponse,
  MarkAllReadRequest,
  MarkAllReadResponse,
} from "@/dtos/notification/notification.response.dto";

class NotificationServiceBase extends AxiosService {
  private readonly pathUrl = "/v1/notification";

  /**
   * Get notifications for a specific user
   * @param userId  - The user code to get notifications for
   * @returns Promise<NotificationResponse>
   */
  async getMyNotification(userId: string): Promise<NotificationResponse> {
    try {
      const response = await this.get<NotificationResponse>(
        `/v1/time-keeping/thong-bao-nhan-vien?userId=${userId}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
  async getNotifications(
    searchFilter: FilterQueryStringTypeItem[],
    params?: any
  ): Promise<NotificationResponse> {
    return this.getWithFilter(`${this.pathUrl}`, searchFilter, params);
  }

  /**
   * Mark all notifications as read for a user
   * @param userId - The user code to mark notifications as read
   * @returns Promise<MarkAllReadResponse>
   */
  async markAllAsRead(userId: string): Promise<MarkAllReadResponse> {
    try {
      const requestBody: MarkAllReadRequest = { userId };
      const response = await this.post<MarkAllReadResponse, MarkAllReadRequest>(
        `/v1/time-keeping/doc-tat-ca-thong-bao`,
        requestBody
      );
      return response;
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      throw error;
    }
  }
  async markOneRead(notificationId: string) {
    return await this.post(`/v1/time-keeping/cap-nhat-trang-thai-thong-bao`, {
      listNotificationIds: [notificationId],
    });
  }

  async deleteNotification(userId: string) {
    return await this.delete(`/v1/time-keeping/xoa-thong-bao`, { userId });
  }
}

export const NotificationService = new NotificationServiceBase();
