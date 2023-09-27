import { ThunkAction, configureStore, AnyAction } from "@reduxjs/toolkit";
import weatherReducer from "./_reducers/weatherReducer";
import uvReducer from "./_reducers/uvReducer";
import dustReducer from "./_reducers/dustReducer";
import localReducer from "./_reducers/localReducer";
import risesetReducer from "./_reducers/risesetReducer";
import midTermForcastReducer from "./_reducers/midTermForcastReducer";
import tourReducer from "./_reducers/tourReducer";
import todayForcastReducer from "./_reducers/todayForcastReducer";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    uv: uvReducer,
    dust: dustReducer,
    local: localReducer,
    riseset: risesetReducer,
    midTermForcast: midTermForcastReducer,
    tour: tourReducer,
    todayForcast: todayForcastReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
