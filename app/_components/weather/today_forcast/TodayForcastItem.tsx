"use client";

import Image from "next/image";
import getWeatherImage from "../../../_lib/getWeatherImage";
import { RISESET, WEATHER } from "../../../_types/types";
import styles from "./TodayForcastItem.module.css";

interface Props {
  weather: WEATHER;
  riseset: RISESET[];
}

const TodayForcastItem = ({ weather, riseset }: Props) => {
  const imgProperty = getWeatherImage(weather, riseset, 64, 64);
  const curTime = getCurrentTime(weather.dt);
  const { TMP, POP, WSD, REH, TMX, TMN } = weather.value;
  const sensoryTemperature = calcSensoryTemperature(
    parseFloat(TMP),
    parseFloat(WSD)
  );
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.graphic}>
          <Image
            {...imgProperty}
            alt={imgProperty.alt}
            className={styles.img}
          />
          <div className={styles.temperatureContainer}>
            <p className={styles.temperature}>{TMP}°</p>
            <p className={styles.sensory}>
              <span>체감</span> {sensoryTemperature}°
            </p>
          </div>
        </div>
        <div className={styles.forcasts}>
          <p className={styles.fItem}>강수확률: {POP}%</p>
          <p className={`${styles.fItem} ${styles.slash}`}>습도: {REH}%</p>
          <p className={`${styles.fItem} ${styles.slash}`}>풍속: {WSD}m/s</p>
        </div>
      </div>
      <div className={styles.description}>
        <p>{curTime}</p>
        <p className={styles.slash}>{imgProperty.alt}</p>
        {TMX && TMN && (
          <p className={styles.slash}>
            <span>H: {parseInt(TMX)}°</span> / <span>L: {parseInt(TMN)}°</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default TodayForcastItem;

/**
 *
 * @param date
 * @returns "(월) 오전 1시"
 */
function getCurrentTime(selectedTimeInUnix: number) {
  const date = new Date(selectedTimeInUnix);
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = daysOfWeek[date.getDay()];
  let hours = date.getHours();
  let period = "오전";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
    period = "오후";
  }

  return `(${dayOfWeek}) ${period} ${hours}시`;
}

const calcSensoryTemperature = (temperature: number, windSpeedMps: number) => {
  const sensoryTemperature =
    13.12 +
    0.6215 * temperature -
    11.37 * Math.pow(windSpeedMps, 0.16) +
    0.3965 * temperature * Math.pow(windSpeedMps, 0.16);
  return sensoryTemperature.toFixed(1);
};
