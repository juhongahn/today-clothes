import { appFetch } from "../_helpers/custom-fetch/fetchWrapper";

interface ResponseItem {
  regId: string;
  taMin3: number;
  taMin3Low: number;
  taMin3High: number;
  taMax3: number;
  taMax3Low: number;
  taMax3High: number;
  taMin4: number;
  taMin4Low: number;
  taMin4High: number;
  taMax4: number;
  taMax4Low: number;
  taMax4High: number;
  taMin5: number;
  taMin5Low: number;
  taMin5High: number;
  taMax5: number;
  taMax5Low: number;
  taMax5High: number;
  taMin6: number;
  taMin6Low: number;
  taMin6High: number;
  taMax6: number;
  taMax6Low: number;
  taMax6High: number;
  taMin7: number;
  taMin7Low: number;
  taMin7High: number;
  taMax7: number;
  taMax7Low: number;
  taMax7High: number;
  taMin8: number;
  taMin8Low: number;
  taMin8High: number;
  taMax8: number;
  taMax8Low: number;
  taMax8High: number;
  taMin9: number;
  taMin9Low: number;
  taMin9High: number;
  taMax9: number;
  taMax9Low: number;
  taMax9High: number;
  taMin10: number;
  taMin10Low: number;
  taMin10High: number;
  taMax10: number;
  taMax10Low: number;
  taMax10High: number;
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

export interface HLTemperatureResponseType {
  response: Response;
}

const hlTemperatureFetcher = async (
  url: string
): Promise<HLTemperatureResponseType> => {
  const response = await appFetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  return response.json();
};

export default hlTemperatureFetcher;
