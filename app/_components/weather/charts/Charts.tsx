"use client";

import {
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  Suspense,
  lazy,
} from "react";
import { useAppSelector } from "../../../_hooks/redux_hooks";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";
import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import { selectWeatherList } from "../../../_reducers/weatherReducer";
import WeatherChart from "./WeatherChart";
import type { Weather } from "../../../_types/types";
import Loading from "../../ui/Loading";
import styles from "./Charts.module.css";

const HumidityChart = lazy(() => import("./HumidityChart"));
const PercipitationChart = lazy(() => import("./PercipitationChart"));

type ChartType = {
  type: "weather" | "percipitation" | "humidity";
  value: "날씨" | "강수량" | "습도";
};

const ChartList: ChartType[] = [
  { type: "weather", value: "날씨" },
  { type: "percipitation", value: "강수량" },
  { type: "humidity", value: "습도" },
];

const Charts = () => {
  const weathers = useAppSelector(selectWeatherList);
  const [selectedChart, setSelectedChart] = useState<ChartType>({
    type: "weather",
    value: "날씨",
  });
  const [xPos, setXPos] = useState<number>(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: true, right: false });

  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().getTime();
  const data = weathers.filter(
    (weather) => weather.dt >= currentDate && isAllValueContained(weather)
  );

  const selectChart = (chart: ChartType) => {
    setXPos(0);
    setIsButtonDisabled({ left: true, right: false });
    setSelectedChart(chart);
  };

  useEffect(() => {
    if (chartRef.current) {
      const chartWidth = chartRef.current.container.offsetWidth;
      const offset = containerRef.current.offsetWidth;
      chartRef.current.container.style.transform = `translateX(${xPos}px)`;
      if (Math.abs(xPos) + offset >= chartWidth - 20) {
        setIsButtonDisabled((prev) => {
          return {
            left: prev.left,
            right: true,
          };
        });
      } else if (xPos === 0) {
        setIsButtonDisabled((prev) => {
          return {
            left: true,
            right: prev.right,
          };
        });
      } else if (
        Math.abs(xPos) > 0 &&
        Math.abs(xPos) + offset < chartWidth - 20
      ) {
        setIsButtonDisabled(() => {
          return {
            left: false,
            right: false,
          };
        });
      }
    }
  }, [xPos]);

  const slideRight = () => {
    const offset = containerRef.current.offsetWidth;
    setXPos((prev) => prev - offset);
  };

  const slideLeft = () => {
    const offset = containerRef.current.offsetWidth;
    setXPos((prev) => prev + offset);
  };

  return (
    <div className={styles.charts}>
      {!isButtonDisabled.left && (
        <MdKeyboardArrowLeft
          size={30}
          onClick={slideLeft}
          className={`${styles.arrow} ${styles.leftButton}`}
        />
      )}
      <div className={styles.container} ref={containerRef}>
        <div className={styles.tab}>
          {ChartList.map((chart, idx) => (
            <p
              id={chart.type}
              key={idx}
              onClick={selectChart.bind(null, chart)}
              className={`${styles.tabItem} ${
                selectedChart.type === chart.type && styles.selectedItem
              }`}
            >
              {chart.value}
            </p>
          ))}
        </div>
        <div className={styles.chartContainer}>
          {renderChart(selectedChart.type, data, chartRef)}
        </div>
      </div>
      {!isButtonDisabled.right && (
        <MdKeyboardArrowRight
          onClick={slideRight}
          size={30}
          className={`${styles.arrow} ${styles.rightButton}`}
        />
      )}
    </div>
  );
};

const renderChart = (
  selectedChart: string,
  data: Weather[],
  chartRef: MutableRefObject<any>
) => {
  const size = { width: 32, height: 32 };
  switch (selectedChart) {
    case "weather":
      return (
        <>
          {data.length > 0 ? (
            <WeatherChart weathers={data} ref={chartRef} />
          ) : (
            <div className={styles.chartLoading}>
              <Loading size={size} />
            </div>
          )}
        </>
      );
    case "humidity":
      return (
        <Suspense
          fallback={
            <div className={styles.chartLoading}>
              <Loading size={size} />
            </div>
          }
        >
          <HumidityChart weathers={data} ref={chartRef} />
        </Suspense>
      );
    case "percipitation":
      return (
        <Suspense
          fallback={
            <div className={styles.chartLoading}>
              <Loading size={size} />
            </div>
          }
        >
          <PercipitationChart weathers={data} ref={chartRef} />
        </Suspense>
      );
  }
};

const isAllValueContained = (obj: Weather) => {
  if (Object.keys(obj.value).length !== 14) return false;
  return true;
};

export default Charts;
