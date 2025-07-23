import { ImageSourcePropType } from "react-native";

export interface Leader {
  name: string;
  responsibilities: string;
}

export interface Response {
  id: string;
  text: string;
  date: string;
  status: "pending" | "in-progress" | "resolved";
  responderId: string;
  responderName: string;
}

export interface Complaint {
  id: number;
  date: string;
  day: string;
  time: string;
  title: string;
  subtitle: string;
  location: string;
  backgroundImage: ImageSourcePropType;
  leader: Leader;
  category: string;
  status?: "pending" | "in-progress" | "resolved";
  userId?: string; // ID of the user who created the complaint
  responses?: Response[]; // Responses from leaders
}

export interface ComplaintsState {
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
}
