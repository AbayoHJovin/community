import { View, Text, ImageBackground, TouchableOpacity, ImageSourcePropType } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import Tag from "@/assets/svg/Tag";
interface propsDef {
  date: string;
  onPin: () => void;
  title: string;
  subtitle: string;
  location: string;
  onClick: () => void;
  complaintBackground: ImageSourcePropType;
}
const ComplaintComponent = ({
  date,
  onPin,
  title,
  subtitle,
  location,
  onClick,
  complaintBackground,
}: propsDef) => {
  return (
    <View className="p-5 bg-white  mx-5 w-[274.84px] h-[350px] container rounded-lg shadow-2xl">
      <ImageBackground
        source={complaintBackground}
        style={{
          flex: 1,
          padding: 16,
          height: 160,
          borderRadius: 20,
        }}
        resizeMode="stretch"
      >
        <View className="flex flex-row items-center justify-between">
          <View className="bg-white rounded-lg px-4 py-2 items-center shadow-md">
            <Text className="text-green-500 font-bold text-lg">
              {date.split(" ")[0]}
            </Text>
            <Text className="text-green-500 text-sm">{date.split(" ")[1]}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-white rounded-lg px-4 py-2 items-center shadow-md"
            onPress={() => onPin()}
          >
            <Tag />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View>
        <Text
          className=" font-poppinsSemibold text-lg mb-2 w-[16rem]"
          style={{
            overflow: "hidden",
            color: "#25B14C",
            textOverflow: "ellipsis",
          }}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          className="text-[#3D3B3B] mb-4 w-[16rem]"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          numberOfLines={2}
        >
          {subtitle}
        </Text>

        <View className="flex flex-row items-center space-x-2">
          <AntDesign name="tag" size={25} color="#3D3B3B" />
          <Text className="text-[#3D3B3B]">{location}</Text>
        </View>
      </View>
    </View>
  );
};

export default ComplaintComponent;