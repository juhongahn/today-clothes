import { NextResponse } from "next/server";
import hlTemperatureFetcher, {
  HLTemperatureResponseType,
} from "../../_lib/hlTemperatureFetch";
import fcstFetcher, { FcstResponseType } from "../../_lib/fcstFetch";
import { handleError } from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";
import getRegIdBySiName from "../../_lib/getRegId";
import { getRegionCodeByRegionName } from "../../_helpers/constants/midtermForcastRegionCode";

const MID_TERM_HL_TEMERATURE_FORCAST_URL =
  "	http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa";
const MID_TERM_MID_FCST_FORCAST_URL =
  "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst";
const SERVICE_KEY = process.env.SERVICE_KEY;

export const POST = async (req: Request) => {
  const reqBody = await req.json();
  const { hlRegion, wfRegion, date } = reqBody;
  try {
    if (!hlRegion || !wfRegion || !date) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const hlRegId = getRegIdBySiName(hlRegion);
    const wfRegId = getRegionCodeByRegionName(wfRegion);
    const baseDate = convertKoreanTime(new Date(date));
    console.log(baseDate)
    
    const tmFc = requestDateFormmator(baseDate);
    console.log(tmFc)
    const hlTemperatureQuery = `${MID_TERM_HL_TEMERATURE_FORCAST_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=json&regId=${hlRegId}&tmFc=${tmFc}`;
    console.log(hlTemperatureQuery)
    const fcstQuery = `${MID_TERM_MID_FCST_FORCAST_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=json&regId=${wfRegId}&tmFc=${tmFc}`;
    console.log(fcstQuery)

    const hlTempData = hlTemperatureFetcher(hlTemperatureQuery);
    const fcstData = fcstFetcher(fcstQuery);
    const [hlTemperature, fcst] = await Promise.all([hlTempData, fcstData]);
    console.log(hlTemperature)
    console.log(fcst)
    const result = parsingMidTermForcastData(hlTemperature, fcst, baseDate);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    handleError(error, NextResponse.json);
  }
};

const requestDateFormmator = (date: Date) => {
  const hours = date.getHours();
  let formattedHours: string;
  formattedHours = "1800";
  if (hours < 18) {
    date.setDate(date.getDate() - 1);
  }
 
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}${month}${day}${formattedHours}`;
};

export interface MidTermForcast {
  dt: string;
  hlTemperature: {
    tmx: number;
    tmn: number;
  };
  fcst: {
    pop: {
      popAM: number;
      popPM: number;
    };
    weatherForcast: {
      wfAM: string;
      wfPM: string;
    };
  };
}

const parsingMidTermForcastData = (
  hlTemperature: HLTemperatureResponseType,
  fcst: FcstResponseType,
  baseDate: Date
): MidTermForcast[] => {
  const result: MidTermForcast[] = [];
  const baseDateCopy = new Date(baseDate);

  const hlTemperatureItem = hlTemperature.response.body.items.item[0];
  const fcstItem = fcst.response.body.items.item[0];

  baseDateCopy.setDate(baseDateCopy.getDate() + 4);
  for (let i = 3; i <= 10; i++) {
    const formattedItem = {
      dt: responseDateFormmator(baseDateCopy),
      hlTemperature: {
        tmx: hlTemperatureItem[`taMax${i}`],
        tmn: hlTemperatureItem[`taMin${i}`],
      },
      fcst: {
        pop: {
          popAM: fcstItem[`rnSt${i}Am`] !== undefined ? fcstItem[`rnSt${i}Am`] : fcstItem[`rnSt${i}`],
          popPM: fcstItem[`rnSt${i}Pm`] !== undefined ? fcstItem[`rnSt${i}Pm`] : fcstItem[`rnSt${i}`],
        },
        weatherForcast: {
          wfAM: fcstItem[`wf${i}Am`] !== undefined ? fcstItem[`wf${i}Am`] : fcstItem[`wf${i}`],
          wfPM: fcstItem[`wf${i}Pm`] !== undefined ? fcstItem[`wf${i}Pm`] : fcstItem[`wf${i}`],
        },
      },
    };
    result.push(formattedItem);
    baseDateCopy.setDate(baseDateCopy.getDate() + 1);
  }
  return result;
};

const responseDateFormmator = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};

const convertKoreanTime = (date: Date) => {
  const utcTime = 
  date.getTime() + 
    (date.getTimezoneOffset() * 60 * 1000);
    const krTimeDiff = 9 * 60 * 60 * 1000;
    const krCurrentTime = 
    new Date(utcTime + (krTimeDiff));
  return krCurrentTime;
}