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
import { ActivityIndicator, Text, View } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/useColorScheme";

// 👇 Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

// Main app layout with Redux
function RootLayoutWithRedux() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // We need to dispatch actions after the component is mounted
  // so we'll handle auth check in a useEffect
  useEffect(() => {
    async function checkAuthentication() {
      try {
        // Check if user data exists in AsyncStorage
        const userJson = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        
        if (userJson && token) {
          const user = JSON.parse(userJson);
          if (user.role === "leader") {
            setInitialRoute("/leader/welcome");
          } else {
            setInitialRoute("/(tabs)");
          }
        } else {
          // No authenticated user, show onboarding
          setInitialRoute("/OnboardingFlow");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setInitialRoute("/OnboardingFlow");
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    // Check if fonts are loaded before proceeding
    if (fontsLoaded) {
      checkAuthentication();
    }
  }, [fontsLoaded]);

  // Navigate to initial route when app is ready
  useEffect(() => {
    if (appIsReady && initialRoute) {
      router.replace(initialRoute as any);
    }
  }, [appIsReady, initialRoute, router]);

  if (!appIsReady || !initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#25B14C" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="OnboardingFlow"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="leader" options={{ headerShown: false }} />
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
  );
}

// Wrap the app with Redux provider - this is the actual exported component
export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutWithRedux />
    </Provider>
  );
}
