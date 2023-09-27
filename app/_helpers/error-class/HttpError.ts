import { AxiosResponse } from "axios";

export class HttpError extends Error {
  response: Response | AxiosResponse;
  constructor(message: string, response: Response | AxiosResponse) {
    super(message);
    this.name = "HttpError";
    this.response = response;
  }
}
