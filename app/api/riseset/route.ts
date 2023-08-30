import { NextResponse } from "next/server";
import {dateFormatter } from "../../_lib/weatherUtils";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";
import dayjs from "../../_lib/dayjs";

const RISE_SET_URL =
  "https://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getLCRiseSetInfo";
const SERVICE_KEY = process.env.SERVICE_KEY;

type RISE_SET_JSON = {
  response: {
    header: [
      {
        resultCode: string[];
        resultMsg: string[];
      }
    ];
    body: [
      {
        items: [
          {
            item: [
              {
                aste: string[];
                astm: string[];
                civile: string[];
                civilm: string[];
                latitude: string[];
                latitudeNum: string[];
                location: string[];
                locdate: string[];
                longitude: string[];
                longitudeNum: string[];
                moonrise: string[];
                moonset: string[];
                moontransit: string[];
                naute: string[];
                nautm: string[];
                sunrise: string[];
                sunset: string[];
                suntransit: string[];
              }
            ];
          }
        ];
      }
    ];
  };
};

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
    const setteledResults = await Promise.allSettled(
      createPromiseList(currentDate, 4, lat, lon)
    );
    const results = convertXMLToJSON(setteledResults);
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: unknown) {
    handleError(error, NextResponse.json);
  }
};

const convertXMLToJSON = (inputPSRList: PromiseSettledResult<string>[]) => {
  const parseString = require("xml2js").parseString;

  const isRejected = (
    inputPSR: PromiseSettledResult<unknown>
  ): inputPSR is PromiseRejectedResult => inputPSR.status === "rejected";
  const isFulfilled = <T>(
    inputPSR: PromiseSettledResult<T>
  ): inputPSR is PromiseFulfilledResult<T> => inputPSR.status === "fulfilled";

  let results = [];

  const errors = inputPSRList.filter(isRejected);
  if (errors.length) throw new Error("rejection occured");

  const fulfilledResults = inputPSRList.filter(isFulfilled);
  fulfilledResults.forEach((fulfilledResult) => {
    parseString(fulfilledResult.value, (err: any, result: RISE_SET_JSON) => {
      if (err) {
        throw new Error("xml에서 json으로 변환 중 에러가 발생했습니다.");
      }
      const jsonResult = result.response.body[0].items[0].item[0];
      results.push(jsonResult);
    });
  });
  return results;
};

const createPromiseList = (
  startDate: dayjs.Dayjs,
  targetDays: number,
  lat: string,
  lon: string
) => {
  const dateList: dayjs.Dayjs[] = [startDate];
  for (let i = 0; i < targetDays; i++) {
    const nextDate = dateList[i].add(1, 'day');
    dateList.push(nextDate);
  }

  const promiseList = dateList.map((date) => {
    const formattedDay = date.format('YYYYMMDD');
    return fetcher(lat, lon, formattedDay);
  });

  return promiseList;
};

const fetcher = async (lat: string, lon: string, date: string) => {
  const query = `${RISE_SET_URL}?serviceKey=${SERVICE_KEY}&locdate=${date}&longitude=${lon}&latitude=${lat}&dnYn=Y`;
  const response = await appFetch(query, {
    method: "GET",
    cache: "no-store",
  });
  return response.text();
};
