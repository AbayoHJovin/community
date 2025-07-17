import CommunityIcon from "@/assets/svg/CommunityIcon";
import { AntDesign } from "@expo/vector-icons";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface OnboardingSlide1Props {
  onNext: () => void;
  onLogin: () => void;
  onPrev?: () => void;
}

const OnboardingSlide1 = ({ onNext, onLogin }: OnboardingSlide1Props) => {
  return (
    <ScrollView
      className="flex-1 bg-gray-100 p-6"
      contentContainerStyle={{ justifyContent: "space-between", flexGrow: 1 }}
    >
      {/* Title */}
      <Text className="text-[30px] text-[#25B14C] font-semibold mt-4">
        Welcome
      </Text>

      {/* Top Circles */}
      <View className="flex-row justify-between items-center w-full px-2 mt-4">
        <View
          className="rounded-full bg-white shadow-sm w-28 h-28 justify-center items-center"
          style={{ elevation: 10 }}
        >
          <Text className="text-[#25B14C] text-center text-sm px-2">
            Submit your problems
          </Text>
        </View>

        <View
          className="rounded-full bg-white shadow-md w-28 h-28 justify-center items-center"
          style={{ elevation: 6 }} // Slightly stronger shadow for Android
        >
          <Text className="text-[#25B14C] text-center text-sm px-2">
            Solve your problems
          </Text>
        </View>
      </View>

      <View className="justify-center items-center mt-4">
        <View
          className="rounded-full bg-white w-44 h-44 justify-center items-center p-4"
          style={{
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
              },
              android: {
                elevation: 10,
              },
            }),
          }}
        >
          <Text className="text-[#25B14C] text-center font-semibold mb-2">
            All In one
          </Text>
          <View className="w-20 h-20 justify-center items-center my-2">
            <CommunityIcon size={130} color="#25B14C" nameVisible={false} />
          </View>
        </View>
      </View>

      <View className="mt-6 px-2">
        <Text className="text-[#25B14C] text-lg font-semibold mb-1">
          Community Complaints
        </Text>
        <Text className="text-gray-600 text-base">
          Easily make and talk your complaints to any leader
        </Text>
      </View>

      <View className="w-full items-center mt-4">
        <TouchableOpacity
          onPress={onNext}
          className="bg-[#25B14C] w-full h-[56px] rounded-xl justify-center items-center"
        >
          <Text className="text-white text-[18px] font-semibold">
            Let&apos;s get started
          </Text>
        </TouchableOpacity>
      </View>

      {/* Already have account */}
      <TouchableOpacity
        onPress={onLogin}
        className="flex-row items-center justify-center mt-6 mb-4"
      >
        <Text className="text-gray-700 text-base mr-2">
          I already have an account
        </Text>
        <AntDesign name="arrowright" size={20} color="#25B14C" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OnboardingSlide1;
