// import { Image } from "expo-image";
// import { Platform, Text, View } from "react-native";

// import { HelloWave } from "@/components/HelloWave";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//       headerImage={
//         <Image
//           source={require("@/assets/images/partial-react-logo.png")}
//           className="h-[178px] w-[290px] bottom-0 left-0 absolute"
//         />
//       }
//     >
//       <View className="bg-blue-500">
//         <Text className="text-white">Hirwa Jovin</Text>
//       </View>
//       <ThemedView className="flex-row items-center gap-2">
//         <ThemedText type="title">Welcome! Hirwa</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView className="gap-2 mb-2">
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit{" "}
//           <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
//           to see changes. Press{" "}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: "cmd + d",
//               android: "cmd + m",
//               web: "F12",
//             })}
//           </ThemedText>{" "}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView className="gap-2 mb-2">
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView className="gap-2 mb-2">
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">
//             npm run reset-project
//           </ThemedText>{" "}
//           to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
//           directory. This will move the current{" "}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }





import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import { router } from "expo-router";
import { ComplaintsContext } from "@/contexts/complaintsContext";
import ComplaintComponent from "@/components/custom/complaintComponent";
import SearchButton from "@/assets/svg/SearchButton";
import Bell from "@/assets/svg/Bell";

interface Leader {
  name: string;
  responsibilities: string;
}

interface Complaint {
  id: number;
  date: string;
  day: string;
  time: string;
  title: string;
  subtitle: string;
  location: string;
  backgroundImage: ImageSourcePropType;
  leader: Leader;
}

const HomeScreen = () => {
  const complaints = useContext(ComplaintsContext) as Complaint[]
  function onClick() {}
  function onPin() {
    console.log("Pinned!");
  }

  return (
    <ScrollView className="bg-gray-50">
      <View className="bg-[#25B14C] w-full h-60 p-5 flex flex-col justify-evenly">
        <View className="flex flex-row items-center justify-between">
          <Image
            source={require("../../assets/images/userImage.png")}
            resizeMode="cover"
            className="w-14 h-14 rounded-full"
          />
          <Text className="text-white font-semibold text-xl">Welcome</Text>
          <Bell />
        </View>
        <View className="flex flex-row items-center mt-5 justify-between space-x-3">
          <TouchableOpacity activeOpacity={0.8}  onPress={()=>router.push("/(tabs)/Search")} className="flex-1 bg-white rounded-xl h-[3.2rem] px-4 py-4 text-gray-600 items-center">
            <Text className="text-[#A9A9A9] ">Search for any complaint</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={()=>router.push("/(tabs)/Search")} className="flex items-center justify-center p-3">
            <SearchButton/>
          </TouchableOpacity>
        </View>
      </View>
      {complaints && complaints.length > 0 ? (
        <View>
          <View className="flex flex-row justify-between p-5">
            <Text className="text-[#25B14C] font-semibold text-lg">
              Your Complaints
            </Text>
            <Text className="text-[#25B14C]">See all</Text>
          </View>
          <FlatList
            data={complaints}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: `/screens/ComplaintExplanation`,
                    params: { complaint: JSON.stringify(item) },
                  })
                }
              >
                <ComplaintComponent
                  complaintBackground={item.backgroundImage}
                  date={item.date}
                  location={item.location}
                  subtitle={item.subtitle}
                  title={item.title}
                  onClick={onClick}
                  onPin={onPin}
                />
              </Pressable>
            )}
            horizontal
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : (
        <View className="flex-1 justify-center items-center h-[350px]">
          <Text className="text-center text-gray-600 text-lg">
            You haven't posted any complaint yet!
          </Text>
        </View>
      )}
      <View className="bg-[#25B14C] mx-5 p-6 rounded-3xl gap-y-4 my-5">
        <Text className="text-white text-lg font-poppinsSemibold">
          Post your problem
        </Text>
        <Text className="text-white text-base w-[16rem] leading-6">
          Take your time and add here your problem and it get solved{" "}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={()=>router.push("/screens/AddComplaintScreen")} className="bg-white px-4 py-4 w-[140px] items-center rounded-lg">
          <Text className="text-[#25B14C] text-center font-poppinsSemibold">
            Add Complaint
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;