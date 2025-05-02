import { configureStore } from "@reduxjs/toolkit";
import complaintsReducer from "./slices/complaintsSlice";

export const store = configureStore({
  reducer: {
    complaints: complaintsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
