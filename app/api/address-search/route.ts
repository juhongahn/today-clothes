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
export const POST = async (req: Request) => {
  const inputAddress = await req.json();
  try {
    if (!inputAddress) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const address = trimAddress(inputAddress);
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
    const { documents } = data;
    if (documents.length === 0) {
      throw new HttpError(
        "요청하신 주소를 찾을 수 없습니다.",
        NextResponse.json(
          { error: "요청하신 주소를 찾을 수 없습니다." },
          { status: 404 }
        )
      );
    }
    return NextResponse.json({ data: documents }, { status: 200 });
  } catch (error: unknown) {
    return handleError(error, NextResponse.json);
  }
};

const trimAddress = (inputAddressText: string) => {
  const keyword = "날씨";
  const modifiedText = inputAddressText.replace(keyword, "");
  return modifiedText.trim();
};
