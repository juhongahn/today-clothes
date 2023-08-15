import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchUV } from "./uvReducer";
import type { Local } from "../_types/types";
import { appFetch } from "../_helpers/custom-fetch/fetchWrapper";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";
import { fetchMidTermForcast } from "./midTermForcastReducer";

export const fetchLocal = createAsyncThunk(
  "localSlice/fetchLocal",
  async (geolocation: { latitude: number; longitude: number }, thunkAPI) => {
    const response = await appFetch(
      `api/local?lat=${geolocation.latitude}&lon=${geolocation.longitude}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const { data } = await response.json();
    thunkAPI.dispatch(fetchUV(data[1].code)); // 행정 코드를 기반으로 UV 데이터 요청
    const midTermForcastParams = {
      si: data[1].region_2depth_name.split(" ")[0],
      do: data[1].region_1depth_name,
    };
    thunkAPI.dispatch(fetchMidTermForcast(midTermForcastParams));
    return data;
  }
);

interface localState {
  localList: Local[];
  selectedLocal: Local | null;
  status: string;
}

const initialState: localState = {
  localList: [],
  selectedLocal: null,
  status: LOADING,
};

export const localSlice = createSlice({
  name: "localSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLocal.pending, (state, action) => {
      state.status = LOADING;
    });
    builder.addCase(fetchLocal.fulfilled, (state, action) => {
      state.status = FULFILLED;
      state.localList = action.payload;
      const currentlocal = action.payload[1];
      state.selectedLocal = currentlocal;
    });
    builder.addCase(fetchLocal.rejected, (state, action) => {
      state.status = FAILED;
    });
  },
});

export const selectLocal = (state: RootState) => state.local.selectedLocal;
export default localSlice.reducer;
