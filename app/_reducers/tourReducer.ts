import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { appFetch } from "../_helpers/custom-fetch/fetchWrapper";
import { FAILED, FULFILLED, LOADING } from "../_helpers/constants/constants";

export const fetchTour = createAsyncThunk(
  "tourSlice/fetchTour",
  async (keyword: {
    id: string,
    title: string,
    contentTypeId: number,
  }) => {
    const response = await appFetch(`api/toursite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(keyword)
    });
    const data = await response.json();
    return data;
  }
);

interface tourState {
  tourList: { title: string; location: string; image: string }[];
  status: string;
}

const initialState: tourState = {
  tourList: [],
  status: LOADING,
};

export const tourSlice = createSlice({
  name: "tourSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTour.pending, (state, action) => {
      state.status = LOADING;
    });
    builder.addCase(fetchTour.fulfilled, (state, action) => {
      state.status = FULFILLED;
      state.tourList = action.payload;
    });
    builder.addCase(fetchTour.rejected, (state, action) => {
      state.status = FAILED;
    });
  },
});

export const selectTourList = (state: RootState) => state.tour.tourList;
export default tourSlice.reducer;
