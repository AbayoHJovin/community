import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import DropUp from "@/components/custom/DropUp";
import ComplaintListCard from "@/components/custom/ComponentListCard";
import MenuIcon from "@/assets/svg/MenuIcon";
import { AntDesign } from "@expo/vector-icons";
import { useAppSelector } from "@/store/hooks";
import { Complaint } from "@/types/complaint";

// Define interface for filters
interface FilterState {
  categories: string[];
  date: string | null;
  location: string | null;
}

const SearchScreen = () => {
  // Use Redux store to get complaints instead of Context
  const { complaints } = useAppSelector((state) => state.complaints);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showNull, setShowNull] = useState<boolean>(false);
  const [isDropUpVisible, setDropUpVisible] = useState<boolean>(false);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    date: null,
    location: null,
  });

  // Map category IDs to category names for filtering
  const categoryMap: Record<string, string> = {
    "1": "Health",
    "2": "Security",
    "3": "Entertainment",
    "4": "Nutrition",
    "5": "Governance",
  };

  // Apply filters for searching complaints
  const applyFilters = () => {
    let filtered: Complaint[] = [...complaints];

    // Filter by search query - search in multiple fields for better results
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.subtitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          complaint.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter((complaint) => {
        // Convert IDs to category names
        const selectedCategories = filters.categories.map(
          (id) => categoryMap[id]
        );
        return selectedCategories.includes(complaint.category);
      });
    }

    // Filter by date
    if (filters.date) {
      // Handle different date filters
      const today = new Date().toDateString();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toDateString();

      if (filters.date === "Today") {
        filtered = filtered.filter((complaint) => {
          const complaintDate = new Date(complaint.date).toDateString();
          return complaintDate === today;
        });
      } else if (filters.date === "Tomorrow") {
        filtered = filtered.filter((complaint) => {
          const complaintDate = new Date(complaint.date).toDateString();
          return complaintDate === tomorrowString;
        });
      } else if (filters.date === "This week") {
        const currentWeek = getWeekNumber(new Date());
        filtered = filtered.filter((complaint) => {
          const complaintWeek = getWeekNumber(new Date(complaint.date));
          return complaintWeek === currentWeek;
        });
      } else {
        // Handle custom date
        filtered = filtered.filter((complaint) => {
          const complaintDate = new Date(complaint.date).toDateString();
          const filterDate = new Date(filters.date!).toDateString();
          return complaintDate === filterDate;
        });
      }
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((complaint) =>
        complaint.location
          .toLowerCase()
          .includes(filters.location!.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
  };

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Initialize filtered complaints with all complaints on mount
  useEffect(() => {
    setFilteredComplaints(complaints);
  }, [complaints]);

  // Apply filters whenever filters or search query change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters]);

  // Check if we have no results to show
  useEffect(() => {
    setShowNull(filteredComplaints.length === 0);
  }, [filteredComplaints]);

  return (
    <ScrollView className="bg-white min-h-screen p-5">
      {/* Header */}
      <View className="flex flex-row items-center">
        <AntDesign
          name="arrowleft"
          size={25}
          color="#3D3B3B"
          onPress={() => router.back()}
        />
        <Text className="text-[#3D3B3B] ml-2 font-semibold text-2xl">
          Search
        </Text>
      </View>

      {/* Search Input */}
      <View className="flex flex-row items-center mt-5 justify-between space-x-3">
        <TextInput
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          className="flex-1 bg-[#F8F8F8] rounded-xl h-[3rem] px-4 py-2 text-gray-600"
          placeholder="Search for any complaint"
          placeholderTextColor="#A9A9A9"
          style={styles.textInput}
        />
        <TouchableOpacity
          className="flex items-center justify-center p-3"
          onPress={() => setDropUpVisible(true)}
        >
          <MenuIcon />
        </TouchableOpacity>
      </View>

      {/* Show message when no complaints match search */}
      {showNull ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-center text-gray-600">
            No complaints match your search criteria
          </Text>
        </View>
      ) : (
        // Display filtered complaints
        filteredComplaints.map((complaint) => (
          <ComplaintListCard
            key={complaint.id}
            id={complaint.id}
            date={complaint.date}
            day={complaint.day}
            time={complaint.time}
            title={complaint.title}
            imageUri={complaint.backgroundImage}
          />
        ))
      )}

      <DropUp
        onFilterSelect={(selectedFilters) => {
          setFilters(selectedFilters);
        }}
        isModalVisible={isDropUpVisible}
        toggleModal={() => setDropUpVisible(!isDropUpVisible)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 0,
  },
});

export default SearchScreen;
