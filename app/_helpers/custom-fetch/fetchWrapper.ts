import { NextResponse } from "next/server";
import { HttpError } from "../error-class/HttpError";

const isPlainObject = (value: unknown) => value?.constructor === Object;

export const appFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  let initOptions = init;
  if (initOptions?.body) {
    if (Array.isArray(initOptions.body) || isPlainObject(initOptions.body)) {
      initOptions = {
        ...initOptions,
        body: JSON.stringify(initOptions.body),
        headers: {
          "Content-Type": "application/json",
          ...initOptions.headers,
        },
      };
    }
  }
  const response = await fetch(input, initOptions);
  if (!response.ok) {
    const { error } = await response.json();
    throw new HttpError(error, response);
  }
  return response;
};

export const handleError = (
  error: unknown,
  handler: (body: any, init?: ResponseInit) => NextResponse
) => {
  // console.error(error);

  if (error instanceof HttpError) {
    switch (error.response.status) {
      case 400:
        return handler(
          { error: error.message },
          { status: error.response.status }
        );
      default:
        return handler(
          { error: "데이터 요청 중 에러가 발생했습니다." },
          { status: 500 }
        );
    }
  }
  return handler({ error: "서버 에러가 발생했습니다." }, { status: 500 });
};
