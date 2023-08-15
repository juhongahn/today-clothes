import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState, getInitialComparisonTime } from "../store";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";
import { MidTermForcast } from "../api/mid-term-forcast/route";

export const fetchMidTermForcast = createAsyncThunk(
  "midTermForcastSlice/fetchMidTermForcast",
  async (arg: {
    si: string,
    do: string
  }) => {
    const response = await fetch(`api/mid-term-forcast?hlRegion=${arg.si}&wfRegion=${arg.do}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
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
