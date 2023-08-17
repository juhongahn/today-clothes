"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../_hooks/redux_hooks";
import Weather from "./weather/Weather";
import useCoords from "../_hooks/useCoords";

const WeatherWrapper = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const strCoords = sessionStorage.getItem("coords");
    if (strCoords) {
      const coords: { latitude: number; longitude: number } =
        JSON.parse(strCoords);
      useCoords(coords, dispatch);
    } else {
      alert("위치 엑세스를 허용 해주세요.");
      router.push("/");
    }
  }, []);

  return (
    <>
      <Weather />
    </>
  );
};

export default WeatherWrapper;
