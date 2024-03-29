"use client";

import { forwardRef } from "react";
import { BarChart, Bar, LabelList } from "recharts";
import type { WEATHER } from "../../../_types/types";
import styles from "./WeatherChart.module.css";
import dayjs from "dayjs";
import { getDayDifference } from "../../../_lib/dateUtils";

interface HumidityChartProps {
  weathers: WEATHER[];
  width: number;
}

const HumidityChart = forwardRef<any, HumidityChartProps>(function HumidityChart(props, ref) {
  const weathers = props.weathers;
  return (
    <>
      <BarChart
        width={props.width}
        height={180}
        data={weathers}
        ref={ref}
        margin={{
          top: 50,
          left: 0,
          right: 0,
          bottom: 50,
        }}
        className={styles.chart}
      >
        <Bar isAnimationActive={false} fill="#c4f0ff" dataKey="value.REH">
          <LabelList
            dataKey={(data) => data}
            content={<HumidityChartLabelList external={external} />}
          />
        </Bar>
      </BarChart>
    </>
  );
});
export default HumidityChart;

const HumidityChartLabelList = (props) => {
  const { x, y, width, value } = props;
  const dayDifference = getDayDifference(value.dt);
  const hour = dayjs(value.dt).hour();
  const reh = value.value.REH;
  return (
    <g>
      <text
        className={styles.tmp}
        x={x + width / 2}
        y={y - 10}
        textAnchor="middle"
      >
        {reh + "%"}
      </text>
      <text
        className={`${styles.time} ${
          dayDifference === 1
            ? styles.tommorow
            : dayDifference === 2
            ? styles.dayAfter
            : ""
        }`}
        x={x + width / 2}
        y={155}
        textAnchor="middle"
      >
        {dayDifference === 1 && hour === 0 ? "내일" : dayDifference === 2 && hour === 0 ? "모레" : hour.toString().padStart(2,'0') + "시"}
      </text>
    </g>
  );
};