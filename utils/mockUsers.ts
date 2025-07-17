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
  {
    id: "3",
    name: "Marie Uwase",
    email: "marie.uwase@gov.rw",
    phoneNumber: "733456789",
    password: "leader456",
    role: "leader",
    location: "Nyarugenge, Rwanda",
    language: "Kinyarwanda",
    title: "District Executive",
  },
  {
    id: "4",
    name: "John Mugabo",
    email: "john.mugabo@gmail.com",
    phoneNumber: "788765432",
    password: "citizen456",
    role: "citizen",
    location: "Huye, Rwanda",
    language: "English",
  },
];

export default mockUsers;
