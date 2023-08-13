import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState, getInitialComparisonTime } from "../store";
import { Weather } from "../_types/types";
import { appFetch } from "../_helpers/custom-fetch/fetchWrapper";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";

export const fetchWeathers = createAsyncThunk(
  "weatherSlice/fetchWeathers",
  async (location: { latitude: number; longitude: number }) => {
    const currentHours = new Date().getHours();
    const response = await appFetch(
      `api/weather?lat=${location.latitude}&lon=${location.longitude}&hours=${currentHours}`,
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
export default weatherSlice.reducer;