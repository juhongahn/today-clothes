"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../_hooks/redux_hooks";
import { FULFILLED } from "../_helpers/constants/constants";
import Loading from "../_components/weather/weeklyForcast/Loading";
import {
  checkError,
  checkLoadingOrIdle,
  hasArrayTarget,
} from "../_lib/checkStatusUtils";
import { fetchMidTermForcast } from "../_reducers/midTermForcastReducer";

interface Props {
  children: React.ReactNode;
}

const WeeklyForcastFetcher = ({ children }: Props) => {
  const dispatch = useAppDispatch();

  const weatherStatus = useAppSelector((state) => state.weather.status);
  const { localList, status: localstatus } = useAppSelector(
    (state) => state.local
  );
  const midTermForcastStatus = useAppSelector(
    (state) => state.midTermForcast.status
  );
  const statusList = [
    { name: "weather", status: weatherStatus },
    { name: "midTermForcast", status: midTermForcastStatus },
  ];

  useEffect(() => {
    if (localstatus === FULFILLED) {
      const midTermForcastParams = {
        si: localList[1].region_2depth_name.split(" ")[0],
        do: localList[1].region_1depth_name,
      };
      dispatch(fetchMidTermForcast(midTermForcastParams));
    }
  }, [localList]);

  if (hasArrayTarget(statusList, checkError)) throw new Error("api error");
  if (hasArrayTarget(statusList, checkLoadingOrIdle)) return <Loading />;

  return children;
};

export default WeeklyForcastFetcher;
