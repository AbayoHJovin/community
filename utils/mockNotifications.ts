export interface Notification {
  id: string;
  message: string;
  complaintId: number;
  fullMessage: string;
  date: string;
  time: string;
  day: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Your complaint was viewed and the response will ...",
    fullMessage:
      "Your complaint was viewed and the response will be given soon by the team the leaders in charge of the field you complained in.",
    complaintId: 1,
    date: "2023-07-18",
    time: "9:45",
    day: "Thursday",
    read: false,
  },
  {
    id: "2",
    message: "Your complaint was viewed and the response will ...",
    fullMessage:
      "Your complaint was viewed and the response will be given soon by the team the leaders in charge of the field you complained in.",
    complaintId: 2,
    date: "2023-07-18",
    time: "9:45",
    day: "Thursday",
    read: false,
  },
  {
    id: "3",
    message: "Your complaint was viewed and the response will ...",
    fullMessage:
      "Your complaint was viewed and the response will be given soon by the team the leaders in charge of the field you complained in.",
    complaintId: 3,
    date: "2023-07-19",
    time: "9:45",
    day: "Friday",
    read: false,
  },
  {
    id: "4",
    message: "Your complaint was viewed and the response will ...",
    fullMessage:
      "Your complaint was viewed and the response will be given soon by the team the leaders in charge of the field you complained in.",
    complaintId: 4,
    date: "2023-07-19",
    time: "9:45",
    day: "Friday",
    read: true,
  },
];

export default mockNotifications;
