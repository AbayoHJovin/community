import mockUserComplaints, { getComplaintsByUserId } from "@/data/mockComplaints";
import { Complaint } from "@/types/complaint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

// Directory for storing complaint images
const COMPLAINTS_DIRECTORY = FileSystem.documentDirectory + "complaints/";

// Function to ensure complaints directory exists
const ensureComplaintsDirectoryExists = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(COMPLAINTS_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(COMPLAINTS_DIRECTORY, { intermediates: true });
  }
};

// Function to save an image to the file system
const saveImageToFileSystem = async (
  imageUri: string,
  complaintId: number,
  index: number
): Promise<string> => {
  try {
    await ensureComplaintsDirectoryExists();
    
    // Create a unique filename for this image
    const filename = `complaint_${complaintId}_image_${index}.jpg`;
    const destinationUri = COMPLAINTS_DIRECTORY + filename;
    
    // Copy the image to our app's storage
    await FileSystem.copyAsync({
      from: imageUri,
      to: destinationUri
    });
    
    return destinationUri;
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
};

// Function to get the next available complaint ID
const getNextComplaintId = (): number => {
  // Find the highest ID in the current complaints
  const highestId = mockUserComplaints.reduce(
    (max, complaint) => Math.max(max, complaint.id),
    0
  );
  // Return the next ID
  return highestId + 1;
};

// Function to create a new complaint
export const createComplaint = async (
  complaintData: {
    title: string;
    subtitle: string;
    date: Date;
    location: string;
    imageUris: string[];
    userId: string;
  }
): Promise<Complaint> => {
  try {
    const newComplaintId = getNextComplaintId();
    
    // Get the formatted date, day, and time
    const formattedDate = complaintData.date.toISOString().split('T')[0]; // YYYY-MM-DD
    const day = complaintData.date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = complaintData.date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    
    // Save the main image to the file system
    let savedImageUri: string;
    if (Platform.OS === 'web') {
      // For web, we can't use FileSystem, so just use the original URI
      savedImageUri = complaintData.imageUris[0];
    } else {
      // For native platforms, save the image to the file system
      savedImageUri = await saveImageToFileSystem(
        complaintData.imageUris[0],
        newComplaintId,
        0
      );
    }
    
    // Create the new complaint object
    const newComplaint: Complaint = {
      id: newComplaintId,
      date: formattedDate,
      day: day,
      time: time,
      title: complaintData.title,
      subtitle: complaintData.subtitle,
      location: complaintData.location,
      backgroundImage: { uri: savedImageUri }, // Use the saved image URI
      leader: { name: "Steve Bertin", responsibilities: "Mayor of Gasabo" }, // Default leader
      category: "General", // Default category
      status: "pending", // Default status is pending
    };
    
    // Add userId to the complaint data for storage
    const complaintWithUserId = {
      ...newComplaint,
      userId: complaintData.userId,
    };
    
    // Add the new complaint to the mock data
    // In a real app, this would be a server API call
    await addComplaintToStorage(complaintWithUserId);
    
    // Save additional images if any
    if (complaintData.imageUris.length > 1) {
      const additionalImages = [];
      for (let i = 1; i < complaintData.imageUris.length; i++) {
        if (Platform.OS !== 'web') {
          const savedUri = await saveImageToFileSystem(
            complaintData.imageUris[i],
            newComplaintId,
            i
          );
          additionalImages.push(savedUri);
        } else {
          additionalImages.push(complaintData.imageUris[i]);
        }
      }
      
      // Store additional images separately
      await AsyncStorage.setItem(
        `complaint_${newComplaintId}_additional_images`,
        JSON.stringify(additionalImages)
      );
    }
    
    return newComplaint;
  } catch (error) {
    console.error("Error creating complaint:", error);
    throw error;
  }
};

// Function to store a new complaint in AsyncStorage
const addComplaintToStorage = async (complaint: any): Promise<void> => {
  try {
    // Get existing complaints
    const storedComplaints = await AsyncStorage.getItem("userComplaints");
    let complaints: any[] = storedComplaints ? JSON.parse(storedComplaints) : [];
    
    // Add the new complaint
    complaints.push(complaint);
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem("userComplaints", JSON.stringify(complaints));
    
    // Also update our in-memory mock data (for immediate use)
    mockUserComplaints.push(complaint);
  } catch (error) {
    console.error("Error adding complaint to storage:", error);
    throw error;
  }
};

// Function to fetch user's complaints
export const fetchUserComplaints = async (userId: string): Promise<Complaint[]> => {
  try {
    // Try to get complaints from AsyncStorage first
    const storedComplaints = await AsyncStorage.getItem("userComplaints");
    
    if (storedComplaints) {
      const complaints: any[] = JSON.parse(storedComplaints);
      return complaints
        .filter(complaint => complaint.userId === userId)
        .map(complaint => ({
          ...complaint,
          backgroundImage: complaint.backgroundImage.uri 
            ? { uri: complaint.backgroundImage.uri }
            : complaint.backgroundImage
        }));
    }
    
    // If no stored complaints, fall back to mock data
    return getComplaintsByUserId(userId);
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    return getComplaintsByUserId(userId);
  }
};

// Function to delete a complaint by ID
export const deleteComplaint = async (complaintId: number): Promise<boolean> => {
  try {
    // Get current complaints from AsyncStorage
    const storedComplaints = await AsyncStorage.getItem("userComplaints");
    if (!storedComplaints) {
      console.error("No complaints found in storage");
      return false;
    }
    
    // Parse stored complaints and filter out the one to delete
    const complaints: any[] = JSON.parse(storedComplaints);
    const complaintToDelete = complaints.find(c => c.id === complaintId);
    
    if (!complaintToDelete) {
      console.error(`Complaint with ID ${complaintId} not found`);
      return false;
    }
    
    // Filter out the complaint to delete
    const updatedComplaints = complaints.filter(c => c.id !== complaintId);
    
    // Save the updated complaints back to AsyncStorage
    await AsyncStorage.setItem("userComplaints", JSON.stringify(updatedComplaints));
    
    // Also update our in-memory mock data
    const mockIndex = mockUserComplaints.findIndex(c => c.id === complaintId);
    if (mockIndex !== -1) {
      mockUserComplaints.splice(mockIndex, 1);
    }
    
    // Delete related files if needed
    if (Platform.OS !== 'web') {
      try {
        // Delete main image if it's in our file system
        const complaint = complaints.find(c => c.id === complaintId);
        if (complaint && complaint.backgroundImage && complaint.backgroundImage.uri) {
          const uri = complaint.backgroundImage.uri;
          if (uri.startsWith(COMPLAINTS_DIRECTORY)) {
            await FileSystem.deleteAsync(uri, { idempotent: true });
          }
        }
        
        // Delete additional images if any
        const additionalImagesKey = `complaint_${complaintId}_additional_images`;
        const additionalImagesJson = await AsyncStorage.getItem(additionalImagesKey);
        if (additionalImagesJson) {
          const additionalImages = JSON.parse(additionalImagesJson);
          for (const imageUri of additionalImages) {
            if (imageUri.startsWith(COMPLAINTS_DIRECTORY)) {
              await FileSystem.deleteAsync(imageUri, { idempotent: true });
            }
          }
          // Remove the additional images entry from AsyncStorage
          await AsyncStorage.removeItem(additionalImagesKey);
        }
      } catch (fileError) {
        console.error("Error deleting complaint files:", fileError);
        // Continue with deletion even if file deletion fails
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting complaint:", error);
    throw error;
  }
};

export default {
  createComplaint,
  fetchUserComplaints,
  deleteComplaint
};
