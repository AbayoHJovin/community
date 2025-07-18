import mockNotifications, { Notification } from "@/utils/mockNotifications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

// Calculate initial unread count
const initialUnreadCount = mockNotifications.filter((n) => !n.read).length;

const initialState: NotificationsState = {
  notifications: mockNotifications,
  unreadCount: initialUnreadCount,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
  },
});

export const { markAsRead, markAllAsRead, addNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
