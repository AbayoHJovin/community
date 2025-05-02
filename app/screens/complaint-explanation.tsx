import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native";
import ComplaintOptions from "@/components/custom/ComplaintOptions";
import { useAppSelector } from "@/store/hooks";
import { AntDesign } from "@expo/vector-icons";
import RoundedImageGroup from "@/components/custom/RoundedImageGroup";

const ComplaintDetails = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 380;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const params = useLocalSearchParams();
  const complaintId = params.complaintId ? Number(params.complaintId) : null;

  useEffect(() => {
    console.log("Complaint ID from params:", complaintId);
    if (!complaintId) {
      Alert.alert("Error", "No complaint ID provided");
    }
  }, [complaintId]);

  const complaint = useAppSelector((state) =>
    state.complaints.complaints.find((c) => c.id === complaintId)
  );

  const allComplaintIds = useAppSelector((state) =>
    state.complaints.complaints.map((c) => c.id)
  );

  useEffect(() => {
    if (!complaint && complaintId) {
      console.log("Complaint not found in Redux state for ID:", complaintId);
      console.log("Available complaints:", JSON.stringify(allComplaintIds));
    }
  }, [complaint, complaintId, allComplaintIds]);

  if (!complaint) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F5F5]">
        <Text className="text-xl text-gray-600">Complaint not found</Text>
        <Text className="text-gray-500 mt-2">ID: {complaintId}</Text>
        <TouchableOpacity
          className="mt-4 bg-[#25B14C] px-4 py-2 rounded-lg"
          onPress={() => router.push("/(tabs)")}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const content = complaint.subtitle;
  const maxLength = 100;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldTruncate = content.length > maxLength;
  const displayedText =
    isExpanded || !shouldTruncate
      ? content
      : content.slice(0, maxLength) + "...";

  const statusBarPadding =
    Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 12;

  return (
    <ScrollView className="bg-[#F5F5F5]">
      <View style={{ position: "relative" }}>
        <ImageBackground
          source={
            complaint.backgroundImage ||
            require("../../assets/images/complaintImage.png")
          }
          style={{
            height: isMobile ? 180 : 220,
            width: "100%",
          }}
          resizeMode="cover"
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "",
            }}
          />
          <View
            className="px-4 flex-row items-center justify-between"
            style={{
              paddingTop: statusBarPadding,
              paddingBottom: 10,
              position: "relative",
              zIndex: 1,
            }}
          >
            <View className="flex-row items-center flex-1 py-2">
              <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.push("/(tabs)");
                }
              }}              
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <AntDesign name="arrowleft" color="#FFF" size={24} />
              </TouchableOpacity>
              <View style={{ maxWidth: "80%" }}>
                <Text
                  className="text-white ml-3 font-poppinsSemibold text-lg"
                  numberOfLines={1}
                >
                  Complaint Details
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={toggleModal}
              accessible={true}
              accessibilityLabel="Options menu"
              accessibilityRole="button"
              className="rounded-full items-center justify-center"
              style={{ height: 36, width: 36 }}
            >
              <Image
                source={require("../../assets/images/options.png")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <ComplaintOptions
              isModalVisible={isModalVisible}
              toggleModal={toggleModal}
              complaintId={complaintId || 0}
            />
          </View>
        </ImageBackground>

        <View
          style={{
            position: "absolute",
            bottom: -20,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
            zIndex: 10,
          }}
        >
          <RoundedImageGroup />
        </View>
      </View>

      <View className="px-4 my-4" style={{ marginTop: 30 }}>
        <View className="mb-3 flex justify-center text-center items-center">
          <Text
            className="text-black text-start font-bold p-3"
            style={{ fontSize: isMobile ? 20 : 22 }}
            numberOfLines={2}
          >
            {complaint.title}
          </Text>
        </View>

        <View className="flex-row items-center mb-4  p-3 rounded-lg">
          <Image
            source={require("../../assets/images/date.png")}
            style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40 }}
          />
          <View className="ml-3 flex-1">
            <Text
              className="font-poppinsSemibold text-black"
              style={{ fontSize: isMobile ? 14 : 16 }}
            >
              {complaint.date}
            </Text>
            <Text
              className="text-[#747688] font-poppinsRegular"
              style={{ fontSize: isMobile ? 12 : 14 }}
            >
              {complaint.day}, {complaint.time}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-4  p-3 rounded-lg">
          <Image
            source={require("../../assets/images/location.png")}
            style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40 }}
          />
          <View className="ml-3 flex-1">
            <Text
              className="font-poppinsSemibold text-black"
              style={{ fontSize: isMobile ? 14 : 16 }}
            >
              {complaint.location}
            </Text>
            <Text
              className="text-[#747688] font-poppinsRegular"
              style={{ fontSize: isMobile ? 12 : 14 }}
              numberOfLines={1}
            >
              Gasabo, Kinyinya, Gasharu, Agatare
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-4  p-3 rounded-lg">
          <View className="flex-row items-center flex-1">
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
              style={{
                width: isMobile ? 36 : 40,
                height: isMobile ? 36 : 40,
                borderRadius: 10,
              }}
            />
            <View className="ml-3 flex-1">
              <Text
                className="font-poppinsSemibold text-black"
                style={{ fontSize: isMobile ? 14 : 16 }}
              >
                {complaint.leader.name}
              </Text>
              <Text
                className="text-[#747688] font-poppinsRegular"
                style={{ fontSize: isMobile ? 12 : 14 }}
                numberOfLines={1}
              >
                {complaint.leader.responsibilities}
              </Text>
            </View>
          </View>
          <TouchableOpacity className="bg-[#25B14C] px-3 py-1 rounded">
            <Text
              className="text-white font-poppinsSemibold"
              style={{ fontSize: isMobile ? 12 : 14 }}
            >
              Change
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text
            className="font-semibold text-[#25B14C] mb-3 p-3"
            style={{ fontSize: isMobile ? 16 : 18 }}
          >
            About Complaint
          </Text>
          <View className="p-3 rounded-lg">
            <Text
              className="text-black leading-6 font-poppinsRegular"
              style={{ fontSize: isMobile ? 14 : 16 }}
            >
              {displayedText}
            </Text>
            {shouldTruncate && !isExpanded && (
              <TouchableOpacity onPress={handleToggle}>
                <Text
                  className="text-[#25B14C] font-poppinsSemibold mt-2"
                  style={{ fontSize: isMobile ? 14 : 16 }}
                >
                  Read more...
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {isExpanded && shouldTruncate && (
            <TouchableOpacity onPress={handleToggle}>
              <Text
                className="text-[#25B14C] mt-2 font-poppinsSemibold"
                style={{ fontSize: isMobile ? 14 : 16 }}
              >
                Show less
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ComplaintDetails;
