import { NextResponse } from "next/server";
import { getRequestURL } from "../../../lib/weatherUtils";

const WEATHER_URL = process.env.WEATHER_URL;

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const query = getRequestURL(lat, lon);

  const response = await fetch(WEATHER_URL + "?" + query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    const result = data.response.body.items;
    console.log(result);
    // return {
    //   props: {
    //     weatherData: result,
    //   },
    // };
  } else {
    throw new Error("날씨 데이터를 가져오는데 문제가 발생했습니다.");
  }
};
