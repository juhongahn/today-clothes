"use client";

import { useSelector } from "react-redux";
import { useAppSelector } from "../../../_hooks/redux_hooks";
import styles from "./CurrentWeather.module.css";
import CurrentWeatherItem from "./item/CurrentWeatherItem";
import {
  selectComparisonTime,
  selectMatchedRiseset,
} from "../../../_reducers/risesetReducer";
import { selectMatchedDust } from "../../../_reducers/dustReducer";
import { selectMatchedUV } from "../../../_reducers/uvReducer";
import Loading from "../../ui/Loading";

const CurrentWeather = () => {
  return (
    <div className={styles.container}>
      <CurrentWeatherItem />
      <div className={styles.footer}>
        <Badges />
        <RiseSetBadge />
      </div>
    </div>
  );
};

const Badges = () => {
  const selectedDust = useAppSelector(selectMatchedDust);
  const selectedUV = useAppSelector(selectMatchedUV);
  if (!selectedDust || !selectedUV) {
    return (
      <>
        {...Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`${styles.fItem} ${styles.default}`}>
            <Loading />
          </div>
        ))}
      </>
    );
  }
  const dustkeys = Object.keys(selectedDust.components);
  const valueMap = {
    좋음: "good",
    보통: "normal",
    나쁨: "caution",
    매우나쁨: "bad",
    위험: "bad",
  };

  return (
    <>
      {
        <div
          className={`${styles.fItem} ${
            styles[valueMap[selectedUV.components.uv.grade]]
          }`}
        >
          <p className={styles.label}>자외선</p>
          <p className={styles.value}> {selectedUV.components.uv.grade}</p>
        </div>
      }
      {dustkeys.map((key, index) => {
        if (key === "pm10" || key === "pm2_5" || key === "o3")
          return (
            <div
              key={index}
              className={`${styles.fItem} ${
                styles[valueMap[selectedDust.components[key].grade]]
              }`}
            >
              <p className={styles.label}>{switchTitle(key)}</p>
              <p className={styles.value}> {selectedDust.components[key].grade}</p>
            </div>
          );
      })}
    </>
  );
};

const switchTitle = (key: string) => {
  switch (key) {
    case "pm10":
      return "미세먼지";
    case "pm2_5":
      return "초미세먼지";
    case "o3":
      return "오존";
    case "uv":
      return "자외선";
    default:
      return "";
  }
};

const convertToTimeFormat = (inputStr: string) => {
  const number = parseInt(inputStr, 10);
  const hours = Math.floor(number / 100);
  const minutes = number % 100;
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hoursStr}:${minutesStr}`;
};

const RiseSetBadge = () => {
  const selectedRiseset = useSelector(selectMatchedRiseset);
  const standardTime = useSelector(selectComparisonTime);
  if (selectedRiseset.length === 0)
    return (
      <div className={`${styles.fItem} ${styles.default}`}>
        <Loading />
      </div>
    );
  let isSunrise = false; // 일몰 이후를 의미.

  const curDate = new Date(standardTime);
  const todaySunset = selectedRiseset[0].sunset[0];
  const tommorowSunrise = selectedRiseset[1].sunrise[0];

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
  return (
    <div
      className={`${styles.fItem} ${
        isSunrise ? styles.sunset : styles.sunrise
      }`}
    >
      <p className={styles.label}>{isSunrise ? "일몰" : "일출"}</p>
      <p className={styles.value}> {isSunrise ? sunsetTime : sunriseTime}</p>
    </div>
  );
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

export default CurrentWeather;
