import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

const RoundedImageGroup = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 380;

  const images = [
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
  ];

  return (
    <View className="flex-row items-center bg-white shadow-lg py-2 px-3 rounded-full flex-1 justify-between">
      <View className="flex-row items-center">
        {images.map((image, index) => (
          <View
            key={index}
            className={`rounded-full border-2 border-white overflow-hidden ${
              index > 0 ? "-ml-3" : ""
            }`}
            style={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}
          >
            <Image source={{ uri: image }} className="w-full h-full" />
          </View>
        ))}
        <Text className="ml-2 text-[#25B14C] font-poppinsMedium text-xs">
          +20 Views
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity className="bg-[#25B14C] px-3 py-1 rounded-md">
        <Text className="text-white font-poppinsSemibold text-xs">View</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoundedImageGroup;
