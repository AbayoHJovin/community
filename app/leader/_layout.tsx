import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuthStatus } from "@/store/slices/authSlice";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";

export default function LeaderLayout() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Check if user is authenticated and is a leader
    const checkAuth = async () => {
      const resultAction = await dispatch(checkAuthStatus());

      if (checkAuthStatus.fulfilled.match(resultAction)) {
        const user = resultAction.payload;

        // If not authenticated or not a leader, redirect to login
        if (!user || user.role !== "leader") {
          console.log("Not authenticated as leader, redirecting to onboarding");
          router.replace("/OnboardingFlow");
        }
      } else {
        // Error checking auth, redirect to login
        console.log("Error checking auth, redirecting to onboarding");
        router.replace("/OnboardingFlow");
      }
    };

    checkAuth();
  }, [dispatch]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="text-gray-500 mt-4">Loading...</Text>
      </View>
    );
  }

  // Only render the stack if user is authenticated and is a leader
  if (!isAuthenticated || (user && user.role !== "leader")) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="complaints" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="complaint-details" />
    </Stack>
  );
}
