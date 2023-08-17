"use client";

import { useRef, useState, MutableRefObject } from "react";
import { getXY } from "../searchWeather/SearchSection";
import styles from "./Tour.module.css";
import TourCard from "./TourCard";
import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";
import useCoords from "../../_hooks/useCoords";
import { useAppDispatch } from "../../_hooks/redux_hooks";

interface TourProps {
  tourList: { title: string; location: string; image: string }[];
}

const Tour = ({ tourList }: TourProps) => {
  const dispatch = useAppDispatch();
  const [buttonState, cardsRef, slideHandler] = useSlide();
  const cardSelectHandler = (tour: {
    title: string;
    location: string;
    image: string;
  }) => {
    locationSelectHandler(tour, dispatch);
  };
  return (
    <div className={styles.tour}>
      <div className={styles.header}>
        <h3>여행지 추천</h3>
      </div>
      <div className={styles.body}>
        <div className={styles.slider}>
          {buttonState.left && (
            <MdKeyboardArrowLeft
              size={30}
              onClick={slideHandler.bind(null, slideType.LEFT)}
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
          {buttonState.right && (
            <MdKeyboardArrowRight
              onClick={slideHandler.bind(null, slideType.RIGHT)}
              size={30}
              className={`${styles.arrow} ${styles.rightButton}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const slideType = {
  LEFT: "left",
  RIGHT: "right",
};

type UseSlideReturn = [
  buttonState: {
    left: boolean;
    right: boolean;
  },
  cardsRef: MutableRefObject<HTMLDivElement>,
  slideHandler: (slideType: string) => void
];

const useSlide = (): UseSlideReturn => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [xPos, setXPos] = useState(0);
  const [buttonState, setButtonState] = useState<{
    left: boolean;
    right: boolean;
  }>({
    left: false,
    right: true,
  });

  const slideHandler = (slideType: string) => {
    const newPosition =
      slideType === "left" ? xPos - (280 + 17) : xPos + (280 + 17);

    setXPos(newPosition);
    if (newPosition > 600) {
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
    cardsRef.current.style.transform = `translate(${-newPosition}px)`;
  };
  return [buttonState, cardsRef, slideHandler];
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
