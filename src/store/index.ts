import { configureStore } from "@reduxjs/toolkit";
import personalityReducer from "./personalitySlice";

export const store = configureStore({
  reducer: {
    personality: personalityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
