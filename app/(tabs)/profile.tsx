import InputField from "@/components/custom/InputField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser, updateUserProfile } from "@/store/slices/authSlice";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Edit profile modal state
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Language selection modal state
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // Location selection modal state
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  // Form state for edit profile
  const [formName, setFormName] = useState(user?.name || "");
  const [tempProfileImage, setTempProfileImage] = useState(
    user?.profileImage ? { uri: user.profileImage } : require("@/assets/images/userImage.png")
  );

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      setFormName(user.name);
      setTempProfileImage(user.profileImage 
        ? { uri: user.profileImage } 
        : require("@/assets/images/userImage.png"));
    }
  }, [user]);

  // Available languages
  const languages = ["English", "French", "Kinyarwanda", "Swahili"];

  // Available locations
  const locations = [
    "Kigali, Rwanda",
    "Musanze, Rwanda",
    "Rubavu, Rwanda",
    "Huye, Rwanda",
    "Nyagatare, Rwanda",
  ];

  // Function to handle profile image selection
  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setTempProfileImage({ uri: result.assets[0].uri });
    }
  };

  // Function to save profile changes
  const saveProfileChanges = () => {
    // Update user profile in Redux store
    const imageUri = tempProfileImage.uri ? tempProfileImage.uri : null;
    
    dispatch(updateUserProfile({
      name: formName,
      profileImage: imageUri,
    }));
    
    setEditModalVisible(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  // Function to select language
  const selectLanguage = (language: string) => {
    dispatch(updateUserProfile({
      language,
    }));
    setLanguageModalVisible(false);
  };

  // Function to select location
  const selectLocation = (location: string) => {
    dispatch(updateUserProfile({
      location,
    }));
    setLocationModalVisible(false);
  };

  // Function to navigate to complaints tab
  const navigateToComplaints = () => {
    router.push("/(tabs)/complaints");
  };

  // Function to handle logout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          // Dispatch logout action
          dispatch(logoutUser());
          
          // Navigate to onboarding flow
          router.replace("/OnboardingFlow");
        },
        style: "destructive",
      },
    ]);
  };

  // If user is not loaded yet, show loading screen
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className={`bg-white w-full p-5 ${
          Platform.OS === "ios" ? "pt-14" : "pt-7"
        } pb-3`}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-medium ml-5">Profile</Text>
        </View>
      </View>

      {/* Profile Info */}
      <View className="items-center mt-8">
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require("@/assets/images/userImage.png")
          }
          className="w-24 h-24 rounded-full"
        />
        <Text className="mt-4 text-xl font-bold">{user.name}</Text>
        <Text className="text-gray-500">{user.email}</Text>
        {user.role === "leader" && (
          <View className="mt-1 bg-blue-100 px-4 py-1 rounded-full">
            <Text className="text-blue-700 font-medium">{user.title || "Leader"}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setEditModalVisible(true)}
          className="mt-4 bg-[#25B14C] px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Options */}
      <View className="mt-10 px-5">
        {/* Language Option */}
        <TouchableOpacity
          onPress={() => setLanguageModalVisible(true)}
          className="flex-row items-center justify-between py-4 border-b border-gray-200"
        >
          <View className="flex-row items-center">
            <Text className="bg-gray-200 px-2 py-1 rounded">A</Text>
            <Text className="ml-4 text-lg text-gray-700">Language</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="mr-2 text-gray-500">{user.language || "English"}</Text>
            <AntDesign name="right" size={16} color="#999" />
          </View>
        </TouchableOpacity>

        {/* Location Option */}
        <TouchableOpacity
          onPress={() => setLocationModalVisible(true)}
          className="flex-row items-center justify-between py-4 border-b border-gray-200"
        >
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={24} color="#666" />
            <Text className="ml-4 text-lg text-gray-700">Location</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="mr-2 text-gray-500">{user.location || "Not set"}</Text>
            <AntDesign name="right" size={16} color="#999" />
          </View>
        </TouchableOpacity>

        {/* View Complaints Option */}
        <TouchableOpacity
          onPress={navigateToComplaints}
          className="flex-row items-center justify-between py-4 border-b border-gray-200"
        >
          <View className="flex-row items-center">
            <Ionicons name="eye-outline" size={24} color="#666" />
            <Text className="ml-4 text-lg text-gray-700">
              View your Complaints
            </Text>
          </View>
          <AntDesign name="right" size={16} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mx-5 mt-10 mb-20 bg-[#F05941] py-4 rounded-lg items-center"
      >
        <Text className="text-white font-bold text-lg">LOGOUT</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold">Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Profile Image Picker */}
            <View className="items-center mb-6">
              <View className="relative">
                <Image
                  source={tempProfileImage}
                  className="w-24 h-24 rounded-full"
                />
                <TouchableOpacity
                  onPress={pickImage}
                  className="absolute bottom-0 right-0 bg-[#25B14C] p-2 rounded-full"
                >
                  <AntDesign name="camera" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <Text className="mt-2 text-gray-500">
                Tap to change profile picture
              </Text>
            </View>

            {/* Form Fields */}
            <Text className="text-gray-700 mb-1 ml-2">Full Name</Text>
            <InputField
              placeholder="Enter your full name"
              value={formName}
              setValue={setFormName}
            />

            <Text className="text-gray-700 mb-1 ml-2 mt-4">Email</Text>
            <View className="h-[60px] w-full bg-[#F8F8F8] rounded-[50px] px-4 flex justify-center">
              <Text className="text-gray-400">
                {user.email} (Cannot be changed)
              </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={saveProfileChanges}
              className="mt-8 bg-[#25B14C] py-4 rounded-full items-center"
            >
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold">Select Language</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {languages.map((lang, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectLanguage(lang)}
                className={`py-4 px-2 border-b border-gray-100 flex-row justify-between items-center ${
                  user.language === lang ? "bg-green-50" : ""
                }`}
              >
                <Text
                  className={`text-lg ${
                    user.language === lang
                      ? "text-[#25B14C] font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {lang}
                </Text>
                {user.language === lang && (
                  <AntDesign name="check" size={20} color="#25B14C" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Location Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold">Select Location</Text>
              <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {locations.map((loc, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectLocation(loc)}
                className={`py-4 px-2 border-b border-gray-100 flex-row justify-between items-center ${
                  user.location === loc ? "bg-green-50" : ""
                }`}
              >
                <Text
                  className={`text-lg ${
                    user.location === loc
                      ? "text-[#25B14C] font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {loc}
                </Text>
                {user.location === loc && (
                  <AntDesign name="check" size={20} color="#25B14C" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
