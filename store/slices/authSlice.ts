import mockUsers from "@/utils/mockUsers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "citizen" | "leader";
  profileImage?: string;
  location?: string;
  language?: string;
  title?: string; // For leaders: their official title/position
}

interface LoginRequest {
  phoneNumber: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Async thunk for checking auth status
export const checkAuthStatus = createAsyncThunk<User | null, void>(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      // Check if user is logged in by looking for token and user data in AsyncStorage
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (!token || !userJson) {
        return null;
      }

      // Parse user data
      const user = JSON.parse(userJson);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk<User, LoginRequest>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // For development/demo purposes, we'll use mock data
      // In production, this would be replaced with an actual API call
      const user = mockUsers.find(
        (user) => user.phoneNumber === credentials.phoneNumber
      );

      if (!user || user.password !== credentials.password) {
        throw new Error("Invalid credentials");
      }

      // Create a user object without the password
      const { password, ...userWithoutPassword } = user;

      // Store user info in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(userWithoutPassword));
      await AsyncStorage.setItem("token", "mock-token-for-development");

      // Also mark onboarding as complete
      await AsyncStorage.setItem("hasSeenOnboarding", "true");

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Remove user data and token from AsyncStorage
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An error occurred during logout");
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
