import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg3 from "@/assets/svg/Svg3";
import InputField from "@/components/custom/InputField";
import PhoneInputComponent from "@/components/custom/PhoneInputComponent";
import CommunityIcon from "@/assets/svg/CommunityIcon";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";
import mockUsers from "@/utils/mockUsers";

interface OnboardingSlide1Props {
  onNext: () => void;
  onLogin: () => void;
  onPrev?: () => void;
}

const AuthLogin = ({ onNext, onPrev }: OnboardingSlide1Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // For development/demo purposes, we'll use mock data
      // In production, this would be replaced with an actual API call
      const user = mockUsers.find(
        (user) => user.phoneNumber === phoneNumber && user.password === password
      );

      if (!user) {
        Alert.alert("Error", "Invalid phone number or password");
        setLoading(false);
        return;
      }

      // Store user data in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      
      // Dispatch login action to update Redux state
      const resultAction = await dispatch(loginUser({ phoneNumber, password }));
      
      // Check if login was successful
      if (loginUser.fulfilled.match(resultAction)) {
        // Navigate based on user role
        if (user.role === "leader") {
          console.log("Navigating to leader welcome screen");
          router.replace("/leader/welcome");
        } else {
          console.log("Navigating to citizen tabs");
          router.replace("/(tabs)");
        }
      } else {
        // Handle login failure
        Alert.alert("Error", "Failed to login. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white pl-5">
      <View className="relative flex">
        <Svg3 />
        <View className="m-5">
          <Text className="text-green-600 font-bold text-2xl mt-20">
            Welcome Back
          </Text>

          <View className="rounded-full my-5 w-[90px] h-[90px] justify-center items-center p-1">
            <CommunityIcon nameVisible={false} size={130} color="#25B14C" />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 32, marginTop: 20 }}>
        <View
          style={{
            backgroundColor: "#F8F8F8",
            borderRadius: 50,
            paddingHorizontal: 16,
            marginBottom: 20,
          }}
        >
          <PhoneInputComponent
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <InputField
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
          />
        </View>
      </View>

      <View className="px-8 flex-1 items-center" style={{ marginTop: 40 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-green-600 w-[350px] rounded-md py-3"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white font-bold text-lg">
              Login
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-center text-gray-500 font-medium mt-4">
            Don&apos;t have an account{"  "}
            <Text
              className="text-green-600 font-poppinsSemibold"
              onPress={onPrev}
            >
              Register
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AuthLogin;
