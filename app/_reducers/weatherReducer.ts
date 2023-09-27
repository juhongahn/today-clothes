import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
  SerializedError,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { WEATHER } from "../_types/types";
import {
  FAILED,
  FULFILLED,
  IDLE,
  LOADING,
} from "../_helpers/constants/constants";
import dayjs from "../_lib/dayjs";
import { getInitialComparisonTime } from "../_hooks/redux_hooks";
import { dfs_xy_conv } from "../_lib/gridConverter";
import axios from "axios";

interface ForecastItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: string;
  ny: string;
}

interface ForecastResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: ForecastItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export const fetchWeathers = createAsyncThunk(
  "weatherSlice/fetchWeathers",
  async (geolocation: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = geolocation;
    const currentDate = dayjs().tz();
    const predictionDate = getNearPredictionTime(currentDate);
    const fetchURL = makeWeatherRequestURL(predictionDate, latitude, longitude);
    const response = await axios.get<ForecastResponse>(fetchURL);
    const { data } = response;
    const items = data.response.body.items.item;
    const hotLowTemperatureList = extractHotLowTemperatureList(items);
    const result = groupHLTempWithHourlyFcstValue(items, hotLowTemperatureList);
    return result;
  }
);

interface WeatherState {
  weatherList: WEATHER[];
  comparisonTime: number;
  status: string;
  error: SerializedError;
}

const initialState: WeatherState = {
  weatherList: [],
  comparisonTime: null,
  status: IDLE,
  error: null,
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
      state.error = action.error;
    });
  },
});

export const { weatherComparisonTimeUpdated } = weatherSlice.actions;
export const selectWeatherList = (state: RootState) =>
  state.weather.weatherList;
export const selecteMemoizedWeatherList = createSelector(
  [selectWeatherList],
  (weathers) => weathers
);
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
    let currentDate = dayjs().tz().minute(0).second(0).millisecond(0);
    for (let i = 0; i < weathers.length; i++) {
      const weather = weathers[i];
      const targetDate = dayjs(currentDate).tz();
      const comparisonDate = dayjs(weather.dt).tz();
      if (targetDate.date() === comparisonDate.date()) {
        const comparisonHours = comparisonDate.hour();
        if (comparisonHours === 7 || comparisonHours === 14) {
          const keyDate = comparisonDate.format("YYYYMMDD");
          if (!amPmWeatherObj[keyDate]) {
            amPmWeatherObj[keyDate] = {};
          }
          if (comparisonHours === 7) {
            amPmWeatherObj[keyDate]["am"] = weather;
          } else {
            amPmWeatherObj[keyDate]["pm"] = weather;
          }
        }
      } else if (targetDate.isBefore(comparisonDate)) {
        currentDate = currentDate.add(1, "day");
      }
    }
    const result: {
      fcstDate: string;
      am: WEATHER;
      pm: WEATHER;
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

const groupHLTempWithHourlyFcstValue = (
  weatherItems: ForecastItem[],
  minMaxList: HotLowTemperature[]
) => {
  const transformedData = [] as {
    dt: number;
    value: {
      [x: string]: string;
      TMX: string;
      TMN: string;
    };
  }[];

  weatherItems.forEach((item) => {
    const { fcstDate, fcstTime, fcstValue, category } = item;
    const unixTime = convertToUnixTime(fcstDate, fcstTime);

    const existingData = transformedData.find((data) => data.dt === unixTime);
    const { TMX, TMN } =
      minMaxList.find((data) => data.fcstDate === fcstDate) || {};
    if (existingData) {
      existingData.value[category.toUpperCase()] = fcstValue;
    } else {
      const newData = {
        dt: unixTime,
        value: {
          [category.toUpperCase()]: fcstValue,
          TMX,
          TMN,
        },
      };
      transformedData.push(newData);
    }
  });
  return transformedData;
};

type HotLowTemperature = {
  fcstDate: string;
  TMX?: string;
  TMN?: string;
};

const extractHotLowTemperatureList = (items: ForecastItem[]) => {
  const hlTemperatureList = items.filter(isHLTemperature);
  const hlTemperatureListWithFcstDate = hlTemperatureList.reduce(
    makeTemperatureObjList,
    []
  );
  return hlTemperatureListWithFcstDate;
};

const isHLTemperature = (item: ForecastItem) =>
  item.category === "TMX" || item.category === "TMN";

const makeTemperatureObjList = (
  accHLTemperatureList: HotLowTemperature[],
  currentValue: ForecastItem
) => {
  const fcstDate = currentValue.fcstDate;
  const fcstValue = currentValue.fcstValue;
  const existingTemperatureObj = accHLTemperatureList.find(
    (data) => data.fcstDate === fcstDate
  );
  if (existingTemperatureObj) {
    if (currentValue.category === "TMX") existingTemperatureObj.TMX = fcstValue;
    else existingTemperatureObj.TMN = fcstValue;
  } else {
    const newTemperatureObj = {
      fcstDate,
      TMX: currentValue.category === "TMX" ? fcstValue : null,
      TMN: currentValue.category === "TMN" ? fcstValue : null,
    };
    accHLTemperatureList.push(newTemperatureObj);
  }
  return accHLTemperatureList;
};

const convertToUnixTime = (fcstDate: string, fcstTime: string) => {
  const year = parseInt(fcstDate.substring(0, 4));
  const month = parseInt(fcstDate.substring(4, 6)) - 1; // 월은 0부터 시작하므로 1을 빼줌
  const day = parseInt(fcstDate.substring(6, 8));
  const hours = parseInt(fcstTime.substring(0, 2));
  const minutes = parseInt(fcstTime.substring(2));
  const unixTime =
    dayjs()
      .tz()
      .year(year)
      .month(month)
      .date(day)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .unix() * 1000;
  return unixTime;
};

const makeWeatherRequestURL = (
  predictionDate: {
    baseDate: string;
    baseTime: string;
  },
  lat: number,
  lon: number
) => {
  const { x: nx, y: ny } = dfs_xy_conv("toXY", lat, lon);
  return `/api/weather?base_date=${predictionDate.baseDate}&base_time=${predictionDate.baseTime}&nx=${nx}&ny=${ny}`;
};

const getNearPredictionTime = (
  currentDate: dayjs.Dayjs
): {
  baseDate: string;
  baseTime: string;
} => {
  if (currentDate.hour() < 18) {
    const baseDate = currentDate.add(-1, "day").format("YYYYMMDD");
    return {
      baseDate,
      baseTime: "2300",
    };
  } else {
    const baseDate = currentDate.format("YYYYMMDD");
    return {
      baseDate,
      baseTime: "1700",
    };
  }
};
