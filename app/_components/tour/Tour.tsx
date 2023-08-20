"use client";

import { useRef, useState, MutableRefObject, useEffect } from "react";
import { getXY } from "../searchWeather/SearchSection";
import styles from "./Tour.module.css";
import TourCard from "./TourCard";
import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";
import useCoords from "../../_hooks/useCoords";
import { useAppDispatch, useAppSelector } from "../../_hooks/redux_hooks";
import Badge from "./tourBadge/Badge";
import { fetchTour, selectTourList } from "../../_reducers/tourReducer";

type BadgeType = {
  id: string;
  title: string;
  contentTypeId: number;
  selected: boolean;
};

const Tour = () => {
  const dispatch = useAppDispatch();
  const tourList = useAppSelector(selectTourList);

  const cardsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [cardsButtonState, cardsSliderHandler] = useSlide(cardsRef);
  const [badgeButtonState, badgeSliderHandler] = useSlide(badgeRef);

  useEffect(() => {
    dispatch(fetchTour({ id: "tour", title: "관광지", contentTypeId: 12 }));
  }, []);

  useEffect(() => {
    badgeSliderHandler({ slideType: SlideType.RESET, slideLength: 0 }),
      cardsSliderHandler({ slideType: SlideType.RESET, slideLength: 0 });
  }, [tourList]);

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
          {badgeButtonState.left && (
            <MdKeyboardArrowLeft
              size={30}
              onClick={badgeSliderHandler.bind(null, {
                slideType: SlideType.LEFT,
                slideLength: 200,
              })}
              className={`${styles.badgeArrow} ${styles.badgeLeft}`}
            />
          )}
          <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
            <div className={styles.badges} ref={badgeRef}>
              {badges.map((badge) => (
                <Badge
                  key={badge.id}
                  onClick={badgeSelectHandler.bind(null, badge)}
                  value={badge.title}
                  selected={badge.selected}
                />
              ))}
            </div>
          </div>
          {badgeButtonState.right && (
            <MdKeyboardArrowRight
              onClick={badgeSliderHandler.bind(null, {
                slideType: SlideType.RIGHT,
                slideLength: 200,
              })}
              size={30}
              className={`${styles.badgeArrow} ${styles.badgeRigth}`}
            />
          )}
        </div>
        <div className={styles.slider}>
          {tourList.length > 0 && cardsButtonState.left && (
            <MdKeyboardArrowLeft
              size={30}
              onClick={cardsSliderHandler.bind(null, {
                slideType: SlideType.LEFT,
                slideLength: 280,
              })}
              className={`${styles.arrow} ${styles.leftButton}`}
            />
          )}
          <div className={styles.cards} ref={cardsRef}>
            {tourList &&
              tourList.map((tour, idx) => {
                return (
                  <TourCard
                    key={idx}
                    tour={tour}
                    cardSelectHandler={cardSelectHandler}
                  />
                );
              })}
          </div>
          {tourList.length > 0 && cardsButtonState.right && (
            <MdKeyboardArrowRight
              onClick={cardsSliderHandler.bind(null, {
                slideType: SlideType.RIGHT,
                slideLength: 280,
              })}
              size={30}
              className={`${styles.arrow} ${styles.rightButton}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SlideType = {
  LEFT: "left",
  RIGHT: "right",
  RESET: "reset",
};

type UseSlideReturn = [
  buttonState: {
    left: boolean;
    right: boolean;
  },
  sliderHandler: (slide: { slideType: string; slideLength: number }) => void
];

const useSlide = (ref: MutableRefObject<HTMLDivElement>): UseSlideReturn => {
  const [xPos, setXPos] = useState(0);
  const [buttonState, setButtonState] = useState<{
    left: boolean;
    right: boolean;
  }>({
    left: false,
    right: true,
  });
  const sliderHandler = (slide: { slideType: string; slideLength: number }) => {
    const { slideType, slideLength } = slide;

    if (slideType === SlideType.RESET) {
      ref.current.style.transform = `translate(0px)`;
      setXPos(0);
      setButtonState({ left: false, right: true });
      return;
    }
    const offset = ref.current.offsetWidth;
    const newPosition =
      slideType === SlideType.LEFT
        ? xPos - (slideLength + 17)
        : xPos + (slideLength + 17);
    if (newPosition >= offset - slideLength - 100) {
      setButtonState({
        left: true,
        right: false,
      });
    } else if (newPosition < 100) {
      setButtonState({
        left: false,
        right: true,
      });
    } else {
      setButtonState({
        left: true,
        right: true,
      });
    }
    setXPos(newPosition);
    ref.current.style.transform = `translate(${-newPosition}px)`;
  };
  return [buttonState, sliderHandler];
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
