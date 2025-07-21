import { Complaint } from "@/types/complaint";

// Define interface for storage which includes userId
interface ComplaintWithUserId extends Complaint {
  userId: string;
}

// Mock complaints with user-specific data
export const mockUserComplaints: ComplaintWithUserId[] = [
  // Nelson's complaints (userId: "1")
  {
    id: 1,
    userId: "1", // User ID
    date: "2024-07-15",
    day: "Monday",
    time: "9:30 AM",
    title: "Street Lights Not Working",
    subtitle: "Several street lights on my block have been out for over a week, making it unsafe to walk at night.",
    location: "Kimihurura, Kigali",
    backgroundImage: require("../assets/images/complaintImage.png"),
    leader: { name: "Emmanuel", responsibilities: "Community Leader" },
    category: "Infrastructure",
    status: "pending",
  },
  {
    id: 2,
    userId: "1", // User ID
    date: "2024-07-10",
    day: "Wednesday",
    time: "2:15 PM",
    title: "Water Supply Issues",
    subtitle: "The water supply in our neighborhood has been intermittent for the past few days. We need a permanent solution.",
    location: "Kimihurura, Kigali",
    backgroundImage: require("../assets/images/chattingRemotely.png"),
    leader: { name: "Emmanuel", responsibilities: "Community Leader" },
    category: "Utilities",
    status: "in-progress",
  },
  {
    id: 3,
    userId: "1", // User ID
    date: "2024-07-05",
    day: "Friday",
    time: "6:45 PM",
    title: "Garbage Collection Delay",
    subtitle: "Garbage hasn't been collected from our area for over 10 days. The situation is becoming unhygienic.",
    location: "Kimihurura, Kigali",
    backgroundImage: require("../assets/images/userImage.png"),
    leader: { name: "Emmanuel", responsibilities: "Community Leader" },
    category: "Sanitation",
    status: "resolved",
  },
  
  // Some complaints from other users (for testing purposes)
  {
    id: 4,
    userId: "3", // User ID
    date: "2024-07-12",
    day: "Friday",
    time: "11:00 AM",
    title: "Road Maintenance Needed",
    subtitle: "The main road has several potholes that need urgent attention.",
    location: "Gasabo, Kigali",
    backgroundImage: require("../assets/images/complaintImage.png"),
    leader: { name: "Emmanuel", responsibilities: "Community Leader" },
    category: "Infrastructure",
    status: "pending",
  },
  {
    id: 5,
    userId: "4", // User ID
    date: "2024-07-08",
    day: "Monday",
    time: "3:20 PM",
    title: "Noise Pollution",
    subtitle: "Construction work is happening very early in the morning, disturbing the peace.",
    location: "Nyamirambo, Kigali",
    backgroundImage: require("../assets/images/chattingRemotely.png"),
    leader: { name: "Emmanuel", responsibilities: "Community Leader" },
    category: "Environment",
    status: "in-progress",
  },
];

// Function to get complaints by user ID
export const getComplaintsByUserId = (userId: string): Complaint[] => {
  return mockUserComplaints.filter(complaint => complaint.userId === userId);
};

export default mockUserComplaints;
