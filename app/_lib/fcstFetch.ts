import { appFetch } from "../_helpers/custom-fetch/fetchWrapper";

interface ResponseItem {
  regId: string;
  rnSt3Am: number;
  rnSt3Pm: number;
  rnSt4Am: number;
  rnSt4Pm: number;
  rnSt5Am: number;
  rnSt5Pm: number;
  rnSt6Am: number;
  rnSt6Pm: number;
  rnSt7Am: number;
  rnSt7Pm: number;
  rnSt8: number;
  rnSt9: number;
  rnSt10: number;
  wf3Am: string;
  wf3Pm: string;
  wf4Am: string;
  wf4Pm: string;
  wf5Am: string;
  wf5Pm: string;
  wf6Am: string;
  wf6Pm: string;
  wf7Am: string;
  wf7Pm: string;
  wf8: string;
  wf9: string;
  wf10: string;
}

interface Item {
  item: ResponseItem[];
}

interface Body {
  dataType: string;
  items: Item;
  pageNo: number;
  numOfRows: number;
  totalCount: number;
}

interface Header {
  resultCode: string;
  resultMsg: string;
}

interface Response {
  header: Header;
  body: Body;
}

export interface FcstResponseType {
  response: Response;
}

const fcstFetcher = async (url: string): Promise<FcstResponseType> => {
  const response = await appFetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });
  return response.json();
};

export default fcstFetcher;
