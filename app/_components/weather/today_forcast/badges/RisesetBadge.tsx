import { Draft } from "@reduxjs/toolkit";
import { useAppSelector } from "../../../../_hooks/redux_hooks";
import {
  selectComparisonTime,
} from "../../../../_reducers/risesetReducer";
import Badge from "../../../ui/badge/Badge";
import { RISESET } from "../../../../_types/types";

interface Props {
  riseset: RISESET[];
}

const RisesetBadge = ({ riseset }: Props) => {
  const standardTime = useAppSelector(selectComparisonTime);
  const { isSunrise, sunriseTime, sunsetTime } = convertRisesetBadgeObject(
    riseset,
    standardTime
  );
  return (
    <Badge
      title={isSunrise ? "일몰" : "일출"}
      value={isSunrise ? sunsetTime : sunriseTime}
      grade={isSunrise ? "일몰" : "일출"}
    />
  );
};

export default RisesetBadge;

const isSunrisePast = (
  selectedRiseset: Draft<RISESET>[],
  standardTime: number
) => {
  let isSunrise = false;
  const curDate = new Date(standardTime);
  const todaySunset = selectedRiseset[0].sunset;
  const tommorowSunrise = selectedRiseset[1].sunrise;
  const sunriseTime = convertToTimeFormat(tommorowSunrise);
  const sunsetTime = convertToTimeFormat(todaySunset);
  // // 현재시간이 set과 rise 사이에 있으면 isSunrise = flase
  if (hasTimePassed(curDate, sunsetTime)) {
    isSunrise = false;
  } else {
    if (!hasTimePassed(curDate, sunriseTime)) {
      isSunrise = false;
    } else {
      isSunrise = true;
    }
  }
  return isSunrise;
};

const getCurrentTimeAsString = (now: Date): string => {
  const currentHour = now.getHours().toString().padStart(2, "0");
  const currentMinute = now.getMinutes().toString().padStart(2, "0");
  return currentHour + currentMinute;
};

const hasTimePassed = (now: Date, targetTime: string): boolean => {
  const currentTime = getCurrentTimeAsString(now);
  return currentTime > targetTime;
};

const convertToTimeFormat = (inputStr: string) => {
  const number = parseInt(inputStr, 10);
  const hours = Math.floor(number / 100);
  const minutes = number % 100;
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hoursStr}:${minutesStr}`;
};

const convertRisesetBadgeObject = (
  selectedRiseset: Draft<RISESET>[],
  standardTime: number
) => {
  const isSunrise = isSunrisePast(selectedRiseset, standardTime);
  const todaySunset = selectedRiseset[0].sunset;
  const tommorowSunrise = selectedRiseset[1].sunrise;
  const sunriseTime = convertToTimeFormat(tommorowSunrise);
  const sunsetTime = convertToTimeFormat(todaySunset);
  return { isSunrise, sunriseTime, sunsetTime };
};
