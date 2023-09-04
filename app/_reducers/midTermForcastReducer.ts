import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";
import { MidTermForcast } from "../api/mid-term-forcast/route";

export const fetchMidTermForcast = createAsyncThunk(
  "midTermForcastSlice/fetchMidTermForcast",
  async (arg: { si: string; do: string }) => {
    const currentDate = new Date();
    const response = await fetch("api/mid-term-forcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        hlRegion: arg.si,
        wfRegion: arg.do,
        date: currentDate.toString(),
      })
    });
    const { data } = await response.json();
    return data;
  }
);

interface UVState {
  midTermForcastList: MidTermForcast[];
  status: string;
}

const initialState: UVState = {
  midTermForcastList: [],
  status: LOADING,
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
    });
  },
});

export const selectMidTermForcast = (state: RootState) =>
  state.midTermForcast.midTermForcastList;
export default midTermForcastSlice.reducer;
