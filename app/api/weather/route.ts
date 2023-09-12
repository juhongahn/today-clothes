import { NextResponse } from "next/server";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";
import { dfs_xy_conv } from "../../_lib/gridConverter";
import dayjs from "../../_lib/dayjs";

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
    const currentDate = dayjs(date).tz();
    const predictionDate = getNearPredictionTime(currentDate);

    const fetchURL = makeWeatherRequestURL(
      WEATHER_URL,
      predictionDate,
      1,
      1000,
      "JSON",
      lat,
      lon
    );
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
    const data = (await response.json()) as ForecastResponse;
    const items = data.response.body.items.item;
    const hotLowTemperatureList = extractHotLowTemperatureList(items);
    const result = groupHLTempWithHourlyFcstValue(items, hotLowTemperatureList);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: unknown) {
    return handleError(error, NextResponse.json);
  }
};

const groupHLTempWithHourlyFcstValue = (
  weatherItems: ForecastItem[],
  minMaxList: HotLowTemperature[]
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
    const unixTime = convertToUnixTime(fcstDate, fcstTime);

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
  fcstDate: string,
  TMX?: number,
  TMN?: number,
};

const extractHotLowTemperatureList = (items: ForecastItem[]) => {
  const hlTemperatureList = items.filter(isHLTemperature);
  const hlTemperatureListWithFcstDate = hlTemperatureList.reduce(makeTemperatureObjList, [])
  return hlTemperatureListWithFcstDate;
};

const isHLTemperature = (item: ForecastItem) => item.category === "TMX" || item.category === "TMN";

const makeTemperatureObjList = (accHLTemperatureList: HotLowTemperature[], currentValue: ForecastItem) => {
  const fcstDate = currentValue.fcstDate;
  const fcstValue = parseInt(currentValue.fcstValue);
  const existingTemperatureObj = accHLTemperatureList.find((data) => data.fcstDate === fcstDate);
  if (existingTemperatureObj) {
    if (currentValue.category === "TMX") existingTemperatureObj.TMX = fcstValue;
    else existingTemperatureObj.TMN = fcstValue;
  } else {
    const newTemperatureObj = {
      fcstDate,
      TMX: currentValue.category === "TMX" ? fcstValue : null,
      TMN: currentValue.category === "TMN" ? fcstValue : null,
    }
    accHLTemperatureList.push(newTemperatureObj);
  }
  return accHLTemperatureList;
}

const convertToUnixTime = (fcstDate: string, fcstTime: string) => {
  const year = parseInt(fcstDate.substring(0, 4));
  const month = parseInt(fcstDate.substring(4, 6)) - 1; // 월은 0부터 시작하므로 1을 빼줌
  const day = parseInt(fcstDate.substring(6, 8));
  const hours = parseInt(fcstTime.substring(0, 2));
  const minutes = parseInt(fcstTime.substring(2));
  const unixTime =
    dayjs()
      .tz()
      .year(year)
      .month(month)
      .date(day)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .unix() * 1000;
  return unixTime;
};

const makeWeatherRequestURL = (
  baseURL: string,
  predictionDate: {
    baseDate: string;
    baseTime: string;
  },
  pageNo: number,
  numOfRows: number,
  dataType: string,
  lat: string,
  lon: string
) => {
  const serviceKey: string = process.env.SERVICE_KEY;
  const { x: nx, y: ny } = dfs_xy_conv("toXY", lat, lon);
  return `${baseURL}?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${predictionDate.baseDate}&base_time=${predictionDate.baseTime}&nx=${nx}&ny=${ny}`;
};

const getNearPredictionTime = (
  currentDate: dayjs.Dayjs
): {
  baseDate: string;
  baseTime: string;
} => {
  if (currentDate.hour() < 18) {
    const baseDate = currentDate.add(-1, "day").format("YYYYMMDD");
    return {
      baseDate,
      baseTime: "2300",
    };
  } else {
    const baseDate = currentDate.format("YYYYMMDD");
    return {
      baseDate,
      baseTime: "1700",
    };
  }
};
