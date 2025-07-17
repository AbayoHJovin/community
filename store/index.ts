import { configureStore } from "@reduxjs/toolkit";
import complaintsReducer from "./slices/complaintsSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    complaints: complaintsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
