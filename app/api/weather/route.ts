import { NextResponse } from "next/server";
import { advanceTime, dateFormatter } from "../../_lib/weatherUtils";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";
import { dfs_xy_conv } from "../../_lib/gridConverter";
import { convertKoreanTime } from "../mid-term-forcast/route";

interface ForecastItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

interface ForecastResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: ForecastItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

const WEATHER_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

export const POST = async (req: Request) => {
  const reqBody = await req.json();
  const { lat, lon, date } = reqBody;

  try {
    if (!lat || !lon || !date) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }

    const currentDate = convertKoreanTime(new Date(date));
    const fetchURL = makeWeatherRequestURL(
      WEATHER_URL,
      currentDate,
      1,
      1000,
      "JSON",
      lat,
      lon
    );
    const response = await appFetch(fetchURL, {
      method: "GET",
      cache: "no-store",
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
    const data = (await response.json()) as ForecastResponse;
    const items = data.response.body.items.item;
    const minMaxTemperatureList = makeHotLowTemperatureList(items);
    const result = groupHLTempWithHourlyFcstValue(items, minMaxTemperatureList);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: unknown) {
    handleError(error, NextResponse.json);
  }
};

const groupHLTempWithHourlyFcstValue = (
  weatherItems: ForecastItem[],
  minMaxList: ForecastWithTemperature
) => {
  const transformedData = [] as {
    dt: number;
    value: {
      [x: string]: string | number;
      TMX: number;
      TMN: number;
    };
  }[];

  weatherItems.forEach((item) => {
    const { fcstDate, fcstTime, fcstValue, category } = item;
    console.log(fcstDate)
    const unixTime = convertToUnixTime(fcstDate, fcstTime);
    console.log(unixTime)
    const existingData = transformedData.find((data) => data.dt === unixTime);
    const { TMX, TMN } =
      minMaxList.find((data) => data.fcstDate === fcstDate) || {};
    if (existingData) {
      existingData.value[category.toUpperCase()] = fcstValue;
    } else {
      const newData = {
        dt: unixTime,
        value: {
          [category.toUpperCase()]: fcstValue,
          TMX,
          TMN,
        },
      };
      transformedData.push(newData);
    }
  });

  return transformedData;
};

type HotLowTemperature = {
  [fcstDate: string]: {
    TMX?: number;
    TMN?: number;
  };
};

const extractHotLowTemperature = (items: ForecastItem[]) => {
  const tmnxObjByDate = {} as HotLowTemperature;
  items.forEach((item) => {
    if (item.category === "TMX" || item.category === "TMN") {
      if (!tmnxObjByDate[item.fcstDate]) {
        tmnxObjByDate[item.fcstDate] = {};
      }
      tmnxObjByDate[item.fcstDate][item.category] = parseInt(item.fcstValue);
    }
  });
  return tmnxObjByDate;
};

type ForecastWithTemperature = {
  fcstDate: string;
  TMX?: number;
  TMN?: number;
}[];

const makeHotLowTemperatureList = (items: ForecastItem[]) => {
  const tmnxObjByDate = extractHotLowTemperature(items);
  const result = [] as ForecastWithTemperature;
  for (const fcstDate in tmnxObjByDate) {
    const { TMN, TMX } = tmnxObjByDate[fcstDate];
    result.push({
      fcstDate,
      TMX,
      TMN,
    });
  }
  return result;
};

const convertToUnixTime = (fcstDate: string, fcstTime: string) => {
  const year = parseInt(fcstDate.substring(0, 4));
  const month = parseInt(fcstDate.substring(4, 6)) - 1; // 월은 0부터 시작하므로 1을 빼줌
  const day = parseInt(fcstDate.substring(6, 8));
  const hours = parseInt(fcstTime.substring(0, 2));
  const minutes = parseInt(fcstTime.substring(2));

  // Date 객체로 변환
  const date = new Date(year, month, day, hours, minutes);

  // getTime() 메서드를 사용하여 유닉스 시간(밀리초)으로 변환
  const unixTime = date.getTime();

  return unixTime;
};

const makeWeatherRequestURL = (
  baseURL: string,
  currentDate: Date,
  pageNo: number,
  numOfRows: number,
  dataType: string,
  lat: string,
  lon: string
) => {
  const serviceKey: string = process.env.SERVICE_KEY;
  const predictionDate = getNearPredictionTime(currentDate);
  const { x: nx, y: ny } = dfs_xy_conv("toXY", lat, lon);
  return `${baseURL}?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${predictionDate.baseDate}&base_time=${predictionDate.baseTime}&nx=${nx}&ny=${ny}`;
};

const getNearPredictionTime = (
  currentDate: Date
): {
  baseDate: string;
  baseTime: string;
} => {
  if (currentDate.getHours() < 18) {
    const targetDate = advanceTime(currentDate, -1);
    const baseDate = dateFormatter(targetDate, "");
    return {
      baseDate,
      baseTime: "2300",
    };
  } else {
    const baseDate = dateFormatter(currentDate, "");
    return {
      baseDate,
      baseTime: "1700",
    };
  }
};
