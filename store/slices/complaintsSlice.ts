import { fetchUserComplaints } from "@/services/complaintService";
import { Complaint, ComplaintsState, Response } from "@/types/complaint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const mockComplaints: Complaint[] = [
  {
    id: 1,
    date: "2024-05-01",
    day: "Saturday",
    time: "2:00 PM",
    title: "Cow being stolen from its hatch by people",
    subtitle:
      "There have been reports of cattle theft in the community. Local farmers have reported their cows being stolen during the night.",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/complaintImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Security",
    status: "pending",
  },
  {
    id: 2,
    date: "2024-05-01",
    day: "Saturday",
    time: "2:00 PM",
    title: "Cow being stolen from its hatch by people",
    subtitle:
      "Another incident of cattle theft has been reported. This is becoming a serious concern for the local farmers.",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/complaintImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Security",
    status: "in-progress",
  },
  {
    id: 3,
    date: "2024-05-01",
    day: "Saturday",
    time: "2:00 PM",
    title: "Cow being stolen from its hatch by people",
    subtitle:
      "A third case of cattle theft has been reported. Local community members are requesting increased security patrols.",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/complaintImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Security",
    status: "pending",
  },
  {
    id: 4,
    date: "2024-02-01",
    day: "Thursday",
    time: "2:00 PM",
    title: "Cow being stolen from its hatch by people",
    subtitle:
      "An older case of cattle theft that happened 3 months ago. The investigation is still ongoing.",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/complaintImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Security",
    status: "in-progress",
  },
  {
    id: 5,
    date: "2023-05-01",
    day: "Monday",
    time: "2:00 PM",
    title: "Cow being stolen from its hatch by people",
    subtitle:
      "A case from last year that has not been resolved yet. The community is requesting updates on the investigation.",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/complaintImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Security",
    status: "in-progress",
  },
  {
    id: 6,
    date: "2024-06-10",
    day: "Monday",
    time: "10:00 AM",
    title: "Hospital waste management issue",
    subtitle:
      "There's improper disposal of medical waste near the local clinic that poses health risks",
    location: "Kigali Nyarugenge, Rwanda",
    backgroundImage: require("../../assets/images/userImage.png"),
    leader: { name: "Marie Uwase", responsibilities: "District Executive" },
    category: "Health",
    status: "pending",
  },
  {
    id: 7,
    date: "2024-06-15",
    day: "Saturday",
    time: "09:30 AM",
    title: "Street lighting not working",
    subtitle:
      "The street lights in our neighborhood have been out for weeks, creating security concerns",
    location: "Kigali Nyarugenge, Rwanda",
    backgroundImage: require("../../assets/images/userImage.png"),
    leader: { name: "Marie Uwase", responsibilities: "District Executive" },
    category: "Security",
    status: "in-progress",
  },
  {
    id: 8,
    date: "2024-06-20",
    day: "Thursday",
    time: "02:15 PM",
    title: "Community center needs renovation",
    subtitle:
      "Our local entertainment center is in poor condition and needs urgent repairs",
    location: "Huye, Rwanda",
    backgroundImage: require("../../assets/images/userImage.png"),
    leader: { name: "John Mugabo", responsibilities: "Community Manager" },
    category: "Entertainment",
    status: "resolved",
  },
];

export const fetchComplaints = createAsyncThunk(
  "complaints/fetchComplaints",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Try to get current user ID
      const state: any = getState();
      const userId = state.auth.user?.id;
      
      if (userId) {
        // Get user-specific complaints if logged in
        try {
          const userComplaints = await fetchUserComplaints(userId);
          return userComplaints;
        } catch (error) {
          console.log("Error fetching user complaints, using mock data:", error);
        }
      }
      
      // First try using fetch API for all complaints
      try {
        const response = await fetch("http://localhost:5000/api/complaints");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
      } catch (apiError) {
        console.log("Error fetching complaints from API, using mock data:", apiError);
        // Return mock data if the API call fails
        return mockComplaints;
      }
    } catch (error) {
      console.log("Error in fetchComplaints thunk:", error);
      return rejectWithValue("Failed to fetch complaints");
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaints/deleteComplaint",
  async (complaintId: number, { rejectWithValue }) => {
    try {
      // In a real app, make API call to delete the complaint
      // const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
      //   method: 'DELETE',
      // });
      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      // For development, simulate successful deletion
      return complaintId;
    } catch (error) {
      return rejectWithValue("Failed to delete complaint");
    }
  }
);

