import { ImageSourcePropType } from "react-native";

export interface Leader {
  name: string;
  responsibilities: string;
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
}

export interface ComplaintsState {
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
}
