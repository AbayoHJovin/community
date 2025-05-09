import "@/global.css";
import { store } from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/useColorScheme";
import OnboardingFlow from "./OnboardingFlow";

// 👇 Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

// Explicitly define the component before exporting it
function RootLayout() {
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
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="OnboardingFlow"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/complaint-explanation"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/add-complaint"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}

// Explicitly export the component as default
export default RootLayout;