// Add a new thunk to add responses to complaints
export const addResponseToComplaint = createAsyncThunk(
  "complaints/addResponse",
  async (
    { complaintId, response }: { complaintId: number; response: Response },
    { rejectWithValue, getState }
  ) => {
    try {
      // In a real app, this would be an API call to add the response
      // For now, we'll just update the local state
      
      // Get current complaints from state
      const state: any = getState();
      const complaints = state.complaints.complaints;
      
      // Find the complaint to update
      const complaint = complaints.find(c => c.id === complaintId);
      if (!complaint) {
        throw new Error(`Complaint with ID ${complaintId} not found`);
      }
      
      // Create updated complaint with new response
      const updatedComplaint = {
        ...complaint,
        responses: complaint.responses ? [...complaint.responses, response] : [response],
        // Optionally update complaint status based on response status
        status: response.status,
      };
      
      // Update complaint in local storage if using file-based storage
      try {
        // Get stored complaints
        const storedComplaintsJson = await AsyncStorage.getItem("userComplaints");
        if (storedComplaintsJson) {
          const storedComplaints = JSON.parse(storedComplaintsJson);
          
          // Find and update the specific complaint
          const updatedComplaints = storedComplaints.map((c: Complaint) => 
            c.id === complaintId ? updatedComplaint : c
          );
          
          // Save back to storage
          await AsyncStorage.setItem("userComplaints", JSON.stringify(updatedComplaints));
        }
      } catch (storageError) {
        console.error("Failed to update storage:", storageError);
        // Continue even if storage update fails
      }
      
      return { complaintId, response };
    } catch (error) {
      console.error("Error adding response:", error);
      return rejectWithValue("Failed to add response to complaint");
    }
  }
);

const initialState: ComplaintsState = {
  complaints: mockComplaints, // Use mock data initially for development
  loading: false,
  error: null,
};

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    // Add a synchronous reducer for immediate UI updates
    removeComplaint: (state, action: PayloadAction<number>) => {
      console.log("Removing complaint with id:", action.payload);
      state.complaints = state.complaints.filter(
        (complaint) => complaint.id !== action.payload
      );
    },
    
    // Add new complaint (used after creating a new complaint)
    addNewComplaint: (state, action: PayloadAction<Complaint>) => {
      console.log("Adding new complaint:", action.payload);
      state.complaints.unshift(action.payload); // Add to the beginning of the array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch complaints";
      })
      // Add delete complaint cases
      .addCase(deleteComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted complaint from the state
        state.complaints = state.complaints.filter(
          (complaint) => complaint.id !== action.payload
        );
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to delete complaint";
      })
      // Add response cases
      .addCase(addResponseToComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addResponseToComplaint.fulfilled, (state, action) => {
        state.loading = false;
        
        // Find the complaint and add the response
        const { complaintId, response } = action.payload;
        const complaint = state.complaints.find(c => c.id === complaintId);
        
        if (complaint) {
          // Add response to the complaint
          if (!complaint.responses) {
            complaint.responses = [response];
          } else {
            complaint.responses.push(response);
          }
          
          // Update status if needed
          complaint.status = response.status;
        }
      })
      .addCase(addResponseToComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to add response";
      });
  },
});

export const { removeComplaint, addNewComplaint } = complaintsSlice.actions;
export default complaintsSlice.reducer;
