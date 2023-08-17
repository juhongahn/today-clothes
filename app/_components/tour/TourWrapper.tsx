"use client";

import { useEffect, useState } from "react";
import { appFetch } from "../../_helpers/custom-fetch/fetchWrapper";
import Tour from "./Tour";

const TourWrapper = () => {
  const tourList = useTourData();
  return <Tour tourList={tourList} />;
};

export type GetTourDataReturn = {
  title: string;
  location: string;
  image: string;
}[];

const useTourData = () => {
  const [tourList, setTourList] = useState<GetTourDataReturn>([]);
  useEffect(() => {
    const getTourData = async () => {
      const response = await appFetch("http://localhost:3000/api/toursite");
      if (!response.ok) throw new Error("데이터를 가져오는데 실패했습니다.");
      const data = await response.json();
      const result:GetTourDataReturn = data.data
      setTourList(result);
    };
    getTourData();
  }, []);
  return tourList;
};

export default TourWrapper;
