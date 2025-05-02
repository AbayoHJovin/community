import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import PhoneInputComponent from "../custom/PhoneInputComponent";
import InputField from "../custom/InputField";
import Svg4 from "@/assets/svg/Svg4";
import Svg5 from "@/assets/svg/Svg5";
import { useRouter } from "expo-router";
interface OnboardingSlide1Props {
  onNext: () => void;
  onLogin: () => void;
  onPrev: () => void;
}

const AuthLogin = ({ onNext, onLogin, onPrev }: OnboardingSlide1Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-white mb-5">
      <View>
        <Svg4 />
        <Svg5 />
      </View>
      <View className="mt-20 mb-5 px-10">
        <Text className="text-green-600 font-poppinsBold text-[52px] ">
          Login
        </Text>
        <View className="flex-row  items-center">
          <Text className="text-[19px] mr-2">Good to see you back!</Text>{" "}
          <AntDesign name="heart" size={20} color="green" />
        </View>
      </View>

      <View style={{ paddingHorizontal: 32, marginTop: 20 }}>
        <View
          style={{
            backgroundColor: "#F8F8F8",
            borderRadius: 50,
            paddingHorizontal: 16,
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
          />
        </View>
      </View>

      <View className="px-8 flex-1 items-center" style={{ marginTop: 40 }}>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.7}
          className="bg-green-600 w-[350px] rounded-md py-3"
        >
          <Text className="text-center text-white font-bold text-lg">Done</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-center text-gray-500  font-medium mt-4">
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
