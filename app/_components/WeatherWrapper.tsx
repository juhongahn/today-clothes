"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { thunkUpdateCoords, useAppDispatch } from "../_hooks/redux_hooks";
import Weather from "./weather/Weather";
import { COORDS } from "../_types/types";

const WeatherWrapper = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const strCoords = sessionStorage.getItem("coords");
    if (strCoords) {
      const coords: COORDS = JSON.parse(strCoords);
      dispatch(thunkUpdateCoords(coords));
    } else {
      alert("위치 엑세스를 허용 해주세요.");
      router.push("/");
    }
  }, []);

  return <Weather />;
};

export default WeatherWrapper;
