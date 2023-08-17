"use client";

import { Provider } from "react-redux";
import { store } from "../../store";
import WeatherWrapper from "../../_components/WeatherWrapper";
import TourWrapper from "../../_components/tour/TourWrapper";
import SearchSection from "../../_components/searchWeather/SearchSection";
import styles from "./WeatherPage.module.css";

const Page = () => {
  return (
    <div className={styles.page}>
      <Provider store={store}>
        <div className={styles.weather}>
          <WeatherWrapper />
        </div>
        <div className={styles.side}>
          <SearchSection />
          <TourWrapper />
        </div>
      </Provider>
    </div>
  );
};

export default Page;
