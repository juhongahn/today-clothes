import axios from "axios";
import { NextResponse } from "next/server";

const DUST_URL =
  "http://api.openweathermap.org/data/2.5/air_pollution/forecast";
const SERVICE_KEY = process.env.OPEN_WEATHER_KEY;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const reqUrl = `${DUST_URL}?lat=${lat}&lon=${lon}&appid=${SERVICE_KEY}`;
  const { data } = await axios.get(reqUrl);
  return NextResponse.json(data);
};
