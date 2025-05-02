import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Complaint, ComplaintsState } from "@/types/complaint";

const mockComplaints: Complaint[] = [
  {
    id: 1,
    date: "10 June 2024",
    day: "Tuesday",
    time: "10:00 AM",
    title: "Hospital waste management issue",
    subtitle:
      "There's improper disposal of medical waste near the local clinic that poses health risks",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/userImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Health",
  },
  {
    id: 2,
    date: "15 June 2024",
    day: "Monday",
    time: "09:30 AM",
    title: "Street lighting not working",
    subtitle:
      "The street lights in our neighborhood have been out for weeks, creating security concerns",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/complaintImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Security",
  },
  {
    id: 3,
    date: "20 June 2024",
    day: "Thursday",
    time: "02:15 PM",
    title: "Community center needs renovation",
    subtitle:
      "Our local entertainment center is in poor condition and needs urgent repairs",
    location: "Kigali Nyarugenge, Rwanda",
    backgroundImage: require("../../assets/images/userImage.png"),
    leader: { name: "Jean Paul", responsibilities: "District Manager" },
    category: "Entertainment",
  },
  {
    id: 4,
    date: "5 June 2024",
    day: "Wednesday",
    time: "11:45 AM",
    title: "Food safety concerns at market",
    subtitle:
      "Several vendors at the local market aren't following proper food storage practices",
    location: "Kigali Kicukiro, Rwanda",
    backgroundImage: require("../../assets/images/complaintImage.png"),
    leader: { name: "Marie Claire", responsibilities: "Health Inspector" },
    category: "Nutrition",
  },
  {
    id: 5,
    date: "12 June 2024",
    day: "Friday",
    time: "04:20 PM",
    title: "Delayed public service delivery",
    subtitle:
      "Processing of important documents is taking too long at government offices",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/userImage.png"),
    leader: {
      name: "Emmanuel Rwasa",
      responsibilities: "Public Service Director",
    },
    category: "Governance",
  },
];
export const fetchComplaints = createAsyncThunk(
  "complaints/fetchComplaints",
  async (_, { rejectWithValue }) => {
    try {
      // First try using fetch API
      const response = await fetch("http://localhost:5000/api/complaints");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching complaints, using mock data:", error);
      // Return mock data if the API call fails
      return mockComplaints;
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
      });
  },
});

export const { removeComplaint } = complaintsSlice.actions;
export default complaintsSlice.reducer;
