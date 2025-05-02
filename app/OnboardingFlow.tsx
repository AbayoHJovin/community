// app/onboarding.tsx

import AuthLogin from "@/components/auth/AuthLogin";
import AuthRegister from "@/components/auth/AuthRegister";
import OnboardingSlide1 from "@/components/onBoarding/OnboardingSlide1";
import OnboardingSlide2 from "@/components/onBoarding/OnboardingSlide2";
import OnboardingSlide3 from "@/components/onBoarding/OnboardingSlide3";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screens = [
  OnboardingSlide1,
  OnboardingSlide2,
  OnboardingSlide3,
  AuthRegister,
  AuthLogin,
];

export default function OnboardingFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = async () => {
    if (currentIndex === screens.length - 1) {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
    }
  
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace("/landing");
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
    setCurrentIndex(3);
  };

  const CurrentScreen = screens[currentIndex];

  return (
    <View style={{ flex: 1 }}>
      <CurrentScreen onNext={handleNext} onLogin={handleLogin} onPrev={handlePrev}/>
    </View>
  );
}
