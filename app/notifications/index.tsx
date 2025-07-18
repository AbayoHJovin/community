import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markAsRead } from "@/store/slices/notificationsSlice";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationsScreen() {
  const { notifications } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();

  // Group notifications by day
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const day = notification.day;
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

  const handleNotificationPress = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
    router.push({
      pathname: "/notifications/[id]",
      params: { id: notificationId },
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className={`bg-white w-full p-5 ${
          Platform.OS === "ios" ? "pt-14" : "pt-10"
        } pb-3 border-b border-gray-200`}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-medium ml-5">Notifications</Text>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1">
        {Object.keys(groupedNotifications).length > 0 ? (
          Object.entries(groupedNotifications).map(
            ([day, dayNotifications]) => (
              <View key={day}>
                {/* Day Header */}
                <Text className="text-lg font-medium text-gray-700 px-5 py-3">
                  {day}
                </Text>

                {/* Day Notifications */}
                {dayNotifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    className={`px-5 py-4 mx-5 my-1 rounded-lg ${
                      notification.read ? "bg-gray-100" : "bg-gray-50"
                    }`}
                    onPress={() => handleNotificationPress(notification.id)}
                  >
                    <Text
                      className={`text-base ${
                        notification.read ? "text-gray-400" : "text-gray-800"
                      }`}
                      numberOfLines={2}
                    >
                      {notification.message}
                    </Text>
                    <View className="flex-row justify-end mt-1">
                      <Text className="text-gray-500 text-sm">
                        {notification.time}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500">No notifications yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
