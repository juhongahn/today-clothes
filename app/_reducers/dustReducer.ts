import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getInitialComparisonTime } from "../_hooks/redux_hooks";
import type { DUST, GRADE_OBJ } from "../_types/types";
import {
  FAILED,
  FULFILLED,
  IDLE,
  LOADING,
} from "../_helpers/constants/constants";
import axios from "axios";

type OPEN_WEATHER_RES = {
  coord: {
    lat: number;
    lon: number;
  };
  list: [
    {
      components: {
        co: number;
        nh3: number;
        no: number;
        no2: number;
        o3: number;
        pm2_5: number;
        pm10: number;
        so2: number;
      };
      dt: number;
      main: {
        aqi: number;
      };
    }
  ];
};

type RESPONSE = {
  dt: number;
  components: {
    co: GRADE_OBJ;
    no: number;
    no2: GRADE_OBJ;
    o3: GRADE_OBJ;
    so2: GRADE_OBJ;
    pm2_5: GRADE_OBJ;
    pm10: GRADE_OBJ;
    nh3: number;
  };
};

enum DUST_INDEX {
  SO2 = "so2",
  CO = "co",
  O3 = "o3",
  NO2 = "no2",
  PM10 = "pm10",
  PM2_5 = "pm2_5",
}

export const fetchDust = createAsyncThunk(
  "dustSlice/fetchDust",
  async (geolocation: { latitude: number; longitude: number }) => {
    const query = `/api/dust?lat=${geolocation.latitude}&lon=${geolocation.longitude}`;
    const { data } = await axios.get<OPEN_WEATHER_RES>(query);
    const result = data.list.map((data): RESPONSE => {
      return {
        dt: data.dt * 1000,
        components: {
          so2: convertValueToGrade(DUST_INDEX.SO2, data.components.so2),
          co: convertValueToGrade(DUST_INDEX.CO, data.components.co),
          no2: convertValueToGrade(DUST_INDEX.NO2, data.components.no2),
          pm10: convertValueToGrade(DUST_INDEX.PM10, data.components.pm10),
          pm2_5: convertValueToGrade(DUST_INDEX.PM2_5, data.components.pm2_5),
          o3: convertValueToGrade(DUST_INDEX.O3, data.components.o3),
          no: data.components.no,
          nh3: data.components.nh3,
        },
      };
    });
    return result;
  }
);

interface DustState {
  dustList: DUST[];
  comparisonTime: number;
  status: string;
  error: SerializedError;
}

const initialState: DustState = {
  dustList: [],
  comparisonTime: null,
  status: IDLE,
  error: null,
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
      state.error = action.error;
    });
  },
});

const thresholds = {
  [DUST_INDEX.SO2]: [20, 80, 250, 350],
  [DUST_INDEX.NO2]: [40, 70, 150, 200],
  [DUST_INDEX.PM10]: [20, 50, 100, 200],
  [DUST_INDEX.PM2_5]: [10, 25, 50, 75],
  [DUST_INDEX.O3]: [60, 100, 140, 180],
  [DUST_INDEX.CO]: [4400, 9400, 12400, 15400],
};

const convertValueToGrade = (type: DUST_INDEX, value: number) => {
  const indexThresholds = thresholds[type];
  let grade = "";
  if (value >= indexThresholds[3]) grade = "위험";
  else if (value >= indexThresholds[2]) grade = "매우나쁨";
  else if (value >= indexThresholds[1]) grade = "나쁨";
  else if (value >= indexThresholds[0]) grade = "보통";
  else grade = "좋음";

  return { grade, value };
};

export const { dustComparisonTimeUpdated } = dustSlice.actions;
export const selectMatchedDust = (state: RootState) =>
  state.dust.dustList.find((dust) => dust.dt === state.dust.comparisonTime);
export const selectCurrentDust = (state: RootState) =>
  state.dust.dustList.find((dust) => dust.dt === getInitialComparisonTime());
export default dustSlice.reducer;
