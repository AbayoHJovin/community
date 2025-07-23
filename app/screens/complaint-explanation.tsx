import ComplaintOptions from "@/components/custom/ComplaintOptions";
import RoundedImageGroup from "@/components/custom/RoundedImageGroup";
import { useAppSelector } from "@/store/hooks";
import { Response } from "@/types/complaint";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// Interface for complaint with userId
interface ComplaintWithUser {
  id: number;
  date: string;
  day: string;
  time: string;
  title: string;
  subtitle: string;
  location: string;
  backgroundImage: any;
  leader: { name: string; responsibilities: string };
  category: string;
  status?: "pending" | "in-progress" | "resolved";
  userId?: string;
  responses?: Response[];
  createdBy?: string;
}

const ComplaintDetails = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 380;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const params = useLocalSearchParams();
  const complaintId = params.complaintId ? Number(params.complaintId) : null;
  const [loading, setLoading] = useState(true);
  const [localComplaint, setLocalComplaint] = useState<ComplaintWithUser | null>(null);

  // Get complaint from Redux store
  const reduxComplaint = useAppSelector((state) =>
    state.complaints.complaints.find((c) => c.id === complaintId)
  );

  useEffect(() => {
    console.log("Complaint ID from params:", complaintId);
    if (!complaintId) {
      Alert.alert("Error", "No complaint ID provided");
      return;
    }

    // If complaint is in Redux store, use it
    if (reduxComplaint) {
      setLocalComplaint(reduxComplaint);
      setLoading(false);
      return;
    }

    // If not in Redux, try to get it from AsyncStorage
    const fetchFromAsyncStorage = async () => {
      try {
        setLoading(true);
        const storedComplaints = await AsyncStorage.getItem("userComplaints");
        if (storedComplaints) {
          const complaints: ComplaintWithUser[] = JSON.parse(storedComplaints);
          const foundComplaint = complaints.find(c => c.id === complaintId);
          
          if (foundComplaint) {
            console.log("Complaint found in AsyncStorage:", foundComplaint.title);
            // Make sure backgroundImage is properly formatted
            const formattedComplaint = {
              ...foundComplaint,
              backgroundImage: foundComplaint.backgroundImage.uri 
                ? { uri: foundComplaint.backgroundImage.uri }
                : foundComplaint.backgroundImage
            };
            setLocalComplaint(formattedComplaint);
          } else {
            console.error(`Complaint with ID ${complaintId} not found in AsyncStorage`);
          }
        } else {
          console.error("No complaints found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFromAsyncStorage();
  }, [complaintId, reduxComplaint]);

  // Use either Redux complaint or local complaint from AsyncStorage
  const complaint = reduxComplaint || localComplaint;

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const content = complaint?.subtitle || "";
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
    
  // Format date for more readable display
  const formatResponseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Render each response item
  const renderResponseItem = ({ item }: { item: Response }) => {
    return (
      <View className={`mb-4 p-4 rounded-lg ${
        item.status === "resolved" 
          ? "bg-green-50 border-l-4 border-green-500" 
          : "bg-blue-50 border-l-4 border-blue-500"
      }`}>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600 text-xs">
            {formatResponseDate(item.date)}
          </Text>
          <View className={`px-2 py-1 rounded-full ${
            item.status === "resolved" 
              ? "bg-green-100" 
              : item.status === "in-progress" 
                ? "bg-blue-100" 
                : "bg-yellow-100"
          }`}>
            <Text className={`text-xs font-medium ${
              item.status === "resolved" 
                ? "text-green-600" 
                : item.status === "in-progress" 
                  ? "text-blue-600" 
                  : "text-yellow-600"
            }`}>
              {item.status === "in-progress" 
                ? "In Progress" 
                : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text className="text-gray-800 font-medium mb-1">
          {item.responderName || "Community Leader"}
        </Text>
        
        <Text className="text-gray-700">
          {item.text}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F5F5]">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="text-gray-500 mt-4">Loading complaint details...</Text>
      </View>
    );
  }

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
        
        {/* Responses Section */}
        {complaint.responses && complaint.responses.length > 0 && (
          <View className="mb-10">
            <Text
              className="font-semibold text-[#25B14C] mb-3 p-3"
              style={{ fontSize: isMobile ? 16 : 18 }}
            >
              Leader Responses
            </Text>
            <FlatList
              data={complaint.responses}
              renderItem={renderResponseItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ComplaintDetails;
