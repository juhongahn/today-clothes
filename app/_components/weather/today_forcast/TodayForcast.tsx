"use client";

import Card from "../../ui/card/Card";
import TodayForcastItem from "./TodayForcastItem";
import TodayForcastBadges from "./TodayForcastBadges";
import { useAppSelector } from "../../../_hooks/redux_hooks";
import { selectTodayForcast } from "../../../_reducers/todayForcastReducer";

const TodayForcast = () => {
  const { weather, uv, dust, riseset } = useAppSelector(selectTodayForcast);

  return (
    <Card
      title={"일간 예보"}
      body={<TodayForcastItem weather={weather} riseset={riseset} />}
      footer={<TodayForcastBadges uv={uv} dust={dust} riseset={riseset} />}
    />
  );
};

export default TodayForcast;
