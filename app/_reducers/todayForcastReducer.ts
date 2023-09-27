import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DUST, RISESET, UV, WEATHER } from "../_types/types";
import { RootState } from "../store";

export interface TodayForcastState {
  todayForcastItem: {
    weather: WEATHER;
    uv: UV;
    dust: DUST;
    riseset: RISESET[];
  };
}

const initialState: TodayForcastState = {
  todayForcastItem: {
    weather: null,
    uv: null,
    dust: null,
    riseset: null,
  },
};

export const todayForcastSlice = createSlice({
  name: "todayForcastSlice",
  initialState,
  reducers: {
    updateTodayForcastState: (state, action) => {
      Object.assign(state.todayForcastItem, action.payload);
    },
  },
});

export const { updateTodayForcastState } = todayForcastSlice.actions;

export const selectTodayForcast = (state: RootState) => {
  return state.todayForcast.todayForcastItem;
};

export default todayForcastSlice.reducer;
