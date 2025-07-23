import LeaderWaveBg from "@/assets/svg/LeaderWaveBg";
import { useAppSelector } from "@/store/hooks";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Complaint } from "../../types/complaint";
import { initializeTestComplaints } from "../../utils/testInitComplaintsData";

// Define extended type to include createdBy
interface ComplaintWithCreator extends Complaint {
  createdBy?: string;
}

export default function LeaderWelcomeScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const [complaints, setComplaints] = useState<ComplaintWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get complaints by status
  const pendingComplaints = complaints.filter(c => c.status === "pending");
  const inProgressComplaints = complaints.filter(c => c.status === "in-progress");
  const resolvedComplaints = complaints.filter(c => c.status === "resolved");

  // Ensure we have a user and they're a leader
  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      router.replace("/OnboardingFlow");
      return;
    }
    
    if (user.role !== "leader") {
      // Redirect to citizen home if not a leader
      router.replace("/(tabs)");
      return;
    }

    // Load complaints directly from AsyncStorage
    const loadComplaints = async () => {
      try {
        setLoading(true);
        console.log('Welcome screen: Loading complaints from AsyncStorage...');
        
        // Use the correct key "userComplaints"
        const complaintsJson = await AsyncStorage.getItem("userComplaints");
        if (complaintsJson) {
          const parsedComplaints = JSON.parse(complaintsJson);
          setComplaints(parsedComplaints);
          console.log(`Welcome screen: Loaded ${parsedComplaints.length} complaints from AsyncStorage with key "userComplaints"`);
        } else {
          // If no complaints in storage, initialize test data
          console.log('Welcome screen: No complaints found in AsyncStorage, initializing test data...');
          const testComplaints = await initializeTestComplaints();
          setComplaints(testComplaints);
          console.log(`Welcome screen: Initialized ${testComplaints.length} test complaints`);
        }
      } catch (err) {
        console.error("Welcome screen: Error loading complaints from AsyncStorage:", err);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();

    // Automatically navigate to complaints screen after a short delay
    const timer = setTimeout(() => {
      router.replace("/leader/complaints");
    }, 2000); // Increased timeout to give user time to see welcome screen

    return () => clearTimeout(timer);
  }, [user]);

  const handleStart = () => {
    // Navigate to complaints screen
    router.replace("/leader/complaints");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="text-gray-500 mt-4">Loading complaints...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Background Wave */}
      <LeaderWaveBg />

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Image Section */}
        <View className="items-center justify-center mt-10 mb-6">
          <Image
            source={require("../../assets/images/chattingRemotely.png")}
            className="w-[300px] h-[300px]"
            resizeMode="contain"
          />
        </View>

        {/* Text Content - This will be positioned over the green background */}
        <View className="flex-1 justify-end mb-20">
          <Text className="text-white text-4xl font-bold text-center mb-2">
            Welcome, {user?.name?.split(' ')[0] || 'Leader'}
          </Text>
          <Text className="text-white text-2xl font-bold text-center mb-6">
            {complaints.length > 0 
              ? `${complaints.length} complaints in the system`
              : "No complaints available yet"}
          </Text>

          <View className="flex-row justify-center mb-8">
            <View className="bg-white/20 rounded-xl px-4 py-3 mr-3 min-w-[80px]">
              <Text className="text-white text-center text-2xl font-bold">
                {pendingComplaints.length}
              </Text>
              <Text className="text-white text-center text-sm">
                Pending
              </Text>
            </View>
            
            <View className="bg-white/20 rounded-xl px-4 py-3 mr-3 min-w-[80px]">
              <Text className="text-white text-center text-2xl font-bold">
                {inProgressComplaints.length}
              </Text>
              <Text className="text-white text-center text-sm">
                In Progress
              </Text>
            </View>
            
            <View className="bg-white/20 rounded-xl px-4 py-3 min-w-[80px]">
              <Text className="text-white text-center text-2xl font-bold">
                {resolvedComplaints.length}
              </Text>
              <Text className="text-white text-center text-sm">
                Resolved
              </Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleStart}
            className="bg-white rounded-full py-4 px-8 mx-10 flex-row items-center justify-center"
          >
            <Text className="text-[#25B14C] text-lg font-semibold mr-2">
              View Complaints
            </Text>
            <AntDesign name="arrowright" size={20} color="#25B14C" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
