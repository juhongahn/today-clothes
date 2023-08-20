"use client";

import Tour from "./Tour";
import { useAppDispatch, useAppSelector } from "../../_hooks/redux_hooks";
import { fetchTour } from "../../_reducers/tourReducer";

const TourWrapper = () => {
  useTourData();
  return <Tour />;
};

export type GetTourDataReturn = {
  title: string;
  location: string;
  image: string;
}[];

const useTourData = () => {
  // const dispatch = useAppDispatch();
  // dispatch(fetchTour("tour"));
};

export default TourWrapper;
