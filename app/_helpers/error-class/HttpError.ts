export class HttpError extends Error {
  response: Response;
  constructor(message: string, response: Response) {
    super(message);
    this.name = "HttpError";
    this.response = response;
  }
}
