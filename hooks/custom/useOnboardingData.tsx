import AuthLogin from "@/components/auth/AuthLogin";
import AuthRegister from "@/components/auth/AuthRegister";
import OnboardingSlide1 from "@/components/onBoarding/OnboardingSlide1";
import OnboardingSlide2 from "@/components/onBoarding/OnboardingSlide2";
import OnboardingSlide3 from "@/components/onBoarding/OnboardingSlide3";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";


const screens = [
    OnboardingSlide1,
    OnboardingSlide2,
    OnboardingSlide3,
    AuthLogin,
    AuthRegister,
  ];
export default function UseOnBoardingData(){
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNext = async () => {
        if (currentIndex < screens.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          await AsyncStorage.setItem("hasSeenOnboarding", "true");
          router.replace("/(tabs)");
        }
      };
      return {handleNext,currentIndex}
}