import { configureStore } from "@reduxjs/toolkit";

import weatherReducer from "./_reducers/weatherReducer";
import uvReducer from "./_reducers/uvReducer";
import dustReducer from "./_reducers/dustReducer";
import localReducer from "./_reducers/localReducer";
import risesetReducer from "./_reducers/risesetReducer";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    uv: uvReducer,
    dust: dustReducer,
    local: localReducer,
    riseset: risesetReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const getInitialComparisonTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  
  const dateObj = new Date(year, month - 1, day, hours, 0, 0, 0);
  const initialComparisonTime = dateObj.getTime();
  return initialComparisonTime;
}