import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-date-picker";

// Define icon types for type safety
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface FilterProps {
  onFilterSelect: (filters: any) => void;
  isModalVisible: boolean;
  toggleModal: () => void;
}

// Define filter state interface
interface FilterState {
  categories: string[];
  date: string | null;
  location: string | null;
}

// Category interface
interface Category {
  id: string;
  name: string;
  icon: IoniconName;
}

const DropUp: React.FC<FilterProps> = ({
  onFilterSelect,
  isModalVisible,
  toggleModal,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("Kigali, Rwanda");
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [customDate, setCustomDate] = useState<Date | null>(null);

  // Categories with icons
  const categories: Category[] = [
    { id: "1", name: "Health", icon: "camera" },
    { id: "2", name: "Security", icon: "shield" },
    { id: "3", name: "Entertainment", icon: "musical-notes" },
    { id: "4", name: "Nutrition", icon: "restaurant" },
    { id: "5", name: "Governance", icon: "business" },
  ];

  const handleCategoryPress = (id: string) => {
    const newSelected = selectedCategories.includes(id)
      ? selectedCategories.filter((catId) => catId !== id)
      : [...selectedCategories, id];

    setSelectedCategories(newSelected);
    updateFilters(newSelected, selectedDate, location);
  };

  const handleDatePress = (date: string) => {
    const newDateValue = selectedDate === date ? null : date;
    setSelectedDate(newDateValue);
    updateFilters(selectedCategories, newDateValue, location);
  };

  const handleCustomDateSelect = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setCustomDate(date);
    setSelectedDate(formattedDate);
    updateFilters(selectedCategories, formattedDate, location);
    setCalendarVisible(false);
  };

  const updateFilters = (
    categories: string[],
    date: string | null,
    location: string | null
  ) => {
    const filters: FilterState = { categories, date, location };
    onFilterSelect(filters);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedDate(null);
    setCustomDate(null);
    setLocation("Kigali, Rwanda");
    updateFilters([], null, "Kigali, Rwanda");
  };

  const applyFilters = () => {
    updateFilters(selectedCategories, selectedDate, location);
    toggleModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={toggleModal}
    >
      <Pressable style={styles.backdrop} onPress={toggleModal}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.handle} />

            <Text style={styles.title}>Filter</Text>

            {/* Categories */}
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContainer}
            >
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.categoryButton]}
                  onPress={() => handleCategoryPress(item.id)}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      selectedCategories.includes(item.id) &&
                        styles.selectedIconContainer,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={
                        selectedCategories.includes(item.id) ? "#fff" : "#666"
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategories.includes(item.id) &&
                        styles.selectedCategoryText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time & Date */}
            <Text style={styles.sectionTitle}>Time & Date</Text>
            <View style={styles.dateButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  selectedDate === "Today" && styles.selectedDateButton,
                ]}
                onPress={() => handleDatePress("Today")}
              >
                <Text
                  style={[
                    styles.dateButtonText,
                    selectedDate === "Today" && styles.selectedDateButtonText,
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateButton,
                  selectedDate === "Yesterday" && styles.selectedDateButton,
                ]}
                onPress={() => handleDatePress("Yesterday")}
              >
                <Text
                  style={[
                    styles.dateButtonText,
                    selectedDate === "Yesterday" &&
                      styles.selectedDateButtonText,
                  ]}
                >
                  Yesterday
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateButton,
                  selectedDate === "This week" && styles.selectedDateButton,
                ]}
                onPress={() => handleDatePress("This week")}
              >
                <Text
                  style={[
                    styles.dateButtonText,
                    selectedDate === "This week" &&
                      styles.selectedDateButtonText,
                  ]}
                >
                  This week
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calendar picker */}
            <TouchableOpacity
              style={styles.calendarButton}
              onPress={() => setCalendarVisible(true)}
            >
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.calendarButtonText}>
                Choose from calendar
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color="#666"
                style={styles.calendarIcon}
              />
            </TouchableOpacity>

            {/* Date picker */}
            <DatePicker
              modal
              open={isCalendarVisible}
              date={customDate || new Date()}
              onConfirm={handleCustomDateSelect}
              onCancel={() => setCalendarVisible(false)}
              mode="date"
            />

            {/* Location */}
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#25B14C" />
              <Text style={styles.locationText}>{location}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color="#666"
                style={styles.forwardIcon}
              />
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetFilters}
              >
                <Text style={styles.cancelButtonText}>cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.searchButton}
                onPress={applyFilters}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  categoryScrollContainer: {
    paddingBottom: 12,
    paddingRight: 20,
    marginBottom: 24,
  },
  categoryButton: {
    alignItems: "center",
    marginRight: 30,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedIconContainer: {
    backgroundColor: "#25B14C",
    borderColor: "#25B14C",
  },
  categoryText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: "#333",
    fontWeight: "500",
  },
  dateButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedDateButton: {
    backgroundColor: "#25B14C",
    borderColor: "#25B14C",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDateButtonText: {
    color: "white",
    fontWeight: "500",
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 24,
  },
  calendarButtonText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  calendarIcon: {
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 24,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  forwardIcon: {
    alignSelf: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  searchButton: {
    flex: 1,
    backgroundColor: "#25B14C",
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default DropUp;
