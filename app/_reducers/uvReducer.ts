import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState, getInitialComparisonTime } from "../store";
import type { UV } from "../_types/types";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";

export const fetchUV = createAsyncThunk(
  "uvSlice/fetchUV",
  async (hcode: string) => {
    const currentHours = new Date().getHours();
    const response = await fetch('api/uv?', {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        hcode,
        date: new Date().toISOString(),
      })
    });
    const { data } = await response.json();
    return data;
  }
);

interface UVState {
  uvList: UV[];
  comparisonTime: number;
  status: string;
}

const initialState: UVState = {
  uvList: [],
  comparisonTime: null,
  status: LOADING,
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
    });
  },
});

export const { uvComparisonTimeUpdated } = uvSlice.actions;
export const selectMatchedUV = (state: RootState) =>
  state.uv.uvList.find((uv) => uv.dt === state.uv.comparisonTime);
export const selectCurrentUV = (state: RootState) =>
  state.uv.uvList.find((uv) => uv.dt === getInitialComparisonTime());
export default uvSlice.reducer;
