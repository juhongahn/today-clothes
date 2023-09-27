import axios from "axios";
import { NextResponse } from "next/server";

const TOUR_URL = "https://apis.data.go.kr/B551011/KorService1/searchKeyword1";
const SERVICE_KEY = process.env.SERVICE_KEY;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const contentTypeId = searchParams.get("contentTypeId");
  const reqUrl = `${TOUR_URL}?serviceKey=${SERVICE_KEY}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&keyword=${encodeURI(
    keyword
  )}&contentTypeId=${contentTypeId}`;
  const { data } = await axios.get(reqUrl);
  return NextResponse.json(data);
};
