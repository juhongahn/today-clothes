import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import type { Local } from "../_types/types";
import {
  FAILED,
  FULFILLED,
  IDLE,
  LOADING,
} from "../_helpers/constants/constants";
import { HttpError } from "../_helpers/error-class/HttpError";
import axios from "axios";

export const fetchLocal = createAsyncThunk(
  "localSlice/fetchLocal",
  async (geolocation: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = geolocation;
    const response = await axios.get(
      `/api/local?x=${longitude}&y=${latitude}`,
    );
    const { data } = response;
    const { documents } = data;
    return documents;
  }
);

interface LocalState {
  localList: Local[];
  selectedLocal: Local | null;
  status: string;
  error: Error | HttpError;
}

const initialState: LocalState = {
  localList: [],
  selectedLocal: null,
  status: IDLE,
  error: null,
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
