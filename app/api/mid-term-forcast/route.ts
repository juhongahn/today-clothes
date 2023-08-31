import { NextResponse } from "next/server";
import hlTemperatureFetcher, {
  HLTemperatureResponseType,
} from "../../_lib/hlTemperatureFetch";
import fcstFetcher, { FcstResponseType } from "../../_lib/fcstFetch";
import { handleError } from "../../_helpers/custom-fetch/fetchWrapper";
import { HttpError } from "../../_helpers/error-class/HttpError";
import getRegIdBySiName from "../../_lib/getRegId";
import { getRegionCodeByRegionName } from "../../_helpers/constants/midtermForcastRegionCode";
import dayjs from "../../_lib/dayjs";

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
    const baseDate = dayjs(date).tz();
    const tmFc = requestDateFormmator(baseDate);

    const hlTemperatureQuery = `${MID_TERM_HL_TEMERATURE_FORCAST_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=json&regId=${hlRegId}&tmFc=${tmFc}`;
    const fcstQuery = `${MID_TERM_MID_FCST_FORCAST_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=json&regId=${wfRegId}&tmFc=${tmFc}`;
    
    const hlTempData = hlTemperatureFetcher(hlTemperatureQuery);
    const fcstData = fcstFetcher(fcstQuery);
    const [hlTemperature, fcst] = await Promise.all([hlTempData, fcstData]);
    const result = parsingMidTermForcastData(hlTemperature, fcst, baseDate);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: unknown) {
    handleError(error, NextResponse.json);
  }
};

const requestDateFormmator = (date: dayjs.Dayjs) => {
  const dateCopy = dayjs(date).tz();
  const hours = date.hour();
  let targetDate: dayjs.Dayjs;
  if (hours < 18) {
    targetDate = dateCopy.subtract(1, "day");
  } else {
    targetDate = dateCopy;
  }
  return targetDate.format("YYYYMMDD").concat("1800");
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
  baseDate: dayjs.Dayjs
): MidTermForcast[] => {
  const result: MidTermForcast[] = [];
  
  const hlTemperatureItem = hlTemperature.response.body.items.item[0];
  const fcstItem = fcst.response.body.items.item[0];
  
  for (let i = 3; i <= 10; i++) {
    const targetDate = dayjs(baseDate).tz().add(i + 1, "day");
    const formattedItem = {
      dt: targetDate.format("YYYYMMDD"),
      hlTemperature: {
        tmx: hlTemperatureItem[`taMax${i}`],
        tmn: hlTemperatureItem[`taMin${i}`],
      },
      fcst: {
        pop: {
          popAM:
            fcstItem[`rnSt${i}Am`] !== undefined
              ? fcstItem[`rnSt${i}Am`]
              : fcstItem[`rnSt${i}`],
          popPM:
            fcstItem[`rnSt${i}Pm`] !== undefined
              ? fcstItem[`rnSt${i}Pm`]
              : fcstItem[`rnSt${i}`],
        },
        weatherForcast: {
          wfAM:
            fcstItem[`wf${i}Am`] !== undefined
              ? fcstItem[`wf${i}Am`]
              : fcstItem[`wf${i}`],
          wfPM:
            fcstItem[`wf${i}Pm`] !== undefined
              ? fcstItem[`wf${i}Pm`]
              : fcstItem[`wf${i}`],
        },
      },
    };
    result.push(formattedItem);
  }
  return result;
};