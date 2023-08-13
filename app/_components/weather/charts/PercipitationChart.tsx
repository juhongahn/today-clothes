"use client";

import { forwardRef } from "react";
import { BarChart, Bar, LabelList } from "recharts";
import type { Weather } from "../../../_types/types";
import styles from "./WeatherChart.module.css";

interface PercipitationChartProps {
  weathers: Weather[];
}

const PercipitationChart = forwardRef<any, PercipitationChartProps>(
  function PercipitaionChart(props, ref) {
    const weathers = props.weathers;
    return (
      <>
        <p className={styles.legend}>강수확률 (%) | 강수량 (mm)</p>
        <BarChart
          width={615 * 3}
          height={180}
          data={weathers}
          ref={ref}
          margin={{
            top: 80,
            left: 0,
            right: 0,
            bottom: 50,
          }}
          className={styles.chart}
        >
          <Bar isAnimationActive={false} fill="#f3f5fc" dataKey={() => 5}>
            <LabelList
              dataKey={(data) => data}
              content={<PercipitaionChartLabelList external={external} />}
            />
          </Bar>
        </BarChart>
      </>
    );
  }
);
export default PercipitationChart;

const PercipitaionChartLabelList = (props) => {
  const { x, y, width, height, value } = props;
  const targetDate = new Date(value.dt);
  const dayDifference = getDayDifference(value.dt);

  const hour = targetDate.getHours();
  const pcp = extractPCP(value.value.PCP);
  const pop = parseInt(value.value.POP);

  // 물방울의 기본 색상과 채워지는 색상을 정의합니다.
  return (
    <>
      <svg>
        <symbol
          id="waterDrop"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 6
           Q 15 6, 25 18
           A 12.8 12.8 0 1 1 5 18
           Q 15 6 15 6z"
          />
          /
        </symbol>
      </svg>
      <svg
        className={styles.svgIcon}
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        x={x + 7}
        y={20}
      >
        <defs>
          <mask id="mwaterDrop">
            <use fill="white" xlinkHref="#waterDrop"></use>
          </mask>
        </defs>
        <use xlinkHref="#waterDrop" stroke="#e1e3ed" fill="#e1e3ed"></use>
        <rect
          x="0"
          y={`${convertPOPToHeight(pop)}%`}
          fill="#068FFF"
          width="100%"
          height="32"
          mask="url(#mwaterDrop)"
        />
      </svg>
      <text
        className={styles.tmp}
        x={x + width / 2}
        y={20 + 32 + 8}
        textAnchor="middle"
      >
        {pop + "%"}
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
      <text
        className={styles.pcp}
        fill={pcp !== 0 ? "#000000" : "#7294eb"}
        x={x + width / 2}
        y={y + height / 2 + 5}
        textAnchor="middle"
      >
        {pcp}
      </text>
      {pcp !== 0 && (
        <rect
          style={{ fill: "rgba(115, 159, 255, 0.4)" }}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      )}
    </>
  );
};

const convertPOPToHeight = (pop) => {
  const ranges = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
  const heights = [0, 25, 30, 40, 45, 50, 55, 60, 65, 75, 100];

  for (let i = 0; i < ranges.length; i++) {
    if (pop >= ranges[i]) {
      return heights[i];
    }
  }

  return 100;
};

const extractPCP = (inputString: string | undefined): number => {
  if (inputString === "강수없음" || typeof inputString === undefined) return 0;
  else if (inputString) {
    const strNumber = inputString.match(/\d+\.\d+|\d+/g);
    return parseInt(strNumber[0]);
  }
};

const getDayDifference = (timestamp: number): number => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const currentTime = currentDate.getTime();
  const oneDayInTime = 24 * 60 * 60 * 1000;

  const daysDifference = Math.floor((timestamp - currentTime) / oneDayInTime);
  return daysDifference;
};