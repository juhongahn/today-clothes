import { NextResponse } from "next/server";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";

const KAKAO_LOCAL_URL =
  "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";
const KAKAO_API_KEY = process.env.KAKAO_ADDRESS_KEY;

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  try {
    if (!lat || !lon) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const response = await appFetch(`${KAKAO_LOCAL_URL}?x=${lon}&y=${lat}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "KakaoAK " + KAKAO_API_KEY,
      },
    });
    const data = await response.json();
    const { documents } = data;
    return NextResponse.json({ data: documents }, { status: 200 });
  } catch (error: unknown) {
    return handleError(error, NextResponse.json);
  }
};
