/* eslint-disable @typescript-eslint/no-unused-vars */
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ComplaintsHeaderBg from "../../assets/svg/ComplaintsHeaderBg";
import { useAppSelector } from "../../store/hooks";
import { Complaint } from "../../types/complaint";
import { initializeTestComplaints } from "../../utils/testInitComplaintsData";

// Define extended type to include createdBy
interface ComplaintWithCreator extends Complaint {
  createdBy?: string;
}

export default function LeaderComplaints() {
  const { user } = useAppSelector((state) => state.auth);
  const [complaints, setComplaints] = useState<ComplaintWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState("complaints");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default to newest first

  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  // Ensure user is authenticated and fetch complaints directly from AsyncStorage
  useEffect(() => {
    if (!user || user.role !== "leader") {
      // Redirect to login if not a leader
      router.replace("/OnboardingFlow");
      return;
    }

    // Load complaints directly from AsyncStorage - use the correct key "userComplaints"
    const loadComplaints = async () => {
      try {
        setLoading(true);
        console.log('Loading complaints from AsyncStorage for leader view...');
        
        // Try the correct key "userComplaints" first
        const complaintsJson = await AsyncStorage.getItem("userComplaints");
        if (complaintsJson) {
          const parsedComplaints = JSON.parse(complaintsJson);
          setComplaints(parsedComplaints);
          console.log(`Leader view: Successfully loaded ${parsedComplaints.length} complaints from AsyncStorage with key "userComplaints"`);
        } else {
          // If no complaints found, initialize test data
          console.log('No complaints found in AsyncStorage with key "userComplaints", initializing test data...');
          
          // Use the test utility to initialize test data
          const testComplaints = await initializeTestComplaints();
          setComplaints(testComplaints);
          console.log(`Initialized ${testComplaints.length} test complaints`);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading complaints from AsyncStorage:", err);
        setError("Failed to load complaints");
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, [user]);

  // Animate dropdown
  useEffect(() => {
    Animated.timing(dropdownAnimation, {
      toValue: sortDropdownVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [sortDropdownVisible,dropdownAnimation]);

  // Filter and sort complaints based on search, category, and status only
  const filteredComplaints = complaints
    ? complaints
        .filter((complaint) => {
          // Search filter
          const matchesSearch =
            searchQuery === "" ||
            complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (complaint.subtitle &&
              complaint.subtitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (complaint.location &&
              complaint.location
                .toLowerCase()
                .includes(searchQuery.toLowerCase()));

          // Category filter
          const matchesCategory =
            selectedCategory === "All" ||
            complaint.category === selectedCategory;

          // Status filter
          let matchesStatus = true;
          if (selectedStatus !== "All") {
            const status = complaint.status || "pending"; // Default to pending if no status
            const normalizedSelectedStatus =
              selectedStatus === "In Progress"
                ? "in-progress"
                : selectedStatus.toLowerCase();
            matchesStatus = status.toLowerCase() === normalizedSelectedStatus;
          }

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          );
        })
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        })
    : [];

  // Group complaints by recency
  const recentComplaints = filteredComplaints.filter((c) => {
    const complaintDate = new Date(c.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - complaintDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Within a week
  });

  const olderComplaints = filteredComplaints.filter((c) => {
    const complaintDate = new Date(c.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - complaintDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7 && diffDays <= 90; // Between a week and 3 months
  });

  const oldestComplaints = filteredComplaints.filter((c) => {
    const complaintDate = new Date(c.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - complaintDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 90; // Older than 3 months
  });

  const navigateToComplaintDetails = (complaintId: number) => {
    router.push({
      pathname: "/leader/complaint-details",
      params: { complaintId },
    });
  };

  const navigateToProfile = () => {
    router.push("/leader/profile");
  };

  const toggleSortDropdown = () => {
    setSortDropdownVisible(!sortDropdownVisible);
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setSortDropdownVisible(false);
  };

  const renderComplaintItem = ({ item }: { item: ComplaintWithCreator }) => {
    // Format date for display (e.g., "1ST MAY- SAT -2:00 PM")
    const date = new Date(item.date);
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
    const formattedDate = `${day}${getOrdinalSuffix(
      day
    )} ${month}- ${weekday} -${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;

  return (
      <TouchableOpacity
        className="bg-white rounded-3xl shadow-sm p-4 mb-4 mx-4"
        onPress={() => navigateToComplaintDetails(item.id)}
        style={styles.complaintCard}
      >
        <View className="flex-row">
          <Image
            source={item.backgroundImage}
            className="w-24 h-24 rounded-2xl mr-3"
          />
          <View className="flex-1">
            <Text className="text-[#25B14C] text-base font-medium mb-1">
              {formattedDate}
            </Text>
            <Text
              className="text-gray-800 text-lg font-semibold"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <View className="mt-1">
              <Text className="text-xs text-gray-500">
                Location: {item.location}
              </Text>
              <Text className="text-xs text-gray-500">
                Created by: {item.createdBy || item.userId || "Anonymous"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
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

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="text-gray-500 mt-4">Loading user data...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="text-gray-500 mt-4">Loading complaints...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity 
          className="bg-[#25B14C] px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#25B14C" />

      <ComplaintsHeaderBg />

      <SafeAreaView className="flex-1">
        <View className="px-4 pt-8 pb-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-3xl font-bold">
              All Complaints
            </Text>
          </View>
          <TouchableOpacity onPress={toggleSortDropdown}>
            <Feather name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Sort Dropdown */}
        <Modal
          transparent={true}
          visible={sortDropdownVisible}
          animationType="none"
          onRequestClose={() => setSortDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSortDropdownVisible(false)}
          >
            <Animated.View
              style={[
                styles.dropdown,
                {
                  opacity: dropdownAnimation,
                  transform: [
                    {
                      translateY: dropdownAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSortChange("desc")}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    sortOrder === "desc" && styles.activeDropdownText,
                  ]}
                >
                  Newest First
                </Text>
                {sortOrder === "desc" && (
                  <Feather name="check" size={18} color="#25B14C" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSortChange("asc")}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    sortOrder === "asc" && styles.activeDropdownText,
                  ]}
                >
                  Oldest First
                </Text>
                {sortOrder === "asc" && (
                  <Feather name="check" size={18} color="#25B14C" />
                )}
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {/* Tabs Container */}
        <View style={styles.tabsWrapper}>
          <View className="rounded-md p-1 flex-row" style={styles.tabContainer}>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${
                activeTab === "complaints" ? "bg-[#25B14C]" : "bg-white"
              }`}
              style={
                activeTab === "complaints"
                  ? styles.activeTab
                  : styles.inactiveTab
              }
              onPress={() => setActiveTab("complaints")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "complaints" ? "text-white" : "text-[#25B14C]"
                }`}
              >
                Complaints
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${
                activeTab === "profile" ? "bg-[#25B14C]" : "bg-white"
              }`}
              style={
                activeTab === "profile" ? styles.activeTab : styles.inactiveTab
              }
              onPress={() => navigateToProfile()}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "profile" ? "text-white" : "text-[#25B14C]"
                }`}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-1 bg-[#F9F9F9]" style={styles.mainContent}>
          {activeTab === "complaints" && (
            <>
              <Text className="text-2xl font-bold text-gray-800 mb-4 px-4 mt-4">
                All Complaints ({complaints.length})
              </Text>

              <FlatList
                data={[
                  { title: "Recently added", data: recentComplaints },
                  { title: "3 months ago", data: olderComplaints },
                  { title: "Older", data: oldestComplaints },
                ]}
                renderItem={({ item }) =>
                  item.data.length > 0 ? (
                    <View className="mb-6">
                      <Text className="text-gray-700 font-medium text-lg mb-2 px-4">
                        {item.title}
                      </Text>
                      <FlatList
                        data={item.data}
                        renderItem={renderComplaintItem}
                        keyExtractor={(complaint) => complaint.id.toString()}
                        scrollEnabled={false}
                      />
                    </View>
                  ) : null
                }
                keyExtractor={(item) => item.title}
                ListEmptyComponent={
                  <View className="flex-1 justify-center items-center py-8">
                    <Text className="text-gray-500">
                      No complaints available
                    </Text>
                  </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
    width: "100%",
    marginBottom: 20,
    zIndex: 1,
  },
  tabContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeTab: {
    backgroundColor: "#25B14C",
  },
  inactiveTab: {
    backgroundColor: "white",
  },
  mainContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    marginTop: -10,
  },
  complaintCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  dropdown: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  activeDropdownText: {
    color: "#25B14C",
    fontWeight: "bold",
  },
});
