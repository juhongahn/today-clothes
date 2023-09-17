import { NextResponse } from "next/server";
import {
  appFetch,
  handleError,
} from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";
import dayjs from "../../_lib/dayjs";
import { parseString } from "xml2js";

const RISE_SET_URL =
  "https://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getLCRiseSetInfo";
const SERVICE_KEY = process.env.SERVICE_KEY;

type RisesetResponseJSON = {
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

type RisesetJSON =
  RisesetResponseJSON["response"]["body"]["0"]["items"]["0"]["item"]["0"];
type ParseString = (
  str: string,
  callback: (err: Error | null, result: any) => void
) => void;

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
    const promiseList = createPromiseList(currentDate, 5, lat, lon);
    const risesetXML = await Promise.all(promiseList);
    const risesetJSON = convertXMLToJSON(parseString, risesetXML);
    return NextResponse.json({ data: risesetJSON }, { status: 200 });
  } catch (error: unknown) {
    return handleError(error, NextResponse.json);
  }
};

const convertXMLToJSON = (parseString: ParseString, xmlList: string[]) => {
  let results = [];
  xmlList.forEach((fulfilledResult) => {
    results.push(parseToJSON(parseString, fulfilledResult));
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
    const nextDate = dateList[i].add(1, "day");
    dateList.push(nextDate);
  }
  const promiseList = dateList.map((date) => {
    const formattedDay = date.format("YYYYMMDD");
    return fetcher(lat, lon, formattedDay);
  });
  return promiseList;
};

const fetcher = async (lat: string, lon: string, date: string) => {
  const query = `${RISE_SET_URL}?serviceKey=${SERVICE_KEY}&locdate=${date}&longitude=${lon}&latitude=${lat}&dnYn=Y`;
  const response = await appFetch(query, {
    method: "GET",
  });
  const result = response.text();
  return result;
};

const parseToJSON = (parseString: ParseString, xml: string): RisesetJSON => {
  let result: RisesetJSON;
  parseString(xml, (err, parsedData: RisesetResponseJSON) => {
    if (err) {
      throw new Error("xml 파싱중 에러가 발생했습니다.");
    }
    result = parsedData.response.body[0].items[0].item[0];
  });
  return result;
};
