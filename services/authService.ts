import { User } from "@/store/slices/authSlice";
import { API_ENDPOINTS } from "@/utils/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService, { ApiResponse } from "./apiService";

// Interface for login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface for login response
export interface LoginResponse {
  user: User;
  token: string;
}

// Interface for address in registration
export interface Address {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

// Interface for registration request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: Address;
}

// Interface for registration response
export interface RegisterResponse {
  message: string;
  user: User;
  loginUrl: string;
}

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        false // Don't require auth for login
      );

      if (response.success && response.data) {
        // Store user and token in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  // Register user
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await apiService.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData,
        false // Don't require auth for registration
      );

      if (response.success && response.data) {
        // Mark onboarding as complete but don't store user yet
        // User will need to login after registration
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
      }

      return response;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }

  // Logout user
  async logout(): Promise<ApiResponse<null>> {
    try {
      // Call logout API endpoint if needed
      const response = await apiService.post<null>(
        API_ENDPOINTS.AUTH.LOGOUT,
        {}
      );

      // Clear local storage regardless of API response
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout error:", error);

      // Still clear local storage even if API call fails
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      return {
        success: true, // Consider logout successful even if API fails
        message: "Logged out successfully",
      };
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      // First try to get from AsyncStorage
      const userJson = await AsyncStorage.getItem("user");

      if (userJson) {
        const user = JSON.parse(userJson);
        return {
          success: true,
          data: user,
        };
      }

      // If not in AsyncStorage, fetch from API
      return await apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE);
    } catch (error) {
      console.error("Get current user error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get user profile",
      };
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiService.put<User>(
        API_ENDPOINTS.AUTH.PROFILE,
        userData
      );

      if (response.success && response.data) {
        // Update user in AsyncStorage
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          const currentUser = JSON.parse(userJson);
          const updatedUser = { ...currentUser, ...response.data };
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      };
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      return !!token && !!userJson;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
