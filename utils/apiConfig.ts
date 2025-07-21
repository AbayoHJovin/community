// API Configuration
const BASE_API_URL = "https://citizen-voice-pdca.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${BASE_API_URL}/api/auth/login`,
    REGISTER: `${BASE_API_URL}/api/auth/register`,
    LOGOUT: `${BASE_API_URL}/api/auth/logout`,
    PROFILE: `${BASE_API_URL}/api/auth/profile`,
  },

  // Complaints endpoints
  COMPLAINTS: {
    LIST: `${BASE_API_URL}/api/complaints`,
    DETAIL: (id: string) => `${BASE_API_URL}/api/complaints/${id}`,
    CREATE: `${BASE_API_URL}/api/complaints`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/complaints/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/complaints/${id}`,
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    LIST: `${BASE_API_URL}/api/notifications`,
    DETAIL: (id: string) => `${BASE_API_URL}/api/notifications/${id}`,
    MARK_AS_READ: (id: string) =>
      `${BASE_API_URL}/api/notifications/${id}/read`,
    MARK_ALL_AS_READ: `${BASE_API_URL}/api/notifications/read-all`,
  },
};

export default BASE_API_URL;
