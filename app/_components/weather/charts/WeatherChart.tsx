"use client";

import { forwardRef } from "react";
import { LineChart, Line, LabelList, XAxis } from "recharts";
import { useAppDispatch, useAppSelector } from "../../../_hooks/redux_hooks";
import {
  selectWeatherList,
  weatherComparisonTimeUpdated,
} from "../../../_reducers/weatherReducer";
import { dustComparisonTimeUpdated } from "../../../_reducers/dustReducer";
import { uvComparisonTimeUpdated } from "../../../_reducers/uvReducer";
import {
  risesetComparisonTimeUpdated,
  selectRisesetList,
} from "../../../_reducers/risesetReducer";
import getWeatherImage from "../../../_lib/getWeatherImage";
import type { RISESET, WEATHER } from "../../../_types/types";
import styles from "./WeatherChart.module.css";
import { getDayDifference } from "../../../_lib/dateUtils";
import dayjs from "../../../_lib/dayjs";

interface WeatherChartProps {
  weathers: WEATHER[];
  width: number;
}

const CHART_HEIGHT = 250;

const WeatherChart = forwardRef<any, WeatherChartProps>(function WeatherChart(
  props,
  ref
) {
  const { weathers, width } = props;
  return (
    <LineChart
      width={width}
      height={CHART_HEIGHT}
      data={weathers}
      margin={{ top: 30, right: 20, bottom: 30, left: 20 }}
      ref={ref}
      className={styles.chart}
    >
      <Line
        isAnimationActive={false}
        type="monotone"
        dataKey={(v) => parseFloat(v.value.TMP)}
        stroke="#8884d8"
        strokeWidth={2}
        fill="#ffffff"
      >
        <LabelList
          dataKey={(data) => data}
          content={WeatherChartValueLabelList}
        />
      </Line>
      <XAxis
        dataKey="dt"
        interval={0}
        tick={<DateXAixs />}
        axisLine={false}
        tickLine={false}
      />
    </LineChart>
  );
});

export default WeatherChart;

const DateXAixs = (props) => {
  const {
    x,
    y,
    payload: { value },
  } = props;
  const risesetList = useAppSelector(selectRisesetList);
  const weatherList = useAppSelector(selectWeatherList);

  if (risesetList.length === 0) return;
  if (weatherList.length === 0) return;

  const dayDifference = getDayDifference(value);
  const hour = new Date(value).getHours();
  const targetRiseset = extractTargetRiseset(risesetList, value);
  const currentWeather = weatherList.find((weather) => weather.dt === value);
  const imageProperties = getWeatherImage(
    currentWeather,
    targetRiseset,
    32,
    32
  );

  return (
    <g>
      <line
        className={styles.line}
        x={x}
        y={y}
        // x1={x}
        // x2={x}
        // y1={y + 5}
        // y2={CHART_HEIGHT - 60}
      />
      <image
        className={styles.image}
        x={x - 34 / 2}
        y={CHART_HEIGHT - 60}
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
        y={CHART_HEIGHT - 10}
        textAnchor="middle"
      >
        {dayDifference === 1 && hour === 0
          ? "내일"
          : dayDifference === 2 && hour === 0
          ? "모레"
          : hour.toString().padStart(2, "0") + "시"}
      </text>
    </g>
  );
};

const WeatherChartValueLabelList = (props) => {
  const { x, y, value } = props;
  const dispatch = useAppDispatch();
  const risesetList = useAppSelector(selectRisesetList);
  if (risesetList.length === 0) return;
  const tmp = value.value.TMP;

  const selectHandler = (dt: number) => {
    dispatch(weatherComparisonTimeUpdated(dt));
    dispatch(dustComparisonTimeUpdated(dt));
    dispatch(uvComparisonTimeUpdated(dt));
    dispatch(risesetComparisonTimeUpdated(dt));
  };

  return (
    <g>
      <line
        className={styles.line}
        x1={x}
        x2={x}
        y1={y + 5}
        y2={CHART_HEIGHT - 60}
      />
      <text className={styles.tmp} x={x} y={y - 10} textAnchor="middle">
        {tmp + "°"}
      </text>
      <rect
        className={styles.labelItem}
        x={x - 34 / 2}
        y={0}
        width={34}
        height={CHART_HEIGHT}
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
  risesetList: RISESET[],
  timestamp: number
): RISESET[] => {
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
  const targetRiseset = risesetList.filter((riseset: RISESET) => {
    const risesetDate = parseDate(riseset.locdate.toString());
    if (risesetDate.isSame(targetDate) || risesetDate.isSame(afterTargetDate))
      return true;
  });
  return targetRiseset;
};
