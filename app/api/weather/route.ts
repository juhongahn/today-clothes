import axios from "axios";
import { NextResponse } from "next/server";

const WEATHER_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
const SERVICE_KEY = process.env.SERVICE_KEY;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const nx = searchParams.get("nx");
  const ny = searchParams.get("ny");
  const baseDate = searchParams.get("base_date");
  const baseTime = searchParams.get("base_time");

  const reqUrl = `${WEATHER_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const { data } = await axios.get(reqUrl);
  return NextResponse.json(data);
};
