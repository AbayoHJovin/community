import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Complaint, ComplaintsState } from "@/types/complaint";

const mockComplaints: Complaint[] = [
  {
    id: 1,
    date: "10 June 2024",
    day: "Tuesday",
    time: "10:00 AM",
    title: "Stealing the cow from the cowshed",
    subtitle:
      "Last week, when I left my herbs in the cowshed, it was stolen. I don't know what to do",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/userImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Health",
  },
  {
    id: 2,
    date: "10 June 2024",
    day: "Tuesday",
    time: "10:00 AM",
    title: "Stealing the cow from the cowshed",
    subtitle:
      "Last week, when I left my herbs in the cowshed, it was stolen. I don't know what to do",
    location: "Kigali Gasabo, Rwanda",
    backgroundImage: require("../../assets/images/complaintImage.png"),
    leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" },
    category: "Security",
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
