import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
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
    <TouchableOpacity
      className="bg-white mx-4 w-[275px] h-[350px] rounded-2xl shadow-sm overflow-hidden"
      activeOpacity={0.9}
      onPress={onClick}
    >
      <ImageBackground
        source={complaintBackground}
        resizeMode="cover"
        style={{ height: 160, justifyContent: "space-between", padding: 12 }}
        imageStyle={{ borderRadius: 20 }}
      >
        <View className="flex flex-row justify-between">
          <View className="bg-white rounded-md px-3 py-1 items-center shadow">
            <Text className="text-green-600 font-bold text-lg">
              {date.split(" ")[0]}
            </Text>
            <Text className="text-green-600 text-xs uppercase">
              {date.split(" ")[1]}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-white rounded-md px-3 py-1 shadow"
            onPress={onPin}
            activeOpacity={0.7}
          >
            <Tag />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View className="p-4 flex-1 justify-between">
        <View>
          <Text
            numberOfLines={2}
            className="text-[#25B14C] text-base font-semibold mb-1"
          >
            {title}
          </Text>
          <Text numberOfLines={2} className="text-[#3D3B3B] text-sm mb-3">
            {subtitle}
          </Text>
        </View>

        <View className="flex flex-row items-center space-x-2">
          <AntDesign name="tag" size={18} color="#3D3B3B" />
          <Text className="text-[#3D3B3B] text-sm">{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ComplaintComponent;
