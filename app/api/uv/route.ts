import axios from "axios";
import { NextResponse } from "next/server";

const UV_URL =
  "https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4";
const SERVICE_KEY = process.env.SERVICE_KEY;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const hcode = searchParams.get("hcode");
  const baseDate = searchParams.get("base_date");
  const baseTime = searchParams.get("base_time");

  const reqUrl = `${UV_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&areaNo=${hcode}&time=${baseDate}${baseTime}`;
  const { data } = await axios.get(reqUrl);
  return NextResponse.json(data);
};
