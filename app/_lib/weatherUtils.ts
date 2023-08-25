import { dfs_xy_conv } from "./gridConverter.js";
import { REQ_TYPE } from "../_types/types";

/**
 *
 * @returns baseTime (Str)
 */
function getNearPredictionTime(hours: number): string {
  if (hours < 3) {
    // 2시 이전이라면 전날 자료를 사용해야한다.
    return "2300";
  }
  // Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
  const forecastTimes: number[] = [2, 5, 8, 11, 14, 17, 20, 23];
  let left = 0;
  let right = forecastTimes.length - 1;
  let result = null;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (forecastTimes[mid] === hours) {
      result = forecastTimes[mid - 1];
      break;
    } else if (forecastTimes[mid] < hours) {
      result = forecastTimes[mid];
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result.toString().padStart(2, "0") + "00";
}

/**
 * 오늘 yyyymmdd 반환하는 함수
 * @returns '20230330'
 */
export function getBaseDate(req: REQ_TYPE, date: Date): string {
  const hours = date.getHours();
  if (hours < 3 && req === REQ_TYPE.WEATHER) {
    // 날씨 데이터의 경우 02시 이전 이라면 전날 자료를 사용해야한다.
    date.setDate(date.getDate() - 1);
  } else if (hours < 6 && req === REQ_TYPE.DUST) {
    // 미세먼지 데이터의 경우 5시 이전이라면 전날 자료를 사용해야한다.
    date.setDate(date.getDate() - 1);
  } else if (hours < 4 && req === REQ_TYPE.UV) {
    date.setDate(date.getDate() - 1);
  }
  let year = date.getFullYear();
  let month = ("0" + (1 + date.getMonth())).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  if (req === REQ_TYPE.WEATHER || req === REQ_TYPE.UV)
    return year + month + day; // 날씨 데이터의 경우 yyyymmdd 형식으로 반환
  else return year + "-" + month + "-" + day; // 미세먼지 데이터의 경우 yyyy-mm-dd 형식으로 반환
}

export const dateFormatter = (curDate: Date): string => {
  let year = curDate.getFullYear();
  let month = ("0" + (1 + curDate.getMonth())).slice(-2);
  let day = ("0" + curDate.getDate()).slice(-2);
  return year + month + day;
};

export const dateFormatter1 = (currentDate: Date, joint: string = ""): string => {
  let year = currentDate.getFullYear();
  let month = ("0" + (1 + currentDate.getMonth())).slice(-2);
  let day = ("0" + currentDate.getDate()).slice(-2);
  return [year, month, day].join(joint);
};

/**
 *
 * @returns 미세먼지 api 요청 주소 반환
 */
export function getMinuDustRequestURL() {
  const date = new Date();
  const serviceKey: string = process.env.SERVICE_KEY;
  const dataType: string = "json";
  const baseDate: string = getBaseDate(REQ_TYPE.DUST, date);

  return `serviceKey=${serviceKey}&returnType=${dataType}&searchDate=${baseDate}`;
}

/**
 *
 * @param date 기준 날짜
 * @param elapseDays 경과 시키고 싶은 일
 * @returns 경과된 날짜
 */
export const advanceTime = (date: Date, elapseDays: number) => {
  let copyDate = new Date(date);
  copyDate.setDate(copyDate.getDate() + elapseDays);
  return copyDate;
};
