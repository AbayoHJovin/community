// app/onboarding.tsx

import AuthLogin from "@/components/auth/AuthLogin";
import AuthRegister from "@/components/auth/AuthRegister";
import OnboardingSlide1 from "@/components/onBoarding/OnboardingSlide1";
import OnboardingSlide2 from "@/components/onBoarding/OnboardingSlide2";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuthStatus } from "@/store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const screens = [OnboardingSlide1, OnboardingSlide2, AuthRegister, AuthLogin];

export default function OnboardingFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const resultAction = await dispatch(checkAuthStatus());

      if (checkAuthStatus.fulfilled.match(resultAction)) {
        const user = resultAction.payload;

        if (user) {
          // If user is authenticated, redirect based on role
          if (user.role === "leader") {
            router.replace("/leader/welcome");
          } else {
            router.replace("/(tabs)");
          }
        } else {
          // No authenticated user, show onboarding
          setLoading(false);
        }
      } else {
        // Error checking auth, show onboarding
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, router]);

  const handleNext = async () => {
    if (currentIndex === screens.length - 1) {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
    }

    if (currentIndex < screens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace("/(tabs)");
    }
  };

  const handlePrev = async () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      await AsyncStorage.setItem("hasSeenOnboarding", "false");
      router.replace("/(tabs)");
    }
  };

  const handleLogin = () => {
    setCurrentIndex(3); // Go directly to login screen (updated index)
  };

  const CurrentScreen = screens[currentIndex];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="text-gray-500 mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CurrentScreen
        onNext={handleNext}
        onLogin={handleLogin}
        onPrev={handlePrev}
      />
    </View>
  );
}
