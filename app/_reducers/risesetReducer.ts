import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState, getInitialComparisonTime } from "../store";
import { REQ_TYPE, type Riseset } from "../_types/types";
import { getBaseDate } from "../_lib/weatherUtils";
import { appFetch } from "../_helpers/custom-fetch/fetchWrapper";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";

export const fetchRiseset = createAsyncThunk(
  "risesetSlice/fetchRiseset",
  async (geolocation: { latitude: number; longitude: number }) => {
    const curDate = getBaseDate(REQ_TYPE.RISE_SET, new Date());
    // 이 단계에서 에러를 catch하면 failed case로 분기되지 않는다. 
    const response = await appFetch(
      `api/riseset?lat=${geolocation.latitude}&lon=${geolocation.longitude}&date=${curDate}`,
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

interface RisesetState {
  risesetList: Riseset[];
  comparisonTime: number;
  status: string;
}

const initialState: RisesetState = {
  risesetList: [],
  comparisonTime: null,
  status: LOADING,
};

export const risesetSlice = createSlice({
  name: "risesetSlice",
  initialState,
  reducers: {
    risesetComparisonTimeUpdated: (state, action: PayloadAction<number>) => {
      state.comparisonTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRiseset.pending, (state, action) => {
      state.status = LOADING;
    });
    builder.addCase(fetchRiseset.fulfilled, (state, action) => {
      state.status = FULFILLED;
      state.risesetList = action.payload;
      state.comparisonTime = getInitialComparisonTime();
    });
    builder.addCase(fetchRiseset.rejected, (state, action) => {
      state.status = FAILED;
    });
  },
});

export const dateFormatter = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}${month < 10 ? `0${month}` : month}${
    day < 10 ? `0${day}` : day
  }`;
};
export const selectComparisonTime = (state: RootState) =>
  state.riseset.comparisonTime;

export const selectRisesetList = (state: RootState) =>
  state.riseset.risesetList;

export const { risesetComparisonTimeUpdated } = risesetSlice.actions;

export const selectMatchedRiseset = createSelector(
  [selectRisesetList, selectComparisonTime],
  (risesetList, comparisonTime) => {
    const seletedRiseset = risesetList.filter((riseset) => {
      const targetSunsetDate = new Date(comparisonTime); // 일몰
      const targetSunriseDate = new Date(comparisonTime); // 일출
      targetSunriseDate.setDate(targetSunriseDate.getDate() + 1);
      const targetFormattedToday = dateFormatter(targetSunsetDate);
      const targetFormattedTommorw = dateFormatter(targetSunriseDate);
      if (
        riseset.locdate[0] === targetFormattedToday ||
        riseset.locdate[0] === targetFormattedTommorw
      ) {
        return true;
      }
    });
    return seletedRiseset;
  }
);
export default risesetSlice.reducer;
