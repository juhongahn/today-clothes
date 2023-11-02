"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../_hooks/redux_hooks";
import { checkError, hasArrayTarget } from "../_lib/checkStatusUtils";
import { fetchTour } from "../_reducers/tourReducer";

interface Props {
  children: React.ReactNode;
}

const TourFetcher = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const tourStatus = useAppSelector((state) => state.tour.status);
  const statusList = [{ name: "tour", status: tourStatus }];
  useEffect(() => {
    dispatch(fetchTour({ id: "tour", title: "관광지", contentTypeId: 12 }));
  }, []);

  if (hasArrayTarget(statusList, checkError)) throw new Error("api error");
  return children;
};

export default TourFetcher;
