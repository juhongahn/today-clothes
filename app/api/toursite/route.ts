import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../../_helpers/error-class/HttpError";
import { appFetch, handleError } from "../../_helpers/custom-fetch/fetchWrapper";

const TOUR_URL = "https://apis.data.go.kr/B551011/KorService1/searchKeyword1";
const SERVICE_KEY = process.env.SERVICE_KEY;

interface ResponseHeader {
  resultCode: string;
  resultMsg: string;
}

interface Item {
  addr1: string;
  addr2: string;
  areacode: string;
  booktour: string;
  cat1: string;
  cat2: string;
  cat3: string;
  contentid: string;
  contenttypeid: string;
  createdtime: string;
  firstimage: string;
  firstimage2: string;
  cpyrhtDivCd: string;
  mapx: string;
  mapy: string;
  mlevel: string;
  modifiedtime: string;
  sigungucode: string;
  tel: string;
  title: string;
}

interface Items {
  item: Item[];
}

interface ResponseBody {
  items: Items;
  numOfRows: number;
  pageNo: number;
  totalCount: number;
}

interface Response {
  header: ResponseHeader;
  body: ResponseBody;
}


export const POST = async (req: NextRequest) => {
  const inputData = await req.json();
  try {
    if (!inputData) {
      throw new HttpError(
        "잘못된 요청 파라미터 입니다.",
        NextResponse.json(
          { error: "잘못된 요청 파라미터 입니다." },
          { status: 400 }
        )
      );
    }
    const query = `${TOUR_URL}?serviceKey=${SERVICE_KEY}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&keyword=${encodeURI(inputData.title)}&contentTypeId=${inputData.contentTypeId}`;
    const response = await appFetch(query, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
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
    const result = formateData(data.response);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    handleError(error, NextResponse.json);
  }
};

interface TourResponseType {
  title: string;
  location: string;
  image: string;
}

function formateData(response: Response): TourResponseType[] {
  const items: TourResponseType[] = [];

  for (const item of response.body.items.item) {
    if (item.firstimage) {
      items.push({
        title: item.title,
        location: item.addr1,
        image: item.firstimage,
      });
    }
  }

  return items;
}