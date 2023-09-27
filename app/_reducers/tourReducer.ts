import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  FAILED,
  FULFILLED,
  IDLE,
  LOADING,
} from "../_helpers/constants/constants";
import axios from "axios";

type Response = {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: TourismItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
};

type TourismItem = {
  addr1: string;
  addr2: string;
  areacode: string;
  booktour: string;
  cat1: string;
  cat2: string;
  cat3: string;
  contentid: string;
  contenttypeid: string;
  createdtime: string;
  firstimage: string;
  firstimage2: string;
  cpyrhtDivCd: string;
  mapx: string;
  mapy: string;
  mlevel: string;
  modifiedtime: string;
  sigungucode: string;
  tel: string;
  title: string;
};

export const fetchTour = createAsyncThunk(
  "tourSlice/fetchTour",
  async (keyword: { id: string; title: string; contentTypeId: number }) => {
    const { id, title, contentTypeId } = keyword;
    const query = `/api/tour?&keyword=${encodeURI(
      title
    )}&contentTypeId=${contentTypeId}`;
    const response = await axios.get<Response>(query);
    const { data } = response;
    const result = formateData(data.response.body.items.item);
    return result;
  }
);

interface tourState {
  tourList: TourResponseType[];
  status: string;
}

const initialState: tourState = {
  tourList: [],
  status: IDLE,
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

interface TourResponseType {
  title: string;
  location: string;
  image: string;
}

function formateData(tourItems: TourismItem[]): TourResponseType[] {
  const items: TourResponseType[] = [];

  for (const item of tourItems) {
    if (item.firstimage) {
      items.push({
        title: item.title,
        location: item.addr1,
        image: item.firstimage,
      });
    }
  }

  return items;
}
