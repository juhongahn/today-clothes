"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../_hooks/redux_hooks";
import { COORDS } from "../_types/types";
import { fetchRiseset } from "../_reducers/risesetReducer";
import { fetchWeathers } from "../_reducers/weatherReducer";
import Loading from "../_components/weather/charts/Loading";
import {
  checkError,
  checkLoadingOrIdle,
  hasArrayTarget,
} from "../_lib/checkStatusUtils";

interface Props {
  children: React.ReactNode;
}

const ChartsFetcher = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const weatherStatus = useAppSelector((state) => state.weather.status);
  const risesetStatus = useAppSelector((state) => state.riseset.status);
  const statusList = [
    { name: "weather", status: weatherStatus },
    { name: "riseset", status: risesetStatus },
  ];

  useEffect(() => {
    const strCoords = sessionStorage.getItem("coords");
    const coords: COORDS = JSON.parse(strCoords);
    dispatch(fetchWeathers(coords));
    dispatch(fetchRiseset(coords));
  }, []);

  if (hasArrayTarget(statusList, checkError)) throw new Error("api error");
  if (hasArrayTarget(statusList, checkLoadingOrIdle)) return <Loading />;

  return children;
};

export default ChartsFetcher;
