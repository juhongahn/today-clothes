import axios from "axios";
import { NextResponse } from "next/server";
import { getRegionCodeByRegionName } from "../../_helpers/constants/midtermForcastRegionCode";

const MID_TERM_MID_FCST_FORCAST_URL =
  "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst";
const SERVICE_KEY = process.env.SERVICE_KEY;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const wfRegion = searchParams.get("wfRegion");
  const tmFc = searchParams.get("tmFc");
  const wfRegId = getRegionCodeByRegionName(wfRegion);

  const reqUrl = `${MID_TERM_MID_FCST_FORCAST_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=json&regId=${wfRegId}&tmFc=${tmFc}`;
  const { data } = await axios.get(reqUrl);
  return NextResponse.json(data);
};
