import { configureStore } from "@reduxjs/toolkit";

import weatherReducer from "./_reducers/weatherReducer";
import uvReducer from "./_reducers/uvReducer";
import dustReducer from "./_reducers/dustReducer";
import localReducer from "./_reducers/localReducer";
import risesetReducer from "./_reducers/risesetReducer";
import midTermForcastReducer from "./_reducers/midTermForcastReducer";
import tourReducer from "./_reducers/tourReducer";
import dayjs from "./_lib/dayjs";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    uv: uvReducer,
    dust: dustReducer,
    local: localReducer,
    riseset: risesetReducer,
    midTermForcast: midTermForcastReducer,
    tour: tourReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const getInitialComparisonTime = ():number => {
  const initialComparisonTime = dayjs().tz().minute(0).second(0).millisecond(0).unix() * 1000;
  return initialComparisonTime;
}