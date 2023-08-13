import { NextResponse } from "next/server";
import { getWeatherRequestURL } from "../../_lib/weatherUtils";
import { appFetch, handleError } from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";
import { Weather } from "../../_types/types";

const WEATHER_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const hours = searchParams.get("hours");

  try {
    if (!lat || !lon || !hours) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const query = `${WEATHER_URL}?${getWeatherRequestURL(
      lat,
      lon,
      parseInt(hours)
    )}`;
    const response = await appFetch(query, {
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
    const data = await response.json();
    const items = data.response.body.items.item;
    const minMaxTemperatureList = getMinMaxTemperaturesList(items);
    const result = groupHourlyFcstValue(items, minMaxTemperatureList);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: unknown) {
    handleError(error, NextResponse.json);
  }
};

const groupHourlyFcstValue = (weatherItems: any, minMaxList): Weather[] => {
  const transformedData = [];

  weatherItems.forEach((item) => {
    const { fcstDate, fcstTime, fcstValue, category } = item;
    const unixTime = convertToUnixTime(fcstDate, fcstTime);
    const existingData = transformedData.find(
      (data) => data.dt === unixTime
    );
    const dailyMinMax = minMaxList.find(data => data.fcstDate === fcstDate);
    if (existingData) {
      existingData.value[category.toUpperCase()] = fcstValue;
    } else {
      const newData = {
        dt: unixTime,
        value: {
          [category.toUpperCase()]: fcstValue,
          TMX: dailyMinMax.TMX,
          TMN: dailyMinMax.TMN,
        },
      };
      transformedData.push(newData);
    }
  });

  return transformedData;
};

const getMinMaxTemperaturesList = (items) => {
  const groupedByDate = {};

  // 날짜별 TMP 리스트 만들기.
  items.forEach(item => {
    if (item.category === "TMP") {
      if (!groupedByDate[item.fcstDate]) {
        groupedByDate[item.fcstDate] = [];
      }
      groupedByDate[item.fcstDate].push(parseInt(item.fcstValue));
    }
  });

  const result = [];
  for (const fcstDate in groupedByDate) {
    const values = groupedByDate[fcstDate];
    const min = Math.min(...values);
    const max = Math.max(...values);
    result.push({
      fcstDate,
      TMX: max,
      TMN: min
    });
  }
  return result;
}

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
