import { Complaint, ComplaintsState } from "@/types/complaint";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockUserComplaints, getComplaintsByUserId } from "@/data/mockComplaints";

// Async thunk for fetching all complaints
export const fetchComplaints = createAsyncThunk<Complaint[], void>(
  "complaints/fetchComplaints",
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return mockUserComplaints;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Async thunk for fetching complaints by user ID
export const fetchUserComplaints = createAsyncThunk<Complaint[], string>(
  "complaints/fetchUserComplaints",
  async (userId: string, { rejectWithValue }) => {
    try {
      // Filter complaints by user ID
      const userComplaints = getComplaintsByUserId(userId);
      return userComplaints;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Async thunk for deleting a complaint
export const deleteComplaint = createAsyncThunk<number, number>(
  "complaints/deleteComplaint",
  async (complaintId: number, { rejectWithValue }) => {
    try {
      // In a real app, make API call to delete the complaint
      // For now, just return the complaint ID
      return complaintId;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Initial state
const initialState: ComplaintsState = {
  complaints: [],
  loading: false,
  error: null,
};

// Create the complaints slice
const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    // Add a synchronous reducer for immediate UI updates
    removeComplaint: (state, action: PayloadAction<number>) => {
      state.complaints = state.complaints.filter(
        (complaint) => complaint.id !== action.payload
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchComplaints
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
        state.error = action.payload as string;
      })
      // Handle fetchUserComplaints
      .addCase(fetchUserComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchUserComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle deleteComplaint
      .addCase(deleteComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = state.complaints.filter(
          (complaint) => complaint.id !== action.payload
        );
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { removeComplaint, clearError } = complaintsSlice.actions;
export default complaintsSlice.reducer;
