import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
  SerializedError,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import type { RISESET } from "../_types/types";
import {
  FAILED,
  FULFILLED,
  IDLE,
  LOADING,
} from "../_helpers/constants/constants";
import { dateFormatter } from "../_lib/weatherUtils";
import { getInitialComparisonTime } from "../_hooks/redux_hooks";
import dayjs from "../_lib/dayjs";
import axios from "axios";

type RisesetResponseJSON = {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: {
          aste: string;
          astm: string;
          civile: string;
          civilm: string;
          latitude: number;
          latitudeNum: string;
          location: string;
          locdate: number;
          longitude: number;
          longitudeNum: string;
          moonrise: string;
          moonset: string;
          moontransit: string;
          naute: string;
          nautm: string;
          sunrise: string;
          sunset: string;
          suntransit: number;
        };
      };
    };
  };
};

export const fetchRiseset = createAsyncThunk(
  "risesetSlice/fetchRiseset",
  async (geolocation: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = geolocation;
    const currentDate = dayjs().tz();
    const promiseList = createPromiseList(currentDate, 5, latitude, longitude);
    const risesetResponseList = await Promise.all(promiseList);
    const result = risesetResponseList.map(
      (res) => res.data.response.body.items.item
    );
    return result;
  }
);

interface RisesetState {
  risesetList: RISESET[];
  comparisonTime: number;
  status: string;
  error: SerializedError;
}

const initialState: RisesetState = {
  risesetList: [],
  comparisonTime: null,
  status: IDLE,
  error: null,
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
      state.error = action.error;
    });
  },
});

export const selectComparisonTime = (state: RootState) =>
  state.riseset.comparisonTime;

export const selectRisesetList = (state: RootState) =>
  state.riseset.risesetList;

export const { risesetComparisonTimeUpdated } = risesetSlice.actions;

export const selectMatchedRiseset = createSelector(
  [selectRisesetList, selectComparisonTime],
  (risesetList, comparisonTime) => {
    const seletedRiseset = risesetList.filter((riseset) =>
      isMatchedsunRiseSet(riseset, comparisonTime)
    );
    return seletedRiseset;
  }
);

const isMatchedsunRiseSet = (riseset: RISESET, comparisonTime: number) => {
  const targetSunsetDate = new Date(comparisonTime); // 일몰
  const targetSunriseDate = new Date(comparisonTime); // 일출
  targetSunriseDate.setDate(targetSunriseDate.getDate() + 1);
  const targetFormattedToday = dateFormatter(targetSunsetDate, "");
  const targetFormattedTommorw = dateFormatter(targetSunriseDate, "");
  if (
    riseset.locdate.toString() === targetFormattedToday ||
    riseset.locdate.toString() === targetFormattedTommorw
  ) {
    return true;
  } else {
    return false;
  }
};
export default risesetSlice.reducer;

const createPromiseList = (
  startDate: dayjs.Dayjs,
  targetDays: number,
  lat: number,
  lon: number
) => {
  const dateList: dayjs.Dayjs[] = [startDate];
  for (let i = 0; i < targetDays; i++) {
    const nextDate = dateList[i].add(1, "day");
    dateList.push(nextDate);
  }
  const promiseList = dateList.map((date) => {
    const formattedDay = date.format("YYYYMMDD");
    return fetcher(lat, lon, formattedDay);
  });
  return promiseList;
};

const fetcher = async (lat: number, lon: number, date: string) => {
  const query = `/api/riseset?locdate=${date}&longitude=${lon}&latitude=${lat}&dnYn=Y`;
  const response = axios.get<RisesetResponseJSON>(query);
  return response;
};
