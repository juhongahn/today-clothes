"use client";

import {
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
import useSlideNext, { SLIDE_TYPE } from "../../../_hooks/useSlideNext";

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
  const data = useTimeMatchedWeather();
  const [slideHandler, chartRef, containerRef, slideState] = useSlideNext();
  const [selectedChart, setSelectedChart] = useState<ChartType>({
    type: "weather",
    value: "날씨",
  });
  const selectChart = (chart: ChartType) => {
    slideHandler(SLIDE_TYPE.SLIDE_INITIALIZE);
    setSelectedChart(chart);
  };

  return (
    <div className={styles.charts}>
      {!slideState.isButtonDisabled.left && (
        <MdKeyboardArrowLeft
          size={30}
          onClick={slideHandler.bind(null, SLIDE_TYPE.SLIDE_LEFT)}
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
          {renderChart(selectedChart.type, data, chartRef, 614 * 4)}
        </div>
      </div>
      {!slideState.isButtonDisabled.right && (
        <MdKeyboardArrowRight
          onClick={slideHandler.bind(null, SLIDE_TYPE.SLIDE_RIGHT)}
          size={30}
          className={`${styles.arrow} ${styles.rightButton}`}
        />
      )}
    </div>
  );
};

const useTimeMatchedWeather = (): Weather[] => {
  const weathers = useAppSelector(selectWeatherList);
  const currentDate = new Date().getTime();
  const data = weathers.filter(
    (weather) => weather.dt >= currentDate && isAllValueContained(weather)
  );
  return data;
};

const renderChart = (
  selectedChart: string,
  data: Weather[],
  chartRef: MutableRefObject<any>,
  width: number,
) => {
  const size = { width: 32, height: 32 };
  switch (selectedChart) {
    case "weather":
      return (
        <>
          {data.length > 0 ? (
            <WeatherChart weathers={data} ref={chartRef} width={width} />
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
          <HumidityChart weathers={data} ref={chartRef} width={width}/>
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
          <PercipitationChart weathers={data} ref={chartRef} width={width}/>
        </Suspense>
      );
  }
};

const isAllValueContained = (obj: Weather) => {
  if (Object.keys(obj.value).length !== 14) return false;
  return true;
};

export default Charts;
