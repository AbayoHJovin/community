import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Screen width for responsive sizing
const { width: screenWidth } = Dimensions.get("window");

// Maximum allowed images
const MAX_IMAGES = 5;

// Helper for date picker
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function AddComplaintScreen() {
  // Step management
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Image selection state
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Form details state
  const [activeTab, setActiveTab] = useState<string>("Title");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [date, setDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<{day: number, month: number, year: number}>({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  
  const [location, setLocation] = useState<string>("Kigali, Rwanda");

  // Custom alert state
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"error" | "success" | "warning">(
    "error"
  );

  // Animation value for alert
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "Choose from calendar";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate arrays for date picker
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i);
    }
    return years;
  };

  const getDays = () => {
    const daysInMonth = new Date(tempDate.year, tempDate.month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // Handle date selection
  const openDatePicker = () => {
    if (date) {
      // Initialize with the selected date
      setTempDate({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    } else {
      // Initialize with today's date
      const today = new Date();
      setTempDate({
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear()
      });
    }
    setShowDatePicker(true);
  };

  const confirmDateSelection = () => {
    const newDate = new Date(tempDate.year, tempDate.month, tempDate.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate > today) {
      showCustomAlert("Please select a date that is not in the future", "warning");
      return;
    }

    setDate(newDate);
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  // Show custom styled alert
  const showCustomAlert = (
    message: string,
    type: "error" | "success" | "warning" = "error"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowAlert(false);
      });
    }, 3000);
  };

  // Image picker functions
  const pickImage = async () => {
    // Check if already at maximum images
    if (selectedImages.length >= MAX_IMAGES) {
      showCustomAlert(
        `You can only select up to ${MAX_IMAGES} images`,
        "warning"
      );
      return;
    }

    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showCustomAlert(
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Calculate how many more images we can add
      const remainingSlots = MAX_IMAGES - selectedImages.length;

      // Only add up to the maximum allowed
      const newImages = result.assets.slice(0, remainingSlots);

      setSelectedImages([
        ...selectedImages,
        ...newImages.map((asset) => asset.uri),
      ]);

      // If we had to limit the selection, show a message
      if (result.assets.length > remainingSlots) {
        showCustomAlert(
          `Only added ${remainingSlots} images. Maximum of ${MAX_IMAGES} reached.`,
          "warning"
        );
      }
    }
  };

  const takePhoto = async () => {
    // Check if already at maximum images
    if (selectedImages.length >= MAX_IMAGES) {
      showCustomAlert(
        `You can only select up to ${MAX_IMAGES} images`,
        "warning"
      );
      return;
    }

    // Ask for camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      showCustomAlert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  // Navigation functions
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const goToNextStep = () => {
    if (selectedImages.length === 0) {
      showCustomAlert("Please select at least one image");
      return;
    }
    setCurrentStep(2);
  };

  const submitComplaint = () => {
    // Validation
    if (!title.trim()) {
      showCustomAlert("Please enter a title for your complaint");
      setActiveTab("Title");
      return;
    }

    if (!description.trim()) {
      showCustomAlert("Please enter a description for your complaint");
      setActiveTab("Description");
      return;
    }

    if (!date) {
      showCustomAlert("Please select a date for your complaint");
      setActiveTab("others");
      return;
    }

    // Submit complaint - In a real app, you would send data to a server here
    Alert.alert("Success", "Your complaint has been submitted successfully!", [
      {
        text: "OK",
        onPress: () => router.push("/(tabs)"),
      },
    ]);
  };

  // First step - Image selection screen
  const renderImageSelectionStep = () => {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View
          className={`flex-row items-center px-4 bg-[#3D3B3B] ${
            Platform.OS === "ios" ? "pt-14" : "pt-7"
          } pb-3`}
        >
          <TouchableOpacity onPress={goBack} className="p-2">
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-medium ml-5 text-white">
            Add new complaint
          </Text>
        </View>

        {/* Main Image Display */}
        <View className="w-full h-[400px] bg-gray-100 justify-center items-center relative">
          {selectedImages.length > 0 ? (
            <>
              <Image
                source={{ uri: selectedImages[selectedImageIndex] }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => removeImage(selectedImageIndex)}
                className="absolute top-2.5 right-2.5 bg-red-600/70 rounded-full p-2"
              >
                <AntDesign name="delete" size={24} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center justify-center">
              <AntDesign name="picture" size={50} color="#ccc" />
              <Text className="mt-2.5 text-gray-500">No image selected</Text>
            </View>
          )}
        </View>

        {/* Image Counter */}
        <View className="flex-row justify-end px-4 py-2">
          <Text className="text-sm text-gray-600">
            {selectedImages.length} / {MAX_IMAGES} images
          </Text>
        </View>

        {/* Recent Photos Label */}
        <View className="flex-row items-center px-4 py-2.5">
          <Text className="text-base font-medium mr-1">Recent</Text>
          <AntDesign name="down" size={16} color="black" />
        </View>

        {/* Thumbnails Scroll View */}
        <ScrollView
          horizontal
          className="px-3 py-2.5"
          showsHorizontalScrollIndicator={false}
        >
          {selectedImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImageIndex(index)}
              className={`w-20 h-20 mx-1 rounded overflow-hidden border-2 ${
                selectedImageIndex === index
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Photo Action Buttons */}
        <View className="flex-row justify-center items-center my-5 gap-5">
          <TouchableOpacity
            onPress={takePhoto}
            className={`w-[60px] h-[60px] rounded-full justify-center items-center shadow-md ${
              selectedImages.length >= MAX_IMAGES
                ? "bg-gray-400"
                : "bg-green-500"
            }`}
            disabled={selectedImages.length >= MAX_IMAGES}
          >
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImage}
            className={`w-[60px] h-[60px] rounded-full justify-center items-center shadow-md ${
              selectedImages.length >= MAX_IMAGES
                ? "bg-gray-400"
                : "bg-green-500"
            }`}
            disabled={selectedImages.length >= MAX_IMAGES}
          >
            <Ionicons name="images" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={goToNextStep}
          className="absolute bottom-[30px] right-5 bg-green-500 py-3 px-7 rounded-full shadow-md"
        >
          <Text className="text-white text-base font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Second step - Details screen with tabs
  const renderComplaintDetailsStep = () => {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View
          className={`flex-row items-center px-4 bg-[#3D3B3B] ${
            Platform.OS === "ios" ? "pt-14" : "pt-7"
          } pb-3`}
        >
          <TouchableOpacity onPress={goBack} className="p-2">
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-medium ml-5 text-white">
            Add new complaint
          </Text>
        </View>

        {/* Selected Image Display */}
        <View className="w-full h-[200px] bg-gray-100 relative">
          {selectedImages.length > 0 ? (
            <>
              <Image
                source={{ uri: selectedImages[selectedImageIndex] }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => removeImage(selectedImageIndex)}
                className="absolute top-2.5 right-2.5 bg-red-600/70 rounded-full p-2"
              >
                <AntDesign name="delete" size={24} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <AntDesign name="picture" size={30} color="#ccc" />
            </View>
          )}
        </View>

        {/* Image thumbnails for scrolling horizontally */}
        {selectedImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-1 px-2.5 mb-0"
          >
            {selectedImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                className={`w-[50px] h-[50px] mx-1 rounded overflow-hidden border-2 ${
                  selectedImageIndex === index
                    ? "border-green-500"
                    : "border-transparent"
                }`}
              >
                <Image
                  source={{ uri: image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Tab Navigation */}
        <View
          className={`flex-row px-5 justify-between ${
            selectedImages.length > 1 ? "-mt-1" : "mt-2"
          } mb-2.5`}
        >
          <TouchableOpacity
            className={`py-2.5 px-5 rounded-full ${
              activeTab === "Title" ? "bg-green-500" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("Title")}
          >
            <Text
              className={`text-base ${
                activeTab === "Title"
                  ? "text-white font-medium"
                  : "text-green-500"
              }`}
            >
              Title
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2.5 px-5 rounded-full ${
              activeTab === "Description" ? "bg-green-500" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("Description")}
          >
            <Text
              className={`text-base ${
                activeTab === "Description"
                  ? "text-white font-medium"
                  : "text-green-500"
              }`}
            >
              Description
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2.5 px-5 rounded-full ${
              activeTab === "others" ? "bg-green-500" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("others")}
          >
            <Text
              className={`text-base ${
                activeTab === "others"
                  ? "text-white font-medium"
                  : "text-green-500"
              }`}
            >
              others
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView className="flex-1 px-5 pb-24">
          {activeTab === "Title" && (
            <View className="mt-2.5">
              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-base"
                placeholder="Enter the title of your complaint"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
              />
            </View>
          )}

          {activeTab === "Description" && (
            <View className="mt-2.5">
              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-base h-[150px]"
                placeholder="Enter the description of your complaint"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            </View>
          )}

          {activeTab === "others" && (
            <View className="mt-2.5">
              <View className="mb-5">
                <Text className="text-base mb-2 text-gray-700">Date</Text>
                <TouchableOpacity 
                  className="border border-gray-300 rounded-lg p-4"
                  onPress={openDatePicker}
                >
                  <Text className={date ? "text-gray-700" : "text-gray-500"}>
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
                
                {/* Custom Date Picker Modal */}
                <Modal
                  visible={showDatePicker}
                  transparent={true}
                  animationType="slide"
                >
                  <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-xl p-4">
                      <View className="flex-row justify-between mb-4">
                        <TouchableOpacity onPress={cancelDateSelection}>
                          <Text className="text-blue-500 text-base">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmDateSelection}>
                          <Text className="text-blue-500 text-base font-bold">Done</Text>
                        </TouchableOpacity>
                      </View>
                      
                      {/* Date Picker Controls */}
                      <View className="flex-row justify-between mb-5">
                        {/* Day Picker */}
                        <View className="flex-1 mr-2">
                          <Text className="text-gray-500 mb-2 text-center">Day</Text>
                          <ScrollView className="h-40 border border-gray-200 rounded-lg">
                            {getDays().map((day) => (
                              <TouchableOpacity 
                                key={`day-${day}`}
                                className={`py-2 px-4 ${tempDate.day === day ? 'bg-green-100' : ''}`}
                                onPress={() => setTempDate({...tempDate, day})}
                              >
                                <Text 
                                  className={`text-center ${tempDate.day === day ? 'font-bold text-green-600' : ''}`}
                                >
                                  {day}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                        
                        {/* Month Picker */}
                        <View className="flex-1 mr-2">
                          <Text className="text-gray-500 mb-2 text-center">Month</Text>
                          <ScrollView className="h-40 border border-gray-200 rounded-lg">
                            {MONTHS.map((month, index) => (
                              <TouchableOpacity 
                                key={`month-${index}`}
                                className={`py-2 px-4 ${tempDate.month === index ? 'bg-green-100' : ''}`}
                                onPress={() => setTempDate({...tempDate, month: index})}
                              >
                                <Text 
                                  className={`text-center ${tempDate.month === index ? 'font-bold text-green-600' : ''}`}
                                >
                                  {month}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                        
                        {/* Year Picker */}
                        <View className="flex-1">
                          <Text className="text-gray-500 mb-2 text-center">Year</Text>
                          <ScrollView className="h-40 border border-gray-200 rounded-lg">
                            {getYears().map((year) => (
                              <TouchableOpacity 
                                key={`year-${year}`}
                                className={`py-2 px-4 ${tempDate.year === year ? 'bg-green-100' : ''}`}
                                onPress={() => setTempDate({...tempDate, year})}
                              >
                                <Text 
                                  className={`text-center ${tempDate.year === year ? 'font-bold text-green-600' : ''}`}
                                >
                                  {year}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </View>
                      
                      {/* Preview */}
                      <View className="border-t border-gray-200 pt-3">
                        <Text className="text-center text-gray-700">
                          {MONTHS[tempDate.month]} {tempDate.day}, {tempDate.year}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>

              <View className="mb-5">
                <Text className="text-base mb-2 text-gray-700">Location</Text>
                <TouchableOpacity className="border border-gray-300 rounded-lg p-4">
                  <Text className="text-gray-700">{location}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Submit Button */}
        <View className="absolute bottom-5 right-5 z-10">
          <TouchableOpacity
            className="bg-green-500 py-3 px-7 rounded-md shadow-md"
            onPress={submitComplaint}
          >
            <Text className="text-white text-base font-bold">POST</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Custom Alert Component
  const renderCustomAlert = () => {
    const alertBgColor =
      alertType === "error"
        ? "bg-red-500"
        : alertType === "success"
        ? "bg-green-500"
        : "bg-orange-500"; // warning

    return (
      showAlert && (
        <Animated.View
          className={`absolute bottom-[100px] left-5 right-5 ${alertBgColor} rounded-lg p-4 flex-row items-center shadow-lg`}
          style={{ opacity: fadeAnim }}
        >
          <View className="mr-2.5">
            {alertType === "error" && (
              <Ionicons name="alert-circle" size={24} color="white" />
            )}
            {alertType === "success" && (
              <Ionicons name="checkmark-circle" size={24} color="white" />
            )}
            {alertType === "warning" && (
              <Ionicons name="warning" size={24} color="white" />
            )}
          </View>
          <Text className="text-white text-sm flex-1">{alertMessage}</Text>
        </Animated.View>
      )
    );
  };

  // Render the appropriate step
  return (
    <>
      {currentStep === 1
        ? renderImageSelectionStep()
        : renderComplaintDetailsStep()}
      {renderCustomAlert()}
    </>
  );
}
