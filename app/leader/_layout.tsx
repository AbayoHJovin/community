import RouteGuard from "@/components/auth/RouteGuard";
import { Stack } from "expo-router";

export default function LeaderLayout() {
  return (
    <RouteGuard requiredRole="leader">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="complaints" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="complaint-details" />
      </Stack>
    </RouteGuard>
  );
}
