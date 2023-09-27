import axios from "axios";
import { NextResponse } from "next/server";

const KAKAO_LOCAL_URL =
  "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";
const KAKAO_API_KEY = process.env.KAKAO_ADDRESS_KEY;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const longitude = searchParams.get("x");
  const latitude = searchParams.get("y");
  const { data } = await axios.get(
    `${KAKAO_LOCAL_URL}?x=${longitude}&y=${latitude}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: "KakaoAK " + KAKAO_API_KEY,
      },
    }
  );
  return NextResponse.json(data);
};
