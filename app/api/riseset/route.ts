import axios from "axios";
import { NextResponse } from "next/server";

const RISE_SET_URL =
  "https://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getLCRiseSetInfo";
const SERVICE_KEY = process.env.SERVICE_KEY;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("locdate");
  const lon = searchParams.get("longitude");
  const lat = searchParams.get("latitude");
  const reqUrl = `${RISE_SET_URL}?serviceKey=${SERVICE_KEY}&locdate=${date}&longitude=${lon}&latitude=${lat}&dnYn=Y`;

  const { data } = await axios.get(reqUrl);
  return NextResponse.json(data);
};
