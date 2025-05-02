import React, { ReactSVGElement, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-date-picker"; // Add this library
import HealthLogo from "@/assets/svg/HealthLogo";

const categories = [
  { id: "1", name: "Health", icon: <HealthLogo/> },
  { id: "2", name: "Security", icon: "shield-checkmark" },
  { id: "3", name: "Entertainment", icon: "md-musical-notes" },
  { id: "4", name: "Nutrition", icon: "md-restaurant" },
  { id: "5", name: "Governance", icon: "business" },
];

interface FilterProps {
  onFilterSelect: (filters: any) => void;
  isModalVisible: boolean;
  toggleModal: () => void;
}

const DropUp: React.FC<FilterProps> = ({
  onFilterSelect,
  isModalVisible,
  toggleModal,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("Kigali, Rwanda");
  const [isCalendarVisible, setCalendarVisible] = useState(false); // Calendar visibility
  const [customDate, setCustomDate] = useState<Date | null>(null); // Selected custom date

  const handleCategoryPress = (id: string) => {
    if (selectedCategories.includes(id)) {
      const updatedCategories = selectedCategories.filter(
        (category) => category !== id
      );
      setSelectedCategories(updatedCategories);
      onFilterSelect({ categories: updatedCategories, date: selectedDate, location });
    } else {
      const updatedCategories = [...selectedCategories, id];
      setSelectedCategories(updatedCategories);
      onFilterSelect({ categories: updatedCategories, date: selectedDate, location });
    }
  };

  const handleDatePress = (date: string) => {
    setSelectedDate((prevDate) => (prevDate === date ? null : date)); // Toggle selection
    onFilterSelect({
      categories: selectedCategories,
      date: selectedDate === date ? null : date, // Deselect if clicked again
      location,
    });
  };

  const handleCustomDateSelect = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date
    setCustomDate(date);
    setSelectedDate(formattedDate);
    onFilterSelect({ categories: selectedCategories, date: formattedDate, location });
    setCalendarVisible(false); // Close calendar
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedDate(null);
    setCustomDate(null);
    setLocation("Kigali, Rwanda");
    onFilterSelect({ categories: [], date: null, location: "Kigali, Rwanda" });
    toggleModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={toggleModal}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          justifyContent: "flex-end",
        }}
        onPress={toggleModal}
      >
        <TouchableWithoutFeedback>
          <View className="bg-white rounded-t-3xl py-6 px-6">
            <Text className="text-center text-xl font-bold mb-4">Filter</Text>

            <Text className="text-lg font-semibold mb-3">Categories</Text>
            <FlatList
              data={categories}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 rounded-full border ${
                    selectedCategories.includes(item.id)
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                  onPress={() => handleCategoryPress(item.id)}
                >
                  {/* <Ionicons
                    name={item.icon as ReactSVGElement}
                    size={24}
                    color={
                      selectedCategories.includes(item.id) ? "white" : "gray"
                    }
                  /> */}
                  {item.icon}
                  <Text
                    className={`text-center mt-2 ${
                      selectedCategories.includes(item.id)
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text className="text-lg font-semibold mt-6 mb-3">Time & Date</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${
                  selectedDate === "Today"
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                } mx-1`}
                onPress={() => handleDatePress("Today")}
              >
                <Text
                  className={`text-center ${
                    selectedDate === "Today" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${
                  selectedDate === "Tomorrow"
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                } mx-1`}
                onPress={() => handleDatePress("Tomorrow")}
              >
                <Text
                  className={`text-center ${
                    selectedDate === "Tomorrow"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  Tomorrow
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${
                  selectedDate === "This week"
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                } mx-1`}
                onPress={() => handleDatePress("This week")}
              >
                <Text
                  className={`text-center ${
                    selectedDate === "This week"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  This week
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="flex-row items-center mt-4 border border-gray-300 rounded-lg p-3"
              onPress={() => setCalendarVisible(true)} // Show calendar
            >
              <Ionicons name="calendar" size={20} color="gray" />
              <Text className="text-gray-700 ml-2">Choose from calendar</Text>
            </TouchableOpacity>

            <DatePicker
              modal
              open={isCalendarVisible}
              date={customDate || new Date()}
              onConfirm={(date) => handleCustomDateSelect(date)}
              onCancel={() => setCalendarVisible(false)}
            />

            {/* Location */}
            <Text className="text-lg font-semibold mt-6 mb-3">Location</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg p-3">
              <Ionicons name="location-outline" size={20} color="gray" />
              <TextInput
                value={location}
                onChangeText={(text) => setLocation(text)}
                className="flex-1 ml-2 text-gray-700"
                placeholder="Enter location"
              />
            </View>

            {/* Buttons */}
            <View className="flex-row justify-between mt-8">
              <Pressable
                className="flex-1 bg-red-500 rounded-lg p-3 mx-1"
                onPress={resetFilters}
              >
                <Text className="text-center text-white font-semibold">
                  Reset
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-green-500 rounded-lg p-3 mx-1"
                onPress={() => {
                  onFilterSelect({
                    categories: selectedCategories,
                    date: selectedDate,
                    location,
                  });
                  toggleModal();
                }}
              >
                <Text className="text-center text-white font-semibold">
                  Search
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

export default DropUp;