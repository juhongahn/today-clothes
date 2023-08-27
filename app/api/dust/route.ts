import { NextResponse } from "next/server";
import type { GRADE_OBJ } from "../../_types/types";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";

type DUST_RESPONSE = {
  dt: number;
  main: {
    aqi: number;
  };
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
};

type RESPONSE = {
  dt: number;
  components: {
    co: GRADE_OBJ;
    no: number;
    no2: GRADE_OBJ;
    o3: GRADE_OBJ;
    so2: GRADE_OBJ;
    pm2_5: GRADE_OBJ;
    pm10: GRADE_OBJ;
    nh3: number;
  };
};

enum DUST_INDEX {
  SO2 = "so2",
  CO = "co",
  O3 = "o3",
  NO2 = "no2",
  PM10 = "pm10",
  PM2_5 = "pm2_5",
}

const DUST_URL =
  "http://api.openweathermap.org/data/2.5/air_pollution/forecast";
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  try {
    if (!lat || !lon ) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const query = `${DUST_URL}?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}`;
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
    const dataList: DUST_RESPONSE[] = data.list;
    const res: RESPONSE[] = dataList.map((data): RESPONSE => {
      return {
        dt: data.dt * 1000,
        components: {
          so2: convertValueToGrade(DUST_INDEX.SO2, data.components.so2),
          co: convertValueToGrade(DUST_INDEX.CO, data.components.co),
          no2: convertValueToGrade(DUST_INDEX.NO2, data.components.no2),
          pm10: convertValueToGrade(DUST_INDEX.PM10, data.components.pm10),
          pm2_5: convertValueToGrade(DUST_INDEX.PM2_5, data.components.pm2_5),
          o3: convertValueToGrade(DUST_INDEX.O3, data.components.o3),
          no: data.components.no,
          nh3: data.components.nh3,
        },
      };
    });
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (error: unknown) {
    handleError(error, NextResponse.json);
  }
};

const thresholds = {
  [DUST_INDEX.SO2]: [20, 80, 250, 350],
  [DUST_INDEX.NO2]: [40, 70, 150, 200],
  [DUST_INDEX.PM10]: [20, 50, 100, 200],
  [DUST_INDEX.PM2_5]: [10, 25, 50, 75],
  [DUST_INDEX.O3]: [60, 100, 140, 180],
  [DUST_INDEX.CO]: [4400, 9400, 12400, 15400],
};

const convertValueToGrade = (type: DUST_INDEX, value: number) => {
  const indexThresholds = thresholds[type];
  let grade = "";
  if (value >= indexThresholds[3]) grade = "위험";
  else if (value >= indexThresholds[2]) grade = "매우나쁨";
  else if (value >= indexThresholds[1]) grade = "나쁨";
  else if (value >= indexThresholds[0]) grade = "보통";
  else grade = "좋음";

  return { grade, value };
};
