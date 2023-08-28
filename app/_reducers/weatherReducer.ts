import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState, getInitialComparisonTime } from "../store";
import { Weather } from "../_types/types";
import { appFetch } from "../_helpers/custom-fetch/fetchWrapper";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";
import { dateFormatter } from "../_lib/weatherUtils";

export const fetchWeathers = createAsyncThunk(
  "weatherSlice/fetchWeathers",
  async (location: { latitude: number; longitude: number }) => {
    const response = await appFetch("api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        lat: location.latitude,
        lon: location.longitude,
        date: new Date().toISOString(),
      }),
    });
    const { data } = await response.json();
    return data;
  }
);

interface WeatherState {
  weatherList: Weather[];
  comparisonTime: number;
  status: string;
}

const initialState: WeatherState = {
  weatherList: [],
  comparisonTime: null,
  status: LOADING,
};

export const weatherSlice = createSlice({
  name: "weatherSlice",
  initialState,
  reducers: {
    weatherComparisonTimeUpdated: (state, action: PayloadAction<number>) => {
      state.comparisonTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWeathers.pending, (state, action) => {
      state.status = LOADING;
    });
    builder.addCase(fetchWeathers.fulfilled, (state, action) => {
      state.status = FULFILLED;
      state.weatherList = action.payload;
      state.comparisonTime = getInitialComparisonTime();
    });
    builder.addCase(fetchWeathers.rejected, (state, action) => {
      state.status = FAILED;
    });
  },
});

export const { weatherComparisonTimeUpdated } = weatherSlice.actions;
export const selectWeatherList = (state: RootState) =>
  state.weather.weatherList;
export const selectMatchedWeather = (state: RootState) =>
  state.weather.weatherList.find(
    (weather) => weather.dt === state.weather.comparisonTime
  );
export const selectCurrentWeather = (state: RootState) =>
  state.weather.weatherList.find(
    (weather) => weather.dt === getInitialComparisonTime()
  );

export const selectThreeDaysForcast = createSelector(
  [selectWeatherList],
  (weathers) => {
    const amPmWeatherObj = {};
    const currentDate = new Date();
    weathers.forEach((weather) => {
      const comparisonDate = new Date(weather.dt);
      if (comparisonDate.getDate() === currentDate.getDate()) {
        const comparisonHours = comparisonDate.getHours();
        if (comparisonHours === 7 || comparisonHours === 14) {
          const keyDate = dateFormatter(currentDate, "");
          if (!amPmWeatherObj[keyDate]) {
            amPmWeatherObj[keyDate] = {};
          }
          if (comparisonHours === 7) {
            amPmWeatherObj[keyDate]["am"] = weather;
          } else {
            amPmWeatherObj[keyDate]["pm"] = weather;
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      }
    });

    const result: {
      fcstDate: string;
      am: Weather;
      pm: Weather;
    }[] = [];

    for (const fcstDate in amPmWeatherObj) {
      const { am, pm } = amPmWeatherObj[fcstDate];
      result.push({
        fcstDate,
        am,
        pm,
      });
    }
    return result;
  }
);
export default weatherSlice.reducer;
