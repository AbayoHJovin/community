import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import "@/global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import OnboardingFlow from "./OnboardingFlow";

// 👇 Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Simulate loading process like fonts
      if (fontsLoaded) {
        // Check if onboarding has been completed
        const status = await AsyncStorage.getItem("hasSeenOnboarding");
        if (status === "true") {
          setHasSeenOnboarding(true);
        } else {
          setHasSeenOnboarding(false);
        }

        // Simulate additional loading if needed (optional)
        await new Promise((resolve) => setTimeout(resolve, 500));

        setAppIsReady(true);
        await SplashScreen.hideAsync(); // Hide splash screen once the app is ready
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!appIsReady) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />; // You can show a loading screen here if needed
  }

  // If onboarding is not completed, show onboarding flow
  if (!hasSeenOnboarding) {
    return <OnboardingFlow />;
  }

  // Otherwise, go to the main app
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="landing"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
