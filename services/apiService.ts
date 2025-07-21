import AsyncStorage from "@react-native-async-storage/async-storage";

// Define common types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Service class to handle all API requests
class ApiService {
  // Get the authentication token from AsyncStorage
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("token");
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  // Create headers with authentication token if available
  private async createHeaders(
    includeAuth: boolean = true
  ): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic GET request
  async get<T>(
    url: string,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.createHeaders(requireAuth);
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        // Handle unauthorized (401) by logging out
        if (response.status === 401 && requireAuth) {
          // Handle token expiration or unauthorized access
          await this.handleUnauthorized();
        }

        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "Request failed",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API GET Error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Generic POST request
  async post<T>(
    url: string,
    body: any,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.createHeaders(requireAuth);
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Handle unauthorized (401) by logging out
        if (response.status === 401 && requireAuth) {
          await this.handleUnauthorized();
        }

        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "Request failed",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API POST Error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Generic PUT request
  async put<T>(
    url: string,
    body: any,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.createHeaders(requireAuth);
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Handle unauthorized (401) by logging out
        if (response.status === 401 && requireAuth) {
          await this.handleUnauthorized();
        }

        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "Request failed",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API PUT Error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Generic DELETE request
  async delete<T>(
    url: string,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.createHeaders(requireAuth);
      const response = await fetch(url, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        // Handle unauthorized (401) by logging out
        if (response.status === 401 && requireAuth) {
          await this.handleUnauthorized();
        }

        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "Request failed",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API DELETE Error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Handle unauthorized access (token expired or invalid)
  private async handleUnauthorized() {
    // Clear token and user data
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    // You can add navigation to login screen here if needed
    // This will be handled by the auth state in Redux
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
