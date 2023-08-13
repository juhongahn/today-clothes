"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../_hooks/redux_hooks";
import { fetchWeathers } from "../_reducers/weatherReducer";
import { fetchDust } from "../_reducers/dustReducer";
import { fetchLocal } from "../_reducers/localReducer";
import { fetchRiseset } from "../_reducers/risesetReducer";
import Weather from "./weather/Weather";

const WeatherWrapper = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const strCoords = sessionStorage.getItem("coords");
    if (strCoords) {
      const coords: { latitude: number; longitude: number } =
        JSON.parse(strCoords);
      dispatch(fetchWeathers(coords));
      dispatch(fetchLocal(coords));
      dispatch(fetchRiseset(coords));
      dispatch(fetchDust(coords));
    } else {
      alert("위치 엑세스를 허용 해주세요.")
      router.push("/");
    }
  }, []);

  return <Weather />;
};

export default WeatherWrapper;
