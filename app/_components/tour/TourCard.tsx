"use client";

import Image from "next/image";
import styles from "./TourCard.module.css";

interface TourCardProps {
  key: number;
  tour: {
    title: string;
    location: string;
    image: string;
  };
  cardSelectHandler: (tour: {
    title: string;
    location: string;
    image: string;
  }) => void;
}

const TourCard = ({ key, tour, cardSelectHandler }: TourCardProps) => {
  return (
    <div key={key} className={styles.card} onClick={cardSelectHandler.bind(null, tour)}>
      <div className={styles.graphic}>
        <Image
          className={styles.image}
          src={tour.image}
          fill
          alt="여행지 이미지"
        />
      </div>
      <div className={styles.des}>
        <p className={styles.title}>{tour.title}</p>
        <p className={styles.location}>{tour.location}</p>
      </div>
    </div>
  );
};

export default TourCard;
