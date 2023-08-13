import { NextResponse } from "next/server";
import { dateFormatter } from "../../_lib/weatherUtils";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";

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

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const date = searchParams.get("date");
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
    const today = new Date(date);
    const tommorow = new Date();
    tommorow.setDate(today.getDate() + 1);

    const dayAfterTommorow = new Date();
    dayAfterTommorow.setDate(tommorow.getDate() + 1);

    const twoDaysAfterTommorow = new Date();
    twoDaysAfterTommorow.setDate(dayAfterTommorow.getDate() + 1);

    const formattedToday = dateFormatter(today);
    const formmatedTommorow = dateFormatter(tommorow);
    const formmatedDayAfterTommorow = dateFormatter(dayAfterTommorow);
    const formmatedTwoDaysAfterTommorow = dateFormatter(twoDaysAfterTommorow);

    const setteledResults = await Promise.allSettled([
      fetcher(lat, lon, formattedToday),
      fetcher(lat, lon, formmatedTommorow),
      fetcher(lat, lon, formmatedDayAfterTommorow),
      fetcher(lat, lon, formmatedTwoDaysAfterTommorow),
    ]);

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

const fetcher = async (lat: string, lon: string, date: string) => {
  const query = `${RISE_SET_URL}?serviceKey=${SERVICE_KEY}&locdate=${date}&longitude=${lon}&latitude=${lat}&dnYn=Y`;
  const response = await appFetch(query, {
    method: "GET",
    headers: {
      "Cache-Control": "no-store",
    },
  });
  return response.text();
};
