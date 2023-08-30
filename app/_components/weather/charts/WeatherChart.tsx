"use client";

import { forwardRef } from "react";
import { LineChart, Line, LabelList } from "recharts";
import { useAppDispatch, useAppSelector } from "../../../_hooks/redux_hooks";
import { weatherComparisonTimeUpdated } from "../../../_reducers/weatherReducer";
import { dustComparisonTimeUpdated } from "../../../_reducers/dustReducer";
import { uvComparisonTimeUpdated } from "../../../_reducers/uvReducer";
import {
  risesetComparisonTimeUpdated,
  selectRisesetList,
} from "../../../_reducers/risesetReducer";
import getWeatherImage from "../../../_lib/getWeatherImage";
import type { Riseset, Weather } from "../../../_types/types";
import styles from "./WeatherChart.module.css";
import { getDayDifference } from "../../../_lib/dateUtils";
import dayjs from "../../../_lib/dayjs";

interface WeatherChartProps {
  weathers: Weather[];
  width: number;
}

const WeatherChart = forwardRef<any, WeatherChartProps>(function WeatherChart(
  props,
  ref
) {
  const { weathers } = props;
  return (
    <>
      <LineChart
        width={props.width}
        height={200}
        data={weathers}
        margin={{ top: 50, right: 20, bottom: 0, left: 20 }}
        ref={ref}
        className={styles.chart}
      >
        <Line
          isAnimationActive={false}
          type="monotone"
          dataKey="value.TMP"
          stroke="#8884d8"
          strokeWidth={2}
          fill="#ffffff"
        >
          <LabelList dataKey={(data) => data} content={WeatherChartLabelList} />
        </Line>
      </LineChart>
    </>
  );
});

export default WeatherChart;

const WeatherChartLabelList = (props) => {
  const { x, y, value } = props;
  const dispatch = useAppDispatch();
  const risesetList = useAppSelector(selectRisesetList);

  if (risesetList.length === 0) return;
  const dayDifference = getDayDifference(value.dt);
  const hour = new Date(value.dt).getHours();
  const tmp = value.value.TMP;

  const targetRiseset = extractTargetRiseset(risesetList, value.dt);
  const imageProperties = getWeatherImage(value, targetRiseset, 32, 32);

  const selectHandler = (dt: number) => {
    dispatch(weatherComparisonTimeUpdated(dt));
    dispatch(dustComparisonTimeUpdated(dt));
    dispatch(uvComparisonTimeUpdated(dt));
    dispatch(risesetComparisonTimeUpdated(dt));
  };

  return (
    <g>
      <line className={styles.line} x1={x} x2={x} y1={y + 5} y2={140} />
      <image
        className={styles.image}
        x={x - 34 / 2}
        y={130}
        width={34}
        height={34}
        href={imageProperties.src}
      />
      <text
        className={`${styles.time} ${
          dayDifference === 1
            ? styles.tommorow
            : dayDifference === 2
            ? styles.dayAfter
            : ""
        }`}
        x={x}
        y={180}
        textAnchor="middle"
      >
        {dayDifference === 1 && hour === 0
          ? "내일"
          : dayDifference === 2 && hour === 0
          ? "모레"
          : hour.toString().padStart(2, "0") + "시"}
      </text>
      <text className={styles.tmp} x={x} y={y - 10} textAnchor="middle">
        {tmp + "°"}
      </text>
      <rect
        className={styles.labelItem}
        x={x - 34 / 2}
        y={0}
        width={34}
        height={200}
        onClick={() => selectHandler(value.dt)}
      />
    </g>
  );
};

const parseDate = (dateString: string) => {
  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(4, 6)) - 1;
  const day = parseInt(dateString.substring(6, 8));

  return dayjs()
    .year(year)
    .month(month)
    .date(day)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .tz();
};

const extractTargetRiseset = (
  risesetList: Riseset[],
  timestamp: number
): Riseset[] => {
  const targetDate = dayjs(timestamp)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .tz();
  const afterTargetDate = targetDate
    .add(1, "day")
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .tz();
  const targetRiseset = risesetList.filter((riseset: Riseset) => {
    const risesetDate = parseDate(riseset.locdate[0].trim());
    if (risesetDate.isSame(targetDate) || risesetDate.isSame(afterTargetDate))
      return true;
  });
  return targetRiseset;
};
