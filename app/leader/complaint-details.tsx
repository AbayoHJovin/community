import { Feather, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ComplaintsHeaderBg from "../../assets/svg/ComplaintsHeaderBg";
import { useAppSelector } from "../../store/hooks";
import { Complaint } from "../../types/complaint";

const { width } = Dimensions.get("window");

// Sample past responses for demonstration
const samplePastResponses = [
  {
    id: 1,
    text: "We have received your complaint and are looking into it. Our team will visit the location tomorrow to assess the situation.",
    date: "2023-05-10T10:30:00",
    status: "in-progress",
  },
  {
    id: 2,
    text: "Our team has visited the location and confirmed the issue. We have scheduled repairs for next week.",
    date: "2023-05-12T14:15:00",
    status: "in-progress",
  },
];

export default function ComplaintDetails() {
  const { complaintId } = useLocalSearchParams<{ complaintId: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const { complaints, loading } = useAppSelector((state) => state.complaints);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pastResponses, setPastResponses] = useState(samplePastResponses);

  const flatListRef = useRef<FlatList>(null);

  // Ensure user is authenticated and is a leader
  useEffect(() => {
    if (!user || user.role !== "leader") {
      // Redirect to login if not a leader
      router.replace("/OnboardingFlow");
      return;
    }

    // Find the complaint with the matching ID
    if (complaints && complaintId) {
      const foundComplaint = complaints.find(
        (c) => c.id.toString() === complaintId
      );
      if (foundComplaint) {
        setComplaint(foundComplaint);

        // For demo purposes, create multiple images
        if (foundComplaint.backgroundImage) {
          // In a real app, you would use the actual images from the complaint
          // This is just for demonstration
        }
      } else {
        Alert.alert("Error", "Complaint not found");
        router.back();
      }
    }
  }, [user, complaints, complaintId]);

  const handleSubmitResponse = () => {
    if (!response.trim()) {
      Alert.alert("Error", "Please enter a response");
      return;
    }

    setSubmitting(true);

    // Simulate API call to submit response
    setTimeout(() => {
      // Add the new response to past responses
      const newResponse = {
        id: pastResponses.length + 1,
        text: response,
        date: new Date().toISOString(),
        status: "in-progress",
      };

      setPastResponses([...pastResponses, newResponse]);
      setResponse(""); // Clear the input
      setSubmitting(false);

      Alert.alert("Success", "Your response has been submitted");
    }, 1000);
  };

  // Format date for display (e.g., "1ST MAY- SAT -2:00 PM")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const weekday = date
      .toLocaleString("default", { weekday: "short" })
      .toUpperCase();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${day}${getOrdinalSuffix(
      day
    )} ${month}- ${weekday} -${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  // Helper function to get ordinal suffix for day of month
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "TH";
    switch (day % 10) {
      case 1:
        return "ST";
      case 2:
        return "ND";
      case 3:
        return "RD";
      default:
        return "TH";
    }
  };

  // Create mock images array for demonstration
  const complaintImages = complaint
    ? [
        complaint.backgroundImage,
        require("../../assets/images/complaintImage.png"),
        require("../../assets/images/userImage.png"),
      ]
    : [];

  const renderImageItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={item} style={styles.carouselImage} resizeMode="cover" />
        {index === 0 && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {complaint ? formatDate(complaint.date) : ""}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {complaintImages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeImageIndex && styles.paginationDotActive,
            ]}
            onPress={() => {
              setActiveImageIndex(index);
              flatListRef.current?.scrollToIndex({ index, animated: true });
            }}
          />
        ))}
      </View>
    );
  };

  const renderPastResponse = ({ item }: { item: any }) => {
    return (
      <View style={styles.pastResponseContainer}>
        <View style={styles.pastResponseHeader}>
          <Text style={styles.pastResponseDate}>{formatDate(item.date)}</Text>
          <View
            style={[
              styles.statusBadge,
              item.status === "resolved"
                ? styles.resolvedBadge
                : item.status === "in-progress"
                ? styles.inProgressBadge
                : styles.pendingBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === "resolved"
                  ? styles.resolvedText
                  : item.status === "in-progress"
                  ? styles.inProgressText
                  : styles.pendingText,
              ]}
            >
              {item.status === "in-progress"
                ? "In Progress"
                : item.status
                ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                : "Pending"}
            </Text>
          </View>
        </View>
        <Text style={styles.pastResponseText}>{item.text}</Text>
      </View>
    );
  };

  if (loading || !complaint) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="text-gray-500 mt-4">Loading complaint details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#25B14C" />

      {/* Green Header Background */}
      <ComplaintsHeaderBg />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-8 pb-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">
              Complaint Details
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 bg-[#F9F9F9]" style={styles.mainContent}>
          {/* Image Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={complaintImages}
              renderItem={renderImageItem}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setActiveImageIndex(newIndex);
              }}
            />
            {renderPagination()}
          </View>

          {/* Complaint Details */}
          <View className="p-4 bg-white rounded-t-3xl -mt-6">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {complaint.title}
            </Text>

            <View className="flex-row items-center mb-4">
              <View className="flex-row items-center mr-4">
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text className="text-gray-600 ml-1">{complaint.location}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text className="text-gray-600 ml-1">
                  {complaint.time || "N/A"}
                </Text>
              </View>
            </View>

            {/* Status Badge */}
            <View
              className={`self-start rounded-full px-3 py-1 mb-4 ${
                complaint.status === "resolved"
                  ? "bg-green-100"
                  : complaint.status === "in-progress"
                  ? "bg-blue-100"
                  : "bg-yellow-100"
              }`}
            >
              <Text
                className={`font-medium ${
                  complaint.status === "resolved"
                    ? "text-green-600"
                    : complaint.status === "in-progress"
                    ? "text-blue-600"
                    : "text-yellow-600"
                }`}
              >
                {complaint.status === "in-progress"
                  ? "In Progress"
                  : complaint.status
                  ? complaint.status.charAt(0).toUpperCase() +
                    complaint.status.slice(1)
                  : "Pending"}
              </Text>
            </View>

            <Text className="text-gray-800 text-base leading-6 mb-6">
              {complaint.subtitle}
            </Text>

            {/* Assigned Leader */}
            <View className="bg-gray-50 p-4 rounded-xl mb-6">
              <Text className="text-gray-600 mb-2">Assigned to:</Text>
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/images/userImage.png")}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View>
                  <Text className="font-semibold text-gray-800">
                    {complaint.leader?.name || user?.name || "You"}
                  </Text>
                  <Text className="text-gray-600">
                    {complaint.leader?.responsibilities || "Community Leader"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Past Responses Section */}
            {pastResponses.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Past Responses
                </Text>
                <FlatList
                  data={pastResponses}
                  renderItem={renderPastResponse}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
              </View>
            )}

            {/* New Response Section */}
            <View className="mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                Your Response
              </Text>
              <TextInput
                className="bg-gray-100 rounded-xl p-4 min-h-[120px] text-gray-800"
                multiline
                placeholder="Type your response here..."
                value={response}
                onChangeText={setResponse}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between mb-8">
              <TouchableOpacity
                className="bg-gray-200 rounded-full py-3 px-6 flex-1 mr-2"
                onPress={() => router.back()}
              >
                <Text className="text-center font-semibold text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#25B14C] rounded-full py-3 px-6 flex-1 ml-2"
                onPress={handleSubmitResponse}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-center font-semibold text-white">
                    Submit Response
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  carouselContainer: {
    height: 300,
    width: width,
  },
  imageContainer: {
    width: width,
    height: 300,
    position: "relative",
  },
  carouselImage: {
    width: width,
    height: 300,
  },
  dateContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dateText: {
    color: "#25B14C",
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    width: "100%",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "white",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pastResponseContainer: {
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#25B14C",
  },
  pastResponseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pastResponseDate: {
    color: "#666",
    fontSize: 12,
  },
  pastResponseText: {
    color: "#333",
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  resolvedBadge: {
    backgroundColor: "#E6F4EA",
  },
  inProgressBadge: {
    backgroundColor: "#E8F0FE",
  },
  pendingBadge: {
    backgroundColor: "#FEF7E0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  resolvedText: {
    color: "#34A853",
  },
  inProgressText: {
    color: "#4285F4",
  },
  pendingText: {
    color: "#FBBC05",
  },
});
