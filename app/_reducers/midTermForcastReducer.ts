import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  FAILED,
  FULFILLED,
  IDLE,
  LOADING,
} from "../_helpers/constants/constants";
import axios from "axios";
import dayjs from "../_lib/dayjs";
import { HLTemperatureResponseType } from "../_lib/hlTemperatureFetch";
import { FcstResponseType } from "../_lib/fcstFetch";

export const fetchMidTermForcast = createAsyncThunk(
  "midTermForcastSlice/fetchMidTermForcast",
  async (arg: { si: string; do: string }) => {
    const { si: siName, do: doName } = arg;
    const currentDate = dayjs().tz();
    const tmFc = requestDateFormmator(currentDate);
    const midForcastReqUrl = `api/midterm-forcast?wfRegion=${doName}&tmFc=${tmFc}`;
    const midTemperatureReqUrl = `api/midterm-temperature?hlRegion=${siName}&wfRegion=${doName}&tmFc=${tmFc}`;

    const tempPromise = axios.get<HLTemperatureResponseType>(midTemperatureReqUrl);
    const fcstPromise = axios.get<FcstResponseType>(midForcastReqUrl);

    const [hlTemperatureRes, fcstRes] = await Promise.all([tempPromise, fcstPromise]);
    const hlTemperature = hlTemperatureRes.data;
    const fcst = fcstRes.data;
    const result = parsingMidTermForcastData(hlTemperature, fcst, currentDate);
    return result;
  }
);

interface MidTermForcastState {
  midTermForcastList: MidTermForcast[];
  status: string;
  error: SerializedError;
}

const initialState: MidTermForcastState = {
  midTermForcastList: [],
  status: IDLE,
  error: null,
};

export const midTermForcastSlice = createSlice({
  name: "midTermForcastSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMidTermForcast.pending, (state, action) => {
      state.status = LOADING;
    });
    builder.addCase(fetchMidTermForcast.fulfilled, (state, action) => {
      state.status = FULFILLED;
      state.midTermForcastList = action.payload;
    });
    builder.addCase(fetchMidTermForcast.rejected, (state, action) => {
      state.status = FAILED;
      state.error = action.error;
    });
  },
});

export const selectMidTermForcast = (state: RootState) =>
  state.midTermForcast.midTermForcastList;
export default midTermForcastSlice.reducer;

const requestDateFormmator = (date: dayjs.Dayjs) => {
  const dateCopy = dayjs(date).tz();
  const hours = date.hour();
  let targetDate: dayjs.Dayjs;
  if (hours < 18) {
    targetDate = dateCopy.subtract(1, "day");
  } else {
    targetDate = dateCopy;
  }
  return targetDate.format("YYYYMMDD").concat("1800");
};

export interface MidTermForcast {
  dt: string;
  hlTemperature: {
    tmx: number;
    tmn: number;
  };
  fcst: {
    pop: {
      popAM: number;
      popPM: number;
    };
    weatherForcast: {
      wfAM: string;
      wfPM: string;
    };
  };
}

const parsingMidTermForcastData = (
  hlTemperature: HLTemperatureResponseType,
  fcst: FcstResponseType,
  baseDate: dayjs.Dayjs
): MidTermForcast[] => {
  const result: MidTermForcast[] = [];
  
  const hlTemperatureItem = hlTemperature.response.body.items.item[0];
  const fcstItem = fcst.response.body.items.item[0];
  
  for (let i = 3; i <= 10; i++) {
    const targetDate = dayjs(baseDate).tz().add(i + 1, "day");
    const formattedItem = {
      dt: targetDate.format("YYYYMMDD"),
      hlTemperature: {
        tmx: hlTemperatureItem[`taMax${i}`],
        tmn: hlTemperatureItem[`taMin${i}`],
      },
      fcst: {
        pop: {
          popAM:
            fcstItem[`rnSt${i}Am`] !== undefined
              ? fcstItem[`rnSt${i}Am`]
              : fcstItem[`rnSt${i}`],
          popPM:
            fcstItem[`rnSt${i}Pm`] !== undefined
              ? fcstItem[`rnSt${i}Pm`]
              : fcstItem[`rnSt${i}`],
        },
        weatherForcast: {
          wfAM:
            fcstItem[`wf${i}Am`] !== undefined
              ? fcstItem[`wf${i}Am`]
              : fcstItem[`wf${i}`],
          wfPM:
            fcstItem[`wf${i}Pm`] !== undefined
              ? fcstItem[`wf${i}Pm`]
              : fcstItem[`wf${i}`],
        },
      },
    };
    result.push(formattedItem);
  }
  return result;
};