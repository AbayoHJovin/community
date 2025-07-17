import { useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function LeaderDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  // Ensure user is authenticated and redirect to complaints
  useEffect(() => {
    if (!user || user.role !== "leader") {
      // Redirect to login if not a leader
      router.replace("/OnboardingFlow");
      return;
    }

    // Redirect to complaints screen
    router.replace("/leader/complaints");
  }, [user]);

  // Show loading while redirecting
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#25B14C" />
      <Text className="text-gray-500 mt-4">Redirecting to complaints...</Text>
    </View>
  );
}
