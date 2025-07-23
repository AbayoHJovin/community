import AsyncStorage from "@react-native-async-storage/async-storage";

// Sample complaint images
export const complaintImages = {
  infrastructure: require('../assets/images/complaintImage.png'),
  sanitation: require('../assets/images/chattingRemotely.png'),
  utilities: require('../assets/images/userImage.png')
};

/**
 * Initialize test complaints data in AsyncStorage for development and testing
 * This function can be called from any screen to ensure there's data to display
 */
export const initializeTestComplaints = async () => {
  try {
    // Check if complaints already exist
    const existingComplaints = await AsyncStorage.getItem("userComplaints");
    if (existingComplaints) {
      console.log('Test complaints already exist in AsyncStorage');
      return JSON.parse(existingComplaints);
    }

    // Create test complaints if none exist
    console.log('Creating test complaints in AsyncStorage...');
    
    const testComplaints = [
      {
        id: 1001,
        date: "2024-06-15",
        day: "Saturday",
        time: "10:00 AM",
        title: "Road needs urgent repair",
        subtitle: "There are large potholes making driving dangerous",
        location: "Kigali Center",
        backgroundImage: complaintImages.infrastructure,
        leader: { name: "Steve Bertin", responsibilities: "Mayor" },
        category: "Infrastructure",
        status: "pending",
        userId: "test-user-1",
        createdBy: "John Citizen"
      },
      {
        id: 1002,
        date: "2024-06-14",
        day: "Friday",
        time: "2:30 PM",
        title: "Garbage collection issue",
        subtitle: "Garbage has not been collected for a week",
        location: "Gasabo District",
        backgroundImage: complaintImages.sanitation,
        leader: { name: "Marie Claire", responsibilities: "District Leader" },
        category: "Sanitation",
        status: "in-progress",
        userId: "test-user-2",
        createdBy: "Alice Resident"
      },
      {
        id: 1003,
        date: "2024-06-10",
        day: "Monday",
        time: "8:15 AM",
        title: "Streetlight not working",
        subtitle: "The street is dark at night which is unsafe",
        location: "Nyamirambo",
        backgroundImage: complaintImages.infrastructure,
        leader: { name: "Steve Bertin", responsibilities: "Mayor" },
        category: "Infrastructure",
        status: "resolved",
        userId: "test-user-1",
        createdBy: "John Citizen"
      },
      {
        id: 1004,
        date: "2024-05-20",
        day: "Monday",
        time: "11:45 AM",
        title: "Water supply interrupted",
        subtitle: "No water for 3 days now in our neighborhood",
        location: "Kimihurura",
        backgroundImage: complaintImages.utilities,
        leader: { name: "Marie Claire", responsibilities: "District Leader" },
        category: "Utilities",
        status: "pending",
        userId: "test-user-3",
        createdBy: "Robert Community"
      }
    ];
    
    // Save to AsyncStorage
    await AsyncStorage.setItem("userComplaints", JSON.stringify(testComplaints));
    console.log('Successfully added test complaints to AsyncStorage');
    
    return testComplaints;
  } catch (error) {
    console.error('Failed to initialize test complaints:', error);
    return [];
  }
}; 