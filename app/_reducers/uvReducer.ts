import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import type { GRADE_OBJ, UV } from "../_types/types";
import {
  FAILED,
  FULFILLED,
  IDLE,
  LOADING,
} from "../_helpers/constants/constants";
import { getInitialComparisonTime } from "../_hooks/redux_hooks";
import dayjs from "../_lib/dayjs";
import axios from "axios";

interface HourlyDataItem {
  code: string;
  areaNo: string;
  date: string;
  h0: string;
  h3: string;
  h6: string;
  h9: string;
  h12: string;
  h15: string;
  h18: string;
  h21: string;
  h24: string;
  h27: string;
  h30: string;
  h33: string;
  h36: string;
  h39: string;
  h42: string;
  h45: string;
  h48: string;
  h51: string;
  h54: string;
  h57: string;
  h60: string;
  h63: string;
  h66: string;
  h69: string;
  h72: string;
  h75: string;
}

interface HourlyResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: HourlyDataItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export const fetchUV = createAsyncThunk(
  "uvSlice/fetchUV",
  async (hcode: string) => {
    const currentDate = dayjs().tz();
    const fetchURL = makeUVRequestURL(currentDate, hcode);

    const response = await axios.get<HourlyResponse>(fetchURL);
    const { data } = response;
    const uvdata = data.response.body.items.item[0];
    const result = convertUVObjToHourlyList(uvdata);
    return result;
  }
);

interface UVState {
  uvList: UV[];
  comparisonTime: number;
  status: string;
  error: SerializedError;
}

const initialState: UVState = {
  uvList: [],
  comparisonTime: null,
  status: IDLE,
  error: null,
};

export const uvSlice = createSlice({
  name: "uvSlice",
  initialState,
  reducers: {
    uvComparisonTimeUpdated: (state, action: PayloadAction<number>) => {
      state.comparisonTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUV.pending, (state, action) => {
      state.status = LOADING;
    });
    builder.addCase(fetchUV.fulfilled, (state, action) => {
      state.status = FULFILLED;
      state.uvList = action.payload;
      state.comparisonTime = getInitialComparisonTime();
    });
    builder.addCase(fetchUV.rejected, (state, action) => {
      state.status = FAILED;
      state.error = action.error;
    });
  },
});

export const { uvComparisonTimeUpdated } = uvSlice.actions;
export const selectMatchedUV = (state: RootState) =>
  state.uv.uvList.find((uv) => uv.dt === state.uv.comparisonTime);
export const selectCurrentUV = (state: RootState) =>
  state.uv.uvList.find((uv) => uv.dt === getInitialComparisonTime());
export default uvSlice.reducer;

const makeUVRequestURL = (currentDate: dayjs.Dayjs, areaNo: string) => {
  const baseDate = currentDate.format("YYYYMMDD");
  const baseTime = getNearPredictionTime(currentDate);
  return `/api/uv?hcode=${areaNo}&base_date=${baseDate}&base_time=${baseTime}`;
};

/**
 *
 * Base_time : 03, 06, 09, 12, 15, 18, 21, 24 (1일 8회)
 * @param hours
 * @returns 현재 시간에 제일 가까운 요청시간
 */
const getNearPredictionTime = (date: dayjs.Dayjs): string => {
  const forecastTimes: number[] = [0, 3, 6, 9, 12, 15, 18, 21];
  const currentHour = date.hour();
  const currentMinute = date.minute();
  let nextTime = forecastTimes[0];
  for (const time of forecastTimes) {
    if (currentHour < time || (currentHour === time && currentMinute >= 20)) {
      nextTime = time;
      break;
    }
  }
  return nextTime.toString().padStart(2, "0");
};

/**
 *
 * @param value uv 지수
 * @returns 지수를 단계 변환한 값
 */
const convertValueToGrade = (value: number): GRADE_OBJ => {
  let grade = "";
  if (value >= 11) {
    grade = "위험";
  } else if (value >= 8) {
    grade = "매우나쁨";
  } else if (value >= 6) {
    grade = "나쁨";
  } else if (value >= 3) {
    grade = "보통";
  } else grade = "좋음";

  return { grade, value };
};

const convertUVObjToHourlyList = (uv: HourlyDataItem) => {
  const uvList = [] as {
    dt: number;
    components: { uv: GRADE_OBJ };
  }[];

  const strForcastDate = uv.date;
  const year = parseInt(strForcastDate.slice(0, 4));
  const month = parseInt(strForcastDate.slice(4, 6));
  const day = parseInt(strForcastDate.slice(6, 8));
  const hour = parseInt(strForcastDate.slice(8, 10));

  const forcastDate = dayjs()
    .tz()
    .year(year)
    .month(month - 1)
    .date(day);
  let prevVal = "";
  for (let i = 0; i < 76; i++) {
    const value = uv[`h${i}`];
    const elapsedHour = i + hour;
    let date = dayjs(forcastDate)
      .tz()
      .hour(elapsedHour)
      .minute(0)
      .second(0)
      .millisecond(0);
    if (value) {
      prevVal = value;
      uvList.push({
        dt: date.unix() * 1000,
        components: { uv: convertValueToGrade(parseInt(value)) },
      });
    } else if (value === undefined && prevVal) {
      uvList.push({
        dt: date.unix() * 1000,
        components: { uv: convertValueToGrade(parseInt(prevVal)) },
      });
    } else {
      prevVal = "";
      uvList.push({
        dt: date.unix() * 1000,
        components: { uv: { grade: "", value: 0 } },
      });
    }
  }
  return uvList;
};
