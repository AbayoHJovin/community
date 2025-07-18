import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markAsRead } from "@/store/slices/notificationsSlice";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notifications);

  // Find the notification by id
  const notification = notifications.find((n) => n.id === id);

  useEffect(() => {
    // Mark notification as read when viewed
    if (notification && !notification.read && id) {
      dispatch(markAsRead(id.toString()));
    }
  }, [dispatch, notification, id]);

  if (!notification) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Notification not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-green-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      {/* Notification Content */}
      <ScrollView className="flex-1 p-5">
        <View className="mb-4">
          <Text className="text-lg font-medium text-gray-700">
            {notification.day}
          </Text>
        </View>

        <View className="bg-gray-50 p-5 rounded-lg">
          <Text className="text-lg text-gray-800 leading-7">
            {notification.fullMessage}
          </Text>

          <View className="flex-row justify-end mt-4">
            <Text className="text-gray-500">{notification.time}</Text>
          </View>
        </View>

        {/* View Related Complaint Button */}
        <TouchableOpacity
          className="bg-green-600 py-4 rounded-lg mt-8 items-center"
          onPress={() => {
            router.push({
              pathname: "/screens/complaint-explanation",
              params: { complaintId: notification.complaintId },
            });
          }}
        >
          <Text className="text-white font-semibold">
            View Related Complaint
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
