import { API_ENDPOINTS } from "@/utils/apiConfig";
import { Notification } from "@/utils/mockNotifications";
import apiService, { ApiResponse } from "./apiService";

class NotificationService {
  // Get all notifications
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    try {
      return await apiService.get<Notification[]>(
        API_ENDPOINTS.NOTIFICATIONS.LIST
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications",
      };
    }
  }

  // Get notification by ID
  async getNotificationById(id: string): Promise<ApiResponse<Notification>> {
    try {
      return await apiService.get<Notification>(
        API_ENDPOINTS.NOTIFICATIONS.DETAIL(id)
      );
    } catch (error) {
      console.error(`Error fetching notification with ID ${id}:`, error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : `Failed to fetch notification with ID ${id}`,
      };
    }
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<ApiResponse<null>> {
    try {
      return await apiService.put<null>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id),
        {}
      );
    } catch (error) {
      console.error(`Error marking notification with ID ${id} as read:`, error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : `Failed to mark notification with ID ${id} as read`,
      };
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<ApiResponse<null>> {
    try {
      return await apiService.put<null>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ,
        {}
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark all notifications as read",
      };
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
