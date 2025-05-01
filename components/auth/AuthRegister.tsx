import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import InputField from "../custom/InputField";
import PhoneInputComponent from "../custom/PhoneInputComponent";
import CommunityIcon from "@/assets/svg/CommunityIcon";
import Svg3 from "@/assets/svg/Svg3";

interface OnboardingSlide1Props {
  onNext: () => void;
  onLogin: () => void;
  onPrev?: () => void;
}

const AuthRegister = ({ onNext, onLogin }: OnboardingSlide1Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white pl-5">
      <View className="relative flex">
        <Svg3 />
        <View className="m-5">
          <Text className="text-green-600 font-bold text-2xl mt-20">
            Create Account
          </Text>

          <View className="rounded-full my-5 w-[90px] h-[90px] justify-center items-center p-1">
            <CommunityIcon nameVisible={false} />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 32, marginTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <InputField
            placeholder="Usernames"
            value={username}
            setValue={setUsername}
          />
          <InputField
            placeholder="Password"
            value={password}
            setValue={setPassword}
          />
        </View>

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
      </View>

      <View className="px-8 flex-1 items-center" style={{ marginTop: 40 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-green-600 w-[350px] rounded-md py-3"
          onPress={onNext}
        >
          <Text className="text-center text-white font-bold text-lg">Done</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext}>
          <Text className="text-center text-gray-500 font-medium mt-4">
            Already have an account{" "}
            <Text className="text-green-600 font-semibold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthRegister;
