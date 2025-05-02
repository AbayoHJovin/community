// Replace with your actual API base URL
const API_BASE_URL = "https://yourapiurl.com/api";

/**
 * Service for handling complaint-related API operations
 */
class ComplaintService {
  /**
   * Delete a complaint by ID
   * @param id - The ID of the complaint to delete
   * @returns Promise resolving to the API response
   */
  async deleteComplaint(id: number): Promise<any> {
    try {
      // For demo/development purposes, simulate API call
      if (process.env.NODE_ENV === "development" || true) {
        // Force simulation for now
        return await this.simulateDeleteComplaint(id);
      }

      // In production, make the actual API call
      const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting complaint:", error);
      throw error;
    }
  }

  /**
   * Simulate deleting a complaint (for development/testing)
   * @param id - The ID of the complaint to delete
   * @returns Promise simulating an API response
   */
  private simulateDeleteComplaint(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate success with 90% probability
        if (Math.random() > 0.1) {
          resolve({
            success: true,
            message: "Complaint deleted successfully",
            data: { id },
          });
        } else {
          // Simulate server error
          reject(
            new Error("Failed to delete complaint. Server error occurred.")
          );
        }
      }, 1000);
    });
  }

  /**
   * Get all complaints
   * @returns Promise resolving to array of complaints
   */
  async getComplaints(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  }

  /**
   * Get a complaint by ID
   * @param id - The ID of the complaint to fetch
   * @returns Promise resolving to the complaint data
   */
  async getComplaintById(id: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching complaint with ID ${id}:`, error);
      throw error;
    }
  }
}

export const complaintService = new ComplaintService();
