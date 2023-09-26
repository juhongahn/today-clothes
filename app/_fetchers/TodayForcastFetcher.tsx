"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../_hooks/redux_hooks";
import { useRouter } from "next/navigation";
import { selectMatchedWeather } from "../_reducers/weatherReducer";
import { fetchDust, selectMatchedDust } from "../_reducers/dustReducer";
import { selectMatchedRiseset } from "../_reducers/risesetReducer";
import {
  checkError,
  checkLoadingOrIdle,
  hasArrayTarget,
} from "../_lib/checkStatusUtils";
import { fetchUV, selectMatchedUV } from "../_reducers/uvReducer";
import { updateTodayForcastState } from "../_reducers/todayForcastReducer";
import { COORDS } from "../_types/types";
import Loading from "../_components/weather/today_forcast/Loading";
import { FULFILLED, IDLE } from "../_helpers/constants/constants";

interface Props {
  children: React.ReactNode;
}

const TodayForcastFetcher = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const weatherStatus = useAppSelector((state) => state.weather.status);
  const { status: localStatus, selectedLocal } = useAppSelector(
    (state) => state.local
  );
  const uvStatus = useAppSelector((state) => state.uv.status);
  const dustStatus = useAppSelector((state) => state.dust.status);
  const risesetStatus = useAppSelector((state) => state.riseset.status);

  const weather = useAppSelector(selectMatchedWeather);
  const uv = useAppSelector(selectMatchedUV);
  const dust = useAppSelector(selectMatchedDust);
  const riseset = useAppSelector(selectMatchedRiseset);

  const statusList = [
    { name: "weather", status: weatherStatus },
    { name: "local", status: localStatus },
    { name: "uv", status: uvStatus },
    { name: "dust", status: dustStatus },
    { name: "riseset", status: risesetStatus },
  ];

  useEffect(() => {
    const strCoords = sessionStorage.getItem("coords");
    const coords: COORDS = JSON.parse(strCoords);
    if (localStatus === FULFILLED) dispatch(fetchUV(selectedLocal.code));
    if (dustStatus === IDLE) dispatch(fetchDust(coords));
  }, [localStatus]);

  if (hasArrayTarget(statusList, checkError)) {
    throw new Error("api error");
  }
  if (hasArrayTarget(statusList, checkLoadingOrIdle)) return <Loading />;

  const todayForcastState = {
    weather,
    uv,
    dust,
    riseset,
  };
  dispatch(updateTodayForcastState(todayForcastState));
  return children;
};

export default TodayForcastFetcher;
