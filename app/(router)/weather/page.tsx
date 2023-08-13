"use client"

import { Provider } from "react-redux";
import { store } from "../../store";
import WeatherWrapper from "../../_components/WeatherWrapper";


const Page = () => {
  return (
    <Provider store={store}>
      <WeatherWrapper />
    </Provider>
  );
};

export default Page;
