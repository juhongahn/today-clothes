import { NextResponse } from "next/server";
import { GRADE_OBJ } from "../../_types/types";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";
import dayjs from "../../_lib/dayjs"

interface HourlyDataItem {
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
}

interface HourlyResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: HourlyDataItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

const UV_URL =
  "https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4";

export const POST = async (req: Request) => {
  const reqBody = await req.json();
  const { hcode, date } = reqBody;
  try {
    if (!hcode || !date) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const currentDate = dayjs(date).tz();
    const fetchURL = makeUVRequestURL(UV_URL, currentDate, 1, 10, "JSON", hcode);
    const response = await appFetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    // 공공 데이터 포털에서 에러 발생시 xml을 내려준다.
    if (
      response.headers.get("Content-Type").includes("application/xml") ||
      response.headers.get("Content-Type").includes("text/xml")
    ) {
      throw new HttpError(
        "서버 에러가 발생했습니다.",
        NextResponse.json(
          { error: "서버 에러가 발생했습니다." },
          { status: 500 }
        )
      );
    }
    const data = await response.json() as HourlyResponse;
    const uvdata = data.response.body.items.item[0];
    const result = convertUVObjToHourlyList(uvdata);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: unknown) {
    return handleError(error, NextResponse.json);
  }
};

/**
 *
 * @param uv 3시간 단위로 나눈 uv지수
 * @returns 3시간 단위를 1시간 단위로 변경한 데이터
 */
const convertUVObjToHourlyList = (uv: HourlyDataItem) => {
  const uvList = [] as {
    dt: number;
    components: { uv: GRADE_OBJ | string },
  }[];

  const strForcastDate = uv.date;
  const year = parseInt(strForcastDate.slice(0, 4));
  const month = parseInt(strForcastDate.slice(4, 6));
  const day = parseInt(strForcastDate.slice(6, 8));
  const hour = parseInt(strForcastDate.slice(8, 10));

  const forcastDate = dayjs().tz().year(year).month(month - 1).date(day);
  let prevVal = "";
  for (let i = 0; i < 76; i++) {
    const value = uv[`h${i}`];
    const elapsedHour = i + hour;
    let date = dayjs(forcastDate).tz().hour(elapsedHour).minute(0).second(0).millisecond(0);
    if (value) {
      prevVal = value;
      uvList.push({
        dt: date.unix() * 1000,
        components: { uv: convertValueToGrade(parseInt(value)) },
      });
    } else if (value === undefined && prevVal) {
      uvList.push({
        dt: date.unix() * 1000,
        components: { uv: convertValueToGrade(parseInt(prevVal)) },
      });
    } else {
      prevVal = "";
      uvList.push({
        dt: date.unix() * 1000,
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
 * Base_time : 03, 06, 09, 12, 15, 18, 21, 24 (1일 8회)
 * @param hours
 * @returns 현재 시간에 제일 가까운 요청시간
 */
const getNearPredictionTime = (date: dayjs.Dayjs): string => {
  const forecastTimes: number[] = [0, 3, 6, 9, 12, 15, 18, 21];
  const currentHour = date.hour();
  const currentMinute = date.minute();
  let nextTime = forecastTimes[0];
  for (const time of forecastTimes) {
    if (currentHour < time || (currentHour === time && currentMinute >= 20)) {
      nextTime = time;
      break;
    }
  }
  return nextTime.toString().padStart(2, "0");
};

const makeUVRequestURL = (
  baseURL: string,
  currentDate: dayjs.Dayjs,
  pageNo: number,
  numOfRows: number,
  dataType: string,
  areaNo: string,
) => {
  const serviceKey: string = process.env.SERVICE_KEY;
  const baseDate = currentDate.format('YYYYMMDD');
  const baseTime = getNearPredictionTime(currentDate);
  const query = `${baseURL}?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&areaNo=${areaNo}&time=${baseDate}${baseTime}`;
  return query;
};