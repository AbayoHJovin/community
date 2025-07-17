import { Complaint, ComplaintsState } from "@/types/complaint";
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
