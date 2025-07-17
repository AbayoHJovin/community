import LeaderWaveBg from "@/assets/svg/LeaderWaveBg";
import { useAppSelector } from "@/store/hooks";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LeaderWelcomeScreen() {
  const { user } = useAppSelector((state) => state.auth);

  // Ensure we have a user and they're a leader
  useEffect(() => {
    if (!user || user.role !== "leader") {
      // Redirect to login if not a leader
      router.replace("/OnboardingFlow");
      return;
    }

    // Automatically navigate to complaints screen after a short delay
    const timer = setTimeout(() => {
      router.replace("/leader/complaints");
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleStart = () => {
    // Navigate to complaints screen
    router.replace("/leader/complaints");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Background Wave */}
      <LeaderWaveBg />

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Image Section */}
        <View className="items-center justify-center mt-10 mb-6">
          <Image
            source={require("@/assets/images/chattingRemotely.png")}
            className="w-[300px] h-[300px]"
            resizeMode="contain"
          />
        </View>

        {/* Text Content - This will be positioned over the green background */}
        <View className="flex-1 justify-end mb-20">
          <Text className="text-white text-4xl font-bold text-center mb-2">
            Let&apos;s Connect
          </Text>
          <Text className="text-white text-4xl font-bold text-center mb-6">
            with citizens
          </Text>

          <Text className="text-white text-center text-lg mb-12">
            View citizens complaints and{"\n"}provide solutions
          </Text>

          {/* Button */}
          <TouchableOpacity
            onPress={handleStart}
            className="bg-white rounded-full py-4 px-8 mx-10 flex-row items-center justify-center"
          >
            <Text className="text-[#25B14C] text-lg font-semibold mr-2">
              Let&apos;s Start
            </Text>
            <AntDesign name="arrowright" size={20} color="#25B14C" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
