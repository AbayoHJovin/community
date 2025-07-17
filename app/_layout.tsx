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

// Explicitly define the component before exporting it
function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      // Check if fonts are loaded
      if (fontsLoaded) {
        try {
          // Check if onboarding has been completed
          const status = await AsyncStorage.getItem("hasSeenOnboarding");

          if (status === "true") {
            setHasSeenOnboarding(true);

            // Check if there's a stored user and their role
            const userJson = await AsyncStorage.getItem("user");
            if (userJson) {
              try {
                const user = JSON.parse(userJson);
                // If user is a leader, set initial route to leader complaints
                if (user.role === "leader") {
                  setInitialRoute("/leader/complaints");
                } else {
                  setInitialRoute("/(tabs)");
                }
              } catch (error) {
                console.error("Error parsing user data:", error);
                setInitialRoute("/(tabs)");
              }
            } else {
              setInitialRoute("/(tabs)");
            }
          } else {
            setHasSeenOnboarding(false);
            setInitialRoute("/OnboardingFlow");
          }
        } catch (error) {
          console.error("Error during app initialization:", error);
          setInitialRoute("/OnboardingFlow");
        } finally {
          setAppIsReady(true);
          await SplashScreen.hideAsync(); // Hide splash screen once the app is ready
        }
      }
    }

    prepare();
  }, [fontsLoaded]);

  // Navigate to initial route when app is ready
  useEffect(() => {
    if (appIsReady && initialRoute) {
      router.replace(initialRoute);
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
    <Provider store={store}>
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
    </Provider>
  );
}

// Explicitly export the component as default
export default RootLayout;
