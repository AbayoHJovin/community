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
  const [activeFilters, setActiveFilters] = useState<boolean>(false);

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
    // Start with all complaints
    let filtered: Complaint[] = [...complaints];

    // Check if any filters are active
    const hasActiveCategories = filters.categories.length > 0;
    const hasActiveDate = filters.date !== null;
    const hasActiveLocation =
      filters.location !== null && filters.location !== "Kigali, Rwanda";
    const hasActiveSearch = searchQuery.trim().length > 0;

    // Set active filters status for UI feedback
    setActiveFilters(hasActiveCategories || hasActiveDate || hasActiveLocation);

    // Filter by search query - search in multiple fields for better results
    if (hasActiveSearch) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(query) ||
          complaint.subtitle.toLowerCase().includes(query) ||
          complaint.location.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (hasActiveCategories) {
      filtered = filtered.filter((complaint) => {
        // Convert IDs to category names
        const selectedCategories = filters.categories.map(
          (id) => categoryMap[id]
        );
        return selectedCategories.includes(complaint.category);
      });
    }

    // Filter by date
    if (hasActiveDate) {
      // Handle different date filters
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayString = today.toDateString();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const yesterdayString = yesterday.toDateString();

      if (filters.date === "Today") {
        filtered = filtered.filter((complaint) => {
          const complaintDate = new Date(complaint.date);
          complaintDate.setHours(0, 0, 0, 0);
          return complaintDate.toDateString() === todayString;
        });
      } else if (filters.date === "Yesterday") {
        filtered = filtered.filter((complaint) => {
          const complaintDate = new Date(complaint.date);
          complaintDate.setHours(0, 0, 0, 0);
          return complaintDate.toDateString() === yesterdayString;
        });
      } else if (filters.date === "This week") {
        const currentWeek = getWeekNumber(new Date());
        filtered = filtered.filter((complaint) => {
          const complaintWeek = getWeekNumber(new Date(complaint.date));
          return complaintWeek === currentWeek;
        });
      } else {
        // Handle custom date
        try {
          const filterDate = new Date(filters.date!);
          filterDate.setHours(0, 0, 0, 0);
          const filterDateString = filterDate.toDateString();

          filtered = filtered.filter((complaint) => {
            const complaintDate = new Date(complaint.date);
            complaintDate.setHours(0, 0, 0, 0);
            return complaintDate.toDateString() === filterDateString;
          });
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }
    }

    // Filter by location
    if (hasActiveLocation) {
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

  // Reset all filters
  const resetAllFilters = () => {
    setFilters({
      categories: [],
      date: null,
      location: null,
    });
    setSearchQuery("");
    setActiveFilters(false);
  };

  // Handle filter changes from DropUp
  const handleFilterSelect = (selectedFilters: FilterState) => {
    setFilters(selectedFilters);
  };

  // Initialize filtered complaints with all complaints on mount
  useEffect(() => {
    setFilteredComplaints(complaints);
  }, [complaints]);

  // Apply filters whenever filters or search query change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, complaints]);

  // Check if we have no results to show
  useEffect(() => {
    setShowNull(filteredComplaints.length === 0);
  }, [filteredComplaints]);

  return (
    <ScrollView
      className="bg-white min-h-screen p-5"
      contentContainerStyle={styles.scrollViewContent}
    >
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
        {activeFilters && (
          <TouchableOpacity className="ml-auto" onPress={resetAllFilters}>
            <Text className="text-[#25B14C] font-medium">Clear Filters</Text>
          </TouchableOpacity>
        )}
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

      {/* Active filters summary */}
      {activeFilters && (
        <View className="mt-3 mb-2 flex-row flex-wrap">
          {filters.categories.length > 0 && (
            <View className="bg-[#E6F7EE] px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-[#25B14C] text-sm">
                {filters.categories.length > 1
                  ? `${filters.categories.length} Categories`
                  : categoryMap[filters.categories[0]]}
              </Text>
            </View>
          )}
          {filters.date && (
            <View className="bg-[#E6F7EE] px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-[#25B14C] text-sm">{filters.date}</Text>
            </View>
          )}
          {filters.location && filters.location !== "Kigali, Rwanda" && (
            <View className="bg-[#E6F7EE] px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-[#25B14C] text-sm">{filters.location}</Text>
            </View>
          )}
        </View>
      )}

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
        onFilterSelect={handleFilterSelect}
        isModalVisible={isDropUpVisible}
        toggleModal={() => setDropUpVisible(!isDropUpVisible)}
        currentFilters={filters}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 0,
  },
  scrollViewContent: {
    paddingBottom: 100, // Add padding to bottom to prevent overlap with tabs
  },
});

export default SearchScreen;
