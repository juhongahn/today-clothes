"use client";

import { useState, useEffect } from "react";
import { getXY } from "../searchWeather/SearchSection";
import styles from "./Tour.module.css";
import TourCard from "./TourCard";
import useCoords from "../../_hooks/useCoords";
import { useAppDispatch, useAppSelector } from "../../_hooks/redux_hooks";
import Badge from "./tourBadge/Badge";
import { fetchTour, selectTourList } from "../../_reducers/tourReducer";
import TourCardLoading from "./Loading";
import Slider from "../ui/Slider";

type BadgeType = {
  id: string;
  title: string;
  contentTypeId: number;
  selected: boolean;
};

const tourButtonProps = {
  round: true,
  position: {
    left: 30,
    right: 30,
  },
};

const badgeButtonProps = {
  round: false,
  position: {
    left: 16,
    right: 16,
  },
};

const Tour = () => {
  const dispatch = useAppDispatch();
  const tourList = useAppSelector(selectTourList);

  useEffect(() => {
    dispatch(fetchTour({ id: "tour", title: "관광지", contentTypeId: 12 }));
  }, []);

  const [badges, setBadges] = useState<BadgeType[]>([
    { id: "tour", title: "관광지", contentTypeId: 12, selected: true },
    { id: "restaurants", title: "맛집", contentTypeId: 39, selected: false },
    { id: "nature", title: "자연", contentTypeId: 12, selected: false },
    { id: "leisure", title: "레포츠", contentTypeId: 28, selected: false },
    { id: "shopping", title: "쇼핑", contentTypeId: 38, selected: false },
    { id: "experiential", title: "체험", contentTypeId: 12, selected: false },
    { id: "tracking", title: "트레킹", contentTypeId: 12, selected: false },
  ]);

  const cardSelectHandler = (tour: {
    title: string;
    location: string;
    image: string;
  }) => {
    locationSelectHandler(tour, dispatch);
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
          <Slider slideLength={200} buttonProps={badgeButtonProps}>
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
          <Slider slideLength={278} buttonProps={tourButtonProps}>
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

const locationSelectHandler = async (
  tour: {
    title: string;
    location: string;
    image: string;
  },
  dispatch
) => {
  const { x, y } = await getXY(tour.location);
  const coords = {
    latitude: parseFloat(y),
    longitude: parseFloat(x),
  };
  useCoords(coords, dispatch);
};

export default Tour;
