import axios from "axios";
import { NextResponse } from "next/server";
import getRegIdBySiName from "../../_lib/getRegId";

const MID_TERM_HL_TEMERATURE_FORCAST_URL =
  "	http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa";
const SERVICE_KEY = process.env.SERVICE_KEY;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const hlRegion = searchParams.get("hlRegion");
  const wfRegion = searchParams.get("wfRegion");
  const tmFc = searchParams.get("tmFc");
  const hlRegId = getRegIdBySiName(hlRegion, wfRegion);

  const reqUrl = `${MID_TERM_HL_TEMERATURE_FORCAST_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=json&regId=${hlRegId}&tmFc=${tmFc}`
  const { data } = await axios.get(reqUrl);
  return NextResponse.json(data);
};
