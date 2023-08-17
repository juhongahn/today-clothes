import { NextResponse } from "next/server";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";

const KAKAO_LOCAL_URL = "https://dapi.kakao.com/v2/local/search/address";
const KAKAO_API_KEY = process.env.KAKAO_ADDRESS_KEY;

interface Address {
  address_name: string;
  b_code: string;
  h_code: string;
  main_address_no: string;
  mountain_yn: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_h_name: string;
  region_3depth_name: string;
  sub_address_no: string;
  x: string;
  y: string;
}

export interface Document {
  address: Address;
  address_name: string;
  address_type: string;
  road_address: null;
  x: string;
  y: string;
}

interface Meta {
  is_end: boolean;
  pageable_count: number;
  total_count: number;
}

interface SearchResponse {
  documents: Document[];
  meta: Meta;
}
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  try {
    if (!address) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const requestParam = address.split(" ")[0];
    const response = await appFetch(
      `${KAKAO_LOCAL_URL}?query=${requestParam}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "KakaoAK " + KAKAO_API_KEY,
        },
      }
    );
    const data: SearchResponse = await response.json();
    console.log(data);
    const { documents } = data;
    return NextResponse.json({ data: documents }, { status: 200 });
  } catch (error: unknown) {
    handleError(error, NextResponse.json);
  }
};
