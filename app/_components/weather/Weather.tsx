"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { useAppSelector } from "../../_hooks/redux_hooks";
import { selectLocal } from "../../_reducers/localReducer";
import CurrentWeather from "./currentWeather/CurrentWeather";
import Loading from "../ui/Loading";
import Button from "../ui/Button";
import Charts from "./charts/Charts";
import styles from "./Weather.module.css";
import { RootState } from "../../store";
import WeeklyForcast from "./weeklyForcast/WeeklyForcast";

const RecommendatioModal = lazy(() => import("../../_components/recommendation/RecommendationModal"));

const Weather = () => {
  const local = useAppSelector(selectLocal);
  const isAllDataReady = useAllLoaded();
  const [isModalShow, recommendationModalHandler, portalDiv] =
    useRecommendationModal();

  return (
    <div className={styles.weather}>
      <div className={styles.header}>
        {local ? (
          <p>
            {local.region_2depth_name} {local.region_3depth_name}
          </p>
        ) : (
          <Loading />
        )}
        <div className={styles.clothButton}>
          {isAllDataReady ? (
            <Button
              variant="secondary"
              size="md"
              text="오늘의 옷 보기"
              onClick={recommendationModalHandler.bind(null, false)}
            />
          ) : (
            <Button variant="secondary" size="md">
              <Loading />
            </Button>
          )}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.card}>
          <CurrentWeather />
        </div>
        <div className={`${styles.card} ${styles.chart}`}>
          <Charts />
        </div>
        <div className={styles.card}>
        {/* <WeeklyForcast /> */}
        </div>
      </div>
      {isModalShow &&
        portalDiv &&
        createPortal(
          <Suspense fallback={
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Loading size={{ width: 32, height: 32 }} />
            </div>
          }>
          <RecommendatioModal
            modalHandler={recommendationModalHandler}
          />
          </Suspense>,
          portalDiv
        )}
    </div>
  );
};
type UseRecommendationModalReturn = [
  boolean,
  () => void,
  Element | null,
];
const useRecommendationModal = (): UseRecommendationModalReturn => {
  const [isModalShow, setIsModalShow] = useState<boolean>(false);
  const [portalDiv, setPortalDiv] = useState<Element | null>(null);
  useEffect(() => {
    setPortalDiv(document.getElementById("modal-portal"));
  }, []);

  const recommendationModalHandler = (promptLoading?: boolean) => {
    if (promptLoading) return;
    setIsModalShow((prev) => !prev);
  };
  return [isModalShow, recommendationModalHandler, portalDiv];
};

const useAllLoaded = () => {
  const weatherState = useAppSelector(
    (state: RootState) => state.weather.status
  );
  const uvState = useAppSelector((state: RootState) => state.uv.status);
  const risesetState = useAppSelector(
    (state: RootState) => state.riseset.status
  );
  const dustState = useAppSelector((state: RootState) => state.dust.status);
  return (
    weatherState === "fulfilled" &&
    uvState === "fulfilled" &&
    risesetState === "fulfilled" &&
    dustState === "fulfilled"
  );
};

export default Weather;
