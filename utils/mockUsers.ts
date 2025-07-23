export interface MockUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "citizen" | "leader";
  profileImage?: string;
  location?: string;
  language?: string;
  title?: string; // For leaders: their official title/position
}

const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "KARASIRA AINE",
    email: "karasiraine5@gmail.com",
    phoneNumber: "789123456",
    password: "password123",
    role: "citizen",
    location: "Kigali, Rwanda",
    language: "English",
  },
  {
    id: "2",
    name: "Steve Bertin",
    email: "steve.bertin@gov.rw",
    phoneNumber: "722987654",
    password: "leader123",
    role: "leader",
    location: "Gasabo, Rwanda",
    language: "English",
    title: "Mayor of Gasabo",
  },

];

export default mockUsers;
