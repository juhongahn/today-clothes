"use client";

import { Provider } from "react-redux";
import { store } from "../../store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiErrorBoundary from "../../_components/error_boundary/ApiErrorBoundary";
import TourFetcher from "../../_fetchers/TourFetcher";
import LocalFetcher from "../../_fetchers/LocalFetcher";
import WeeklyForcastFetcher from "../../_fetchers/WeeklyForcastFetcher";
import TodayForcastFetcher from "../../_fetchers/TodayForcastFetcher";
import ChartsFetcher from "../../_fetchers/ChartsFetcher";
import TodayForcast from "../../_components/weather/today_forcast/TodayForcast";
import WeeklyForcast from "../../_components/weather/weeklyForcast/WeeklyForcast";
import Charts from "../../_components/weather/charts/Charts";
import WeatherHeader from "../../_components/weather/today_forcast/WeatherHeader";
import Tour from "../../_components/tour/Tour";
import SearchSection from "../../_components/searchWeather/SearchSection";
import NavBar from "../../_components/navbar/NavBar";
import styles from "./WeatherPage.module.css";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const coords = sessionStorage.getItem("coords");
    if (!coords) {
      alert("위치 엑세스를 허용 해주세요.");
      router.push("/");
    }
  }, []);

  return (
    <Provider store={store}>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.main}>
          <LocalFetcher>
            <WeatherHeader />
          </LocalFetcher>
          <div className={styles.weather}>
            <ApiErrorBoundary>
              <TodayForcastFetcher>
                <TodayForcast />
              </TodayForcastFetcher>
            </ApiErrorBoundary>
            <ApiErrorBoundary>
              <ChartsFetcher>
                <Charts />
              </ChartsFetcher>
            </ApiErrorBoundary>
            <ApiErrorBoundary>
              <WeeklyForcastFetcher>
                <WeeklyForcast />
              </WeeklyForcastFetcher>
            </ApiErrorBoundary>
          </div>
        </div>
        <div className={styles.side}>
          <div className={styles.searchbar}>
            <SearchSection />
          </div>
          <div className={styles.tour}>
            <ApiErrorBoundary>
              <TourFetcher>
                <Tour />
              </TourFetcher>
            </ApiErrorBoundary>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default Page;
