"use client";

import { Provider } from "react-redux";
import { store } from "../../store";
import WeatherWrapper from "../../_components/WeatherWrapper";
import SearchSection from "../../_components/searchWeather/SearchSection";
import styles from "./WeatherPage.module.css";
import NavBar from "../../_components/navbar/NavBar";
import Tour from "../../_components/tour/Tour";

const Page = () => {
  return (
    <div className={styles.page}>
      <Provider store={store}>
        <NavBar />
        <div className={styles.weather}>
          <WeatherWrapper />
        </div>
        <div className={styles.side}>
          <div className={styles.searchbar}>
            <SearchSection />
          </div>
          <div className={styles.tour}>
            <Tour />
          </div>
        </div>
      </Provider>
    </div>
  );
};

export default Page;
