import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import complaintsReducer from "./slices/complaintsSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
