"use client";

import { useState, useEffect } from "react";
import { getXY } from "../searchWeather/SearchBar";
import {
  thunkUpdateCoords,
  useAppDispatch,
  useAppSelector,
} from "../../_hooks/redux_hooks";
import { fetchTour, selectTourList } from "../../_reducers/tourReducer";
import { COORDS } from "../../_types/types";
import TourCardLoading from "./Loading";
import Badge from "./tourBadge/Badge";
import TourCard from "./TourCard";
import Slider from "../ui/Slider";
import styles from "./Tour.module.css";

type BadgeType = {
  id: string;
  title: string;
  contentTypeId: number;
  selected: boolean;
};

const badgeButtonProps = {
  round: false,
  position: {
    left: 16,
    right: 16,
  },
};

const Tour = () => {
  const tourList = useAppSelector(selectTourList);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTour({ id: "tour", title: "관광지", contentTypeId: 12 }));
  }, []);
  const [isMobile, viewWidth] = useMobileDetect();
  const tourButtonProps = {
    round: true,
    position: {
      left: isMobile ? 20 : 30,
      right: isMobile ? 20 : 30,
    },
  };
  const [badges, setBadges] = useState<BadgeType[]>([
    { id: "tour", title: "관광지", contentTypeId: 12, selected: true },
    { id: "restaurants", title: "맛집", contentTypeId: 39, selected: false },
    { id: "nature", title: "자연", contentTypeId: 12, selected: false },
    { id: "leisure", title: "레포츠", contentTypeId: 28, selected: false },
    { id: "shopping", title: "쇼핑", contentTypeId: 38, selected: false },
    { id: "experiential", title: "체험", contentTypeId: 12, selected: false },
    { id: "tracking", title: "트레킹", contentTypeId: 12, selected: false },
  ]);

  const cardSelectHandler = async (tour: {
    title: string;
    location: string;
    image: string;
  }) => {
    try {
      const coords = await convertLocationToCoords(tour);
      dispatch(thunkUpdateCoords(coords));
    } catch (error) {
      //TODO: 좌표변환 실패시 에러처리.
    }
  };

  const badgeSelectHandler = (keyword: BadgeType) => {
    dispatch(fetchTour(keyword));
    const updatedBadges = badges.map((badge) =>
      badge.id === keyword.id
        ? { ...badge, selected: true }
        : { ...badge, selected: false }
    );
    setBadges(updatedBadges);
  };

  return (
    <div className={styles.tour}>
      <div className={styles.header}>
        <h3>여행지 추천</h3>
      </div>
      <div className={styles.body}>
        <div className={styles.badgeSlider}>
          <Slider
            slideLength={isMobile ? 100 : 200}
            buttonProps={badgeButtonProps}
          >
            {badges.map((badge) => (
              <Badge
                key={badge.id}
                onClick={badgeSelectHandler.bind(null, badge)}
                value={badge.title}
                selected={badge.selected}
              />
            ))}
          </Slider>
        </div>
        <div className={styles.tourSlider}>
          <Slider
            slideLength={isMobile ? 356 : 278}
            buttonProps={tourButtonProps}
          >
            {tourList.length > 0 ? (
              tourList.map((tour, idx) => (
                <TourCard
                  key={idx}
                  tour={tour}
                  cardSelectHandler={cardSelectHandler}
                />
              ))
            ) : (
              <TourCardLoading />
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

const convertLocationToCoords = async (tour: {
  title: string;
  location: string;
  image: string;
}): Promise<COORDS> => {
  const { x, y } = await getXY(tour.location);
  const coords = {
    latitude: parseFloat(y),
    longitude: parseFloat(x),
  };
  return coords;
};

type useMobileDetectReturn = [
  boolean,
  number
]

const useMobileDetect = ():useMobileDetectReturn => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0)
  useEffect(() => {
    if (window) {
      if (window.innerWidth <= 680) {
        setIsMobile(true);
        setWidth(window.innerWidth);
      }
    }
  }, []);
  return [isMobile, width];
};

export default Tour;
