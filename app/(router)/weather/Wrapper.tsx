"use client";

import { Provider } from "react-redux";
import { store } from "../../store";
import WeatherWrapper from "../../_components/WeatherWrapper";

export default function Wrapper() {
  return (
    <Provider store={store}>
      <WeatherWrapper />
    </Provider>
  );
}
