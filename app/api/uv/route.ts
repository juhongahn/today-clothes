import { NextResponse } from "next/server";
import { getBaseDate } from "../../_lib/weatherUtils";
import { REQ_TYPE, GRADE_OBJ } from "../../_types/types";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";

type UV_RESPONSE = {
  code: string;
  areaNo: string;
  date: string;
  h0: string;
  h3: string;
  h6: string;
  h9: string;
  h12: string;
  h15: string;
  h18: string;
  h21: string;
  h24: string;
  h27: string;
  h30: string;
  h33: string;
  h36: string;
  h39: string;
  h42: string;
  h45: string;
  h48: string;
  h51: string;
  h54: string;
  h57: string;
  h60: string;
  h63: string;
  h66: string;
  h69: string;
  h72: string;
  h75: string;
};

const UV_URL =
  "https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4";
const SERVICE_KEY = process.env.SERVICE_KEY;

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const hCode = searchParams.get("h");
  const hours = searchParams.get("hours");
  try {
    if (!hCode || !hours) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const date = new Date();
    const requestDate = getBaseDate(REQ_TYPE.UV, date);
    const requestTime = getNearPredictionTime(parseInt(hours));
    const query = `${UV_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=json&areaNo=${hCode}&time=${requestDate}${requestTime}`;
    const response = await appFetch(query, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
    // 공공 데이터 포털에서 에러 발생시 xml을 내려준다.
    if (
      response.headers.get("Content-Type") === "application/xml" ||
      response.headers.get("Content-Type") === "text/xml"
    ) {
      throw new HttpError(
        "서버 에러가 발생했습니다.",
        NextResponse.json(
          { error: "서버 에러가 발생했습니다." },
          { status: 500 }
        )
      );
    }
    const data = await response.json();
    const uvdata: UV_RESPONSE = data.response.body.items.item[0];
    const result = convertUVObjtoList(uvdata);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: unknown) {
    handleError(error, NextResponse.json);
  }
};

/**
 *
 * @param uv 3시간 단위로 나눈 uv지수
 * @returns 3시간 단위를 1시간 단위로 변경한 데이터
 */
const convertUVObjtoList = (uv: UV_RESPONSE) => {
  const uvList = [];

  const strForcastDate = uv.date;
  const year = parseInt(strForcastDate.slice(0, 4));
  const month = parseInt(strForcastDate.slice(4, 6));
  const day = parseInt(strForcastDate.slice(6, 8));
  const hour = parseInt(strForcastDate.slice(8, 10));

  const forcastDate = new Date(year, month - 1, day, hour);
  let prevVal = "";
  for (let i = 0; i < 76; i++) {
    const value = uv[`h${i}`];
    const elapsedHour = i + hour;
    let date = new Date(forcastDate);
    date.setHours(elapsedHour);
    if (value) {
      prevVal = value;
      uvList.push({
        dt: date.getTime(),
        components: { uv: convertValueToGrade(parseInt(value)) },
      });
    } else if (value === undefined && prevVal) {
      uvList.push({
        dt: date.getTime(),
        components: { uv: convertValueToGrade(parseInt(prevVal)) },
      });
    } else {
      prevVal = "";
      uvList.push({
        dt: date.getTime(),
        components: { uv: "" },
      });
    }
  }
  return uvList;
};

/**
 *
 * @param value uv 지수
 * @returns 지수를 단계 변환한 값
 */
const convertValueToGrade = (value: number): GRADE_OBJ => {
  let grade = "";
  if (value >= 11) {
    grade = "위험";
  } else if (value >= 8) {
    grade = "매우나쁨";
  } else if (value >= 6) {
    grade = "나쁨";
  } else if (value >= 3) {
    grade = "보통";
  } else grade = "좋음";

  return { grade, value };
};

/**
 *
 * @param hours
 * @returns 현재 시간에 제일 가까운 요청시간
 */
const getNearPredictionTime = (hours: number): string => {
  if (hours < 4) {
    return "24";
  }
  // Base_time : 03, 06, 09, 12, 1500, 18, 21, 24 (1일 8회)
  const forecastTimes: number[] = [3, 6, 9, 12, 15, 18, 21, 24];
  let left = 0;
  let right = forecastTimes.length - 1;
  let result = null;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (forecastTimes[mid] === hours) {
      result = forecastTimes[mid - 1];
      break;
    } else if (forecastTimes[mid] < hours) {
      result = forecastTimes[mid];
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result.toString().padStart(2, "0");
};
