import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState, getInitialComparisonTime } from "../store";
import { REQ_TYPE, type DUST } from "../_types/types";
import { appFetch } from "../_helpers/custom-fetch/fetchWrapper";
import { getBaseDate } from "../_lib/weatherUtils";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";

export const fetchDust = createAsyncThunk(
  "dustSlice/fetchDust",
  async (geolocation: { latitude: number; longitude: number }) => {
    const curDate = getBaseDate(REQ_TYPE.DUST, new Date());
    // Error를 catch 해주면 extraReducers에서 failed로 넘어가지 않는다.
      const response = await appFetch(
        `api/dust?lat=${geolocation.latitude}&lon=${geolocation.longitude}&date=${curDate}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const { data } = await response.json();
      return data;
  }
);

interface DustState {
  dustList: DUST[];
  comparisonTime: number;
  status: string;
}

const initialState: DustState = {
  dustList: [],
  comparisonTime: null,
  status: LOADING,
};

export const dustSlice = createSlice({
  name: "dustSlice",
  initialState,
  reducers: {
    dustComparisonTimeUpdated: (state, action: PayloadAction<number>) => {
      state.comparisonTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDust.pending, (state, action) => {
      state.status = LOADING;
    });
    builder.addCase(fetchDust.fulfilled, (state, action) => {
      state.status = FULFILLED;
      state.dustList = action.payload;
      state.comparisonTime = getInitialComparisonTime();
    });
    builder.addCase(fetchDust.rejected, (state, action) => {
      state.status = FAILED;
    });
  },
});

export const { dustComparisonTimeUpdated } = dustSlice.actions;
export const selectMatchedDust = (state: RootState) =>
  state.dust.dustList.find((dust) => dust.dt === state.dust.comparisonTime);
export const selectCurrentDust = (state: RootState) =>
  state.dust.dustList.find((dust) => dust.dt === getInitialComparisonTime());
export default dustSlice.reducer;
